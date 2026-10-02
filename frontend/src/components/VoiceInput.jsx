/**
 * =============================================================================
 * Projeto: 01 — Chatbot de Suporte Full-Stack (AfesuTech)
 * Camada: Camada 4 — Multimodalidade, Acessibilidade & Mobile
 * Arquivo: frontend/src/components/VoiceInput.jsx
 * Descrição: Componente de entrada por voz (STT - Speech to Text) utilizando
 *            a Web Speech API nativa dos navegadores com suporte a Desktop,
 *            Android (Chrome) e iOS (Safari), com feedback visual e HTTPS.
 * =============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, Volume2 } from 'lucide-react';

export default function VoiceInput({ onTranscript, disabled = false }) {
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  // Verifica compatibilidade do navegador com a Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    }

    // Cleanup: encerra qualquer reconhecimento ativo ao desmontar o componente
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignora erros ao abortar no cleanup
        }
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  // Exibe erro com auto-dismiss após 5 segundos
  const showFeedbackError = (msg) => {
    setErrorMessage(msg);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    errorTimeoutRef.current = setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const handleToggleListening = () => {
    if (disabled) return;

    // Se já estiver gravando, encerra a captura
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn('[VoiceInput] Erro ao parar gravação:', e);
        }
      }
      setIsListening(false);
      return;
    }

    // Validação de contexto seguro (HTTPS é obrigatório para microfone em celulares)
    const isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
    const isHttps = window.location.protocol === 'https:';

    if (!isHttps && !isLocal) {
      showFeedbackError(
        '⚠️ O microfone no celular requer conexão segura (HTTPS). Acesse via Localtunnel/HTTPS.'
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showFeedbackError(
        'Navegador incompatível com reconhecimento de voz. Use o Chrome ou Safari.'
      );
      return;
    }

    try {
      // Cria uma nova instância a cada gravação para máxima estabilidade em mobile
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event) => {
        if (event.results && event.results.length > 0) {
          const transcript = event.results[0][0].transcript.trim();
          if (transcript && typeof onTranscript === 'function') {
            onTranscript(transcript);
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn('[VoiceInput] Speech error:', event.error);
        setIsListening(false);

        switch (event.error) {
          case 'not-allowed':
          case 'service-not-allowed':
            showFeedbackError(
              'Permissão de microfone negada. Habilite o acesso ao microfone no seu navegador.'
            );
            break;
          case 'no-speech':
            showFeedbackError(
              'Nenhuma fala detectada. Fale mais próximo ao microfone e tente novamente.'
            );
            break;
          case 'network':
            showFeedbackError(
              'Erro de conexão com o serviço de transcrição de voz. Verifique sua internet.'
            );
            break;
          case 'audio-capture':
            showFeedbackError(
              'Nenhum microfone foi detectado no seu dispositivo.'
            );
            break;
          default:
            showFeedbackError(
              `Erro no reconhecimento de voz (${event.error}). Tente novamente.`
            );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('[VoiceInput] Falha ao iniciar gravação:', err);
      setIsListening(false);
      showFeedbackError(
        'Não foi possível inicializar o microfone. Tente recarregar a página.'
      );
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      {/* Botão de Microfone */}
      <button
        type="button"
        onClick={handleToggleListening}
        disabled={disabled || !isSupported}
        className={`mic-btn ${isListening ? 'recording' : ''}`}
        title={
          !isSupported
            ? 'Reconhecimento de voz não suportado neste navegador'
            : isListening
            ? 'Clique para finalizar a gravação'
            : 'Falar por voz (Speech-to-Text)'
        }
        aria-label="Gravar mensagem por voz"
        id="voice-input-btn"
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>

      {/* Indicador Flutuante quando está Ouvindo */}
      {isListening && (
        <div
          style={{
            position: 'absolute',
            bottom: '52px',
            right: '0',
            backgroundColor: '#ffffff',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            boxShadow: '0 8px 24px rgba(244, 114, 182, 0.3)',
            padding: '8px 16px',
            borderRadius: '20px',
            color: '#831843',
            fontSize: '0.82rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            zIndex: 30,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#f43f5e',
              display: 'inline-block',
              animation: 'pulse-dot 1.2s infinite',
            }}
          />
          <span>🎙️ Ouvindo... Fale agora!</span>
        </div>
      )}

      {/* Toast de Erro Flutuante */}
      {errorMessage && (
        <div
          style={{
            position: 'absolute',
            bottom: '52px',
            right: '0',
            backgroundColor: '#fff1f2',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            boxShadow: '0 8px 20px rgba(244, 114, 182, 0.25)',
            padding: '8px 14px',
            borderRadius: '12px',
            color: '#9f1239',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            maxWidth: '280px',
            zIndex: 30,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0, color: '#f43f5e' }} />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
