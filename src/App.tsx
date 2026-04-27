import React, { useState, useEffect, ReactNode } from 'react';
import { 
  MessageSquare, 
  Clock, 
  BookOpen, 
  Calculator, 
  MapPin, 
  Tv, 
  Phone,
  Mic,
  Heart, 
  Settings,
  Music,
  Timer,
  CloudLightning,
  Moon,
  ChevronRight,
  Send,
  Loader2,
  RefreshCw,
  Search,
  Compass,
  Calendar,
  Filter,
  Download,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { chatWithPersona, PersonaType, generateKhutbah, analyzeHafalan } from './services/geminiService';
import { translations, Language } from './translations';

// Fix for Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// --- Types ---
type TabType = 'Chat' | 'Prayer' | 'Quran' | 'Murottal' | 'Zakat' | 'Masjid' | 'Zikir' | 'Doa' | 'Events' | 'Khutbah' | 'LiveTV' | 'Ustadz' | 'Hafalan';

// --- Main App Component ---
export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('Chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lang, setLang] = useState<Language>('id');

  const t = translations[lang];

  return (
    <div className="flex h-screen overflow-hidden bg-islamic-cream">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 glass-panel transition-transform duration-300 transform 
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-islamic-green">
                <Moon className="w-6 h-6 text-islamic-gold fill-islamic-gold" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-islamic-green font-display">{t.appName}</h1>
            </div>
            <button 
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 hover:bg-islamic-green hover:text-white transition-all border border-slate-200"
            >
              {lang.toUpperCase()}
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto pr-2 scrollbar-none">
            <NavItem 
              icon={<MessageSquare className="w-5 h-5" />} 
              label={t.nav.chat} 
              active={activeTab === 'Chat'} 
              onClick={() => { setActiveTab('Chat'); setIsSidebarOpen(false); }} 
            />
            <NavItem 
              icon={<Clock className="w-5 h-5" />} 
              label={t.nav.prayer} 
              active={activeTab === 'Prayer'} 
              onClick={() => { setActiveTab('Prayer'); setIsSidebarOpen(false); }} 
            />
            <NavItem 
              icon={<BookOpen className="w-5 h-5" />} 
              label={t.nav.quran} 
              active={activeTab === 'Quran'} 
              onClick={() => { setActiveTab('Quran'); setIsSidebarOpen(false); }} 
            />
            <NavItem 
              icon={<Tv className="w-5 h-5" />} 
              label={t.nav.murottal} 
              active={activeTab === 'Murottal'} 
              onClick={() => { setActiveTab('Murottal'); setIsSidebarOpen(false); }} 
            />
            <div className="pt-4 pb-2">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'id' ? 'Fitur & Ibadah' : 'Features & Worship'}</p>
              <NavItem 
                icon={<Calculator className="w-5 h-5" />} 
                label={t.nav.zakat} 
                active={activeTab === 'Zakat'} 
                onClick={() => { setActiveTab('Zakat'); setIsSidebarOpen(false); }} 
              />
              <NavItem 
                icon={<MapPin className="w-5 h-5" />} 
                label={t.nav.masjid} 
                active={activeTab === 'Masjid'} 
                onClick={() => { setActiveTab('Masjid'); setIsSidebarOpen(false); }} 
              />
            <NavItem 
              icon={<MessageSquare className="w-5 h-5" />} 
              label={t.nav.khutbah} 
              active={activeTab === 'Khutbah'} 
              onClick={() => { setActiveTab('Khutbah'); setIsSidebarOpen(false); }} 
            />
            <NavItem 
              icon={<Phone className="w-5 h-5" />} 
              label={t.nav.ustadz} 
              active={activeTab === 'Ustadz'} 
              onClick={() => { setActiveTab('Ustadz'); setIsSidebarOpen(false); }} 
            />
            <NavItem 
              icon={<Calendar className="w-5 h-5" />} 
              label={t.nav.events} 
              active={activeTab === 'Events'} 
              onClick={() => { setActiveTab('Events'); setIsSidebarOpen(false); }} 
            />
            <NavItem 
              icon={<Tv className="w-5 h-5" />} 
              label={t.nav.livetv} 
              active={activeTab === 'LiveTV'} 
              onClick={() => { setActiveTab('LiveTV'); setIsSidebarOpen(false); }} 
            />
            <NavItem 
              icon={<Mic className="w-5 h-5" />} 
              label={t.nav.hafalan} 
              active={activeTab === 'Hafalan'} 
              onClick={() => { setActiveTab('Hafalan'); setIsSidebarOpen(false); }} 
            />
              <NavItem 
                icon={<Menu className="w-5 h-5" />} 
                label={t.nav.zikir} 
                active={activeTab === 'Zikir'} 
                onClick={() => { setActiveTab('Zikir'); setIsSidebarOpen(false); }} 
              />
              <NavItem 
                icon={<Heart className="w-5 h-5" />} 
                label={t.nav.doa} 
                active={activeTab === 'Doa'} 
                onClick={() => { setActiveTab('Doa'); setIsSidebarOpen(false); }} 
              />
            </div>
          </nav>

          <div className="pt-6 mt-4 border-t border-islamic-green/10">
            <NavItem 
              icon={<Settings className="w-5 h-5" />} 
              label={t.nav.settings} 
              active={activeTab === 'Settings'} 
              onClick={() => { setActiveTab('Settings'); setIsSidebarOpen(false); }} 
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header (Desktop: Info, Mobile: Menu) */}
        <header className="flex items-center justify-between p-4 lg:p-6 bg-white/30 backdrop-blur-sm">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-white shadow-sm lg:hidden hover:bg-slate-50 transition-colors"
          >
            <Menu className="w-6 h-6 text-islamic-green" />
          </button>
          
          <div className="flex-1 flex justify-center lg:justify-end gap-6 text-sm overflow-x-auto px-4 whitespace-nowrap">
            <div className="flex items-center gap-2 text-islamic-green font-medium">
              <BookOpen className="w-4 h-4" />
              <span>{t.appName} AI • {t.tagline}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <section className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'Chat' && <ChatView key="chat" lang={lang} />}
            {activeTab === 'Prayer' && <PrayerView key="prayer" lang={lang} />}
            {activeTab === 'Murottal' && <MurottalView key="murottal" lang={lang} />}
            {activeTab === 'Quran' && <QuranView key="quran" lang={lang} />}
            {activeTab === 'Zakat' && <ZakatView key="zakat" lang={lang} />}
            {activeTab === 'Masjid' && <MasjidView onBack={() => setActiveTab('Chat')} lang={lang} />}
            {activeTab === 'Doa' && <DoaView key="doa" lang={lang} />}
            {activeTab === 'Zikir' && <ZikirView key="zikir" lang={lang} />}
            {activeTab === 'Events' && <EventsView key="events" lang={lang} />}
            {activeTab === 'Khutbah' && <KhutbahGeneratorView key="khutbah" lang={lang} />}
            {activeTab === 'LiveTV' && <LiveTVView key="livetv" lang={lang} />}
            {activeTab === 'Ustadz' && <UstadzView key="ustadz" lang={lang} />}
            {activeTab === 'Hafalan' && <HafalanView key="hafalan" lang={lang} />}
            {activeTab === 'Settings' && <SettingsView key="settings" lang={lang} />}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

// --- Sub-components ---

