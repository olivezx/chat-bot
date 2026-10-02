/**
 * =============================================================================
 * Projeto: MY PIERCE — Piercing Match & Guia de Estilo
 * Camada: Camada 4 — Arquitetura de Componentes React
 * Arquivo: frontend/src/components/Header.jsx
 * Descrição: Barra superior institucional com o logotipo "MY PIERCE",
 *            identificação de conexão com a API e status online/offline.
 * =============================================================================
 */

import React from 'react';
import brandLogo from '../assets/logo_ear.jpg';

export default function Header({
  onNavigateHome,
}) {
  return (
    <header className="site-header">
      <div className="site-header-inner site-header-inner--centered">
        {/* Logotipo da Marca em Destaque */}
        <div
          className="header-brand header-brand--prominent"
          onClick={onNavigateHome}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onNavigateHome?.();
            }
          }}
          title="MY PIERCE • Piercing Match"
        >
          <img 
            src={brandLogo} 
            alt="Logotipo MY PIERCE Piercing Match" 
            className="header-brand-logo-img"
          />
          <div className="header-brand-info">
            <span className="header-brand-title">MY PIERCE</span>
            <span className="header-brand-subtitle">Piercing Match • Alta Curadoria</span>
          </div>
        </div>
      </div>
    </header>
  );
}
