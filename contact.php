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
    echo json_encode(['success' => true, 'emailSent' => true]);
    exit;
}

if (!satunscape_rate_limit_ok('contact:' . satunscape_client_ip(), 5, 600)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many messages sent from this device. Please try again in a few minutes.']);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');
$topic = trim($_POST['topic'] ?? 'general');

if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'All fields are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit;
}

// Always keep a copy in data/messages.php first. The site's own inbox may
// not have real mail configured (a fresh setup, a local demo) — a message
// that failed to email should still show up for the site owner, not vanish.
satunscape_save_message([
    'id' => 'MSG-' . date('Ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6)),
    'name' => $name,
    'email' => $email,
    'topic' => $topic,
    'message' => $message,
    'submitted_at' => date('c'),
    'status' => 'new',
]);

$emailConfig = satunscape_load_email_config();
$emailSent = satunscape_send_contact_email($name, $email, $message, $emailConfig, $topic);

// The message is saved either way, so this is never a hard failure —
// emailSent just tells the front end whether to also mention email.
echo json_encode(['success' => true, 'emailSent' => $emailSent]);
