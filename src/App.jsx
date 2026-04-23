import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Compass, Mail, User, ChevronRight, Send, Database, Target, ShieldAlert, Cpu, Quote, Radio, Satellite, RadioTower, Calculator, FlaskConical, PenTool, X } from 'lucide-react';

// Manual Instagram Icon (SVG)
const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// --- FLUID CANVAS RAIN EFFECT ---
const RainEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const drops = [];
    const dropCount = 100;
    const wind = -0.5;

    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 20 + 15,
        speed: Math.random() * 8 + 10,
        thickness: Math.random() * 1.5 + 0.8,
      });
    }

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      drops.forEach(drop => {
        const gradient = ctx.createLinearGradient(
          drop.x, drop.y, 
          drop.x + wind * 5, drop.y + drop.length
        );
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0.6)');
        gradient.addColorStop(0.8, 'rgba(0, 240, 255, 0.05)');
        
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + wind, drop.y + drop.length);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = drop.thickness;
        ctx.stroke();

        drop.y += drop.speed;
        drop.x += wind;

        if (drop.y > height + 50) {
          drop.y = -20;
          drop.x = Math.random() * width;
        }
        if (drop.x < -50) drop.x = width + 20;
        if (drop.x > width + 50) drop.x = -20;
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1] opacity-40"
      style={{ willChange: 'transform' }}
    />
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  
  // States for Universal 3D Book Modal
  const [openedBook, setOpenedBook] = useState(null);
  const [isBookAnimating, setIsBookAnimating] = useState(false);

  const loreData = [
    {
      id: 'nexus_device',
      icon: <Cpu size={18} />,
      title: 'Nexus Device',
      subtitle: 'Quantum Inter-Dimensional Artifact',
      content: "A dull silver pendant with intricate geometric patterns and an obsidian-black stone. It's not just a tool, but a 'Key to the Multiverse'. It allows its user to borrow skills (Eternal Echoes) from alternative versions of themselves across universal boundaries."
    },
    {
      id: 'custodians',
      icon: <Database size={18} />,
      title: 'Custodian Faction',
      subtitle: 'Cosmic Stability Guardians',
      content: 'An inter-dimensional organization tasked with preventing timeline incursions and reality-threatening paradoxes. They utilize cutting-edge technology like the unhackable, encrypted Portable Quantum Entanglement Communicator and Sequencer (PQECS).'
    },
    {
      id: 'classification',
      icon: <ShieldAlert size={18} />,
      title: 'Anomaly Classification',
      subtitle: 'Power Levels (Tiers)',
      content: 'Based on Custodian archives: Tier 1 (Echo) for non-invasive skill borrowing. Tier 2 (Manifestation) which violates local scientific laws, like telekinesis or defensive energy bursts. Tier 3 (Warp) which is absolute reality bending (God Tier).'
    },
    {
      id: 'the_fugitive',
      icon: <Target size={18} />,
      title: 'The Fugitive',
      subtitle: 'Prime Multiverse Threat',
      content: 'A deviant Nexus user with a deadly cybernetic implant in his heart. Instead of borrowing, he steals abilities by murdering his alternate selves in other universes, tearing the fabric of reality to find his way back to his home universe.'
    }
  ];

  const featuredWorks = [
    { 
      id: "manifesto",
      title: "MANIFESTO", 
      genre: "Dystopian Thriller",
      src: "/Cover_Manifesto.webp",
      tagline: "An idea cannot be killed.",
      synopsis: "A desperate father. A corrupt system. And a nightmare that fights back. Banyu stamps fake environmental reports by day. By night, his rage manifests as a masked entity that hunts the powerful in their dreams. But the line between justice and blind terror is thin — and Banyu is losing control. Manifesto is a dark psychological thriller about power, guilt, and the monster we become when the world gives us no other choice."
    { 
      id: "sillage",
      title: "SILLAGE", 
      genre: "Mystery / Crime",
      src: "/Cover_Sillage.webp",
      tagline: "Scent is the most primal language that never lies.",
      synopsis: "Raka, a quiet auditor, possesses a weapon unlike any other: a hyper-acute sense of smell. Realizing that scent is the most primal language that never lies, he begins peeling back the rotten layers of bureaucracy within his ministry.\n\nBut as the line between justice and revenge blurs, Raka must decide if he is the victim, or a new monster rising."
    },
    { 
      id: "nexus",
      title: "NEXUS", 
      genre: "Sci-Fi Thriller",
      src: "/Cover_Nexus.webp",
      tagline: "What if you could borrow the skills of another version of yourself?",
      synopsis: "Luckas Lazuardi, an ordinary young man, discovers the Nexus Device—granting him access to borrow the abilities of his alternate selves across other universes. However, the pendant also acts as a beacon, drawing the attention of the Custodians and an inter-dimensional murderous Fugitive.\n\nNow, he must run, not just for his freedom, but to maintain his very existence across the multiverse.",
      link: "https://www.royalroad.com/fiction/163820/nexus-echoes-of-another-self"
    }
  ];

  const [activeLore, setActiveLore] = useState(loreData[0]);

  // Prevent background scrolling when 3D book is open
  useEffect(() => {
    if (openedBook) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [openedBook]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Universal 3D Book Open Logic
  const openBook = (book) => {
    setOpenedBook(book);
    setTimeout(() => setIsBookAnimating(true), 100);
  };

  // Universal 3D Book Close Logic
  const closeBook = () => {
    setIsBookAnimating(false); 
    setTimeout(() => setOpenedBook(null), 800); // Wait for closing animation
  };

  return (
    <div className="relative min-h-screen bg-[#0A1128] text-[#E2E8F0] font-sans selection:bg-[#00F0FF] selection:text-[#0A1128] overflow-x-hidden">
      
      {/* --- CUSTOM CSS CLASSES --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
        
        html { scroll-behavior: smooth; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        /* Typewriter/Georgia Font for storytelling aesthetics */
        .font-typewriter { font-family: 'Courier Prime', Georgia, serif; }
        
        .glass-panel {
          background: rgba(28, 43, 75, 0.35);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }
        
        /* Dark Paper Texture utilizing SVG Noise Filter */
        .bg-dark-paper {
          background-color: #0f172a;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.12'/%3E%3C/svg%3E");
        }

        .neon-text-glow { text-shadow: 0 0 15px rgba(0, 240, 255, 0.6); }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        .animate-float { animation: float 7s ease-in-out infinite; }
        
        /* 3D Book Animation CSS */
        .perspective-2000 { perspective: 2000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .origin-left { transform-origin: left center; }
        .rotate-y-0 { transform: rotateY(0deg); }
        .-rotate-y-180 { transform: rotateY(-180deg); }
        .rotate-y-180 { transform: rotateY(180deg); }

        .stars-bg {
          background-image: 
            radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          opacity: 0.15;
        }
      `}} />

      {/* === UNIVERSAL 3D BOOK MODAL === */}
      {openedBook && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 transition-opacity duration-300 overflow-hidden">
          
          {/* Dark Backdrop */}
          <div 
            className={`absolute inset-0 bg-[#0A1128]/95 backdrop-blur-md transition-opacity duration-700 ${isBookAnimating ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeBook}
          ></div>
          
          {/* 3D Scene Container */}
          <div className="perspective-2000 w-[280px] sm:w-[320px] md:w-[400px] h-[400px] sm:h-[480px] md:h-[600px] z-10 transform scale-75 sm:scale-90 md:scale-100 transition-transform duration-700 mt-10 md:mt-0">
            <div className={`relative w-full h-full preserve-3d transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${isBookAnimating ? 'translate-x-[50%]' : ''}`}>
              
              {/* --- RIGHT PAGE (Synopsis & Details) --- */}
              <div 
                className="absolute inset-0 bg-dark-paper rounded-r-xl border-y border-r border-white/10 shadow-[20px_20px_50px_rgba(0,0,0,0.8)] p-6 md:p-10 overflow-y-auto flex flex-col z-10"
              >
                  {/* Close Button - fixed positioning relative to this container */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); closeBook(); }}
                    className="absolute top-4 right-4 p-2 text-white hover:text-[#FF2A2A] transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-[#FF2A2A] rounded-full cursor-pointer"
                    aria-label="Close book"
                  >
                    <X size={20} />
                  </button>
                  
                  <h3 className="font-serif text-2xl md:text-4xl font-bold text-white mb-2 mt-4 md:mt-0">{openedBook.title}</h3>
                  <p className="font-sans text-[#00F0FF] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4 md:mb-6">{openedBook.genre}</p>
                  <div className="w-12 h-0.5 bg-[#00F0FF] mb-4 md:mb-6"></div>
                  
                  {/* Typewriter Synopsis */}
                  <div className="font-typewriter text-white leading-relaxed text-justify text-[11px] md:text-sm space-y-3 md:space-y-4 mb-6 relative z-20">
                    {openedBook.synopsis.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                  
                  {/* Read First Chapter Button - only for Nexus */}
                  {openedBook.link && (
                    <a 
                      href={openedBook.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="mt-auto px-4 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-[#00F0FF] to-[#3A86FF] text-[#0A1128] text-xs md:text-sm font-bold rounded-md shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300 font-sans text-center hover:scale-105 hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:ring-offset-2 focus:ring-offset-[#0A1128] relative z-50 cursor-pointer"
                    >
                      Read First Chapter
                    </a>
                  )}
              </div>

              {/* --- BOOK COVER (Swinging Left Page) --- */}
              <div 
                className={`absolute inset-0 origin-left preserve-3d transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${isBookAnimating ? '-rotate-y-180 pointer-events-none' : 'rotate-y-0'}`}
                style={{ zIndex: 20 }}
              >
                  {/* Front Cover */}
                  <div className="absolute inset-0 backface-hidden rounded-r-xl overflow-hidden border border-gray-700/50 bg-[#0A1128] shadow-[10px_10px_30px_rgba(0,0,0,0.8)]">
                      <img src={openedBook.src} alt={openedBook.title} className="w-full h-full object-cover" 
                           onError={(e) => {
                             if (!e.target.src.includes('placehold')) e.target.src = `https://placehold.co/400x600/0A1128/00F0FF?text=${openedBook.title}`;
                           }} />
                      <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-black/80 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50"></div>
                  </div>

                  {/* Inside Cover (Back of the front cover) */}
                  <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-l-xl overflow-hidden bg-dark-paper border border-white/5 flex flex-col items-center justify-center p-6 text-center shadow-inner">
                       <div className="absolute inset-0 opacity-[0.03] bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-center bg-cover filter invert"></div>
                       
                       <Quote className="w-8 h-8 text-[#00F0FF]/30 mb-4 relative z-10" />
                       <p className="relative z-10 font-typewriter text-white text-xs md:text-sm italic leading-relaxed">
                         "{openedBook.tagline}"
                       </p>
                       <p className="relative z-10 mt-4 text-[#00F0FF] font-mono text-[10px] tracking-widest opacity-50">FILE // CLASSIFIED</p>
                       
                       <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-black/90 to-transparent"></div>
                  </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 pointer-events-none z-0 stars-bg"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#00F0FF]/10 via-[#3A86FF]/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0"></div>
      <RainEffect />

      {/* --- NAVBAR --- */}
      <nav className={`fixed w-full z-40 transition-all duration-500 ${scrolled ? 'top-4' : 'top-8'}`}>
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <div className="glass-panel rounded-full px-6 py-3 flex items-center gap-4 md:gap-8 transition-all duration-300">
            <div className="flex items-center gap-2 pr-2 border-r border-white/10">
              <img src="/favicon.png" alt="Logo" className="w-6 h-6 object-contain" />
              <span className="font-serif font-bold text-xs tracking-tighter hidden sm:block uppercase">M. Dinko</span>
            </div>
            <a href="#home" className="text-xs md:text-sm font-medium text-white hover:text-[#00F0FF]">Home</a>
            <a href="#works" className="text-xs md:text-sm font-medium text-white hover:text-[#00F0FF] hidden md:block">Works</a>
            <a href="#lore" className="text-xs md:text-sm font-medium text-white hover:text-[#00F0FF] hidden md:block">Lore</a>
            <a href="#about" className="text-xs md:text-sm font-medium text-white hover:text-[#00F0FF]">About</a>
            <a href="#contact" className="text-xs md:text-sm font-semibold text-[#00F0FF] hover:text-white bg-[#00F0FF]/10 px-4 py-1.5 rounded-full border border-[#00F0FF]/30">Contact</a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20">
        
        {/* --- HERO SECTION --- */}
        <section id="home" className="min-h-[85vh] flex flex-col items-center justify-center px-4 mb-24 text-center">
          <h2 className="font-sans text-sm tracking-[0.3em] text-[#00F0FF] uppercase mb-4">Sci-Fi Thriller</h2>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-2 neon-text-glow">NEXUS</h1>
          <p className="font-typewriter text-white italic text-lg md:text-xl mb-10">Echoes of Another Self</p>

          <div className="relative group animate-float mb-12">
            <div 
              className="relative w-56 md:w-72 aspect-[2/3] rounded-r-lg rounded-l-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-gray-700/50 overflow-hidden bg-[#0A1128] cursor-pointer" 
              onClick={() => openBook(featuredWorks[2])}
            >
              <img 
                src="/Cover_Nexus.webp" 
                alt="Cover Nexus" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                onError={(e) => {
                  if (!e.target.src.includes('placehold')) {
                    e.target.src = "https://placehold.co/400x600/0A1128/00F0FF?text=NEXUS";
                  }
                }} 
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <span className="font-sans text-white text-sm tracking-widest border border-[#00F0FF] px-4 py-2 rounded-md bg-[#0A1128]/80 backdrop-blur-sm">OPEN BOOK</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <a href="https://www.royalroad.com/fiction/163820/nexus-echoes-of-another-self" target="_blank" rel="noreferrer" className="px-8 py-3 bg-gradient-to-r from-[#00F0FF] to-[#3A86FF] text-[#0A1128] font-bold rounded-full shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 font-sans">
              <BookOpen size={18} /> Start Reading
            </a>
            <a href="#lore" className="px-8 py-3 glass-panel rounded-full text-white font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors font-sans">
              <Database size={18} className="text-[#00F0FF]"/> Access Database
            </a>
          </div>
        </section>

        {/* --- WORKS & LORE DATABASE --- */}
        <section id="works" className="max-w-7xl mx-auto px-4 mb-32 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 glass-panel rounded-2xl p-8 flex flex-col">
            <h3 className="font-serif text-2xl text-white text-center mb-8 uppercase tracking-widest">Featured Works</h3>
            <div className="flex justify-center gap-6 flex-wrap">
              {featuredWorks.map((book, i) => (
                <div 
                  key={i} 
                  className="group relative cursor-pointer"
                  onClick={() => openBook(book)}
                >
                  <img 
                    src={book.src} 
                    alt={book.title}
                    className="w-24 md:w-28 rounded-md shadow-lg border border-white/10 transition-transform duration-300 group-hover:-translate-y-2 object-cover aspect-[2/3]" 
                    onError={(e) => e.target.src = `https://placehold.co/200x300/1a202c/00F0FF?text=${book.title}`}
                  />
                  <div className="absolute inset-0 bg-[#00F0FF]/10 opacity-0 group-hover:opacity-100 rounded-md transition-opacity pointer-events-none"></div>
                  
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-[#0A1128] text-[#00F0FF] text-[10px] py-1 px-2 rounded font-mono border border-white/10">OPEN</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div id="lore" className="lg:col-span-7 glass-panel rounded-2xl p-8 flex flex-col">
            <h3 className="font-serif text-2xl text-white text-center mb-8 uppercase tracking-widest">Lore Database</h3>
            <div className="flex flex-col md:flex-row gap-6 flex-grow">
              <div className="flex md:flex-col gap-2 md:w-2/5 border-b md:border-b-0 md:border-r border-white/10 pr-2 overflow-x-auto">
                {loreData.map(item => (
                  <button key={item.id} onClick={() => setActiveLore(item)} className={`text-left px-4 py-3 rounded-lg text-sm flex items-center gap-3 transition-colors ${activeLore.id === item.id ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'text-white hover:text-[#00F0FF]'}`}>
                    {item.icon} {item.title}
                  </button>
                ))}
              </div>
              <div className="md:w-3/5 p-4 flex flex-col">
                <h4 className="font-serif text-2xl text-white mb-1">{activeLore.title}</h4>
                <p className="text-xs font-sans text-[#FF2A2A] mb-4 uppercase tracking-widest">{activeLore.subtitle}</p>
                <p className="text-white font-typewriter text-sm leading-relaxed text-justify mt-2">{activeLore.content}</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- FRAGMENTS --- */}
        <section id="fragments" className="max-w-7xl mx-auto px-4 mb-32 text-center">
          <h3 className="font-serif text-3xl text-white mb-12 uppercase tracking-widest">[ Fragments ]</h3>
          <p className="text-sm text-gray-400 mt-[-2rem] mb-10 font-sans">Recovered transmissions from across the multiverse.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-xl relative text-left group hover:border-[#00F0FF]/50 transition-colors">
              <Quote className="w-6 h-6 text-[#00F0FF]/30 mb-4" />
              <p className="font-typewriter text-white italic mb-6 leading-relaxed">"Every time I borrow the skills of my other selves, I lose a little memory of who I truly am."</p>
              <div className="text-sm font-sans text-white mt-auto">Luckas Lazuardi, <span className="text-[#00F0FF] font-bold">PRIME</span></div>
            </div>
            <div className="glass-panel p-6 rounded-xl relative text-left group hover:border-[#FF2A2A]/50 transition-colors">
              <Quote className="w-6 h-6 text-[#FF2A2A]/30 mb-4" />
              <p className="font-typewriter text-white italic mb-6 leading-relaxed">"My job was just to observe. But the protocols in my head are starting to feel like suggestions, not commands."</p>
              <div className="text-sm font-sans text-white mt-auto">Natasha, <span className="text-[#FF2A2A] font-bold">CUSTODIAN</span></div>
            </div>
            <div className="glass-panel p-6 rounded-xl relative text-left group hover:border-yellow-400/50 transition-colors">
              <Quote className="w-6 h-6 text-yellow-400/30 mb-4" />
              <p className="font-typewriter text-white italic mb-6 leading-relaxed">"There are twelve versions of you out there. The other eleven are trash."</p>
              <div className="text-sm font-sans text-white mt-auto">Mysterious Variant, <span className="text-yellow-400 font-bold">HUNTER</span></div>
            </div>
          </div>
        </section>

        {/* --- ABOUT AUTHOR --- */}
        <section id="about" className="max-w-7xl mx-auto px-4 mb-32 text-center">
          <h2 className="font-serif text-4xl text-white mb-16 uppercase tracking-wider">The Author</h2>
          
          <div className="flex flex-col lg:flex-row gap-10 items-stretch">
            
            {/* Left: Photo & Short Bio */}
            <div className="w-full lg:w-1/3 glass-panel p-8 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F0FF] opacity-10 blur-[50px] rounded-full"></div>
              
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_20px_rgba(0,240,255,0.15)] mb-6">
                 <img 
                   src="/author.jpeg" 
                   alt="Michael Dinko" 
                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                   onError={(e) => { e.target.src = "https://placehold.co/400x400/1a202c/00F0FF?text=Author" }}
                 />
              </div>
              
              <h3 className="font-serif text-3xl font-bold text-white mb-2">Michael Dinko</h3>
              <div className="w-12 h-0.5 bg-[#00F0FF] mb-4"></div>
              <p className="text-white font-typewriter text-sm italic leading-relaxed text-center relative z-10">
                "An identity fractured across three worlds, brought back together by a string of words."
              </p>
            </div>

            {/* Right: Three Worlds of the Author */}
            <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="glass-panel p-8 rounded-xl relative overflow-hidden group hover:border-[#00F0FF]/50 transition-colors flex flex-col justify-center">
                <Calculator className="w-10 h-10 text-[#00F0FF] mb-4" />
                <h3 className="font-serif text-2xl font-bold text-white mb-3">The Auditor</h3>
                <p className="text-white font-typewriter text-sm leading-relaxed">
                  By day, he navigates the labyrinth of government bureaucracy in Jakarta. Numbers and reports are his weapons, providing the raw material of tension and power dynamics for his fiction.
                </p>
              </div>
              
              <div className="glass-panel p-8 rounded-xl relative overflow-hidden group hover:border-[#3A86FF]/50 transition-colors flex flex-col justify-center">
                <FlaskConical className="w-10 h-10 text-[#3A86FF] mb-4" />
                <h3 className="font-serif text-2xl font-bold text-white mb-3">The Collector</h3>
                <p className="text-white font-typewriter text-sm leading-relaxed">
                  A niche perfume collector who believes scent is the most primal language that never lies. This sensory obsession seeps deeply into his work, building dense atmospheres in every scene he writes.
                </p>
              </div>
              
              <div className="glass-panel p-8 rounded-xl relative overflow-hidden group md:col-span-2 hover:border-[#FF2A2A]/50 transition-colors flex flex-col justify-center">
                <PenTool className="w-10 h-10 text-[#FF2A2A] mb-4" />
                <h3 className="font-serif text-2xl font-bold text-white mb-3">The Author</h3>
                <p className="text-white font-typewriter text-sm md:text-base leading-relaxed">
                  By night, he transforms bureaucratic frustration and sensory obsession into sci-fi thrillers. Writing is his way of exploring the blurred line between justice and revenge—a thin boundary separating victims from monsters.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* --- CONTACT SECTION --- */}
        <section id="contact" className="max-w-6xl mx-auto px-4 mb-20 grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          <div className="glass-panel p-8 rounded-xl space-y-8 flex flex-col">
            <h3 className="font-serif text-2xl text-white flex items-center gap-3"><Satellite className="text-[#00F0FF]" /> Comm Channels</h3>
            <div className="space-y-6 flex-grow">
              <div className="flex gap-4"><Mail className="text-[#00F0FF]" /> <div><p className="text-xs text-white uppercase tracking-wider mb-1">Primary Email</p><a href="mailto:michaeldinko01@gmail.com" className="text-white font-typewriter text-sm hover:text-[#00F0FF] transition-colors">michaeldinko01@gmail.com</a></div></div>
              <div className="flex gap-4"><InstagramIcon className="text-[#3A86FF]" /> <div><p className="text-xs text-white uppercase tracking-wider mb-1">Instagram</p><a href="https://instagram.com/michaeldinko01" target="_blank" rel="noreferrer" className="text-white font-typewriter text-sm hover:text-[#3A86FF] transition-colors">@michaeldinko01</a></div></div>
              <div className="flex gap-4"><BookOpen className="text-[#FF2A2A]" /> <div><p className="text-xs text-white uppercase tracking-wider mb-1">Royal Road</p><a href="https://www.royalroad.com/fiction/163820/nexus-echoes-of-another-self" target="_blank" rel="noreferrer" className="text-white font-typewriter text-sm hover:text-[#FF2A2A] transition-colors">NEXUS Fiction</a></div></div>
            </div>
            <div className="mt-8 border-l-4 border-[#00F0FF] p-4 bg-[#0A1128]/50"><p className="font-typewriter text-white italic text-sm">"Sometimes signals from another universe are clearer than chatter in an audit office."</p></div>
          </div>
          
          <div className="glass-panel p-8 rounded-xl">
            <h3 className="font-serif text-2xl text-white mb-6 flex items-center gap-3"><Send className="text-[#00F0FF]" /> Transmit Message</h3>
            <form className="space-y-6">
              <input type="text" placeholder="Identifier (Name)" className="w-full bg-[#0A1128]/60 border border-white/10 rounded-md py-3 px-4 text-white font-typewriter text-sm focus:border-[#00F0FF] outline-none" />
              <input type="email" placeholder="Email Frequency" className="w-full bg-[#0A1128]/60 border border-white/10 rounded-md py-3 px-4 text-white font-typewriter text-sm focus:border-[#00F0FF] outline-none" />
              <textarea rows="4" placeholder="Message Body" className="w-full bg-[#0A1128]/60 border border-white/10 rounded-md py-3 px-4 text-white font-typewriter text-sm focus:border-[#00F0FF] outline-none resize-none"></textarea>
              <button type="button" className="w-full bg-gradient-to-r from-[#00F0FF] to-[#3A86FF] text-[#0A1128] font-bold py-3 rounded-md flex justify-center gap-2 shadow-lg hover:shadow-[#00F0FF]/20 transition-all font-sans"><RadioTower /> Broadcast</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#060a18] py-8 text-center relative z-10">
        <div className="font-serif text-xl font-bold text-white tracking-widest uppercase flex items-center justify-center gap-3">
          <img src="/favicon.png" alt="Logo Small" className="w-5 h-5 opacity-80" />
          MICHAEL <span className="text-[#00F0FF]">DINKO</span>.
        </div>
        <p className="font-sans text-white text-[10px] mt-2 tracking-widest uppercase opacity-50">&copy; {new Date().getFullYear()} Michael Dinko. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
