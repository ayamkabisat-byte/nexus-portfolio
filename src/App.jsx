import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Compass, Mail, User, ChevronRight, Send, Database, Target, ShieldAlert, Cpu, Quote, Radio, Satellite, RadioTower, Calculator, FlaskConical, PenTool, X } from 'lucide-react';

// Ikon Instagram Manual (SVG)
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

// --- KOMPONEN EFEK HUJAN (FLUID CANVAS) ---
const RainEffect = () => {
  const canvasRef = useRef(null);
  const dropsRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    const wind = -0.5;
    const dropCount = 100;

    const initDrops = (w, h) => {
      const newDrops = [];
      for (let i = 0; i < dropCount; i++) {
        newDrops.push({
          x: Math.random() * w,
          y: Math.random() * h,
          length: Math.random() * 20 + 15,
          speed: Math.random() * 8 + 10,
          thickness: Math.random() * 1.5 + 0.8,
        });
      }
      return newDrops;
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      dropsRef.current = initDrops(width, height);
    };

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      dropsRef.current.forEach(drop => {
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
      animationRef.current = requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1] opacity-40"
      style={{ willChange: 'opacity' }}
    />
  );
};

// --- KOMPONEN UTAMA (APP) ---
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  
  const loreData = [
    {
      id: 'gawai_nexus',
      icon: <Cpu size={18} />,
      title: 'Gawai Nexus',
      subtitle: 'Artefak Kuantum Antar-Dimensi',
      content: 'Sebuah liontin logam perak kusam dengan pola geometris rumit dan batu sehitam obsidian. Benda ini bukan sekadar alat, melainkan "Kunci menuju Multiverse". Memungkinkan penggunanya meminjam keahlian (Gema Abadi) dari versi alternatif diri mereka melintasi batas semesta.'
    },
    {
      id: 'kustodian',
      icon: <Database size={18} />,
      title: 'Fraksi Kustodian',
      subtitle: 'Penjaga Stabilitas Kosmik',
      content: 'Organisasi antar-dimensi yang bertugas mencegah inkursi garis waktu dan paradoks yang mengancam realitas. Mereka menggunakan teknologi mutakhir seperti Portable Quantum Entanglement Communicator and Sequencer (PQECS) yang dienkripsi dan tak bisa diretas.'
    },
    {
      id: 'klasifikasi',
      icon: <ShieldAlert size={18} />,
      title: 'Klasifikasi Anomali',
      subtitle: 'Tingkatan Kekuatan (Tier)',
      content: 'Berdasarkan arsip Kustodian: Tingkat 1 (Gema) untuk peminjaman kemampuan non-invasif. Tingkat 2 (Manifestasi) yang melanggar hukum fiksi ilmiah lokal seperti telekinesis atau ledakan energi defensif. Tingkat 3 (Lengkungan) merupakan pembengkokan realitas absolut (Tingkat Dewa).'
    },
    {
      id: 'buronan',
      icon: <Target size={18} />,
      title: 'Sang Buronan',
      subtitle: 'Ancaman Multiverse Utama',
      content: 'Pengguna Nexus menyimpang dengan implan sibernetika mematikan di jantungnya. Alih-alih meminjam, ia merampas kemampuan dengan membunuh versi dirinya di semesta lain, merobek tatanan realitas demi mencari jalan pulang ke semesta asalnya.'
    }
  ];

  const featuredWorks = [
    { 
      id: "manifesto",
      title: "Manifesto", 
      genre: "Dystopian Thriller",
      src: "/Cover_Manifesto.webp",
      synopsis: "Di kota yang dibungkam oleh kabut polusi dan pengawasan absolut, sebuah topeng putih tanpa ekspresi menjadi satu-satunya simbol perlawanan. Manifesto bukanlah tentang siapa yang berada di balik topeng tersebut, melainkan tentang ide yang tak bisa dibunuh. Ketika seorang warga sipil biasa menemukan manuskrip terlarang, ia terseret ke dalam konspirasi besar yang mengancam para elit penguasa kota."
    },
    { 
      id: "sillage",
      title: "Sillage: Jejak Bisikan", 
      genre: "Mystery / Crime",
      src: "/Cover_Sillage.webp",
      synopsis: "Raka, seorang auditor yang pendiam, memiliki senjata yang tak dimiliki siapa pun: indra penciuman yang sangat tajam. Menyadari bahwa aroma adalah bahasa paling purba yang tak pernah berbohong, ia mulai mengupas lapisan-lapisan busuk dari sistem birokrasi kementerian tempatnya bekerja. Namun, saat batas antara keadilan dan balas dendam menipis, Raka harus memutuskan apakah ia adalah sang korban, atau monster baru yang sedang bangkit."
    },
    { 
      id: "nexus",
      title: "NEXUS", 
      genre: "Sci-Fi Thriller",
      src: "/Cover_Nexus.webp",
      synopsis: "Luckas Lazuardi, seorang pemuda biasa, menemukan Gawai Nexus yang memberinya akses untuk meminjam kemampuan dari versi alternatif dirinya di semesta lain. Namun, liontin tersebut juga menjadi suar yang menarik perhatian Kustodian dan seorang Buronan pembunuh antar-dimensi. Kini, ia harus lari, bukan hanya demi kebebasannya, namun demi mempertahankan eksistensinya di multiverse."
    }
  ];

  const [activeLore, setActiveLore] = useState(loreData[0]);

  useEffect(() => {
    if (selectedWork) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedWork]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close modal with Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && selectedWork) {
        setSelectedWork(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedWork]);

  // Handle form submit (prevent page reload)
  const handleSubmit = (e) => {
    e.preventDefault();
    // No actual submission logic - just prevent default reload
    console.log('Form submitted (demo)');
  };

  return (
    <div className="relative min-h-screen bg-[#0A1128] text-[#E2E8F0] font-sans selection:bg-[#00F0FF] selection:text-[#0A1128] overflow-x-hidden">
      
      {/* POP-UP DETAIL KARYA (MODAL) */}
      {selectedWork && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            className="absolute inset-0 bg-[#0A1128]/80 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setSelectedWork(null)}
            aria-hidden="true"
          ></div>
          
          <div className="relative glass-panel rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,240,255,0.15)] transform transition-all duration-300 scale-100 opacity-100 animate-in">
            <button 
              onClick={() => setSelectedWork(null)} 
              className="absolute top-4 right-4 p-2 bg-[#0A1128]/50 hover:bg-[#FF2A2A]/20 text-gray-400 hover:text-[#FF2A2A] rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF2A2A] focus:ring-offset-2 focus:ring-offset-[#0A1128] z-20"
              aria-label="Tutup arsip"
            >
              <X size={20} />
            </button>

            <div className="md:w-1/2 p-8 flex justify-center items-center bg-[#0A1128]/40 border-r border-white/5 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#00F0FF] opacity-10 blur-[60px] rounded-full pointer-events-none"></div>
              <img 
                src={selectedWork.src} 
                alt={`Sampul ${selectedWork.title}`} 
                className="w-full max-w-[240px] rounded-lg shadow-2xl border border-white/10 relative z-10 transition-transform duration-300 hover:scale-105"
                onError={(e) => e.target.src = `https://placehold.co/400x600/1a202c/00F0FF?text=${selectedWork.title}`}
              />
            </div>

            <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
              <h3 id="modal-title" className="font-serif text-3xl font-bold text-white mb-2">{selectedWork.title}</h3>
              <p className="font-sans text-[#00F0FF] text-xs font-bold tracking-[0.2em] uppercase mb-6">
                {selectedWork.genre}
              </p>
              
              <div className="w-12 h-0.5 bg-[#FF2A2A] mb-6"></div>
              
              <div className="font-sans text-gray-300 leading-relaxed text-justify text-sm space-y-4 mb-8">
                <p>{selectedWork.synopsis}</p>
              </div>

              <div className="mt-auto pt-6">
                <button 
                  onClick={() => setSelectedWork(null)}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#00F0FF] to-[#3A86FF] text-[#0A1128] font-bold rounded-md shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all duration-300 w-fit font-sans focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:ring-offset-2 focus:ring-offset-[#0A1128]"
                >
                  Tutup Arsip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .glass-panel {
          background: rgba(28, 43, 75, 0.35);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }
        .neon-text-glow { text-shadow: 0 0 15px rgba(0, 240, 255, 0.6); }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        .animate-float { animation: float 7s ease-in-out infinite; }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in { animation: fadeInScale 0.2s ease-out forwards; }
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

      <div className="fixed inset-0 pointer-events-none z-0 stars-bg"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#00F0FF]/10 via-[#3A86FF]/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0"></div>
      <RainEffect />

      <nav className={`fixed w-full z-40 transition-all duration-500 ${scrolled ? 'top-4' : 'top-8'}`}>
        <div className="max-w-5xl mx-auto px-4 flex justify-center">
          <div className="glass-panel rounded-full px-5 py-2.5 flex items-center gap-4 md:gap-6 transition-all duration-300 flex-wrap justify-center">
            <div className="flex items-center gap-2 pr-2 border-r border-white/10">
              <img src="/favicon.png" alt="Logo" className="w-6 h-6 object-contain" />
              <span className="font-serif font-bold text-xs tracking-tighter hidden sm:block uppercase">M. Dinko</span>
            </div>
            <a href="#home" className="text-xs md:text-sm font-medium text-white hover:text-[#00F0FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:ring-offset-2 focus:ring-offset-[#0A1128] rounded-full px-2">Beranda</a>
            <a href="#works" className="text-xs md:text-sm font-medium text-[#E2E8F0] hover:text-[#00F0FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:ring-offset-2 focus:ring-offset-[#0A1128] rounded-full px-2">Karya</a>
            <a href="#lore" className="text-xs md:text-sm font-medium text-[#E2E8F0] hover:text-[#00F0FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:ring-offset-2 focus:ring-offset-[#0A1128] rounded-full px-2">Lore</a>
            <a href="#about" className="text-xs md:text-sm font-medium text-[#E2E8F0] hover:text-[#00F0FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:ring-offset-2 focus:ring-offset-[#0A1128] rounded-full px-2">Profil</a>
            <a href="#contact" className="text-xs md:text-sm font-semibold text-[#00F0FF] hover:text-white bg-[#00F0FF]/10 px-4 py-1.5 rounded-full border border-[#00F0FF]/30 transition-all duration-300 hover:bg-[#00F0FF]/20 focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:ring-offset-2 focus:ring-offset-[#0A1128]">Kontak</a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20">
        <section id="home" className="min-h-[85vh] flex flex-col items-center justify-center px-4 mb-24 text-center">
          <h2 className="font-sans text-sm tracking-[0.3em] text-[#00F0FF] uppercase mb-4">Thriller Fiksi Ilmiah</h2>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-2 neon-text-glow">NEXUS</h1>
          <p className="font-serif italic text-xl text-gray-400 mb-10">Echoes of Another Self</p>

          <div className="relative group animate-float mb-12">
            <div className="relative w-56 md:w-72 aspect-[2/3] rounded-r-lg rounded-l-sm shadow-2xl border border-gray-700/50 overflow-hidden bg-[#0A1128] cursor-pointer transition-transform duration-300 hover:scale-105 focus-within:ring-2 focus-within:ring-[#00F0FF] focus-within:ring-offset-2" onClick={() => setSelectedWork(featuredWorks[2])} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setSelectedWork(featuredWorks[2])}>
              <img 
                src="/Cover_Nexus.webp" 
                alt="Sampul Novel Nexus" 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  if (!e.target.src.includes('placehold')) {
                    e.target.src = "https://placehold.co/400x600/0A1128/00F0FF?text=NEXUS";
                  }
                }} 
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <span className="font-sans text-white text-sm tracking-widest border border-white px-4 py-2 rounded-md">LIHAT SINOPSIS</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <a href="https://www.royalroad.com/fiction/163820/nexus-echoes-of-another-self" target="_blank" rel="noreferrer" className="px-8 py-3 bg-gradient-to-r from-[#00F0FF] to-[#3A86FF] text-[#0A1128] font-bold rounded-full shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 font-sans focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:ring-offset-2 focus:ring-offset-[#0A1128]">
              <BookOpen size={18} /> Mulai Membaca
            </a>
            <a href="#lore" className="px-8 py-3 glass-panel rounded-full text-white font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all duration-300 font-sans focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:ring-offset-2 focus:ring-offset-[#0A1128]">
              <Database size={18} className="text-[#00F0FF]"/> Akses Database
            </a>
          </div>
        </section>

        <section id="works" className="max-w-7xl mx-auto px-4 mb-32 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 glass-panel rounded-2xl p-8 flex flex-col">
            <h3 className="font-serif text-2xl text-white text-center mb-8 uppercase tracking-widest">Karya Terkait</h3>
            <div className="flex justify-center gap-6 flex-wrap">
              {featuredWorks.map((book) => (
                <div 
                  key={book.id} 
                  className="group relative cursor-pointer focus-within:ring-2 focus-within:ring-[#00F0FF] focus-within:ring-offset-2 focus-within:ring-offset-[#0A1128] rounded-md"
                  onClick={() => setSelectedWork(book)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedWork(book)}
                >
                  <img 
                    src={book.src} 
                    alt={`Sampul ${book.title}`}
                    className="w-24 md:w-28 rounded-md shadow-lg border border-white/10 transition-all duration-300 group-hover:-translate-y-2 object-cover aspect-[2/3]" 
                    onError={(e) => e.target.src = `https://placehold.co/200x300/1a202c/00F0FF?text=${book.title}`}
                  />
                  <div className="absolute inset-0 bg-[#00F0FF]/10 opacity-0 group-hover:opacity-100 rounded-md transition-opacity pointer-events-none"></div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="bg-[#0A1128] text-[#00F0FF] text-[10px] py-1 px-2 rounded font-mono border border-white/10">BACA</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div id="lore" className="lg:col-span-7 glass-panel rounded-2xl p-8 flex flex-col">
            <h3 className="font-serif text-2xl text-white text-center mb-8 uppercase tracking-widest">Database Lore</h3>
            <div className="flex flex-col md:flex-row gap-6 flex-grow">
              <div className="flex md:flex-col gap-2 md:w-2/5 border-b md:border-b-0 md:border-r border-white/10 pr-2 overflow-x-auto">
                {loreData.map(item => (
                  <button key={item.id} onClick={() => setActiveLore(item)} className={`text-left px-4 py-3 rounded-lg text-sm flex items-center gap-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00F0FF] ${activeLore.id === item.id ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                    {item.icon} {item.title}
                  </button>
                ))}
              </div>
              <div className="md:w-3/5 p-4 flex flex-col">
                <h4 className="font-serif text-2xl text-white mb-1">{activeLore.title}</h4>
                <p className="text-xs font-sans text-[#FF2A2A] mb-4 uppercase tracking-widest">{activeLore.subtitle}</p>
                <p className="text-gray-300 text-sm leading-relaxed text-justify">{activeLore.content}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="fragments" className="max-w-7xl mx-auto px-4 mb-32 text-center">
          <h3 className="font-serif text-3xl text-white mb-12 uppercase tracking-widest">[ Fragmen ]</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-xl relative text-left group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <Quote className="w-6 h-6 text-[#00F0FF]/30 mb-4" />
              <p className="font-serif text-gray-300 italic mb-6">"Setiap kali aku meminjam keahlian dari diriku yang lain, aku kehilangan sedikit ingatan tentang siapa aku sebenarnya."</p>
              <div className="text-sm font-sans text-gray-400 mt-auto">Luckas Lazuardi, <span className="text-[#00F0FF]">PRIME</span></div>
            </div>
            <div className="glass-panel p-6 rounded-xl relative text-left group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <Quote className="w-6 h-6 text-[#FF2A2A]/30 mb-4" />
              <p className="font-serif text-gray-300 italic mb-6">"Tugasku hanya mengamati. Tapi protokol di kepalaku mulai terasa seperti saran, bukan perintah."</p>
              <div className="text-sm font-sans text-gray-400 mt-auto">Natasha, <span className="text-[#FF2A2A]">KUSTODIAN</span></div>
            </div>
            <div className="glass-panel p-6 rounded-xl relative text-left group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <Quote className="w-6 h-6 text-yellow-400/30 mb-4" />
              <p className="font-serif text-gray-300 italic mb-6">"Ada dua belas versi dirimu di luar sana. Sebelas lainnya adalah sampah."</p>
              <div className="text-sm font-sans text-gray-400 mt-auto">Varian Hunter, <span className="text-yellow-400">HUNTER</span></div>
            </div>
          </div>
        </section>

        <section id="about" className="max-w-7xl mx-auto px-4 mb-32 text-center">
          <h2 className="font-serif text-4xl text-white mb-16 uppercase tracking-wider">Sang Penulis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-xl text-left relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <Calculator className="w-10 h-10 text-[#00F0FF] mb-6" />
              <h3 className="font-serif text-2xl font-bold text-white mb-3">Sang Auditor</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Di siang hari, ia menyusuri labirin birokrasi pemerintahan di Jakarta. Angka dan laporan adalah senjatanya.</p>
            </div>
            <div className="glass-panel p-8 rounded-xl text-left relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <FlaskConical className="w-10 h-10 text-[#3A86FF] mb-6" />
              <h3 className="font-serif text-2xl font-bold text-white mb-3">Sang Kolektor</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Seorang kolektor parfum niche yang percaya bahwa aroma adalah bahasa paling purba yang tak pernah berbohong.</p>
            </div>
            <div className="glass-panel p-8 rounded-xl text-left relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <PenTool className="w-10 h-10 text-[#FF2A2A] mb-6" />
              <h3 className="font-serif text-2xl font-bold text-white mb-3">Sang Penulis</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Di malam hari, ia mengubah birokrasi dan obsesi sensorik menjadi thriller fiksi ilmiah.</p>
            </div>
          </div>
        </section>

        <section id="contact" className="max-w-6xl mx-auto px-4 mb-20 grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          <div className="glass-panel p-8 rounded-xl space-y-8 flex flex-col">
            <h3 className="font-serif text-2xl text-white flex items-center gap-3"><Satellite className="text-[#00F0FF]" /> Jalur Komunikasi</h3>
            <div className="space-y-6 flex-grow">
              <div className="flex gap-4"><Mail className="text-[#00F0FF]" /> <div><p className="text-xs text-gray-400">Email Utama</p><a href="mailto:michaeldinko01@gmail.com" className="text-white hover:text-[#00F0FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00F0FF] rounded">michaeldinko01@gmail.com</a></div></div>
              <div className="flex gap-4"><InstagramIcon className="text-[#3A86FF]" /> <div><p className="text-xs text-gray-400">Instagram</p><a href="https://instagram.com/michaeldinko01" target="_blank" rel="noreferrer" className="text-white hover:text-[#3A86FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3A86FF] rounded">@michaeldinko01</a></div></div>
              <div className="flex gap-4"><BookOpen className="text-[#FF2A2A]" /> <div><p className="text-xs text-gray-400">Royal Road</p><a href="https://www.royalroad.com/fiction/163820/nexus-echoes-of-another-self" target="_blank" rel="noreferrer" className="text-white hover:text-[#FF2A2A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF2A2A] rounded">NEXUS Fiction</a></div></div>
            </div>
            <div className="mt-8 border-l-4 border-[#00F0FF] p-4 bg-[#0A1128]/50"><p className="font-serif text-gray-400 italic text-sm">"Kadang sinyal dari semesta lain lebih jelas daripada obrolan di kantor audit."</p></div>
          </div>
          <div className="glass-panel p-8 rounded-xl">
            <h3 className="font-serif text-2xl text-white mb-6 flex items-center gap-3"><Send className="text-[#00F0FF]" /> Kirim Transmisi</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="sr-only">Identifier (Nama)</label>
                <input type="text" id="name" placeholder="Identifier (Nama)" className="w-full bg-[#0A1128]/60 border border-white/10 rounded-md py-3 px-4 text-white focus:border-[#00F0FF] focus:outline-none focus:ring-1 focus:ring-[#00F0FF] transition-all font-sans" />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input type="email" id="email" placeholder="Email" className="w-full bg-[#0A1128]/60 border border-white/10 rounded-md py-3 px-4 text-white focus:border-[#00F0FF] focus:outline-none focus:ring-1 focus:ring-[#00F0FF] transition-all font-sans" />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Isi Pesan</label>
                <textarea id="message" rows="4" placeholder="Isi Pesan" className="w-full bg-[#0A1128]/60 border border-white/10 rounded-md py-3 px-4 text-white focus:border-[#00F0FF] focus:outline-none focus:ring-1 focus:ring-[#00F0FF] transition-all resize-none font-sans"></textarea>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-[#00F0FF] to-[#3A86FF] text-[#0A1128] font-bold py-3 rounded-md flex justify-center gap-2 shadow-lg hover:shadow-[#00F0FF]/20 transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:ring-offset-2 focus:ring-offset-[#0A1128]"><RadioTower /> Siarkan Pesan</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#060a18] py-8 text-center relative z-10">
        <div className="font-serif text-xl font-bold text-white tracking-widest uppercase flex items-center justify-center gap-3">
          <img src="/favicon.png" alt="Logo Small" className="w-5 h-5 opacity-80" />
          MICHAEL <span className="text-[#00F0FF]">DINKO</span>.
        </div>
        <p className="text-gray-600 text-[10px] mt-2 tracking-widest uppercase opacity-50">&copy; 2026 Michael Dinko. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}
