<?php
require_once __DIR__ . '/../includes/admin_auth.php';

satunscape_start_session();

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $submittedToken = $_POST['csrf_token'] ?? '';
    $expectedToken = $_SESSION['csrf_token'] ?? '';

    if ($expectedToken === '' || $submittedToken === '' || !hash_equals($expectedToken, $submittedToken)) {
        $error = 'Your session expired. Please try again.';
    } elseif (!satunscape_rate_limit_ok('admin-login:' . satunscape_client_ip(), 8, 600)) {
        $error = 'Too many attempts. Please wait a few minutes and try again.';
    } else {
        $password = $_POST['password'] ?? '';
        if (satunscape_admin_login($password)) {
            header('Location: index.php');
            exit;
        }
        $error = 'Incorrect password.';
    }
}

if (satunscape_admin_logged_in()) {
    header('Location: index.php');
    exit;
}

$csrfToken = satunscape_csrf_token();
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Admin log in · Satun Scape</title>
    <link rel="icon" type="image/svg+xml" href="../favicon.svg">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/auth.css">
    <link rel="stylesheet" href="../css/admin.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700;800&family=Prompt:wght@300;400;500;600&display=swap">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
</head>
<body class="admin-body">
    <main class="admin-login-shell">
        <div class="auth-shell" style="padding-top:60px;">
            <div class="auth-card">
                <h2><i class="fas fa-lock" aria-hidden="true"></i> Admin log in</h2>
                <p class="auth-sub">Satun Scape — bookings &amp; messages dashboard</p>
                <?php if ($error !== ''): ?>
                    <div class="auth-message is-visible is-error" role="alert"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></div>
                <?php endif; ?>
                <form method="post" class="auth-form">
                    <div class="form-group">
                        <label for="password">Admin password</label>
                        <input type="password" id="password" name="password" autocomplete="current-password" required autofocus>
                    </div>
                    <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8'); ?>">
                    <button type="submit" class="auth-submit">Log in</button>
                </form>
                <p class="auth-switch"><a href="../index.html">&larr; Back to the main site</a></p>
            </div>
        </div>
    </main>
</body>
</html>
