"""
=============================================================================
Projeto: 01 — Chatbot de Suporte Full-Stack (AfesuTech)
Camada: Camada 3 — API REST & Comunicação Web
Arquivo: backend/main.py
Descrição: Servidor Web RESTful construído com FastAPI para expor o motor
           de IA (ChatbotEngine) para consumo pelo frontend React/Vite.
           Inclui suporte a CORS, validação com Pydantic, métricas e feedbacks.
=============================================================================
"""

import os
import sys
import time
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Adiciona o diretório atual ao sys.path para garantir importações relativas e absolutas
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from chatbot_engine import ChatbotEngine, load_env_file

# Garante carregamento do .env
load_env_file()

# =============================================================================
# 1. Inicialização da Aplicação FastAPI & Motor de IA
# =============================================================================

app = FastAPI(
    title="AfesuTech Chatbot API",
    description="API RESTful de atendimento inteligente com IA Generativa, RAG, motor léxico e suporte a voz.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Instância única do Motor do Chatbot
engine = ChatbotEngine()

# =============================================================================
# 2. Configuração de CORS (Cross-Origin Resource Sharing)
# =============================================================================
# Libera todas as origens para permitir comunicação fluida com o frontend Vite/React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# 3. Modelos de Dados (Pydantic Schemas)
# =============================================================================

class MessageRequest(BaseModel):
    """Modelo para recebimento de mensagens do usuário."""
    message: str = Field(..., description="Mensagem de texto enviada pelo usuário.", min_length=1)
    session_id: Optional[str] = Field(None, description="Identificador único opcional da sessão de conversa.")

    model_config = {
        "json_schema_extra": {
            "example": {
                "message": "Quais são os planos e preços disponíveis?",
                "session_id": "sess_12345abc"
            }
        }
    }


class FeedbackRequest(BaseModel):
    """Modelo para registro de avaliação do usuário (Like/Dislike)."""
    message_id: str = Field(..., description="Identificador único da mensagem respondida.")
    is_positive: bool = Field(..., description="True para Like (positivo) e False para Dislike (negativo).")

    model_config = {
        "json_schema_extra": {
            "example": {
                "message_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "is_positive": True
            }
        }
    }


class ChatResponse(BaseModel):
    """Modelo de resposta estruturada gerada pelo Chatbot."""
    reply: str = Field(..., description="Texto da resposta gerada pelo chatbot.")
    source: str = Field(..., description="Origem da resposta: 'llm', 'knowledge_base', 'greeting', 'fallback' ou 'empty'.")
    confidence: float = Field(..., description="Índice de confiança da resposta entre 0.0 e 1.0.")
    timestamp: float = Field(..., description="Timestamp Unix (em segundos) do processamento.")
    suggested_actions: List[str] = Field(default_factory=list, description="Lista de perguntas rápidas ou ações sugeridas.")
    message_id: Optional[str] = Field(None, description="Identificador único desta mensagem para vínculo de feedback.")

    model_config = {
        "json_schema_extra": {
            "example": {
                "reply": "Oferecemos três planos: Starter (R$ 49/mês), Professional (R$ 149/mês) e Enterprise (sob medida).",
                "source": "knowledge_base",
                "confidence": 0.85,
                "timestamp": 1726498000.123,
                "suggested_actions": ["Como funciona a IA com voz?", "Quais são as formas de pagamento?"],
                "message_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            }
        }
    }


# =============================================================================
# 4. Endpoints da API REST
# =============================================================================

@app.get(
    "/",
    summary="Status da API e Catálogo de Endpoints",
    tags=["Status & Healthcheck"]
)
def get_root_status() -> Dict[str, Any]:
    """
    Retorna o status operacional da API e a lista com descrição de todos os endpoints disponíveis.
    """
    return {
        "status": "online",
        "service": "AfesuTech Chatbot API",
        "version": "1.0.0",
        "message": "Servidor backend de IA e atendimento em execução com sucesso.",
        "endpoints": {
            "GET /": "Status da API e catálogo de endpoints disponíveis",
            "POST /api/chat": "Enviar mensagem de texto e receber resposta inteligente",
            "GET /api/knowledge-base": "Visualizar a base de conhecimento carregada",
            "GET /api/metrics": "Obter total de atendimentos e taxa de satisfação (%)",
            "POST /api/feedback": "Registrar avaliação de Like ou Dislike para uma resposta",
            "GET /docs": "Documentação interativa Swagger UI",
            "GET /redoc": "Documentação interativa ReDoc"
        }
    }


@app.post(
    "/api/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Processar Mensagem do Chat",
    tags=["Chat"]
)
def post_chat_message(request: MessageRequest) -> ChatResponse:
    """
    Recebe a mensagem enviada pelo usuário, executa o pipeline do motor de IA (Groq LLM,
    RAG factual, motor léxico ou fallback) e retorna a resposta formatada com sugestões.
    """
    try:
        raw_result = engine.process_message(request.message)

        # Mapeamento do nível de confiança caso não fornecido explicitamente
        source = raw_result.get("source", "unknown")
        confidence = raw_result.get("confidence")
        if confidence is None:
            if source in ("llm", "greeting"):
                confidence = 0.95
            elif source == "knowledge_base":
                confidence = 0.85
            elif source == "fallback":
                confidence = 0.10
            else:
                confidence = 0.50

        return ChatResponse(
            reply=raw_result.get("response", ""),
            source=source,
            confidence=float(confidence),
            timestamp=time.time(),
            suggested_actions=raw_result.get("suggestions", []),
            message_id=raw_result.get("message_id")
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno no processamento da mensagem: {str(e)}"
        )


@app.get(
    "/api/knowledge-base",
    summary="Consultar Base de Conhecimento",
    tags=["Base de Conhecimento"]
)
def get_knowledge_base() -> Dict[str, Any]:
    """
    Retorna a base de conhecimento completa carregada atualmente na memória do motor.
    """
    if not engine.knowledge_base:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Base de conhecimento não carregada ou vazia."
        )
    return engine.knowledge_base


@app.get(
    "/api/metrics",
    summary="Obter Métricas e Taxa de Satisfação",
    tags=["Métricas"]
)
def get_metrics() -> Dict[str, Any]:
    """
    Retorna o volume total de atendimentos realizados, a taxa calculada de
    satisfação dos usuários (%) e o detalhamento por canal de resolução e feedback.
    """
    metrics_data = engine.get_metrics()
    total_messages = metrics_data.get("total_messages", 0)
    positives = metrics_data.get("positive_feedbacks", 0)
    negatives = metrics_data.get("negative_feedbacks", 0)

    total_feedbacks = positives + negatives
    satisfaction_rate = round((positives / total_feedbacks) * 100, 2) if total_feedbacks > 0 else 100.0

    return {
        "total_atendimentos": total_messages,
        "taxa_satisfacao_pct": satisfaction_rate,
        "feedbacks_positivos": positives,
        "feedbacks_negativos": negatives,
        "detalhes": metrics_data
    }


@app.post(
    "/api/feedback",
    summary="Registrar Feedback (Like/Dislike)",
    tags=["Feedback"]
)
def post_feedback(request: FeedbackRequest) -> Dict[str, Any]:
    """
    Registra a avaliação do usuário (Like/Dislike) associada ao ID de uma mensagem respondida.
    """
    if not request.message_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O campo 'message_id' não pode ser vazio."
        )

    result = engine.register_feedback(request.message_id, request.is_positive)
    return result


# =============================================================================
# 5. Bloco de Execução Principal (Uvicorn na Porta 8000)
# =============================================================================
if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")

    print(f"🚀 Iniciando AfesuTech API Server em http://{host}:{port}")
    print(f"📖 Documentação interativa disponível em http://localhost:{port}/docs")

    uvicorn.run("main:app", host=host, port=port, reload=True)
