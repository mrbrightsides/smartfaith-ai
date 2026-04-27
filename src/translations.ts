
export type Language = 'id' | 'en';

export const translations = {
  id: {
    appName: "SmartFaith",
    tagline: "Ekosistem Islami Masa Kini",
    nav: {
      chat: "AI Chatbot",
      prayer: "Waktu Sholat",
      quran: "Al-Quran",
      murottal: "Murottal",
      zakat: "Kalkulator Zakat",
      masjid: "Cari Masjid",
      zikir: "Tasbih Digital",
      doa: "Doa Harian",
      events: "Agenda",
      khutbah: "Khutbah AI",
      livetv: "Live TV",
      hafalan: "Setor Hafalan",
      ustadz: "Tanya Ustadz",
      settings: "Pengaturan"
    },
    chat: {
      welcomeTitle: "Tanya Jawab Islami",
      welcomeDesc: "Pilih spesialisasi ustadz AI Anda di bawah ini.",
      placeholder: "Tanyakan apapun tentang Islam...",
      loading: "Bot sedang berpikir...",
      getWelcome: (persona: string) => {
        const welcomes: any = {
          Fiqh: "Assalamu'alaikum, saya FiqhBot. Saya siap membantu Anda memahami hukum Islam, tata cara ibadah sesuai Sunnah, dan perbandingan madzhab dengan bahasa yang santun dan mudah dipahami. Apa yang ingin Anda tanyakan hari ini?",
          Sirah: "Assalamu'alaikum, selamat datang di SirahBot. Mari kita selami kisah agung perjalanan hidup Rasulullah SAW, para sahabat, serta hikmah luar biasa di baliknya untuk kita teladani di masa kini. Kisah mana yang ingin Anda pelajari?",
          Tarikh: "Assalamu'alaikum, selamat datang di SmartFaith – TarikhBot. Saya akan menemani Anda menjelajahi kejayaan peradaban Islam dari masa ke masa, mengenal ilmuwan muslim agung, hingga perkembangan Islam global. Siap belajar sejarah?",
          Nusantara: "Assalamu'alaikum, saya NusantaraBot. Mari berdiskusi tentang kekayaan sejarah masuknya Islam di Indonesia, peran para Walisongo, dan indahnya harmoni budaya Islam di tanah air kita yang tercinta. Ada topik spesifik?",
          Muamalah: "Assalamu'alaikum, saya MuamalahBot. Saya di sini untuk membantu Anda memahami etika bisnis syariah, fikih jual beli, investasi halal, hingga cara menghindari riba dalam kehidupan ekonomi modern. Apa kendala finansial Anda?",
          GenZ: "Assalamu'alaikum! Halo, aku GenZBot. Di sini tempatnya curhat dan diskusi asik seputar lifestyle muslim kekinian, self-improvement, hingga gimana caranya tetap istiqomah di tengah gempuran tren dunia. Yuk, mulai ngobrol!",
          Muallaf: "Assalamu'alaikum, selamat datang di keluarga besar Islam! Saya MuallafBot, sahabat belajar Anda untuk memahami dasar-dasar akidah, cara bersuci, sholat, dan bimbingan awal iman dengan sabar. Jangan ragu bertanya, ya.",
          Kids: "Halo adik-adik sayang! Assalamu'alaikum! Aku KidsBot, teman bermain dan belajar agamamu yang seru. 🌈 Yuk tanya apa saja tentang indahnya Islam, cerita Nabi yang hebat, atau cara jadi anak sholeh yang disayang Allah. Aku punya banyak cerita seru loh! ✨"
        };
        return welcomes[persona] || "Assalamu'alaikum! Saya SmartFaith AI, ada yang bisa saya bantu hari ini?";
      }
    },
    settings: {
      title: "Pengaturan & Informasi",
      aboutTab: "Tentang Fitur",
      prefTab: "Preferensi App",
      language: "Bahasa",
      method: "Metode Hisab",
      save: "Simpan Perubahan",
      reset: "Atur Ulang"
    },
    zikir: {
      title: "Tasbih Digital",
      sub: "Tap tombol besar untuk menghitung.",
      targetReached: "Alhamdulillah, Target Tercapai! ✨",
      share: "Kirim Ringkasan ke WhatsApp"
    }
  },
  en: {
    appName: "SmartFaith",
    tagline: "Modern Islamic Ecosystem",
    nav: {
      chat: "AI Chatbot",
      prayer: "Prayer Times",
      quran: "Al-Quran",
      murottal: "Audio Quran",
      zakat: "Zakat Calculator",
      masjid: "Find Mosque",
      zikir: "Digital Tasbih",
      doa: "Daily Prayers",
      events: "Events",
      khutbah: "AI Khutbah",
      livetv: "Live TV",
      hafalan: "Hifz Check",
      ustadz: "Ask Ustadz",
      settings: "Settings"
    },
    chat: {
      welcomeTitle: "Islamic Q&A",
      welcomeDesc: "Choose your specialized AI scholars below.",
      placeholder: "Ask anything about Islam...",
      loading: "Thinking...",
      getWelcome: (persona: string) => {
        const welcomes: any = {
          Fiqh: "Assalamu'alaikum, I am FiqhBot. I'm ready to help you understand Islamic law, prayer procedures according to the Sunnah, and madzhab comparisons in a polite and easy-to-understand manner. What would you like to ask today?",
          Sirah: "Assalamu'alaikum, welcome to SirahBot. Let's dive into the great stories of Prophet Muhammad SAW's life, his companions, and the extraordinary wisdom behind them for us to follow today. Which story would you like to explore?",
          Tarikh: "Assalamu'alaikum, welcome to SmartFaith – TarikhBot. I will accompany you in exploring the glory of Islamic civilization through time, meeting great Muslim scientists, and the global development of Islam. Ready to learn history?",
          Nusantara: "Assalamu'alaikum, I am NusantaraBot. Let's discuss the rich history of Islam entering Indonesia, the role of Walisongo, and the beautiful harmony of Islamic culture in our beloved homeland. Any specific topics?",
          Muamalah: "Assalamu'alaikum, I am MuamalahBot. I'm here to help you understand Sharia business ethics, jurisprudence of trade, halal investment, and how to avoid usury in modern economic life. What are your financial concerns?",
          GenZ: "Assalamu'alaikum! Hi, I'm GenZBot. This is the place for cool discussions about modern Muslim lifestyles, self-improvement, and how to stay steadfast amidst world trends. Let's start talking, Buddy!",
          Muallaf: "Assalamu'alaikum, welcome to the big Islamic family! I am MuallafBot, your learning companion for understanding the basics of faith, purification, prayer, and early guidance with patience. Feel free to ask anything.",
          Kids: "Hi there, little friends! Assalamu'alaikum! I'm KidsBot, your fun buddy for learning about Islam. 🌈 Ask me anything about the beauty of Islam, amazing stories of the Prophets, or how to be a good kid loved by Allah. I have many exciting stories for you! ✨"
        };
        return welcomes[persona] || "Assalamu'alaikum! I am SmartFaith AI, how can I help you today?";
      }
    },
    settings: {
      title: "Settings & Info",
      aboutTab: "About Features",
      prefTab: "App Preferences",
      language: "Language",
      method: "Calculation Method",
      save: "Save Changes",
      reset: "Reset"
    },
    zikir: {
      title: "Digital Tasbih",
      sub: "Tap the big button to count.",
      targetReached: "Alhamdulillah, Target Reached! ✨",
      share: "Share Summary to WhatsApp"
    }
  }
};
