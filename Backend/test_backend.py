"""
=============================================================================
Projeto: 01 — Chatbot de Suporte Full-Stack (AfesuTech)
Camada: Camada 2/3 — Validação & Qualidade de Software
Arquivo: backend/test_backend.py
Descrição: Script de testes automatizados no terminal para validar o motor
           de IA (ChatbotEngine), cobrindo saudações, consultas na base
           de conhecimento (RAG) e dúvidas sobre integrações.
=============================================================================
"""

import os
import sys
import time
from typing import Dict, Any

# Garante que o diretório backend esteja no caminho de importação
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from chatbot_engine import ChatbotEngine, load_env_file

# Força codificação UTF-8 no console Windows
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass


def print_divider(char: str = "=", length: int = 75) -> None:
    print(char * length)


def run_automated_backend_tests() -> bool:
    """
    Executa a bateria de testes automatizados do ChatbotEngine.
    Retorna True se todos os testes passarem com sucesso.
    """
    load_env_file()

    print_divider("=")
    print("🧪 AFESUTECH — SUÍTE DE TESTES AUTOMATIZADOS DO BACKEND")
    print_divider("=")

    # 1. Inicialização do Motor
    print("\n[1/4] 🚀 Inicializando ChatbotEngine...")
    start_time = time.time()
    engine = ChatbotEngine()
    init_time = (time.time() - start_time) * 1000

    empresa = engine.knowledge_base.get("empresa", "N/A")
    total_topicos = len(engine.knowledge_base.get("topicos", []))
    tem_chave_llm = bool(engine.api_key)
    modelo_llm = engine.model

    print(f"      • Empresa Carregada: {empresa}")
    print(f"      • Tópicos na Base de Conhecimento: {total_topicos}")
    print(f"      • Status da LLM: {'Online (Chave Configurada)' if tem_chave_llm else 'Offline (Modo Léxico / RAG Local)'}")
    print(f"      • Modelo Configurado: {modelo_llm}")
    print(f"      • Tempo de Inicialização: {init_time:.2f}ms")
    print("      STATUS: [OK] Motor inicializado com sucesso.")

    test_results = []

    # 2. Cenário 1: Saudação do Usuário
    print("\n" + "-" * 75)
    print("[2/4] 💬 Teste 1: Saudação do Usuário")
    pergunta_1 = "Olá, tudo bem?"
    print(f"      Entrada: \"{pergunta_1}\"")
    
    res_1 = engine.process_message(pergunta_1)
    conf_1 = res_1.get("confidence", 1.0)
    source_1 = res_1.get("source", "unknown")
    reply_1 = res_1.get("response", "")

    print(f"      • Origem: {source_1.upper()}")
    print(f"      • Confiança: {conf_1:.2f}")
    print(f"      • Resposta Obtida (trecho):\n        {reply_1[:140].replace('\n', ' ')}...")

    # Validação do Teste 1
    t1_pass = (
        source_1 in ("greeting", "llm", "knowledge_base") and
        len(reply_1.strip()) > 10 and
        ("olá" in reply_1.lower() or "bem-vindo" in reply_1.lower() or "ajudar" in reply_1.lower())
    )
    if t1_pass:
        print("      RESULTADO: [OK] Teste de saudação aprovado.")
        test_results.append(("Saudação do Usuário", True))
    else:
        print("      RESULTADO: [FALHA] Resposta de saudação inesperada.")
        test_results.append(("Saudação do Usuário", False))

    # 3. Cenário 2: Pergunta existente na Base de Conhecimento (Planos e Preços)
    print("\n" + "-" * 75)
    print("[3/4] 💳 Teste 2: Pergunta existente na Base de Conhecimento (Planos e Preços)")
    pergunta_2 = "Quais são os planos e preços?"
    print(f"      Entrada: \"{pergunta_2}\"")

    res_2 = engine.process_message(pergunta_2)
    conf_2 = res_2.get("confidence", 0.95 if res_2.get("source") == "llm" else 0.85)
    source_2 = res_2.get("source", "unknown")
    reply_2 = res_2.get("response", "")

    print(f"      • Origem: {source_2.upper()}")
    print(f"      • Confiança: {conf_2:.2f}")
    print(f"      • Resposta Obtida (trecho):\n        {reply_2[:140].replace('\n', ' ')}...")

    # Validação do Teste 2
    t2_pass = (
        source_2 in ("knowledge_base", "llm") and
        len(reply_2.strip()) > 20 and
        any(termo in reply_2.lower() for termo in ["plano", "starter", "pro", "enterprise", "preço", "r$"])
    )
    if t2_pass:
        print("      RESULTADO: [OK] Teste de planos e preços aprovado.")
        test_results.append(("Planos e Preços", True))
    else:
        print("      RESULTADO: [FALHA] Conteúdo de planos e preços não identificado.")
        test_results.append(("Planos e Preços", False))

    # 4. Cenário 3: Pergunta sobre Integração (React e Python)
    print("\n" + "-" * 75)
    print("[4/4] 🔌 Teste 3: Pergunta sobre Integração (React e Python)")
    pergunta_3 = "Como faço a integração com React e Python?"
    print(f"      Entrada: \"{pergunta_3}\"")

    res_3 = engine.process_message(pergunta_3)
    conf_3 = res_3.get("confidence", 0.95 if res_3.get("source") == "llm" else 0.85)
    source_3 = res_3.get("source", "unknown")
    reply_3 = res_3.get("response", "")

    print(f"      • Origem: {source_3.upper()}")
    print(f"      • Confiança: {conf_3:.2f}")
    print(f"      • Resposta Obtida (trecho):\n        {reply_3[:140].replace('\n', ' ')}...")

    # Validação do Teste 3
    t3_pass = (
        source_3 in ("knowledge_base", "llm", "fallback") and
        len(reply_3.strip()) > 20 and
        any(termo in reply_3.lower() for termo in ["integra", "api", "python", "sdk", "document", "canal"])
    )
    if t3_pass:
        print("      RESULTADO: [OK] Teste de integração aprovado.")
        test_results.append(("Integração com React e Python", True))
    else:
        print("      RESULTADO: [FALHA] Informações de integração não identificadas.")
        test_results.append(("Integração com React e Python", False))

    # =========================================================================
    # Resumo Final e Validação Global
    # =========================================================================
    print("\n" + "=" * 75)
    print("📊 RESUMO GERAL DA EXECUÇÃO DOS TESTES:")
    print_divider("=")

    all_passed = True
    for nome_teste, passou in test_results:
        status_txt = "[OK] PASSOU" if passou else "[X] FALHOU"
        print(f"  • {nome_teste.ljust(35)}: {status_txt}")
        if not passou:
            all_passed = False

    metrics = engine.get_metrics()
    print("\n📈 Métricas Operacionais Registradas:")
    print(f"  • Total de Mensagens Processadas: {metrics.get('total_messages')}")
    print(f"  • Resolvidas via LLM:             {metrics.get('resolved_by_llm')}")
    print(f"  • Resolvidas via Base (RAG):      {metrics.get('resolved_by_knowledge_base')}")
    print(f"  • Saudações Detectadas:           {metrics.get('greetings')}")
    print(f"  • Fallbacks Acionados:            {metrics.get('fallback_responses')}")

    print_divider("=")
    if all_passed:
        print("🎉 [OK] TODOS OS TESTES AUTOMATIZADOS DO BACKEND PASSARAM COM SUCESSO!")
    else:
        print("⚠️ [FALHA] Um ou mais testes não obtiveram o resultado esperado.")
    print_divider("=")

    return all_passed


if __name__ == "__main__":
    success = run_automated_backend_tests()
    sys.exit(0 if success else 1)
