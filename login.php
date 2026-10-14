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

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (trim($email) === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please enter your email and password.']);
    exit;
}

// Two buckets: one per IP (stops a script hammering many emails from one
// place) and one per email (stops repeated guesses against a single
// account even from different IPs). Wrong-password attempts still count
// even though the error message below stays generic either way.
$ipKey = 'login-ip:' . satunscape_client_ip();
$emailKey = 'login-email:' . satunscape_normalize_email($email);
if (!satunscape_rate_limit_ok($ipKey, 20, 600) || !satunscape_rate_limit_ok($emailKey, 8, 600)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many login attempts. Please wait a few minutes and try again.']);
    exit;
}

$result = satunscape_verify_login($email, $password);

if (!$result['success']) {
    http_response_code(401);
    echo json_encode($result);
    exit;
}

satunscape_log_in_user($result['user']);

echo json_encode([
    'success' => true,
    'user' => $result['user'],
    'csrf_token' => satunscape_csrf_token(),
]);
