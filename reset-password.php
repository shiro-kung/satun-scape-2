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

$email = trim($_POST['email'] ?? '');
$token = trim($_POST['token'] ?? '');
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirm_password'] ?? '';

if ($email === '' || $token === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'This reset link is invalid or has expired. Please request a new one.']);
    exit;
}

$result = satunscape_reset_password($email, $token, $password, $confirmPassword);

if (!$result['success']) {
    http_response_code(400);
    echo json_encode($result);
    exit;
}

echo json_encode(['success' => true]);
