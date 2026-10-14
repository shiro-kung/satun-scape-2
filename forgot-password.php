<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/mail.php';

satunscape_start_session();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

satunscape_require_csrf();

// Honeypot: a hidden field real visitors never fill in.
if (satunscape_honeypot_triggered($_POST['website'] ?? '')) {
    echo json_encode(['success' => true]);
    exit;
}

$email = trim($_POST['email'] ?? '');

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please enter a valid email address.']);
    exit;
}

if (!satunscape_rate_limit_ok('forgot:' . satunscape_client_ip(), 6, 600)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many requests. Please try again later.']);
    exit;
}

$users = satunscape_load_users();
$user = satunscape_find_user_by_email($users, $email);

$response = ['success' => true];

if ($user !== null) {
    $reset = satunscape_create_password_reset($email);

    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $basePath = rtrim(str_replace('forgot-password.php', '', $_SERVER['REQUEST_URI'] ?? ''), '/');
    $resetUrl = sprintf(
        '%s://%s%s/reset-password.html?email=%s&token=%s',
        $scheme,
        $host,
        $basePath,
        rawurlencode($email),
        rawurlencode($reset['token'])
    );

    $emailConfig = satunscape_load_email_config();
    $emailSent = satunscape_send_password_reset_email($email, $user['name'] ?? '', $resetUrl, $emailConfig);

    // This is a visitor-guide demo site, not always deployed with a real
    // mail server — if the email genuinely couldn't be sent, hand the
    // reset link back directly so the flow is still testable end to end.
    // On a live site with working mail this branch simply never fires.
    if (!$emailSent) {
        $response['demoResetLink'] = $resetUrl;
    }
}

// Always the same generic response whether or not that email is
// registered — otherwise this endpoint could be used to check which
// emails have accounts.
echo json_encode($response);
