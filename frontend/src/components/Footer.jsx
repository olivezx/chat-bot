/**
 * =============================================================================
 * Projeto: MY PIERCE — Piercing Match & Guia de Estilo
 * Arquivo: frontend/src/components/Footer.jsx
 * Descrição: Rodapé elegante e institucional com links de navegação,
 *            lembrete de saúde anatômica e créditos do projeto.
 * =============================================================================
 */

import React from 'react';
import { Sparkles, ShieldCheck, Heart, ArrowUp } from 'lucide-react';

export default function Footer({ onNavigate, onStartQuiz }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-container">
      <div className="footer-inner">
        {/* Topo do Footer com Identidade e Navegação */}
        <div className="footer-main-grid">
          <div className="footer-brand-col">
            <div className="footer-brand-header">
              <div className="brand-icon-wrapper">
                <Sparkles size={16} />
              </div>
              <span className="footer-brand-title">MY PIERCE</span>
            </div>
            <p className="footer-brand-desc">
              Sua plataforma de curadoria, descoberta de estilo e guia inteligente de piercings e joias. Encontre combinações que valorizam sua beleza e expressam sua essência com harmonia.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Navegação</h4>
            <ul>
              <li>
                <button type="button" onClick={() => onNavigate('home')}>
                  Página Inicial
                </button>
              </li>
              <li>
                <button type="button" onClick={onStartQuiz}>
                  Teste de Personalidade
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('guide')}>
                  Conheça os Piercings
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('earmap')}>
                  Mapa Auricular
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('chat')}>
                  Assistente IA & Voz
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Estilos & Perfis</h4>
            <ul>
              <li><span>Delicado & Minimalista</span></li>
              <li><span>Elegante & Clássico</span></li>
              <li><span>Alternativo & Criativo</span></li>
              <li><span>Ousado & Marcante</span></li>
              <li><span>Moderno & Discreto</span></li>
            </ul>
          </div>

          <div className="footer-disclaimer-col">
            <div className="footer-safety-card">
              <div className="safety-card-header">
                <ShieldCheck size={18} className="text-accent" />
                <strong>Segurança & Saúde</strong>
              </div>
              <p>
                As sugestões do <strong>MY PIERCE</strong> têm caráter exclusivamente estético e inspiracional. Consulte sempre um <strong>body piercer profissional</strong> para avaliar a anatomia da sua cartilagem, assepsia e o uso de joias em Titânio ASTM F-136.
              </p>
            </div>
          </div>
        </div>

        {/* Linha Divisória & Copyright */}
        <div className="footer-bottom-row">
          <p className="footer-copy-text">
            © {new Date().getFullYear()} <strong>MY PIERCE (Piercing Match)</strong>. Todos os direitos reservados. Feito com <Heart size={13} className="text-accent inline" /> para apaixonados por joias e estilo.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="footer-scroll-top-btn"
            title="Voltar ao topo da página"
          >
            <span>Topo</span>
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
