<?php

function satunscape_load_email_config(): array
{
    $paths = [
        __DIR__ . '/../config/email.config.php',
        __DIR__ . '/../config/email.config.example.php',
    ];

    foreach ($paths as $path) {
        if (is_file($path)) {
            $config = require $path;
            if (is_array($config)) {
                return $config;
            }
        }
    }

    return [
        'company_email' => '',
        'company_email_cc' => '',
        'company_name' => 'Satun Scape',
        'from_email' => 'noreply@localhost',
        'from_name' => 'Satun Scape Website',
        'send_customer_confirmation' => false,
    ];
}

function satunscape_sanitize_header(string $value): string
{
    return str_replace(["\r", "\n"], '', trim($value));
}

function satunscape_send_mail(
    string $to,
    string $subject,
    string $body,
    array $config,
    ?string $replyToEmail = null,
    ?string $replyToName = null,
    ?string $cc = null
): bool {
    $to = satunscape_sanitize_header($to);
    if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $fromEmail = satunscape_sanitize_header($config['from_email'] ?? 'noreply@localhost');
    $fromName = satunscape_sanitize_header($config['from_name'] ?? 'Satun Scape');
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'From: ' . sprintf('%s <%s>', $fromName, $fromEmail),
        'X-Mailer: SatunScape-PHP',
    ];

    if ($replyToEmail && filter_var($replyToEmail, FILTER_VALIDATE_EMAIL)) {
        $replyName = $replyToName ? satunscape_sanitize_header($replyToName) : '';
        $headers[] = $replyName !== ''
            ? 'Reply-To: ' . sprintf('%s <%s>', $replyName, satunscape_sanitize_header($replyToEmail))
            : 'Reply-To: ' . satunscape_sanitize_header($replyToEmail);
    }

    if ($cc && filter_var($cc, FILTER_VALIDATE_EMAIL)) {
        $headers[] = 'Cc: ' . satunscape_sanitize_header($cc);
    }

    return mail($to, $encodedSubject, $body, implode("\r\n", $headers));
}

function satunscape_booking_type_label(string $type): string
{
    $map = [
        'tour' => 'Tour / ทัวร์',
        'car' => 'Car hire / เช่ารถ',
        'boat' => 'Boat / เรือ',
        'stay' => 'Accommodation / ที่พัก',
    ];
    return $map[$type] ?? $type;
}

function satunscape_format_booking_details(string $type, array $details): string
{
    $labels = [
        'tour' => [
            'package' => 'Tour package',
            'date' => 'Preferred date',
            'adults' => 'Adults',
            'children' => 'Children',
            'pickup' => 'Pickup area',
            'notes' => 'Special requests',
        ],
        'car' => [
            'vehicle' => 'Vehicle',
            'driver' => 'Driver option',
            'pickup_date' => 'Pickup date',
            'pickup_time' => 'Pickup time',
            'return_date' => 'Return date',
            'location' => 'Pickup / drop-off',
            'notes' => 'Notes',
        ],
        'boat' => [
            'route' => 'Route',
            'date' => 'Departure date',
            'passengers' => 'Passengers',
            'return_trip' => 'Return trip',
            'return_date' => 'Return date',
            'notes' => 'Luggage / notes',
        ],
        'stay' => [
            'property' => 'Property',
            'rooms' => 'Rooms',
            'checkin' => 'Check-in',
            'checkout' => 'Check-out',
            'guests' => 'Guests',
            'notes' => 'Room preferences',
        ],
    ];

    $skip = ['name', 'email', 'phone', 'type', 'lang'];
    $typeLabels = $labels[$type] ?? [];
    $lines = [];

    foreach ($details as $key => $value) {
        if (in_array($key, $skip, true)) {
            continue;
        }
        $value = is_string($value) ? trim($value) : $value;
        if ($value === '' || $value === null) {
            continue;
        }
        $label = $typeLabels[$key] ?? ucfirst(str_replace('_', ' ', $key));
        $lines[] = $label . ': ' . $value;
    }

    return implode("\n", $lines);
}

