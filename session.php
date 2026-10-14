<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/includes/auth.php';

satunscape_start_session();

$user = satunscape_current_user();

echo json_encode([
    'loggedIn' => $user !== null,
    'user' => $user,
    'csrf_token' => satunscape_csrf_token(),
]);
