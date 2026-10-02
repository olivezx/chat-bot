/**
 * =============================================================================
 * Projeto: MY PIERCE — Piercing Match & Guia de Estilo
 * Arquivo: frontend/src/components/PiercingGuide.jsx
 * Descrição: Catálogo informativo e educativo com os 10 piercings principais,
 *            filtros por região anatômica, busca rápida e modal de detalhes.
 * =============================================================================
 */

import React, { useState } from 'react';
import {
  Search,
  Clock,
  Zap,
  Gem,
  Sparkles,
  Info,
  X,
  ShieldCheck,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { piercingsData } from '../data/piercingsData';

export default function PiercingGuide({ onStartQuiz }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [activeModalPiercing, setActiveModalPiercing] = useState(null);

  // Filtragem de piercings por categoria e busca
  const filteredPiercings = piercingsData.filter((piercing) => {
    const matchesSearch =
      piercing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      piercing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      piercing.vibe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      piercing.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === 'todos') return matchesSearch;
    if (selectedCategory === 'orelha') return matchesSearch && piercing.category === 'orelha';
    if (selectedCategory === 'cartilagem_interna')
      return (
        matchesSearch &&
        (piercing.subcategory === 'cartilagem_interna' ||
          piercing.subcategory === 'cartilagem_central' ||
          piercing.subcategory === 'cartilagem_anterior')
      );
    if (selectedCategory === 'rosto') return matchesSearch && piercing.category === 'rosto';
    return matchesSearch;
  });

  // Renderiza indicador visual de dor/sensibilidade (1 a 5)
  const renderPainScale = (level) => {
    const dots = [];
    for (let i = 1; i <= 5; i++) {
      dots.push(
        <span
          key={i}
          className={`pain-dot ${i <= level ? 'active' : ''}`}
          title={`Nível de sensibilidade: ${level}/5`}
        />
      );
    }
    return <div className="pain-scale-group">{dots}</div>;
  };

  return (
    <div className="guide-page-container">
      {/* Cabeçalho do Guia */}
      <div className="guide-header-section">
        <div className="guide-badge-pill">
          <Sparkles size={14} />
          <span>Guia Completo de Estilos & Anatomia</span>
        </div>
        <h1 className="guide-title">Conheça os Piercings</h1>
        <p className="guide-subtitle">
          Explore as principais perfurações da orelha e do rosto, tempos de cicatrização, estilos de joias recomendadas e dicas estéticas para a sua curadoria.
        </p>

        {/* Barra de Pesquisa e Filtros */}
        <div className="guide-controls-wrapper">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nome (ex: Helix, Conch, Septo)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="search-clear-btn"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="category-filter-tabs">
            <button
              type="button"
              onClick={() => setSelectedCategory('todos')}
              className={`filter-tab ${selectedCategory === 'todos' ? 'active' : ''}`}
            >
              Todos (10)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('orelha')}
              className={`filter-tab ${selectedCategory === 'orelha' ? 'active' : ''}`}
            >
              Orelha (Geral)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('cartilagem_interna')}
              className={`filter-tab ${selectedCategory === 'cartilagem_interna' ? 'active' : ''}`}
            >
              Cartilagem Interna
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('rosto')}
              className={`filter-tab ${selectedCategory === 'rosto' ? 'active' : ''}`}
            >
              Rosto / Facial
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Cards de Piercings */}
      <div className="guide-cards-grid">
        {filteredPiercings.map((piercing) => (
          <article key={piercing.id} className="guide-card">
            <div className="guide-card-top">
              <div className="guide-card-title-row">
                <h2 className="guide-card-name">{piercing.name}</h2>
                <span className="guide-category-tag">{piercing.category.toUpperCase()}</span>
              </div>
              <p className="guide-card-tagline">“{piercing.tagline}”</p>
            </div>

            <div className="guide-card-location">
              <Info size={14} className="text-accent" />
              <span>{piercing.location}</span>
            </div>

            <p className="guide-card-body-text">{piercing.description}</p>

            {/* Metadados Técnicos */}
            <div className="guide-meta-grid">
              <div className="guide-meta-box">
                <span className="meta-box-label">
                  <Clock size={13} /> Cicatrização
                </span>
                <strong className="meta-box-value">{piercing.healingTime}</strong>
              </div>

              <div className="guide-meta-box">
                <span className="meta-box-label">
                  <Zap size={13} /> Sensibilidade
                </span>
                <div className="meta-pain-wrapper">
                  {renderPainScale(piercing.painLevel)}
                </div>
              </div>
            </div>

            {/* Vibe e Joias */}
            <div className="guide-vibe-box">
              <span className="vibe-label">✨ Estilo & Vibe:</span>
              <span className="vibe-text">{piercing.vibe}</span>
            </div>

            <div className="guide-card-footer">
              <button
                type="button"
                onClick={() => setActiveModalPiercing(piercing)}
                className="btn-card-detail"
              >
                Ver Guia de Joias & Cuidados →
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Seção de Chamada para o Quiz */}
      <div className="guide-quiz-cta-banner">
        <div className="cta-banner-content">
          <h3>Ficou em dúvida sobre qual escolher?</h3>
          <p>Faça nosso teste de personalidade e descubra a combinação exata que combina com seu estilo!</p>
        </div>
        <button
          type="button"
          onClick={onStartQuiz}
          className="btn-primary-banner"
        >
          <Sparkles size={16} />
          <span>Fazer o Teste de Estilo</span>
        </button>
      </div>

      {/* Modal de Detalhes Completo */}
      {activeModalPiercing && (
        <div className="modal-overlay" onClick={() => setActiveModalPiercing(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveModalPiercing(null)}
              className="modal-close-btn"
              aria-label="Fechar janela"
            >
              <X size={20} />
            </button>

            <div className="modal-header">
              <span className="modal-category-badge">{activeModalPiercing.category.toUpperCase()}</span>
              <h2 className="modal-title">{activeModalPiercing.name}</h2>
              <p className="modal-location">📍 Localização: {activeModalPiercing.location}</p>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>Sobre a Perfuração</h3>
                <p>{activeModalPiercing.description}</p>
              </div>

              <div className="modal-section">
                <h3>Joias Ideais</h3>
                <ul className="modal-jewelry-list">
                  {activeModalPiercing.jewelryTypes.map((jewel, idx) => (
                    <li key={idx}>
                      <Gem size={14} className="text-accent" />
                      <span>{jewel}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-section">
                <h3>Acabamentos Recomendados</h3>
                <div className="modal-finishes-tags">
                  {activeModalPiercing.idealFinishes.map((finish, idx) => (
                    <span key={idx} className="finish-tag">
                      <CheckCircle2 size={13} />
                      <span>{finish}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="modal-curation-tip">
                <strong>💎 Dica de Curadoria:</strong>
                <p>{activeModalPiercing.curationTip}</p>
              </div>

              <div className="modal-warning-box">
                <ShieldCheck size={18} className="text-accent" />
                <small>
                  <strong>Lembre-se:</strong> Toda perfuração deve respeitar a espessura e curvatura da sua cartilagem. A joia inicial recomendada é sempre em <strong>Titânio Grau Implante (ASTM F-136)</strong> para cicatrização segura.
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
