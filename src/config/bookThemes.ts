export type BookTheme = {
  id: string;
  layout: 'dimensional' | 'editorial' | 'brutalist' | 'radial' | 'dream' | 'viewfinder';
  premiseKicker: string;
  premiseTitle: string;
  motifLabel: string;
  signalLabel: string;
  fragmentMode: 'signal' | 'scent' | 'poster' | 'identity' | 'oneiric' | 'evidence';
  surface: string;
  surfaceRgb: string;
};

const BOOK_THEMES: Record<string, BookTheme> = {
  nexus: {
    id: 'nexus',
    layout: 'dimensional',
    premiseKicker: 'DIMENSIONAL FILE / PREMISE',
    premiseTitle: 'Every choice opens another world.',
    motifLabel: 'REALITY MARKERS',
    signalLabel: 'WORLD SIGNAL DETECTED',
    fragmentMode: 'signal',
    surface: '#05070d',
    surfaceRgb: '5, 7, 13',
  },
  sillage: {
    id: 'sillage',
    layout: 'editorial',
    premiseKicker: 'CASE FILE / OLFACTORY RECORD',
    premiseTitle: 'Evidence lingers after people leave.',
    motifLabel: 'TRACE PROFILE',
    signalLabel: 'OLFACTORY TRACE ACTIVE',
    fragmentMode: 'scent',
    surface: '#0b0907',
    surfaceRgb: '11, 9, 7',
  },
  manifesto: {
    id: 'manifesto',
    layout: 'brutalist',
    premiseKicker: 'RESTRICTED FILE / INSURGENCY',
    premiseTitle: 'An idea survives its creator.',
    motifLabel: 'THREAT INDEX',
    signalLabel: 'DREAM CHANNEL BREACHED',
    fragmentMode: 'poster',
    surface: '#0d0505',
    surfaceRgb: '13, 5, 5',
  },
  hydra: {
    id: 'hydra',
    layout: 'radial',
    premiseKicker: 'IDENTITY FILE / NINEFOLD',
    premiseTitle: 'Nine lives are fighting for one body.',
    motifLabel: 'IDENTITY NODES',
    signalLabel: 'NINEFOLD MEMORY ONLINE',
    fragmentMode: 'identity',
    surface: '#0b0905',
    surfaceRgb: '11, 9, 5',
  },
  lucidreamer: {
    id: 'lucidreamer',
    layout: 'dream',
    premiseKicker: 'DREAM LOG / TIME DILATION',
    premiseTitle: 'Sleep is only another kind of doorway.',
    motifLabel: 'DREAM PARAMETERS',
    signalLabel: 'DREAM-TIME LINK STABLE',
    fragmentMode: 'oneiric',
    surface: '#070713',
    surfaceRgb: '7, 7, 19',
  },
  capture: {
    id: 'capture',
    layout: 'viewfinder',
    premiseKicker: 'EVIDENCE FILE / RESIDUAL LIGHT',
    premiseTitle: 'The past is still exposing itself.',
    motifLabel: 'CAPTURE DATA',
    signalLabel: 'RESIDUAL LIGHT ACQUIRED',
    fragmentMode: 'evidence',
    surface: '#05090d',
    surfaceRgb: '5, 9, 13',
  },
};

const FALLBACK_THEME: BookTheme = BOOK_THEMES.nexus;

export const getBookTheme = (slug: string): BookTheme => BOOK_THEMES[slug] || FALLBACK_THEME;
export const BOOK_THEME_IDS = Object.keys(BOOK_THEMES);
