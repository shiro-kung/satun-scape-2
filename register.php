<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/includes/auth.php';

satunscape_start_session();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

satunscape_require_csrf();

// Honeypot: a hidden field real visitors never fill in.
if (satunscape_honeypot_triggered($_POST['website'] ?? '')) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Could not create your account.']);
    exit;
}

if (!satunscape_rate_limit_ok('register:' . satunscape_client_ip(), 6, 600)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many accounts created from this device. Please try again later.']);
    exit;
}

$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirm_password'] ?? '';
$phone = $_POST['phone'] ?? '';
$nationality = $_POST['nationality'] ?? '';

$result = satunscape_register_user($name, $email, $password, $confirmPassword, $phone, $nationality);

if (!$result['success']) {
    http_response_code(400);
    echo json_encode($result);
    exit;
}

satunscape_log_in_user($result['user']);

echo json_encode([
    'success' => true,
    'user' => $result['user'],
    'csrf_token' => satunscape_csrf_token(),
]);
