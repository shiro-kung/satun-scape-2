'use strict';

function $(id) {
    return document.getElementById(id);
}

function setText(id, text) {
    var el = $(id);
    if (el != null && text !== undefined) el.textContent = text;
}

function setHTML(id, html) {
    var el = $(id);
    if (el != null && html !== undefined) el.innerHTML = html;
}

function isHomePage() {
    var p = window.location.pathname || '';
    return document.body.classList.contains('page-home') ||
        /index\.html$/i.test(p) ||
        /\/satunscape\/?$/i.test(p) ||
        (p.endsWith('/') && !/[a-z0-9]+\.html$/i.test(p.slice(0, -1)));
}

function getPageKey() {
    var m = document.body.className.match(/\bpage-([a-z-]+)\b/);
    if (m) return m[1];
    var p = (window.location.pathname || '').toLowerCase();
    if (/index\.html/.test(p) || /\/$/.test(p)) return 'home';
    if (/attractions\.html/.test(p)) return 'attractions';
    if (/accommodation\.html/.test(p)) return 'accommodation';
    if (/cafes\.html/.test(p)) return 'cafes';
    if (/market\.html/.test(p)) return 'market';
    if (/contact\.html/.test(p)) return 'contact';
    if (/booking\.html/.test(p)) return 'booking';
    if (/cultural\.html/i.test(p)) return 'cultural';
    if (/natural\.html/i.test(p)) return 'natural';
    return 'home';
}

/**
 * UI strings: English, Thai, Chinese (Simplified)
 */
