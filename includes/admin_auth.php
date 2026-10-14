<?php
/**
 * Satun Scape — admin dashboard session helpers.
 *
 * Deliberately separate from the visitor account system (includes/auth.php):
 * there's one shared admin password (not per-person accounts), stored the
 * same way as the mail config — a real config/admin.config.php the site
 * owner creates locally, falling back to the example file so the demo
 * still runs out of the box. Uses the same PHP session as visitor login
 * (satunscape_start_session()) but a separate $_SESSION key, so being
 * logged in as admin and logged in as a visitor never get confused.
 */

require_once __DIR__ . '/auth.php';

function satunscape_admin_config(): array
{
    $paths = [
        __DIR__ . '/../config/admin.config.php',
        __DIR__ . '/../config/admin.config.example.php',
    ];

    foreach ($paths as $path) {
        if (is_file($path)) {
            $config = require $path;
            if (is_array($config)) {
                return $config;
            }
        }
    }

    return ['password_hash' => ''];
}

function satunscape_admin_login(string $password): bool
{
    $config = satunscape_admin_config();
    $hash = $config['password_hash'] ?? '';

    if ($hash === '' || !password_verify($password, $hash)) {
        return false;
    }

    satunscape_start_session();
    session_regenerate_id(true);
    $_SESSION['is_admin'] = true;
    return true;
}

function satunscape_admin_logged_in(): bool
{
    satunscape_start_session();
    return !empty($_SESSION['is_admin']);
}

function satunscape_admin_logout(): void
{
    satunscape_start_session();
    unset($_SESSION['is_admin']);
}

/**
 * Redirects to the admin login page if not logged in as admin. Call this
 * at the top of every admin page that isn't the login page itself.
 */
function satunscape_require_admin(): void
{
    if (!satunscape_admin_logged_in()) {
        header('Location: login.php');
        exit;
    }
}
