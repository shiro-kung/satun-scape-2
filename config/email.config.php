<?php
/**
 * ตั้งค่าอีเมลบริษัททัวร์ — แก้ company_email เป็นอีเมลจริงที่รับคำขอจอง
 *
 * หมายเหตุ: ฟังก์ชัน mail() ของ PHP ต้องรันบนเว็บเซิร์ฟเวอร์ (ไม่ใช่เปิดไฟล์ HTML ตรงๆ)
 * บนโฮสต์จริง from_email ควรเป็นโดเมนเดียวกับเว็บไซต์ (เช่น noreply@yourdomain.com)
 */
return [
    // อีเมลหลักของบริษัททัวร์ที่จะรับการจองและข้อความติดต่อ
    'company_email' => 'booking@satunscape-tours.com',

    // อีเมลสำรอง (เว้นว่างได้) — จะได้รับสำเนาทุกคำขอจอง
    'company_email_cc' => '',

    'company_name' => 'Satun Scape Tours',

    // ผู้ส่งที่แสดงในกล่องจดหมาย (ควรเป็นโดเมนที่โฮสต์อนุญาต)
    'from_email' => 'noreply@satunscape-tours.com',
    'from_name' => 'Satun Scape Website',

    // ส่งสำเนายืนยันให้ลูกค้าที่กรอกอีเมลในฟอร์มจอง
    'send_customer_confirmation' => true,
];
