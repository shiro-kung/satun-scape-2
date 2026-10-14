<?php
require_once __DIR__ . '/../includes/admin_auth.php';

satunscape_require_admin();

$csrfToken = satunscape_csrf_token();
$notice = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $submittedToken = $_POST['csrf_token'] ?? '';
    if (!hash_equals($csrfToken, $submittedToken)) {
        $notice = 'Your session expired — please try that again.';
    } else {
        $action = $_POST['action'] ?? '';

        if ($action === 'update_booking_status') {
            $reference = trim($_POST['reference'] ?? '');
            $status = $_POST['status'] ?? '';
            if (in_array($status, ['pending', 'confirmed', 'cancelled'], true) && $reference !== '') {
                satunscape_update_booking_status($reference, null, $status);
                $notice = 'Booking ' . $reference . ' marked as ' . $status . '.';
            }
        } elseif ($action === 'update_message_status') {
            $id = trim($_POST['id'] ?? '');
            $status = $_POST['status'] ?? '';
            if (in_array($status, ['new', 'read'], true) && $id !== '') {
                satunscape_update_message_status($id, $status);
                $notice = 'Message ' . $id . ' marked as ' . $status . '.';
            }
        }
    }
}

$bookings = satunscape_load_json_file(satunscape_bookings_file());
$messages = satunscape_load_json_file(satunscape_messages_file());
$users = satunscape_load_users();

$usersById = [];
foreach ($users as $u) {
    $usersById[$u['id'] ?? ''] = $u;
}

// Most recent first
usort($bookings, function ($a, $b) { return strcmp($b['submitted_at'] ?? '', $a['submitted_at'] ?? ''); });
usort($messages, function ($a, $b) { return strcmp($b['submitted_at'] ?? '', $a['submitted_at'] ?? ''); });

$pendingCount = 0;
foreach ($bookings as $b) {
    if (($b['status'] ?? 'pending') === 'pending') {
        $pendingCount++;
    }
}
$newMessageCount = 0;
foreach ($messages as $m) {
    if (($m['status'] ?? 'new') === 'new') {
        $newMessageCount++;
    }
}

function h(?string $s): string
{
    return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8');
}

function statusBadgeClass(string $status): string
{
    $map = ['pending' => 'admin-badge-pending', 'confirmed' => 'admin-badge-confirmed', 'cancelled' => 'admin-badge-cancelled', 'new' => 'admin-badge-pending', 'read' => 'admin-badge-confirmed'];
    return $map[$status] ?? 'admin-badge-pending';
}
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Admin dashboard · Satun Scape</title>
    <link rel="icon" type="image/svg+xml" href="../favicon.svg">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/auth.css">
    <link rel="stylesheet" href="../css/admin.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700;800&family=Prompt:wght@300;400;500;600&display=swap">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
