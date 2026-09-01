<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/includes/mail.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$type = isset($_POST['type']) ? preg_replace('/[^a-z]/', '', $_POST['type']) : '';
$allowed = ['tour', 'car', 'boat', 'stay'];

if (!in_array($type, $allowed, true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid booking type']);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');

if ($name === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name and valid email are required']);
    exit;
}

$reference = 'BK-' . date('Ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));

$details = $_POST;
unset($details['type'], $details['lang']);

$booking = [
    'reference' => $reference,
    'type' => $type,
    'lang' => $_POST['lang'] ?? 'en',
    'submitted_at' => date('c'),
    'contact' => [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
    ],
    'details' => $details,
];

$dataDir = __DIR__ . '/data';
$file = $dataDir . '/bookings.json';

if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$existing = [];
if (is_file($file)) {
    $raw = file_get_contents($file);
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $existing = $decoded;
    }
}

$existing[] = $booking;
file_put_contents($file, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

$emailConfig = satunscape_load_email_config();
$emailSent = satunscape_send_booking_email($booking, $emailConfig);

echo json_encode([
    'success' => true,
    'reference' => $reference,
    'emailSent' => $emailSent,
]);