var I18N = {
    en: {
        skip: 'Skip to content',
        nav: {
            home: 'Home',
            attractions: 'Attractions',
            stay: 'Stay',
            book: 'Book',
            eat: 'Eat & drink',
            markets: 'Markets',
            contact: 'Contact'
        },
        visitor: [
            '<i class="fas fa-clock" aria-hidden="true"></i> <strong>Time:</strong> Thailand (ICT · GMT+7)',
            '<i class="fas fa-coins" aria-hidden="true"></i> <strong>Money:</strong> Thai baht (THB)',
            '<i class="fas fa-plane" aria-hidden="true"></i> <strong>Near:</strong> Hat Yai airport · Langkawi / Malaysia',
            '<i class="fas fa-water" aria-hidden="true"></i> <strong>Season:</strong> Nov–Apr best for sea & trekking'
        ],
        footer: {
            note: 'Contact',
            tourism: 'Tourism Thailand'
        },
        contactForm: {
            name: 'Name',
            email: 'Email',
            message: 'Message',
            send: 'Send message',
            thanks: 'Thank you for your message!',
            error: 'There was an error sending your message.'
        },
        bookingForm: {
            thanks: 'Booking request received!',
            thanksRef: 'Reference:',
            emailSentNote: 'Sent to our tour team by email.',
            emailPendingNote: 'Saved — email could not be sent; we will follow up if possible.',
            error: 'Could not reach the server. Your request was saved locally.',
            validation: 'Please fill in all required fields.',
            notice: 'Requests are non-binding until confirmed. Peak season (Nov–Apr): book early for boats and park permits.',
            tabTour: 'Tours',
            tabCar: 'Car hire',
            tabBoat: 'Boat',
            tabStay: 'Stay',
            legendContact: 'Your details',
            recentHeading: 'Your recent requests',
            titleTour: 'Book a tour',
            descTour: 'Day trips and multi-day packages around Tarutao, caves, waterfalls, and town heritage walks.',
            titleCar: 'Rent a car',
            descCar: 'Self-drive or with driver. Valid licence and passport required; international permit recommended for foreign licences.',
            titleBoat: 'Book a boat',
            descBoat: 'Ferry and speedboat routes to Tarutao, Ko Lipe, and island hops. Schedules vary with season and sea conditions.',
            titleStay: 'Book accommodation',
            descStay: 'Hotels and guesthouses in Satun town, La-ngu, and near Pakbara. See our Stay page for photos and maps.',
            labelPackage: 'Tour package',
            labelDate: 'Preferred date',
            labelAdults: 'Adults',
            labelChildren: 'Children',
            labelPickup: 'Pickup area',
            labelName: 'Full name',
            labelEmail: 'Email',
            labelPhone: 'Phone / WhatsApp',
            labelNotes: 'Special requests',
            submitTour: 'Request tour booking',
            labelVehicle: 'Vehicle',
            labelDriver: 'Driver',
            labelPickupDate: 'Pickup date',
            labelPickupTime: 'Pickup time',
            labelReturnDate: 'Return date',
            labelLocation: 'Pickup / drop-off',
            submitCar: 'Request car rental',
            labelRoute: 'Route',
            labelPassengers: 'Passengers',
            labelReturnTrip: 'Return trip',
            labelReturnDateBoat: 'Return date',
            labelLuggage: 'Luggage / notes',
            submitBoat: 'Request boat booking',
            labelProperty: 'Property',
            labelRooms: 'Rooms',
            labelCheckin: 'Check-in',
            labelCheckout: 'Check-out',
            labelGuests: 'Guests',
            labelRoomPrefs: 'Room preferences',
            submitStay: 'Request stay booking',
            ctaTitle: 'Ready to book?',
            ctaDesc: 'Reserve tours, cars, boats, and hotels in one place.',
            ctaBtn: 'Open booking',
            pkgHeading: 'Recommended packages',
            pkgSub: 'Popular itineraries — tap a package to view full details, then book below.',
            pkgViewBtn: 'View details',
            pkgModalBook: 'Book this package',
            pkgModalClose: 'Close',
            modalDuration: 'Duration',
            modalGroup: 'Group size',
            modalItinerary: 'Itinerary',
            modalIncludes: 'Included',
            modalExcludes: 'Not included',
            modalBring: 'What to bring',
            modalNotes: 'Good to know',
            badgeTour: 'Tour',
            badgeBoat: 'Boat',
            badgeCar: 'Car',
            badgeStay: 'Stay',
            pkg1title: 'Tarutao Island Explorer',
            pkg1meta: '1 day · Pakbara pier',
            pkg1desc: 'Speedboat to Tarutao, snorkeling stops, packed lunch, national park fees arranged.',
            pkg1price: 'From ฿2,500 / person',
            pkg2title: 'Lipe Snorkel & Beach Day',
            pkg2meta: '1 day · Ko Lipe',
            pkg2desc: 'Long-tail or speedboat tour, reef snorkeling, beach time, return same day or overnight on request.',
            pkg2price: 'From ฿3,200 / person',
            pkg3title: 'Cave & Waterfall Nature Day',
            pkg3meta: '1 day · Manang district',
            pkg3desc: 'Morning at Phu Pha Phet Cave, afternoon at Wang Sai Thong—transport and local guide included.',
            pkg3price: 'From ฿1,800 / person',
            pkg4title: 'Pakbara ↔ Lipe Ferry Bundle',
            pkg4meta: 'Round trip · 2–3 hrs each leg',
            pkg4desc: 'Shared speedboat seats Pakbara pier to Ko Lipe and return—ideal for a 2–3 night Lipe stay.',
            pkg4price: 'From ฿1,200 / person',
            pkg5title: '3-Day SUV with Driver',
            pkg5meta: '3 days · Satun province',
            pkg5desc: 'Air-conditioned SUV and driver for waterfalls, caves, markets, and Pakbara pier transfers.',
            pkg5price: 'From ฿4,500 / day',
            pkg6title: 'Satun Town Weekend Stay',
            pkg6meta: '2 nights · The One Boutique Hotel',
            pkg6desc: 'Central Satun hotel, breakfast option, walking distance to night market and Kuden Mansion.',
            pkg6price: 'From ฿1,400 / night',
            pkgSelected: 'Package selected — complete the form below.'
        },
        pages: {
            home: {
                docTitle: 'Satun Scape · Visit Satun Province, Thailand',
                heroEyebrow: 'Southern Thailand · Andaman Sea coast',
                heroLead: 'Islands, jungle waterfalls, caves, fresh seafood—and a quieter side of Thailand. Made for travellers who prefer plain English and practical trip snippets.',
                infoSatun: 'Plan your visit to Satun',
                generalTitle: 'About the province',
                generalDesc: 'Satun is Thailand’s southwestern province along the Andaman Sea, next to Malaysian Perlis and Langkawi. Expect Malay–Thai culture, limestone islands—and smaller crowds than Phuket or Krabi.',
                introTitle: 'Don’t miss',
                att1: 'Archipelago cruises, snorkeling, jungle trails—book ahead in peak season.',
                att2: 'Colonial-era mansion and provincial museum—easy stop downtown.',
                att3: 'One of Thailand’s largest cave systems—bring grippy shoes.',
                att4: 'Limestone terraces and pools—a classic inland nature outing.',
                cuisineTitle: 'Food travellers love',
                cuisineDesc: 'Southern Thai flavours are bold; halal kitchens are widespread. Try grilled fish, squid, crab, roadside roti, and iced coffee.',
                tipsTitle: 'Quick tips',
                tip1: 'Weather: November–April is driest for boats; July–October can disrupt ferries.',
                tip2: 'Getting around: songthaews, taxis, Grab (where available), hired car—or scooter only with a valid licence plus IDP where required.',
                tip3: 'Courtesy: cover shoulders and knees at holy sites; remove shoes where signed; drones need permits in many parks.',
                official: '<strong><i class="fas fa-globe"></i> Provincial info:</strong> <a href="https://www.satun.go.th/frontpage" target="_blank" rel="noopener noreferrer">satun.go.th</a>',
                hotHead: 'Highlighted places',
                hotSub: 'District names help you locate spots on maps.',
                videoTitle: 'Satun from the air',
                videoDesc: 'Muted by default—you can turn sound on in the player.',
                cafesHead: 'Coffee & halal-friendly bites',
                cafesSub: 'Local favourites—the full roundup is on the eats page.',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            attractions: {
                docTitle: 'Attractions · Satun Scape',
                heroEyebrow: 'Satun Province · Thailand',
                heroTitle: 'Choose your attraction category',
                pageIntro: 'Explore attractions',
                culturalBtn: 'Cultural attractions',
                naturalBtn: 'Natural attractions',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            accommodation: {
                docTitle: 'Stay · Satun Scape',
                heroEyebrow: 'Hotels & guesthouses',
                heroTitle: 'Find your stay',
                pageIntro: 'Explore places to stay',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            cafes: {
                docTitle: 'Eat & drink · Satun Scape',
                heroEyebrow: 'Cafés & restaurants',
                heroTitle: 'Cafés & restaurants',
                pageIntro: 'Explore cafés and restaurants',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            market: {
                docTitle: 'Markets · Satun Scape',
                heroEyebrow: 'Local markets',
                heroTitle: 'Markets',
                pageIntro: 'Explore markets',
                sectionMarket: 'Market information',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            contact: {
                docTitle: 'Contact · Satun Scape',
                heroEyebrow: 'We’re here to help',
                heroTitle: 'Contact us',
                contactTitle: 'We’d love to hear from you',
                contactInfoHeading: 'Contact information',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            booking: {
                docTitle: 'Book · Satun Scape',
                heroEyebrow: 'Plan your trip',
                heroTitle: 'Book tours & travel',
                heroLead: 'Reserve island tours, hire a car, book boat transfers, or request a hotel stay. We confirm by email within 1–2 business days.',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            cultural: {
                docTitle: 'Cultural attractions · Satun Scape',
                heroEyebrow: 'Heritage & museums',
                heroTitle: 'Cultural attractions',
                pageIntro: 'Explore cultural attractions',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            natural: {
                docTitle: 'Natural attractions · Satun Scape',
                heroEyebrow: 'Islands · jungle · caves',
                heroTitle: 'Natural attractions',
                pageIntro: 'Explore natural attractions',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            }
        }
    },
    th: {
        skip: 'ข้ามไปยังเนื้อหา',
        nav: {
            home: 'หน้าแรก',
            attractions: 'สถานที่ท่องเที่ยว',
            stay: 'ที่พัก',
            book: 'จอง',
            eat: 'กิน & ดื่ม',
            markets: 'ตลาด',
            contact: 'ติดต่อ'
        },
        visitor: [
            '<i class="fas fa-clock" aria-hidden="true"></i> <strong>เวลา:</strong> ประเทศไทย (ICT · GMT+7)',
            '<i class="fas fa-coins" aria-hidden="true"></i> <strong>สกุลเงิน:</strong> บาท (THB)',
            '<i class="fas fa-plane" aria-hidden="true"></i> <strong>การเดินทาง:</strong> สนามบินหาดใหญ่ · เชื่อมมาเลเซีย / ลังกาวี',
            '<i class="fas fa-water" aria-hidden="true"></i> <strong>ฤดูท่องเที่ยว:</strong> พ.ย.–เม.ย. เหมาะกับทะเลและเดินป่า'
        ],
        footer: {
            note: 'ติดต่อ',
            tourism: 'การท่องเที่ยวแห่งประเทศไทย'
        },
        contactForm: {
            name: 'ชื่อ',
            email: 'อีเมล',
            message: 'ข้อความ',
            send: 'ส่งข้อความ',
            thanks: 'ขอบคุณสำหรับข้อความของคุณ!',
            error: 'ส่งข้อความไม่สำเร็จ กรุณาลองอีกครั้ง'
        },
        bookingForm: {
            thanks: 'รับคำขอจองแล้ว!',
            thanksRef: 'เลขอ้างอิง:',
            emailSentNote: 'ส่งถึงอีเมลบริษัททัวร์แล้ว',
            emailPendingNote: 'บันทึกแล้ว แต่ส่งอีเมลไม่สำเร็จ — ทีมงานจะติดต่อเมื่อเป็นไปได้',
            error: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ บันทึกไว้ในเครื่องของคุณแล้ว',
            validation: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบ',
            notice: 'คำขอยังไม่ผูกพันจนกว่าจะได้รับการยืนยัน ช่วงพ.ย.–เม.ย. แนะนำจองเรือและเข้าอุทยานล่วงหน้า',
            tabTour: 'ทัวร์',
            tabCar: 'เช่ารถ',
            tabBoat: 'เรือ',
            tabStay: 'ที่พัก',
            legendContact: 'ข้อมูลติดต่อ',
            recentHeading: 'คำขอล่าสุดของคุณ',
            titleTour: 'จองทัวร์',
            descTour: 'ทริปวันเดียวและหลายวัน อุทยานตะรุเตา ถ้ำ น้ำตก และเดินชมเมือง',
            titleCar: 'เช่ารถ',
            descCar: 'ขับเองหรือมีคนขับ ต้องมีใบขับขี่และพาสปอร์ต แนะนำใบขับขี่สากลสำหรับชาวต่างชาติ',
            titleBoat: 'จองเรือ',
            descBoat: 'เรือข้ามไปตะรุเตา เกาะหลีเป๊ะ และทัวร์เกาะ ตารางเรือขึ้นกับฤดูกาลและสภาพทะเล',
            titleStay: 'จองที่พัก',
            descStay: 'โรงแรมและเกสต์เฮาส์ในเมืองสตูล ละงู และใกล้ท่าเรือปากบารา ดูรูปและแผนที่ในหน้าที่พัก',
            labelPackage: 'แพ็กเกจทัวร์',
            labelDate: 'วันที่ต้องการ',
            labelAdults: 'ผู้ใหญ่',
            labelChildren: 'เด็ก',
            labelPickup: 'จุดรับ',
            labelName: 'ชื่อ-นามสกุล',
            labelEmail: 'อีเมล',
            labelPhone: 'โทร / WhatsApp',
            labelNotes: 'ความต้องการพิเศษ',
            submitTour: 'ส่งคำขอจองทัวร์',
            labelVehicle: 'ประเภทรถ',
            labelDriver: 'คนขับ',
            labelPickupDate: 'วันรับรถ',
            labelPickupTime: 'เวลารับรถ',
            labelReturnDate: 'วันคืนรถ',
            labelLocation: 'จุดรับ-ส่ง',
            submitCar: 'ส่งคำขอเช่ารถ',
            labelRoute: 'เส้นทาง',
            labelPassengers: 'จำนวนผู้โดยสาร',
            labelReturnTrip: 'เที่ยวกลับ',
            labelReturnDateBoat: 'วันกลับ',
            labelLuggage: 'สัมภาระ / หมายเหตุ',
            submitBoat: 'ส่งคำขอจองเรือ',
            labelProperty: 'ที่พัก',
            labelRooms: 'ห้อง',
            labelCheckin: 'เช็คอิน',
            labelCheckout: 'เช็คเอาท์',
            labelGuests: 'ผู้เข้าพัก',
            labelRoomPrefs: 'ความต้องการห้อง',
            submitStay: 'ส่งคำขอจองที่พัก',
            ctaTitle: 'พร้อมจองทริป?',
            ctaDesc: 'จองทัวร์ รถ เรือ และที่พักได้ในที่เดียว',
            ctaBtn: 'ไปหน้าจอง',
            pkgHeading: 'แพ็กเกจแนะนำ',
            pkgSub: 'ทริปยอดนิยม — กดที่แพ็กเกจเพื่อดูรายละเอียดครบ แล้วจองในฟอร์มด้านล่าง',
            pkgViewBtn: 'ดูรายละเอียด',
            pkgModalBook: 'จองแพ็กเกจนี้',
            pkgModalClose: 'ปิด',
            modalDuration: 'ระยะเวลา',
            modalGroup: 'จำนวนผู้ร่วมทริป',
            modalItinerary: 'กำหนดการ',
            modalIncludes: 'รวมในแพ็กเกจ',
            modalExcludes: 'ไม่รวม',
            modalBring: 'สิ่งที่ควรเตรียม',
            modalNotes: 'ข้อควรทราบ',
            badgeTour: 'ทัวร์',
            badgeBoat: 'เรือ',
            badgeCar: 'รถ',
            badgeStay: 'ที่พัก',
            pkg1title: 'สำรวจเกาะตะรุเตา',
            pkg1meta: '1 วัน · ท่าเรือปากบารา',
            pkg1desc: 'เรือเร็วไปตะรุเตา จุดดำน้ำ อาหารกลางวัน จัดค่าธรรมเนียมอุทยานให้',
            pkg1price: 'เริ่ม ฿2,500 / คน',
            pkg2title: 'ดำน้ำ & ชายหาดเกาะหลีเป๊ะ',
            pkg2meta: '1 วัน · เกาะหลีเป๊ะ',
            pkg2desc: 'ทัวร์เรือหางยาวหรือเรือเร็ว ดำน้ำตื้น พักชายหาด กลับวันเดียวหรือค้างคืนได้',
            pkg2price: 'เริ่ม ฿3,200 / คน',
            pkg3title: 'ถ้ำ & น้ำตกวันเดียว',
            pkg3meta: '1 วัน · อำเภอมะนัง',
            pkg3desc: 'เช้าที่ถ้ำภูผาเพชร บ่ายที่น้ำตกวังสายทอง รวมรถและไกด์ท้องถิ่น',
            pkg3price: 'เริ่ม ฿1,800 / คน',
            pkg4title: 'เรือปากบารา ↔ หลีเป๊ะ ไป–กลับ',
            pkg4meta: 'ไป–กลับ · ละ 2–3 ชม.',
            pkg4desc: 'ที่นั่งเรือเร็วร่วมจากปากบาราไปหลีเป๊ะและกลับ เหมาะพักเกาะ 2–3 คืน',
            pkg4price: 'เริ่ม ฿1,200 / คน',
            pkg5title: 'รถ SUV พร้อมคนขับ 3 วัน',
            pkg5meta: '3 วัน · ทั่วจังหวัดสตูล',
            pkg5desc: 'รถ SUV แอร์และคนขับ ไปน้ำตก ถ้ำ ตลาด และส่งท่าเรือปากบารา',
            pkg5price: 'เริ่ม ฿4,500 / วัน',
            pkg6title: 'พักสุดสัปดาห์เมืองสตูล',
            pkg6meta: '2 คืน · The One Boutique Hotel',
            pkg6desc: 'โรงแรมใจกลางเมือง ใกล้ตลาดกลางคืนและคฤหาสน์กูเด็น',
            pkg6price: 'เริ่ม ฿1,400 / คืน',
            pkgSelected: 'เลือกแพ็กเกจแล้ว — กรอกฟอร์มด้านล่างให้ครบ'
        },
        pages: {
            home: {
                docTitle: 'Satun Scape · จังหวัดสตูล ประเทศไทย',
                heroEyebrow: 'ภาคใต้ตอนล่าง · ชายฝั่งทะเลอันดามัน',
                heroLead: 'เกาะ น้ำตก ถ้ำ อาหารทะเลสด — และบรรยากาศไทยใต้ที่เงียบกว่าเมืองท่องเที่ยวใหญ่ เหมาะสำหรับผู้ที่ต้องการข้อมูลชัดและวางแผนง่าย',
                infoSatun: 'วางแผนเที่ยวสตูล',
                generalTitle: 'เกี่ยวกับจังหวัด',
                generalDesc: 'สตูลตั้งอยู่ปลายสุดของไทยติดทะเลอันดามัน ใกล้ปีนังและลังกาวี ผสมวัฒนธรรมมาเลย์–ไทย มีหินปูนทะเลและเกาะสวย คนไม่แออัดเท่าพังงาหรือภูเก็ต',
                introTitle: 'ห้ามพลาด',
                att1: 'อุทยานตะรุเตา—ดำน้ำ เดินป่า จองล่วงหน้าในช่วงสูงฤดู',
                att2: 'คฤหาสน์กูเด็น—พิพิธภัณฑ์และเรือนโบราณในเมือง',
                att3: 'ถ้ำภูผาเพชร—ถ้ำใหญ่ของไทย สวมรองเท้ากันพลื่น',
                att4: 'น้ำตกวังสายทอง—ชั้นหินปูนและสระน้ำยอดนิยม',
                cuisineTitle: 'อาหารแนะนำ',
                cuisineDesc: 'อาหารใต้รสจัด มีร้านฮาลาลหลากหลาย ลองหมึก ปู ปลาย่าง โรตีกรอบ และกาแฟเย็น',
                tipsTitle: 'เคล็ดลับสั้นๆ',
                tip1: 'อากาศ: พ.ย.–เม.ย. เหมาะกับเรือและทะเล ร้อนหนักอาจมีคลื่นลมกระทบเรือ',
                tip2: 'เดินทาง: สองแถว แท็กซี่ แกรบ (ถ้ามี) รถเช่า หรือมอเตอร์ไซค์เมื่อมีใบขับขี่และใบ IDP',
                tip3: 'มารยาท: แต่งกายสุภาพในวัดและมัสยิด ถอดรองเท้าตามป้าย โดรนในสวนสาธารณะต้องขออนุญาต',
                official: '<strong><i class="fas fa-globe"></i> ข้อมูลจังหวัด:</strong> <a href="https://www.satun.go.th/frontpage" target="_blank" rel="noopener noreferrer">satun.go.th</a>',
                hotHead: 'สถานที่แนะนำ',
                hotSub: 'ระบุอำเภอเพื่อค้นหาในแผนที่ได้ง่าย',
                videoTitle: 'สตูลจากมุมสูง',
                videoDesc: 'เริ่มต้นปิดเสียง—เปิดในเครื่องเล่นได้ตามต้องการ',
                cafesHead: 'กาแฟ & อาหารฮาลาล',
                cafesSub: 'ร้านยอดนิยมของคนท้องถิ่น—ดูรายการเต็มในหน้ากิน',
                footerMain: '© 2026 Satun Scape · คู่มือท่องเที่ยวโดยไม่เป็นทางการ · ไม่ใช่เว็บราชการ'
            },
            attractions: {
                docTitle: 'สถานที่ท่องเที่ยว · Satun Scape',
                heroEyebrow: 'จังหวัดสตูล · ประเทศไทย',
                heroTitle: 'เลือกประเภทการท่องเที่ยว',
                pageIntro: 'สำรวจสถานที่ท่องเที่ยว',
                culturalBtn: 'วัฒนธรรม & พิพิธภัณฑ์',
                naturalBtn: 'ธรรมชาติ & เกาะ',
                footerMain: '© 2026 Satun Scape · คู่มือท่องเที่ยวโดยไม่เป็นทางการ · ไม่ใช่เว็บราชการ'
            },
            accommodation: {
                docTitle: 'ที่พัก · Satun Scape',
                heroEyebrow: 'โรงแรม & เกสต์เฮาส์',
                heroTitle: 'ค้นหาที่พัก',
                pageIntro: 'ดูตัวเลือกที่พัก',
                footerMain: '© 2026 Satun Scape · คู่มือท่องเที่ยวโดยไม่เป็นทางการ · ไม่ใช่เว็บราชการ'
            },
            cafes: {
                docTitle: 'กิน & ดื่ม · Satun Scape',
                heroEyebrow: 'คาเฟ่ & ร้านอาหาร',
                heroTitle: 'คาเฟ่ & ร้านอาหาร',
                pageIntro: 'สำรวจคาเฟ่และร้านอาหาร',
                footerMain: '© 2026 Satun Scape · คู่มือท่องเที่ยวโดยไม่เป็นทางการ · ไม่ใช่เว็บราชการ'
            },
            market: {
                docTitle: 'ตลาด · Satun Scape',
                heroEyebrow: 'ตลาดท้องถิ่น',
                heroTitle: 'ตลาด',
                pageIntro: 'สำรวจตลาด',
                sectionMarket: 'ข้อมูลตลาด',
                footerMain: '© 2026 Satun Scape · คู่มือท่องเที่ยวโดยไม่เป็นทางการ · ไม่ใช่เว็บราชการ'
            },
            contact: {
                docTitle: 'ติดต่อ · Satun Scape',
                heroEyebrow: 'พร้อมช่วยเหลือ',
                heroTitle: 'ติดต่อเรา',
                contactTitle: 'ยินดีรับฟังจากคุณ',
                contactInfoHeading: 'ข้อมูลติดต่อ',
                footerMain: '© 2026 Satun Scape · คู่มือท่องเที่ยวโดยไม่เป็นทางการ · ไม่ใช่เว็บราชการ'
            },
            booking: {
                docTitle: 'จอง · Satun Scape',
                heroEyebrow: 'วางแผนทริป',
                heroTitle: 'จองทัวร์ & การเดินทาง',
                heroLead: 'จองทัวร์ เช่ารถ เรือข้ามเกาะ หรือที่พัก เรายืนยันทางอีเมลภายใน 1–2 วันทำการ',
                footerMain: '© 2026 Satun Scape · คู่มือท่องเที่ยวโดยไม่เป็นทางการ · ไม่ใช่เว็บราชการ'
            },
            cultural: {
                docTitle: 'สถานที่ท่องเที่ยวทางวัฒนธรรม · Satun Scape',
                heroEyebrow: 'มรดก & พิพิธภัณฑ์',
                heroTitle: 'สถานที่ท่องเที่ยวทางวัฒนธรรม',
                pageIntro: 'สำรวจมรดกและวัฒนธรรม',
                footerMain: '© 2026 Satun Scape · คู่มือท่องเที่ยวโดยไม่เป็นทางการ · ไม่ใช่เว็บราชการ'
            },
            natural: {
                docTitle: 'ธรรมชาติ · Satun Scape',
                heroEyebrow: 'เกาะ · ป่า · ถ้ำ',
                heroTitle: 'ธรรมชาติ & เกาะ',
                pageIntro: 'สำรวจธรรมชาติ',
                footerMain: '© 2026 Satun Scape · คู่มือท่องเที่ยวโดยไม่เป็นทางการ · ไม่ใช่เว็บราชการ'
            }
        }
    },
    zh: {
        skip: '跳到正文',
        nav: {
            home: '首页',
            attractions: '景点',
            stay: '住宿',
            book: '预订',
            eat: '餐饮',
            markets: '市场',
            contact: '联系'
        },
        visitor: [
            '<i class="fas fa-clock" aria-hidden="true"></i> <strong>时间：</strong> 泰国 (ICT · GMT+7)',
            '<i class="fas fa-coins" aria-hidden="true"></i> <strong>货币：</strong> 泰铢 (THB)',
            '<i class="fas fa-plane" aria-hidden="true"></i> <strong>交通：</strong> 合艾机场 · 兰卡威 / 马来西亚',
            '<i class="fas fa-water" aria-hidden="true"></i> <strong>季节：</strong> 11–4 月适合出海与徒步'
        ],
        footer: {
            note: '联系',
            tourism: '泰国旅游局'
        },
        contactForm: {
            name: '姓名',
            email: '邮箱',
            message: '留言',
            send: '发送',
            thanks: '感谢您的留言！',
            error: '发送失败，请稍后再试。'
        },
        bookingForm: {
            thanks: '预订申请已收到！',
            thanksRef: '参考编号：',
            emailSentNote: '已通过邮件发送给旅行社。',
            emailPendingNote: '已保存，但邮件发送失败；我们会尽量跟进。',
            error: '无法连接服务器，已在本地保存您的申请。',
            validation: '请填写所有必填项。',
            notice: '在确认前申请不具约束力。旺季（11–4月）请尽早预订船票与公园许可。',
            tabTour: '旅游',
            tabCar: '租车',
            tabBoat: '船票',
            tabStay: '住宿',
            legendContact: '您的信息',
            recentHeading: '最近的申请',
            titleTour: '预订旅游',
            descTour: '达鲁涛国家公园、溶洞、瀑布及城区文化一日游与多日行程。',
            titleCar: '租车',
            descCar: '自驾或含司机。需有效驾照与护照；外国驾照建议携带国际驾驶许可。',
            titleBoat: '预订船票',
            descBoat: '前往达鲁涛、丽贝岛等渡轮与快艇，班次随季节与海况变化。',
            titleStay: '预订住宿',
            descStay: '沙敦市区、拉廊及巴卡拉码头附近酒店与民宿，详见住宿页照片与地图。',
            labelPackage: '行程套餐',
            labelDate: '希望日期',
            labelAdults: '成人',
            labelChildren: '儿童',
            labelPickup: '接送区域',
            labelName: '姓名',
            labelEmail: '邮箱',
            labelPhone: '电话 / WhatsApp',
            labelNotes: '特殊要求',
            submitTour: '提交旅游预订',
            labelVehicle: '车型',
            labelDriver: '司机',
            labelPickupDate: '取车日期',
            labelPickupTime: '取车时间',
            labelReturnDate: '还车日期',
            labelLocation: '取还车地点',
            submitCar: '提交租车申请',
            labelRoute: '航线',
            labelPassengers: '人数',
            labelReturnTrip: '返程',
            labelReturnDateBoat: '返程日期',
            labelLuggage: '行李 / 备注',
            submitBoat: '提交船票预订',
            labelProperty: '住宿',
            labelRooms: '房间数',
            labelCheckin: '入住',
            labelCheckout: '退房',
            labelGuests: '住客人数',
            labelRoomPrefs: '房型偏好',
            submitStay: '提交住宿预订',
            ctaTitle: '准备预订？',
            ctaDesc: '一站式预订旅游、租车、船票与酒店。',
            ctaBtn: '前往预订',
            pkgHeading: '推荐套餐',
            pkgSub: '热门行程 — 点击套餐查看完整详情，再在下方表单预订。',
            pkgViewBtn: '查看详情',
            pkgModalBook: '预订此套餐',
            pkgModalClose: '关闭',
            modalDuration: '时长',
            modalGroup: '人数',
            modalItinerary: '行程安排',
            modalIncludes: '费用包含',
            modalExcludes: '费用不含',
            modalBring: '建议携带',
            modalNotes: '温馨提示',
            badgeTour: '旅游',
            badgeBoat: '船票',
            badgeCar: '租车',
            badgeStay: '住宿',
            pkg1title: '达鲁涛海岛探索',
            pkg1meta: '1 天 · 巴卡拉码头',
            pkg1desc: '快艇前往达鲁涛、浮潜点、午餐盒餐，负责办理国家公园费用。',
            pkg1price: '约 ฿2,500 起 / 人',
            pkg2title: '丽贝浮潜与海滩一日',
            pkg2meta: '1 天 · 丽贝岛',
            pkg2desc: '长尾船或快艇、珊瑚礁浮潜、海滩休闲，可当日往返或申请过夜。',
            pkg2price: '约 ฿3,200 起 / 人',
            pkg3title: '溶洞与瀑布自然之旅',
            pkg3meta: '1 天 · 马南县',
            pkg3desc: '上午游览普吉帕佩溶洞，下午前往王赛通瀑布，含交通与当地向导。',
            pkg3price: '约 ฿1,800 起 / 人',
            pkg4title: '巴卡拉 ↔ 丽贝往返船票',
            pkg4meta: '往返 · 每程约 2–3 小时',
            pkg4desc: '共享快艇座位，巴卡拉码头至丽贝岛往返，适合停留 2–3 晚。',
            pkg4price: '约 ฿1,200 起 / 人',
            pkg5title: '3 日 SUV 含司机',
            pkg5meta: '3 天 · 沙敦府内',
            pkg5desc: '空调 SUV 与司机，游览瀑布、溶洞、市场及码头接送。',
            pkg5price: '约 ฿4,500 起 / 天',
            pkg6title: '沙敦城区周末住宿',
            pkg6meta: '2 晚 · The One Boutique Hotel',
            pkg6desc: '市中心酒店，可选早餐，步行可达夜市与古宅博物馆。',
            pkg6price: '约 ฿1,400 起 / 晚',
            pkgSelected: '已选套餐 — 请填写下方表单。'
        },
        pages: {
            home: {
                docTitle: '沙敦风光 · 泰国沙敦府',
                heroEyebrow: '泰南 · 安达曼海岸线',
                heroLead: '岛屿、瀑布、溶洞与海鲜——游客较少的安达曼海岸。简体中文提示与实用备忘录助您安心规划。',
                infoSatun: '安排沙敦行程',
                generalTitle: '了解沙敦',
                generalDesc: '沙敦府位于泰国西南安达曼海域，邻近马来西亚的玻璃市与兰卡威。文化氛围多元，喀斯特海岛众多，人流量通常少于普吉岛或甲米。',
                introTitle: '不容错过',
                att1: '群岛游轮、潜水与步道——旺季务必提前订票。',
                att2: '殖民时期的府邸和省立博物馆——市区短途即可到访。',
                att3: '泰国规模最大的溶洞系统之一——请穿防滑鞋。',
                att4: '石灰岩叠瀑与水潭——受欢迎的乡村自然之旅。',
                cuisineTitle: '美食亮点',
                cuisineDesc: '泰南菜系口味浓郁，清真餐馆常见。不妨试试烤鱼、墨鱼、螃蟹、街边印度煎饼与冰镇咖啡。',
                tipsTitle: '出行备忘',
                tip1: '天气：十一月到四月乘船与徒步更舒适；雨季海况可能停运渡轮。',
                tip2: '交通：双条车、的士、可用的网约车、包车或自驾车（机车需合法证照）。',
                tip3: '礼节：佛寺与清真寺着装端庄；入内脱鞋遵从标识；公园内飞行器请查询许可。',
                official: '<strong><i class="fas fa-globe"></i> 省府门户：</strong> <a href="https://www.satun.go.th/frontpage" target="_blank" rel="noopener noreferrer">satun.go.th</a>',
                hotHead: '精选景点',
                hotSub: '行政区划名称便于在手机地图检索。',
                videoTitle: '航拍沙敦',
                videoDesc: '默认静音——可在播放器中开启音量。',
                cafesHead: '咖啡与清真小食',
                cafesSub: '本地口碑之选——详情请见餐饮一页。',
                footerMain: '© 2026 沙敦风光 · 访客参考 · 非政府官网'
            },
            attractions: {
                docTitle: '景点 · Satun Scape',
                heroEyebrow: '沙敦府 · 泰国',
                heroTitle: '选择游览主题',
                pageIntro: '探索景点',
                culturalBtn: '人文景点',
                naturalBtn: '自然与海岛',
                footerMain: '© 2026 沙敦风光 · 访客参考 · 非政府官网'
            },
            accommodation: {
                docTitle: '住宿 · Satun Scape',
                heroEyebrow: '酒店与民宿',
                heroTitle: '寻找住宿',
                pageIntro: '探索住宿选择',
                footerMain: '© 2026 沙敦风光 · 访客参考 · 非政府官网'
            },
            cafes: {
                docTitle: '餐饮 · Satun Scape',
                heroEyebrow: '咖啡馆与餐厅',
                heroTitle: '咖啡馆与餐厅',
                pageIntro: '探索餐饮',
                footerMain: '© 2026 沙敦风光 · 访客参考 · 非政府官网'
            },
            market: {
                docTitle: '市场 · Satun Scape',
                heroEyebrow: '本地市场',
                heroTitle: '市场',
                pageIntro: '探索市场',
                sectionMarket: '市场信息',
                footerMain: '© 2026 沙敦风光 · 访客参考 · 非政府官网'
            },
            contact: {
                docTitle: '联系 · Satun Scape',
                heroEyebrow: '为您服务',
                heroTitle: '联系我们',
                contactTitle: '期待您的来信',
                contactInfoHeading: '联系信息',
                footerMain: '© 2026 沙敦风光 · 访客参考 · 非政府官网'
            },
            booking: {
                docTitle: '预订 · Satun Scape',
                heroEyebrow: '规划行程',
                heroTitle: '预订旅游与交通',
                heroLead: '预订海岛游、租车、船票或酒店。我们将在1–2个工作日内邮件确认。',
                footerMain: '© 2026 沙敦风光 · 访客参考 · 非政府官网'
            },
            cultural: {
                docTitle: '人文景点 · Satun Scape',
                heroEyebrow: '遗产与博物馆',
                heroTitle: '人文景点',
                pageIntro: '探索文化与遗产',
                footerMain: '© 2026 沙敦风光 · 访客参考 · 非政府官网'
            },
            natural: {
                docTitle: '自然景点 · Satun Scape',
                heroEyebrow: '海岛 · 丛林 · 溶洞',
                heroTitle: '自然与海岛',
                pageIntro: '探索自然风光',
                footerMain: '© 2026 沙敦风光 · 访客参考 · 非政府官网'
            }
        }
    }
};

window.I18N = I18N;

function applyCommonStrings(L) {
    setText('skip-link', L.skip);
    if (L.nav) {
        setText('nav-home', L.nav.home);
        setText('nav-attractions', L.nav.attractions);
        setText('nav-accommodation', L.nav.stay);
        if (L.nav.book) setText('nav-booking', L.nav.book);
        setText('nav-cafes', L.nav.eat);
        setText('nav-market', L.nav.markets);
        setText('nav-contact', L.nav.contact);
    }
    if (L.visitor) {
        for (var i = 0; i < L.visitor.length; i++) {
            setHTML('visitor-pill-' + (i + 1), L.visitor[i]);
        }
    }
    if (L.footer) {
        setText('footer-link-contact', L.footer.note);
        setText('footer-link-tourism', L.footer.tourism);
    }
    if (L.contactForm) {
        setText('label-name', L.contactForm.name);
        setText('label-email', L.contactForm.email);
        setText('label-message', L.contactForm.message);
        var btn = $('btn-send-message');
        if (btn) btn.textContent = L.contactForm.send;
    }
}

function applyHomeStrings(H, lang) {
    setText('page-title', H.docTitle);
    setText('hero-eyebrow', H.heroEyebrow);
    setText('hero-lead', H.heroLead);
    setText('info-satun-title', H.infoSatun);
    setText('general-info-title', H.generalTitle);
    setText('general-info-description', H.generalDesc);
    var intro = $('attractions-intro-title') || $('attractions-title');
    if (intro) intro.textContent = H.introTitle;
    setText('attraction-1', H.att1);
    setText('attraction-2', H.att2);
    setText('attraction-3', H.att3);
    setText('attraction-4', H.att4);
    setText('local-cuisine-title', H.cuisineTitle);
    setText('local-cuisine-description', H.cuisineDesc);
    setText('travel-tips-title', H.tipsTitle);
    setText('travel-tip-1', H.tip1);
    setText('travel-tip-2', H.tip2);
    setText('travel-tip-3', H.tip3);
    setHTML('official-website', H.official);
    setText('hot-attractions-heading', H.hotHead);
    setText('hot-attractions-sub', H.hotSub);
    setText('video-section-title', H.videoTitle);
    setText('video-section-desc', H.videoDesc);
    setText('cafes-heading', H.cafesHead);
    setText('cafes-subheading', H.cafesSub);
    setText('footer-text', H.footerMain);
    var BF = I18N[lang] && I18N[lang].bookingForm;
    if (BF) {
        setText('booking-cta-title', BF.ctaTitle);
        setText('booking-cta-desc', BF.ctaDesc);
        setText('booking-cta-btn', BF.ctaBtn);
        setText('booking-cta-tour', BF.tabTour);
        setText('booking-cta-car', BF.tabCar);
        setText('booking-cta-boat', BF.tabBoat);
        setText('booking-cta-stay', BF.tabStay);
    }
    if ($('hero-title')) {
        setHTML('hero-title', '<span id="satun-scape-brand">SATUN SCAPE</span>');
        var brandLabel = { en: 'SATUN SCAPE', th: 'SATUN SCAPE', zh: '沙敦风光' };
        setText('satun-scape-brand', brandLabel[lang] || brandLabel.en);
    }
}

function applyPageStrings(pageKey, P, lang) {
    if (!P) return;
    if (P.docTitle) setText('page-title', P.docTitle);
    if (P.heroEyebrow) setText('hero-eyebrow', P.heroEyebrow);
    if (P.heroTitle && $('hero-title') && pageKey !== 'home') {
        setText('hero-title', P.heroTitle);
    }
    if (P.pageIntro) {
        setText('page-intro-heading', P.pageIntro);
    }
    if (P.culturalBtn) setText('cultural-attractions', P.culturalBtn);
    if (P.naturalBtn) setText('natural-attractions', P.naturalBtn);
    if (P.contactTitle) setText('contact-title', P.contactTitle);
    if (P.contactInfoHeading) setText('contact-info-heading', P.contactInfoHeading);
    if (P.sectionMarket) setText('market-section-title', P.sectionMarket);
    if (P.footerMain) setText('footer-text', P.footerMain);
}

function applyBookingStrings(B, P) {
    if (!B) return;
    if (P) {
        if (P.docTitle) setText('page-title', P.docTitle);
        if (P.heroEyebrow) setText('hero-eyebrow', P.heroEyebrow);
        if (P.heroTitle) setText('hero-title', P.heroTitle);
        if (P.heroLead) setText('hero-lead', P.heroLead);
        if (P.footerMain) setText('footer-text', P.footerMain);
    }
    setHTML('booking-notice', '<i class="fas fa-info-circle" aria-hidden="true"></i> ' + B.notice);
    setText('tab-label-tour', B.tabTour);
    setText('tab-label-car', B.tabCar);
    setText('tab-label-boat', B.tabBoat);
    setText('tab-label-stay', B.tabStay);
    setText('form-title-tour', B.titleTour);
    setText('form-desc-tour', B.descTour);
    setText('form-title-car', B.titleCar);
    setText('form-desc-car', B.descCar);
    setText('form-title-boat', B.titleBoat);
    setText('form-desc-boat', B.descBoat);
    setText('form-title-stay', B.titleStay);
    var stayDesc = B.descStay;
    if (stayDesc.indexOf('Stay page') !== -1) {
        stayDesc = stayDesc.replace('Stay page', '<a href="accommodation.html">Stay page</a>');
    } else if (stayDesc.indexOf('หน้าที่พัก') !== -1) {
        stayDesc = stayDesc.replace('หน้าที่พัก', '<a href="accommodation.html">หน้าที่พัก</a>');
    } else if (stayDesc.indexOf('住宿页') !== -1) {
        stayDesc = stayDesc.replace('住宿页', '<a href="accommodation.html">住宿页</a>');
    }
    setHTML('form-desc-stay', stayDesc);
    var legends = ['legend-contact-tour', 'legend-contact-car', 'legend-contact-boat', 'legend-contact-stay'];
    legends.forEach(function(id) { setText(id, B.legendContact); });
    setText('recent-heading', B.recentHeading);
    setText('label-tour-package', B.labelPackage);
    setText('label-tour-date', B.labelDate);
    setText('label-tour-adults', B.labelAdults);
    setText('label-tour-children', B.labelChildren);
    setText('label-tour-pickup', B.labelPickup);
    setText('label-tour-name', B.labelName);
    setText('label-tour-email', B.labelEmail);
    setText('label-tour-phone', B.labelPhone);
    setText('label-tour-notes', B.labelNotes);
    setText('btn-submit-tour', B.submitTour);
    setText('label-car-type', B.labelVehicle);
    setText('label-car-driver', B.labelDriver);
    setText('label-car-pickup-date', B.labelPickupDate);
    setText('label-car-pickup-time', B.labelPickupTime);
    setText('label-car-return-date', B.labelReturnDate);
    setText('label-car-location', B.labelLocation);
    setText('label-car-name', B.labelName);
    setText('label-car-email', B.labelEmail);
    setText('label-car-phone', B.labelPhone);
    setText('label-car-notes', B.labelNotes);
    setText('btn-submit-car', B.submitCar);
    setText('label-boat-route', B.labelRoute);
    setText('label-boat-date', B.labelDate);
    setText('label-boat-passengers', B.labelPassengers);
    setText('label-boat-return', B.labelReturnTrip);
    setText('label-boat-return-date', B.labelReturnDateBoat);
    setText('label-boat-name', B.labelName);
    setText('label-boat-email', B.labelEmail);
    setText('label-boat-phone', B.labelPhone);
    setText('label-boat-notes', B.labelLuggage);
    setText('btn-submit-boat', B.submitBoat);
    setText('label-stay-property', B.labelProperty);
    setText('label-stay-rooms', B.labelRooms);
    setText('label-stay-checkin', B.labelCheckin);
    setText('label-stay-checkout', B.labelCheckout);
    setText('label-stay-guests', B.labelGuests);
    setText('label-stay-name', B.labelName);
    setText('label-stay-email', B.labelEmail);
    setText('label-stay-phone', B.labelPhone);
    setText('label-stay-notes', B.labelRoomPrefs);
    setText('btn-submit-stay', B.submitStay);
    setText('pkg-heading', B.pkgHeading);
    setText('pkg-sub', B.pkgSub);
    var pi;
    for (pi = 1; pi <= 6; pi++) {
        setText('pkg-' + pi + '-title', B['pkg' + pi + 'title']);
        setText('pkg-' + pi + '-meta', B['pkg' + pi + 'meta']);
        setText('pkg-' + pi + '-desc', B['pkg' + pi + 'desc']);
        setText('pkg-' + pi + '-price', B['pkg' + pi + 'price']);
        setText('pkg-' + pi + '-btn', B.pkgViewBtn);
    }
    setText('pkg-modal-book', B.pkgModalBook);
    var modalCloseBtn = $('pkg-modal-close');
    if (modalCloseBtn) modalCloseBtn.setAttribute('aria-label', B.pkgModalClose);
    setText('pkg-modal-h-duration', B.modalDuration);
    setText('pkg-modal-h-group', B.modalGroup);
    setText('pkg-modal-h-itinerary', B.modalItinerary);
    setText('pkg-modal-h-includes', B.modalIncludes);
    setText('pkg-modal-h-excludes', B.modalExcludes);
    setText('pkg-modal-h-bring', B.modalBring);
    setText('pkg-modal-h-notes', B.modalNotes);
    if (typeof window.refreshPackageModal === 'function') window.refreshPackageModal();
    setText('pkg-1-badge', B.badgeTour);
    setText('pkg-2-badge', B.badgeTour);
    setText('pkg-3-badge', B.badgeTour);
    setText('pkg-4-badge', B.badgeBoat);
    setText('pkg-5-badge', B.badgeCar);
    setText('pkg-6-badge', B.badgeStay);
}

function setLanguage(lang) {
    if (!I18N[lang]) lang = 'en';
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : (lang === 'th' ? 'th' : 'en');

    var L = I18N[lang];
    var pageKey = getPageKey();
    var P = L.pages[pageKey];

    applyCommonStrings(L);

    if (pageKey === 'home' && L.pages.home) {
        applyHomeStrings(L.pages.home, lang);
    } else if (pageKey === 'booking') {
        applyBookingStrings(L.bookingForm, P);
    } else {
        applyPageStrings(pageKey, P, lang);
    }

    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));

    document.querySelectorAll('.lang-btn').forEach(function(btn) {
        var active = btn.getAttribute('data-lang') === lang;
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        btn.classList.toggle('lang-btn-active', active);
    });

    setActiveNav();
}

function setActiveNav() {
    var map = {
        'page-home': 'nav-home',
        'page-attractions': 'nav-attractions',
        'page-accommodation': 'nav-accommodation',
        'page-cafes': 'nav-cafes',
        'page-market': 'nav-market',
        'page-booking': 'nav-booking',
        'page-contact': 'nav-contact',
        'page-cultural': 'nav-attractions',
        'page-natural': 'nav-attractions'
    };
    document.querySelectorAll('.nav-link.active').forEach(function(a) {
        a.classList.remove('active');
    });
    var bodyClass = document.body.className;
    for (var k in map) {
        if (Object.prototype.hasOwnProperty.call(map, k) && bodyClass.indexOf(k) !== -1) {
            var link = $(map[k]);
            if (link) link.classList.add('active');
            return;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var language = localStorage.getItem('language') || 'en';
    setLanguage(language);

    document.querySelectorAll('.lang-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            setLanguage(btn.getAttribute('data-lang'));
        });
    });

    initSlideshowGroups();

    var menuToggle = $('menu-toggle');
    var navMenu = document.querySelector('.nav-menu');
    if (menuToggle && navMenu) {
        var navBackdrop = document.createElement('button');
        navBackdrop.className = 'nav-backdrop';
        navBackdrop.type = 'button';
        navBackdrop.setAttribute('aria-label', 'Close menu');
        navBackdrop.hidden = true;
        document.body.appendChild(navBackdrop);

        function isMobileNav() {
            return window.matchMedia('(max-width: 900px)').matches;
        }

        function setNavOpen(open) {
            navMenu.classList.toggle('nav-menu-open', open);
            document.body.classList.toggle('nav-open', open);
            menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            navBackdrop.hidden = !open;
        }

        function closeMobileNav() {
            if (navMenu.classList.contains('nav-menu-open')) {
                setNavOpen(false);
            }
        }

        menuToggle.addEventListener('click', function() {
            setNavOpen(!navMenu.classList.contains('nav-menu-open'));
        });

        navBackdrop.addEventListener('click', closeMobileNav);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeMobileNav();
        });

        window.addEventListener('resize', function() {
            if (!isMobileNav()) closeMobileNav();
        });

        document.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                if (isMobileNav()) closeMobileNav();
            });
        });
    }

    attachContactForms();
});

