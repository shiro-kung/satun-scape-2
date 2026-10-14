<?php
/**
 * คัดลอกไฟล์นี้เป็น admin.config.php แล้วตั้งรหัสผ่านแอดมินของตัวเอง
 * cp config/admin.config.example.php config/admin.config.php
 *
 * รหัสผ่านเริ่มต้นของไฟล์ตัวอย่างนี้คือ: satun2026
 * (เปลี่ยนก่อนใช้งานจริงเสมอ — อย่าใช้ค่านี้บนเว็บที่เผยแพร่จริง)
 *
 * วิธีสร้างแฮชรหัสผ่านใหม่ — รันคำสั่งนี้แล้ววาง output ที่ได้แทนค่า
 * 'password_hash' ด้านล่าง:
 *
 *   php -r "echo password_hash('รหัสผ่านใหม่ของคุณ', PASSWORD_DEFAULT), PHP_EOL;"
 */
return [
    'password_hash' => '$2y$12$IW.Cr0q/XBKKQFszq2Kj5euspCdrp.Wxq3/IUcedfZTxPPE0eoi9O',
];
