<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/includes/auth.php';

satunscape_start_session();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$user = satunscape_require_login();

$file = satunscape_bookings_file();
$bookings = [];

if (is_file($file)) {
    $raw = file_get_contents($file);
    $decoded = json_decode(satunscape_strip_guard($raw), true);
    if (is_array($decoded)) {
        foreach ($decoded as $booking) {
            if (($booking['user_id'] ?? null) === $user['id']) {
                // Never expose other guests' contact details, even
                // though this record belongs to the current user.
                $bookings[] = [
                    'reference' => $booking['reference'] ?? '',
                    'type' => $booking['type'] ?? '',
                    'submitted_at' => $booking['submitted_at'] ?? '',
                    'status' => $booking['status'] ?? 'pending',
                    'details' => $booking['details'] ?? new stdClass(),
                ];
            }
        }
    }
}

// Most recent first
usort($bookings, function ($a, $b) {
    return strcmp($b['submitted_at'], $a['submitted_at']);
});

echo json_encode(['success' => true, 'bookings' => $bookings]);
