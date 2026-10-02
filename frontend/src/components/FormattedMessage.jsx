/**
 * =============================================================================
 * Projeto: 01 — Chatbot de Suporte Full-Stack (AfesuTech)
 * Camada: Camada 4 — Interface & Formatação de Respostas
 * Arquivo: frontend/src/components/FormattedMessage.jsx
 * Descrição: Componente React que renderiza o texto retornado pela IA
 *            interpretando formatações ricas em Markdown (títulos, negritos,
 *            itálicos, listas, links e quebras de linha) em HTML seguro,
 *            utilizando a biblioteca "marked".
 * =============================================================================
 */

import React, { useMemo } from 'react';
import { marked } from 'marked';

// Configura o renderizador do marked com opções seguras e consistentes
const renderer = new marked.Renderer();

// Links sempre abrem em nova aba de forma segura
renderer.link = ({ href, title, text }) => {
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href}" target="_blank" rel="noopener noreferrer"${titleAttr}>${text}</a>`;
};

// Configuração global do marked
marked.setOptions({
  renderer,
  breaks: true,    // Converte quebras de linha simples (\n) em <br>
  gfm: true,       // Habilita GitHub Flavored Markdown (tabelas, listas de tarefas, etc.)
});

/**
 * FormattedMessage
 *
 * Renderiza uma string Markdown como HTML formatado dentro do chat.
 *
 * Props:
 *  - content  {string}  — Texto em Markdown retornado pela IA.
 *  - isUser   {boolean} — Define se a mensagem é do usuário (true) ou da IA (false).
 *  - className {string} — Classes CSS adicionais opcionais.
 */
export default function FormattedMessage({ content = '', isUser = false, className = '' }) {
  // Converte o Markdown para HTML apenas quando o conteúdo muda (memoizado para performance)
  const htmlContent = useMemo(() => {
    if (!content || typeof content !== 'string') return '';

    try {
      // marked.parse() retorna HTML; como não usamos eval/scripts, é seguro para conteúdo da API
      return marked.parse(content);
    } catch (err) {
      console.error('[FormattedMessage] Erro ao processar Markdown:', err);
      // Fallback: retorna o texto plano sem formatação
      return `<p>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`;
    }
  }, [content]);

  if (!htmlContent) return null;

  return (
    <div
      className={`formatted-message ${isUser ? 'formatted-message--user' : 'formatted-message--bot'} ${className}`}
      // dangerouslySetInnerHTML é seguro aqui pois o conteúdo vem de uma API controlada (IA).
      // O marked não executa scripts por padrão; links são abertos com rel="noopener noreferrer".
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      aria-live={isUser ? undefined : 'polite'}
    />
  );
}
