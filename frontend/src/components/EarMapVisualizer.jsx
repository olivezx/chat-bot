/**
 * =============================================================================
 * Projeto: MY PIERCE — Piercing Match & Guia de Estilo
 * Arquivo: frontend/src/components/EarMapVisualizer.jsx
 * Descrição: Mapa interativo e visual das regiões anatômicas da orelha com
 *            pontos clicáveis, cards de detalhes rápidos e guia de curadoria.
 * =============================================================================
 */

import React, { useState } from 'react';
import { Sparkles, Info, Clock, Zap, Gem, CheckCircle, ArrowRight } from 'lucide-react';
import { piercingsData } from '../data/piercingsData';

export default function EarMapVisualizer({ onStartQuiz }) {
  const [selectedPiercingId, setSelectedPiercingId] = useState('helix');

  const earPiercings = piercingsData.filter((p) => p.category === 'orelha');
  const activePiercing =
    earPiercings.find((p) => p.id === selectedPiercingId) || earPiercings[0];

  return (
    <div className="earmap-page-container">
      <div className="earmap-header">
        <div className="guide-badge-pill">
          <Sparkles size={14} />
          <span>Explorador Interativo de Curadoria</span>
        </div>
        <h1 className="earmap-title">Mapa Auricular Interativo</h1>
        <p className="earmap-subtitle">
          Clique nos pontos de perfuração na orelha para explorar a localização exata, nível de sensibilidade e estilos de joia indicados para cada região.
        </p>
      </div>

      <div className="earmap-content-grid">
        {/* Lado Esquerdo: Orelha Interativa com Pontos de Piercing */}
        <div className="earmap-interactive-stage">
          <div className="ear-silhouette-wrapper">
            <div className="ear-base-shape">
              {/* Pontos Clicáveis na Orelha */}
              <button
                type="button"
                onClick={() => setSelectedPiercingId('industrial')}
                className={`ear-spot spot-industrial ${selectedPiercingId === 'industrial' ? 'active' : ''}`}
                title="Industrial"
              >
                <span className="spot-dot" />
                <span className="spot-text">Industrial</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPiercingId('helix')}
                className={`ear-spot spot-helix ${selectedPiercingId === 'helix' ? 'active' : ''}`}
                title="Helix"
              >
                <span className="spot-dot" />
                <span className="spot-text">Helix</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPiercingId('flat')}
                className={`ear-spot spot-flat ${selectedPiercingId === 'flat' ? 'active' : ''}`}
                title="Flat"
              >
                <span className="spot-dot" />
                <span className="spot-text">Flat</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPiercingId('rook')}
                className={`ear-spot spot-rook ${selectedPiercingId === 'rook' ? 'active' : ''}`}
                title="Rook"
              >
                <span className="spot-dot" />
                <span className="spot-text">Rook</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPiercingId('daith')}
                className={`ear-spot spot-daith ${selectedPiercingId === 'daith' ? 'active' : ''}`}
                title="Daith"
              >
                <span className="spot-dot" />
                <span className="spot-text">Daith</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPiercingId('conch')}
                className={`ear-spot spot-conch ${selectedPiercingId === 'conch' ? 'active' : ''}`}
                title="Conch"
              >
                <span className="spot-dot" />
                <span className="spot-text">Conch</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPiercingId('tragus')}
                className={`ear-spot spot-tragus ${selectedPiercingId === 'tragus' ? 'active' : ''}`}
                title="Tragus"
              >
                <span className="spot-dot" />
                <span className="spot-text">Tragus</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPiercingId('lobulo')}
                className={`ear-spot spot-lobulo ${selectedPiercingId === 'lobulo' ? 'active' : ''}`}
                title="Lóbulo"
              >
                <span className="spot-dot" />
                <span className="spot-text">Lóbulo</span>
              </button>
            </div>
          </div>

          <div className="earmap-selector-pills">
            {earPiercings.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPiercingId(p.id)}
                className={`ear-pill-btn ${selectedPiercingId === p.id ? 'active' : ''}`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Lado Direito: Detalhes do Piercing Ativo */}
        <div className="earmap-detail-panel">
          <div className="detail-panel-glass">
            <div className="detail-panel-header">
              <span className="detail-badge">PERFURAÇÃO SELECIONADA</span>
              <h2 className="detail-name">{activePiercing.name}</h2>
              <p className="detail-tagline">“{activePiercing.tagline}”</p>
            </div>

            <div className="detail-location-row">
              <Info size={16} className="text-accent" />
              <span>{activePiercing.location}</span>
            </div>

            <p className="detail-description">{activePiercing.description}</p>

            <div className="detail-stats-grid">
              <div className="detail-stat-card">
                <span className="stat-label"><Clock size={14} /> Cicatrização</span>
                <strong className="stat-value">{activePiercing.healingTime}</strong>
              </div>

              <div className="detail-stat-card">
                <span className="stat-label"><Zap size={14} /> Sensibilidade</span>
                <strong className="stat-value">Nível {activePiercing.painLevel} de 5</strong>
              </div>
            </div>

            <div className="detail-jewelry-section">
              <h3><Gem size={15} /> Joias Recomendadas:</h3>
              <ul className="detail-jewelry-list">
                {activePiercing.jewelryTypes.map((jewel, idx) => (
                  <li key={idx}>
                    <CheckCircle size={14} className="text-accent" />
                    <span>{jewel}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="detail-curation-tip">
              <strong>✨ Dica de Curadoria:</strong>
              <p>{activePiercing.curationTip}</p>
            </div>

            <button
              type="button"
              onClick={onStartQuiz}
              className="btn-primary-earmap"
            >
              <span>Descobrir se combina com você</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
