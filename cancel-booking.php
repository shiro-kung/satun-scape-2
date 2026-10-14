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

$user = satunscape_require_login();

$reference = trim($_POST['reference'] ?? '');
if ($reference === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing booking reference.']);
    exit;
}

// $requireUserId ties this to the logged-in visitor's own bookings only —
// there is no way to cancel someone else's booking from this endpoint.
$updated = satunscape_update_booking_status($reference, $user['id'], 'cancelled');

if (!$updated) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Booking not found.']);
    exit;
}

echo json_encode(['success' => true]);