</head>
<body class="admin-body">
    <header class="admin-topbar">
        <div class="admin-topbar-brand"><img src="../favicon.svg" alt=""> Satun Scape — Admin</div>
        <nav class="admin-topbar-nav">
            <a href="#bookings-section"><i class="fas fa-suitcase" aria-hidden="true"></i> Bookings <?php if ($pendingCount > 0): ?><span class="admin-nav-count"><?php echo $pendingCount; ?></span><?php endif; ?></a>
            <a href="#messages-section"><i class="fas fa-envelope" aria-hidden="true"></i> Messages <?php if ($newMessageCount > 0): ?><span class="admin-nav-count"><?php echo $newMessageCount; ?></span><?php endif; ?></a>
            <a href="../index.html"><i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i> View site</a>
            <a href="logout.php"><i class="fas fa-sign-out-alt" aria-hidden="true"></i> Log out</a>
        </nav>
    </header>

    <main class="admin-main">
        <?php if ($notice !== ''): ?>
            <div class="admin-notice"><?php echo h($notice); ?></div>
        <?php endif; ?>

        <div class="admin-stat-row">
            <div class="admin-stat-card">
                <span class="admin-stat-number"><?php echo count($bookings); ?></span>
                <span class="admin-stat-label">Total bookings</span>
            </div>
            <div class="admin-stat-card">
                <span class="admin-stat-number"><?php echo $pendingCount; ?></span>
                <span class="admin-stat-label">Pending bookings</span>
            </div>
            <div class="admin-stat-card">
                <span class="admin-stat-number"><?php echo count($messages); ?></span>
                <span class="admin-stat-label">Total messages</span>
            </div>
            <div class="admin-stat-card">
                <span class="admin-stat-number"><?php echo $newMessageCount; ?></span>
                <span class="admin-stat-label">Unread messages</span>
            </div>
        </div>

        <section id="bookings-section" class="admin-section">
            <h2><i class="fas fa-suitcase" aria-hidden="true"></i> Bookings</h2>
            <?php if (empty($bookings)): ?>
                <p class="admin-empty">No bookings yet.</p>
            <?php else: ?>
            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Reference</th>
                            <th>Type</th>
                            <th>Submitted</th>
                            <th>Contact</th>
                            <th>Account</th>
                            <th>Details</th>
                            <th>Status</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($bookings as $b): ?>
                        <?php
                            $status = $b['status'] ?? 'pending';
                            $contact = $b['contact'] ?? [];
                            $details = $b['details'] ?? [];
                            $account = ($b['user_id'] ?? null) !== null ? ($usersById[$b['user_id']] ?? null) : null;
                            $submitted = !empty($b['submitted_at']) ? date('d M Y, H:i', strtotime($b['submitted_at'])) : '';
                        ?>
                        <tr>
                            <td><strong><?php echo h($b['reference'] ?? ''); ?></strong></td>
                            <td><?php echo h($b['type'] ?? ''); ?></td>
                            <td><?php echo h($submitted); ?></td>
                            <td>
                                <?php echo h($contact['name'] ?? ''); ?><br>
                                <span class="admin-muted"><?php echo h($contact['email'] ?? ''); ?></span><br>
                                <span class="admin-muted"><?php echo h($contact['phone'] ?? ''); ?></span>
                            </td>
                            <td><?php echo $account ? h($account['name'] ?? '') : '<span class="admin-muted">Guest</span>'; ?></td>
                            <td class="admin-details-cell">
                                <?php foreach ($details as $key => $value): ?>
                                    <?php if ($key === 'website' || $key === 'csrf_token' || $value === '' || $value === null) continue; ?>
                                    <div><span class="admin-muted"><?php echo h(str_replace('_', ' ', (string) $key)); ?>:</span> <?php echo h(is_scalar($value) ? (string) $value : json_encode($value)); ?></div>
                                <?php endforeach; ?>
                            </td>
                            <td><span class="admin-badge <?php echo statusBadgeClass($status); ?>"><?php echo h($status); ?></span></td>
                            <td>
                                <form method="post" class="admin-inline-form">
                                    <input type="hidden" name="action" value="update_booking_status">
                                    <input type="hidden" name="reference" value="<?php echo h($b['reference'] ?? ''); ?>">
                                    <input type="hidden" name="csrf_token" value="<?php echo h($csrfToken); ?>">
                                    <select name="status" onchange="this.form.submit()">
                                        <option value="pending" <?php echo $status === 'pending' ? 'selected' : ''; ?>>Pending</option>
                                        <option value="confirmed" <?php echo $status === 'confirmed' ? 'selected' : ''; ?>>Confirmed</option>
                                        <option value="cancelled" <?php echo $status === 'cancelled' ? 'selected' : ''; ?>>Cancelled</option>
                                    </select>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            <?php endif; ?>
        </section>

        <section id="messages-section" class="admin-section">
            <h2><i class="fas fa-envelope" aria-hidden="true"></i> Contact messages</h2>
            <?php if (empty($messages)): ?>
                <p class="admin-empty">No messages yet.</p>
            <?php else: ?>
            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Received</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Topic</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($messages as $m): ?>
                        <?php
                            $status = $m['status'] ?? 'new';
                            $received = !empty($m['submitted_at']) ? date('d M Y, H:i', strtotime($m['submitted_at'])) : '';
                        ?>
                        <tr>
                            <td><?php echo h($received); ?></td>
                            <td><?php echo h($m['name'] ?? ''); ?></td>
                            <td><a href="mailto:<?php echo h($m['email'] ?? ''); ?>"><?php echo h($m['email'] ?? ''); ?></a></td>
                            <td><?php echo h($m['topic'] ?? ''); ?></td>
                            <td class="admin-message-cell"><?php echo nl2br(h($m['message'] ?? '')); ?></td>
                            <td><span class="admin-badge <?php echo statusBadgeClass($status); ?>"><?php echo h($status); ?></span></td>
                            <td>
                                <form method="post" class="admin-inline-form">
                                    <input type="hidden" name="action" value="update_message_status">
                                    <input type="hidden" name="id" value="<?php echo h($m['id'] ?? ''); ?>">
                                    <input type="hidden" name="csrf_token" value="<?php echo h($csrfToken); ?>">
                                    <input type="hidden" name="status" value="<?php echo $status === 'new' ? 'read' : 'new'; ?>">
                                    <button type="submit" class="admin-small-btn"><?php echo $status === 'new' ? 'Mark read' : 'Mark unread'; ?></button>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            <?php endif; ?>
        </section>

        <p class="admin-footnote">Bookings and messages are stored as flat JSON files under <code>/data</code> (denied to direct web access) — there's no real database here. This dashboard is meant for a small, single-admin school project, not production traffic.</p>
    </main>
</body>
</html>
