"use client"; // 👈 บังคับให้รันฝั่ง Browser (เพราะต้องมีการกดปุ่ม, พิมพ์ข้อความ, เปลี่ยนหน้า)

import { useState, useEffect } from "react";
import axios from "axios"; // 📦 ไปรษณีย์: ตัวรับส่งข้อมูลกับ Backend
import { Play, UserCircle, RefreshCcw } from "lucide-react"; // 🎨 ไอคอนสวยๆ
import Link from "next/link"; // 🔗 ลิงก์เปลี่ยนหน้า

// --- 📝 กำหนดหน้าตาข้อมูล (TypeScript Interface) ---
// เพื่อให้เขียนโค้ดง่ายขึ้น รู้ว่าตัวแปรไหนมีไส้ในเป็นอะไรบ้าง

// โครงสร้างข้อมูล "คำศัพท์" ที่รับมาจาก Backend
interface WordData {
  word: string;
  type: string;         // ชนิดคำ (Noun, Verb)
  pronunciation: string; // คำอ่าน
  meaning: string;      // ความหมาย
  example: string;      // ประโยคตัวอย่าง
  imageUrl: string;     // ลิงก์รูปภาพ
}

// โครงสร้างข้อมูล "ผลการตรวจ" ที่รับกลับมาจาก n8n
interface Feedback {
  score: number;            // คะแนน (0-10)
  level: string;            // ระดับ (Beginner, Intermediate...)
  suggestion: string;       // คำแนะนำจาก AI
  corrected_sentence: string; // ประโยคที่แก้ให้ถูกแล้ว
}

