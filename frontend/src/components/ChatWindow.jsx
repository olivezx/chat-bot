/**
 * =============================================================================
 * Projeto: 01 — Chatbot de Suporte Full-Stack (AfesuTech)
 * Camada: Camada 4 — Interface & Experiência do Usuário (UX)
 * Arquivo: frontend/src/components/ChatWindow.jsx
 * Descrição: Componente central do chatbot com histórico de mensagens,
 *            integração com FastAPI (POST /api/chat e POST /api/feedback),
 *            entrada por voz, chips de sugestão, barra de métricas,
 *            feedback Like/Dislike e exportação do log de atendimento.
 * =============================================================================
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  Send,
  ThumbsUp,
  ThumbsDown,
  Download,
  MessageSquare,
  Activity,
  Cpu,
  Loader2,
  Bot,
  User,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';
import VoiceInput from './VoiceInput';
import FormattedMessage from './FormattedMessage';

// ─── Constantes ───────────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const WELCOME_MESSAGE = {
  id: 'welcome-0',
  role: 'assistant',
  content:
    'Olá! ✨ Sou a **IA Especialista em Estilo do MY PIERCE**.\n\nEstou aqui para te ajudar com consultoria de piercing match, dicas de cicatrização, materiais hipoalergênicos (como Titânio ASTM F-136) e harmonização auricular.\n\nComo posso te ajudar hoje?',
  timestamp: new Date().toISOString(),
  feedback: null,
  mode: null,
};

const DEFAULT_SUGGESTIONS = [
  'Qual o melhor material para perfuração?',
  'Como funciona o teste de estilo MY PIERCE?',
  'Quanto tempo demora para cicatrizar?',
  'Quais joias combinam com estilo minimalista?',
];

// ─── Utilitários ──────────────────────────────────────────────────────────────
const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const formatTimestamp = (iso) => {
  try {
    return new Date(iso).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

const exportChatToTxt = (messages) => {
  const lines = messages.map((msg) => {
    const who = msg.role === 'user' ? '👤 Você' : '🤖 IA';
    const time = formatTimestamp(msg.timestamp);
    const text = msg.content.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#+\s?/g, '');
    return `[${time}] ${who}:\n${text}\n`;
  });

  const blob = new Blob(
    [`=== Log de Atendimento — AfesuTech ===\n${new Date().toLocaleString('pt-BR')}\n\n`, ...lines],
    { type: 'text/plain;charset=utf-8' }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `atendimento_afesutech_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Componente: TypingIndicator ──────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="cw-message cw-message--bot" aria-live="polite" aria-label="IA digitando">
      <div className="cw-avatar cw-avatar--bot">
        <Bot size={16} />
      </div>
      <div className="cw-bubble cw-bubble--bot cw-typing-bubble">
        <span className="cw-typing-dot" />
        <span className="cw-typing-dot" />
        <span className="cw-typing-dot" />
      </div>
    </div>
  );
}

// ─── Componente: MessageBubble ────────────────────────────────────────────────
function MessageBubble({ message, onFeedback }) {
  const isUser = message.role === 'user';
  const [feedbackSent, setFeedbackSent] = useState(message.feedback);

  const handleFeedback = async (value) => {
    if (feedbackSent) return;
    setFeedbackSent(value);
    onFeedback(message.id, value);
  };

  return (
    <div className={`cw-message ${isUser ? 'cw-message--user' : 'cw-message--bot'}`}>
      {/* Avatar */}
      <div className={`cw-avatar ${isUser ? 'cw-avatar--user' : 'cw-avatar--bot'}`}>
        {isUser ? <User size={15} /> : <Bot size={15} />}
      </div>

      {/* Coluna de conteúdo */}
      <div className="cw-message-col">
        {/* Bolha */}
        <div className={`cw-bubble ${isUser ? 'cw-bubble--user' : 'cw-bubble--bot'}`}>
          <FormattedMessage content={message.content} isUser={isUser} />
        </div>

        {/* Meta: timestamp + modo + feedback */}
        <div className={`cw-message-meta ${isUser ? 'cw-message-meta--user' : ''}`}>
          <span className="cw-timestamp">{formatTimestamp(message.timestamp)}</span>

          {message.mode && !isUser && (
            <span className="cw-mode-tag">
              <Cpu size={10} />
              {message.mode}
            </span>
          )}

          {/* Feedback apenas em mensagens da IA */}
          {!isUser && (
            <div className="cw-feedback-row" role="group" aria-label="Avaliar resposta">
              <button
                type="button"
                onClick={() => handleFeedback('like')}
                className={`cw-feedback-btn ${feedbackSent === 'like' ? 'cw-feedback-btn--active-like' : ''}`}
                disabled={!!feedbackSent}
                title="Resposta útil"
                aria-label="Curtir resposta"
                id={`feedback-like-${message.id}`}
              >
                <ThumbsUp size={13} />
              </button>
              <button
                type="button"
                onClick={() => handleFeedback('dislike')}
                className={`cw-feedback-btn ${feedbackSent === 'dislike' ? 'cw-feedback-btn--active-dislike' : ''}`}
                disabled={!!feedbackSent}
                title="Resposta não útil"
                aria-label="Não curtir resposta"
                id={`feedback-dislike-${message.id}`}
              >
                <ThumbsDown size={13} />
              </button>
              {feedbackSent && (
                <span className="cw-feedback-thanks">
                  {feedbackSent === 'like' ? '✨ Obrigado!' : '📝 Anotado!'}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Componente Principal: ChatWindow ─────────────────────────────────────────
export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);
  const [metrics, setMetrics] = useState({
    totalMessages: 0,
    likes: 0,
    dislikes: 0,
    lastMode: null,
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll suave para a última mensagem
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Foco no input ao montar
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // ── Cálculo de métricas derivadas ──
  const satisfactionRate = (() => {
    const total = metrics.likes + metrics.dislikes;
    if (total === 0) return null;
    return Math.round((metrics.likes / total) * 100);
  })();

  // ── Envio de mensagem ──────────────────────────────────────────────────────
  const handleSend = useCallback(
    async (textOverride) => {
      const text = (textOverride ?? inputValue).trim();
      if (!text || isLoading) return;

      const userMsg = {
        id: generateId(),
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
        feedback: null,
        mode: null,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
      setIsLoading(true);
      setSuggestions([]);

      // Ajusta altura do textarea de volta ao normal
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        const botMsg = {
          id: data.message_id || generateId(),
          role: 'assistant',
          content: data.reply || data.response || data.answer || 'Desculpe, não consegui gerar uma resposta.',
          timestamp: new Date().toISOString(),
          feedback: null,
          mode: data.source || data.mode || null,
        };

        setMessages((prev) => [...prev, botMsg]);

        // Atualiza sugestões e métricas
        if (Array.isArray(data.suggested_actions) && data.suggested_actions.length > 0) {
          setSuggestions(data.suggested_actions.slice(0, 4));
        } else {
          setSuggestions(DEFAULT_SUGGESTIONS.slice(0, 3));
        }

        setMetrics((prev) => ({
          ...prev,
          totalMessages: prev.totalMessages + 1,
          lastMode: data.mode || prev.lastMode,
        }));
      } catch (err) {
        console.error('[ChatWindow] Erro na API:', err);
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: 'assistant',
            content:
              '⚠️ Não foi possível conectar ao servidor. Verifique se o backend está em execução e tente novamente.',
            timestamp: new Date().toISOString(),
            feedback: null,
            mode: null,
          },
        ]);
        setSuggestions(DEFAULT_SUGGESTIONS);
      } finally {
        setIsLoading(false);
        textareaRef.current?.focus();
      }
    },
    [inputValue, isLoading]
  );

  // ── Envio via voz ──────────────────────────────────────────────────────────
  const handleVoiceTranscript = useCallback(
    (transcript) => {
      // Preenche o input e envia imediatamente
      handleSend(transcript);
    },
    [handleSend]
  );

  // ── Feedback ───────────────────────────────────────────────────────────────
  const handleFeedback = useCallback(async (messageId, value) => {
    setMetrics((prev) => ({
      ...prev,
      likes: value === 'like' ? prev.likes + 1 : prev.likes,
      dislikes: value === 'dislike' ? prev.dislikes + 1 : prev.dislikes,
    }));

    try {
      await fetch(`${API_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: messageId, feedback: value }),
      });
    } catch (err) {
      console.warn('[ChatWindow] Feedback não registrado no servidor:', err);
    }
  }, []);

  // ── Tecla Enter no textarea ────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Auto-resize do textarea ────────────────────────────────────────────────
  const handleTextareaInput = (e) => {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  // ── Exportar log ───────────────────────────────────────────────────────────
  const handleExport = () => {
    exportChatToTxt(messages);
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="cw-root" id="chat-window">

      {/* ── Cabeçalho + Barra de Métricas ── */}
      <header className="cw-header">
        <div className="cw-header-brand">
          <div className="cw-header-avatar">
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className="cw-header-title">MY PIERCE IA</h1>
            <p className="cw-header-subtitle">Consultoria de Piercings · Online</p>
          </div>
        </div>

        <div className="cw-metrics-bar">
          {/* Total de mensagens */}
          <div className="cw-metric-chip" title="Total de mensagens trocadas">
            <MessageSquare size={13} />
            <span>{metrics.totalMessages} msg{metrics.totalMessages !== 1 ? 's' : ''}</span>
          </div>



          {/* Modo de operação */}
          {metrics.lastMode && (
            <div className="cw-metric-chip cw-metric-chip--mode" title="Modo de operação da IA">
              <Cpu size={13} />
              <span>{metrics.lastMode}</span>
            </div>
          )}

          {/* Botão exportar */}
          <button
            type="button"
            onClick={handleExport}
            className="cw-export-btn"
            title="Exportar histórico da conversa"
            aria-label="Exportar conversa"
            id="chat-export-btn"
          >
            <Download size={15} />
          </button>

          {/* Botão fechar (opcional) */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="cw-close-btn"
              title="Voltar"
              aria-label="Fechar chat"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </header>

      {/* ── Área de Mensagens ── */}
      <section className="cw-messages-area" aria-label="Histórico de mensagens" role="log">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onFeedback={handleFeedback} />
        ))}

        {isLoading && <TypingIndicator />}

        {/* Âncora de scroll */}
        <div ref={messagesEndRef} aria-hidden="true" />
      </section>

      {/* ── Chips de Sugestão ── */}
      {suggestions.length > 0 && !isLoading && (
        <div className="cw-suggestions" aria-label="Perguntas sugeridas" role="list">
          {suggestions.map((sug, i) => (
            <button
              key={i}
              type="button"
              role="listitem"
              className="cw-suggestion-chip"
              onClick={() => handleSend(sug)}
              id={`suggestion-chip-${i}`}
              title={sug}
            >
              <ChevronRight size={13} />
              <span>{sug}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Barra de Entrada ── */}
      <footer className="cw-input-bar">
        <div className="cw-input-wrapper">
          <textarea
            ref={textareaRef}
            id="chat-input"
            className="cw-textarea"
            value={inputValue}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua dúvida... (Enter para enviar)"
            disabled={isLoading}
            rows={1}
            aria-label="Campo de mensagem"
            aria-multiline="true"
          />
        </div>

        <div className="cw-input-actions">
          {/* Botão de voz */}
          <VoiceInput onTranscript={handleVoiceTranscript} disabled={isLoading} />

          {/* Botão enviar */}
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={isLoading || !inputValue.trim()}
            className="cw-send-btn"
            aria-label="Enviar mensagem"
            id="chat-send-btn"
            title="Enviar (Enter)"
          >
            {isLoading ? (
              <Loader2 size={19} className="cw-spin" />
            ) : (
              <Send size={19} />
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
