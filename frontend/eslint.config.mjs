// นำเข้าฟังก์ชันและตัวแปรที่จำเป็นจาก eslint/config
// defineConfig: ใช้สำหรับสร้าง object config ของ eslint
// globalIgnores: ใช้สำหรับระบุไฟล์หรือโฟลเดอร์ที่ eslint ควรข้ามการตรวจสอบ
import { defineConfig, globalIgnores } from "eslint/config";

// นำเข้าการตั้งค่า eslint พื้นฐานสำหรับ Next.js (Core Web Vitals)
// ซึ่งรวมกฎเกณฑ์ต่างๆ ที่ Next.js แนะนำเพื่อให้เว็บมีประสิทธิภาพและคุณภาพที่ดี
import nextVitals from "eslint-config-next/core-web-vitals";

// นำเข้าการตั้งค่า eslint สำหรับ TypeScript ในโปรเจกต์ Next.js
// เพื่อให้ eslint เข้าใจและตรวจสอบโค้ด TypeScript ได้อย่างถูกต้อง
import nextTs from "eslint-config-next/typescript";

// สร้างตัวแปร eslintConfig เพื่อเก็บค่า config ทั้งหมด
const eslintConfig = defineConfig([
  // กระจายค่า (spread) การตั้งค่าจาก nextVitals เข้ามาใน config นี้
  ...nextVitals,
  
  // กระจายค่า (spread) การตั้งค่าจาก nextTs เข้ามาใน config นี้
  ...nextTs,

  // Override default ignores of eslint-config-next.
  // ส่วนนี้ใช้สำหรับกำหนดไฟล์หรือโฟลเดอร์ที่ eslint ไม่ต้องเข้าไปยุ่ง (Ignore)
  globalIgnores([
    // Default ignores of eslint-config-next:
    // .next/** : โฟลเดอร์ที่ Next.js สร้างขึ้นตอนรันหรือ build (ไม่ควรไปยุ่ง)
    ".next/**",
    
    // out/** : โฟลเดอร์ผลลัพธ์จากการ export static site (ไม่ควรไปยุ่ง)
    "out/**",
    
    // build/** : โฟลเดอร์ผลลัพธ์จากการ build ทั่วไป (ไม่ควรไปยุ่ง)
    "build/**",
    
    // next-env.d.ts : ไฟล์ TypeScript definition ที่ Next.js สร้างให้อัตโนมัติ (ไม่ควรไปแก้เอง)
    "next-env.d.ts",
  ]),
]);

// ส่งออกค่า config นี้ไปให้ eslint ใช้งาน
export default eslintConfig;
