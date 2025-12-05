"use client"; // 👈 บอก Next.js ว่าหน้านี้ทำงานฝั่ง Browser (เพราะมีการใช้ State และ useEffect)

import { useState, useEffect } from "react";
import axios from "axios"; // 📦 ตัวช่วยสำหรับยิง API ไปหา Backend
import { UserCircle, Flame, Clock } from "lucide-react"; // 🎨 ไอคอนสวยๆ (รูปคน, ไฟ, นาฬิกา)
import Link from "next/link"; // 🔗 ตัวช่วยเปลี่ยนหน้าเว็บแบบไม่ต้องโหลดใหม่
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'; // 📊 ไลบรารีวาดกราฟ

export default function Dashboard() {
  // --- 1. การประกาศตัวแปร (State) เพื่อเก็บข้อมูล ---
  
  // data: เก็บข้อมูลสำหรับวาดกราฟ (รับมาจาก Backend)
  const [data, setData] = useState<any[]>([]); 
  
  // stats: เก็บค่าสถิติ (Streak และ เวลาเรียน) เริ่มต้นเป็น 0
  const [stats, setStats] = useState({ streak: 0, minutes: 0 }); 
  
  // isClient: ตัวเช็คว่าหน้าเว็บโหลดเสร็จหรือยัง (ไว้แก้ปัญหา Error ของกราฟ Recharts)
  const [isClient, setIsClient] = useState(false);

  // --- 2. ทำงานเมื่อเปิดหน้าเว็บ (useEffect) ---
  useEffect(() => {
    setIsClient(true); // บอกว่า "ตอนนี้อยู่ฝั่ง Client แล้วนะ"
    fetchData();       // สั่งให้ไปดึงข้อมูลจาก Backend ทันที
  }, []);

  // --- 3. ฟังก์ชันดึงข้อมูลจาก Python Backend ---
  const fetchData = async () => {
    try {
      // 🚀 ยิง Request ไปที่ Python (main.py) ที่พอร์ต 8000
      const res = await axios.get("http://localhost:8000/api/summary");
      
      // เมื่อได้ของกลับมา (res.data) ...
      
      // ✅ อัปเดตตัวเลขสถิติ (ไฟ Streak & นาฬิกา)
      if (res.data && res.data.stats) {
          setStats(res.data.stats);
      }
      
      // ✅ อัปเดตข้อมูลกราฟ
      if (res.data && res.data.chart) {
          setData(res.data.chart);
      }
    } catch (err) {
      console.error("Error fetching summary:", err); // ถ้าพัง ให้แจ้งเตือนใน Console
    }
  };

  // --- 4. ส่วนแสดงผลหน้าเว็บ (JSX/HTML) ---
  return (
    // suppressHydrationWarning ช่วยปิด Error ที่อาจเกิดจาก Browser Extension กวนใจ
    <div className="min-h-screen bg-[#fdf2f8]" suppressHydrationWarning>
      
      {/* --- ส่วน Navbar (แถบด้านบน) --- */}
      <nav className="bg-white py-4 px-8 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="text-xl font-bold font-serif tracking-tight text-[#1a3c3c]">worddee.ai</div>
        <div className="space-x-6 text-sm text-gray-500 font-medium">
          <span className="text-teal-600 border-b-2 border-teal-600 pb-1 cursor-default">My Progress</span>
          {/* ลิงก์ไปยังหน้าฝึกคำศัพท์ */}
          <Link href="/word-of-the-day" className="hover:text-teal-700 transition">Word of the Day</Link>
        </div>
        <UserCircle className="text-teal-600 w-8 h-8" />
      </nav>

      <main className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-serif font-bold text-[#1a3c3c] mb-6">User's learner dashboard</h1>

        {/* --- กล่องข้อความภารกิจ (Mission) --- */}
        <div className="mb-10">
            <h2 className="text-xl font-serif font-bold text-[#1a3c3c] mb-4">Your missions today</h2>
            <div className="bg-[#eff6f5] p-4 rounded-lg text-[#2f5f5f] font-medium text-sm flex items-center border border-[#dcece9]">
                🎉 Keep learning to increase your stats!
            </div>
        </div>

        {/* --- 🌟 Stats Card (ส่วนแสดงสถิติ) --- */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-serif font-bold text-[#2f5f5f] mb-8">Learning consistency</h3>
            <div className="flex justify-around items-center">
                
                {/* 🔥 ส่วนแสดง Streak */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Flame className="text-green-400 w-8 h-8 fill-green-400" />
                        {/* 👇 เอาตัวแปร stats.streak ที่ได้จาก Python มาโชว์ตรงนี้ */}
                        <span className="text-4xl font-bold text-[#1a3c3c]">{stats.streak}</span>
                    </div>
                    <p className="text-gray-500 text-sm">Total Played</p>
                </div>

                {/* เส้นคั่นกลาง */}
                <div className="h-16 w-px bg-gray-200"></div>

                {/* 🕒 ส่วนแสดงเวลาที่เรียน */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Clock className="text-blue-400 w-8 h-8" />
                        {/* 👇 เอาตัวแปร stats.minutes มาโชว์ตรงนี้ */}
                        <span className="text-4xl font-bold text-[#1a3c3c]">{stats.minutes}</span>
                    </div>
                    <p className="text-gray-500 text-sm">Minutes learned</p>
                </div>
            </div>
        </div>

        {/* --- 📊 Chart Area (ส่วนกราฟ) --- */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 min-h-[450px] relative flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 cursor-pointer text-[#1a3c3c] font-bold font-serif text-lg">
                    Writing Scores Progress
                </div>
            </div>
            
            <div className="w-full h-[300px]">
                {/* เช็ค isClient เพื่อป้องกันกราฟพังตอนโหลดครั้งแรก */}
                {isClient ? (
                    <ResponsiveContainer width="100%" height="100%">
                        {/* ส่ง data ที่ได้จาก Python เข้าไปในกราฟ */}
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            {/* defs: กำหนดการไล่สี (Gradient) ให้กราฟดูสวยๆ */}
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1a3c3c" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#1a3c3c" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            {/* แกน X แสดงวันที่ */}
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                            {/* แกน Y แสดงคะแนน 0-10 */}
                            <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                            {/* Tooltip: เวลาเอาเมาส์ชี้แล้วมีข้อมูลขึ้น */}
                            <Tooltip contentStyle={{ borderRadius: '8px' }} />
                            {/* เส้นกราฟ */}
                            <Area type="monotone" dataKey="score" stroke="#1a3c3c" strokeWidth={3} fill="url(#colorScore)" activeDot={{ r: 6 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    // ถ้ากราฟยังโหลดไม่เสร็จ ให้ขึ้นข้อความนี้แทน
                    <div className="flex items-center justify-center h-full text-gray-400">Loading graph...</div>
                )}
            </div>

            {/* ปุ่มกดไปหน้าฝึกศัพท์ */}
            <div className="flex justify-center mt-6">
                <Link href="/word-of-the-day">
                    <button className="bg-[#1a3c3c] text-white px-10 py-3 rounded-full font-bold text-sm hover:bg-[#142e2e] transition shadow-lg transform hover:-translate-y-0.5">
                        Practice More Words
                    </button>
                </Link>
            </div>
        </div>

      </main>
    </div>
  );
}

