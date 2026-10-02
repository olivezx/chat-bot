/**
 * =============================================================================
 * Projeto: MY PIERCE — Piercing Match & Guia de Estilo
 * Arquivo: frontend/src/data/quizData.js
 * Descrição: Questionário interativo de 9 perguntas com pesos pontuados para
 *            definir o perfil estético predominante de piercings do usuário.
 * =============================================================================
 */

export const quizQuestions = [
  {
    id: 1,
    category: 'Estilo Pessoal',
    question: 'Como você descreveria o seu estilo no dia a dia?',
    subtitle: 'Escolha a opção que mais reflete seu guarda-roupa e forma de se expressar:',
    options: [
      {
        id: '1a',
        label: 'Minimalista & Suave',
        description: 'Roupas leves, tons neutros, poucos detalhes e peças confortáveis.',
        icon: 'Sparkles',
        weights: { delicado_minimalista: 3, moderno_discreto: 2, elegante_classico: 1 }
      },
      {
        id: '1b',
        label: 'Clássico & Refinado',
        description: 'Alfaiataria, peças atemporais, tecidos nobres e acabamento impecável.',
        icon: 'Crown',
        weights: { elegante_classico: 3, delicado_minimalista: 1, moderno_discreto: 1 }
      },
      {
        id: '1c',
        label: 'Alternativo & Autêntico',
        description: 'Camadas, estampas autorais, visual indie, boho ou grunge descontraído.',
        icon: 'Flame',
        weights: { alternativo_criativo: 3, ousado_marcante: 1 }
      },
      {
        id: '1d',
        label: 'Fashionista & Imponente',
        description: 'Tendências de passarela, sobreposições arrojadas e peças que chamam a atenção.',
        icon: 'Zap',
        weights: { ousado_marcante: 3, alternativo_criativo: 1 }
      },
      {
        id: '1e',
        label: 'Moderno & Estruturado',
        description: 'Linhas retas, design contemporâneo, cores sóbrias e cortes geométricos.',
        icon: 'Layers',
        weights: { moderno_discreto: 3, elegante_classico: 1 }
      }
    ]
  },
  {
    id: 2,
    category: 'Intensidade & Destaque',
    question: 'Qual é o nível de destaque que você busca nos seus acessórios?',
    subtitle: 'Pense em como você gostaria que as pessoas notassem suas joias:',
    options: [
      {
        id: '2a',
        label: 'Extremamente Discreto',
        description: 'Quero que seja perceptível apenas de perto, como um segredo sutil.',
        icon: 'EyeOff',
        weights: { delicado_minimalista: 3, moderno_discreto: 2 }
      },
      {
        id: '2b',
        label: 'Equilibrado & Harmônico',
        description: 'Aparece na medida certa para somar charme sem roubar a cena.',
        icon: 'Feather',
        weights: { elegante_classico: 3, delicado_minimalista: 1, moderno_discreto: 2 }
      },
      {
        id: '2c',
        label: 'Original & Curioso',
        description: 'Gosto de peças que despertam perguntas e elogios pela originalidade.',
        icon: 'Compass',
        weights: { alternativo_criativo: 3, moderno_discreto: 1 }
      },
      {
        id: '2d',
        label: 'Marcante & Protagonista',
        description: 'Adoro que minhas joias sejam o ponto alto do look e demonstrem presença.',
        icon: 'Sun',
        weights: { ousado_marcante: 3, alternativo_criativo: 2 }
      }
    ]
  },
  {
    id: 3,
    category: 'Materiais & Acabamentos',
    question: 'Qual acabamento metálico faz seu coração bater mais forte?',
    subtitle: 'O tom do metal define a temperatura e a aura da sua curadoria:',
    options: [
      {
        id: '3a',
        label: 'Ouro Amarelo Clássico (18k / Dourado)',
        description: 'Brilho quente, nobreza atemporal e acabamento reluzente.',
        icon: 'CircleDot',
        weights: { elegante_classico: 3, delicado_minimalista: 2 }
      },
      {
        id: '3b',
        label: 'Prata 925 & Titânio Espelhado',
        description: 'Tom prateado puro, frio, luminoso e super contemporâneo.',
        icon: 'Shield',
        weights: { moderno_discreto: 3, delicado_minimalista: 1, alternativo_criativo: 1 }
      },
      {
        id: '3c',
        label: 'Grafite, Titânio Preto ou Anodizado Colorido',
        description: 'Tons escuros, furta-cor ou metais com textura fosca marcante.',
        icon: 'Moon',
        weights: { alternativo_criativo: 3, ousado_marcante: 2 }
      },
      {
        id: '3d',
        label: 'Mix de Metais & Pedrarias Nobres',
        description: 'Gosto de misturar ouro, pedras cravejadas e cristais zircônia.',
        icon: 'Gem',
        weights: { ousado_marcante: 2, elegante_classico: 2, alternativo_criativo: 1 }
      }
    ]
  },
  {
    id: 4,
    category: 'Região de Preferência',
    question: 'Onde você mais se imagina usando uma nova perfuração?',
    subtitle: 'Cada região transmite uma energia e estilo diferentes:',
    options: [
      {
        id: '4a',
        label: 'No Lóbulo da Orelha',
        description: 'Segundo, terceiro furo ou lóbulo superior para criar uma constelação suave.',
        icon: 'Smile',
        weights: { delicado_minimalista: 3, elegante_classico: 2 }
      },
      {
        id: '4b',
        label: 'Cartilagem Externa ou Plana (Helix / Flat)',
        description: 'No topo da orelha para emoldurar o contorno do rosto.',
        icon: 'Star',
        weights: { elegante_classico: 2, moderno_discreto: 2, delicado_minimalista: 1 }
      },
      {
        id: '4c',
        label: 'Cartilagem Central ou Interna (Conch / Daith / Tragus)',
        description: 'No centro da orelha com argolas imponentes ou mandalas detalhadas.',
        icon: 'Heart',
        weights: { alternativo_criativo: 3, ousado_marcante: 2, elegante_classico: 1 }
      },
      {
        id: '4d',
        label: 'No Rosto (Nostril no Nariz ou Septo)',
        description: 'Um detalhe facial de iluminação e atitude.',
        icon: 'User',
        weights: { ousado_marcante: 3, alternativo_criativo: 2, delicado_minimalista: 1 }
      }
    ]
  },
  {
    id: 5,
    category: 'Quantidade & Composição',
    question: 'Qual é o seu conceito ideal de curadoria de orelha / corpo?',
    subtitle: 'A quantidade e a distribuição de joias revelam sua personalidade:',
    options: [
      {
        id: '5a',
        label: 'Ultra Minimal (1 a 2 furos)',
        description: 'Apenas os essenciais, bem selecionados e sem sobrecarga.',
        icon: 'CheckCircle',
        weights: { delicado_minimalista: 3, moderno_discreto: 1 }
      },
      {
        id: '5b',
        label: 'Equilíbrio Nobre (3 a 4 furos simétricos)',
        description: 'Uma composição harmoniosa que equilibra lóbulo e cartilagem.',
        icon: 'Grid',
        weights: { elegante_classico: 3, moderno_discreto: 2 }
      },
      {
        id: '5c',
        label: 'Curadoria Orgânica & Assimétrica (5+ furos variados)',
        description: 'Uma orelha diferente da outra, cheia de formas e detalhes artísticos.',
        icon: 'Shuffle',
        weights: { alternativo_criativo: 3, ousado_marcante: 1 }
      },
      {
        id: '5d',
        label: 'Constelação Completa & Ousada (Múltiplas joias)',
        description: 'Uma composição rica em argolas, hastes e pontos de luz em vários níveis.',
        icon: 'Maximize',
        weights: { ousado_marcante: 3, alternativo_criativo: 2 }
      }
    ]
  },
  {
    id: 6,
    category: 'Design da Joia',
    question: 'Que tipo de design de joia faz seus olhos brilharem?',
    subtitle: 'O formato da peça traduz o seu gosto artístico:',
    options: [
      {
        id: '6a',
        label: 'Micro Pontos de Luz & Esferas Lisas',
        description: 'Brilho pontual, delicado e extremamente sutil.',
        icon: 'Sparkle',
        weights: { delicado_minimalista: 3, moderno_discreto: 2 }
      },
      {
        id: '6b',
        label: 'Ramos Cravejados, Marquises & Flores em Ouro',
        description: 'Formatos inspirados na alta joalheria botânica e nobre.',
        icon: 'Flower2',
        weights: { elegante_classico: 3, delicado_minimalista: 1 }
      },
      {
        id: '6c',
        label: 'Mandalas Místicas, Correntes & Corações',
        description: 'Texturas trabalhadas em filigrana, elos e estética boêmia.',
        icon: 'Disc',
        weights: { alternativo_criativo: 3, ousado_marcante: 1 }
      },
      {
        id: '6d',
        label: 'Argolas Grossas, Hastes Retas & Picos',
        description: 'Impacto visual, peso e estética industrial/rock glam.',
        icon: 'ShieldAlert',
        weights: { ousado_marcante: 3, alternativo_criativo: 1 }
      },
      {
        id: '6e',
        label: 'Formas Geométricas Puras (Barras, Triângulos, Discos)',
        description: 'Linhas retas, precisão milimétrica e ar contemporâneo.',
        icon: 'Square',
        weights: { moderno_discreto: 3, elegante_classico: 1 }
      }
    ]
  },
  {
    id: 7,
    category: 'Rotina & Ambiente',
    question: 'Como é a sua rotina e o seu ambiente profissional?',
    subtitle: 'Seu estilo de vida ajuda a calibrar a praticidade das suas escolhas:',
    options: [
      {
        id: '7a',
        label: 'Corporativo Formal / Saúde / Direito',
        description: 'Exige sobriedade, higiene e acessórios discretos que não chamem atenção excessiva.',
        icon: 'Briefcase',
        weights: { delicado_minimalista: 3, elegante_classico: 2, moderno_discreto: 2 }
      },
      {
        id: '7b',
        label: 'Empresarial Criativo / Tecnologia / Educação',
        description: 'Ambiente flexível que valoriza estilo pessoal com sofisticação.',
        icon: 'Laptop',
        weights: { moderno_discreto: 3, elegante_classico: 2, alternativo_criativo: 1 }
      },
      {
        id: '7c',
        label: 'Artes / Design / Moda / Entretenimento',
        description: 'Total liberdade para expressar criatividade sem qualquer restrição.',
        icon: 'Palette',
        weights: { alternativo_criativo: 3, ousado_marcante: 3 }
      },
      {
        id: '7d',
        label: 'Dinâmico / Esportivo / Casual',
        description: 'Priorizo joias confortáveis que não enrosquem e não incomodem no dia a dia.',
        icon: 'Activity',
        weights: { delicado_minimalista: 2, moderno_discreto: 3 }
      }
    ]
  },
  {
    id: 8,
    category: 'Nível de Ousadia',
    question: 'Ao pensar em furar ou mudar um piercing, qual é o seu sentimento?',
    subtitle: 'A coragem e o desejo de transformação são fundamentais no resultado:',
    options: [
      {
        id: '8a',
        label: 'Gosto do Seguro & Tradicional',
        description: 'Prefiro seguir caminhos consolidados que tenho 100% de certeza que vou amar.',
        icon: 'Anchor',
        weights: { delicado_minimalista: 3, elegante_classico: 2 }
      },
      {
        id: '8b',
        label: 'Gosto de Inovar com Elegância',
        description: 'Adoro novidades, desde que mantenham harmonia com minha imagem.',
        icon: 'TrendingUp',
        weights: { elegante_classico: 2, moderno_discreto: 3, delicado_minimalista: 1 }
      },
      {
        id: '8c',
        label: 'Amo Desafiar Padrões e Experimentar',
        description: 'Quanto mais único e incomum o piercing for, mais me atrai.',
        icon: 'Sparkles',
        weights: { alternativo_criativo: 3, ousado_marcante: 2 }
      },
      {
        id: '8d',
        label: 'Sem Medo de Impactar',
        description: 'Topo piercings marcantes, perfurações múltiplas e joias imponentes.',
        icon: 'Flame',
        weights: { ousado_marcante: 3, alternativo_criativo: 2 }
      }
    ]
  },
  {
    id: 9,
    category: 'Mensagem Visual',
    question: 'Qual mensagem você quer transmitir através dos seus piercings?',
    subtitle: 'Sua assinatura estética final expressa a sua essência:',
    options: [
      {
        id: '9a',
        label: 'Delicadeza, Luz e Suavidade',
        description: 'Uma presença doce, refinada e agradável em qualquer detalhe.',
        icon: 'Sun',
        weights: { delicado_minimalista: 3, elegante_classico: 1 }
      },
      {
        id: '9b',
        label: 'Sofisticação, Status e Nobreza',
        description: 'Aura de joalheria de luxo e gosto apurado por excelência.',
        icon: 'Crown',
        weights: { elegante_classico: 3, moderno_discreto: 1 }
      },
      {
        id: '9c',
        label: 'Originalidade, Mistério e Arte',
        description: 'Uma pessoa criativa com alma livre e assinatura visual única.',
        icon: 'Compass',
        weights: { alternativo_criativo: 3, ousado_marcante: 1 }
      },
      {
        id: '9d',
        label: 'Poder, Autoconfiança e Atitude',
        description: 'Uma presença magnética que não passa despercebida.',
        icon: 'Zap',
        weights: { ousado_marcante: 3, alternativo_criativo: 1 }
      },
      {
        id: '9e',
        label: 'Modernidade, Precisão e Vanguarda',
        description: 'Visão contemporânea, mente aberta e elegância geométrica limpa.',
        icon: 'Layers',
        weights: { moderno_discreto: 3, elegante_classico: 1 }
      }
    ]
  }
];

/**
 * Calcula o perfil predominante baseado nas respostas selecionadas
 * @param {Object} selectedAnswers - Map de questionId -> optionId
 * @returns {string} ID do perfil vencedor
 */
export function calculateQuizResult(selectedAnswers) {
  const scores = {
    delicado_minimalista: 0,
    elegante_classico: 0,
    alternativo_criativo: 0,
    ousado_marcante: 0,
    moderno_discreto: 0
  };

  quizQuestions.forEach((q) => {
    const chosenOptionId = selectedAnswers[q.id];
    if (chosenOptionId) {
      const option = q.options.find((opt) => opt.id === chosenOptionId);
      if (option && option.weights) {
        Object.entries(option.weights).forEach(([profileKey, weight]) => {
          if (scores[profileKey] !== undefined) {
            scores[profileKey] += weight;
          }
        });
      }
    }
  });

  // Identifica o perfil com maior pontuação
  let topProfile = 'delicado_minimalista';
  let maxScore = -1;

  Object.entries(scores).forEach(([profileKey, score]) => {
    if (score > maxScore) {
      maxScore = score;
      topProfile = profileKey;
    }
  });

  return {
    topProfileId: topProfile,
    allScores: scores
  };
}
