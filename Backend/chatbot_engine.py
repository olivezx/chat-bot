"""
=============================================================================
Projeto: 01 — Chatbot de Suporte Full-Stack (AfesuTech)
Camada: Camada 2 — Inteligência Artificial & PLN (AI Engine)
Arquivo: backend/chatbot_engine.py
Descrição: Motor de IA e Processamento de Linguagem Natural (PLN) com suporte
           a RAG (Retrieval-Augmented Generation), orquestração de LLM (Groq
           com Llama-3), ancoragem temporal, motor léxico offline e gestão
           completa de métricas e feedback.
=============================================================================
"""

import os
import sys
import json
import re
import uuid
import unicodedata
import urllib.request
import urllib.error
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple

# Garante saída UTF-8 no console Windows
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass


def load_env_file(filepath: Optional[str] = None) -> None:
    """
    Carrega variáveis de ambiente de um arquivo .env sem necessidade de dependências externas.
    Procura automaticamente na pasta do script, na raiz do projeto ou no caminho informado.
    """
    candidates = []
    if filepath:
        candidates.append(filepath)
    else:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        candidates.extend([
            os.path.join(current_dir, ".env"),
            os.path.join(current_dir, "..", ".env"),
            os.path.join(os.getcwd(), ".env")
        ])

    for env_path in candidates:
        if os.path.isfile(env_path):
            try:
                with open(env_path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            key, val = line.split("=", 1)
                            key = key.strip()
                            val = val.strip().strip("'\"")
                            if key and key not in os.environ:
                                os.environ[key] = val
                break
            except Exception as e:
                print(f"[ChatbotEngine] Aviso ao ler .env: {e}")


class ChatbotEngine:
    """
    Motor central de Inteligência Artificial para o Chatbot da AfesuTech.
    
    Funcionalidades principais:
    1. Carregamento e indexação da Base de Conhecimento JSON (RAG).
    2. Conexão com Groq API (Llama-3) via requisições HTTP nativas (urllib).
    3. Ancoragem temporal automática (data e hora reais em português).
    4. Histórico multi-turn de conversação.
    5. Motor Léxico e Semântico com fallback offline inteligente.
    6. Gestão de métricas e registro de feedback dos usuários.
    """

    DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile"
    GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

    # Stopwords comuns da língua portuguesa para o motor léxico
    STOPWORDS_PT = {
        "a", "à", "adeus", "agora", "ai", "ainda", "alem", "algo", "alguem", "algum", 
        "alguma", "algumas", "alguns", "ali", "ampla", "amplas", "amplo", "amplos", 
        "ano", "anos", "ante", "antes", "ao", "aos", "apenas", "apoio", "apos", 
        "aquele", "aqueles", "aquela", "aquelas", "aquilo", "as", "às", "assim", 
        "ate", "até", "atraves", "bom", "boa", "boas", "bons", "breve", "ca", "cada", 
        "catorze", "cedo", "cento", "certamente", "certeza", "cima", "cinco", "coisa", 
        "coisas", "com", "como", "conselho", "contra", "contudo", "custa", "da", "dado", 
        "dados", "daquela", "daquelas", "daquele", "daqueles", "dar", "das", "de", 
        "debaixo", "dela", "delas", "dele", "deles", "demais", "depois", "desde", 
        "dessa", "dessas", "desse", "desses", "desta", "destas", "deste", "destes", 
        "deve", "devem", "deveria", "dez", "dezanove", "dezesseis", "dezessete", 
        "dezoito", "dia", "dias", "diante", "diz", "dizem", "dizer", "do", "dois", 
        "dos", "doze", "duas", "duvida", "e", "é", "ela", "elas", "ele", "eles", 
        "em", "embora", "enquanto", "entao", "então", "entre", "era", "eram", "eramos", 
        "essa", "essas", "esse", "esses", "esta", "está", "estamos", "estao", "estão", 
        "estas", "estava", "estavam", "estavamos", "este", "estes", "esteve", "estive", 
        "estivemos", "estiveram", "estiveste", "estiver", "estou", "eu", "exemplo", 
        "falta", "favor", "faz", "fazeis", "fazem", "fazemos", "fazer", "fazes", 
        "fez", "fim", "final", "foi", "fomos", "for", "fora", "foram", "forma", 
        "foste", "fostes", "fui", "geral", "grande", "grandes", "grupo", "ha", "há", 
        "haja", "hajam", "hajamos", "havemos", "havia", "hei", "hoje", "hora", "horas", 
        "houve", "houvemos", "houveram", "ia", "igual", "inclusive", "iniciar", 
        "inicio", "ir", "ira", "irá", "isso", "isto", "ja", "já", "jamais", "junto", 
        "lhe", "lhes", "local", "logo", "longe", "lugar", "maior", "maioria", "mais", 
        "mal", "mas", "maximo", "me", "medio", "menor", "menos", "mes", "meses", 
        "mesma", "mesmas", "mesmo", "mesmos", "meu", "meus", "mil", "minha", "minhas", 
        "momento", "muito", "muitos", "muita", "muitas", "na", "nada", "nao", "não", 
        "naquela", "naquelas", "naquele", "naqueles", "nas", "nem", "nenhum", "nenhuma", 
        "nessa", "nessas", "nesse", "nesses", "nesta", "nestas", "neste", "nestes", 
        "no", "noite", "nome", "nos", "nós", "nossa", "nossas", "nosso", "nossos", 
        "nova", "novas", "nove", "novo", "novos", "num", "numa", "numero", "nunca", 
        "o", "obra", "obrigada", "obrigado", "oitavo", "oito", "onde", "ontem", "onze", 
        "os", "ou", "outra", "outras", "outro", "outros", "para", "parece", "parte", 
        "partir", "paucas", "pela", "pelas", "pelo", "pelos", "pequena", "pequenas", 
        "pequeno", "pequenos", "perto", "pode", "podem", "podendo", "poder", "poderia", 
        "poderiam", "podia", "podiam", "pois", "ponto", "pontos", "por", "porque", 
        "porquê", "porquanto", "posicao", "possa", "possam", "possivel", "posso", 
        "pouco", "poucos", "primeira", "primeiras", "primeiro", "primeiros", "propria", 
        "proprias", "proprio", "proprios", "quais", "qual", "qualquer", "quando", 
        "quanto", "quantos", "quarta", "quarto", "quase", "quatro", "que", "quem", 
        "quer", "quereis", "querem", "queremas", "queres", "quero", "questao", "quinta", 
        "quinto", "quinze", "sabe", "sabem", "saber", "sao", "são", "se", "segunda", 
        "segundo", "sei", "seis", "sem", "sempre", "sendo", "ser", "sera", "será", 
        "serao", "serão", "seria", "seriam", "sete", "setimo", "seu", "seus", "sexta", 
        "sexto", "si", "sido", "silencio", "sob", "sobre", "so", "só", "sob", "sobre", 
        "socorro", "somos", "sou", "sua", "suas", "tal", "talvez", "tambem", "também", 
        "tanta", "tantas", "tanto", "tantos", "tarde", "te", "tem", "têm", "temos", 
        "tendes", "tenha", "tenham", "tenhamos", "tenho", "tens", "ter", "tera", "terá", 
        "terao", "terão", "terceira", "terceiro", "teria", "teriam", "teu", "teus", 
        "teve", "ti", "tido", "tinha", "tinham", "tinhamos", "tive", "tivemos", 
        "tiveram", "tiveste", "tivestes", "toda", "todas", "todavia", "todo", "todos", 
        "trabalho", "tres", "três", "treze", "tu", "tua", "tuas", "tudo", "ultimo", 
        "um", "uma", "umas", "uns", "vai", "vais", "vao", "vão", "varios", "vem", 
        "veem", "vendo", "vens", "ver", "vez", "vezes", "viagem", "vindo", "vinte", 
        "voce", "você", "voces", "vocês", "vos", "vós", "vossa", "vossas", "vosso", 
        "vossos"
    }

    # Padrões de saudações e despedidas
    GREETING_PATTERNS = [
        "ola", "olá", "oi", "oie", "bom dia", "boa tarde", "boa noite", 
        "e ai", "e aí", "opa", "hello", "hi", "hey", "fala ai", "fala aí"
    ]

    GRATITUDE_PATTERNS = [
        "obrigado", "obrigada", "valeu", "valeu mesmo", "agradecido", "agradecida", 
        "muito obrigado", "muito obrigada", "perfeito", "otimo", "ótimo", "show", "maravilha", "top", "legal", "arrasou"
    ]

    FAREWELL_PATTERNS = [
        "tchau", "adeus", "ate logo", "até logo", "ate mais", "até mais", "falou", "boa noite", "bom descanso"
    ]

    def __init__(self, knowledge_base_path: Optional[str] = None, api_key: Optional[str] = None, model: Optional[str] = None):
        """
        Inicializa o motor do chatbot carregando configurações, base de dados e métricas.
        """
        # Carrega variáveis do .env caso existam
        load_env_file()

        # Configurações da LLM
        self.api_key = api_key or os.getenv("GROQ_API_KEY", "").strip()
        self.model = model or os.getenv("GROQ_MODEL", self.DEFAULT_GROQ_MODEL).strip()

        # Histórico de conversação multi-turn (mensagens no formato OpenAI)
        self.conversation_history: List[Dict[str, str]] = []
        self.max_history_turns = 10  # Mantém até 10 turnos recentes

        # Carregamento da base de conhecimento
        self.knowledge_base_path = knowledge_base_path
        self.knowledge_base: Dict[str, Any] = self._load_knowledge_base(knowledge_base_path)

        # Gestão de Métricas
        self.metrics: Dict[str, int] = {
            "total_messages": 0,
            "resolved_by_llm": 0,
            "resolved_by_knowledge_base": 0,
            "greetings": 0,
            "fallback_responses": 0,
            "positive_feedbacks": 0,
            "negative_feedbacks": 0
        }

        # Registro de feedbacks por ID de mensagem
        self.feedback_records: Dict[str, bool] = {}

    # =========================================================================
    # 1. Carregamento da Base de Conhecimento
    # =========================================================================

    def _load_knowledge_base(self, custom_path: Optional[str] = None) -> Dict[str, Any]:
        """
        Carrega o arquivo JSON da base de conhecimento com tratamento de caminhos relativos.
        """
        candidates = []
        if custom_path:
            candidates.append(custom_path)
        
        current_dir = os.path.dirname(os.path.abspath(__file__))
        candidates.extend([
            os.path.join(current_dir, "base_conhecimento.json"),
            os.path.join(current_dir, "..", "Backend", "base_conhecimento.json"),
            os.path.join(os.getcwd(), "base_conhecimento.json"),
            os.path.join(os.getcwd(), "Backend", "base_conhecimento.json"),
            os.path.join(os.getcwd(), "backend", "base_conhecimento.json")
        ])

        for path in candidates:
            if os.path.isfile(path):
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        return data
                except Exception as e:
                    print(f"[ChatbotEngine] Erro ao decodificar '{path}': {e}")

        # Fallback estrutural caso o arquivo não seja localizado
        print("[ChatbotEngine] Aviso: 'base_conhecimento.json' não foi encontrado. Utilizando base mínima.")
        return {
            "empresa": "AfesuTech Soluções Inteligentes",
            "descricao": "Plataforma de IA Generativa e atendimento inteligente.",
            "topicos": [],
            "faq_rapido": []
        }

    # =========================================================================
    # 2. Orquestração da LLM Generativa (Groq / Llama-3 com Ancoragem Temporal)
    # =========================================================================

    def _get_current_date_pt_br(self) -> str:
        """
        Retorna a data e dia da semana atuais formatados por extenso em português do Brasil.
        """
        now = datetime.now()
        dias_semana = [
            "segunda-feira", "terça-feira", "quarta-feira", 
            "quinta-feira", "sexta-feira", "sábado", "domingo"
        ]
        meses = [
            "janeiro", "fevereiro", "março", "abril", "maio", "junho",
            "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
        ]
        dia_sem = dias_semana[now.weekday()]
        mes = meses[now.month - 1]
        return f"{dia_sem}, {now.day} de {mes} de {now.year}"

    def _build_system_prompt(self) -> str:
        """
        Constrói o Prompt de Sistema com ancoragem temporal, persona oficial da AfesuTech
        e injeção de contexto factual da Base de Conhecimento (RAG).
        """
        empresa = self.knowledge_base.get("empresa", "AfesuTech Soluções Inteligentes")
        descricao = self.knowledge_base.get("descricao", "")
        topicos = self.knowledge_base.get("topicos", [])
        data_atual = self._get_current_date_pt_br()

        # Formatação do contexto RAG
        contexto_topicos = []
        for topico in topicos:
            topico_id = topico.get("id", "")
            perguntas = ", ".join(f'"{p}"' for p in topico.get("perguntas_chave", []))
            resposta = topico.get("resposta", "")
            contexto_topicos.append(
                f"### Tópico: [{topico_id.upper()}]\n"
                f"- Perguntas associadas: {perguntas}\n"
                f"- Conteúdo Oficial e Detalhes:\n{resposta}\n"
            )
        
        base_rag_texto = "\n".join(contexto_topicos)

        prompt = f"""Você é o Assistente Virtual Oficial de Atendimento e Suporte da empresa {empresa}.

=== ANCORAGEM TEMPORAL E DIRETRIZES GERAIS ===
- Data atual real: {data_atual}.
- Sobre a empresa: {descricao}
- Idioma de resposta: Português do Brasil (PT-BR).

=== BASE DE CONHECIMENTO OFICIAL (RAG - FACTUAL TRUTH) ===
{base_rag_texto}

=== INSTRUÇÕES DE COMPORTAMENTO E FORMATO ===
1. Responda com clareza, simpatia, precisão e profissionalismo.
2. Utilize formatação Markdown rica (negrito, listas com marcadores, destaques e emojis adequados).
3. Baseie suas respostas estritamente nas informações da base de conhecimento acima.
4. Se o usuário fizer uma pergunta fora do escopo ou de dados não disponíveis, oriente-o gentilmente a entrar em contato com o Suporte Oficial pelo e-mail suporte@afesutech.com ou pelos canais de atendimento da plataforma.
5. Mantenha as respostas concisas, diretas e úteis, sem prolixidade excessiva.
6. Nunca invente dados comerciais, preços ou funcionalidades não mencionados na base oficial."""
        
        return prompt

    def _call_groq_llm(self, user_message: str) -> Optional[str]:
        """
        Executa uma requisição HTTP para a API da Groq (Llama-3) via urllib sem dependências externas.
        Mantém o histórico multi-turn da conversa.
        """
        if not self.api_key:
            return None

        # Monta a lista de mensagens para o endpoint da Groq
        messages = [{"role": "system", "content": self._build_system_prompt()}]

        # Adiciona histórico multi-turn recente
        messages.extend(self.conversation_history[-self.max_history_turns:])

        # Adiciona a mensagem atual do usuário
        messages.append({"role": "user", "content": user_message})

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.4,
            "max_tokens": 1024,
            "top_p": 0.9
        }

        json_data = json.dumps(payload).encode("utf-8")
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
            "User-Agent": "AfesuTech-ChatbotEngine/1.0"
        }

        req = urllib.request.Request(self.GROQ_API_URL, data=json_data, headers=headers, method="POST")

        try:
            with urllib.request.urlopen(req, timeout=15) as response:
                if response.status == 200:
                    resp_body = response.read().decode("utf-8")
                    resp_json = json.loads(resp_body)
                    
                    choices = resp_json.get("choices", [])
                    if choices:
                        bot_reply = choices[0].get("message", {}).get("content", "").strip()
                        
                        # Atualiza histórico multi-turn
                        self.conversation_history.append({"role": "user", "content": user_message})
                        self.conversation_history.append({"role": "assistant", "content": bot_reply})
                        
                        return bot_reply
        except urllib.error.HTTPError as e:
            error_msg = e.read().decode("utf-8", errors="ignore")
            print(f"[ChatbotEngine] Erro HTTP da Groq API ({e.code}): {error_msg}")
        except urllib.error.URLError as e:
            print(f"[ChatbotEngine] Erro de conexão com a Groq API: {e.reason}")
        except Exception as e:
            print(f"[ChatbotEngine] Exceção inesperada na chamada da LLM: {e}")

        return None

    # =========================================================================
    # 3. Motor Léxico e Fallback Offline
    # =========================================================================

    def _normalize_string(self, text: str) -> str:
        """
        Remove acentos e caracteres especiais para comparação flexível de strings.
        """
        nfkd = unicodedata.normalize("NFKD", text)
        return "".join(c for c in nfkd if not unicodedata.combining(c))

    def _preprocess_text(self, text: str) -> List[str]:
        """
        Pré-processa o texto: converte para minúsculas, remove pontuação, normaliza acentos
        e remove stopwords em português.
        """
        if not text:
            return []

        # Converte para minúsculas e remove acentuação
        cleaned = self._normalize_string(text.lower())

        # Remove pontuações e símbolos não alfanuméricos
        cleaned = re.sub(r"[^\w\s]", " ", cleaned)

        # Tokenização simples por espaço
        tokens = cleaned.split()

        # Filtragem de stopwords e tokens muito curtos (1 caractere)
        filtered_tokens = [
            token for token in tokens
            if token not in self.STOPWORDS_PT and len(token) > 1
        ]

        return filtered_tokens

    def _calculate_similarity(self, query_tokens: List[str], target_phrase: str) -> float:
        """
        Calcula a similaridade léxica através da taxa de sobreposição de termos (Jaccard / Dice).
        """
        if not query_tokens:
            return 0.0

        target_tokens = self._preprocess_text(target_phrase)
        if not target_tokens:
            return 0.0

        set_query = set(query_tokens)
        set_target = set(target_tokens)

        intersection = set_query.intersection(set_target)
        if not intersection:
            return 0.0

        # Coeficiente Dice ponderado para priorizar termos da pergunta
        overlap_score = (2.0 * len(intersection)) / (len(set_query) + len(set_target))

        # Bônus se houver casamento exato de subsequência
        normalized_query = " ".join(query_tokens)
        normalized_target = " ".join(target_tokens)
        if normalized_query in normalized_target or normalized_target in normalized_query:
            overlap_score = min(1.0, overlap_score + 0.3)

        return overlap_score

    def _is_greeting(self, text: str) -> bool:
        """
        Detecta se a mensagem do usuário é uma saudação inicial.
        """
        normalized = self._normalize_string(text.strip().lower())
        cleaned = re.sub(r"[^\w\s]", "", normalized)
        
        for pattern in self.GREETING_PATTERNS:
            norm_pattern = self._normalize_string(pattern)
            if cleaned == norm_pattern or cleaned.startswith(norm_pattern + " ") or cleaned.endswith(" " + norm_pattern):
                return True
        return False

    def _is_gratitude(self, text: str) -> bool:
        """
        Detecta mensagens de agradecimento ou elogio.
        """
        normalized = self._normalize_string(text.strip().lower())
        cleaned = re.sub(r"[^\w\s]", "", normalized)
        for pattern in self.GRATITUDE_PATTERNS:
            norm_pattern = self._normalize_string(pattern)
            if norm_pattern in cleaned.split() or cleaned == norm_pattern:
                return True
        return False

    def _is_farewell(self, text: str) -> bool:
        """
        Detecta mensagens de encerramento ou despedida.
        """
        normalized = self._normalize_string(text.strip().lower())
        cleaned = re.sub(r"[^\w\s]", "", normalized)
        for pattern in self.FAREWELL_PATTERNS:
            norm_pattern = self._normalize_string(pattern)
            if norm_pattern in cleaned:
                return True
        return False

    def _get_greeting_response(self) -> str:
        """
        Gera uma resposta acolhedora de saudação apresentando os tópicos rápidos.
        """
        empresa = self.knowledge_base.get("empresa", "MY PIERCE — Piercing Match & Guia de Estilo")
        faq_sugestoes = self.knowledge_base.get("faq_rapido", [])

        sugestoes_md = ""
        if faq_sugestoes:
            sugestoes_md = "\n\n💡 **Dúvidas frequentes que posso esclarecer agora:**\n" + "\n".join(
                f"- *{faq}*" for faq in faq_sugestoes
            )

        return (
            f"✨ **Olá! Seja muito bem-vindo(a) ao {empresa}!**\n\n"
            f"Eu sou sua consultora virtual de estilo e cuidados com piercings e joias. Como posso te encantar hoje?"
            f"{sugestoes_md}\n\n"
            f"Digite sua dúvida ou selecione um dos temas acima para conversarmos! 😊"
        )

    def _find_best_topic(self, user_message: str, threshold: float = 0.12) -> Tuple[Optional[Dict[str, Any]], float]:
        """
        Busca o tópico mais adequado na Base de Conhecimento através de indexação léxica e semântica expandida.
        """
        query_tokens = self._preprocess_text(user_message)
        if not query_tokens:
            return None, 0.0

        best_topic: Optional[Dict[str, Any]] = None
        highest_score = 0.0

        for topico in self.knowledge_base.get("topicos", []):
            topic_id = topico.get("id", "").replace("_", " ")
            perguntas_chave = topico.get("perguntas_chave", [])
            resposta = topico.get("resposta", "")
            
            # 1. Testa similaridade com o ID do tópico (peso 1.2)
            score_id = self._calculate_similarity(query_tokens, topic_id) * 1.2
            if score_id > highest_score:
                highest_score = score_id
                best_topic = topico

            # 2. Testa similaridade com cada pergunta-chave cadastrada (peso 1.5)
            for pergunta in perguntas_chave:
                score = self._calculate_similarity(query_tokens, pergunta) * 1.5
                if score > highest_score:
                    highest_score = score
                    best_topic = topico

            # 3. Testa sobreposição direta com o corpo da resposta como apoio
            resposta_tokens = set(self._preprocess_text(resposta))
            if resposta_tokens:
                common_tokens = set(query_tokens).intersection(resposta_tokens)
                if common_tokens:
                    # Coeficiente Jaccard com peso moderado para não sobrepor perguntas diretas
                    content_score = len(common_tokens) / (len(set(query_tokens)) + len(resposta_tokens) * 0.05)
                    if content_score > highest_score:
                        highest_score = content_score
                        best_topic = topico

        if highest_score >= threshold:
            return best_topic, highest_score
        
        return None, highest_score

    def _generate_fallback_response(self, user_message: str) -> str:
        """
        Gera uma resposta consultiva inteligente de curadoria e direcionamento quando a dúvida for aberta.
        """
        empresa = self.knowledge_base.get("empresa", "MY PIERCE")
        faq = self.knowledge_base.get("faq_rapido", [])

        faq_texto = ""
        if faq:
            faq_texto = "\n\n💡 **Sugestões de temas que domino com precisão:**\n" + "\n".join(
                f"- {item}" for item in faq
            )

        return (
            f"💎 **Aqui no {empresa}, sou especialista em curadoria de estilo, perfurações e joias finas!**\n\n"
            f"Posso te orientar sobre **materiais hipoalergênicos** (como Titânio ASTM F-136 e Ouro 18k), "
            f"**tempos de cicatrização e assepsia**, além de recomendações para cada região da orelha "
            f"(*Helix, Flat, Conch, Tragus, Daith, Rook, Lóbulo e Septo*).{faq_texto}\n\n"
            f"✨ Se você deseja uma consultoria presencial ou avaliação anatômica específica, recomendamos sempre agendar com um body piercer profissional qualificado!"
        )

    # =========================================================================
    # 4. Fluxo Principal de Processamento & Gestão de Métricas
    # =========================================================================

    def process_message(self, user_message: str) -> Dict[str, Any]:
        """
        Processa a mensagem do usuário executando o pipeline:
        1. Validação de mensagem vazia
        2. Detecção de Saudação, Agradecimento e Despedida
        3. Tentativa com LLM Generativa (Groq Llama-3)
        4. Fallback Léxico / RAG na Base de Conhecimento
        5. Fallback Padrão Amigável Consultivo
        """
        self.metrics["total_messages"] += 1
        message_id = str(uuid.uuid4())
        user_message_clean = user_message.strip()

        if not user_message_clean:
            return {
                "message_id": message_id,
                "response": "Por favor, digite uma mensagem para que eu possa te ajudar! 😊",
                "source": "empty",
                "timestamp": datetime.now().isoformat(),
                "suggestions": self.knowledge_base.get("faq_rapido", [])
            }

        # 1. Tratamento de Saudações Curtas
        if self._is_greeting(user_message_clean) and len(user_message_clean.split()) <= 4:
            self.metrics["greetings"] += 1
            return {
                "message_id": message_id,
                "response": self._get_greeting_response(),
                "source": "greeting",
                "timestamp": datetime.now().isoformat(),
                "suggestions": self.knowledge_base.get("faq_rapido", [])
            }

        # 2. Tratamento de Agradecimento e Elogio
        if self._is_gratitude(user_message_clean) and len(user_message_clean.split()) <= 4:
            return {
                "message_id": message_id,
                "response": "✨ **Por nada! Fico muito feliz em ajudar!** 💖 Se precisar de mais dicas de estilo, cuidados ou combinações de joias, é só chamar!",
                "source": "greeting",
                "timestamp": datetime.now().isoformat(),
                "suggestions": self.knowledge_base.get("faq_rapido", [])
            }

        # 3. Tratamento de Despedida
        if self._is_farewell(user_message_clean) and len(user_message_clean.split()) <= 4:
            return {
                "message_id": message_id,
                "response": "👋 **Até breve!** Cuide bem das suas joias e piercings com muito brilho e carinho. Sempre que quiser bater um papo sobre estilo, estarei por aqui! ✨",
                "source": "greeting",
                "timestamp": datetime.now().isoformat(),
                "suggestions": self.knowledge_base.get("faq_rapido", [])
            }

        # 4. Tentativa com LLM Generativa (se API Key e modelo estiverem ativos)
        if self.api_key:
            llm_response = self._call_groq_llm(user_message_clean)
            if llm_response:
                self.metrics["resolved_by_llm"] += 1
                return {
                    "message_id": message_id,
                    "response": llm_response,
                    "source": "llm",
                    "model": self.model,
                    "timestamp": datetime.now().isoformat(),
                    "suggestions": self.knowledge_base.get("faq_rapido", [])
                }

        # 5. Motor Léxico / RAG Expandido na Base de Conhecimento
        best_topic, confidence = self._find_best_topic(user_message_clean)
        if best_topic:
            self.metrics["resolved_by_knowledge_base"] += 1
            return {
                "message_id": message_id,
                "response": best_topic.get("resposta", ""),
                "source": "knowledge_base",
                "topic_id": best_topic.get("id"),
                "confidence": round(confidence, 2),
                "timestamp": datetime.now().isoformat(),
                "suggestions": self.knowledge_base.get("faq_rapido", [])
            }

        # 6. Resposta Consultiva (Fallback Inteligente)
        self.metrics["fallback_responses"] += 1
        return {
            "message_id": message_id,
            "response": self._generate_fallback_response(user_message_clean),
            "source": "fallback",
            "timestamp": datetime.now().isoformat(),
            "suggestions": self.knowledge_base.get("faq_rapido", [])
        }

    def register_feedback(self, message_id: str, is_positive: bool) -> Dict[str, Any]:
        """
        Registra feedback positivo (+1) ou negativo (-1) para uma mensagem respondida.
        """
        self.feedback_records[message_id] = is_positive
        if is_positive:
            self.metrics["positive_feedbacks"] += 1
        else:
            self.metrics["negative_feedbacks"] += 1

        return {
            "status": "success",
            "message_id": message_id,
            "feedback": "positivo" if is_positive else "negativo",
            "metrics": self.get_metrics()
        }

    def get_metrics(self) -> Dict[str, Any]:
        """
        Retorna as métricas operacionais do motor do chatbot.
        """
        return dict(self.metrics)

    def reset_history(self) -> None:
        """
        Limpa o histórico de conversação multi-turn.
        """
        self.conversation_history.clear()


