export type Book = {
  slug: string;
  number: string;
  title: string;
  genre: string;
  cover: string;
  tagline: string;
  synopsis: string[];
  accent: string;
  accentRgb: string;
  archiveCode: string;
  motifs: string[];
  seoDescription: string;
  externalUrl?: string;
  externalLabel?: string;
};

export const BOOKS: Book[] = [
  {
    slug: 'nexus',
    number: '01',
    title: 'NEXUS',
    genre: 'Sci-Fi Thriller',
    cover: 'Cover_Nexus.webp',
    tagline: 'What if you could borrow the skills of another version of yourself?',
    synopsis: [
      'Luckas Lazuardi, an ordinary young man, discovers the Nexus Device—an artefact that lets him borrow abilities from alternate versions of himself across other universes.',
      'The pendant is also a beacon. It draws the attention of the Custodians and an inter-dimensional Fugitive who does not borrow from his other selves—he hunts them.',
      'Luckas must protect his freedom, his identity, and the fragile continuity of his existence across the multiverse.',
    ],
    accent: '#55f4a0',
    accentRgb: '85, 244, 160',
    archiveCode: 'NX-01 / ACTIVE SIGNAL',
    motifs: ['Multiverse', 'Identity', 'Borrowed skills', 'Cosmic pursuit'],
    seoDescription:
      'Explore NEXUS, a science-fiction thriller by Michael Dinko about borrowed abilities, alternate selves, and a deadly pursuit across the multiverse.',
    externalUrl: 'https://www.royalroad.com/fiction/163820/nexus-echoes-of-another-self',
    externalLabel: 'Read on Royal Road',
  },
  {
    slug: 'sillage',
    number: '02',
    title: 'SILLAGE',
    genre: 'Mystery / Crime',
    cover: 'Cover_Sillage.webp',
    tagline: 'Scent is the most primal language that never lies.',
    synopsis: [
      'Raka is a quiet government auditor with a weapon no one expects: a hyper-acute sense of smell capable of revealing traces that people, documents, and institutions try to conceal.',
      'As he peels back the rotten layers of bureaucracy, each scent becomes evidence—and each discovery pushes him closer to the boundary between justice and revenge.',
      'To expose the system, Raka must decide whether he is still its victim or the next monster it has created.',
    ],
    accent: '#d9a45d',
    accentRgb: '217, 164, 93',
    archiveCode: 'SG-02 / OLFACTORY TRACE',
    motifs: ['Scent', 'Corruption', 'Evidence', 'Moral ambiguity'],
    seoDescription:
      'Discover SILLAGE, Michael Dinko’s mystery crime novel about an auditor whose extraordinary sense of smell exposes corruption and buried evidence.',
  },
  {
    slug: 'manifesto',
    number: '03',
    title: 'MANIFESTO',
    genre: 'Dystopian Thriller',
    cover: 'Cover_Manifesto.webp',
    tagline: 'An idea cannot be killed.',
    synopsis: [
      'Banyu is a desperate father who stamps false environmental reports by day and carries a growing fury against the corrupt system that owns his life.',
      'At night, that anger manifests as a masked entity that enters dreams and hunts the powerful where their guards cannot follow.',
      'The line between justice and indiscriminate terror is thin, and Banyu is losing control of the nightmare he created.',
    ],
    accent: '#ff6f61',
    accentRgb: '255, 111, 97',
    archiveCode: 'MF-03 / DREAM INSURGENCY',
    motifs: ['Dystopia', 'Dreams', 'Rage', 'Environmental crime'],
    seoDescription:
      'Enter MANIFESTO, a dystopian thriller by Michael Dinko about corruption, a father’s rage, and a masked nightmare that hunts the powerful in their dreams.',
  },
  {
    slug: 'hydra',
    number: '04',
    title: 'HYDRA',
    genre: 'Sci-Fi Action Thriller',
    cover: 'Cover_Hydra.webp',
    tagline: 'One man. Nine lives. One fight for reality.',
    synopsis: [
      'A debt-ridden government auditor awakens with superhuman senses, a crypto fortune, and memories belonging to nine alternate versions of himself.',
      'Each identity brings skills and wealth, but also grief, trauma, and enemies from lives he never lived.',
      'To protect his family from the syndicates hunting him, Morgan must master the nine heads within—or be torn apart by them.',
    ],
    accent: '#d4af57',
    accentRgb: '212, 175, 87',
    archiveCode: 'HY-04 / NINEFOLD IDENTITY',
    motifs: ['Parallel lives', 'Memory', 'Family', 'Fractured identity'],
    seoDescription:
      'Explore HYDRA, Michael Dinko’s science-fiction action thriller about one man absorbing the memories and abilities of nine alternate lives.',
  },
  {
    slug: 'lucidreamer',
    number: '05',
    title: 'LUCIDREAMER',
    genre: 'LitRPG Fantasy',
    cover: 'Cover_Lucidreamer.webp',
    tagline: 'One hour asleep. One month to survive. One dream to conquer reality.',
    synopsis: [
      'Bahrizal is a disposable Porter left to die during a Dungeon Break. His overlooked skill, Lucid Manifestation, awakens and drags his consciousness into Bumi Dwipa.',
      'One month in the dream equals one hour in reality. Training, pain, and artefacts carried across dimensions begin rebuilding his real body.',
      'But the Tower of Monas waits, and the deeper he travels, the less certain he becomes that the dream will ever let him return.',
    ],
    accent: '#8b8cff',
    accentRgb: '139, 140, 255',
    archiveCode: 'LD-05 / DREAM-TIME DILATION',
    motifs: ['Dream world', 'Progression', 'Martial arts', 'Dungeon survival'],
    seoDescription:
      'Discover LUCIDREAMER, a LitRPG fantasy by Michael Dinko where one hour of sleep becomes a month of survival, training, and transformation.',
  },
  {
    slug: 'capture',
    number: '06',
    title: 'CAPTURE',
    genre: 'Sci-Fi Crime Thriller',
    cover: 'Cover_Capture.webp',
    tagline: 'The past leaves a light. His camera is the only one that can see it.',
    synopsis: [
      'Nicolas Nostra hides a heterochromatic eye that sees ghostly ripples of trauma suspended in the air. Through a DSLR pentaprism, those ripples become frozen scenes from the past.',
      'His photographs decay within seventy-two hours, and looking too far backward risks permanent blindness.',
      'Working with a desperate detective, Nicolas exposes crimes erased by a syndicate that wipes quantum evidence clean—while someone begins erasing him.',
    ],
    accent: '#8ecbff',
    accentRgb: '142, 203, 255',
    archiveCode: 'CP-06 / RESIDUAL LIGHT',
    motifs: ['Photography', 'Memory', 'Quantum evidence', 'Unsolved crime'],
    seoDescription:
      'Explore CAPTURE, Michael Dinko’s science-fiction crime thriller about a camera that photographs trauma preserved in the light of the past.',
  },
];

export const getBookBySlug = (slug: string) => BOOKS.find((book) => book.slug === slug);
