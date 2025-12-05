// 📦 นำเข้า Link Component จาก Next.js
// ตัวนี้สำคัญมาก! เพราะช่วยให้เปลี่ยนหน้าเว็บได้ "ทันที" โดยไม่ต้องโหลดหน้าใหม่ (Single Page Application)
import Link from "next/link";

// ฟังก์ชัน Component หลักของหน้า Home
export default function Home() {
  return (
    // 🎨 Container หลัก:
    // - min-h-screen: ความสูงอย่างน้อยเต็มหน้าจอ (ไม่ว่าจะจอเล็กหรือใหญ่)
    // - bg-[#fdf4ff]: สีพื้นหลัง (สีเดียวกับที่เรากำหนดไว้ใน globals.css)
    // - flex flex-col items-center justify-center: จัดทุกอย่างให้อยู่ "กึ่งกลางหน้าจอ" ทั้งแนวตั้งและแนวนอน
    <div className="min-h-screen bg-[#fdf4ff] flex flex-col items-center justify-center p-8">
      
      {/* 🏷️ หัวข้อหลัก (Title): Worddee.ai */}
      {/* - font-serif: ใช้ฟอนต์หรูที่ตั้งค่าไว้ใน globals.css */}
      {/* - text-[#1a3c3c]: สีเขียวเข้มเอกลักษณ์ของแอป */}
      <h1 className="text-5xl font-serif font-bold text-[#1a3c3c] mb-4">Worddee.ai</h1>
      
      {/* 📝 คำโปรย (Subtitle) */}
      <p className="text-gray-600 mb-10 text-lg">ฝึกแต่งประโยคภาษาอังกฤษด้วย AI</p>

      {/* 🔘 กลุ่มปุ่มกด (Button Group) */}
      <div className="flex gap-6"> {/* gap-6: เว้นระยะห่างระหว่างปุ่ม */}
        
        {/* 👉 ปุ่มที่ 1: ไปหน้าเริ่มเล่น (Word of the Day) */}
        <Link href="/word-of-the-day">
          <button className="px-8 py-4 bg-[#1a3c3c] text-white rounded-full text-xl font-bold hover:bg-[#142e2e] transition shadow-lg">
            Start Challenge 🚀 {/* เพิ่มอีโมจิให้ดูน่ากด */}
          </button>
        </Link>

        {/* 👉 ปุ่มที่ 2: ไปหน้าดูสถิติ (Dashboard) */}
        <Link href="/dashboard">
          {/* ปุ่มนี้ดีไซน์เป็นแบบ "โปร่ง" (Outline) คือพื้นขาว ขอบสีเขียว เพื่อไม่ให้แย่งซีนปุ่มหลัก */}
          <button className="px-8 py-4 bg-white text-[#1a3c3c] border-2 border-[#1a3c3c] rounded-full text-xl font-bold hover:bg-gray-50 transition shadow-lg">
            View Dashboard 📊
          </button>
        </Link>
      </div>
    </div>
  );
}
