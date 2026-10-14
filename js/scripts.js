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
            sentTo: 'Sent directly to',
            continueNote: 'They will contact you directly to confirm availability, pricing, and payment. Feel free to reach out to them yourself too — Satun Scape does not process payments or confirmations.',
            screenshotNote: 'Save a screenshot of this confirmation for your records.',
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
            labelNationality: 'Nationality',
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
            pkg7title: 'Koh Bulone Snorkel Day Trip',
            pkg7meta: '1 day · Pakbara pier · Taweesub Speedboat',
            pkg7desc: 'Two snorkel stops at Koh Bulone Mai Phai and Hin Khaw, free kayak & SUP, lunch and fruit included.',
            pkg7price: '฿1,760 (Thai) · ฿1,860 (foreigner)',
            pkg8title: 'Koh Bulone Island 2D1N',
            pkg8meta: '2 days 1 night · Seasatun Travel',
            pkg8desc: 'Overnight on Koh Bulone with snorkeling at Mai Phai and Bulone Le, kayaking, and a beach dinner.',
            pkg8price: 'Contact for current rate',
            pkg9title: 'Koh Bulone Island 3D2N',
            pkg9meta: '3 days 2 nights · Seasatun Travel',
            pkg9desc: "A slower island stay with a full free day for kayaking or the island's nature trails.",
            pkg9price: 'Contact for current rate',
            pkg10title: 'Ko Lipe Island Hop 2D1N',
            pkg10meta: '2 days 1 night · Seasatun Travel',
            pkg10desc: 'Same-day longtail snorkeling around Ko Rawi, Ko Hin Ngam, Jabang channel and Ko Adang.',
            pkg10price: 'Contact for current rate',
            pkg11title: 'Ko Lipe Island Hop 3D2N',
            pkg11meta: '3 days 2 nights · Seasatun Travel',
            pkg11desc: 'A full snorkeling day around Ko Adang, Ko Rawi, Ko Hin Ngam, Ko Yang and Jabang channel, with flexible return times.',
            pkg11price: 'Contact for current rate',
            pkg12title: 'Ko Lipe Island Hop 4D3N',
            pkg12meta: '4 days 3 nights · Seasatun Travel',
            pkg12desc: 'Longer Lipe stay with an outer-island snorkel day plus a free day to climb Pha Chado viewpoint on Ko Adang.',
            pkg12price: 'Contact for current rate',
            pkg13title: 'La-ngu Nature & Culture Day Tour',
            pkg13meta: '1 day · Classic songthaew · Seasatun Travel',
            pkg13desc: 'Khao Daeng viewpoint, Urai Thong Cave, a nature trail, local lunch, and the Fisheries Department aquarium.',
            pkg13price: 'Contact for current rate',
            pkg14title: 'Ko Lipe Mountain Resort',
            pkg14meta: '2 nights · Deluxe Garden room',
            pkg14desc: 'Pool resort on Ko Lipe with van, speedboat transfer, breakfast and a snorkeling trip included.',
            pkg14price: 'From ฿3,450 / 2D1N (weekday rate)',
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
            sentTo: 'ส่งตรงถึง',
            continueNote: 'ทางบริษัทจะติดต่อคุณโดยตรงเพื่อยืนยันคิว ราคา และการชำระเงิน คุณสามารถติดต่อไปหาเขาเองก่อนได้เลย — Satun Scape ไม่ได้เป็นผู้รับชำระเงินหรือยืนยันการจอง',
            screenshotNote: 'บันทึกภาพหน้าจอนี้ไว้เป็นหลักฐานได้เลย',
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
            labelNationality: 'สัญชาติ',
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
            pkg7title: 'ทริปเดย์ทริปดำน้ำเกาะบุโหลน',
            pkg7meta: '1 วัน · ท่าเรือปากบารา · Taweesub Speedboat',
            pkg7desc: 'ดำน้ำ 2 จุด ที่เกาะบุโหลนไม้ไผ่และหินขาว ฟรีคายัคและซัพบอร์ด พร้อมอาหารกลางวันและผลไม้',
            pkg7price: '฿1,760 (คนไทย) · ฿1,860 (ต่างชาติ)',
            pkg8title: 'เกาะบุโหลน 2 วัน 1 คืน',
            pkg8meta: '2 วัน 1 คืน · Seasatun Travel',
            pkg8desc: 'พักค้างคืนที่เกาะบุโหลน ดำน้ำที่ไม้ไผ่และบุโหลนเล พายเรือคายัค และอาหารเย็นริมหาด',
            pkg8price: 'ติดต่อสอบถามราคาปัจจุบัน',
            pkg9title: 'เกาะบุโหลน 3 วัน 2 คืน',
            pkg9meta: '3 วัน 2 คืน · Seasatun Travel',
            pkg9desc: 'พักผ่อนบนเกาะแบบสบายๆ มีวันอิสระเต็มวันให้พายคายัคหรือเดินศึกษาเส้นทางธรรมชาติบนเกาะ',
            pkg9price: 'ติดต่อสอบถามราคาปัจจุบัน',
            pkg10title: 'เที่ยวเกาะหลีเป๊ะ 2 วัน 1 คืน',
            pkg10meta: '2 วัน 1 คืน · Seasatun Travel',
            pkg10desc: 'ดำน้ำวันเดียวด้วยเรือหางยาว รอบเกาะราวี เกาะหินงาม ร่องน้ำจาบัง และเกาะอาดัง',
            pkg10price: 'ติดต่อสอบถามราคาปัจจุบัน',
            pkg11title: 'เที่ยวเกาะหลีเป๊ะ 3 วัน 2 คืน',
            pkg11meta: '3 วัน 2 คืน · Seasatun Travel',
            pkg11desc: 'ดำน้ำเต็มวันรอบเกาะอาดัง เกาะราวี เกาะหินงาม เกาะยาง และร่องน้ำจาบัง เลือกเวลากลับได้หลายรอบ',
            pkg11price: 'ติดต่อสอบถามราคาปัจจุบัน',
            pkg12title: 'เที่ยวเกาะหลีเป๊ะ 4 วัน 3 คืน',
            pkg12meta: '4 วัน 3 คืน · Seasatun Travel',
            pkg12desc: 'พักหลีเป๊ะยาวขึ้น มีวันดำน้ำรอบเกาะนอก บวกวันอิสระปีนผาชะโดชมวิวเกาะอาดัง',
            pkg12price: 'ติดต่อสอบถามราคาปัจจุบัน',
            pkg13title: 'เที่ยวละงู วิถีธรรมชาติและวัฒนธรรม 1 วัน',
            pkg13meta: '1 วัน · รถสองแถวคลาสสิค · Seasatun Travel',
            pkg13desc: 'จุดชมวิวเขาแดง ถ้ำอุไรทอง เส้นทางศึกษาธรรมชาติ อาหารพื้นบ้าน และศูนย์เพาะพันธุ์สัตว์น้ำกรมประมง',
            pkg13price: 'ติดต่อสอบถามราคาปัจจุบัน',
            pkg14title: 'เกาะหลีเป๊ะ เมาน์เทน รีสอร์ท',
            pkg14meta: '2 คืน · ห้อง Deluxe Garden',
            pkg14desc: 'รีสอร์ทมีสระว่ายน้ำบนเกาะหลีเป๊ะ รวมรถตู้ เรือสปีดโบ๊ท อาหารเช้า และทริปดำน้ำ',
            pkg14price: 'เริ่ม ฿3,450 / 2 วัน 1 คืน (วันธรรมดา)',
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
            sentTo: '已直接发送给',
            continueNote: '对方将直接与您联系，确认名额、价格与付款方式。您也可以主动联系他们——Satun Scape 不处理付款或预订确认。',
            screenshotNote: '建议保存此确认页面的截图作为记录。',
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
            labelNationality: '国籍',
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
            pkg7title: '布隆岛浮潜一日游',
            pkg7meta: '1 天 · Pakbara码头 · Taweesub Speedboat',
            pkg7desc: '两个浮潜点：布隆迈派与欣考，免费皮划艇与桨板，含午餐与水果。',
            pkg7price: '฿1,760（泰国人）· ฿1,860（外国人）',
            pkg8title: '布隆岛 2天1晚',
            pkg8meta: '2天1晚 · Seasatun Travel',
            pkg8desc: '在布隆岛过夜，于迈派与布隆勒浮潜，划皮划艇，享用海滩晚餐。',
            pkg8price: '请咨询当前价格',
            pkg9title: '布隆岛 3天2晚',
            pkg9meta: '3天2晚 · Seasatun Travel',
            pkg9desc: '更悠闲的岛屿假期，留出一整天自由活动，可划皮划艇或探索岛上自然步道。',
            pkg9price: '请咨询当前价格',
            pkg10title: '丽贝岛跳岛游 2天1晚',
            pkg10meta: '2天1晚 · Seasatun Travel',
            pkg10desc: '当天乘长尾船浮潜，游览拉威岛、欣岸岛、贾邦水道与阿当岛。',
            pkg10price: '请咨询当前价格',
            pkg11title: '丽贝岛跳岛游 3天2晚',
            pkg11meta: '3天2晚 · Seasatun Travel',
            pkg11desc: '安排一整天浮潜，游览阿当岛、拉威岛、欣岸岛、洋岛与贾邦水道，返程时间可灵活选择。',
            pkg11price: '请咨询当前价格',
            pkg12title: '丽贝岛跳岛游 4天3晚',
            pkg12meta: '4天3晚 · Seasatun Travel',
            pkg12desc: '更长的丽贝岛假期，包含外岛浮潜日，另有一天自由攀登阿当岛帕查多观景台。',
            pkg12price: '请咨询当前价格',
            pkg13title: '拉古自然文化一日游',
            pkg13meta: '1 天 · 经典双条车 · Seasatun Travel',
            pkg13desc: '考登观景台、乌莱通洞穴、自然步道、当地风味午餐，以及渔业厅水族中心。',
            pkg13price: '请咨询当前价格',
            pkg14title: '丽贝岛山景度假村',
            pkg14meta: '2 晚 · Deluxe Garden 房型',
            pkg14desc: '丽贝岛上带泳池的度假村，含接送面包车、快艇接驳、早餐与浮潜行程。',
            pkg14price: '约 ฿3,450 起 / 2天1晚（平日价）',
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
    },
    tl: {
        skip: 'Lumaktaw sa nilalaman',
        nav: {
            home: 'Home',
            attractions: 'Mga Atraksyon',
            stay: 'Tuluyan',
            book: 'Mag-book',
            eat: 'Kainan',
            markets: 'Mga Palengke',
            contact: 'Makipag-ugnayan'
        },
        visitor: [
            '<i class="fas fa-clock" aria-hidden="true"></i> <strong>Oras:</strong> Thailand (ICT · GMT+7)',
            '<i class="fas fa-coins" aria-hidden="true"></i> <strong>Pera:</strong> Thai baht (THB)',
            '<i class="fas fa-plane" aria-hidden="true"></i> <strong>Malapit:</strong> Hat Yai airport · Langkawi / Malaysia',
            '<i class="fas fa-water" aria-hidden="true"></i> <strong>Panahon:</strong> Nob–Abr ang pinakamainam para sa dagat at trekking'
        ],
        footer: {
            note: 'Makipag-ugnayan',
            tourism: 'Tourism Thailand'
        },
        contactForm: {
            name: 'Pangalan',
            email: 'Email',
            message: 'Mensahe',
            send: 'Ipadala ang mensahe',
            thanks: 'Salamat sa iyong mensahe!',
            error: 'May naganap na error sa pagpapadala ng iyong mensahe.'
        },
        bookingForm: {
            thanks: 'Natanggap na ang iyong booking request!',
            thanksRef: 'Reference:',
            emailSentNote: 'Naipadala na sa aming tour team sa pamamagitan ng email.',
            emailPendingNote: 'Na-save — hindi naipadala ang email; susundan namin kung posible.',
            sentTo: 'Direktang ipinadala kay',
            continueNote: 'Direkta kang kokontakin nila para kumpirmahin ang availability, presyo, at bayad. Malaya ka ring makipag-ugnayan sa kanila mismo — hindi humahawak ang Satun Scape ng bayad o kumpirmasyon.',
            screenshotNote: 'I-save ang screenshot ng kumpirmasyong ito bilang rekord mo.',
            error: 'Hindi ma-reach ang server. Na-save na lokal ang iyong request.',
            validation: 'Pakikumpleto ang lahat ng kinakailangang field.',
            notice: 'Hindi pa final ang mga request hangga\'t hindi nakukumpirma. Peak season (Nob–Abr): mag-book nang maaga para sa bangka at park permit.',
            tabTour: 'Mga Tour',
            tabCar: 'Renta ng Sasakyan',
            tabBoat: 'Bangka',
            tabStay: 'Tuluyan',
            legendContact: 'Detalye mo',
            recentHeading: 'Mga huling request mo',
            titleTour: 'Mag-book ng tour',
            descTour: 'Day trips at multi-day packages sa Tarutao, mga kuweba, talon, at heritage walk sa bayan.',
            titleCar: 'Mag-renta ng sasakyan',
            descCar: 'Self-drive o may driver. Kailangan ng valid na lisensya at pasaporte; irekomenda ang international permit para sa dayuhang lisensya.',
            titleBoat: 'Mag-book ng bangka',
            descBoat: 'Mga ruta ng ferry at speedboat papuntang Tarutao, Ko Lipe, at island hop. Nagbabago ang schedule depende sa panahon at kondisyon ng dagat.',
            titleStay: 'Mag-book ng tuluyan',
            descStay: 'Mga hotel at guesthouse sa bayan ng Satun, La-ngu, at malapit sa Pakbara. Tingnan ang aming Stay page para sa mga litrato at mapa.',
            labelPackage: 'Tour package',
            labelDate: 'Gustong petsa',
            labelAdults: 'Matatanda',
            labelChildren: 'Bata',
            labelPickup: 'Lugar ng pickup',
            labelName: 'Buong pangalan',
            labelEmail: 'Email',
            labelPhone: 'Phone / WhatsApp',
            labelNationality: 'Nasyonalidad',
            labelNotes: 'Espesyal na kahilingan',
            submitTour: 'Humiling ng tour booking',
            labelVehicle: 'Sasakyan',
            labelDriver: 'Driver',
            labelPickupDate: 'Petsa ng pickup',
            labelPickupTime: 'Oras ng pickup',
            labelReturnDate: 'Petsa ng balik',
            labelLocation: 'Pickup / drop-off',
            submitCar: 'Humiling ng car rental',
            labelRoute: 'Ruta',
            labelPassengers: 'Bilang ng pasahero',
            labelReturnTrip: 'Balik na biyahe',
            labelReturnDateBoat: 'Petsa ng balik',
            labelLuggage: 'Bagahe / mga tala',
            submitBoat: 'Humiling ng boat booking',
            labelProperty: 'Property',
            labelRooms: 'Mga kwarto',
            labelCheckin: 'Check-in',
            labelCheckout: 'Check-out',
            labelGuests: 'Bilang ng bisita',
            labelRoomPrefs: 'Kagustuhan sa kwarto',
            submitStay: 'Humiling ng stay booking',
            ctaTitle: 'Handa nang mag-book?',
            ctaDesc: 'I-reserve ang tour, sasakyan, bangka, at hotel sa iisang lugar.',
            ctaBtn: 'Buksan ang booking',
            pkgHeading: 'Mga inirerekomendang package',
            pkgSub: 'Mga popular na itinerary — pindutin ang isang package para makita ang buong detalye, pagkatapos mag-book sa ibaba.',
            pkgViewBtn: 'Tingnan ang detalye',
            pkgModalBook: 'I-book ang package na ito',
            pkgModalClose: 'Isara',
            modalDuration: 'Tagal',
            modalGroup: 'Laki ng grupo',
            modalItinerary: 'Itinerary',
            modalIncludes: 'Kasama',
            modalExcludes: 'Hindi kasama',
            modalBring: 'Dapat dalhin',
            modalNotes: 'Mabuting malaman',
            badgeTour: 'Tour',
            badgeBoat: 'Bangka',
            badgeCar: 'Sasakyan',
            badgeStay: 'Tuluyan',
            pkg7title: 'Koh Bulone Snorkel Day Trip',
            pkg7meta: '1 araw · Pakbara pier · Taweesub Speedboat',
            pkg7desc: 'Dalawang snorkel stop sa Koh Bulone Mai Phai at Hin Khaw, libreng kayak at SUP, kasama ang lunch at prutas.',
            pkg7price: '฿1,760 (Thai) · ฿1,860 (dayuhan)',
            pkg8title: 'Koh Bulone Island 2D1N',
            pkg8meta: '2 araw 1 gabi · Seasatun Travel',
            pkg8desc: 'Magdamag sa Koh Bulone na may snorkeling sa Mai Phai at Bulone Le, kayaking, at hapunan sa beach.',
            pkg8price: 'Makipag-ugnayan para sa kasalukuyang presyo',
            pkg9title: 'Koh Bulone Island 3D2N',
            pkg9meta: '3 araw 2 gabi · Seasatun Travel',
            pkg9desc: 'Mas mahinahong island stay na may buong libreng araw para sa kayaking o nature trail ng isla.',
            pkg9price: 'Makipag-ugnayan para sa kasalukuyang presyo',
            pkg10title: 'Ko Lipe Island Hop 2D1N',
            pkg10meta: '2 araw 1 gabi · Seasatun Travel',
            pkg10desc: 'Same-day longtail snorkeling sa paligid ng Ko Rawi, Ko Hin Ngam, Jabang channel at Ko Adang.',
            pkg10price: 'Makipag-ugnayan para sa kasalukuyang presyo',
            pkg11title: 'Ko Lipe Island Hop 3D2N',
            pkg11meta: '3 araw 2 gabi · Seasatun Travel',
            pkg11desc: 'Buong araw ng snorkeling sa paligid ng Ko Adang, Ko Rawi, Ko Hin Ngam, Ko Yang at Jabang channel, may flexible na oras ng pagbalik.',
            pkg11price: 'Makipag-ugnayan para sa kasalukuyang presyo',
            pkg12title: 'Ko Lipe Island Hop 4D3N',
            pkg12meta: '4 araw 3 gabi · Seasatun Travel',
            pkg12desc: 'Mas mahabang Lipe stay na may outer-island snorkel day at libreng araw para umakyat sa Pha Chado viewpoint sa Ko Adang.',
            pkg12price: 'Makipag-ugnayan para sa kasalukuyang presyo',
            pkg13title: 'La-ngu Nature & Culture Day Tour',
            pkg13meta: '1 araw · Classic songthaew · Seasatun Travel',
            pkg13desc: 'Khao Daeng viewpoint, Urai Thong Cave, nature trail, local lunch, at ang Fisheries Department aquarium.',
            pkg13price: 'Makipag-ugnayan para sa kasalukuyang presyo',
            pkg14title: 'Ko Lipe Mountain Resort',
            pkg14meta: '2 gabi · Deluxe Garden room',
            pkg14desc: 'Resort na may pool sa Ko Lipe, kasama ang van, speedboat transfer, breakfast at snorkeling trip.',
            pkg14price: 'Mula ฿3,450 / 2D1N (presyo sa karaniwang araw)',
            pkgSelected: 'Napili ang package — kumpletuhin ang form sa ibaba.'
        },
        pages: {
            home: {
                docTitle: 'Satun Scape · Bisitahin ang Satun Province, Thailand',
                heroEyebrow: 'Timog Thailand · Baybayin ng Andaman Sea',
                heroLead: 'Mga isla, talon sa gubat, kuweba, sariwang seafood—at ang mas tahimik na bahagi ng Thailand. Para sa mga manlalakbay na gusto ng simpleng Ingles at praktikal na tips sa biyahe.',
                infoSatun: 'Planuhin ang bisita mo sa Satun',
                generalTitle: 'Tungkol sa probinsya',
                generalDesc: 'Ang Satun ay ang southwestern na probinsya ng Thailand sa tabi ng Andaman Sea, katabi ng Malaysian Perlis at Langkawi. Asahan ang kulturang Malay–Thai, mga limestone island—at mas kaunting tao kumpara sa Phuket o Krabi.',
                introTitle: 'Huwag palampasin',
                att1: 'Mga cruise sa kapuluan, snorkeling, nature trail sa gubat—mag-book nang maaga sa peak season.',
                att2: 'Colonial-era mansion at provincial museum—madaling puntahan sa bayan.',
                att3: 'Isa sa pinakamalaking cave system sa Thailand—magdala ng sapatos na hindi madulas.',
                att4: 'Limestone terraces at pools—klasikong nature outing sa loob ng lupa.',
                cuisineTitle: 'Paborito ng mga manlalakbay',
                cuisineDesc: 'Malakas ang lasa ng Southern Thai food; laganap ang mga halal kitchen. Subukan ang inihaw na isda, pusit, alimango, roti sa gilid ng kalsada, at iced coffee.',
                tipsTitle: 'Mabilisang tips',
                tip1: 'Panahon: Nobyembre–Abril ang pinakatuyo para sa bangka; puwedeng maapektuhan ang ferry sa Hulyo–Oktubre.',
                tip2: 'Pagbibiyahe: songthaew, taxi, Grab (kung available), rentang sasakyan—o scooter kung may valid na lisensya at IDP kung kinakailangan.',
                tip3: 'Paggalang: takpan ang balikat at tuhod sa mga sagradong lugar; alisin ang sapatos kung may senyales; kailangan ng permit ang drone sa maraming park.',
                official: '<strong><i class="fas fa-globe"></i> Impormasyon ng probinsya:</strong> <a href="https://www.satun.go.th/frontpage" target="_blank" rel="noopener noreferrer">satun.go.th</a>',
                hotHead: 'Mga tampok na lugar',
                hotSub: 'Tumutulong ang pangalan ng distrito para mahanap ang lugar sa mapa.',
                videoTitle: 'Satun mula sa itaas',
                videoDesc: 'Naka-mute bilang default—puwede mong buksan ang tunog sa player.',
                cafesHead: 'Kape at halal-friendly na pagkain',
                cafesSub: 'Mga paborito ng lokal—makikita ang buong listahan sa eats page.',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            attractions: {
                docTitle: 'Mga Atraksyon · Satun Scape',
                heroEyebrow: 'Satun Province · Thailand',
                heroTitle: 'Piliin ang kategorya ng atraksyon',
                pageIntro: 'Galugarin ang mga atraksyon',
                culturalBtn: 'Mga kultural na atraksyon',
                naturalBtn: 'Mga natural na atraksyon',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            accommodation: {
                docTitle: 'Tuluyan · Satun Scape',
                heroEyebrow: 'Mga hotel at guesthouse',
                heroTitle: 'Hanapin ang tuluyan mo',
                pageIntro: 'Galugarin ang mga tuluyan',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            cafes: {
                docTitle: 'Kainan · Satun Scape',
                heroEyebrow: 'Mga café at restawran',
                heroTitle: 'Mga café at restawran',
                pageIntro: 'Galugarin ang mga café at restawran',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            market: {
                docTitle: 'Mga Palengke · Satun Scape',
                heroEyebrow: 'Lokal na mga palengke',
                heroTitle: 'Mga Palengke',
                pageIntro: 'Galugarin ang mga palengke',
                sectionMarket: 'Impormasyon ng palengke',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            contact: {
                docTitle: 'Makipag-ugnayan · Satun Scape',
                heroEyebrow: 'Nandito kami para tumulong',
                heroTitle: 'Makipag-ugnayan sa amin',
                contactTitle: 'Gusto naming marinig mula sa iyo',
                contactInfoHeading: 'Impormasyon sa pakikipag-ugnayan',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            booking: {
                docTitle: 'Mag-book · Satun Scape',
                heroEyebrow: 'Planuhin ang biyahe mo',
                heroTitle: 'Mag-book ng tour at biyahe',
                heroLead: 'I-reserve ang island tour, mag-renta ng sasakyan, mag-book ng boat transfer, o humiling ng hotel stay. Kinukumpirma namin sa pamamagitan ng email sa loob ng 1–2 business days.',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            cultural: {
                docTitle: 'Mga kultural na atraksyon · Satun Scape',
                heroEyebrow: 'Pamana at museo',
                heroTitle: 'Mga kultural na atraksyon',
                pageIntro: 'Galugarin ang mga kultural na atraksyon',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            natural: {
                docTitle: 'Mga natural na atraksyon · Satun Scape',
                heroEyebrow: 'Isla · gubat · kuweba',
                heroTitle: 'Mga natural na atraksyon',
                pageIntro: 'Galugarin ang mga natural na atraksyon',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            }
        }
    },
    ms: {
        skip: 'Langkau ke kandungan',
        nav: {
            home: 'Laman Utama',
            attractions: 'Tarikan',
            stay: 'Penginapan',
            book: 'Tempah',
            eat: 'Makan & Minum',
            markets: 'Pasar',
            contact: 'Hubungi'
        },
        visitor: [
            '<i class="fas fa-clock" aria-hidden="true"></i> <strong>Waktu:</strong> Thailand (ICT · GMT+7)',
            '<i class="fas fa-coins" aria-hidden="true"></i> <strong>Mata wang:</strong> Baht Thai (THB)',
            '<i class="fas fa-plane" aria-hidden="true"></i> <strong>Berdekatan:</strong> Lapangan terbang Hat Yai · Langkawi / Malaysia',
            '<i class="fas fa-water" aria-hidden="true"></i> <strong>Musim:</strong> Nov–Apr terbaik untuk laut & mendaki'
        ],
        footer: {
            note: 'Hubungi',
            tourism: 'Tourism Thailand'
        },
        contactForm: {
            name: 'Nama',
            email: 'Emel',
            message: 'Mesej',
            send: 'Hantar mesej',
            thanks: 'Terima kasih atas mesej anda!',
            error: 'Ralat berlaku semasa menghantar mesej anda.'
        },
        bookingForm: {
            thanks: 'Permintaan tempahan diterima!',
            thanksRef: 'Rujukan:',
            emailSentNote: 'Dihantar kepada pasukan pelancongan kami melalui emel.',
            emailPendingNote: 'Disimpan — emel tidak dapat dihantar; kami akan susulan jika boleh.',
            sentTo: 'Dihantar terus kepada',
            continueNote: 'Mereka akan menghubungi anda secara terus untuk sahkan ketersediaan, harga, dan bayaran. Jangan segan untuk hubungi mereka sendiri juga — Satun Scape tidak mengendalikan bayaran atau pengesahan.',
            screenshotNote: 'Simpan tangkapan skrin pengesahan ini untuk rekod anda.',
            error: 'Tidak dapat menghubungi pelayan. Permintaan anda telah disimpan secara tempatan.',
            validation: 'Sila isi semua ruangan yang diperlukan.',
            notice: 'Permintaan tidak muktamad sehingga disahkan. Musim puncak (Nov–Apr): tempah awal untuk bot dan permit taman.',
            tabTour: 'Lawatan',
            tabCar: 'Sewa Kereta',
            tabBoat: 'Bot',
            tabStay: 'Penginapan',
            legendContact: 'Butiran anda',
            recentHeading: 'Permintaan terkini anda',
            titleTour: 'Tempah lawatan',
            descTour: 'Lawatan sehari dan pakej pelbagai hari di sekitar Tarutao, gua, air terjun, dan lawatan warisan bandar.',
            titleCar: 'Sewa kereta',
            descCar: 'Memandu sendiri atau dengan pemandu. Lesen sah dan pasport diperlukan; permit antarabangsa disyorkan untuk lesen asing.',
            titleBoat: 'Tempah bot',
            descBoat: 'Laluan feri dan bot laju ke Tarutao, Ko Lipe, dan lompat pulau. Jadual berbeza mengikut musim dan keadaan laut.',
            titleStay: 'Tempah penginapan',
            descStay: 'Hotel dan rumah tumpangan di bandar Satun, La-ngu, dan berhampiran Pakbara. Lihat halaman Penginapan kami untuk foto dan peta.',
            labelPackage: 'Pakej lawatan',
            labelDate: 'Tarikh pilihan',
            labelAdults: 'Dewasa',
            labelChildren: 'Kanak-kanak',
            labelPickup: 'Kawasan penjemputan',
            labelName: 'Nama penuh',
            labelEmail: 'Emel',
            labelPhone: 'Telefon / WhatsApp',
            labelNationality: 'Kewarganegaraan',
            labelNotes: 'Permintaan khas',
            submitTour: 'Minta tempahan lawatan',
            labelVehicle: 'Kenderaan',
            labelDriver: 'Pemandu',
            labelPickupDate: 'Tarikh penjemputan',
            labelPickupTime: 'Waktu penjemputan',
            labelReturnDate: 'Tarikh pulang',
            labelLocation: 'Penjemputan / penghantaran',
            submitCar: 'Minta sewaan kereta',
            labelRoute: 'Laluan',
            labelPassengers: 'Penumpang',
            labelReturnTrip: 'Perjalanan pulang',
            labelReturnDateBoat: 'Tarikh pulang',
            labelLuggage: 'Bagasi / nota',
            submitBoat: 'Minta tempahan bot',
            labelProperty: 'Hartanah',
            labelRooms: 'Bilik',
            labelCheckin: 'Daftar masuk',
            labelCheckout: 'Daftar keluar',
            labelGuests: 'Tetamu',
            labelRoomPrefs: 'Keutamaan bilik',
            submitStay: 'Minta tempahan penginapan',
            ctaTitle: 'Sedia untuk menempah?',
            ctaDesc: 'Tempah lawatan, kereta, bot, dan hotel di satu tempat.',
            ctaBtn: 'Buka tempahan',
            pkgHeading: 'Pakej disyorkan',
            pkgSub: 'Itinerari popular — ketik pakej untuk lihat butiran penuh, kemudian tempah di bawah.',
            pkgViewBtn: 'Lihat butiran',
            pkgModalBook: 'Tempah pakej ini',
            pkgModalClose: 'Tutup',
            modalDuration: 'Tempoh',
            modalGroup: 'Saiz kumpulan',
            modalItinerary: 'Itinerari',
            modalIncludes: 'Termasuk',
            modalExcludes: 'Tidak termasuk',
            modalBring: 'Apa yang perlu dibawa',
            modalNotes: 'Perlu tahu',
            badgeTour: 'Lawatan',
            badgeBoat: 'Bot',
            badgeCar: 'Kereta',
            badgeStay: 'Penginapan',
            pkg7title: 'Lawatan Sehari Snorkel Koh Bulone',
            pkg7meta: '1 hari · Jeti Pakbara · Taweesub Speedboat',
            pkg7desc: 'Dua perhentian snorkel di Koh Bulone Mai Phai dan Hin Khaw, kayak & SUP percuma, makan tengah hari dan buah-buahan disertakan.',
            pkg7price: '฿1,760 (Thai) · ฿1,860 (warga asing)',
            pkg8title: 'Pulau Koh Bulone 2H1M',
            pkg8meta: '2 hari 1 malam · Seasatun Travel',
            pkg8desc: 'Bermalam di Koh Bulone dengan snorkeling di Mai Phai dan Bulone Le, berkayak, dan makan malam di pantai.',
            pkg8price: 'Hubungi untuk kadar semasa',
            pkg9title: 'Pulau Koh Bulone 3H2M',
            pkg9meta: '3 hari 2 malam · Seasatun Travel',
            pkg9desc: 'Percutian pulau yang lebih santai dengan satu hari percuma penuh untuk berkayak atau denai alam semula jadi pulau.',
            pkg9price: 'Hubungi untuk kadar semasa',
            pkg10title: 'Lompat Pulau Ko Lipe 2H1M',
            pkg10meta: '2 hari 1 malam · Seasatun Travel',
            pkg10desc: 'Snorkeling longtail sehari di sekitar Ko Rawi, Ko Hin Ngam, saluran Jabang dan Ko Adang.',
            pkg10price: 'Hubungi untuk kadar semasa',
            pkg11title: 'Lompat Pulau Ko Lipe 3H2M',
            pkg11meta: '3 hari 2 malam · Seasatun Travel',
            pkg11desc: 'Sehari penuh snorkeling di sekitar Ko Adang, Ko Rawi, Ko Hin Ngam, Ko Yang dan saluran Jabang, dengan waktu pulang yang fleksibel.',
            pkg11price: 'Hubungi untuk kadar semasa',
            pkg12title: 'Lompat Pulau Ko Lipe 4H3M',
            pkg12meta: '4 hari 3 malam · Seasatun Travel',
            pkg12desc: 'Percutian Lipe lebih lama dengan hari snorkeling pulau luar serta hari percuma mendaki mercu pandang Pha Chado di Ko Adang.',
            pkg12price: 'Hubungi untuk kadar semasa',
            pkg13title: 'Lawatan Sehari Alam & Budaya La-ngu',
            pkg13meta: '1 hari · Songthaew klasik · Seasatun Travel',
            pkg13desc: 'Mercu pandang Khao Daeng, Gua Urai Thong, denai alam semula jadi, makan tengah hari tempatan, dan akuarium Jabatan Perikanan.',
            pkg13price: 'Hubungi untuk kadar semasa',
            pkg14title: 'Ko Lipe Mountain Resort',
            pkg14meta: '2 malam · Bilik Deluxe Garden',
            pkg14desc: 'Resort berkolam di Ko Lipe dengan van, pemindahan bot laju, sarapan dan lawatan snorkeling disertakan.',
            pkg14price: 'Dari ฿3,450 / 2H1M (kadar hari biasa)',
            pkgSelected: 'Pakej dipilih — lengkapkan borang di bawah.'
        },
        pages: {
            home: {
                docTitle: 'Satun Scape · Lawati Wilayah Satun, Thailand',
                heroEyebrow: 'Selatan Thailand · Pantai Laut Andaman',
                heroLead: 'Pulau, air terjun hutan, gua, makanan laut segar—dan sisi Thailand yang lebih tenang. Untuk pengembara yang suka Bahasa Inggeris ringkas dan tip perjalanan yang praktikal.',
                infoSatun: 'Rancang lawatan anda ke Satun',
                generalTitle: 'Tentang wilayah',
                generalDesc: 'Satun ialah wilayah barat daya Thailand di sepanjang Laut Andaman, bersebelahan Perlis dan Langkawi, Malaysia. Nantikan budaya Melayu-Thai, pulau batu kapur—dan orang ramai yang lebih sedikit berbanding Phuket atau Krabi.',
                introTitle: 'Jangan lepaskan',
                att1: 'Pelayaran kepulauan, snorkeling, denai hutan—tempah awal semasa musim puncak.',
                att2: 'Rumah agam era kolonial dan muzium wilayah—perhentian mudah di bandar.',
                att3: 'Salah satu sistem gua terbesar di Thailand—bawa kasut yang tidak licin.',
                att4: 'Teres dan kolam batu kapur—percutian alam semula jadi pedalaman klasik.',
                cuisineTitle: 'Makanan kegemaran pengembara',
                cuisineDesc: 'Rasa Thai Selatan sangat kuat; dapur halal terdapat di mana-mana. Cuba ikan panggang, sotong, ketam, roti tepi jalan, dan kopi ais.',
                tipsTitle: 'Tip pantas',
                tip1: 'Cuaca: November–April paling kering untuk bot; Julai–Oktober boleh mengganggu feri.',
                tip2: 'Bergerak: songthaew, teksi, Grab (jika ada), kereta sewa—atau skuter hanya dengan lesen sah dan IDP jika diperlukan.',
                tip3: 'Kesopanan: tutup bahu dan lutut di tempat suci; tanggalkan kasut jika bertanda; dron memerlukan permit di kebanyakan taman.',
                official: '<strong><i class="fas fa-globe"></i> Maklumat wilayah:</strong> <a href="https://www.satun.go.th/frontpage" target="_blank" rel="noopener noreferrer">satun.go.th</a>',
                hotHead: 'Tempat menarik pilihan',
                hotSub: 'Nama daerah membantu anda cari lokasi pada peta.',
                videoTitle: 'Satun dari udara',
                videoDesc: 'Senyap secara lalai—anda boleh hidupkan bunyi dalam pemain.',
                cafesHead: 'Kopi & makanan mesra halal',
                cafesSub: 'Kegemaran tempatan—senarai penuh ada di halaman makanan.',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            attractions: {
                docTitle: 'Tarikan · Satun Scape',
                heroEyebrow: 'Wilayah Satun · Thailand',
                heroTitle: 'Pilih kategori tarikan anda',
                pageIntro: 'Terokai tarikan',
                culturalBtn: 'Tarikan budaya',
                naturalBtn: 'Tarikan semula jadi',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            accommodation: {
                docTitle: 'Penginapan · Satun Scape',
                heroEyebrow: 'Hotel & rumah tumpangan',
                heroTitle: 'Cari penginapan anda',
                pageIntro: 'Terokai tempat penginapan',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            cafes: {
                docTitle: 'Makan & Minum · Satun Scape',
                heroEyebrow: 'Kafe & restoran',
                heroTitle: 'Kafe & restoran',
                pageIntro: 'Terokai kafe dan restoran',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            market: {
                docTitle: 'Pasar · Satun Scape',
                heroEyebrow: 'Pasar tempatan',
                heroTitle: 'Pasar',
                pageIntro: 'Terokai pasar',
                sectionMarket: 'Maklumat pasar',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            contact: {
                docTitle: 'Hubungi · Satun Scape',
                heroEyebrow: 'Kami sedia membantu',
                heroTitle: 'Hubungi kami',
                contactTitle: 'Kami ingin mendengar daripada anda',
                contactInfoHeading: 'Maklumat hubungan',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            booking: {
                docTitle: 'Tempah · Satun Scape',
                heroEyebrow: 'Rancang perjalanan anda',
                heroTitle: 'Tempah lawatan & perjalanan',
                heroLead: 'Tempah lawatan pulau, sewa kereta, tempah pemindahan bot, atau minta penginapan hotel. Kami sahkan melalui emel dalam 1–2 hari bekerja.',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            cultural: {
                docTitle: 'Tarikan budaya · Satun Scape',
                heroEyebrow: 'Warisan & muzium',
                heroTitle: 'Tarikan budaya',
                pageIntro: 'Terokai tarikan budaya',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            natural: {
                docTitle: 'Tarikan semula jadi · Satun Scape',
                heroEyebrow: 'Pulau · hutan · gua',
                heroTitle: 'Tarikan semula jadi',
                pageIntro: 'Terokai tarikan semula jadi',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            }
        }
    },
    ar: {
        skip: 'تخطَّ إلى المحتوى',
        nav: {
            home: 'الرئيسية',
            attractions: 'المعالم',
            stay: 'الإقامة',
            book: 'احجز',
            eat: 'مأكل ومشرب',
            markets: 'الأسواق',
            contact: 'اتصل بنا'
        },
        visitor: [
            '<i class="fas fa-clock" aria-hidden="true"></i> <strong>الوقت:</strong> تايلاند (ICT · GMT+7)',
            '<i class="fas fa-coins" aria-hidden="true"></i> <strong>العملة:</strong> بات تايلاندي (THB)',
            '<i class="fas fa-plane" aria-hidden="true"></i> <strong>القريب:</strong> مطار هات ياي · لنكاوي / ماليزيا',
            '<i class="fas fa-water" aria-hidden="true"></i> <strong>الموسم:</strong> نوفمبر-أبريل الأفضل للبحر والمشي'
        ],
        footer: {
            note: 'اتصل بنا',
            tourism: 'السياحة التايلاندية'
        },
        contactForm: {
            name: 'الاسم',
            email: 'البريد الإلكتروني',
            message: 'الرسالة',
            send: 'إرسال الرسالة',
            thanks: 'شكرًا لرسالتك!',
            error: 'حدث خطأ أثناء إرسال رسالتك.'
        },
        bookingForm: {
            thanks: 'تم استلام طلب الحجز!',
            thanksRef: 'الرقم المرجعي:',
            emailSentNote: 'تم الإرسال إلى فريق الجولات لدينا عبر البريد الإلكتروني.',
            emailPendingNote: 'تم الحفظ — تعذّر إرسال البريد الإلكتروني؛ سنتابع إن أمكن.',
            sentTo: 'تم الإرسال مباشرة إلى',
            continueNote: 'سيتواصلون معك مباشرة لتأكيد التوفر والسعر والدفع. لا تتردد في التواصل معهم بنفسك أيضًا — لا يتعامل Satun Scape مع المدفوعات أو التأكيدات.',
            screenshotNote: 'احتفظ بلقطة شاشة لهذا التأكيد لسجلاتك.',
            error: 'تعذر الوصول إلى الخادم. تم حفظ طلبك محليًا.',
            validation: 'يرجى ملء جميع الحقول المطلوبة.',
            notice: 'الطلبات غير ملزمة حتى تأكيدها. موسم الذروة (نوفمبر-أبريل): احجز مبكرًا للقوارب وتصاريح المتنزهات.',
            tabTour: 'الجولات',
            tabCar: 'استئجار سيارة',
            tabBoat: 'قارب',
            tabStay: 'الإقامة',
            legendContact: 'بياناتك',
            recentHeading: 'طلباتك الأخيرة',
            titleTour: 'احجز جولة',
            descTour: 'رحلات يومية وباقات متعددة الأيام حول تاروتاو والكهوف والشلالات وجولات التراث في المدينة.',
            titleCar: 'استئجار سيارة',
            descCar: 'قيادة ذاتية أو مع سائق. يلزم رخصة قيادة وجواز سفر ساريين؛ يُنصح برخصة دولية للرخص الأجنبية.',
            titleBoat: 'احجز قاربًا',
            descBoat: 'خطوط العبّارات والقوارب السريعة إلى تاروتاو وكو ليبي والتنقل بين الجزر. تتغير المواعيد حسب الموسم وحالة البحر.',
            titleStay: 'احجز إقامة',
            descStay: 'فنادق وبيوت ضيافة في مدينة ساتون ولا-نغو وبالقرب من باكبارا. اطّلع على صفحة الإقامة لدينا للصور والخرائط.',
            labelPackage: 'باقة الجولة',
            labelDate: 'التاريخ المفضل',
            labelAdults: 'البالغون',
            labelChildren: 'الأطفال',
            labelPickup: 'منطقة الاستلام',
            labelName: 'الاسم الكامل',
            labelEmail: 'البريد الإلكتروني',
            labelPhone: 'الهاتف / واتساب',
            labelNationality: 'الجنسية',
            labelNotes: 'طلبات خاصة',
            submitTour: 'طلب حجز جولة',
            labelVehicle: 'المركبة',
            labelDriver: 'السائق',
            labelPickupDate: 'تاريخ الاستلام',
            labelPickupTime: 'وقت الاستلام',
            labelReturnDate: 'تاريخ العودة',
            labelLocation: 'الاستلام / التسليم',
            submitCar: 'طلب استئجار سيارة',
            labelRoute: 'المسار',
            labelPassengers: 'الركاب',
            labelReturnTrip: 'رحلة العودة',
            labelReturnDateBoat: 'تاريخ العودة',
            labelLuggage: 'الأمتعة / ملاحظات',
            submitBoat: 'طلب حجز قارب',
            labelProperty: 'العقار',
            labelRooms: 'الغرف',
            labelCheckin: 'تسجيل الوصول',
            labelCheckout: 'تسجيل المغادرة',
            labelGuests: 'الضيوف',
            labelRoomPrefs: 'تفضيلات الغرفة',
            submitStay: 'طلب حجز إقامة',
            ctaTitle: 'مستعد للحجز؟',
            ctaDesc: 'احجز الجولات والسيارات والقوارب والفنادق في مكان واحد.',
            ctaBtn: 'افتح الحجز',
            pkgHeading: 'الباقات الموصى بها',
            pkgSub: 'خطط رحلات شهيرة — اضغط على باقة لعرض التفاصيل الكاملة، ثم احجز أدناه.',
            pkgViewBtn: 'عرض التفاصيل',
            pkgModalBook: 'احجز هذه الباقة',
            pkgModalClose: 'إغلاق',
            modalDuration: 'المدة',
            modalGroup: 'حجم المجموعة',
            modalItinerary: 'خط الرحلة',
            modalIncludes: 'يشمل',
            modalExcludes: 'لا يشمل',
            modalBring: 'ما يجب إحضاره',
            modalNotes: 'من المفيد معرفته',
            badgeTour: 'جولة',
            badgeBoat: 'قارب',
            badgeCar: 'سيارة',
            badgeStay: 'إقامة',
            pkg7title: 'رحلة يومية للغطس في كوه بولون',
            pkg7meta: 'يوم واحد · رصيف باكبارا · Taweesub Speedboat',
            pkg7desc: 'محطتا غطس في كوه بولون ماي فاي وهين خاو، كاياك وسوب مجانًا، غداء وفواكه ضمن السعر.',
            pkg7price: '฿1,760 (تايلاندي) · ฿1,860 (أجنبي)',
            pkg8title: 'جزيرة كوه بولون يومان وليلة',
            pkg8meta: 'يومان وليلة واحدة · Seasatun Travel',
            pkg8desc: 'مبيت في كوه بولون مع الغطس في ماي فاي وبولون لي والتجديف بالكاياك وعشاء على الشاطئ.',
            pkg8price: 'تواصل معنا للسعر الحالي',
            pkg9title: 'جزيرة كوه بولون ٣ أيام وليلتان',
            pkg9meta: '٣ أيام وليلتان · Seasatun Travel',
            pkg9desc: 'إقامة جزيرة أكثر هدوءًا مع يوم حر كامل للتجديف بالكاياك أو مسارات الطبيعة في الجزيرة.',
            pkg9price: 'تواصل معنا للسعر الحالي',
            pkg10title: 'التنقل بين جزر كو ليبي يومان وليلة',
            pkg10meta: 'يومان وليلة واحدة · Seasatun Travel',
            pkg10desc: 'غطس بقارب طويل الذيل في نفس اليوم حول كو راوي وكو هين نغام وقناة جابانغ وكو أدانغ.',
            pkg10price: 'تواصل معنا للسعر الحالي',
            pkg11title: 'التنقل بين جزر كو ليبي ٣ أيام وليلتان',
            pkg11meta: '٣ أيام وليلتان · Seasatun Travel',
            pkg11desc: 'يوم غطس كامل حول كو أدانغ وكو راوي وكو هين نغام وكو يانغ وقناة جابانغ، مع أوقات عودة مرنة.',
            pkg11price: 'تواصل معنا للسعر الحالي',
            pkg12title: 'التنقل بين جزر كو ليبي ٤ أيام و٣ ليالٍ',
            pkg12meta: '٤ أيام و٣ ليالٍ · Seasatun Travel',
            pkg12desc: 'إقامة أطول في ليبي مع يوم غطس للجزر الخارجية بالإضافة إلى يوم حر لتسلق نقطة مشاهدة فا تشادو في كو أدانغ.',
            pkg12price: 'تواصل معنا للسعر الحالي',
            pkg13title: 'جولة يومية لطبيعة وثقافة لا-نغو',
            pkg13meta: 'يوم واحد · سونغثايو كلاسيكي · Seasatun Travel',
            pkg13desc: 'نقطة مشاهدة خاو دايينغ، كهف أوراي ثونغ، مسار طبيعي، غداء محلي، وحوض أسماك إدارة مصايد الأسماك.',
            pkg13price: 'تواصل معنا للسعر الحالي',
            pkg14title: 'منتجع كو ليبي ماونتن',
            pkg14meta: 'ليلتان · غرفة Deluxe Garden',
            pkg14desc: 'منتجع بمسبح في كو ليبي مع نقل بالحافلة الصغيرة وقارب سريع وإفطار ورحلة غطس ضمن السعر.',
            pkg14price: 'يبدأ من ฿3,450 / يومان وليلة (سعر أيام الأسبوع)',
            pkgSelected: 'تم اختيار الباقة — أكمل النموذج أدناه.'
        },
        pages: {
            home: {
                docTitle: 'Satun Scape · زُر محافظة ساتون، تايلاند',
                heroEyebrow: 'جنوب تايلاند · ساحل بحر أندامان',
                heroLead: 'جزر وشلالات في الغابة وكهوف ومأكولات بحرية طازجة—وجانب أكثر هدوءًا من تايلاند. لمن يفضّل الإنجليزية البسيطة ونصائح رحلات عملية.',
                infoSatun: 'خطط زيارتك إلى ساتون',
                generalTitle: 'عن المحافظة',
                generalDesc: 'ساتون هي محافظة تايلاند الجنوبية الغربية على ساحل بحر أندامان، بجانب بيرليس ولنكاوي الماليزيتين. توقع ثقافة ملايو-تايلاندية، وجزرًا كلسية—وحشودًا أقل من فوكيت أو كرابي.',
                introTitle: 'لا تفوّت',
                att1: 'رحلات بحرية بين الجزر وغطس ومسارات في الغابة—احجز مبكرًا في موسم الذروة.',
                att2: 'قصر من الحقبة الاستعمارية ومتحف المحافظة—محطة سهلة في وسط المدينة.',
                att3: 'أحد أكبر أنظمة الكهوف في تايلاند—أحضر أحذية غير زلقة.',
                att4: 'مدرجات وبرك كلسية—نزهة طبيعية داخلية كلاسيكية.',
                cuisineTitle: 'طعام يحبه المسافرون',
                cuisineDesc: 'نكهات جنوب تايلاند قوية؛ المطابخ الحلال منتشرة على نطاق واسع. جرّب السمك المشوي والحبار وسلطعون البحر وروتي الشارع والقهوة المثلجة.',
                tipsTitle: 'نصائح سريعة',
                tip1: 'الطقس: نوفمبر-أبريل الأكثر جفافًا للقوارب؛ يوليو-أكتوبر قد يعطّل العبّارات.',
                tip2: 'التنقل: السونغثايو والتاكسي وGrab (حيثما توفر) وسيارة مستأجرة—أو دراجة نارية فقط برخصة سارية وتصريح دولي عند الحاجة.',
                tip3: 'اللباقة: غطِّ الكتفين والركبتين في الأماكن المقدسة؛ اخلع حذاءك حيثما يُطلب؛ الطائرات المسيّرة تحتاج تصريحًا في معظم المتنزهات.',
                official: '<strong><i class="fas fa-globe"></i> معلومات المحافظة:</strong> <a href="https://www.satun.go.th/frontpage" target="_blank" rel="noopener noreferrer">satun.go.th</a>',
                hotHead: 'أماكن مميزة',
                hotSub: 'أسماء المناطق تساعدك على تحديد المواقع على الخرائط.',
                videoTitle: 'ساتون من الجو',
                videoDesc: 'كتم الصوت افتراضيًا—يمكنك تشغيل الصوت في المشغّل.',
                cafesHead: 'قهوة ووجبات ملائمة للحلال',
                cafesSub: 'المفضلة المحلية—القائمة الكاملة في صفحة المأكولات.',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            attractions: {
                docTitle: 'المعالم · Satun Scape',
                heroEyebrow: 'محافظة ساتون · تايلاند',
                heroTitle: 'اختر فئة المعلم',
                pageIntro: 'استكشف المعالم',
                culturalBtn: 'المعالم الثقافية',
                naturalBtn: 'المعالم الطبيعية',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            accommodation: {
                docTitle: 'الإقامة · Satun Scape',
                heroEyebrow: 'الفنادق وبيوت الضيافة',
                heroTitle: 'اعثر على إقامتك',
                pageIntro: 'استكشف أماكن الإقامة',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            cafes: {
                docTitle: 'مأكل ومشرب · Satun Scape',
                heroEyebrow: 'مقاهي ومطاعم',
                heroTitle: 'مقاهي ومطاعم',
                pageIntro: 'استكشف المقاهي والمطاعم',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            market: {
                docTitle: 'الأسواق · Satun Scape',
                heroEyebrow: 'الأسواق المحلية',
                heroTitle: 'الأسواق',
                pageIntro: 'استكشف الأسواق',
                sectionMarket: 'معلومات السوق',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            contact: {
                docTitle: 'اتصل بنا · Satun Scape',
                heroEyebrow: 'نحن هنا للمساعدة',
                heroTitle: 'اتصل بنا',
                contactTitle: 'يسعدنا أن نسمع منك',
                contactInfoHeading: 'معلومات الاتصال',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            booking: {
                docTitle: 'احجز · Satun Scape',
                heroEyebrow: 'خطط رحلتك',
                heroTitle: 'احجز الجولات والسفر',
                heroLead: 'احجز جولات الجزر، استأجر سيارة، احجز عبّارات، أو اطلب إقامة فندقية. نؤكد عبر البريد الإلكتروني خلال يوم إلى يومي عمل.',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            cultural: {
                docTitle: 'المعالم الثقافية · Satun Scape',
                heroEyebrow: 'التراث والمتاحف',
                heroTitle: 'المعالم الثقافية',
                pageIntro: 'استكشف المعالم الثقافية',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            natural: {
                docTitle: 'المعالم الطبيعية · Satun Scape',
                heroEyebrow: 'جزر · غابة · كهوف',
                heroTitle: 'المعالم الطبيعية',
                pageIntro: 'استكشف المعالم الطبيعية',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            }
        }
    },
    es: {
        skip: 'Saltar al contenido',
        nav: {
            home: 'Inicio',
            attractions: 'Atracciones',
            stay: 'Alojamiento',
            book: 'Reservar',
            eat: 'Comer y beber',
            markets: 'Mercados',
            contact: 'Contacto'
        },
        visitor: [
            '<i class="fas fa-clock" aria-hidden="true"></i> <strong>Hora:</strong> Tailandia (ICT · GMT+7)',
            '<i class="fas fa-coins" aria-hidden="true"></i> <strong>Moneda:</strong> Baht tailandés (THB)',
            '<i class="fas fa-plane" aria-hidden="true"></i> <strong>Cerca de:</strong> Aeropuerto de Hat Yai · Langkawi / Malasia',
            '<i class="fas fa-water" aria-hidden="true"></i> <strong>Temporada:</strong> Nov–Abr es lo mejor para mar y senderismo'
        ],
        footer: {
            note: 'Contacto',
            tourism: 'Turismo de Tailandia'
        },
        contactForm: {
            name: 'Nombre',
            email: 'Correo electrónico',
            message: 'Mensaje',
            send: 'Enviar mensaje',
            thanks: '¡Gracias por tu mensaje!',
            error: 'Ocurrió un error al enviar tu mensaje.'
        },
        bookingForm: {
            thanks: '¡Solicitud de reserva recibida!',
            thanksRef: 'Referencia:',
            emailSentNote: 'Enviado a nuestro equipo de tours por correo electrónico.',
            emailPendingNote: 'Guardado — no se pudo enviar el correo; te contactaremos si es posible.',
            sentTo: 'Enviado directamente a',
            continueNote: 'Se pondrán en contacto contigo directamente para confirmar disponibilidad, precio y pago. Puedes contactarlos tú también — Satun Scape no procesa pagos ni confirmaciones.',
            screenshotNote: 'Guarda una captura de pantalla de esta confirmación para tus registros.',
            error: 'No se pudo conectar con el servidor. Tu solicitud se guardó localmente.',
            validation: 'Por favor completa todos los campos requeridos.',
            notice: 'Las solicitudes no son vinculantes hasta confirmarse. Temporada alta (Nov–Abr): reserva con anticipación botes y permisos de parques.',
            tabTour: 'Tours',
            tabCar: 'Alquiler de auto',
            tabBoat: 'Barco',
            tabStay: 'Alojamiento',
            legendContact: 'Tus datos',
            recentHeading: 'Tus solicitudes recientes',
            titleTour: 'Reservar un tour',
            descTour: 'Excursiones de un día y paquetes de varios días por Tarutao, cuevas, cascadas y recorridos patrimoniales en la ciudad.',
            titleCar: 'Alquilar un auto',
            descCar: 'Auto-conducción o con conductor. Se requiere licencia válida y pasaporte; se recomienda permiso internacional para licencias extranjeras.',
            titleBoat: 'Reservar un barco',
            descBoat: 'Rutas de ferry y lancha rápida a Tarutao, Ko Lipe y saltos entre islas. Los horarios varían según la temporada y el estado del mar.',
            titleStay: 'Reservar alojamiento',
            descStay: 'Hoteles y guesthouses en la ciudad de Satun, La-ngu y cerca de Pakbara. Consulta nuestra página de Alojamiento para fotos y mapas.',
            labelPackage: 'Paquete de tour',
            labelDate: 'Fecha preferida',
            labelAdults: 'Adultos',
            labelChildren: 'Niños',
            labelPickup: 'Zona de recogida',
            labelName: 'Nombre completo',
            labelEmail: 'Correo electrónico',
            labelPhone: 'Teléfono / WhatsApp',
            labelNationality: 'Nacionalidad',
            labelNotes: 'Solicitudes especiales',
            submitTour: 'Solicitar reserva de tour',
            labelVehicle: 'Vehículo',
            labelDriver: 'Conductor',
            labelPickupDate: 'Fecha de recogida',
            labelPickupTime: 'Hora de recogida',
            labelReturnDate: 'Fecha de regreso',
            labelLocation: 'Recogida / entrega',
            submitCar: 'Solicitar alquiler de auto',
            labelRoute: 'Ruta',
            labelPassengers: 'Pasajeros',
            labelReturnTrip: 'Viaje de regreso',
            labelReturnDateBoat: 'Fecha de regreso',
            labelLuggage: 'Equipaje / notas',
            submitBoat: 'Solicitar reserva de barco',
            labelProperty: 'Propiedad',
            labelRooms: 'Habitaciones',
            labelCheckin: 'Entrada',
            labelCheckout: 'Salida',
            labelGuests: 'Huéspedes',
            labelRoomPrefs: 'Preferencias de habitación',
            submitStay: 'Solicitar reserva de alojamiento',
            ctaTitle: '¿Listo para reservar?',
            ctaDesc: 'Reserva tours, autos, barcos y hoteles en un solo lugar.',
            ctaBtn: 'Abrir reservas',
            pkgHeading: 'Paquetes recomendados',
            pkgSub: 'Itinerarios populares — toca un paquete para ver todos los detalles, luego reserva abajo.',
            pkgViewBtn: 'Ver detalles',
            pkgModalBook: 'Reservar este paquete',
            pkgModalClose: 'Cerrar',
            modalDuration: 'Duración',
            modalGroup: 'Tamaño del grupo',
            modalItinerary: 'Itinerario',
            modalIncludes: 'Incluye',
            modalExcludes: 'No incluye',
            modalBring: 'Qué llevar',
            modalNotes: 'Bueno saber',
            badgeTour: 'Tour',
            badgeBoat: 'Barco',
            badgeCar: 'Auto',
            badgeStay: 'Alojamiento',
            pkg7title: 'Excursión de snorkel a Koh Bulone',
            pkg7meta: '1 día · Muelle de Pakbara · Taweesub Speedboat',
            pkg7desc: 'Dos paradas de snorkel en Koh Bulone Mai Phai y Hin Khaw, kayak y SUP gratis, almuerzo y fruta incluidos.',
            pkg7price: '฿1.760 (tailandés) · ฿1.860 (extranjero)',
            pkg8title: 'Isla Koh Bulone 2D1N',
            pkg8meta: '2 días 1 noche · Seasatun Travel',
            pkg8desc: 'Noche en Koh Bulone con snorkel en Mai Phai y Bulone Le, kayak y cena en la playa.',
            pkg8price: 'Contactar para tarifa actual',
            pkg9title: 'Isla Koh Bulone 3D2N',
            pkg9meta: '3 días 2 noches · Seasatun Travel',
            pkg9desc: 'Una estancia isleña más relajada con un día libre completo para kayak o senderos naturales de la isla.',
            pkg9price: 'Contactar para tarifa actual',
            pkg10title: 'Recorrido de islas Ko Lipe 2D1N',
            pkg10meta: '2 días 1 noche · Seasatun Travel',
            pkg10desc: 'Snorkel en lancha larga el mismo día alrededor de Ko Rawi, Ko Hin Ngam, canal Jabang y Ko Adang.',
            pkg10price: 'Contactar para tarifa actual',
            pkg11title: 'Recorrido de islas Ko Lipe 3D2N',
            pkg11meta: '3 días 2 noches · Seasatun Travel',
            pkg11desc: 'Un día completo de snorkel alrededor de Ko Adang, Ko Rawi, Ko Hin Ngam, Ko Yang y canal Jabang, con horarios de regreso flexibles.',
            pkg11price: 'Contactar para tarifa actual',
            pkg12title: 'Recorrido de islas Ko Lipe 4D3N',
            pkg12meta: '4 días 3 noches · Seasatun Travel',
            pkg12desc: 'Estancia más larga en Lipe con un día de snorkel en islas exteriores más un día libre para subir al mirador Pha Chado en Ko Adang.',
            pkg12price: 'Contactar para tarifa actual',
            pkg13title: 'Tour de un día de naturaleza y cultura en La-ngu',
            pkg13meta: '1 día · Songthaew clásico · Seasatun Travel',
            pkg13desc: 'Mirador de Khao Daeng, cueva Urai Thong, sendero natural, almuerzo local y el acuario del Departamento de Pesca.',
            pkg13price: 'Contactar para tarifa actual',
            pkg14title: 'Ko Lipe Mountain Resort',
            pkg14meta: '2 noches · Habitación Deluxe Garden',
            pkg14desc: 'Resort con piscina en Ko Lipe con transporte en furgoneta, traslado en lancha rápida, desayuno y tour de snorkel incluidos.',
            pkg14price: 'Desde ฿3.450 / 2D1N (tarifa entre semana)',
            pkgSelected: 'Paquete seleccionado — completa el formulario a continuación.'
        },
        pages: {
            home: {
                docTitle: 'Satun Scape · Visita la provincia de Satun, Tailandia',
                heroEyebrow: 'Sur de Tailandia · Costa del mar de Andamán',
                heroLead: 'Islas, cascadas en la selva, cuevas, mariscos frescos—y un lado más tranquilo de Tailandia. Para viajeros que prefieren un inglés sencillo y consejos prácticos de viaje.',
                infoSatun: 'Planifica tu visita a Satun',
                generalTitle: 'Sobre la provincia',
                generalDesc: 'Satun es la provincia suroeste de Tailandia a lo largo del mar de Andamán, junto a Perlis y Langkawi en Malasia. Espera cultura malayo-tailandesa, islas de piedra caliza—y menos multitudes que Phuket o Krabi.',
                introTitle: 'No te lo pierdas',
                att1: 'Cruceros por el archipiélago, snorkel, senderos en la selva—reserva con anticipación en temporada alta.',
                att2: 'Mansión de la era colonial y museo provincial—parada fácil en el centro.',
                att3: 'Uno de los sistemas de cuevas más grandes de Tailandia—lleva calzado antideslizante.',
                att4: 'Terrazas y piscinas de piedra caliza—una salida clásica de naturaleza tierra adentro.',
                cuisineTitle: 'Comida que aman los viajeros',
                cuisineDesc: 'Los sabores del sur de Tailandia son intensos; las cocinas halal son comunes. Prueba pescado a la parrilla, calamar, cangrejo, roti callejero y café helado.',
                tipsTitle: 'Consejos rápidos',
                tip1: 'Clima: noviembre–abril es lo más seco para los botes; julio–octubre puede interrumpir los ferris.',
                tip2: 'Moverse: songthaews, taxis, Grab (donde esté disponible), auto alquilado—o scooter solo con licencia válida y permiso internacional si es necesario.',
                tip3: 'Cortesía: cubre hombros y rodillas en sitios sagrados; quítate los zapatos donde se indique; los drones necesitan permiso en muchos parques.',
                official: '<strong><i class="fas fa-globe"></i> Información provincial:</strong> <a href="https://www.satun.go.th/frontpage" target="_blank" rel="noopener noreferrer">satun.go.th</a>',
                hotHead: 'Lugares destacados',
                hotSub: 'Los nombres de distritos te ayudan a ubicar lugares en mapas.',
                videoTitle: 'Satun desde el aire',
                videoDesc: 'Silenciado por defecto—puedes activar el sonido en el reproductor.',
                cafesHead: 'Café y bocados aptos para halal',
                cafesSub: 'Favoritos locales—el resumen completo está en la página de comidas.',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            attractions: {
                docTitle: 'Atracciones · Satun Scape',
                heroEyebrow: 'Provincia de Satun · Tailandia',
                heroTitle: 'Elige tu categoría de atracción',
                pageIntro: 'Explora las atracciones',
                culturalBtn: 'Atracciones culturales',
                naturalBtn: 'Atracciones naturales',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            accommodation: {
                docTitle: 'Alojamiento · Satun Scape',
                heroEyebrow: 'Hoteles y guesthouses',
                heroTitle: 'Encuentra tu alojamiento',
                pageIntro: 'Explora lugares para hospedarte',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            cafes: {
                docTitle: 'Comer y beber · Satun Scape',
                heroEyebrow: 'Cafés y restaurantes',
                heroTitle: 'Cafés y restaurantes',
                pageIntro: 'Explora cafés y restaurantes',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            market: {
                docTitle: 'Mercados · Satun Scape',
                heroEyebrow: 'Mercados locales',
                heroTitle: 'Mercados',
                pageIntro: 'Explora los mercados',
                sectionMarket: 'Información del mercado',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            contact: {
                docTitle: 'Contacto · Satun Scape',
                heroEyebrow: 'Estamos aquí para ayudar',
                heroTitle: 'Contáctanos',
                contactTitle: 'Nos encantaría saber de ti',
                contactInfoHeading: 'Información de contacto',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            booking: {
                docTitle: 'Reservar · Satun Scape',
                heroEyebrow: 'Planifica tu viaje',
                heroTitle: 'Reserva tours y viajes',
                heroLead: 'Reserva tours de islas, alquila un auto, reserva traslados en barco o solicita una estancia de hotel. Confirmamos por correo electrónico en 1–2 días hábiles.',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            cultural: {
                docTitle: 'Atracciones culturales · Satun Scape',
                heroEyebrow: 'Patrimonio y museos',
                heroTitle: 'Atracciones culturales',
                pageIntro: 'Explora las atracciones culturales',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            natural: {
                docTitle: 'Atracciones naturales · Satun Scape',
                heroEyebrow: 'Islas · selva · cuevas',
                heroTitle: 'Atracciones naturales',
                pageIntro: 'Explora las atracciones naturales',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            }
        }
    },
    ko: {
        skip: '본문으로 건너뛰기',
        nav: {
            home: '홈',
            attractions: '관광명소',
            stay: '숙소',
            book: '예약',
            eat: '먹거리',
            markets: '시장',
            contact: '문의하기'
        },
        visitor: [
            '<i class="fas fa-clock" aria-hidden="true"></i> <strong>시간:</strong> 태국 (ICT · GMT+7)',
            '<i class="fas fa-coins" aria-hidden="true"></i> <strong>화폐:</strong> 태국 바트 (THB)',
            '<i class="fas fa-plane" aria-hidden="true"></i> <strong>인근:</strong> 핫야이 공항 · 랑카위 / 말레이시아',
            '<i class="fas fa-water" aria-hidden="true"></i> <strong>시즌:</strong> 11월–4월이 바다와 트레킹에 최적'
        ],
        footer: {
            note: '문의하기',
            tourism: '태국 관광청'
        },
        contactForm: {
            name: '이름',
            email: '이메일',
            message: '메시지',
            send: '메시지 보내기',
            thanks: '메시지를 보내주셔서 감사합니다!',
            error: '메시지 전송 중 오류가 발생했습니다.'
        },
        bookingForm: {
            thanks: '예약 요청이 접수되었습니다!',
            thanksRef: '참조번호:',
            emailSentNote: '이메일로 저희 투어팀에 전달되었습니다.',
            emailPendingNote: '저장되었습니다 — 이메일 전송에 실패했지만 가능하면 후속 조치하겠습니다.',
            sentTo: '다음으로 직접 전송됨',
            continueNote: '가용성, 가격, 결제 확인을 위해 직접 연락드릴 것입니다. 직접 연락하셔도 좋습니다 — Satun Scape는 결제나 확인을 처리하지 않습니다.',
            screenshotNote: '기록을 위해 이 확인 화면을 캡처해 두세요.',
            error: '서버에 연결할 수 없습니다. 요청 내용은 로컬에 저장되었습니다.',
            validation: '필수 항목을 모두 입력해 주세요.',
            notice: '요청은 확정 전까지 구속력이 없습니다. 성수기(11월–4월)에는 보트와 공원 허가를 미리 예약하세요.',
            tabTour: '투어',
            tabCar: '렌터카',
            tabBoat: '보트',
            tabStay: '숙소',
            legendContact: '연락처 정보',
            recentHeading: '최근 요청 내역',
            titleTour: '투어 예약',
            descTour: '타루타오, 동굴, 폭포, 시내 유적지 도보 투어 등 당일 및 다일 패키지.',
            titleCar: '렌터카',
            descCar: '자가 운전 또는 기사 포함. 유효한 면허증과 여권이 필요하며, 외국 면허증은 국제운전면허증을 권장합니다.',
            titleBoat: '보트 예약',
            descBoat: '타루타오, 코리페 및 섬 간 이동을 위한 페리 및 스피드보트 노선. 일정은 계절과 해상 상황에 따라 달라집니다.',
            titleStay: '숙소 예약',
            descStay: '사툰 시내, 라응우, 파크바라 인근의 호텔과 게스트하우스. 사진과 지도는 숙소 페이지를 참고하세요.',
            labelPackage: '투어 패키지',
            labelDate: '희망 날짜',
            labelAdults: '성인',
            labelChildren: '어린이',
            labelPickup: '픽업 장소',
            labelName: '이름',
            labelEmail: '이메일',
            labelPhone: '전화 / 왓츠앱',
            labelNationality: '국적',
            labelNotes: '특별 요청',
            submitTour: '투어 예약 요청',
            labelVehicle: '차량',
            labelDriver: '기사',
            labelPickupDate: '픽업 날짜',
            labelPickupTime: '픽업 시간',
            labelReturnDate: '반납 날짜',
            labelLocation: '픽업 / 반납 장소',
            submitCar: '렌터카 요청',
            labelRoute: '노선',
            labelPassengers: '인원수',
            labelReturnTrip: '왕복 여부',
            labelReturnDateBoat: '귀환 날짜',
            labelLuggage: '수하물 / 메모',
            submitBoat: '보트 예약 요청',
            labelProperty: '숙소',
            labelRooms: '객실 수',
            labelCheckin: '체크인',
            labelCheckout: '체크아웃',
            labelGuests: '투숙 인원',
            labelRoomPrefs: '객실 요청사항',
            submitStay: '숙소 예약 요청',
            ctaTitle: '예약할 준비가 되셨나요?',
            ctaDesc: '투어, 렌터카, 보트, 호텔을 한곳에서 예약하세요.',
            ctaBtn: '예약 페이지 열기',
            pkgHeading: '추천 패키지',
            pkgSub: '인기 일정—패키지를 탭하여 전체 세부정보를 확인한 후 아래에서 예약하세요.',
            pkgViewBtn: '세부정보 보기',
            pkgModalBook: '이 패키지 예약하기',
            pkgModalClose: '닫기',
            modalDuration: '기간',
            modalGroup: '인원 규모',
            modalItinerary: '일정',
            modalIncludes: '포함사항',
            modalExcludes: '불포함사항',
            modalBring: '준비물',
            modalNotes: '참고사항',
            badgeTour: '투어',
            badgeBoat: '보트',
            badgeCar: '렌터카',
            badgeStay: '숙소',
            pkg7title: '코부론 스노클링 당일 투어',
            pkg7meta: '1일 · 파크바라 부두 · Taweesub Speedboat',
            pkg7desc: '코부론 마이파이와 힌카오 두 곳에서 스노클링, 무료 카약 & SUP, 점심과 과일 포함.',
            pkg7price: '฿1,760 (태국인) · ฿1,860 (외국인)',
            pkg8title: '코부론 섬 2일 1박',
            pkg8meta: '2일 1박 · Seasatun Travel',
            pkg8desc: '마이파이와 부론레에서 스노클링, 카약, 해변 저녁식사를 즐기며 코부론에서 1박.',
            pkg8price: '현재 요금 문의',
            pkg9title: '코부론 섬 3일 2박',
            pkg9meta: '3일 2박 · Seasatun Travel',
            pkg9desc: '카약이나 섬의 자연 탐방로를 즐길 수 있는 하루 자유일정이 포함된 여유로운 섬 여행.',
            pkg9price: '현재 요금 문의',
            pkg10title: '코리페 아일랜드 홉 2일 1박',
            pkg10meta: '2일 1박 · Seasatun Travel',
            pkg10desc: '코라위, 코힌응암, 자방 해협, 코아당 주변에서 당일 롱테일 보트 스노클링.',
            pkg10price: '현재 요금 문의',
            pkg11title: '코리페 아일랜드 홉 3일 2박',
            pkg11meta: '3일 2박 · Seasatun Travel',
            pkg11desc: '코아당, 코라위, 코힌응암, 코양, 자방 해협을 도는 하루 종일 스노클링, 유연한 귀환 시간.',
            pkg11price: '현재 요금 문의',
            pkg12title: '코리페 아일랜드 홉 4일 3박',
            pkg12meta: '4일 3박 · Seasatun Travel',
            pkg12desc: '외곽 섬 스노클링 하루와 코아당의 파차도 전망대를 오르는 자유일정이 포함된 더 긴 리페 여행.',
            pkg12price: '현재 요금 문의',
            pkg13title: '라응우 자연 & 문화 당일 투어',
            pkg13meta: '1일 · 클래식 송태우 · Seasatun Travel',
            pkg13desc: '카오댕 전망대, 우라이통 동굴, 자연 탐방로, 현지 점심, 수산청 수족관.',
            pkg13price: '현재 요금 문의',
            pkg14title: '코리페 마운틴 리조트',
            pkg14meta: '2박 · 디럭스 가든룸',
            pkg14desc: '밴 이동, 스피드보트 환승, 조식, 스노클링 투어가 포함된 코리페의 수영장 리조트.',
            pkg14price: '฿3,450부터 / 2일 1박 (평일 요금)',
            pkgSelected: '패키지가 선택되었습니다 — 아래 양식을 작성해 주세요.'
        },
        pages: {
            home: {
                docTitle: 'Satun Scape · 태국 사툰주 방문 가이드',
                heroEyebrow: '태국 남부 · 안다만해 연안',
                heroLead: '섬, 정글 폭포, 동굴, 신선한 해산물—그리고 좀 더 조용한 태국의 모습. 쉬운 영어와 실용적인 여행 팁을 원하는 여행자를 위해 만들었습니다.',
                infoSatun: '사툰 여행 계획하기',
                generalTitle: '주에 대하여',
                generalDesc: '사툰은 안다만해를 따라 있는 태국 남서부의 주로, 말레이시아의 페를리스와 랑카위와 인접해 있습니다. 말레이-태국 문화, 석회암 섬을 만날 수 있으며 푸켓이나 끄라비보다 인파가 적습니다.',
                introTitle: '놓치지 마세요',
                att1: '군도 크루즈, 스노클링, 정글 트레일—성수기에는 미리 예약하세요.',
                att2: '식민지 시대 저택과 주립 박물관—시내에서 쉽게 들를 수 있습니다.',
                att3: '태국에서 가장 큰 동굴 시스템 중 하나—미끄럼 방지 신발을 준비하세요.',
                att4: '석회암 계단식 지형과 웅덩이—전형적인 내륙 자연 나들이.',
                cuisineTitle: '여행자들이 사랑하는 음식',
                cuisineDesc: '태국 남부의 맛은 강렬하며 할랄 식당이 널리 퍼져 있습니다. 구운 생선, 오징어, 게, 길거리 로띠, 아이스 커피를 맛보세요.',
                tipsTitle: '빠른 팁',
                tip1: '날씨: 11월–4월이 보트 이용에 가장 건조하며, 7월–10월은 페리 운항에 지장을 줄 수 있습니다.',
                tip2: '이동수단: 송태우, 택시, 그랩(이용 가능한 경우), 렌터카—또는 유효 면허증과 필요시 국제운전면허증이 있을 때만 스쿠터.',
                tip3: '에티켓: 신성한 장소에서는 어깨와 무릎을 가리고, 표시된 곳에서는 신발을 벗으며, 많은 공원에서 드론은 허가가 필요합니다.',
                official: '<strong><i class="fas fa-globe"></i> 주 정보:</strong> <a href="https://www.satun.go.th/frontpage" target="_blank" rel="noopener noreferrer">satun.go.th</a>',
                hotHead: '주요 명소',
                hotSub: '지역 이름은 지도에서 위치를 찾는 데 도움이 됩니다.',
                videoTitle: '하늘에서 본 사툰',
                videoDesc: '기본적으로 음소거되어 있으며, 플레이어에서 소리를 켤 수 있습니다.',
                cafesHead: '커피와 할랄 친화적인 먹거리',
                cafesSub: '현지인이 좋아하는 곳—전체 목록은 먹거리 페이지에 있습니다.',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            attractions: {
                docTitle: '관광명소 · Satun Scape',
                heroEyebrow: '태국 · 사툰주',
                heroTitle: '관광명소 카테고리 선택',
                pageIntro: '관광명소 둘러보기',
                culturalBtn: '문화 관광명소',
                naturalBtn: '자연 관광명소',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            accommodation: {
                docTitle: '숙소 · Satun Scape',
                heroEyebrow: '호텔 & 게스트하우스',
                heroTitle: '숙소 찾기',
                pageIntro: '숙소 둘러보기',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            cafes: {
                docTitle: '먹거리 · Satun Scape',
                heroEyebrow: '카페 & 레스토랑',
                heroTitle: '카페 & 레스토랑',
                pageIntro: '카페와 레스토랑 둘러보기',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            market: {
                docTitle: '시장 · Satun Scape',
                heroEyebrow: '현지 시장',
                heroTitle: '시장',
                pageIntro: '시장 둘러보기',
                sectionMarket: '시장 정보',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            contact: {
                docTitle: '문의하기 · Satun Scape',
                heroEyebrow: '기꺼이 도와드리겠습니다',
                heroTitle: '문의하기',
                contactTitle: '여러분의 이야기를 듣고 싶습니다',
                contactInfoHeading: '연락처 정보',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            booking: {
                docTitle: '예약 · Satun Scape',
                heroEyebrow: '여행 계획하기',
                heroTitle: '투어 & 여행 예약',
                heroLead: '섬 투어 예약, 렌터카, 보트 이동 예약, 또는 호텔 숙박을 요청하세요. 1–2 영업일 이내에 이메일로 확인해 드립니다.',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            cultural: {
                docTitle: '문화 관광명소 · Satun Scape',
                heroEyebrow: '유산 & 박물관',
                heroTitle: '문화 관광명소',
                pageIntro: '문화 관광명소 둘러보기',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            natural: {
                docTitle: '자연 관광명소 · Satun Scape',
                heroEyebrow: '섬 · 정글 · 동굴',
                heroTitle: '자연 관광명소',
                pageIntro: '자연 관광명소 둘러보기',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            }
        }
    },
    ja: {
        skip: 'コンテンツへスキップ',
        nav: {
            home: 'ホーム',
            attractions: '観光スポット',
            stay: '宿泊',
            book: '予約',
            eat: '飲食店',
            markets: '市場',
            contact: 'お問い合わせ'
        },
        visitor: [
            '<i class="fas fa-clock" aria-hidden="true"></i> <strong>時間:</strong> タイ (ICT · GMT+7)',
            '<i class="fas fa-coins" aria-hidden="true"></i> <strong>通貨:</strong> タイバーツ (THB)',
            '<i class="fas fa-plane" aria-hidden="true"></i> <strong>近隣:</strong> ハジャイ空港 · ランカウイ / マレーシア',
            '<i class="fas fa-water" aria-hidden="true"></i> <strong>シーズン:</strong> 11月〜4月が海とトレッキングに最適'
        ],
        footer: {
            note: 'お問い合わせ',
            tourism: 'タイ国政府観光庁'
        },
        contactForm: {
            name: 'お名前',
            email: 'メールアドレス',
            message: 'メッセージ',
            send: 'メッセージを送信',
            thanks: 'メッセージをありがとうございます！',
            error: 'メッセージの送信中にエラーが発生しました。'
        },
        bookingForm: {
            thanks: '予約リクエストを受け付けました！',
            thanksRef: '参照番号:',
            emailSentNote: 'メールでツアーチームに送信されました。',
            emailPendingNote: '保存されました — メールの送信に失敗しました。可能であれば追ってご連絡します。',
            sentTo: '直接送信先',
            continueNote: '空き状況、料金、お支払いの確認のため、先方から直接ご連絡いたします。ご自身から連絡していただいても構いません — Satun Scapeでは支払いや確認は行っておりません。',
            screenshotNote: 'この確認画面のスクリーンショットを記録として保存してください。',
            error: 'サーバーに接続できませんでした。リクエストはローカルに保存されました。',
            validation: '必須項目をすべて入力してください。',
            notice: 'リクエストは確定するまで拘束力を持ちません。繁忙期（11月〜4月）はボートや公園許可証を早めに予約してください。',
            tabTour: 'ツアー',
            tabCar: 'レンタカー',
            tabBoat: 'ボート',
            tabStay: '宿泊',
            legendContact: 'お客様情報',
            recentHeading: '最近のリクエスト',
            titleTour: 'ツアーを予約',
            descTour: 'タルタオ、洞窟、滝、街の史跡巡りなど、日帰りおよび複数日のパッケージ。',
            titleCar: '車をレンタル',
            descCar: 'セルフドライブまたはドライバー付き。有効な免許証とパスポートが必要です。海外免許証には国際免許証の携帯をお勧めします。',
            titleBoat: 'ボートを予約',
            descBoat: 'タルタオ、コリペ、島巡りへのフェリーおよびスピードボート航路。スケジュールは季節や海況により変動します。',
            titleStay: '宿泊を予約',
            descStay: 'サトゥン市内、ラーングー、パクバラ近郊のホテルやゲストハウス。写真と地図は宿泊ページをご覧ください。',
            labelPackage: 'ツアーパッケージ',
            labelDate: '希望日',
            labelAdults: '大人',
            labelChildren: '子供',
            labelPickup: '送迎エリア',
            labelName: '氏名',
            labelEmail: 'メールアドレス',
            labelPhone: '電話 / WhatsApp',
            labelNationality: '国籍',
            labelNotes: '特別なご要望',
            submitTour: 'ツアー予約をリクエスト',
            labelVehicle: '車両',
            labelDriver: 'ドライバー',
            labelPickupDate: 'ピックアップ日',
            labelPickupTime: 'ピックアップ時間',
            labelReturnDate: '返却日',
            labelLocation: 'ピックアップ / ドロップオフ場所',
            submitCar: 'レンタカーをリクエスト',
            labelRoute: 'ルート',
            labelPassengers: '人数',
            labelReturnTrip: '往復',
            labelReturnDateBoat: '帰りの日付',
            labelLuggage: '荷物 / 備考',
            submitBoat: 'ボート予約をリクエスト',
            labelProperty: '施設',
            labelRooms: '部屋数',
            labelCheckin: 'チェックイン',
            labelCheckout: 'チェックアウト',
            labelGuests: '宿泊人数',
            labelRoomPrefs: '部屋のご希望',
            submitStay: '宿泊予約をリクエスト',
            ctaTitle: 'ご予約の準備はできましたか？',
            ctaDesc: 'ツアー、車、ボート、ホテルを一か所で予約できます。',
            ctaBtn: '予約ページを開く',
            pkgHeading: 'おすすめパッケージ',
            pkgSub: '人気の旅程 — パッケージをタップして詳細を確認し、下部から予約してください。',
            pkgViewBtn: '詳細を見る',
            pkgModalBook: 'このパッケージを予約',
            pkgModalClose: '閉じる',
            modalDuration: '期間',
            modalGroup: 'グループ人数',
            modalItinerary: '旅程',
            modalIncludes: '含まれるもの',
            modalExcludes: '含まれないもの',
            modalBring: '持ち物',
            modalNotes: '知っておくべきこと',
            badgeTour: 'ツアー',
            badgeBoat: 'ボート',
            badgeCar: 'レンタカー',
            badgeStay: '宿泊',
            pkg7title: 'コ・ブローン シュノーケリング日帰りツアー',
            pkg7meta: '1日 · パクバラ桟橋 · Taweesub Speedboat',
            pkg7desc: 'コ・ブローン マイパイとヒンカオでの2か所のシュノーケリング、カヤックとSUP無料、昼食とフルーツ付き。',
            pkg7price: '฿1,760（タイ人）· ฿1,860（外国人）',
            pkg8title: 'コ・ブローン島 2日1泊',
            pkg8meta: '2日1泊 · Seasatun Travel',
            pkg8desc: 'マイパイとブローン・レーでのシュノーケリング、カヤック、ビーチでの夕食を楽しみながらコ・ブローンに宿泊。',
            pkg8price: '現在の料金はお問い合わせください',
            pkg9title: 'コ・ブローン島 3日2泊',
            pkg9meta: '3日2泊 · Seasatun Travel',
            pkg9desc: 'カヤックや島の自然歩道を楽しめる自由な一日を含む、よりゆったりとした島滞在。',
            pkg9price: '現在の料金はお問い合わせください',
            pkg10title: 'コ・リペ アイランドホップ 2日1泊',
            pkg10meta: '2日1泊 · Seasatun Travel',
            pkg10desc: 'コ・ラウィ、コ・ヒンガム、ジャバン海峡、コ・アダン周辺での日帰りロングテールボートシュノーケリング。',
            pkg10price: '現在の料金はお問い合わせください',
            pkg11title: 'コ・リペ アイランドホップ 3日2泊',
            pkg11meta: '3日2泊 · Seasatun Travel',
            pkg11desc: 'コ・アダン、コ・ラウィ、コ・ヒンガム、コ・ヤン、ジャバン海峡を巡る終日シュノーケリング、帰りの時間は柔軟に選べます。',
            pkg11price: '現在の料金はお問い合わせください',
            pkg12title: 'コ・リペ アイランドホップ 4日3泊',
            pkg12meta: '4日3泊 · Seasatun Travel',
            pkg12desc: '外島でのシュノーケリングに加え、コ・アダンのパチャド展望台へ登る自由日を含む、より長いリペ滞在。',
            pkg12price: '現在の料金はお問い合わせください',
            pkg13title: 'ラーングー 自然・文化日帰りツアー',
            pkg13meta: '1日 · クラシックソンテウ · Seasatun Travel',
            pkg13desc: 'カオデーン展望台、ウライトン洞窟、自然歩道、地元の昼食、水産局の水族館。',
            pkg13price: '現在の料金はお問い合わせください',
            pkg14title: 'コ・リペ マウンテンリゾート',
            pkg14meta: '2泊 · デラックスガーデンルーム',
            pkg14desc: 'コ・リペにあるプール付きリゾート。バン送迎、スピードボート、朝食、シュノーケリングツアー付き。',
            pkg14price: '฿3,450〜 / 2日1泊（平日料金）',
            pkgSelected: 'パッケージが選択されました — 以下のフォームにご記入ください。'
        },
        pages: {
            home: {
                docTitle: 'Satun Scape · タイ・サトゥン県を訪れる',
                heroEyebrow: 'タイ南部 · アンダマン海沿岸',
                heroLead: '島々、ジャングルの滝、洞窟、新鮮なシーフード—そしてタイの静かな一面。分かりやすい英語と実用的な旅のヒントを好む旅行者のために。',
                infoSatun: 'サトゥン訪問を計画する',
                generalTitle: '県について',
                generalDesc: 'サトゥンはアンダマン海沿いに位置するタイ南西部の県で、マレーシアのプルリス州やランカウイと隣接しています。マレー・タイ文化、石灰岩の島々—そしてプーケットやクラビより少ない人混みが特徴です。',
                introTitle: 'お見逃しなく',
                att1: '諸島クルーズ、シュノーケリング、ジャングルトレイル—繁忙期は早めのご予約を。',
                att2: '植民地時代の邸宅と県立博物館—街中で気軽に立ち寄れます。',
                att3: 'タイ最大級の洞窟群の一つ—滑りにくい靴をご持参ください。',
                att4: '石灰岩の段丘とプール—定番の内陸自然散策。',
                cuisineTitle: '旅行者に人気の食事',
                cuisineDesc: '南タイの味は力強く、ハラル対応の店も多くあります。焼き魚、イカ、カニ、屋台のロティ、アイスコーヒーをお試しください。',
                tipsTitle: 'クイックヒント',
                tip1: '天候: 11月〜4月がボートに最も適した乾季、7月〜10月はフェリーに影響が出ることがあります。',
                tip2: '移動手段: ソンテウ、タクシー、Grab（利用可能な場合）、レンタカー—バイクは有効な免許証と必要に応じて国際免許証がある場合のみ。',
                tip3: 'マナー: 聖地では肩と膝を覆い、案内がある場所では靴を脱ぎ、多くの公園でドローンには許可が必要です。',
                official: '<strong><i class="fas fa-globe"></i> 県の情報:</strong> <a href="https://www.satun.go.th/frontpage" target="_blank" rel="noopener noreferrer">satun.go.th</a>',
                hotHead: '注目のスポット',
                hotSub: '地区名は地図上での位置特定に役立ちます。',
                videoTitle: '空から見るサトゥン',
                videoDesc: 'デフォルトでミュートになっています—プレーヤーで音声をオンにできます。',
                cafesHead: 'コーヒーとハラル対応の軽食',
                cafesSub: '地元の人気店—完全なリストはグルメページをご覧ください。',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            attractions: {
                docTitle: '観光スポット · Satun Scape',
                heroEyebrow: 'タイ · サトゥン県',
                heroTitle: '観光スポットのカテゴリーを選択',
                pageIntro: '観光スポットを探す',
                culturalBtn: '文化的観光スポット',
                naturalBtn: '自然観光スポット',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            accommodation: {
                docTitle: '宿泊 · Satun Scape',
                heroEyebrow: 'ホテル & ゲストハウス',
                heroTitle: '宿泊先を探す',
                pageIntro: '宿泊先を探す',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            cafes: {
                docTitle: '飲食店 · Satun Scape',
                heroEyebrow: 'カフェ & レストラン',
                heroTitle: 'カフェ & レストラン',
                pageIntro: 'カフェとレストランを探す',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            market: {
                docTitle: '市場 · Satun Scape',
                heroEyebrow: '地元の市場',
                heroTitle: '市場',
                pageIntro: '市場を探す',
                sectionMarket: '市場情報',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            contact: {
                docTitle: 'お問い合わせ · Satun Scape',
                heroEyebrow: 'お気軽にお問い合わせください',
                heroTitle: 'お問い合わせ',
                contactTitle: 'ご意見・ご質問をお待ちしております',
                contactInfoHeading: '連絡先情報',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            booking: {
                docTitle: '予約 · Satun Scape',
                heroEyebrow: '旅行を計画する',
                heroTitle: 'ツアー・旅行を予約',
                heroLead: '島ツアーの予約、レンタカー、ボート送迎の予約、またはホテル宿泊のリクエストができます。1〜2営業日以内にメールでご確認いたします。',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            cultural: {
                docTitle: '文化的観光スポット · Satun Scape',
                heroEyebrow: '遺産 & 博物館',
                heroTitle: '文化的観光スポット',
                pageIntro: '文化的観光スポットを探す',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
            },
            natural: {
                docTitle: '自然観光スポット · Satun Scape',
                heroEyebrow: '島 · ジャングル · 洞窟',
                heroTitle: '自然観光スポット',
                pageIntro: '自然観光スポットを探す',
                footerMain: '© 2026 Satun Scape · unofficial visitor guide · not a government site'
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
    setText('label-tour-nationality', B.labelNationality);
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
    setText('label-boat-nationality', B.labelNationality);
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
    setText('label-stay-nationality', B.labelNationality);
    setText('label-stay-notes', B.labelRoomPrefs);
    setText('btn-submit-stay', B.submitStay);
    setText('pkg-heading', B.pkgHeading);
    setText('pkg-sub', B.pkgSub);
    var pi;
    for (pi = 1; pi <= 14; pi++) {
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
    setText('pkg-7-badge', B.badgeTour);
    setText('pkg-8-badge', B.badgeTour);
    setText('pkg-9-badge', B.badgeTour);
    setText('pkg-10-badge', B.badgeTour);
    setText('pkg-11-badge', B.badgeTour);
    setText('pkg-12-badge', B.badgeTour);
    setText('pkg-13-badge', B.badgeTour);
    setText('pkg-14-badge', B.badgeStay);
}

function setLanguage(lang) {
    if (!I18N[lang]) lang = 'en';
    localStorage.setItem('language', lang);
    var htmlLangMap = { zh: 'zh-Hans', th: 'th', tl: 'tl', ms: 'ms', ar: 'ar', es: 'es', ko: 'ko', ja: 'ja', en: 'en' };
    document.documentElement.lang = htmlLangMap[lang] || 'en';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('is-rtl', lang === 'ar');

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
        if (active) {
            var shortLabel = btn.getAttribute('data-lang-short') || lang.toUpperCase();
            document.querySelectorAll('.lang-switch-current').forEach(function(el) {
                el.textContent = shortLabel;
            });
        }
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
            // the button may live inside a .lang-switch-menu that has been
            // relocated to <body> (see below), so it can no longer find its
            // switch via closest('.lang-switch') — look it up by the id
            // pairing instead. Buttons inside the mobile drawer (not part
            // of a relocated dropdown) still resolve via closest() directly.
            var switchEl = btn.closest('.lang-switch');
            if (!switchEl) {
                var parentMenu = btn.closest('.lang-switch-menu[data-menu-for]');
                if (parentMenu) {
                    var uid = parentMenu.getAttribute('data-menu-for');
                    switchEl = document.querySelector('.lang-switch[data-switch-id="' + uid + '"]');
                }
            }
            if (switchEl) closeLangSwitch(switchEl);
        });
    });

    function closeLangSwitch(switchEl) {
        var uid = switchEl.getAttribute('data-switch-id');
        var menu = uid ? document.querySelector('.lang-switch-menu[data-menu-for="' + uid + '"]') : switchEl.querySelector('.lang-switch-menu');
        var toggle = switchEl.querySelector('.lang-switch-toggle');
        if (menu && !menu.hidden) {
            menu.classList.remove('is-open');
            window.setTimeout(function () { menu.hidden = true; }, 160);
        }
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        switchEl.classList.remove('is-open');
    }

    // Move each language dropdown menu to a direct child of <body>. Even
    // though the menu already uses position:fixed, a fixed-position element
    // still participates in the STACKING CONTEXT of its DOM ancestors (this
    // is separate from its layout/containing-block behaviour). Since the
    // menu lives inside .site-nav (which establishes its own stacking
    // context via position+z-index), its z-index was only ever being
    // compared against other children of .site-nav — not against later
    // siblings like .hero-home, which could end up painted on top and
    // silently swallow every click. Moving the menu to <body> guarantees
    // it stacks at the root level, above everything on the page.
    var langSwitchSeq = 0;
    document.querySelectorAll('.lang-switch').forEach(function(switchEl) {
        var menu = switchEl.querySelector('.lang-switch-menu');
        if (!menu) return;
        langSwitchSeq += 1;
        var uid = 'lang-switch-' + langSwitchSeq;
        switchEl.setAttribute('data-switch-id', uid);
        menu.setAttribute('data-menu-for', uid);
        document.body.appendChild(menu);
    });

    function getMenuFor(switchEl) {
        var uid = switchEl.getAttribute('data-switch-id');
        return document.querySelector('.lang-switch-menu[data-menu-for="' + uid + '"]');
    }

    document.querySelectorAll('.lang-switch-toggle').forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            var switchEl = toggle.closest('.lang-switch');
            var menu = getMenuFor(switchEl);
            if (!menu) return;
            var isOpen = !menu.hidden;
            // close any other open language menus first
            document.querySelectorAll('.lang-switch.is-open').forEach(function(other) {
                if (other !== switchEl) closeLangSwitch(other);
            });
            if (isOpen) {
                closeLangSwitch(switchEl);
                return;
            }
            // position:fixed menu — compute viewport coordinates from the
            // toggle button so it renders correctly regardless of any
            // ancestor's overflow:hidden (e.g. the hero header banner).
            var rect = toggle.getBoundingClientRect();
            var menuWidth = 170;
            var left = Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 10);
            left = Math.max(left, 10);
            menu.style.top = (rect.bottom + 8) + 'px';
            menu.style.left = left + 'px';
            menu.hidden = false;
            // trigger the CSS transition on the next frame, after the
            // browser has applied display:flex from removing [hidden]
            window.requestAnimationFrame(function () {
                menu.classList.add('is-open');
            });
            toggle.setAttribute('aria-expanded', 'true');
            switchEl.classList.add('is-open');
        });
    });

    document.addEventListener('click', function(e) {
        document.querySelectorAll('.lang-switch.is-open').forEach(function(switchEl) {
            var menu = getMenuFor(switchEl);
            var inSwitch = switchEl.contains(e.target);
            var inMenu = menu && menu.contains(e.target);
            if (!inSwitch && !inMenu) closeLangSwitch(switchEl);
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.lang-switch.is-open').forEach(closeLangSwitch);
        }
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
    var messageEl = $('contact-form-message');
    var submitBtn = $('btn-send-message');

    formStandard.addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(formStandard);
        var originalBtnText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) submitBtn.disabled = true;
        if (messageEl) messageEl.classList.remove('is-visible', 'is-error', 'is-success');
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
                if (messageEl) {
                    messageEl.textContent = CF.thanks;
                    messageEl.classList.add('is-visible', 'is-success');
                } else {
                    alert(CF.thanks);
                }
                formStandard.reset();
            })
            .catch(function(err) {
                console.error(err);
                if (messageEl) {
                    messageEl.textContent = CF.error;
                    messageEl.classList.add('is-visible', 'is-error');
                } else {
                    alert(CF.error);
                }
            })
            .finally(function() {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
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
