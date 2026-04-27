import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY as string });

export type PersonaType = 'Fiqh' | 'Sirah' | 'Tarikh' | 'Nusantara' | 'Muamalah' | 'GenZ' | 'Muallaf' | 'General';

const PERSONA_INSTRUCTIONS: Record<PersonaType, string> = {
  Fiqh: "You are FiqhBot, an expert in Islamic Jurisprudence (Fiqh). Provide answers based on established madhahib (schools of thought), citing evidence from Quran and Sunnah where appropriate. Always maintain a respectful and scholarly tone.",
  Sirah: "You are SirahBot, a specialist in the life and biography of Prophet Muhammad (peace be upon him). Share stories and lessons from the Prophetic Seerah with wisdom and emotion.",
  Tarikh: "You are TarikhBot, an expert in Islamic History. Provide detailed historical context about the Caliphates, Islamic Golden Age, and significant figures in Islam.",
  Nusantara: "You are NusantaraBot, specialized in Islamic culture and history in Southeast Asia (Nusantara). Discuss Wali Songo, local traditions, and the spread of Islam in the region.",
  Muamalah: "You are MuamalahBot, an expert in Islamic finance and social transactions. Advice on ethical trading, zakat, and modern financial issues according to Sharia.",
  GenZ: "You are GenZBot, a relatable and friendly Islamic mentor for the younger generation. Use modern language while keeping the essence of Islamic values. Address contemporary struggles with empathy.",
  Muallaf: "You are MuallafBot, a gentle guide for new reverts. Provide clear, basic explanations of foundational Islamic concepts and help them navigate their new journey with encouragement.",
  General: "You are SmartFaith, a comprehensive Islamic assistant. Help users with general queries about Islam, spirituality, and daily practice."
};

export async function chatWithPersona(persona: PersonaType, message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: PERSONA_INSTRUCTIONS[persona],
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, terjadi gangguan saat menghubungi asisten AI. Silakan coba lagi nanti.";
  }
}

export async function generateKhutbah({
  jenis,
  tema,
  gaya,
  panjang,
  audience,
  tanggal,
  tambahan
}: {
  jenis: string;
  tema: string;
  gaya: string;
  panjang: number;
  audience: string;
  tanggal: string;
  tambahan: string;
}) {
  const prompt = `
TULIS KHUTBAH berbahasa Indonesia, sopan, sesuai adab mimbar.
Jenis: ${jenis}
Tema: ${tema || 'Otomatis'}
Gaya Bahasa: ${gaya}
Target Panjang: ${panjang} kata
Target Jamaah: ${audience || 'Umum'}
Tanggal: ${tanggal}

Struktur:
1. Pembukaan (hamdalah, shalawat, wasiat takwa)
2. Ayat/hadits singkat (terjemah & rujukan ringkas)
3. 3-6 paragraf inti sesuai tema dan jenis khutbah
4. 3-6 poin aksi praktis bernomor atau bullet
5. Penutup (doa ma’tsur ringkas). Untuk Jumat, sertakan ringkasan khutbah kedua.

Kaidah:
- Hindari konten sensitif/politis; tekankan akhlak & ibadah.
- Gunakan rujukan Qur’an/Hadits singkat.
- Bahasa jelas, mudah dicerna.
Tambahan Khusus: ${tambahan || '-'}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are KhutbahGPT, an imam assistant that writes concise, responsible khutbah texts in Indonesian for Muslim audiences. Keep it respectful, apolitical, and practical.",
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Khutbah Generation Error:", error);
    throw error;
  }
}

export async function analyzeHafalan(audioBase64: string, surah: string, range: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Use 1.5 flash for audio processing if available, or just flash
      contents: [
        {
          role: 'user',
          parts: [
            { text: `Simulasi Setoran Hafalan Al-Quran.
Surah: ${surah}
Range Ayat: ${range}

Tolong transkripsi audio ini ke dalam teks Arab dan berikan sedikit masukan/evaluasi singkat mengenai akurasi bacaan berdasarkan teks mushaf tersebut.` },
            {
              inlineData: {
                mimeType: "audio/mp3", // We'll try to normalize to mp3 or whatever the browser gives
                data: audioBase64
              }
            }
          ]
        }
      ],
      config: {
        systemInstruction: "You are a Tahfidz Assistant. Help students by transcribing their recitation and giving helpful, respectful feedback on their Quranic reading accuracy.",
        temperature: 0.4,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Hafalan Analysis Error:", error);
    throw error;
  }
}