# =============================================================================
# Bloco de Demonstração e Testes Locais
# =============================================================================
if __name__ == "__main__":
    print("=" * 70)
    print("🚀 Inicializando AfesuTech Chatbot Engine (Teste de Execução)...")
    print("=" * 70)

    engine = ChatbotEngine()
    print(f"🏢 Empresa Carregada: {engine.knowledge_base.get('empresa')}")
    print(f"📚 Tópicos na Base: {len(engine.knowledge_base.get('topicos', []))}")
    print(f"🔑 Chave Groq Configurada: {'Sim' if engine.api_key else 'Não (Modo Offline Léxico)'}")
    print(f"🧠 Modelo: {engine.model}")
    print("-" * 70)

    # Lista de testes simulados
    test_queries = [
        "Olá, bom dia!",
        "Quais são os planos e preços?",
        "Como funciona a IA com voz e RAG?",
        "Como integrar a API de vocês com Python?",
        "Qual o horário de atendimento do suporte?",
        "Como faço para cancelar minha assinatura e pedir reembolso?",
        "Vocês vendem passagens aéreas para Marte?"  # Teste de Fallback
    ]

    for query in test_queries:
        print(f"\n👤 Usuário: {query}")
        result = engine.process_message(query)
        print(f"🤖 Bot [{result['source'].upper()}]:")
        print(result["response"])
        
        # Simula feedback positivo
        engine.register_feedback(result["message_id"], is_positive=True)

    print("\n" + "=" * 70)
    print("📊 Métricas Finais de Execução:")
    print(json.dumps(engine.get_metrics(), indent=2, ensure_ascii=False))
    print("=" * 70)
