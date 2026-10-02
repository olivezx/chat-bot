/**
 * =============================================================================
 * Projeto: MY PIERCE — Piercing Match & Guia de Estilo
 * Arquivo: frontend/src/App.jsx
 * Descrição: Componente raiz da aplicação MY PIERCE. Gerencia o roteamento
 *            de visualizações (Home, Quiz, Resultado, Guia e Mapa Auricular),
 *            alternância entre Modo Claro/Escuro com persistência em localStorage,
 *            cálculo de arquétipos de personalidade e fluxo de curadoria.
 * =============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Quiz from './components/Quiz';
import Result from './components/Result';
import PiercingGuide from './components/PiercingGuide';
import EarMapVisualizer from './components/EarMapVisualizer';
import Footer from './components/Footer';
import ChatWindow from './components/ChatWindow';
import { calculateQuizResult } from './data/quizData';
import { X, Gem, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
  // Estado de conexão e saúde da API (/api/metrics)
  const [apiStatus, setApiStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [apiMetrics, setApiMetrics] = useState(null);

  // Verificação de saúde da API
  const checkApiHealth = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/metrics`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setApiStatus('online');
        setApiMetrics(data);
      } else {
        setApiStatus('offline');
      }
    } catch {
      setApiStatus('offline');
    }
  }, []);

  // Polling periódico a cada 10 segundos para monitorar conexão da API
  useEffect(() => {
    checkApiHealth();
    const interval = setInterval(checkApiHealth, 10000);
    return () => clearInterval(interval);
  }, [checkApiHealth]);

  // Estado da visualização ativa: 'home' | 'quiz' | 'result' | 'guide' | 'earmap'
  const [currentView, setCurrentView] = useState('home');

  // Estado do tema: 'light' (padrão) ou 'dark' com persistência em localStorage
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('mypierce_theme');
      return savedTheme === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Sincroniza o tema no elemento raiz html e salva no localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('mypierce_theme', theme);
    } catch (e) {
      console.warn('[App] Não foi possível salvar tema no localStorage:', e);
    }
  }, [theme]);

  // Alternador de tema suave
  const handleToggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Estado das respostas e do resultado do teste
  const [quizAnswers, setQuizAnswers] = useState({});
  const [resultProfileId, setResultProfileId] = useState('delicado_minimalista');

  // Modal flutuante de piercing detalhado (usado quando clicado a partir do resultado)
  const [selectedDetailPiercing, setSelectedDetailPiercing] = useState(null);

  // Iniciar o questionário
  const handleStartQuiz = () => {
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Concluir o questionário e calcular o resultado
  const handleFinishQuiz = (answers) => {
    setQuizAnswers(answers);
    const { topProfileId } = calculateQuizResult(answers);
    setResultProfileId(topProfileId);
    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancelar ou reiniciar o quiz voltando para a Home
  const handleCancelQuiz = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Refazer o quiz
  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navegar entre páginas
  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      {/* 1. Cabeçalho Superior com Logotipo */}
      <Header
        onNavigateHome={() => handleNavigate('home')}
      />

      {/* 2. Barra de Navegação com Alternador de Tema */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onStartQuiz={handleStartQuiz}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* 2. Conteúdo Principal Dinâmico */}
      <main className="main-content">
        {currentView === 'home' && (
          <>
            <Hero
              onStartQuiz={handleStartQuiz}
              onExploreGuide={() => handleNavigate('guide')}
              onOpenChat={() => handleNavigate('chat')}
            />
            {/* Seções complementares na Home */}
            <section className="home-preview-section">
              <div className="home-preview-header">
                <h2>Por que descobrir seu estilo de piercing?</h2>
                <p>O piercing vai além da perfuração: é uma expressão de identidade e harmonia com o seu rosto.</p>
              </div>

              <div className="home-benefits-cards">
                <div className="benefit-card">
                  <div className="benefit-icon">✨</div>
                  <h3>Harmonia Estética</h3>
                  <p>Descubra joias e posições que valorizam o contorno natural da sua orelha e traços faciais.</p>
                </div>

                <div className="benefit-card">
                  <div className="benefit-icon">💎</div>
                  <h3>Curadoria sem Erros</h3>
                  <p>Evite joias desconfortáveis ou composições sobrecarregadas com sugestões pensadas para o seu estilo.</p>
                </div>

                <div className="benefit-card">
                  <div className="benefit-icon">🛡️</div>
                  <h3>Segurança & Cuidados</h3>
                  <p>Aprenda sobre tempos de cicatrização, materiais hipoalergênicos e cuidados fundamentais.</p>
                </div>
              </div>
            </section>
          </>
        )}

        {currentView === 'quiz' && (
          <Quiz
            onFinishQuiz={handleFinishQuiz}
            onCancelQuiz={handleCancelQuiz}
          />
        )}

        {currentView === 'result' && (
          <Result
            profileId={resultProfileId}
            selectedAnswers={quizAnswers}
            onRetakeQuiz={handleRetakeQuiz}
            onExploreGuide={() => handleNavigate('guide')}
            onOpenPiercingDetail={(piercing) => setSelectedDetailPiercing(piercing)}
            onOpenChat={() => handleNavigate('chat')}
          />
        )}

        {currentView === 'guide' && (
          <PiercingGuide onStartQuiz={handleStartQuiz} />
        )}

        {currentView === 'earmap' && (
          <EarMapVisualizer onStartQuiz={handleStartQuiz} />
        )}

        {currentView === 'chat' && (
          <div className="chat-page-wrapper">
            <ChatWindow onClose={() => handleNavigate('home')} />
          </div>
        )}
      </main>

      {/* 3. Rodapé Institucional */}
      <Footer
        onNavigate={handleNavigate}
        onStartQuiz={handleStartQuiz}
      />

      {/* 4. Botão Flutuante Rápido de IA (quando fora da tela de chat) */}
      {currentView !== 'chat' && (
        <button
          type="button"
          onClick={() => handleNavigate('chat')}
          className="floating-chat-trigger-btn"
          title="Falar com a IA do MY PIERCE"
          aria-label="Abrir assistente virtual inteligente"
          id="floating-chat-trigger"
        >
          <span className="floating-chat-pulse" />
          <MessageSquare size={22} className="floating-chat-icon" />
          <span className="floating-chat-label">Dúvidas? Fale com a IA</span>
        </button>
      )}

      {/* 4. Modal de Detalhes de Piercing Compartilhado */}
      {selectedDetailPiercing && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedDetailPiercing(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedDetailPiercing(null)}
              className="modal-close-btn"
              aria-label="Fechar modal"
            >
              <X size={20} />
            </button>

            <div className="modal-header">
              <span className="modal-category-badge">
                {selectedDetailPiercing.category.toUpperCase()}
              </span>
              <h2 className="modal-title">{selectedDetailPiercing.name}</h2>
              <p className="modal-location">
                📍 Localização: {selectedDetailPiercing.location}
              </p>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>Sobre a Perfuração</h3>
                <p>{selectedDetailPiercing.description}</p>
              </div>

              <div className="modal-section">
                <h3>Joias Ideais</h3>
                <ul className="modal-jewelry-list">
                  {selectedDetailPiercing.jewelryTypes.map((jewel, idx) => (
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
                  {selectedDetailPiercing.idealFinishes.map((finish, idx) => (
                    <span key={idx} className="finish-tag">
                      <CheckCircle2 size={13} />
                      <span>{finish}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="modal-curation-tip">
                <strong>💎 Dica de Curadoria:</strong>
                <p>{selectedDetailPiercing.curationTip}</p>
              </div>

              <div className="modal-warning-box">
                <ShieldCheck size={18} className="text-accent" />
                <small>
                  <strong>Importante:</strong> Consulte sempre um body piercer qualificado para avaliar a anatomia da sua cartilagem. A joia inicial recomendada é sempre <strong>Titânio Grau Implante (ASTM F-136)</strong>.
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
