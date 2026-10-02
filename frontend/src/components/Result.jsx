/**
 * =============================================================================
 * Projeto: MY PIERCE — Piercing Match & Guia de Estilo
 * Arquivo: frontend/src/components/Result.jsx
 * Descrição: Exibição rica e personalizada do perfil de piercing com joias
 *            recomendadas, composição de orelha, compartilhamento e disclaimer.
 * =============================================================================
 */

import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  Share2,
  Check,
  BookOpen,
  ShieldAlert,
  Heart,
  Gem,
  Award,
  Clock,
  Zap,
  Info,
  MessageSquare
} from 'lucide-react';
import { profilesData } from '../data/profilesData';
import { piercingsData } from '../data/piercingsData';

export default function Result({
  profileId,
  selectedAnswers,
  onRetakeQuiz,
  onExploreGuide,
  onOpenPiercingDetail,
  onOpenChat
}) {
  const [copied, setCopied] = useState(false);
  const profile = profilesData[profileId] || profilesData.delicado_minimalista;

  // Filtra as informações completas dos piercings recomendados
  const recommendedPiercings = profile.suggestedPiercingIds
    .map((id) => piercingsData.find((p) => p.id === id))
    .filter(Boolean);

  // Compartilhar resultado (Web Share API ou Cópia de Link)
  const handleShareResult = async () => {
    const shareText = `💎 Fiz o teste do MY PIERCE e meu estilo de piercing é "${profile.name}"! Descubra o seu também:`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `MY PIERCE — Meu Estilo: ${profile.name}`,
          text: shareText,
          url: shareUrl
        });
      } catch {
        // Usuário cancelou o compartilhamento
      }
    } else {
      // Fallback: Copiar para área de transferência
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="result-page-container">
      <div className="result-content-wrapper">
        {/* Banner do Arquétipo do Resultado */}
        <section className="result-hero-card">
          <div className="result-badge-row">
            <span className="result-category-pill">
              <Award size={14} />
              <span>Seu Arquétipo de Estilo</span>
            </span>
            <span className="result-vibe-pill">{profile.vibeBadge}</span>
          </div>

          <h1 className="result-profile-title">{profile.name}</h1>
          <p className="result-profile-tagline">{profile.tagline}</p>

          <blockquote className="result-quote-box">
            <p>{profile.quote}</p>
          </blockquote>

          <p className="result-profile-description">{profile.description}</p>

          {/* Grid de Características Principais */}
          <div className="result-traits-grid">
            {profile.traits.map((trait, index) => (
              <div key={index} className="trait-card">
                <span className="trait-label">{trait.label}</span>
                <strong className="trait-value">{trait.value}</strong>
              </div>
            ))}
          </div>
        </section>

        {/* Seção: Piercings Recomendados para o Perfil */}
        <section className="result-piercings-section">
          <div className="section-header-compact">
            <div className="header-icon-group">
              <Sparkles size={20} className="text-accent" />
              <h2>Piercings Sugeridos para Você</h2>
            </div>
            <p className="section-subtitle-compact">
              Uma seleção de 3 a 5 perfurações harmonizadas com o seu perfil:
            </p>
          </div>

          <div className="result-piercings-grid">
            {recommendedPiercings.map((piercing) => (
              <div key={piercing.id} className="piercing-result-card">
                <div className="piercing-card-header">
                  <div className="piercing-title-group">
                    <h3 className="piercing-name">{piercing.name}</h3>
                    <span className="piercing-location-tag">
                      <Info size={12} />
                      <span>{piercing.location}</span>
                    </span>
                  </div>
                </div>

                <p className="piercing-card-desc">{piercing.description}</p>

                <div className="piercing-meta-tags">
                  <span className="meta-tag">
                    <Clock size={13} />
                    <span>Cicatrização: {piercing.healingTime}</span>
                  </span>
                  <span className="meta-tag">
                    <Zap size={13} />
                    <span>Destaque: {piercing.highlightLevel}</span>
                  </span>
                </div>

                <div className="piercing-card-advice">
                  <strong>✨ Joia Sugerida:</strong>
                  <span>{piercing.jewelryTypes.slice(0, 2).join(', ')}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenPiercingDetail(piercing)}
                  className="btn-view-piercing-detail"
                >
                  Ver Detalhes Anatômicos & Joias →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Seção: Composição de Curadoria (Ear Curation Combo) */}
        <section className="result-curation-box">
          <div className="curation-box-header">
            <Gem size={22} className="text-accent" />
            <div>
              <h3>{profile.curatedCombo.title}</h3>
              <p className="curation-subtitle">Combinação equilibrada para o seu dia a dia</p>
            </div>
          </div>

          <div className="curation-combo-body">
            <div className="curation-composition-badge">
              <Heart size={16} className="text-accent" />
              <p className="curation-text">{profile.curatedCombo.composition}</p>
            </div>
            <p className="curation-note">{profile.curatedCombo.note}</p>
            <div className="curation-advice-pill">
              <strong>💡 Dica do Estilista:</strong> {profile.stylingAdvice}
            </div>
          </div>
        </section>

        {/* Grupo de Ações Finais: Refazer, Compartilhar, Catálogo e Chat com IA */}
        <div className="result-actions-bar">
          <button
            type="button"
            onClick={onRetakeQuiz}
            className="btn-secondary-action"
          >
            <RotateCcw size={18} />
            <span>Refazer o Teste</span>
          </button>

          <button
            type="button"
            onClick={handleShareResult}
            className="btn-primary-action"
          >
            {copied ? <Check size={18} /> : <Share2 size={18} />}
            <span>{copied ? 'Link Copiado!' : 'Compartilhar Resultado'}</span>
          </button>

          <button
            type="button"
            onClick={onExploreGuide}
            className="btn-tertiary-action"
          >
            <BookOpen size={18} />
            <span>Explorar Guia Completo</span>
          </button>

          {onOpenChat && (
            <button
              type="button"
              onClick={onOpenChat}
              className="btn-chat-action"
              title="Pergunte à IA como harmonizar este estilo com suas joias atuais"
            >
              <MessageSquare size={18} />
              <span>Consultar IA do Meu Estilo</span>
            </button>
          )}
        </div>

        {/* Aviso Ético e Profissional */}
        <div className="result-medical-disclaimer" role="note">
          <ShieldAlert size={20} className="disclaimer-icon" />
          <div className="disclaimer-text">
            <strong>Orientações Importantes sobre Piercings & Saúde:</strong>
            <p>
              As sugestões apresentadas acima são baseadas exclusivamente nas preferências estéticas e comportamentais informadas. A viabilidade anatômica de cada perfuração, o ângulo ideal e a escolha do calibre da joia inicial (como Titânio Grau Implante ASTM F-136) devem ser sempre avaliados presencialmente por um <strong>body piercer profissional qualificado</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
