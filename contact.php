<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/includes/mail.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

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

$emailConfig = satunscape_load_email_config();
$emailSent = satunscape_send_contact_email($name, $email, $message, $emailConfig);

if (!$emailSent) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Could not send email. Please check server mail settings or contact us by phone.',
        'emailSent' => false,
    ]);
    exit;
}

echo json_encode(['success' => true, 'emailSent' => true]);