function initSlideshowGroups() {
    for (var i = 0; i < slideId.length; i++) {
        var slides = document.getElementsByClassName(slideId[i]);
        if (slides.length) showSlides(slideIndex[i], i);
    }
}

var slideIndex = [1, 1, 1, 1];
var slideId = ['general-info', 'attractions-info', 'local-cuisine-info', 'travel-tips-info'];

function plusSlides(n, no) {
    showSlides((slideIndex[no] += n), no);
}

function showSlides(n, no) {
    var slides = document.getElementsByClassName(slideId[no]);
    if (!slides.length) return;
    if (n > slides.length) slideIndex[no] = 1;
    if (n < 1) slideIndex[no] = slides.length;
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    slides[slideIndex[no] - 1].style.display = 'block';
}

function attachContactForms() {
    var formStandard = $('contact-form');
    if (!formStandard) return;

    var lang = localStorage.getItem('language') || 'en';
    var CF = (I18N[lang] && I18N[lang].contactForm) || I18N.en.contactForm;

    formStandard.addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(formStandard);
        fetch('contact.php', { method: 'POST', body: formData })
            .then(function(res) {
                return res.json().then(function(data) {
                    if (!res.ok || !data.success) {
                        throw new Error((data && data.error) || 'Send failed');
                    }
                    return data;
                });
            })
            .then(function() {
                alert(CF.thanks);
                formStandard.reset();
            })
            .catch(function(err) {
                console.error(err);
                alert(CF.error);
            });
    });
}

function openPopup() {
    var p = $('popup');
    if (p) p.classList.add('active');
}

function closePopup() {
    var p = $('popup');
    if (p) p.classList.remove('active');
}
