/**
 * =============================================================================
 * Projeto: MY PIERCE — Piercing Match & Guia de Estilo
 * Arquivo: frontend/src/data/profilesData.js
 * Descrição: Definição dos 5 perfis de estilo de personalidade com suas
 *            características, combinações de joias e piercings sugeridos.
 * =============================================================================
 */

export const profilesData = {
  delicado_minimalista: {
    id: 'delicado_minimalista',
    name: 'Delicado & Minimalista',
    tagline: 'A beleza dos detalhes sutis que encantam com leveza e discrição.',
    quote: '“Menos é infinitamente mais. Você valoriza joias finas, pequenos brilhos e peças que dialogam com harmonia em qualquer ocasião.”',
    description: 'Seu estilo é pautado pela sutileza, delicadeza e elegância sem esforço. Você prefere peças pequenas, pontos de luz cintilantes, micro argolinhas finas e arranjos que iluminam o rosto e a orelha com discrição absoluta.',
    traits: [
      { label: 'Nível de Destaque', value: 'Sutil & Delicado' },
      { label: 'Acabamento Ideal', value: 'Ouro Amarelo 18k / Ouro Branco / Zircônias Finas' },
      { label: 'Estética Predominante', value: 'Clean Chic, Minimalismo & Sofisticação' },
      { label: 'Foco na Orelha', value: 'Pontos de luz precisos e micro argolas' }
    ],
    suggestedPiercingIds: ['lobulo', 'helix', 'tragus', 'nostril'],
    curatedCombo: {
      title: 'Composição de Curadoria Sugerida:',
      composition: 'Dupla no Lóbulo com micro zircônias + Argolinha fininha no Helix + Micro ponto de luz no Tragus.',
      note: 'Um visual leve, ultra feminino e perfeito para o dia a dia e ambientes de trabalho formais.'
    },
    stylingAdvice: 'Aposte em joias com zircônias de 1.5mm a 2mm e argolinhas de espessura 0.8mm a 1.0mm com fecho clicker inteiriço.',
    badgeColor: '#ec4899',
    vibeBadge: '✨ Minimal & Sweet'
  },

  elegante_classico: {
    id: 'elegante_classico',
    name: 'Elegante & Clássico',
    tagline: 'Harmonia atemporal, simetria e o brilho do requinte.',
    quote: '“Você aprecia a tradição refinada, composições simétricas e joias de alto padrão que nunca saem de moda.”',
    description: 'Seu estilo respira requinte, equilíbrio e nobreza. Você busca composições organizadas, simetria estética e peças com design atemporal, como pérolas naturais, brilhantes e ouro amarelo polido de alta joalheria.',
    traits: [
      { label: 'Nível de Destaque', value: 'Moderado & Nobre' },
      { label: 'Acabamento Ideal', value: 'Ouro 18k / Pérolas / Diamantes ou Zircônias 5A' },
      { label: 'Estética Predominante', value: 'Old Money, Classic Glamour & Alta Joalheria' },
      { label: 'Foco na Orelha', value: 'Equilíbrio entre lóbulo sofisticado e cartilagem nobre' }
    ],
    suggestedPiercingIds: ['lobulo', 'flat', 'conch', 'helix'],
    curatedCombo: {
      title: 'Composição de Curadoria Sugerida:',
      composition: 'Trio no Lóbulo clássico + Ramo em ouro no Flat + Argola com zircônias no Conch.',
      note: 'Uma sinfonia de brilho equilibrado que complementa vestidos de festa, alfaiataria e looks executivos.'
    },
    stylingAdvice: 'Prefira topos em formato de marquise, folhas botânicas delicadas e argolas articuladas com fileiras de pedrarias frontais.',
    badgeColor: '#c5a059',
    vibeBadge: '👑 Classic Luxury'
  },

  alternativo_criativo: {
    id: 'alternativo_criativo',
    name: 'Alternativo & Criativo',
    tagline: 'Autenticidade, geometria única e a liberdade de quebrar padrões.',
    quote: '“Seu corpo é uma tela de expressão artística. Você ama assimetrias, formas intrigantes e joias cheias de personalidade.”',
    description: 'Você não tem medo de experimentar e adora criar arranjos originais que contam uma história. Gosta de misturar formatos, texturas, correntes suspensas, mandalas místicas e acabamentos diferenciados como titânio anodizado ou grafite.',
    traits: [
      { label: 'Nível de Destaque', value: 'Expressivo & Autêntico' },
      { label: 'Acabamento Ideal', value: 'Titânio Anodizado / Prata Envelhecida / Grafite' },
      { label: 'Estética Predominante', value: 'Boho Místico, Indie Grunge & Cyber Fashion' },
      { label: 'Foco na Orelha', value: 'Cartilagens internas, mandalas e conexões em corrente' }
    ],
    suggestedPiercingIds: ['daith', 'rook', 'industrial', 'helix', 'septo'],
    curatedCombo: {
      title: 'Composição de Curadoria Sugerida:',
      composition: 'Mandala detalhada no Daith + Argolinha com pingente no Rook + Corrente delicada unindo Helix e Lóbulo.',
      note: 'Um visual com aura mística e assinatura visual totalmente única.'
    },
    stylingAdvice: 'Explore correntes conectivas removíveis (chain charms) e joias com pedras naturais como opala branca ou ônix.',
    badgeColor: '#8b5cf6',
    vibeBadge: '🔮 Creative & Boho'
  },

  ousado_marcante: {
    id: 'ousado_marcante',
    name: 'Ousado & Marcante',
    tagline: 'Presença magnética, atitude e poder que comandam todos os olhares.',
    quote: '“Você abraça o protagonismo e usa seus acessórios como símbolos de atitude, força e estilo inconfundível.”',
    description: 'Para você, o piercing é uma declaração de estilo ousado e marcante. Você ama joias com volume, argolas grossas, perfurações faciais icônicas e combinações arrojadas que transformam qualquer look em um evento de moda.',
    traits: [
      { label: 'Nível de Destaque', value: 'Alto Impacto Visual' },
      { label: 'Acabamento Ideal', value: 'Titânio Dourado Imponente / Black PVD / Ouro Esculpido' },
      { label: 'Estética Predominante', value: 'Editorial de Moda, Streetwear Chic & Rock Glam' },
      { label: 'Foco na Orelha e Rosto', value: 'Septo em destaque, Conch volumoso e Transversais' }
    ],
    suggestedPiercingIds: ['septo', 'conch', 'industrial', 'helix', 'lobulo'],
    curatedCombo: {
      title: 'Composição de Curadoria Sugerida:',
      composition: 'Argola imponente no Septo + Argola grossa no Conch + Haste marcante no Industrial + Duplo Lóbulo.',
      note: 'Uma composição de forte presença, perfeita para quem respira moda e atitude sem pedir licença.'
    },
    stylingAdvice: 'Combine argolas de espessura 1.2mm a 1.6mm com pedrarias centrais e designs angulares para acentuar os traços do seu rosto.',
    badgeColor: '#f43f5e',
    vibeBadge: '⚡ Bold & Magnetic'
  },

  moderno_discreto: {
    id: 'moderno_discreto',
    name: 'Moderno & Discreto',
    tagline: 'Linhas retas, precisão contemporânea e estética arquitetônica.',
    quote: '“Você busca a sofisticação da era moderna: joias geométricas, encaixes perfeitos e discrição inteligente.”',
    description: 'Seu visual é limpo, contemporâneo e inteligente. Você se encanta por joias geométricas (barras, triângulos, esferas perfeitas), acabamentos em titânio polido espelhado e uma curadoria que parece projetada por um arquiteto minimalista.',
    traits: [
      { label: 'Nível de Destaque', value: 'Equilibrado & Tecnológico' },
      { label: 'Acabamento Ideal', value: 'Titânio Polido Espelhado / Prata 925 / Ouro Branco' },
      { label: 'Estética Predominante', value: 'Contemporâneo, Scandi Design & Geometric Clean' },
      { label: 'Foco na Orelha', value: 'Espaçamentos calculados, hastes retas e formas puras' }
    ],
    suggestedPiercingIds: ['flat', 'tragus', 'nostril', 'lobulo', 'helix'],
    curatedCombo: {
      title: 'Composição de Curadoria Sugerida:',
      composition: 'Barra geométrica no Flat + Esfera polida no Tragus + Ponto plano no Nostril + Argola retangular no Lóbulo.',
      note: 'Uma curadoria de linhas puras que valoriza a anatomia natural com máxima modernidade.'
    },
    stylingAdvice: 'Aposte em labrets com topos em formato de disco, bastões retangulares e argolas de corte facetado.',
    badgeColor: '#0ea5e9',
    vibeBadge: '📐 Modern Geometric'
  }
};
