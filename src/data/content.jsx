import { Calculator, FlaskConical, PenTool } from 'lucide-react';

// ── BOOKS ────────────────────────────────────────────────────────────────────
// To add a new novel: copy one object below, fill in the fields, done.
// - id: unique slug, used as React key and lore-style identifier
// - src: cover image path — drop the file in /public first
// - link: optional. Omit the field entirely if there's no read-now link yet.

export const BOOKS = [
  {
    id: 'nexus', title: 'NEXUS', genre: 'Sci-Fi Thriller',
    src: '/Cover_Nexus.webp',
    tagline: 'What if you could borrow the skills of another version of yourself?',
    synopsis: 'Luckas Lazuardi, an ordinary young man, discovers the Nexus Device—granting him access to borrow the abilities of his alternate selves across other universes. However, the pendant also acts as a beacon, drawing the attention of the Custodians and an inter-dimensional murderous Fugitive.\n\nNow, he must run, not just for his freedom, but to maintain his very existence across the multiverse.',
    link: 'https://www.royalroad.com/fiction/163820/nexus-echoes-of-another-self',
  },
  {
    id: 'sillage', title: 'SILLAGE', genre: 'Mystery / Crime',
    src: '/Cover_Sillage.webp',
    tagline: 'Scent is the most primal language that never lies.',
    synopsis: 'Raka, a quiet auditor, possesses a weapon unlike any other: a hyper-acute sense of smell. Realizing that scent is the most primal language that never lies, he begins peeling back the rotten layers of bureaucracy within his ministry.\n\nBut as the line between justice and revenge blurs, Raka must decide if he is the victim, or a new monster rising.',
  },
  {
    id: 'manifesto', title: 'MANIFESTO', genre: 'Dystopian Thriller',
    src: '/Cover_Manifesto.webp',
    tagline: 'An idea cannot be killed.',
    synopsis: 'A desperate father. A corrupt system. And a nightmare that fights back. Banyu stamps fake environmental reports by day. By night, his rage manifests as a masked entity that hunts the powerful in their dreams.\n\nBut the line between justice and blind terror is thin — and Banyu is losing control.',
  },
];

// ── LORE DATABASE ────────────────────────────────────────────────────────────

export const LORE = [
  {
    id: 'nexus_device', tag: 'ARTIFACT', title: 'Nexus Device', sub: 'Quantum Inter-Dimensional Key',
    content: "A dull silver pendant with intricate geometric patterns and an obsidian-black stone. It's not just a tool, but a 'Key to the Multiverse'. It allows its user to borrow skills (Eternal Echoes) from alternative versions of themselves across universal boundaries.",
  },
  {
    id: 'custodians', tag: 'FACTION', title: 'Custodian Faction', sub: 'Cosmic Stability Guardians',
    content: 'An inter-dimensional organization tasked with preventing timeline incursions and reality-threatening paradoxes. They utilize cutting-edge technology like the unhackable, encrypted Portable Quantum Entanglement Communicator and Sequencer (PQECS).',
  },
  {
    id: 'classification', tag: 'CLASSIFIED', title: 'Anomaly Classification', sub: 'Power Tiers',
    content: 'Based on Custodian archives: Tier 1 (Echo) for non-invasive skill borrowing. Tier 2 (Manifestation) which violates local scientific laws, like telekinesis. Tier 3 (Warp) which is absolute reality bending — God Tier.',
  },
  {
    id: 'fugitive', tag: 'THREAT', title: 'The Fugitive', sub: 'Prime Multiverse Threat',
    content: 'A deviant Nexus user with a deadly cybernetic implant in his heart. Instead of borrowing, he steals abilities by murdering his alternate selves in other universes, tearing the fabric of reality to find his way back home.',
  },
];

// ── QUOTES / FRAGMENTS ───────────────────────────────────────────────────────

export const QUOTES = [
  { text: '"Every time I borrow the skills of my other selves, I lose a little memory of who I truly am."', by: 'Luckas Lazuardi', role: 'PRIME', color: 'var(--cyan)' },
  { text: '"My job was just to observe. But the protocols in my head are starting to feel like suggestions, not commands."', by: 'Natasha', role: 'CUSTODIAN', color: 'var(--amber)' },
  { text: '"There are twelve versions of you out there. The other eleven are trash."', by: 'Mysterious Variant', role: 'HUNTER', color: 'var(--red)' },
];

// ── AUTHOR "THREE WORLDS" ────────────────────────────────────────────────────

export const WORLDS = [
  { n: '01', title: 'The Auditor', icon: <Calculator size={20} />, color: 'var(--cyan)', desc: 'By day, he navigates the labyrinth of government bureaucracy in Jakarta. Numbers and reports are his weapons, providing the raw material of tension and power dynamics for his fiction.' },
  { n: '02', title: 'The Collector', icon: <FlaskConical size={20} />, color: 'var(--amber)', desc: 'A niche perfume collector who believes scent is the most primal language that never lies. This sensory obsession seeps deeply into his work, building dense atmospheres in every scene he writes.' },
  { n: '03', title: 'The Author', icon: <PenTool size={20} />, color: 'var(--red)', desc: 'By night, he transforms bureaucratic frustration and sensory obsession into sci-fi thrillers. Writing is his way of exploring the blurred line between justice and revenge — a thin boundary separating victims from monsters.' },
];