export default function WordOfTheDay() {
  // --- 1. ประกาศตัวแปรเก็บสถานะ (State) ---
  
  // เก็บข้อมูลคำศัพท์ปัจจุบัน (เริ่มมาเป็น null คือยังไม่มีของ)
  const [wordData, setWordData] = useState<WordData | null>(null);
  
  // เก็บข้อความที่ผู้ใช้พิมพ์ในช่องว่าง
  const [sentence, setSentence] = useState("");
  
  // เช็คว่า "ส่งคำตอบหรือยัง?" (ถ้า false = หน้าโจทย์, ถ้า true = หน้าผลลัพธ์)
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // เก็บผลการตรวจจาก AI
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  
  // เช็คว่า "กำลังโหลดอยู่ไหม?" (เพื่อโชว์ตัวหมุนๆ)
  const [loading, setLoading] = useState(true);

  // --- 2. ทำงานครั้งแรกที่เข้าหน้าเว็บ (useEffect) ---
  useEffect(() => {
    fetchWord(); // สั่งให้ไปดึงคำศัพท์มาทันที
  }, []);

  // --- 3. ฟังก์ชันดึงคำศัพท์ใหม่ (Fetch Word) ---
  const fetchWord = async () => {
    setLoading(true); // เริ่มหมุน Loading
    try {
      // 🚀 ยิงไปขอคำศัพท์จาก Python Backend
      const res = await axios.get("http://localhost:8000/api/word");
      
      // 🛡️ ป้องกันรูปพัง: ตรวจสอบว่ามีลิงก์รูปไหม? และลิงก์ขึ้นต้นด้วย http ไหม?
      // ถ้าไม่... ให้ใช้รูป Default จาก Unsplash แทน
      const dataWithFallback = {
        ...res.data,
        imageUrl: (res.data.imageUrl && res.data.imageUrl.startsWith("http")) 
          ? res.data.imageUrl 
          : "https://images.unsplash.com/photo-1559627775-60c04fa28249?q=80&w=2070&auto=format&fit=crop"
      };

      setWordData(dataWithFallback); // บันทึกคำศัพท์ลง State
      
      // รีเซ็ตค่าต่างๆ เตรียมพร้อมสำหรับคำใหม่
      setIsSubmitted(false); // กลับไปหน้าโจทย์
      setSentence("");       // ล้างช่องพิมพ์
      setFeedback(null);     // ล้างผลคะแนนเก่า

    } catch (error) {
      console.error("Error fetching word:", error);
    } finally {
      setLoading(false); // หยุดหมุน Loading ไม่ว่าจะสำเร็จหรือพัง
    }
  };

  // --- 4. ฟังก์ชันส่งการบ้าน (Submit) ---
  const handleSubmit = async () => {
    // ถ้ายังไม่พิมพ์ หรือข้อมูลคำศัพท์ยังไม่มา ห้ามส่ง
    if (!sentence || !wordData) return;
    
    try {
        // 🚀 ส่ง "คำศัพท์โจทย์" + "ประโยคที่แต่ง" ไปให้ Backend ตรวจ
        const res = await axios.post("http://localhost:8000/api/validate-sentence", {
            word: wordData.word,
            sentence: sentence
        });
        
        // รับผลตรวจมาเก็บไว้
        setFeedback(res.data);
        
        // เปลี่ยนหน้าจอเป็น "โชว์ผลลัพธ์"
        setIsSubmitted(true); 
    } catch (error) {
        console.error(error);
    }
  };

  // --- 5. ส่วนแสดงผลตอนกำลังโหลด (Loading Screen) ---
  if (loading || !wordData) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#8da399]">
            {/* ตัวหมุนติ้วๆ (Spinner) */}
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <div className="text-xl font-serif text-white">Loading new word...</div>
        </div>
    );
  }

  // --- 6. ส่วนแสดงผลหน้าจอหลัก (Main UI) ---
  return (
    <div className="min-h-screen bg-[#8da399] flex flex-col"> 
      
      {/* --- Navbar (แถบเมนูด้านบน) --- */}
      <nav className="bg-white py-4 px-8 flex justify-between items-center shadow-sm">
        <div className="text-xl font-bold font-serif tracking-tight">worddee.ai</div>
        <div className="space-x-6 text-sm text-gray-500 font-medium">
          <Link href="/dashboard" className="hover:text-teal-700">My Progress</Link>
          <span className="text-teal-600">Word of the Day</span>
        </div>
        <UserCircle className="text-teal-600 w-8 h-8" />
      </nav>

      {/* --- พื้นที่เนื้อหาตรงกลาง --- */}
      <div className="flex-1 flex items-center justify-center p-4">
        
        {/* 🔥 เงื่อนไขการแสดงผล: เช็คว่าส่งงานหรือยัง? (!isSubmitted) */}
        {!isSubmitted ? (
          
          // 👉 [SCENE 1] หน้าโจทย์: ยังไม่ได้ส่งงาน
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-5xl w-full flex flex-col md:flex-row min-h-[500px]">
            
            {/* ฝั่งซ้าย: รูปภาพประกอบ */}
            <div className="p-8 flex items-center justify-center md:border-r md:border-gray-100">
                <div className="w-full md:w-60 md:h-60 shrink-0 bg-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm relative group">
                    <img
                        src={wordData.imageUrl} 
                        alt={wordData.word}
                        className="w-full h-full object-cover transition-opacity duration-500"
                        // 🛠️ กันเหนียว: ถ้ารูปโหลดไม่ได้ ให้เปลี่ยนเป็นรูป Default ทันที
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1559627775-60c04fa28249?q=80&w=2070&auto=format&fit=crop";
                        }}
                    />
                     {/* ปุ่มรีเฟรช: เอาไว้สุ่มคำใหม่ ถ้าไม่ชอบคำนี้ */}
                     <button 
                        onClick={fetchWord}
                        className="absolute top-3 left-3 bg-white/90 p-2 rounded-full hover:bg-white transition shadow-sm opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Get new word"
                    >
                        <RefreshCcw size={18} className="text-gray-700"/>
                    </button>
                </div>
            </div>

            {/* ฝั่งขวา: รายละเอียดคำศัพท์ และช่องพิมพ์ */}
            <div className="md:flex-1 p-10 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-[#1a3c3c] mb-1">Word of the day</h2>
                        <p className="text-gray-400 text-sm">Practice writing a meaningful sentence using today's word.</p>
                    </div>
                    <span className="bg-[#fde68a] text-[#854d0e] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Level Beginner</span>
                </div>

                {/* กล่องแสดงคำศัพท์ */}
                <div className="border border-gray-200 rounded-xl p-6 mt-6 mb-6 relative bg-gray-50/50">
                    <div className="flex items-center gap-3 mb-2">
                        {/* ปุ่ม Play (ทำไว้หลอกๆ ยังไม่มีเสียงจริง) */}
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                            <Play size={14} fill="currentColor" />
                        </button>
                        <h1 className="text-4xl font-serif font-bold text-[#1a3c3c]">{wordData.word}</h1>
                    </div>
                    <p className="text-gray-500 text-sm italic mb-2">{wordData.type} <span className="text-gray-400">{wordData.pronunciation}</span></p>
                    <p className="text-gray-700 font-medium mb-2"><span className="font-bold">Meaning:</span> {wordData.meaning}</p>
                    <p className="text-gray-500 text-sm">"{wordData.example}"</p>
                </div>

                {/* ช่องพิมพ์ประโยค (Textarea) */}
                <textarea 
                    className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    rows={3}
                    placeholder={`Write a sentence using "${wordData.word}"...`}
                    value={sentence}
                    // เมื่อพิมพ์ ให้เอาค่าไปเก็บใส่ตัวแปร sentence
                    onChange={(e) => setSentence(e.target.value)}
                />
              </div>

              {/* ปุ่มกดส่ง */}
              <div className="flex justify-between items-center mt-6">
                <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-600 font-medium hover:bg-gray-50">Do it later</button>
                <button 
                    onClick={handleSubmit}
                    className="px-8 py-2 bg-[#1a3c3c] text-white rounded-full font-medium hover:bg-[#142e2e] transition shadow-md"
                >
                    Submit
                </button>
              </div>
            </div>
          </div>
        ) : (
          
          // 👉 [SCENE 2] หน้าผลลัพธ์: แสดงหลังจากส่งงานแล้ว (isSubmitted = true)
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-12 text-center relative">
             <h2 className="text-3xl font-serif font-bold text-[#1a3c3c] mb-6">Challenge completed</h2>
             
             {/* ถ้ามี feedback จาก n8n ให้แสดงผล */}
             {feedback && (
               <>
                 {/* ส่วนแสดงคะแนนและระดับ */}
                 <div className="flex justify-center gap-4 mb-8">
                    <span className="bg-[#fde68a] text-[#854d0e] px-4 py-1 rounded-full text-sm font-bold">Level {feedback.level}</span>
                    <span className="bg-[#f3f0ff] text-[#6b21a8] px-4 py-1 rounded-full text-sm font-bold">Score {feedback.score}</span>
                 </div>

                 {/* ประโยคที่เราพิมพ์ไป */}
                 <div className="text-left bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                    <p className="text-gray-500 text-sm">Your sentence: <span className="text-gray-800 underline decoration-gray-400">{sentence}</span></p>
                 </div>

                 {/* ประโยคที่ AI แก้ไขให้ + คำแนะนำ */}
                 <div className="text-left bg-[#e6fffa] p-6 rounded-lg border border-[#b2f5ea] mb-8">
                    <p className="text-[#2c7a7b] text-sm mb-2 font-bold">Suggestion: <span className="font-normal text-[#285e61] underline">{feedback.corrected_sentence}</span></p>
                    <p className="text-[#285e61] text-xs italic leading-relaxed">
                        {feedback.suggestion}
                    </p>
                 </div>
               </>
             )}

             <div className="flex justify-between items-center">
                {/* ปุ่มเล่นต่อ: จะไปเรียก fetchWord เพื่อเริ่มรอบใหม่ */}
                <button 
                    onClick={fetchWord}
                    className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 font-bold hover:bg-gray-50"
                >
                    Next Word
                </button>
                {/* ปุ่มไปหน้า Dashboard */}
                <Link href="/dashboard">
                    <button className="px-8 py-3 bg-[#1a3c3c] text-white rounded-full font-bold hover:bg-[#142e2e] transition">
                        View my progress
                    </button>
                </Link>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

