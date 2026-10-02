/**
 * =============================================================================
 * Projeto: MY PIERCE — Piercing Match & Guia de Estilo
 * Arquivo: frontend/src/components/Quiz.jsx
 * Descrição: Componente interativo do teste de personalidade com barra de progresso,
 *            seleção visual de cards, validação de etapas e transições suaves.
 * =============================================================================
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  RotateCcw,
  Crown,
  Flame,
  Zap,
  Layers,
  EyeOff,
  Feather,
  Compass,
  Sun,
  CircleDot,
  Shield,
  Moon,
  Gem,
  Smile,
  Star,
  Heart,
  User,
  CheckCircle,
  Grid,
  Shuffle,
  Maximize,
  Sparkle,
  Flower2,
  Disc,
  ShieldAlert,
  Square,
  Briefcase,
  Laptop,
  Palette,
  Activity,
  Anchor,
  TrendingUp
} from 'lucide-react';
import { quizQuestions } from '../data/quizData';

// Mapeador dinâmico de ícones Lucide para os cards
const iconMap = {
  Sparkles, Crown, Flame, Zap, Layers, EyeOff, Feather, Compass, Sun,
  CircleDot, Shield, Moon, Gem, Smile, Star, Heart, User, CheckCircle,
  Grid, Shuffle, Maximize, Sparkle, Flower2, Disc, ShieldAlert, Square,
  Briefcase, Laptop, Palette, Activity, Anchor, TrendingUp
};

export default function Quiz({ onFinishQuiz, onCancelQuiz }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [validationError, setValidationError] = useState(false);

  const totalQuestions = quizQuestions.length;
  const currentQuestion = quizQuestions[currentStepIndex];
  const currentAnswer = selectedAnswers[currentQuestion.id];
  const progressPercent = Math.round(((currentStepIndex + 1) / totalQuestions) * 100);

  // Seleciona uma opção e remove mensagem de erro
  const handleSelectOption = (optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
    setValidationError(false);
  };

  // Avança para a próxima pergunta ou conclui o teste
  const handleNext = () => {
    if (!currentAnswer) {
      setValidationError(true);
      return;
    }

    if (currentStepIndex < totalQuestions - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      // Finaliza o quiz enviando as respostas acumuladas
      onFinishQuiz(selectedAnswers);
    }
  };

  // Retorna à pergunta anterior
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setValidationError(false);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Renderiza ícone seguro com fallback
  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || Sparkles;
    return <IconComponent size={22} className="option-card-icon" />;
  };

  return (
    <div className="quiz-page-container">
      <div className="quiz-card-wrapper">
        {/* Topo do Quiz: Barra de Progresso e Navegação */}
        <div className="quiz-header">
          <div className="quiz-header-top">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
              className="quiz-back-btn"
              title="Voltar pergunta anterior"
            >
              <ArrowLeft size={16} />
              <span>Voltar</span>
            </button>

            <div className="quiz-step-counter">
              <span className="step-current">Pergunta {currentStepIndex + 1}</span>
              <span className="step-total">de {totalQuestions}</span>
            </div>

            <button
              type="button"
              onClick={onCancelQuiz}
              className="quiz-cancel-btn"
              title="Reiniciar teste"
            >
              <RotateCcw size={15} />
              <span>Reiniciar</span>
            </button>
          </div>

          {/* Barra de Progresso Animada */}
          <div className="quiz-progress-track">
            <div
              className="quiz-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="quiz-progress-meta">
            <span className="quiz-category-badge">{currentQuestion.category}</span>
            <span className="quiz-percent-text">{progressPercent}% Concluído</span>
          </div>
        </div>

        {/* Pergunta Atual */}
        <div className="quiz-body" key={currentQuestion.id}>
          <div className="quiz-question-header">
            <h2 className="quiz-question-title">{currentQuestion.question}</h2>
            <p className="quiz-question-subtitle">{currentQuestion.subtitle}</p>
          </div>

          {/* Grid de Opções de Resposta */}
          <div className="quiz-options-grid">
            {currentQuestion.options.map((option) => {
              const isSelected = currentAnswer === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectOption(option.id)}
                  className={`option-card ${isSelected ? 'selected' : ''}`}
                >
                  <div className="option-card-header">
                    <div className="option-icon-wrapper">
                      {renderIcon(option.icon)}
                    </div>
                    <div className="option-radio-circle">
                      {isSelected && <Check size={14} className="check-icon" />}
                    </div>
                  </div>

                  <div className="option-card-content">
                    <h3 className="option-label">{option.label}</h3>
                    <p className="option-desc">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mensagem de Validação se tentar avançar sem escolher */}
          {validationError && (
            <div className="quiz-validation-alert" role="alert">
              <span>⚠️ Por favor, selecione uma das opções acima para continuar.</span>
            </div>
          )}
        </div>

        {/* Rodapé do Quiz com Botões de Ação */}
        <div className="quiz-footer">
          <div className="quiz-footer-hint">
            <small>✨ Suas escolhas calculam uma harmonia personalizada de piercings.</small>
          </div>

          <div className="quiz-actions-group">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="btn-secondary-quiz"
              >
                <ArrowLeft size={16} />
                <span>Anterior</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className={`btn-primary-quiz ${!currentAnswer ? 'btn-disabled' : ''}`}
            >
              <span>
                {currentStepIndex === totalQuestions - 1
                  ? 'Ver Meu Resultado'
                  : 'Próxima Pergunta'}
              </span>
              {currentStepIndex === totalQuestions - 1 ? (
                <Sparkles size={18} />
              ) : (
                <ArrowRight size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
