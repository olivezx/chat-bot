/**
 * =============================================================================
 * Projeto: MY PIERCE — Piercing Match & Guia de Estilo
 * Arquivo: frontend/src/components/Navbar.jsx
 * Descrição: Barra de navegação moderna, elegante e responsiva com logotipo,
 *            links de navegação, alternador de tema (Modo Claro/Escuro) e CTA.
 * =============================================================================
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Menu,
  X,
  Compass,
  BookOpen,
  HelpCircle,
  ArrowRight,
  Sun,
  Moon,
  MessageSquare
} from 'lucide-react';

import brandLogo from '../assets/logo_ear.jpg';

export default function Navbar({
  currentView,
  onNavigate,
  onStartQuiz,
  theme,
  onToggleTheme
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (viewName) => {
    onNavigate(viewName);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDarkMode = theme === 'dark';

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Logotipo da Marca */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="brand-logo-btn"
          aria-label="Ir para a página inicial do MY PIERCE"
        >
          <img 
            src={brandLogo} 
            alt="Logotipo MY PIERCE Piercing Match" 
            className="navbar-brand-logo-img"
          />
          <div className="brand-text-group">
            <span className="brand-main-title">MY PIERCE</span>
            <span className="brand-tagline">PIERCING MATCH</span>
          </div>
        </button>

        {/* Links de Navegação Desktop */}
        <nav className="nav-links-desktop" aria-label="Navegação Principal">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
          >
            Início
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('guide')}
            className={`nav-link ${currentView === 'guide' ? 'active' : ''}`}
          >
            Conheça os Piercings
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('earmap')}
            className={`nav-link ${currentView === 'earmap' ? 'active' : ''}`}
          >
            Mapa Auricular
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('chat')}
            className={`nav-link nav-link-chat ${currentView === 'chat' ? 'active' : ''}`}
          >
            <span className="nav-chat-dot" />
            Assistente IA
          </button>
        </nav>

        {/* Ações Desktop: Alternador de Tema */}
        <div className="nav-actions-desktop">
          {/* Botão de Alternância de Tema Claro / Escuro */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            aria-label={isDarkMode ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
            id="theme-toggle-btn-desktop"
          >
            <div className="theme-toggle-icon-container">
              {isDarkMode ? (
                <Sun size={19} className="theme-icon sun-icon" />
              ) : (
                <Moon size={19} className="theme-icon moon-icon" />
              )}
            </div>
            <span className="theme-toggle-text">
              {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
            </span>
          </button>
        </div>

        {/* Ações Mobile: Botão de Tema + Hambúrguer */}
        <div className="mobile-header-actions">
          <button
            type="button"
            onClick={onToggleTheme}
            className="theme-toggle-btn-compact"
            title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            aria-label={isDarkMode ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-toggle"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Gaveta Mobile */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav-list">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`mobile-nav-link ${currentView === 'home' ? 'active' : ''}`}
            >
              <Compass size={18} />
              <span>Início</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('guide')}
              className={`mobile-nav-link ${currentView === 'guide' ? 'active' : ''}`}
            >
              <BookOpen size={18} />
              <span>Conheça os Piercings</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('earmap')}
              className={`mobile-nav-link ${currentView === 'earmap' ? 'active' : ''}`}
            >
              <HelpCircle size={18} />
              <span>Mapa Auricular Interativo</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('chat')}
              className={`mobile-nav-link ${currentView === 'chat' ? 'active' : ''}`}
            >
              <MessageSquare size={18} />
              <span>Assistente IA & Voz</span>
            </button>
          </nav>

          <div className="mobile-drawer-theme-box">
            <span>Aparência:</span>
            <button
              type="button"
              onClick={onToggleTheme}
              className="mobile-theme-switch-btn"
            >
              {isDarkMode ? (
                <>
                  <Sun size={17} className="text-accent" />
                  <span>Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon size={17} className="text-accent" />
                  <span>Modo Escuro</span>
                </>
              )}
            </button>
          </div>

          <div className="mobile-drawer-footer">
            <button
              type="button"
              onClick={() => {
                onStartQuiz();
                setMobileMenuOpen(false);
              }}
              className="btn-primary-block"
            >
              Começar o Teste Agora
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
