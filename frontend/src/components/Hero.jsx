/**
 * =============================================================================
 * Projeto: MY PIERCE — Piercing Match & Guia de Estilo
 * Arquivo: frontend/src/components/Hero.jsx
 * Descrição: Seção Hero de alto impacto visual com apresentação do teste,
 *            chamadas para ação e destaques dos benefícios da experiência.
 * =============================================================================
 */

import React from 'react';
import { Sparkles, ArrowRight, BookOpen, ShieldCheck, Heart, Star, Compass, MessageSquare } from 'lucide-react';

export default function Hero({ onStartQuiz, onExploreGuide, onOpenChat }) {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Lado Esquerdo: Textos e Chamadas */}
        <div className="hero-content">
          <div className="hero-badge-pill">
            <Sparkles size={14} className="hero-badge-icon" />
            <span>MY PIERCE • Teste de Estilo & Curadoria</span>
          </div>

          <h1 className="hero-title">
            Qual piercing combina com <span className="text-gradient">você?</span>
          </h1>

          <p className="hero-subtitle">
            Responda algumas perguntas rápidas e descubra combinações de joias e estilos de piercings que traduzem com perfeição a sua personalidade, rotina e bom gosto.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              onClick={onStartQuiz}
              className="btn-primary-hero"
            >
              <span>Começar o Teste</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={onExploreGuide}
              className="btn-secondary-hero"
            >
              <BookOpen size={18} />
              <span>Conhecer os Piercings</span>
            </button>

            {onOpenChat && (
              <button
                type="button"
                onClick={onOpenChat}
                className="btn-chat-hero"
                title="Tirar dúvidas com a IA Especialista em Piercings"
              >
                <MessageSquare size={17} />
                <span>Consultoria IA</span>
              </button>
            )}
          </div>

          {/* Destaques e Credenciais */}
          <div className="hero-features-grid">
            <div className="hero-feature-item">
              <div className="feature-icon-box">
                <Compass size={18} />
              </div>
              <div className="feature-text">
                <strong>100% Interativo</strong>
                <span>9 perguntas rápidas e intuitivas</span>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="feature-icon-box">
                <Star size={18} />
              </div>
              <div className="feature-text">
                <strong>Curadoria Sob Medida</strong>
                <span>Sugestões de joias e composições</span>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="feature-icon-box">
                <ShieldCheck size={18} />
              </div>
              <div className="feature-text">
                <strong>Guia Confiável</strong>
                <span>Informações sobre cicatrização e cuidados</span>
              </div>
            </div>
          </div>

          {/* Aviso Educativo Importante */}
          <div className="hero-disclaimer-note">
            <small>
              💡 <em>Nota: Os resultados oferecem recomendações estéticas personalizadas. A avaliação final da sua anatomia deve ser feita com um body piercer profissional.</em>
            </small>
          </div>
        </div>

        {/* Lado Direito: Card Visual Editorial da Orelha & Joias */}
        <div className="hero-visual-card">
          <div className="visual-card-glass">
            <div className="visual-card-header">
              <div className="visual-badge">
                <Heart size={13} className="text-accent" />
                <span>Curadoria em Alta</span>
              </div>
              <span className="visual-edition">Edição 2026</span>
            </div>

            {/* Ilustração / Gráfico Estilizado dos Pontos de Luz */}
            <div className="ear-preview-showcase">
              <div className="curation-mockup-circle">
                <div className="curation-inner-glow" />
                <div className="piercing-point point-helix" title="Helix">
                  <span className="point-pulse" />
                  <span className="point-label">Helix</span>
                </div>
                <div className="piercing-point point-flat" title="Flat">
                  <span className="point-pulse" />
                  <span className="point-label">Flat</span>
                </div>
                <div className="piercing-point point-conch" title="Conch">
                  <span className="point-pulse" />
                  <span className="point-label">Conch</span>
                </div>
                <div className="piercing-point point-tragus" title="Tragus">
                  <span className="point-pulse" />
                  <span className="point-label">Tragus</span>
                </div>
                <div className="piercing-point point-daith" title="Daith">
                  <span className="point-pulse" />
                  <span className="point-label">Daith</span>
                </div>
                <div className="piercing-point point-lobe" title="Lóbulo">
                  <span className="point-pulse" />
                  <span className="point-label">Lóbulo</span>
                </div>
              </div>
            </div>

            <div className="visual-card-footer">
              <div className="visual-profile-preview">
                <span className="preview-tag">Descubra seu arquétipo</span>
                <p className="preview-title">Minimalista • Clássico • Ousado • Alternativo • Moderno</p>
              </div>
              <button
                type="button"
                onClick={onStartQuiz}
                className="btn-pill-compact"
              >
                Fazer Quiz →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
