<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/includes/mail.php';
require_once __DIR__ . '/includes/auth.php';

satunscape_start_session();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

satunscape_require_csrf();

// Honeypot: a hidden field real visitors never fill in. If a bot filled it,
// pretend everything worked — never store or send it, and never hint to
// the bot what gave it away.
if (satunscape_honeypot_triggered($_POST['website'] ?? '')) {
    echo json_encode([
        'success' => true,
        'reference' => 'BK-' . date('Ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6)),
        'emailSent' => true,
        'operator' => null,
    ]);
    exit;
}

if (!satunscape_rate_limit_ok('booking:' . satunscape_client_ip(), 10, 600)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many requests from this device. Please try again in a few minutes.']);
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
unset($details['type'], $details['lang'], $details['website'], $details['csrf_token']);

// If the visitor is logged in, tie this booking to their account so it
// shows up under "My bookings" — bookings from guests stay anonymous.
$currentUser = satunscape_current_user();

$booking = [
    'reference' => $reference,
    'type' => $type,
    'lang' => $_POST['lang'] ?? 'en',
    'submitted_at' => date('c'),
    'status' => 'pending',
    'user_id' => $currentUser['id'] ?? null,
    'contact' => [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
    ],
    'details' => $details,
];

satunscape_with_file_locked(satunscape_bookings_file(), function (array $bookings) use ($booking) {
    $bookings[] = $booking;
    return $bookings;
});

$emailConfig = satunscape_load_email_config();
$emailSent = satunscape_send_booking_email($booking, $emailConfig);
$operator = satunscape_resolve_operator($type, $details);

echo json_encode([
    'success' => true,
    'reference' => $reference,
    'emailSent' => $emailSent,
    'operator' => $operator,
]);