function satunscape_send_booking_email(array $booking, array $config): bool
{
    $companyEmail = trim($config['company_email'] ?? '');
    if ($companyEmail === '') {
        return false;
    }

    $reference = $booking['reference'];
    $type = $booking['type'];
    $contact = $booking['contact'];
    $details = $booking['details'];

    $subject = sprintf(
        '[Satun Scape] New booking %s — %s',
        $reference,
        satunscape_booking_type_label($type)
    );

    $body = "══════════════════════════════════════\n";
    $body .= "  NEW BOOKING REQUEST — SATUN SCAPE\n";
    $body .= "══════════════════════════════════════\n\n";
    $body .= "Reference / เลขอ้างอิง: {$reference}\n";
    $body .= "Type / ประเภท: " . satunscape_booking_type_label($type) . "\n";
    $body .= "Submitted / เวลาส่ง: " . ($booking['submitted_at'] ?? date('c')) . "\n";
    $body .= "Language / ภาษา: " . ($booking['lang'] ?? 'en') . "\n\n";
    $body .= "── Contact / ข้อมูลลูกค้า ──────────────────\n";
    $body .= "Name / ชื่อ: " . ($contact['name'] ?? '') . "\n";
    $body .= "Email: " . ($contact['email'] ?? '') . "\n";
    $body .= "Phone / โทร: " . ($contact['phone'] ?? '-') . "\n\n";
    $body .= "── Booking details / รายละเอียดจอง ─────\n";
    $body .= satunscape_format_booking_details($type, $details) . "\n\n";
    $body .= "──────────────────────────────────────\n";
    $body .= "Reply directly to the customer email above.\n";
    $body .= "Satun Scape — booking notification\n";

    $cc = trim($config['company_email_cc'] ?? '');
    $sent = satunscape_send_mail(
        $companyEmail,
        $subject,
        $body,
        $config,
        $contact['email'] ?? null,
        $contact['name'] ?? null,
        $cc !== '' ? $cc : null
    );

    if ($sent && !empty($config['send_customer_confirmation']) && !empty($contact['email'])) {
        satunscape_send_booking_confirmation_to_customer($booking, $config);
    }

    return $sent;
}

function satunscape_send_booking_confirmation_to_customer(array $booking, array $config): bool
{
    $contact = $booking['contact'];
    $reference = $booking['reference'];
    $typeLabel = satunscape_booking_type_label($booking['type']);
    $companyName = $config['company_name'] ?? 'Satun Scape Tours';

    $subject = "[{$reference}] We received your booking request — {$companyName}";
    $body = "Dear " . ($contact['name'] ?? 'Guest') . ",\n\n";
    $body .= "Thank you for your booking request with {$companyName}.\n\n";
    $body .= "Reference: {$reference}\n";
    $body .= "Type: {$typeLabel}\n\n";
    $body .= "Our team will review your request and contact you within 1–2 business days.\n";
    $body .= "This message is not a final confirmation until you hear from us.\n\n";
    $body .= "── Your request summary ──\n";
    $body .= satunscape_format_booking_details($booking['type'], $booking['details']) . "\n\n";
    $body .= "Best regards,\n{$companyName}\n";

    return satunscape_send_mail(
        $contact['email'],
        $subject,
        $body,
        $config,
        $config['company_email'] ?? null,
        $config['company_name'] ?? null
    );
}

function satunscape_send_contact_email(string $name, string $email, string $message, array $config): bool
{
    $companyEmail = trim($config['company_email'] ?? '');
    if ($companyEmail === '') {
        return false;
    }

    $subject = '[Satun Scape] Contact form message';
    $body = "══════════════════════════════════════\n";
    $body .= "  CONTACT FORM — SATUN SCAPE\n";
    $body .= "══════════════════════════════════════\n\n";
    $body .= "Name / ชื่อ: {$name}\n";
    $body .= "Email: {$email}\n\n";
    $body .= "Message / ข้อความ:\n";
    $body .= str_repeat('-', 40) . "\n";
    $body .= $message . "\n";
    $body .= str_repeat('-', 40) . "\n\n";
    $body .= "Submitted: " . date('Y-m-d H:i:s') . "\n";

    return satunscape_send_mail(
        $companyEmail,
        $subject,
        $body,
        $config,
        $email,
        $name
    );
}