function MasjidView({ onBack, lang }: { onBack: () => void, lang: Language }) {
  const labels = lang === 'id' ? {
    back: "Kembali",
    title: "Masjid Terdekat",
    sub: "Temukan tempat ibadah di sekitar Anda menggunakan data OpenStreetMap.",
    searchLoc: "Lokasi Pencarian",
    myLoc: "Lokasi Saya",
    placeholder: "Ketik alamat atau kota...",
    radius: "Radius Pencarian",
    radiusUnit: "meter",
    results: "Hasil Pencarian",
    distance: "Jarak",
    notFound: "Lokasi tidak ditemukan. Coba masukkan nama kota atau jalan.",
    searchError: "Gagal mencari alamat. Periksa koneksi internet Anda.",
    noGeo: "Browser Anda tidak mendukung lokasi.",
    geoError: "Gagal mengakses lokasi. Pastikan izin lokasi aktif.",
    searching: "Mencari...",
    loading: "Memuat masjid...",
    distanceUnit: "m"
  } : {
    back: "Back",
    title: "Nearby Mosques",
    sub: "Find places of worship around you using OpenStreetMap data.",
    searchLoc: "Search Location",
    myLoc: "My Location",
    placeholder: "Type address or city...",
    radius: "Search Radius",
    radiusUnit: "meters",
    results: "Search Results",
    distance: "Distance",
    notFound: "Location not found. Try entering a city or street name.",
    searchError: "Failed to search address. Check your internet connection.",
    noGeo: "Your browser does not support geolocation.",
    geoError: "Failed to access location. Ensure location permission is active.",
    searching: "Searching...",
    loading: "Loading mosques...",
    distanceUnit: "m"
  };
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState(1500);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<any>(null);
  const [mosques, setMosques] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setMosques([]);
    try {
      const results = await searchAddress(query);
      setCandidates(results);
      if (results.length > 0) {
        setSelectedLoc(results[0]);
      } else {
        alert("Lokasi tidak ditemukan. Coba masukkan nama kota atau jalan.");
      }
    } catch (e) {
      alert("Gagal mencari alamat. Periksa koneksi internet Anda.");
    } finally {
      setSearching(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung lokasi.");
      return;
    }
    setSearching(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
        const data = await res.json();
        const loc = {
          display_name: data.display_name,
          lat: latitude.toString(),
          lon: longitude.toString()
        };
        setCandidates([loc]);
        setSelectedLoc(loc);
        setQuery(data.address?.city || data.address?.town || data.display_name);
      } catch (e) {
        console.error(e);
        // Fallback: just use coords
        const fallback = { display_name: "Lokasi Anda", lat: latitude.toString(), lon: longitude.toString() };
        setCandidates([fallback]);
        setSelectedLoc(fallback);
      } finally {
        setSearching(false);
      }
    }, (err) => {
      alert("Gagal mengakses lokasi. Pastikan izin lokasi aktif.");
      setSearching(false);
    });
  };

  const handleFetchMosques = async (loc: any) => {
    setLoading(true);
    try {
      const results = await fetchNearbyMosques(parseFloat(loc.lat), parseFloat(loc.lon), radius);
      setMosques(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLoc) {
      handleFetchMosques(selectedLoc);
    }
  }, [selectedLoc, radius]);

  const mapCenter: [number, number] = selectedLoc 
    ? [parseFloat(selectedLoc.lat), parseFloat(selectedLoc.lon)] 
    : [-2.973, 104.75]; // Default Palembang

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-6 pb-20">
      <button onClick={onBack} className="flex items-center gap-2 text-islamic-green font-bold hover:underline">
        <ChevronRight className="rotate-180 w-5 h-5" /> {labels.back}
      </button>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-islamic-green font-display flex items-center justify-center gap-2">
          🕌 {labels.title}
        </h2>
        <p className="text-slate-500 text-sm">{labels.sub}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{labels.searchLoc}</label>
                <button 
                  onClick={handleUseCurrentLocation}
                  className="text-[10px] bg-islamic-green/10 text-islamic-green px-2 py-1 rounded-md font-bold hover:bg-islamic-green hover:text-white transition-all flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" /> {labels.myLoc}
                </button>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={labels.placeholder}
                  className="w-full bg-slate-50 border border-slate-100 focus:border-islamic-green rounded-xl px-4 py-3 text-sm transition-all outline-none"
                />
                <button 
                  onClick={handleSearch}
                  disabled={searching}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-islamic-green hover:bg-islamic-green/10 rounded-lg transition-all"
                >
                  {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {candidates.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Pilih Alamat</label>
                <select 
                  className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs outline-none"
                  onChange={(e) => setSelectedLoc(candidates[parseInt(e.target.value)])}
                >
                  {candidates.map((c, i) => (
                    <option key={i} value={i}>{c.display_name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Radius: {radius}m</label>
                <Compass className="w-4 h-4 text-islamic-gold" />
              </div>
              <input 
                type="range" 
                min="300" 
                max="4000" 
                step="100" 
                value={radius} 
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-islamic-green"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>300m</span>
                <span>4km</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-4">
             <h3 className="font-bold text-islamic-green flex items-center gap-2">
               📝 Daftar Temuan ({mosques.length})
             </h3>
             <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-none">
                {loading ? (
                  <div className="flex flex-col items-center py-6 gap-2">
                    <Loader2 className="w-6 h-6 text-islamic-green animate-spin" />
                    <span className="text-xs text-slate-400">Scanning area...</span>
                  </div>
                ) : mosques.length > 0 ? (
                  mosques.map((m, i) => (
                    <div key={i} className="p-3 bg-white hover:bg-islamic-green/5 rounded-xl border border-slate-50 transition-all cursor-pointer group">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-islamic-green transition-colors">
                        {m.tags.name || "Masjid / Musholla"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium truncate italic">
                        {m.tags['addr:street'] || "Detail alamat tidak tersedia"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">Gunakan pencarian untuk menemukan masjid.</p>
                )}
             </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-8 h-[500px] lg:h-[700px] glass-panel rounded-3xl overflow-hidden relative border-4 border-white shadow-2xl">
          <MapContainer center={mapCenter} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ChangeView center={mapCenter} zoom={15} />
            <Marker position={mapCenter}>
              <Popup>Lokasi Anda</Popup>
            </Marker>
            {mosques.map((m, i) => {
              const pos: [number, number] = [
                m.lat || m.center?.lat,
                m.lon || m.center?.lon
              ];
              if (!pos[0] || !pos[1]) return null;
              return (
                <Marker key={i} position={pos} icon={L.divIcon({
                  html: `<div class="bg-islamic-green text-white p-1.5 rounded-full shadow-lg border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
                  className: '',
                  iconSize: [32, 32],
                  iconAnchor: [16, 32]
                })}>
                  <Popup>
                    <div className="p-2">
                      <p className="font-bold text-islamic-green mb-1">{m.tags.name || "Masjid"}</p>
                      <p className="text-xs text-slate-500">{m.tags.religion === 'muslim' ? 'Rumah Ibadah Muslim' : 'Kategori Bangunan'}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </motion.div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
        ${active 
          ? 'bg-islamic-green text-white shadow-lg shadow-islamic-green/20' 
          : 'text-slate-600 hover:bg-islamic-green/5 hover:text-islamic-green'}
      `}
    >
      {icon}
      <span className="font-medium">{label}</span>
      {active && <motion.div layoutId="activeDot" className="ml-auto w-1.5 h-1.5 rounded-full bg-islamic-gold" />}
    </button>
  );
}

function ChatView({ lang }: { lang: Language, key?: string }) {
  const t = translations[lang].chat;
  const personaSpecs: { id: PersonaType, label: string, desc: string }[] = lang === 'id' ? [
    { id: 'Fiqh', label: 'FiqhBot', desc: 'Tanya jawab seputar hukum Islam, ibadah, dan madzhab.' },
    { id: 'Sirah', label: 'SirahBot', desc: 'Pelajari kisah hidup Rasulullah SAW dan para sahabat.' },
    { id: 'Tarikh', label: 'TarikhBot', desc: 'Eksplorasi sejarah kejayaan Islam dan tokoh dunia.' },
    { id: 'Nusantara', label: 'NusantaraBot', desc: 'Tradisi Islam di Indonesia, Wali Songo, dan budaya lokal.' },
    { id: 'Muamalah', label: 'MuamalahBot', desc: 'Diskusi ekonomi syariah, zakat, dan etika bisnis.' },
    { id: 'GenZ', label: 'GenZBot', desc: 'Curhat dan diskusi masalah harian dengan gaya anak muda.' },
    { id: 'Muallaf', label: 'MuallafBot', desc: 'Panduan ramah untuk yang baru mengenal dan memeluk Islam.' },
    { id: 'Kids', label: 'KidsBot', desc: 'Teman belajar agama yang ramah dan ceria untuk anak-anak.' },
  ] : [
    { id: 'Fiqh', label: 'FiqhBot', desc: 'Islamic law, worship, and schools of thought Q&A.' },
    { id: 'Sirah', label: 'SirahBot', desc: "Learn about the life of Prophet Muhammad ﷺ and his companions." },
    { id: 'Tarikh', label: 'TarikhBot', desc: 'Explore the golden history of Islam and world figures.' },
    { id: 'Nusantara', label: 'NusantaraBot', desc: 'Islamic traditions in Indonesia, Wali Songo, and local culture.' },
    { id: 'Muamalah', label: 'MuamalahBot', desc: 'Sharia economy, zakat, and business ethics discussions.' },
    { id: 'GenZ', label: 'GenZBot', desc: 'Chat about daily life with a youthful perspective.' },
    { id: 'Muallaf', label: 'MuallafBot', desc: 'Friendly guidance for those new to and embracing Islam.' },
    { id: 'Kids', label: 'KidsBot', desc: 'A friendly and cheerful religious learning companion for children.' },
  ];

  const getWelcomeMessage = (persona: PersonaType): string => t.getWelcome(persona);

  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('Fiqh');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: getWelcomeMessage('Fiqh') }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const activeSpec = personaSpecs.find(s => s.id === selectedPersona);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.text }]
    }));

    const aiResponse = await chatWithPersona(selectedPersona, userMsg, history);
    setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto h-[calc(100dvh-100px)] md:h-[calc(100vh-140px)] flex flex-col gap-2 md:gap-6"
    >
      <div className="space-y-1 md:space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="px-1">
            <h2 className="text-base md:text-2xl font-bold text-islamic-green flex items-center gap-2">
              🤖 {t.welcomeTitle}
            </h2>
          </div>
        </div>

        {/* Persona Selection - Horizontal Scroll on Mobile */}
        <div className="flex overflow-x-auto pb-1 md:pb-2 gap-1.5 md:gap-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 whitespace-nowrap">
          {personaSpecs.map(p => (
            <button
              key={p.id}
              onClick={() => {
                const welcome = getWelcomeMessage(p.id);
                setSelectedPersona(p.id);
                setMessages([{ role: 'assistant', text: welcome }]);
              }}
              className={`
                px-3 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-semibold transition-all border shrink-0
                ${selectedPersona === p.id 
                  ? 'bg-islamic-green text-white border-islamic-green shadow-sm scale-[1.02]' 
                  : 'bg-white text-slate-600 border-slate-200'}
              `}
            >
              {p.label}
            </button>
          ))}
        </div>

        {activeSpec && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="p-1.5 md:p-2 bg-islamic-gold/10 border-l-2 md:border-l-4 border-islamic-gold rounded-r-lg"
          >
            <p className="text-[9px] md:text-xs text-islamic-green leading-tight">
              <span className="font-bold">{activeSpec.label}</span> — {activeSpec.desc}
            </p>
          </motion.div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 glass-panel rounded-xl md:rounded-3xl p-2 md:p-6 overflow-y-auto space-y-3 md:space-y-6 flex flex-col">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[92%] md:max-w-[85%] px-3 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl text-sm md:text-base leading-relaxed shadow-sm
              ${m.role === 'user' 
                ? 'bg-islamic-green text-white rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}
            `}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-5 py-3 rounded-2xl rounded-tl-none border border-slate-100">
              <Loader2 className="w-5 h-5 text-islamic-green animate-spin" />
              <span className="ml-2 text-xs text-slate-400">{t.loading}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 md:gap-4 items-end pb-2 md:pb-4">
        <div className="flex-1 relative group">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={t.placeholder}
            className="w-full bg-white rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 pr-12 md:pr-16 shadow-lg border-2 border-transparent focus:border-islamic-green focus:ring-0 resize-none text-slate-800 transition-all text-sm md:text-base"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 md:right-4 bottom-2 md:bottom-3 p-2 md:p-2.5 rounded-lg md:rounded-xl bg-islamic-green text-white disabled:opacity-50 transition-all hover:bg-slate-800 active:scale-95 shadow-md"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function MurottalView({ lang }: { lang: Language, key?: string }) {
  const labels = lang === 'id' ? {
    title: "Murottal 24 Jam",
    sub: "Dengarkan bacaan Al-Qur'an nonstop dengan berbagai pilihan qori internasional. Sumber audio streaming dari mp3quran.net.",
    loading: "Mencari frekuensi murottal...",
    select: "Pilih Qori / Channel"
  } : {
    title: "24-Hour Murottal",
    sub: "Listen to non-stop Quran recitations with various international reciters. Audio source from mp3quran.net.",
    loading: "Searching for recitations...",
    select: "Select Reciter / Channel"
  };
  const [radios, setRadios] = useState<any[]>([]);
  const [selectedRadio, setSelectedRadio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://mp3quran.net/api/v3/radios")
      .then(res => res.json())
      .then(data => {
        const radioData = data.radios || [];
        setRadios(radioData);
        if (radioData.length > 0) setSelectedRadio(radioData[0]);
      })
      .catch(err => console.error("Radio API Error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-8 pb-20"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-islamic-green flex items-center justify-center gap-3">
          📻 {labels.title}
        </h2>
        <p className="text-slate-600 max-w-lg mx-auto">
          {labels.sub}
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl space-y-8 transition-all hover:shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-4">
            <Loader2 className="w-10 h-10 text-islamic-green animate-spin" />
            <p className="text-slate-400 animate-pulse font-medium">{labels.loading}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-islamic-green uppercase tracking-widest ml-1">{labels.select}</label>
              <select 
                value={selectedRadio?.id} 
                onChange={(e) => setSelectedRadio(radios.find(r => r.id === parseInt(e.target.value)))}
                className="w-full bg-islamic-cream/50 border-2 border-transparent focus:border-islamic-green rounded-2xl px-6 py-4 text-lg font-semibold text-slate-800 shadow-sm transition-all outline-none"
              >
                {radios.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            {selectedRadio && (
              <motion.div 
                key={selectedRadio.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="bg-islamic-green p-8 rounded-2xl text-center shadow-inner relative overflow-hidden">
                   {/* Animated Background effect */}
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')] animate-pulse" />
                  
                  <div className="relative z-10">
                    <p className="text-islamic-gold text-xs font-bold uppercase tracking-widest mb-2 opacity-80">Now Streaming</p>
                    <h3 className="text-2xl font-bold text-white mb-6 font-display">{selectedRadio.name}</h3>
                    <audio 
                      key={selectedRadio.url}
                      controls 
                      autoPlay
                      className="w-full h-12 filter drop-shadow-lg"
                    >
                      <source src={selectedRadio.url || selectedRadio.radio_url} type="audio/mpeg" />
                    </audio>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-islamic-gold/5 rounded-xl border border-islamic-gold/20">
                  <div className="p-2 bg-islamic-gold rounded-full">
                    <Heart className="w-4 h-4 text-white fill-current" />
                  </div>
                  <p className="text-sm text-islamic-green font-medium">
                    Semoga lantunan ayat suci ini membawa keberkahan dan ketenangan bagi jiwa Anda.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function PrayerView({ lang }: { lang: Language, key?: string }) {
  const labels = lang === 'id' ? {
    title: "Waktu Sholat Harian",
    detect: "Ambil Lokasi Saya",
    city: "Kota",
    country: "Negara",
    method: "Metode",
    next: "Sholat Berikutnya",
    remaining: "Mundur",
    loading: "Memuat jadwal...",
    now: "Sekarang",
    fajr: "Subuh",
    dhuhr: "Dzuhur",
    asr: "Ashar",
    maghrib: "Maghrib",
    isha: "Isya",
    hourSuffix: " jam ",
    minuteSuffix: " menit "
  } : {
    title: "Daily Prayer Times",
    detect: "Detect My Location",
    city: "City",
    country: "Country",
    method: "Method",
    next: "Next Prayer",
    remaining: "Countdown",
    loading: "Loading schedule...",
    now: "Current",
    fajr: "Fajr",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    hourSuffix: "h ",
    minuteSuffix: "m "
  };

  const [city, setCity] = useState("Palembang");
  const [country, setCountry] = useState("Indonesia");
  const [method, setMethod] = useState(15); // Moonsighting Committee
  const [times, setTimes] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [nextPrayer, setNextPrayer] = useState<{ name: string, time: string, remaining: string } | null>(null);

  const methods = [
    { id: 1, name: "Univ. of Islamic Sciences, Karachi" },
    { id: 2, name: "Islamic Society of North America (ISNA)" },
    { id: 3, name: "Muslim World League (MWL)" },
    { id: 4, name: "Umm Al-Qura University, Makkah" },
    { id: 5, name: "Egyptian General Authority of Survey" },
    { id: 11, name: "Majlis Ugama Islam Singapura (MUIS)" },
    { id: 13, name: "Diyanet Isleri Baskanligi, Turkey" },
    { id: 15, name: "Moonsighting Committee Worldwide" },
  ];

  const fetchTimes = async (c: string, co: string, m: number) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${c}&country=${co}&method=${m}`);
      const data = await res.json();
      if (data.data) {
        setTimes(data.data.timings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimes(city, country, method);
  }, []);

  // Update countdown every minute
  useEffect(() => {
    if (!times) return;

    const interval = setInterval(() => {
      const now = new Date();
      const relevant = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      const schedules = relevant.map(name => {
        const [h, m] = times[name].split(':');
        const pDate = new Date();
        pDate.setHours(parseInt(h), parseInt(m), 0);
        return { name, time: times[name], date: pDate };
      });

      let next = schedules.find(s => s.date > now);
      if (!next) {
        // If all passed, next is Fajr tomorrow
        const [h, m] = times['Fajr'].split(':');
        const pDate = new Date();
        pDate.setDate(pDate.getDate() + 1);
        pDate.setHours(parseInt(h), parseInt(m), 0);
        next = { name: 'Fajr', time: times['Fajr'], date: pDate };
      }

      const diff = next.date.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setNextPrayer({
        name: next.name,
        time: next.time,
        remaining: `${hours > 0 ? `${hours}${labels.hourSuffix}` : ""}${mins}${labels.minuteSuffix}`
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [times]);

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        const data = await res.json();
        const newCity = data.city || data.locality || city;
        const newCountry = data.countryName || country;
        setCity(newCity);
        setCountry(newCountry);
        fetchTimes(newCity, newCountry, method);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    });
  };

  const getPrayerName = (eng: string) => {
    switch(eng) {
      case 'Fajr': return labels.fajr;
      case 'Dhuhr': return labels.dhuhr;
      case 'Asr': return labels.asr;
      case 'Maghrib': return labels.maghrib;
      case 'Isha': return labels.isha;
      default: return eng;
    }
  };

  const prayerIcons = {
    Fajr: <Moon className="w-5 h-5" />,
    Dhuhr: <span className="text-xl">☀️</span>,
    Asr: <span className="text-xl">🌤️</span>,
    Maghrib: <span className="text-xl">🌅</span>,
    Isha: <Moon className="w-5 h-5" />
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6 pb-20"
    >
      {/* Header & Settings */}
      <div className="glass-panel p-6 rounded-3xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-islamic-green flex items-center gap-2">
              🕌 {labels.title}
            </h2>
            <p className="text-sm text-slate-500">{city}, {country}</p>
          </div>
          <button 
            onClick={detectLocation}
            className="flex items-center gap-2 px-4 py-2 bg-islamic-green/10 text-islamic-green rounded-full text-sm font-medium hover:bg-islamic-green hover:text-white transition-all"
          >
            <MapPin className="w-4 h-4" />
            {labels.detect}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase ml-1">{labels.city}</label>
            <input 
              type="text" 
              value={city} 
              onChange={(e) => setCity(e.target.value)}
              onBlur={() => fetchTimes(city, country, method)}
              className="w-full bg-islamic-cream/50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-islamic-green transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase ml-1">{labels.country}</label>
            <input 
              type="text" 
              value={country} 
              onChange={(e) => setCountry(e.target.value)}
              onBlur={() => fetchTimes(city, country, method)}
              className="w-full bg-islamic-cream/50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-islamic-green transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase ml-1">{labels.method}</label>
            <select 
              value={method} 
              onChange={(e) => {
                const m = parseInt(e.target.value);
                setMethod(m);
                fetchTimes(city, country, m);
              }}
              className="w-full bg-islamic-cream/50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-islamic-green transition-all"
            >
              {methods.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Next Prayer Alert */}
      {nextPrayer && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg border border-emerald-400/30 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs opacity-90 font-medium">{labels.next}</p>
              <h4 className="font-bold text-lg">{getPrayerName(nextPrayer.name)} — {nextPrayer.time}</h4>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-90 font-medium">{labels.remaining}</p>
            <p className="font-bold">≈ {nextPrayer.remaining}</p>
          </div>
        </motion.div>
      )}

      {/* Prayer List */}
      <div className="grid gap-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="w-10 h-10 text-islamic-green animate-spin" />
            <p className="text-slate-400 font-medium animate-pulse">{labels.loading}</p>
          </div>
        ) : times && (
          Object.entries(times).filter(([name]) => ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(name)).map(([name, time]) => {
            const isNext = nextPrayer?.name === name;
            return (
              <div 
                key={name} 
                className={`
                  flex items-center justify-between p-5 rounded-2xl transition-all duration-300
                  ${isNext 
                    ? 'bg-white shadow-xl border-l-4 border-islamic-gold ring-1 ring-black/5' 
                    : 'glass-panel hover:bg-white'}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    p-3 rounded-xl transition-colors
                    ${isNext ? 'bg-islamic-green text-white' : 'bg-islamic-green/5 text-islamic-green'}
                  `}>
                    {prayerIcons[name as keyof typeof prayerIcons]}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isNext ? 'text-islamic-green' : 'text-slate-800'}`}>
                      {getPrayerName(name)}
                      {isNext && <span className="ml-2 text-[10px] bg-islamic-gold/20 text-islamic-gold px-2 py-0.5 rounded-full uppercase tracking-widest">{labels.now}</span>}
                    </h3>
                  </div>
                </div>
                <div className={`text-2xl font-bold tracking-wider ${isNext ? 'text-islamic-green' : 'text-slate-600 opacity-80'}`}>
                  {time}
                </div>
              </div>
            );
          })
        )}
      </div>

      <p className="text-center text-xs text-slate-400 italic">
        * Hitung mundur diperbarui secara real-time setiap menit.
      </p>
    </motion.div>
  );
}

const JUZ_STARTS: Record<number, { surah: number, ayat: number }> = {
  1: { surah: 1, ayat: 1 }, 2: { surah: 2, ayat: 142 }, 3: { surah: 2, ayat: 253 }, 4: { surah: 3, ayat: 93 }, 5: { surah: 4, ayat: 24 },
  6: { surah: 4, ayat: 148 }, 7: { surah: 5, ayat: 82 }, 8: { surah: 6, ayat: 111 }, 9: { surah: 7, ayat: 88 }, 10: { surah: 8, ayat: 41 },
  11: { surah: 9, ayat: 93 }, 12: { surah: 11, ayat: 6 }, 13: { surah: 12, ayat: 53 }, 14: { surah: 15, ayat: 1 }, 15: { surah: 17, ayat: 1 },
  16: { surah: 18, ayat: 75 }, 17: { surah: 21, ayat: 1 }, 18: { surah: 23, ayat: 1 }, 19: { surah: 25, ayat: 21 }, 20: { surah: 27, ayat: 56 },
  21: { surah: 29, ayat: 46 }, 22: { surah: 33, ayat: 31 }, 23: { surah: 36, ayat: 28 }, 24: { surah: 39, ayat: 32 }, 25: { surah: 41, ayat: 47 },
  26: { surah: 46, ayat: 1 }, 27: { surah: 51, ayat: 31 }, 28: { surah: 58, ayat: 1 }, 29: { surah: 67, ayat: 1 }, 30: { surah: 78, ayat: 1 },
};

const OZT_TO_GRAM = 31.1034768;

async function fetchGoldPriceData(): Promise<{ price: number; source: string }> {
  const key = process.env.GOLDAPI_KEY;
  if (!key) throw new Error("GOLDAPI_KEY tidak dikonfigurasi");

  const headers = { "x-access-token": key };

  try {
    const res = await fetch("https://www.goldapi.io/api/XAU/IDR", { headers });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    
    if (data.price_gram_24k) {
      return { price: data.price_gram_24k, source: "GoldAPI XAU/IDR (24k)" };
    }
    if (data.price) {
      return { price: data.price / OZT_TO_GRAM, source: "GoldAPI XAU/IDR (Ozt Fallback)" };
    }
  } catch (e) {
    console.warn("XAU/IDR failed, trying USD fallback", e);
  }

  try {
    const res = await fetch("https://www.goldapi.io/api/XAU/USD", { headers });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    const usdPerGram = data.price_gram_24k || (data.price / OZT_TO_GRAM);
    const fxRes = await fetch("https://open.er-api.com/v6/latest/USD");
    const fxData = await fxRes.json();
    const usdIdr = fxData.rates.IDR;

    return { price: usdPerGram * usdIdr, source: "GoldAPI XAU/USD + FX" };
  } catch (e) {
    throw new Error("Gagal mengambil harga emas otomatis");
  }
}

// --- Masjid & Geolocation Helpers ---
async function searchAddress(q: string): Promise<any[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=id&addressdetails=1&limit=5`;
  const res = await fetch(url, { headers: { 'User-Agent': 'SmartFaith/1.0' } });
  return await res.json();
}

async function fetchNearbyMosques(lat: number, lon: number, radius: number) {
  const nameRegex = "masjid|musholl?a|mushol?a|mus(ha)?ll?a|musala|surau|langgar|prayer.?room";
  const overpassQuery = `[out:json][timeout:25];(node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});node["amenity"="place_of_worship"]["name"~"${nameRegex}",i](around:${radius},${lat},${lon});way["amenity"="place_of_worship"]["name"~"${nameRegex}",i](around:${radius},${lat},${lon});node["building"="mosque"](around:${radius},${lat},${lon});way["building"="mosque"](around:${radius},${lat},${lon}););out center;`;

  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.osm.ch/api/interpreter"
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${ep}?data=${encodeURIComponent(overpassQuery)}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (res.status === 429) {
        console.warn(`Endpoint ${ep} is rate limited, trying next...`);
        continue;
      }
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      return data.elements || [];
    } catch (e) {
      console.warn(`Overpass endpoint ${ep} failed:`, e);
    }
  }
  return []; // Return empty instead of crashing if all fail
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function QuranView({ lang }: { lang: Language, key?: string }) {
  const labels = lang === 'id' ? {
    title: "Al-Qur’an Digital",
    sub: "Sumber data: EQuran.id • Teks/tafsir Kemenag • Audio via CDN",
    lastRead: "Terakhir Baca",
    surahList: "Daftar Surah",
    closeTafsir: "Tutup Tafsir",
    showTafsir: "Lihat Tafsir",
    tafsirTitle: "Tafsir Kemenag",
    loading: "Menyusun mushaf...",
    latin: "LATIN",
    translation: "TERJEMAHAN",
    search: "Cari Surah (contoh: Al-Fatihah)...",
    memorize: "Mode Latihan Hafalan",
    reset: "Reset",
    addRep: "Tambah Ulangan",
    clear: "Kosongkan Daftar",
    target: "Target Hafalan",
    savedAyat: "Ayat Tersimpan",
    juzNav: "Navigasi Juz"
  } : {
    title: "Digital Quran",
    sub: "Source: EQuran.id • Kemenag text/tafsir • Audio via CDN",
    lastRead: "Continue Reading",
    surahList: "Surah List",
    closeTafsir: "Close Tafsir",
    showTafsir: "View Tafsir",
    tafsirTitle: "Kemenag Tafsir",
    loading: "Arranging pages...",
    latin: "TRANSLITERATION",
    translation: "TRANSLATION",
    search: "Search Surah (e.g., Al-Fatihah)...",
    memorize: "Memorization Mode",
    reset: "Reset",
    addRep: "Add Repetition",
    clear: "Clear List",
    target: "Hifz Target",
    savedAyat: "Saved Verses",
    juzNav: "Juz Navigation"
  };
  const [surahs, setSurahs] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<any>(null);
  const [verses, setVerses] = useState<any[]>([]);
  const [tafsir, setTafsir] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showTafsir, setShowTafsir] = useState(false);

  // Persistence
  const [lastRead, setLastRead] = useState(() => {
    const saved = localStorage.getItem('smartfaith_last_read');
    return saved ? JSON.parse(saved) : { surah: 1, ayat: 1 };
  });

  const [hafalanItems, setHafalanItems] = useState<any[]>(() => {
    const saved = localStorage.getItem('smartfaith_hafalan');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetch("https://equran.id/api/v2/surat")
      .then(res => res.json())
      .then(data => setSurahs(data.data));
  }, []);

  useEffect(() => {
    localStorage.setItem('smartfaith_hafalan', JSON.stringify(hafalanItems));
  }, [hafalanItems]);

  const fetchVerses = async (nomor: number, scrollAyat?: number) => {
    setLoading(true);
    setSelectedSurah(null); // Clear first for transition
    setVerses([]);
    setTafsir(null);
    setShowTafsir(false);
    
    try {
      const res = await fetch(`https://equran.id/api/v2/surat/${nomor}`);
      const data = await res.json();
      setSelectedSurah(data.data);
      setVerses(data.data.ayat);

      if (scrollAyat) {
        setTimeout(() => {
          const el = document.getElementById(`ayat-${scrollAyat}`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTafsir = async (nomor: number) => {
    if (tafsir) {
      setShowTafsir(!showTafsir);
      return;
    }
    try {
      const res = await fetch(`https://equran.id/api/v2/tafsir/${nomor}`);
      const data = await res.json();
      setTafsir(data.data);
      setShowTafsir(true);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleHafalan = (v: any) => {
    const key = `${selectedSurah.nomor}:${v.nomorAyat}`;
    const exists = hafalanItems.find(item => item.key === key);
    if (exists) {
      setHafalanItems(prev => prev.filter(item => item.key !== key));
    } else {
      setHafalanItems(prev => [...prev, { 
        key, 
        surahNo: selectedSurah.nomor, 
        surahName: selectedSurah.namaLatin, 
        ayatNo: v.nomorAyat,
        arab: v.teksArab,
        reps: 0
      }]);
    }
  };

  const markLastRead = (nomorAyat: number) => {
    const data = { surah: selectedSurah.nomor, ayat: nomorAyat };
    setLastRead(data);
    localStorage.setItem('smartfaith_last_read', JSON.stringify(data));
  };

  const filteredSurahs = surahs.filter(s =>
    s.namaLatin.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedSurah) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-4xl mx-auto pb-40"
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedSurah(null)}
            className="flex items-center gap-2 text-islamic-green font-semibold hover:underline"
          >
            <ChevronRight className="rotate-180 w-5 h-5" />
            Daftar Surah
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={() => fetchTafsir(selectedSurah.nomor)}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-islamic-gold/10 text-islamic-gold hover:bg-islamic-gold hover:text-white transition-all"
            >
              {showTafsir ? labels.closeTafsir : labels.showTafsir}
            </button>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl text-center mb-10 overflow-hidden relative">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-islamic-green mb-2">{selectedSurah.nama}</h2>
            <p className="text-xl text-islamic-gold font-medium mb-1">{selectedSurah.namaLatin}</p>
            <p className="text-slate-500 text-sm uppercase tracking-widest">
              {selectedSurah.tempatTurun} • {selectedSurah.jumlahAyat} {lang === 'id' ? 'AYAT' : 'VERSES'}
            </p>
            <div className="mt-6 flex justify-center">
              <audio controls className="w-full max-w-md h-10 accent-islamic-green">
                <source src={Object.values(selectedSurah.audioFull)[0] as string} type="audio/mpeg" />
              </audio>
            </div>
          </div>
        </div>

        {/* Tafsir Area */}
        <AnimatePresence>
          {showTafsir && tafsir && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-10"
            >
              <div className="p-6 bg-white rounded-3xl border border-islamic-gold/20 space-y-6">
                <h3 className="text-xl font-bold text-islamic-green">{labels.tafsirTitle}</h3>
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                  {tafsir.tafsir.map((t: any, idx: number) => (
                    <div key={idx} className="space-y-2 pb-6 border-b border-slate-100 last:border-0 text-sm">
                      <p className="font-bold text-islamic-gold">{lang === 'id' ? 'Ayat' : 'Verse'} {t.ayat}</p>
                      <p className="text-slate-700 leading-relaxed text-justify">{t.teks}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="w-10 h-10 text-islamic-green animate-spin" />
            <p className="text-slate-400">{labels.loading}</p>
          </div>
        ) : (
          <div className="space-y-12">
            {verses.map((v, i) => {
              const hKey = `${selectedSurah.nomor}:${v.nomorAyat}`;
              const isInHafalan = hafalanItems.some(item => item.key === hKey);
              const isLastRead = lastRead.surah === selectedSurah.nomor && lastRead.ayat === v.nomorAyat;

              return (
                <div key={i} id={`ayat-${v.nomorAyat}`} className="group relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-2">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border transition-all
                        ${isLastRead ? 'bg-islamic-gold border-islamic-gold text-white' : 'bg-islamic-green/5 text-islamic-green border-islamic-green/10'}
                      `}>
                        {v.nomorAyat}
                      </div>
                      <button 
                        onClick={() => toggleHafalan(v)}
                        className={`p-2 rounded-lg border transition-all ${isInHafalan ? 'bg-red-50 text-red-500 border-red-100' : 'bg-transparent text-slate-300 border-transparent hover:border-slate-200 hover:text-red-400'}`}
                      >
                        <Heart className={`w-4 h-4 ${isInHafalan ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                         onClick={() => markLastRead(v.nomorAyat)}
                         className={`p-2 rounded-lg border transition-all ${isLastRead ? 'text-islamic-gold border-islamic-gold/20' : 'text-slate-300 border-transparent hover:border-slate-200 hover:text-islamic-gold'}`}
                      >
                        <MapPin className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right flex-1 pr-4">
                      <p className="text-3xl lg:text-5xl leading-[2.8] font-display text-slate-800" dir="rtl">
                        {v.teksArab}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/40 p-6 rounded-2xl border border-slate-100 group-hover:border-islamic-gold/30 transition-all">
                    <div className="mb-4">
                      <audio controls className="h-8 max-w-[240px]">
                        <source src={Object.values(v.audio)[0] as string} type="audio/mpeg" />
                      </audio>
                    </div>
                    <p className="text-xs text-islamic-gold font-bold mb-1 italic opacity-70">{labels.latin}</p>
                    <p className="text-sm text-slate-600 mb-4 italic font-medium leading-relaxed">{v.teksLatin}</p>
                    <p className="text-xs text-islamic-green font-bold mb-1 opacity-70">{labels.translation}</p>
                    <p className="text-slate-700 leading-relaxed text-sm lg:text-base">{v.teksIndonesia}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-8 pb-40"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4 flex-1">
          <h2 className="text-4xl font-bold text-islamic-green font-display">{labels.title}</h2>
          <p className="text-slate-500">{labels.sub}</p>
          
          <div className="flex flex-wrap gap-4">
             {/* Continue Reading Card */}
            <button 
              onClick={() => fetchVerses(lastRead.surah, lastRead.ayat)}
              className="flex items-center gap-4 p-4 glass-panel rounded-2xl hover:bg-white transition-all group"
            >
              <div className="w-12 h-12 bg-islamic-gold/10 text-islamic-gold rounded-xl flex items-center justify-center">
                <ChevronRight className="w-6 h-6" />
              </div>
              <div className="text-left pr-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{labels.lastRead}</p>
                <p className="font-bold text-islamic-green">{lang === 'id' ? 'Surah' : 'Surah'} {lastRead.surah} {lang === 'id' ? 'Ayat' : 'Verse'} {lastRead.ayat}</p>
              </div>
            </button>

            {/* Offline/Hafalan Card */}
            {hafalanItems.length > 0 && (
              <div className="p-4 glass-panel rounded-2xl border-l-4 border-red-400">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{labels.target}</p>
                <p className="font-bold text-slate-700">{hafalanItems.length} {labels.savedAyat}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">{labels.juzNav}</span>
            <div className="flex-1 h-[1px] bg-slate-200 w-20" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none max-w-sm lg:max-w-md">
            {Object.entries(JUZ_STARTS).map(([juz, start]) => (
              <button
                key={juz}
                onClick={() => fetchVerses(start.surah, start.ayat)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-100 text-xs font-bold text-slate-600 hover:border-islamic-green hover:text-islamic-green transition-all whitespace-nowrap"
              >
                Juz {juz}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder={labels.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-14 pr-8 py-5 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border-2 border-transparent focus:border-islamic-green focus:ring-0 text-lg transition-all"
        />
        <BookOpen className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-islamic-green opacity-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurahs.map((s) => (
          <button
            key={s.nomor}
            onClick={() => fetchVerses(s.nomor)}
            className="flex items-center gap-5 p-6 glass-panel rounded-3xl text-left hover:bg-white hover:shadow-2xl transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-1 opacity-5 group-hover:opacity-20 transition-opacity">
              <span className="text-6xl font-display text-islamic-green">{s.nama}</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-islamic-green/5 text-islamic-green flex items-center justify-center font-bold text-xl group-hover:bg-islamic-green group-hover:text-white transition-all shadow-sm">
              {s.nomor}
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="font-bold text-slate-800 group-hover:text-islamic-green text-lg">{s.namaLatin}</h3>
              <p className="text-xs text-slate-400 font-medium">{s.arti}</p>
              <p className="text-[10px] text-islamic-gold font-bold uppercase tracking-widest mt-1">
                {s.tempatTurun} • {s.jumlahAyat} AYAT
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-display text-slate-800 group-hover:text-islamic-green transition-colors">{s.nama}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Memorization Mode Section */}
      {hafalanItems.length > 0 && (
         <div className="mt-20 space-y-10">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-islamic-green font-display">🧠 {labels.memorize}</h2>
              <div className="flex-1 h-[2px] bg-islamic-gold/20" />
              <button 
                onClick={() => setHafalanItems([])}
                className="text-xs text-red-400 font-bold hover:underline"
              >
                {labels.clear}
              </button>
            </div>

            <div className="grid gap-6">
              {hafalanItems.map((item, idx) => (
                <div key={idx} className="glass-panel p-8 rounded-3xl space-y-6">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>{item.surahName} : Ayat {item.ayatNo}</span>
                     <button 
                      onClick={() => setHafalanItems(prev => prev.filter(i => i.key !== item.key))}
                      className="text-red-400 hover:text-red-600"
                    >Hapus</button>
                  </div>
                  <p className="text-3xl text-right font-display text-slate-800 leading-relaxed" dir="rtl">{item.arab}</p>
                  
                  <div className="flex flex-col md:flex-row items-center gap-6 pt-4 border-t border-slate-100">
                    <div className="flex-1 w-full">
                       <div className="flex justify-between text-xs font-bold text-islamic-green mb-2">
                        <span>Progress Ulangan</span>
                        <span>{item.reps} / 5</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-islamic-gold transition-all duration-500" 
                          style={{ width: `${Math.min((item.reps / 5) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const updated = [...hafalanItems];
                          updated[idx].reps = 0;
                          setHafalanItems(updated);
                        }}
                        className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all"
                      >{labels.reset}</button>
                      <button 
                        onClick={() => {
                          const updated = [...hafalanItems];
                          updated[idx].reps += 1;
                          setHafalanItems(updated);
                        }}
                        className="px-8 py-2 bg-islamic-green text-white text-xs font-bold rounded-xl hover:scale-105 transition-all shadow-md group"
                      >
                        {labels.addRep} <span className="ml-2 group-hover:translate-x-1 inline-block">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
         </div>
      )}
    </motion.div>
  );
}

function ZakatView({ lang }: { lang: Language, key?: string }) {
  const labels = lang === 'id' ? {
    title: "Kalkulator Zakat Penghasilan",
    sub: "Hitung kewajiban zakat berdasarkan penghasilan atau harta simpanan.",
    autoGold: "Gunakan harga emas otomatis",
    reload: "Reload Harga",
    income: "Total Penghasilan (Rp)",
    expense: "Pengeluaran Pokok (Rp)",
    goldPrice: "Harga Emas/Gram (Rp)",
    method: "Metode Perhitungan",
    nisab: "Terapkan syarat nisab (85gr emas)",
    total: "Total Zakat Wajib (2.5%)",
    nisabRef: "Nisab Acuan:",
    balance: "Saldo Kena Zakat:",
    status: "Status:",
    wajib: "WAJIB ZAKAT",
    notWajib: "BELUM WAJIB",
    monthly: "Bulanan (Profesi)",
    yearly: "Tahunan (Maal)"
  } : {
    title: "Income Zakat Calculator",
    sub: "Calculate zakat obligation based on income or savings.",
    autoGold: "Use automatic gold price",
    reload: "Reload Price",
    income: "Total Income (IDR)",
    expense: "Basic Expenses (IDR)",
    goldPrice: "Gold Price/Gram (IDR)",
    method: "Calculation Method",
    nisab: "Apply nisab requirement (85gr gold)",
    total: "Total Zakat Obligation (2.5%)",
    nisabRef: "Reference Nisab:",
    balance: "Zakat-able Balance:",
    status: "Status:",
    wajib: "ZAKAT OBLIGED",
    notWajib: "NOT OBLIGED",
    monthly: "Monthly (Profession)",
    yearly: "Yearly (Wealth)"
  };
  const [penghasilan, setPenghasilan] = useState(0);
  const [pengeluaran, setPengeluaran] = useState(0);
  const [manualGoldPrice, setManualGoldPrice] = useState(1200000);
  const [useAuto, setUseAuto] = useState(false);
  const [autoData, setAutoData] = useState<{ price: number; source: string }| null>(null);
  const [loadingGold, setLoadingGold] = useState(false);
  const [zakatMethod, setZakatMethod] = useState<'Bulanan' | 'Tahunan'>('Bulanan');
  const [applyNisab, setApplyNisab] = useState(true);

  const handleReloadGold = async () => {
    setLoadingGold(true);
    try {
      const data = await fetchGoldPriceData();
      setAutoData(data);
      setUseAuto(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Gagal memuat harga emas");
    } finally {
      setLoadingGold(false);
    }
  };

  const hargaEmasEff = (useAuto && autoData) ? autoData.price : manualGoldPrice;
  const nisabVal = zakatMethod === 'Tahunan' ? 85 * hargaEmasEff : (85 * hargaEmasEff) / 12;
  const saldoZakat = Math.max(penghasilan - pengeluaran, 0);
  const isWajibVal = applyNisab ? saldoZakat >= nisabVal : true;
  const zakatFinal = isWajibVal ? saldoZakat * 0.025 : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="glass-panel p-8 rounded-3xl space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-islamic-green font-display">{labels.title}</h2>
          <p className="text-slate-500 text-sm">{labels.sub}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-islamic-green/5 rounded-2xl border border-islamic-green/10">
          <div className="flex items-center gap-3">
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={useAuto} onChange={(e) => setUseAuto(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-islamic-green"></div>
            </div>
            <span className="text-xs font-bold text-slate-600">{labels.autoGold}</span>
          </div>
          <button onClick={handleReloadGold} disabled={loadingGold} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-islamic-green hover:border-islamic-green transition-all">
            {loadingGold ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            {labels.reload}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{labels.income}</label>
            <input type="number" value={penghasilan || ''} placeholder="0" onChange={(e) => setPenghasilan(Number(e.target.value))} className="w-full bg-white border-2 border-slate-100 focus:border-islamic-green rounded-2xl px-5 py-4 text-xl font-bold transition-all outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{labels.expense}</label>
            <input type="number" value={pengeluaran || ''} placeholder="0" onChange={(e) => setPengeluaran(Number(e.target.value))} className="w-full bg-white border-2 border-slate-100 focus:border-islamic-green rounded-2xl px-5 py-4 text-xl font-bold transition-all outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{labels.goldPrice}</label>
            <div className="relative">
              <input type="number" value={useAuto && autoData ? Math.round(autoData.price) : manualGoldPrice} disabled={useAuto && !!autoData} onChange={(e) => setManualGoldPrice(Number(e.target.value))} className={`w-full bg-white border-2 border-slate-100 focus:border-islamic-green rounded-2xl px-5 py-4 text-xl font-bold transition-all outline-none ${useAuto && autoData ? 'opacity-60 bg-slate-50' : ''}`} />
              {useAuto && autoData && <div className="mt-2 text-[10px] font-bold text-islamic-gold uppercase tracking-tighter ml-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-islamic-gold animate-pulse" />Live: {autoData.source}</div>}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
           <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">{labels.method}</span>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {['Bulanan', 'Tahunan'].map((m) => (
                  <button key={m} onClick={() => setZakatMethod(m as any)} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${zakatMethod === m ? 'bg-white text-islamic-green shadow-sm' : 'text-slate-400'}`}>{m === 'Bulanan' ? labels.monthly : labels.yearly}</button>
                ))}
              </div>
           </div>
           <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={applyNisab} onChange={(e) => setApplyNisab(e.target.checked)} className="w-5 h-5 rounded-md border-2 border-slate-200 text-islamic-green focus:ring-islamic-green transition-all" />
              <span className="text-sm font-medium text-slate-600 group-hover:text-islamic-green transition-colors">{labels.nisab}</span>
           </label>
        </div>

        <div className={`p-8 rounded-3xl transition-all shadow-xl ${isWajibVal ? 'bg-islamic-green text-white shadow-islamic-green/20' : 'bg-slate-100 text-slate-500 shadow-none'}`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">{labels.total}</h4>
              <p className="text-4xl font-bold font-display">Rp {zakatFinal.toLocaleString('id-ID')}</p>
            </div>
            <div className={`p-3 rounded-2xl ${isWajibVal ? 'bg-white/20' : 'bg-slate-200'}`}>
              <Calculator className={`w-8 h-8 ${isWajibVal ? 'text-islamic-gold' : 'text-slate-400'}`} />
            </div>
          </div>
          <div className="space-y-3 pt-6 border-t border-white/10 text-xs font-medium">
             <div className="flex justify-between items-center"><span className="opacity-70">{labels.nisabRef}</span><span className="font-bold">Rp {Math.round(nisabVal).toLocaleString('id-ID')}</span></div>
             <div className="flex justify-between items-center"><span className="opacity-70">{labels.balance}</span><span className="font-bold">Rp {saldoZakat.toLocaleString('id-ID')}</span></div>
             <div className="flex justify-between items-center"><span className="opacity-70">{labels.status}</span><span className={`px-2 py-0.5 rounded-full font-bold ${isWajibVal ? 'bg-white text-islamic-green' : 'bg-slate-200 text-slate-600'}`}>{isWajibVal ? labels.wajib : labels.notWajib}</span></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DoaView({ lang }: { lang: Language, key?: string }) {
  const t = translations[lang].nav;
  const labels = lang === 'id' ? {
    sub: "Kumpulan doa-doa harian dari sumber terpercaya (EQuran.id).",
    cat: "Pilih Kategori",
    sel: "Pilih Doa",
    loading: "Membuka lembaran doa...",
    arab: "Teks Arab",
    latin: "Latin",
    mean: "Terjemahan",
    ref: "Keterangan / Hadits",
    copy: "Salin Teks Doa",
    empty: "Pilih Doa di Samping",
    emptySub: "Detail doa akan muncul di sini.",
    toast: "Doa berhasil disalin!"
  } : {
    sub: "Collection of daily prayers from trusted sources (EQuran.id).",
    cat: "Select Category",
    sel: "Select Prayer",
    loading: "Opening prayer pages...",
    arab: "Arabic Text",
    latin: "Transliteration",
    mean: "Translation",
    ref: "Reference / Hadith",
    copy: "Copy Prayer Text",
    empty: "Select a Prayer on the Side",
    emptySub: "Prayer details will appear here.",
    toast: "Prayer copied successfully!"
  };
  const [doas, setDoas] = useState<any[]>([]);
  const [selectedGrup, setSelectedGrup] = useState<string>('');
  const [selectedDoa, setSelectedDoa] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://equran.id/api/doa")
      .then(res => res.json())
      .then(data => {
        const items = Array.isArray(data) ? data : (data.data || []);
        setDoas(items);
        if (items.length > 0) {
          setSelectedGrup(items[0].grup || 'Umum');
        }
      })
      .catch(err => {
        console.error(err);
        setDoas([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDoaSelect = async (id: string) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(`https://equran.id/api/doa/${id}`);
      const data = await res.json();
      const detail = data.data || (Array.isArray(data) ? data[0] : data);
      setSelectedDoa(detail);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const safeDoas = Array.isArray(doas) ? doas : [];
  const grups = Array.from(new Set(safeDoas.map(d => d.grup || 'Umum'))).sort();
  const filteredDoas = safeDoas.filter(d => (d.grup || 'Umum') === selectedGrup);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Doa berhasil disalin!");
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 pb-40 px-4">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-islamic-green/10 rounded-3xl mb-4">
          <Heart className="w-10 h-10 text-islamic-green" />
        </div>
        <h2 className="text-4xl font-bold text-islamic-green font-display">📖 {t.doa}</h2>
        <p className="text-slate-500">{labels.sub}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{labels.cat}</label>
              <select 
                value={selectedGrup}
                onChange={(e) => setSelectedGrup(e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-islamic-green outline-none"
              >
                {grups.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{labels.sel}</label>
              <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 text-islamic-green animate-spin" />
                  </div>
                ) : filteredDoas.map((d, i) => (
                  <button 
                    key={i}
                    onClick={() => handleDoaSelect(d.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                      selectedDoa?.id === d.id
                        ? 'bg-islamic-green border-islamic-green text-white shadow-lg'
                        : 'bg-white border-slate-100 text-slate-600 hover:border-islamic-green/30'
                    }`}
                  >
                    <span className="text-xs font-bold truncate">{d.nama}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6 min-h-[500px]">
          {loadingDetail ? (
            <div className="glass-panel p-12 rounded-3xl h-full flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 text-islamic-green animate-spin mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{labels.loading}</p>
            </div>
          ) : selectedDoa ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-8 rounded-3xl space-y-8 shadow-xl border-t-8 border-islamic-gold">
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <h3 className="text-2xl font-bold text-islamic-green font-display">{selectedDoa.nama}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedDoa.grup}</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{labels.arab}</p>
                  <p className="text-3xl font-display text-right leading-[2.5] text-slate-800 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-inner" dir="rtl">
                    {selectedDoa.ar}
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{labels.latin}</p>
                  <p className="text-sm text-islamic-green font-medium italic leading-relaxed pl-4 border-l-4 border-islamic-green/20">
                    {selectedDoa.tr}
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{labels.mean}</p>
                  <p className="text-sm text-slate-600 leading-relaxed bg-white p-6 rounded-2xl border border-slate-50 shadow-sm italic">
                    "{selectedDoa.idn}"
                  </p>
                </div>

                {selectedDoa.tentang && (
                  <div className="p-4 bg-islamic-gold/10 border border-islamic-gold/20 rounded-2xl">
                    <p className="text-[10px] font-bold text-islamic-gold uppercase tracking-widest mb-1">{labels.ref}</p>
                    <p className="text-[10px] text-slate-600 leading-relaxed italic">{selectedDoa.tentang}</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => handleCopy(`${selectedDoa.nama}\n\n${selectedDoa.ar}\n\n${selectedDoa.idn}`)}
                className="w-full py-4 bg-islamic-green text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-lg"
              >
                <Download className="w-5 h-5" /> {labels.copy}
              </button>
            </motion.div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border-2 border-dashed border-slate-100 h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-slate-200" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-400">{labels.empty}</h3>
                <p className="text-xs text-slate-300">{labels.emptySub}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
function ZikirView({ lang }: { lang: Language, key?: string }) {
  const t = translations[lang].zikir;
  const labels = lang === 'id' ? {
    sel: "Pilih Dzikir",
    target: "Target",
    infinite: "0 = Tanpa batas",
    haptic: "Getar saat +1 (Android)",
    stats: "Rangkaian Setelah Shalat",
    done: "Masya Allah! Rangkaian Selesai 🌙",
    doneSub: "Semoga amal ibadah kita diterima oleh-Nya."
  } : {
    sel: "Select Dhikr",
    target: "Target",
    infinite: "0 = Unlimited",
    haptic: "Vibrate on +1 (Android)",
    stats: "Post-Prayer Sequence",
    done: "Masya Allah! Sequence Complete 🌙",
    doneSub: "May our worship be accepted by Him."
  };
  const [zikirState, setZikirState] = useState({
    phraseIndex: 0,
    target: 33,
    count: 0,
    haptic: true,
  });

  const [seq, setSeq] = useState({ s: 0, h: 0, a: 0, t: 0 });

  const phrases = [
    { label: "Subhanallah", arab: "سُبْحَانَ اللَّه" },
    { label: "Alhamdulillah", arab: "الْحَمْدُ لِلَّه" },
    { label: "Allahu Akbar", arab: "اللَّهُ أَكْبَر" },
    { label: "Lā ilāha illallāh", arab: "لَا إِلٰهَ إِلَّا اللَّه" },
    { label: "Astaghfirullah", arab: "أَسْتَغْفِرُ اللَّه" },
    { label: "Shalawat", arab: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّد" },
  ];

  const currentPhrase = phrases[zikirState.phraseIndex];

  const triggerHaptic = () => {
    if (zikirState.haptic && navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  const handleIncrement = () => {
    const newCount = zikirState.count + 1;
    setZikirState({ ...zikirState, count: newCount });
    triggerHaptic();

    if (zikirState.target > 0 && newCount === zikirState.target) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#eab308']
      });
    }
  };

  const shareWA = () => {
    const text = `Saya telah berdzikir ${currentPhrase.label} sebanyak ${zikirState.count}x.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 pb-40 px-4">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-islamic-green/10 rounded-3xl mb-4">
          <RefreshCw className="w-10 h-10 text-islamic-green" />
        </div>
        <h2 className="text-4xl font-bold text-islamic-green font-display">🧿 {t.title}</h2>
        <p className="text-slate-500">{t.sub}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl space-y-8 border-t-8 border-islamic-green shadow-xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{labels.sel}</label>
              <select 
                value={zikirState.phraseIndex}
                onChange={(e) => setZikirState({ ...zikirState, phraseIndex: parseInt(e.target.value), count: 0 })}
                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-islamic-green outline-none"
              >
                {phrases.map((p, i) => <option key={i} value={i}>{lang === 'en' ? p.label : p.label}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{labels.target}</label>
              <input 
                type="number" 
                value={zikirState.target}
                onChange={(e) => setZikirState({ ...zikirState, target: parseInt(e.target.value) || 0 })}
                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-islamic-green outline-none"
                placeholder={labels.infinite}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center">
            <input 
              type="checkbox" 
              checked={zikirState.haptic}
              onChange={(e) => setZikirState({ ...zikirState, haptic: e.target.checked })}
              className="w-4 h-4 rounded border-slate-200 text-islamic-green focus:ring-islamic-green"
            />
            <span className="text-xs text-slate-500">{labels.haptic}</span>
          </div>

          <div className="text-center space-y-2">
            <p className="text-4xl font-display text-islamic-green">{currentPhrase.arab}</p>
            <p className="font-bold text-slate-400 tracking-widest uppercase text-xs">{currentPhrase.label}</p>
          </div>

          <div className="relative pt-4">
            <div className="text-[120px] font-black text-slate-100 absolute inset-0 flex items-center justify-center -z-0 opacity-50 pointer-events-none">
              {zikirState.target === 0 ? '∞' : zikirState.target}
            </div>
            <div className="text-8xl font-black text-islamic-green text-center relative z-10 font-display">
              {zikirState.count}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <button 
              onClick={() => setZikirState({ ...zikirState, count: Math.max(0, zikirState.count - 1) })}
              className="py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center"
            >
              -1
            </button>
            <button 
              onClick={handleIncrement}
              className="col-span-2 py-6 bg-islamic-green text-white rounded-3xl font-black text-2xl hover:bg-slate-800 transition-all shadow-xl shadow-islamic-green/20 ring-4 ring-islamic-green/10"
            >
              +1
            </button>
            <button 
              onClick={() => setZikirState({ ...zikirState, count: 0 })}
              className="py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 pt-4">
            {zikirState.target > 0 && (
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((zikirState.count / zikirState.target) * 100, 100)}%` }}
                  className="h-full bg-islamic-gold shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                />
              </div>
            )}
            
            {zikirState.target > 0 && zikirState.count >= zikirState.target && (
              <motion.p initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-center text-islamic-gold font-bold text-sm tracking-widest uppercase">
                Alhamdulillah, Target Tercapai! ✨
              </motion.p>
            )}

            <button 
              onClick={shareWA}
              className="w-full py-4 text-islamic-green border-2 border-islamic-green/20 rounded-2xl font-bold text-xs hover:bg-islamic-green hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Kirim Ringkasan ke WhatsApp
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
               <div className="p-2 bg-islamic-gold/10 rounded-lg">
                 <Moon className="w-4 h-4 text-islamic-gold" />
               </div>
               <h3 className="font-bold text-slate-800">Rangkaian Setelah Shalat</h3>
            </div>

            <div className="space-y-8">
              {[
                { label: "Subhanallah", key: 's', target: 33 },
                { label: "Alhamdulillah", key: 'h', target: 33 },
                { label: "Allahu Akbar", key: 'a', target: 33 },
                { label: "La Ilaha Illalllah", key: 't', target: 1 },
              ].map((item) => (
                <div key={item.key} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-bold text-slate-700 text-sm">{item.label}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Target: {item.target}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-islamic-green font-display">{seq[item.key as keyof typeof seq]}</span>
                    </div>
                  </div>
                  
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-islamic-gold transition-all duration-500" style={{ width: `${Math.min((seq[item.key as keyof typeof seq] / item.target) * 100, 100)}%` }} />
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const newVal = seq[item.key as keyof typeof seq] + 1;
                        setSeq({ ...seq, [item.key]: newVal });
                        triggerHaptic();
                        if (newVal === item.target && item.key === 't') {
                           if (seq.s >= 33 && seq.h >= 33 && seq.a >= 33) {
                             confetti({ particleCount: 200, spread: 90, origin: { y: 0.7 } });
                           }
                        }
                      }}
                      className="flex-1 py-2 bg-islamic-green/10 text-islamic-green text-xs font-bold rounded-xl hover:bg-islamic-green hover:text-white transition-all"
                    >
                      +1
                    </button>
                    <button 
                      onClick={() => setSeq({ ...seq, [item.key]: 0 })}
                      className="px-4 py-2 bg-slate-50 text-slate-400 text-xs font-bold rounded-xl hover:bg-slate-100"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {seq.s >= 33 && seq.h >= 33 && seq.a >= 33 && seq.t >= 1 && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-4 bg-islamic-green text-white rounded-2xl text-center shadow-xl">
                 <p className="font-bold text-sm">Masya Allah! Rangkaian Selesai 🌙</p>
                 <p className="text-[10px] opacity-80 mt-1">Semoga amal ibadah kita diterima oleh-Nya.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const FIXED_EVENTS: Record<string, { id: string, en: string }> = {
  '1-9': { id: "Awal Ramadhan", en: "First of Ramadan" },
  '17-9': { id: "Nuzulul Qur'an", en: "Nuzul al-Quran" },
  '27-7': { id: "Isra' Mi'raj", en: "Isra and Mi'raj" },
  '12-3': { id: "Maulid Nabi", en: "Prophet's Birthday" },
  '1-10': { id: "Idul Fitri", en: "Eid al-Fitr" },
  '8-12': { id: "Tarwiyah", en: "Day of Tarwiyah" },
  '9-12': { id: "Arafah", en: "Day of Arafah" },
  '10-12': { id: "Idul Adha", en: "Eid al-Adha" },
  '10-1': { id: "‘Āsyūrā’ (10 Muharram)", en: "Ashura (10th Muharram)" },
  '9-1': { id: "Tāsū‘ā (9 Muharram)", en: "Tasu'a (9th Muharram)" },
};

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-awwal", "Rabi' al-thani",
  "Jumada al-ula", "Jumada al-akhira", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

function EventsView({ lang }: { lang: Language, key?: string }) {
  const componentLabels = lang === 'id' ? {
    title: "Kalender Islam & Hari Besar",
    sub: "Pantau jadwal hari besar Islam dan agenda kegiatan terdekat.",
    hijri: "Kalender Hijriah",
    events: "Agenda Kegiatan",
    noEvents: "Belum ada agenda terdekat.",
    day: "Hari Ini",
    loading: "Memuat kalender..."
  } : {
    title: "Islamic Calendar & Events",
    sub: "Monitor Islamic major days and upcoming activity agendas.",
    hijri: "Hijri Calendar",
    events: "Upcoming Events",
    noEvents: "No upcoming events.",
    day: "Today",
    loading: "Loading calendar..."
  };
  const [currentHijri, setCurrentHijri] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState(1447);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [includeMonThu, setIncludeMonThu] = useState(true);
  const [onlyLabeled, setOnlyLabeled] = useState(false);

  useEffect(() => {
    // Get today's hijri
    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    fetch(`https://api.aladhan.com/v1/gToH?date=${formattedDate}`)
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          setCurrentHijri(data.data.hijri);
          setSelectedYear(parseInt(data.data.hijri.year));
          setSelectedMonth(parseInt(data.data.hijri.month.number));
        }
      });
  }, []);

  const fetchCalendar = async (year: number, month: number) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.aladhan.com/v1/hToGCalendar/${year}/${month}`);
      const data = await res.json();
      if (data.code === 200) {
        setCalendar(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  const getLabels = (hDay: number, hMonth: number, gWeekday: string) => {
    const labels: string[] = [];
    const eventKey = `${hDay}-${hMonth}`;
    
    if (FIXED_EVENTS[eventKey]) {
      labels.push(lang === 'id' ? FIXED_EVENTS[eventKey].id : FIXED_EVENTS[eventKey].en);
    }

    if ([13, 14, 15].includes(hDay)) {
      labels.push("Ayyām al-Bīḍ");
    }

    if (includeMonThu) {
      if (gWeekday === 'Monday') labels.push(lang === 'id' ? "Puasa Senin" : "Monday Fasting");
      if (gWeekday === 'Thursday') labels.push(lang === 'id' ? "Puasa Kamis" : "Thursday Fasting");
    }

    return labels;
  };

  const filteredDays = calendar.filter(day => {
    if (!onlyLabeled) return true;
    const labels = getLabels(
      parseInt(day.hijri.day),
      parseInt(day.hijri.month.number),
      day.gregorian.weekday.en
    );
    return labels.length > 0;
  });
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 pb-40">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold text-islamic-green font-display flex items-center justify-center gap-3">
          <Calendar className="w-8 h-8 text-islamic-gold" /> {componentLabels.title}
        </h2>
        {currentHijri ? (
          <div className="inline-block px-6 py-2 bg-islamic-green/10 text-islamic-green rounded-2xl font-bold text-lg">
            {lang === 'id' ? currentHijri.weekday.ar : currentHijri.weekday.en}, {currentHijri.day} {currentHijri.month.en} {currentHijri.year} H
          </div>
        ) : (
          <div className="h-10 w-48 bg-slate-100 animate-pulse mx-auto rounded-xl" />
        )}
      </div>

      {/* Settings Panel */}
      <div className="glass-panel p-6 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">{componentLabels.hijri}</label>
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-islamic-green"
          >
            {HIJRI_MONTHS.map((m, idx) => (
              <option key={idx} value={idx + 1}>{idx + 1}. {m}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4 flex flex-col justify-center">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={includeMonThu}
              onChange={(e) => setIncludeMonThu(e.target.checked)}
              className="w-5 h-5 rounded-md border-2 border-slate-200 text-islamic-green focus:ring-islamic-green transition-all"
            />
            <span className="text-sm font-medium text-slate-600 group-hover:text-islamic-green transition-colors">{lang === 'id' ? 'Tanda Puasa Senin & Kamis' : 'Mark Mon & Thu Fasting'}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={onlyLabeled}
              onChange={(e) => setOnlyLabeled(e.target.checked)}
              className="w-5 h-5 rounded-md border-2 border-slate-200 text-islamic-green focus:ring-islamic-green transition-all"
            />
            <span className="text-sm font-medium text-slate-600 group-hover:text-islamic-green transition-colors text-right">{lang === 'id' ? 'Tampilkan Hanya Event/Puasa' : 'Show Only Events/Fasting'}</span>
          </label>
        </div>

        <div className="flex items-center justify-end">
           <div className="text-right">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">{lang === 'id' ? 'Tahun' : 'Year'}</p>
             <input 
               type="number" 
               value={selectedYear} 
               onChange={(e) => setSelectedYear(parseInt(e.target.value))}
               className="text-3xl font-bold text-islamic-green bg-transparent border-none focus:ring-0 p-0 text-right w-24"
             />
           </div>
        </div>
      </div>

      {/* Calendar List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-islamic-green animate-spin" />
            <p className="text-slate-400 font-medium">{componentLabels.loading}</p>
          </div>
        ) : filteredDays.length > 0 ? (
          <div className="grid gap-4">
            {filteredDays.map((day, idx) => {
              const dayLabels = getLabels(
                parseInt(day.hijri.day),
                parseInt(day.hijri.month.number),
                day.gregorian.weekday.en
              );
              const isToday = currentHijri && day.hijri.day === currentHijri.day && day.hijri.month.number === currentHijri.month.number;

              return (
                <div 
                  key={idx} 
                  className={`flex items-center gap-4 p-4 glass-panel rounded-2xl border-l-4 transition-all hover:bg-white ${isToday ? 'border-islamic-gold bg-islamic-gold/5' : 'border-slate-100'}`}
                >
                  <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold shadow-sm ${isToday ? 'bg-islamic-gold text-white' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                    <span className="text-xl">{day.hijri.day}</span>
                    <span className="text-[10px] uppercase">{day.hijri.month.en.substring(0,3)}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                       <h4 className="font-bold text-slate-800">{lang === 'id' ? day.gregorian.weekday.id : day.gregorian.weekday.en}, {day.gregorian.day} {lang === 'id' ? day.gregorian.month.en : day.gregorian.month.en}</h4>
                       {isToday && <span className="bg-islamic-gold text-[8px] font-bold text-white px-2 py-0.5 rounded-full">{componentLabels.day.toUpperCase()}</span>}
                    </div>
                    <p className="text-xs text-slate-400 font-medium">{day.hijri.day} {day.hijri.month.en} {day.hijri.year} H</p>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-end max-w-[200px]">
                    {dayLabels.map((l, i) => (
                      <span key={i} className={`text-[10px] font-bold px-2 py-1 rounded-lg ${l.toLowerCase().includes('puasa') || l.toLowerCase().includes('fasting') ? 'bg-islamic-green/10 text-islamic-green' : 'bg-red-50 text-red-500'}`}>
                        {l}
                      </span>
                    ))}
                    {dayLabels.length === 0 && <span className="text-[10px] font-bold text-slate-300 italic opacity-50 px-2 py-1">{lang === 'id' ? 'Tidak ada tanda' : 'No markers'}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-20 text-center glass-panel rounded-3xl">
             <Filter className="w-12 h-12 text-slate-200 mx-auto mb-4" />
             <p className="text-slate-400">{componentLabels.noEvents}</p>
          </div>
        )}
      </div>

      <div className="bg-islamic-green/5 p-6 rounded-3xl border border-islamic-green/10 text-xs text-slate-500 leading-relaxed italic text-justify">
        <p><strong>{lang === 'id' ? 'Catatan Penting:' : 'Important Note:'}</strong> {lang === 'id' ? 'Kalender Hijriah ini didasarkan pada perhitungan astronomi (Umm al-Qura). Penetapan hari besar agama seperti Idul Fitri dan Idul Adha tetap harus mengikuti pengumuman resmi pemerintah berdasarkan hasil rukyatul hilal lokal.' : 'This Hijri calendar is based on astronomical calculations (Umm al-Qura). The determination of religious holidays like Eid al-Fitr and Eid al-Adha should follow the official government announcement based on local moon sighting results.'}</p>
      </div>
    </motion.div>
  );
}

function KhutbahGeneratorView({ lang }: { lang: Language, key?: string }) {
  const labels = lang === 'id' ? {
    title: "Khutbah Generator",
    sub: "Buat draf khutbah berkualitas dengan bantuan kecerdasan buatan.",
    date: "Tanggal",
    type: "Jenis Khutbah",
    theme: "Tema (Opsional)",
    themePlaceholder: "Contoh: Keutamaan Menjaga Amanah",
    style: "Gaya Bahasa",
    target: "Target Jamaah",
    words: "Panjang Teks",
    wordCount: "kata",
    request: "Permintaan Khusus",
    requestPlaceholder: "Misal: Sertakan dalil tentang silaturahim...",
    btnGenerate: "Buat Khutbah Sekarang",
    loading: "Sedang Menyusun Khutbah...",
    results: "Hasil Generasi",
    save: "Simpan Teks",
    empty: "Belum Ada Teks",
    emptySub: "Isi formulir dan klik tombol di samping untuk mulai."
  } : {
    title: "Sermon Generator",
    sub: "Create high-quality sermon drafts with the help of artificial intelligence.",
    date: "Date",
    type: "Sermon Type",
    theme: "Theme (Optional)",
    themePlaceholder: "E.g., Virtue of Maintaining Trust",
    style: "Language Style",
    target: "Target Audience",
    words: "Text Length",
    wordCount: "words",
    request: "Special Requests",
    requestPlaceholder: "E.g., Include evidence about family ties...",
    btnGenerate: "Create Sermon Now",
    loading: "Composing Sermon...",
    results: "Generation Result",
    save: "Save Text",
    empty: "No Text Yet",
    emptySub: "Fill the form and click the button to start."
  };
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    jenis: 'Jumat',
    tema: '',
    gaya: 'Formal',
    panjang: 700,
    audience: '',
    tambahan: ''
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const text = await generateKhutbah(formData);
      setResult(text);
    } catch (error) {
      console.error(error);
      alert('Gagal membuat khutbah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([result], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Khutbah_${formData.jenis}_${formData.tanggal}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 pb-40">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-islamic-green/10 rounded-3xl mb-4">
          <MessageSquare className="w-10 h-10 text-islamic-green" />
        </div>
        <h2 className="text-4xl font-bold text-islamic-green font-display">🕌 {labels.title}</h2>
        <p className="text-slate-500">{labels.sub}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleGenerate} className="glass-panel p-8 rounded-3xl space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{labels.date}</label>
                <input 
                  type="date" 
                  value={formData.tanggal}
                  onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                  className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-islamic-green outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{labels.type}</label>
                <select 
                  value={formData.jenis}
                  onChange={(e) => setFormData({...formData, jenis: e.target.value})}
                  className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-islamic-green outline-none"
                >
                  <option value="Jumat">{lang === 'id' ? 'Jumat' : 'Friday'}</option>
                  <option value="Idul Fitri">Idul Fitri</option>
                  <option value="Idul Adha">Idul Adha</option>
                  <option value="Istisqa">Istisqa</option>
                  <option value="Nikah">{lang === 'id' ? 'Nikah' : 'Nikah'}</option>
                  <option value="Umum">{lang === 'id' ? 'Umum' : 'General'}</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{labels.theme}</label>
              <input 
                type="text" 
                placeholder={labels.themePlaceholder}
                value={formData.tema}
                onChange={(e) => setFormData({...formData, tema: e.target.value})}
                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-islamic-green outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{labels.style}</label>
                <select 
                  value={formData.gaya}
                  onChange={(e) => setFormData({...formData, gaya: e.target.value})}
                  className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-islamic-green outline-none"
                >
                  <option value="Formal">Formal</option>
                  <option value="Lugas">{lang === 'id' ? 'Lugas' : 'Direct'}</option>
                  <option value="Puitis">{lang === 'id' ? 'Puitis' : 'Poetic'}</option>
                  <option value="Reflektif">{lang === 'id' ? 'Reflektif' : 'Reflective'}</option>
                  <option value="Ringan untuk Remaja">{lang === 'id' ? 'Ringan (Remaja)' : 'Light (Youth)'}</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{labels.target}</label>
                <input 
                  type="text" 
                  placeholder={lang === 'id' ? 'Umum, Mahasiswa, dll' : 'General, Students, etc'}
                  value={formData.audience}
                  onChange={(e) => setFormData({...formData, audience: e.target.value})}
                  className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-islamic-green outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{labels.words}</label>
                <span className="text-xs font-bold text-islamic-green">{formData.panjang} {labels.wordCount}</span>
              </div>
              <input 
                type="range" 
                min="300" 
                max="1500" 
                step="100"
                value={formData.panjang}
                onChange={(e) => setFormData({...formData, panjang: parseInt(e.target.value)})}
                className="w-full accent-islamic-green h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{labels.request}</label>
              <textarea 
                rows={3}
                placeholder={labels.requestPlaceholder}
                value={formData.tambahan}
                onChange={(e) => setFormData({...formData, tambahan: e.target.value})}
                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-islamic-green outline-none resize-none"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-islamic-green text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-lg shadow-islamic-green/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            {loading ? labels.loading : labels.btnGenerate}
          </button>
        </form>

        <div className="space-y-6">
          {result ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-8 rounded-3xl space-y-6 h-full flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-bold text-islamic-green uppercase tracking-widest text-xs">{labels.results}</h3>
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 text-islamic-green text-xs font-bold hover:underline"
                >
                  <Download className="w-4 h-4" /> {labels.save}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                <div className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap font-sans">
                  {result}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border-2 border-dashed border-slate-100 h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-slate-200" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-400">{labels.empty}</h3>
                <p className="text-xs text-slate-300">{labels.emptySub}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const CHANNELS = [
  { id: "makkah", title: "Makkah (Masjidil Haram)", url: "https://www.youtube.com/embed/bNY8a2BB5Gc" },
  { id: "madinah", title: "Madinah (Masjid Nabawi)", url: "https://www.youtube.com/embed/TpT8b8JFZ6E" },
  { id: "quran1", title: "Quran 1 (Mishary Rashid)", url: "https://www.youtube.com/embed/lCeoYw3Y9zM" },
  { id: "quran2", title: "Quran 2 (Saad Al-Ghamdi)", url: "https://www.youtube.com/embed/hBRkEE96geE" },
  { id: "quran3", title: "Quran 3 (Alaa Aqel)", url: "https://www.youtube.com/embed/9shisvrYqXM" }
];

function LiveTVView({ lang }: { lang: Language, key?: string }) {
  const labels = lang === 'id' ? {
    title: "Live TV Religi",
    sub: "Streaming resmi Makkah, Madinah, dan Tilawah Al-Quran.",
    select: "Pilih Saluran",
    info: "Informasi",
    infoText: "Streaming disediakan oleh saluran YouTube resmi. Jika video tidak berputar, pastikan koneksi internet stabil atau coba segarkan halaman.",
    openYoutube: "Buka di YouTube ↗"
  } : {
    title: "Live Religious TV",
    sub: "Official streaming from Makkah, Madinah, and Quran recitations.",
    select: "Select Channel",
    info: "Information",
    infoText: "Streaming is provided by official YouTube channels. If the video doesn't play, ensure your internet connection is stable or try refreshing the page.",
    openYoutube: "Open on YouTube ↗"
  };
  const [selectedChannel, setSelectedChannel] = useState(CHANNELS[0]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8 pb-40 px-4">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-islamic-green/10 rounded-3xl mb-4">
          <Tv className="w-10 h-10 text-islamic-green" />
        </div>
        <h2 className="text-4xl font-bold text-islamic-green font-display">📺 Live TV Religi</h2>
        <p className="text-slate-500">Streaming resmi Makkah, Madinah, dan Tilawah Al-Quran.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Channel Selector */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Pilih Saluran</h3>
          <div className="grid grid-cols-1 gap-2">
            {CHANNELS.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left group ${
                  selectedChannel.id === channel.id
                    ? 'bg-islamic-green border-islamic-green text-white shadow-lg shadow-islamic-green/20'
                    : 'bg-white border-slate-100 text-slate-600 hover:border-islamic-green/30 hover:bg-islamic-green/5'
                }`}
              >
                <div className={`p-2 rounded-lg ${selectedChannel.id === channel.id ? 'bg-white/20' : 'bg-slate-50 text-islamic-green group-hover:bg-white'}`}>
                  <Tv className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold truncate">{channel.title}</span>
              </button>
            ))}
          </div>
          <div className="p-4 bg-islamic-gold/10 border border-islamic-gold/20 rounded-2xl space-y-2">
            <p className="text-[10px] font-bold text-islamic-gold uppercase tracking-widest">Informasi</p>
            <p className="text-[10px] text-slate-600 leading-relaxed italic">Streaming disediakan oleh saluran YouTube resmi. Jika video tidak berputar, pastikan koneksi internet stabil atau coba segarkan halaman.</p>
          </div>
        </div>

        {/* Video Player Area */}
        <div className="lg:col-span-9 space-y-4">
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden glass-panel border-8 border-white shadow-2xl bg-slate-900 group">
             <iframe
               src={selectedChannel.url}
               title={selectedChannel.title}
               className="absolute inset-0 w-full h-full"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
               allowFullScreen
             />
          </div>
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
               <span className="text-xs font-bold text-slate-800 uppercase tracking-tighter">Live Streaming: {selectedChannel.title}</span>
             </div>
             <button 
               onClick={() => window.open(selectedChannel.url, '_blank')}
               className="text-[10px] font-bold text-islamic-green hover:underline flex items-center gap-1"
             >
               Buka di YouTube ↗
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function UstadzView({ lang }: { lang: Language, key?: string }) {
  const labels = lang === 'id' ? {
    title: "Chat Ustadz",
    sub: "Konsultasi langsung dengan para asatidzah melalui WhatsApp.",
    note: "Penting:",
    noteText: "Aplikasi ini tidak mengirim pesan otomatis. Mohon hargai waktu beliau. Jangan menghubungi di luar jam yang tertera.",
    schedule: "Jadwal Konsultasi",
    chat: "Chat via WhatsApp"
  } : {
    title: "Chat with Ustadz",
    sub: "Direct consultation with scholars via WhatsApp.",
    note: "Important:",
    noteText: "This app does not send automatic messages. Please respect their time. Do not contact outside the listed hours.",
    schedule: "Consultation Schedule",
    chat: "Chat via WhatsApp"
  };

  const ustadzData = [
    {
      nama: "Dr. Heri Iskandar, M.Pd",
      profil: lang === 'id' ? "Pengasuh MT Al Hikam Palembang. Fokus fikih ibadah & pendidikan." : "Guardian of MT Al Hikam Palembang. Focus on jurisprudence & education.",
      wa: "+6289675674860",
      msg: lang === 'id' ? "Assalamu'alaikum Ustadz, mohon bimbingannya terkait pertanyaan saya." : "Assalamu'alaikum Ustadz, I seek your guidance regarding my question.",
      foto: "https://i.imgur.com/KymF9yk.png",
      jam: lang === 'id' ? "Senin–Jumat: 19.30–21.00 WIB atau ba'da Ashar sampai sebelum Maghrib" : "Mon–Fri: 19.30–21.00 WIB or after Asr until before Maghrib"
    },
    {
      nama: "Sawi Sujarwo, S.Psi., M.A",
      profil: lang === 'id' ? "Psikolog dan cendekiawan muslim. Fokus parenting, remaja, dan kesehatan mental." : "Psychologist and Muslim scholar. Focus on parenting, youth, and mental health.",
      wa: "+6281377544596",
      msg: lang === 'id' ? "Assalamu'alaikum Ustadz, saya ingin konsultasi singkat." : "Assalamu'alaikum Ustadz, I would like a short consultation.",
      foto: "https://i.imgur.com/NMw3m9V.png",
      jam: lang === 'id' ? "Senin-Jumat: 09.00–11.00 WIB, 19.30–21.00 WIB" : "Mon-Fri: 09.00–11.00 WIB, 19.30–21.00 WIB"
    }
  ];

  const getWALink = (wa: string, msg: string) => {
    const digits = wa.replace(/\D/g, '');
    return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 pb-40 px-4">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-islamic-green/10 rounded-3xl mb-4">
          <Phone className="w-10 h-10 text-islamic-green" />
        </div>
        <h2 className="text-4xl font-bold text-islamic-green font-display">📞 {labels.title}</h2>
        <p className="text-slate-500">{labels.sub}</p>
        <div className="max-w-md mx-auto p-4 bg-islamic-gold/10 border border-islamic-gold/20 rounded-2xl">
          <p className="text-xs text-slate-600 leading-relaxed italic">
            <strong>{labels.note}</strong> {labels.noteText}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ustadzData.map((u, i) => (
          <div key={i} className="glass-panel p-8 rounded-3xl space-y-6 flex flex-col">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl flex-shrink-0 bg-slate-100">
                <img src={u.foto} alt={u.nama} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-islamic-green leading-tight">{u.nama}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{u.profil}</p>
              </div>
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="p-4 bg-slate-50 rounded-2xl space-y-1 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{labels.schedule}</p>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">{u.jam}</p>
              </div>
            </div>

            <button 
              onClick={() => window.open(getWALink(u.wa, u.msg), '_blank')}
              className="w-full py-4 bg-islamic-green text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-lg shadow-islamic-green/20"
            >
              <MessageSquare className="w-5 h-5" /> {labels.chat}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function HafalanView({ lang }: { lang: Language, key?: string }) {
  const labels = lang === 'id' ? {
    title: "Setor Hafalan",
    sub: "Rekam bacaanmu dan kirimkan ke Ustadz untuk dikoreksi.",
    note: "Catatan",
    noteText: "Fitur analisa AI adalah simulasi pembelajaran. Bukan penilaian tajwid resmi. Selalu konfirmasi ke Ustadz pembimbing.",
    selectSurah: "Pilih Surah",
    placeholderSurah: "-- Pilih Surah --",
    fromAyat: "Dari Ayat",
    toAyat: "Sampai Ayat",
    uploadTitle: "Unggah Rekaman Suara (MP3/WAV/M4A)",
    analyzing: "Menganalisa...",
    analyzeBtn: "Analisa dengan AI",
    resultTitle: "Hasil Analisa Keakuratan",
    sendTitle: "Kirim ke Pembimbing",
    ayah: "Ayat",
    surah: "Surah"
  } : {
    title: "Memorization Submission",
    sub: "Record your recitation and send it to your Ustadz for correction.",
    note: "Note",
    noteText: "The AI analysis feature is a learning simulation. Not an official tajweed assessment. Always confirm with your mentor.",
    selectSurah: "Select Surah",
    placeholderSurah: "-- Select Surah --",
    fromAyat: "From Verse",
    toAyat: "To Verse",
    uploadTitle: "Upload Voice Recording (MP3/WAV/M4A)",
    analyzing: "Analyzing...",
    analyzeBtn: "Analyze with AI",
    resultTitle: "Accuracy Analysis Results",
    sendTitle: "Send to Mentor",
    ayah: "Verse",
    surah: "Surah"
  };
  const [surahs, setSurahs] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<any>(null);
  const [verses, setVerses] = useState<any[]>([]);
  const [range, setRange] = useState({ start: 1, end: 7 });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [loadingSurahs, setLoadingSurahs] = useState(false);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  const ustadzList = [
    { name: "Dr. Heri Iskandar, M.Pd", wa: "6289675674860" },
    { name: "Sawi Sujarwo, M.Psi", wa: "6281377544596" },
  ];

  useEffect(() => {
    setLoadingSurahs(true);
    fetch("https://equran.id/api/v2/surat")
      .then(res => res.json())
      .then(data => {
        setSurahs(data.data);
        setLoadingSurahs(false);
      });
  }, []);

  const handleSurahChange = async (nomor: number) => {
    setLoadingVerses(true);
    try {
      const res = await fetch(`https://equran.id/api/v2/surat/${nomor}`);
      const data = await res.json();
      setSelectedSurah(data.data);
      setVerses(data.data.ayat);
      setRange({ start: 1, end: Math.min(data.data.jumlahAyat, 7) });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingVerses(false);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(URL.createObjectURL(file));
      setAnalysisResult('');
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (!audioFile || !selectedSurah) return;
    setAnalyzing(true);
    try {
      const b64 = await fileToBase64(audioFile);
      const res = await analyzeHafalan(
        b64, 
        selectedSurah.namaLatin, 
        `Ayat ${range.start}-${range.end}`
      );
      setAnalysisResult(res);
    } catch (e) {
      console.error(e);
      alert('Gagal menganalisa hafalan. Pastikan file audio valid.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSendWA = (ustadzWa: string) => {
    const msg = `Assalamu'alaikum Ustadz, saya setor hafalan:
- Surah: ${selectedSurah.namaLatin}
- Range: Ayat ${range.start}-${range.end}
(Audio terlampir)`;
    const digits = ustadzWa.replace(/\D/g, '');
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 pb-40 px-4">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-islamic-green/10 rounded-3xl mb-4">
          <Mic className="w-10 h-10 text-islamic-green" />
        </div>
        <h2 className="text-4xl font-bold text-islamic-green font-display">🎙️ Setor Hafalan</h2>
        <p className="text-slate-500">Rekam bacaanmu dan kirimkan ke Ustadz untuk dikoreksi.</p>
        <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-100 rounded-2xl">
          <p className="text-[10px] text-red-600 leading-relaxed italic">
            <strong>Catatan:</strong> Fitur analisa AI adalah simulasi pembelajaran. Bukan penilaian tajwid resmi. Selalu konfirmasi ke Ustadz pembimbing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pilih Surah</label>
                <select 
                  onChange={(e) => handleSurahChange(parseInt(e.target.value))}
                  className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-islamic-green outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>-- Pilih Surah --</option>
                  {surahs.map(s => <option key={s.nomor} value={s.nomor}>{s.nomor}. {s.namaLatin} ({s.nama})</option>)}
                </select>
             </div>

             {selectedSurah && (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Dari Ayat</label>
                      <input 
                        type="number" 
                        min="1" 
                        max={selectedSurah.jumlahAyat}
                        value={range.start}
                        onChange={(e) => setRange({...range, start: parseInt(e.target.value)})}
                        className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-islamic-green outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Sampai Ayat</label>
                      <input 
                        type="number" 
                        min={range.start} 
                        max={selectedSurah.jumlahAyat}
                        value={range.end}
                        onChange={(e) => setRange({...range, end: parseInt(e.target.value)})}
                        className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-islamic-green outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Unggah Rekaman</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept="audio/*" 
                        onChange={handleAudioUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center group-hover:border-islamic-green transition-all bg-slate-50/50">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                           <RefreshCw className={`w-5 h-5 text-slate-400 ${analyzing ? 'animate-spin' : ''}`} />
                        </div>
                        <p className="text-xs font-bold text-slate-500">
                          {audioFile ? audioFile.name : 'Klik atau tarik file audio di sini'}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">MP3, WAV, M4A, WebM (Maks 10MB)</p>
                      </div>
                    </div>
                  </div>
               </motion.div>
             )}
          </div>

          {audioUrl && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-islamic-green/10 rounded-lg">
                  <Tv className="w-4 h-4 text-islamic-green" />
                </div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-700">Preview Rekaman</h3>
              </div>
              <audio src={audioUrl} controls className="w-full h-10 accent-islamic-green" />
              
              <div className="space-y-2 pt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kirim ke Pembimbing</p>
                <div className="grid grid-cols-1 gap-2">
                  {ustadzList.map((u, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSendWA(u.wa)}
                      className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-islamic-green transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-bold text-islamic-green">
                          {u.name.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{u.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-islamic-green" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
           {selectedSurah && verses.length > 0 && (
             <div className="glass-panel p-8 rounded-3xl space-y-6 flex flex-col h-full max-h-[700px]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="text-left">
                    <h3 className="font-bold text-islamic-green text-sm">{selectedSurah.namaLatin}</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Ayat {range.start}-{range.end}</p>
                  </div>
                  <button 
                    disabled={analyzing || !audioFile}
                    onClick={handleAnalyze}
                    className="flex items-center gap-2 px-4 py-2 bg-islamic-gold/10 text-islamic-gold rounded-xl text-xs font-bold hover:bg-islamic-gold hover:text-white transition-all disabled:opacity-50"
                  >
                    {analyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Settings className="w-3 h-3" />}
                    Analisa AI
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 space-y-8">
                  {analysisResult ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                       <div className="p-4 bg-islamic-green/5 border border-islamic-green/10 rounded-2xl">
                          <p className="text-xs font-bold text-islamic-green uppercase tracking-widest mb-3">Hasil Transkrip & Evaluasi</p>
                          <div className="text-slate-700 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                            {analysisResult}
                          </div>
                       </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-12">
                      {verses
                        .filter(v => v.nomorAyat >= range.start && v.nomorAyat <= range.end)
                        .map((v, i) => (
                          <div key={i} className="space-y-4">
                            <div className="flex items-center gap-3">
                               <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                  {v.nomorAyat}
                               </div>
                               <div className="h-[1px] flex-1 bg-slate-50" />
                            </div>
                            <p className="text-2xl font-display text-right leading-[2.5] text-slate-800" dir="rtl">
                              {v.teksArab}
                            </p>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
             </div>
           )}

           {!selectedSurah && (
             <div className="glass-panel p-12 rounded-3xl border-2 border-dashed border-slate-100 h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                  <Mic className="w-8 h-8 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-400">Pilih Surah Terlebih Dahulu</h3>
                  <p className="text-xs text-slate-300">Teks ayat dan opsi rekaman akan muncul di sini.</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
}

function SettingsView({ lang }: { lang: Language, key?: string }) {
  const [activeSubTab, setActiveSubTab] = useState('about');
  const t = translations[lang].settings;
  const features = lang === 'id' ? [
    { icon: <MessageSquare className="w-4 h-4" />, title: "Tanya jawab Islami", desc: "Powered by AI (Gemini) untuk konsultasi cepat dengan 8 persona unik termasuk KidsBot." },
    { icon: <Heart className="w-4 h-4" />, title: "KidsBot & Edukasi", desc: "Konten edukasi Islami ramah anak dengan gaya bahasa yang ceria." },
    { icon: <Clock className="w-4 h-4" />, title: "Jadwal Sholat Realtime", desc: "Lokasi & metode hisab bisa diatur sesuai kebutuhan." },
    { icon: <Timer className="w-4 h-4" />, title: "Pengingat Sholat", desc: "Countdown presisi dengan integrasi Al-Adhan API." },
    { icon: <BookOpen className="w-4 h-4" />, title: "KhutbahGPT", desc: "Generator khutbah singkat berbasis kecerdasan buatan." },
    { icon: <Mic className="w-4 h-4" />, title: "Setoran Hafalan", desc: "Validasi bacaan Al-Qur'an menggunakan teknologi AI." },
    { icon: <Music className="w-4 h-4" />, title: "Murottal Al-Qur'an", desc: "Streaming audio berkualitas tinggi dari MP3Quran." },
    { icon: <Calculator className="w-4 h-4" />, title: "Kalkulator Zakat", desc: "Otomatis ambil harga emas terupdate via GoldAPI." },
    { icon: <Heart className="w-4 h-4" />, title: "Doa Harian", desc: "Kumpulan doa Hisnul Muslim dan EQuran.id API." },
    { icon: <CloudLightning className="w-4 h-4" />, title: "Integrasi IoT", desc: "Siap terhubung ke display masjid dan smart home." },
    { icon: <Tv className="w-4 h-4" />, title: "Live TV Islami", desc: "Akses siaran langsung channel dakwah pilihan." }
  ] : [
    { icon: <MessageSquare className="w-4 h-4" />, title: "Islamic Q&A", desc: "Powered by AI (Gemini) for quick consultation with 8 unique personas including KidsBot." },
    { icon: <Heart className="w-4 h-4" />, title: "KidsBot & Education", desc: "Child-friendly Islamic educational content with a cheerful tone." },
    { icon: <Clock className="w-4 h-4" />, title: "Realtime Prayer Times", desc: "Configurable location and calculation methods." },
    { icon: <Timer className="w-4 h-4" />, title: "Prayer Reminder", desc: "Precise countdown with Al-Adhan API integration." },
    { icon: <BookOpen className="w-4 h-4" />, title: "KhutbahGPT", desc: "AI-powered short khutbah generator." },
    { icon: <Mic className="w-4 h-4" />, title: "Hifz Check", desc: "AI-based Quranic recitation validation." },
    { icon: <Music className="w-4 h-4" />, title: "Audio Quran", desc: "High-quality streaming from MP3Quran." },
    { icon: <Calculator className="w-4 h-4" />, title: "Zakat Calculator", desc: "Auto-fetch latest gold prices via GoldAPI." },
    { icon: <Heart className="w-4 h-4" />, title: "Daily Prayers", desc: "Hisnul Muslim collection and EQuran.id API." },
    { icon: <CloudLightning className="w-4 h-4" />, title: "IoT Integration", desc: "Ready for mosque displays and smart home devices." },
    { icon: <Tv className="w-4 h-4" />, title: "Islamic Live TV", desc: "Access curated Islamic preaching channels." }
  ];

  const labels = lang === 'id' ? {
    sub: "Konfigurasi aplikasi dan informasi fitur SmartFaith.",
    eco: "SmartFaith AI Ecosystem",
    ecoSub: "Platform digital Islami terpadu yang dirancang untuk mendukung gaya hidup muslim modern dengan bantuan kecerdasan buatan dan data realtime.",
    ver: "Versi Aplikasi",
    method: "Metode Hisab",
    correction: "Koreksi Waktu (Menit)",
    notif: "Notifikasi Adzan",
    notifSub: "Putar suara adzan saat waktu sholat tiba",
    data: "Mode Hemat Data",
    dataSub: "Gunakan audio bitrate rendah untuk murottal",
    iot: "Integrasi IoT Display",
    iotSub: "Sinkronkan jadwal ke display eksternal",
  } : {
    sub: "App configuration and SmartFaith feature information.",
    eco: "SmartFaith AI Ecosystem",
    ecoSub: "Integrated Islamic digital platform designed to support modern Muslim lifestyles with AI assistance and realtime data.",
    ver: "Application Version",
    method: "Calculation Method",
    correction: "Time Correction (Minutes)",
    notif: "Adhan Notification",
    notifSub: "Play Adhan audio when prayer time arrives",
    data: "Data Saving Mode",
    dataSub: "Use low bitrate audio for streaming",
    iot: "IoT Display Integration",
    iotSub: "Sync schedule to external displays",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 pb-40 px-4">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-islamic-green/10 rounded-2xl mb-2">
          <Settings className="w-8 h-8 text-islamic-green" />
        </div>
        <h2 className="text-3xl font-bold text-islamic-green font-display">{t.title}</h2>
        <p className="text-slate-500 text-sm">{labels.sub}</p>
      </div>

      <div className="flex justify-center p-1 bg-slate-100 rounded-2xl w-fit mx-auto">
        <button 
          onClick={() => setActiveSubTab('about')}
          className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'about' ? 'bg-white text-islamic-green shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          {t.aboutTab}
        </button>
        <button 
          onClick={() => setActiveSubTab('pref')}
          className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'pref' ? 'bg-white text-islamic-green shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          {t.prefTab}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'about' ? (
          <motion.div 
            key="about"
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="glass-panel p-8 rounded-3xl space-y-6 border-b-4 border-islamic-gold">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-islamic-green">{labels.eco}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {labels.ecoSub}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-white/50 rounded-2xl border border-slate-50 hover:border-islamic-green/20 transition-colors">
                    <div className="p-3 bg-islamic-green/5 rounded-xl h-fit text-islamic-green">
                      {f.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-700">{f.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                         <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">{labels.ver}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">v2.4.0-PROD (Build: 20260427)</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-islamic-gold uppercase tracking-widest">Powered by</p>
                      <p className="text-xs font-black text-islamic-green">Gemini AI Engine</p>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="pref"
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="glass-panel p-8 rounded-3xl space-y-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{labels.method}</label>
                    <select className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-islamic-green outline-none">
                      <option>Kemenag RI</option>
                      <option>Muslim World League</option>
                      <option>Islamic Society of North America</option>
                      <option>Umm al-Qura University, Makkah</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{labels.correction}</label>
                    <input type="number" defaultValue="2" className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-islamic-green outline-none" />
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-700">{labels.notif}</p>
                        <p className="text-[10px] text-slate-400">{labels.notifSub}</p>
                      </div>
                      <div className="w-12 h-6 bg-islamic-green rounded-full relative cursor-pointer">
                         <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                      </div>
                   </div>

                   <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-700">{labels.data}</p>
                        <p className="text-[10px] text-slate-400">{labels.dataSub}</p>
                      </div>
                      <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                         <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                      </div>
                   </div>

                   <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-700">{labels.iot}</p>
                        <p className="text-[10px] text-slate-400">{labels.iotSub}</p>
                      </div>
                      <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                         <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button className="flex-1 py-4 bg-islamic-green text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg">{t.save}</button>
                <button className="px-6 py-4 bg-red-50 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all">{t.reset}</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ToolsView() { return null; }
