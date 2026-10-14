<?php
/**
 * Satun Scape — visitor account system.
 *
 * Storage: data/users.php and data/bookings.php — plain JSON data, but
 * saved with a .php extension and a self-executing "deny" header at the
 * top (see SATUNSCAPE_DATA_GUARD below) so the file refuses to reveal
 * itself if requested directly, on any server. No extra PHP extensions
 * or database needed on the host. Passwords are never stored in plain
 * text — only a password_hash() digest. All reads/writes use flock()
 * to avoid two simultaneous registrations corrupting the file.
 */

const SATUNSCAPE_SESSION_NAME = 'satunscape_session';
const SATUNSCAPE_MIN_PASSWORD_LENGTH = 8;

function satunscape_start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

    session_name(SATUNSCAPE_SESSION_NAME);
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

/**
 * A one-line PHP header written at the top of every data file. If someone
 * requests the file directly through the web server, PHP executes this
 * line first and stops — before any of the JSON underneath it can be
 * sent back. This works on every server (Apache, Nginx, `php -S`, etc.)
 * because it relies on PHP itself, not on .htaccess rules that some
 * servers (like PHP's built-in dev server) simply ignore.
 */
const SATUNSCAPE_DATA_GUARD = "<?php http_response_code(403); header('Content-Type: text/plain'); exit('403 Forbidden'); ?>" . "\n";

function satunscape_strip_guard(string $raw): string
{
    if (strncmp($raw, SATUNSCAPE_DATA_GUARD, strlen(SATUNSCAPE_DATA_GUARD)) === 0) {
        return substr($raw, strlen(SATUNSCAPE_DATA_GUARD));
    }
    return $raw;
}

function satunscape_users_file(): string
{
    return __DIR__ . '/../data/users.php';
}

function satunscape_bookings_file(): string
{
    return __DIR__ . '/../data/bookings.php';
}

function satunscape_messages_file(): string
{
    return __DIR__ . '/../data/messages.php';
}

/**
 * True if a hidden "honeypot" field was filled in. Real visitors never see
 * or fill this field (it's hidden with CSS, not just a `hidden` attribute
 * some bots skip), so anything non-empty here is almost certainly a bot.
 * Callers should respond as if the submission succeeded — never tell the
 * bot what tripped it — while quietly dropping the request.
 */
function satunscape_honeypot_triggered(string $value): bool
{
    return trim($value) !== '';
}

function satunscape_ratelimits_file(): string
{
    return __DIR__ . '/../data/ratelimits.php';
}

/**
 * Best-effort visitor IP for rate limiting. Good enough to slow down
 * casual brute-forcing/spam on a small school-project host — not a
 * substitute for a real WAF, and trivially spoofed by anyone who tries,
 * so it's one layer, not the only one.
 */
function satunscape_client_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/**
 * Simple fixed-window rate limiter shared by login, register, admin
 * login, forgot-password, contact, and booking. $key should already
 * combine the action with an identifier (e.g. "login:" + ip + ':' +
 * email) so different actions/identifiers never share a bucket. Returns
 * false once $maxAttempts is exceeded within $windowSeconds — callers
 * should respond with HTTP 429 and a friendly "try again later" message.
 */
function satunscape_rate_limit_ok(string $key, int $maxAttempts, int $windowSeconds): bool
{
    $now = time();
    $allowed = true;

    satunscape_with_file_locked(satunscape_ratelimits_file(), function (array $buckets) use ($key, $maxAttempts, $windowSeconds, $now, &$allowed) {
        $entry = $buckets[$key] ?? ['count' => 0, 'window_start' => $now];

        if ($now - ($entry['window_start'] ?? 0) >= $windowSeconds) {
            $entry = ['count' => 0, 'window_start' => $now];
        }

        $entry['count'] = ($entry['count'] ?? 0) + 1;
        $allowed = $entry['count'] <= $maxAttempts;
        $buckets[$key] = $entry;

        // Housekeeping so this file doesn't grow forever: drop buckets
        // that expired a while ago.
        foreach ($buckets as $bucketKey => $bucket) {
            if ($now - ($bucket['window_start'] ?? 0) > $windowSeconds * 4) {
                unset($buckets[$bucketKey]);
            }
        }

        return $buckets;
    });

    return $allowed;
}

/**
 * Generic read of a JSON data file (same guarded-.php format as users.php
 * and bookings.php). Returns [] if the file doesn't exist yet or is empty.
 */
function satunscape_load_json_file(string $file): array
{
    if (!is_file($file)) {
        return [];
    }

    $handle = fopen($file, 'r');
    if ($handle === false) {
        return [];
    }

    $list = [];
    if (flock($handle, LOCK_SH)) {
        $raw = stream_get_contents($handle);
        $decoded = json_decode(satunscape_strip_guard($raw), true);
        if (is_array($decoded)) {
            $list = $decoded;
        }
        flock($handle, LOCK_UN);
    }
    fclose($handle);

    return $list;
}

/**
 * Generic locked read-modify-write for any of the guarded JSON data files.
 * Used for anything that isn't the users file (which keeps its own
 * dedicated helper above since it predates this one).
 */
function satunscape_with_file_locked(string $file, callable $mutator): array
{
    $dataDir = dirname($file);
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }

    $handle = fopen($file, 'c+');
    if ($handle === false) {
        throw new RuntimeException('Could not open data file: ' . basename($file));
    }

    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        throw new RuntimeException('Could not lock data file: ' . basename($file));
    }

    $raw = stream_get_contents($handle);
    $decoded = json_decode(satunscape_strip_guard($raw), true);
    $list = is_array($decoded) ? $decoded : [];

    $list = $mutator($list);

    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, SATUNSCAPE_DATA_GUARD . json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    return $list;
}

/**
 * Persists one contact-form message to data/messages.php. Kept even when
 * the site has no working mail server configured, so nothing a visitor
 * writes is ever silently lost — the admin dashboard reads from here.
 */
function satunscape_save_message(array $message): void
{
    satunscape_with_file_locked(satunscape_messages_file(), function (array $messages) use ($message) {
        $messages[] = $message;
        return $messages;
    });
}

/**
 * Marks one contact-form message as read/unread by id. Used by the admin
 * dashboard so a message can be dismissed once handled.
 */
function satunscape_update_message_status(string $id, string $newStatus): bool
{
    $updated = false;
    satunscape_with_file_locked(satunscape_messages_file(), function (array $messages) use ($id, $newStatus, &$updated) {
        foreach ($messages as &$m) {
            if (($m['id'] ?? '') === $id) {
                $m['status'] = $newStatus;
                $updated = true;
            }
        }
        unset($m);
        return $messages;
    });
    return $updated;
}

/**
 * Updates one booking's status by reference. When $requireUserId is given,
 * only a booking owned by that user is changed (customer self-service
 * cancellation) — pass null to update any booking regardless of owner
 * (admin dashboard). Returns true if a matching booking was updated.
 */
function satunscape_update_booking_status(string $reference, ?string $requireUserId, string $newStatus): bool
{
    $updated = false;
    satunscape_with_file_locked(satunscape_bookings_file(), function (array $bookings) use ($reference, $requireUserId, $newStatus, &$updated) {
        foreach ($bookings as &$b) {
            if (($b['reference'] ?? '') !== $reference) {
                continue;
            }
            if ($requireUserId !== null && ($b['user_id'] ?? null) !== $requireUserId) {
                continue;
            }
            $b['status'] = $newStatus;
            $updated = true;
        }
        unset($b);
        return $bookings;
    });
    return $updated;
}

/**
 * Reads all users. Returns [] if the file doesn't exist yet.
 */
function satunscape_load_users(): array
{
    $file = satunscape_users_file();
    if (!is_file($file)) {
        return [];
    }

    $handle = fopen($file, 'r');
    if ($handle === false) {
        return [];
    }

    $users = [];
    if (flock($handle, LOCK_SH)) {
        $raw = stream_get_contents($handle);
        $decoded = json_decode(satunscape_strip_guard($raw), true);
        if (is_array($decoded)) {
            $users = $decoded;
        }
        flock($handle, LOCK_UN);
    }
    fclose($handle);

    return $users;
}

/**
 * Writes the full user list back to disk, holding an exclusive lock
 * for the whole read-modify-write so two registrations can't race.
 * $mutator receives the current users array and must return the new one.
 */
function satunscape_with_users_locked(callable $mutator): array
{
    $dataDir = dirname(satunscape_users_file());
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }

    $file = satunscape_users_file();
    $handle = fopen($file, 'c+');
    if ($handle === false) {
        throw new RuntimeException('Could not open user data file.');
    }

    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        throw new RuntimeException('Could not lock user data file.');
    }

    $raw = stream_get_contents($handle);
    $decoded = json_decode(satunscape_strip_guard($raw), true);
    $users = is_array($decoded) ? $decoded : [];

    $users = $mutator($users);

    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, SATUNSCAPE_DATA_GUARD . json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    return $users;
}

function satunscape_normalize_email(string $email): string
{
    return strtolower(trim($email));
}

function satunscape_find_user_by_email(array $users, string $email): ?array
{
    $email = satunscape_normalize_email($email);
    foreach ($users as $user) {
        if (($user['email'] ?? '') === $email) {
            return $user;
        }
    }
    return null;
}

function satunscape_generate_user_id(): string
{
    return 'usr_' . bin2hex(random_bytes(8));
}

/**
 * Very loose phone check — this is a visitor-contact field, not a strict
 * telecom validator, so it just rejects obviously-empty or junk input
 * while accepting the wide range of formats visitors actually type
 * (+66 81 234 5678, 081-234-5678, +60 12 345 6789, etc).
 */
function satunscape_valid_phone(string $phone): bool
{
    $digits = preg_replace('/\D/', '', $phone);
    return strlen($digits) >= 7 && strlen($digits) <= 15
        && preg_match('/^[0-9+()\-\s]{7,25}$/', $phone) === 1;
}

/**
 * Public shape of a stored user — everything callers are allowed to see.
 * Keeping this in one place means login/register/session always agree on
 * which fields exist, so pre-filling booking forms never breaks if we add
 * more profile fields later.
 */
function satunscape_public_user(array $user): array
{
    return [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'phone' => $user['phone'] ?? '',
        'nationality' => $user['nationality'] ?? '',
    ];
}

/**
 * Registers a new user. Returns ['success' => bool, 'error' => ?string, 'user' => ?array].
 * The returned user array never includes the password hash.
 *
 * Phone and nationality are collected at signup (not just at booking time)
 * so a returning visitor's details, adults, and travel-document status are
 * on file once — the booking forms then pre-fill from the account instead
 * of asking again on every tour, boat, van, or stay request.
 */
function satunscape_register_user(
    string $name,
    string $email,
    string $password,
    string $confirmPassword,
    string $phone,
    string $nationality
): array {
    $name = trim($name);
    $email = satunscape_normalize_email($email);
    $phone = trim($phone);
    $nationality = trim($nationality);

    if ($name === '' || mb_strlen($name) < 2) {
        return ['success' => false, 'error' => 'Please enter your name.'];
    }
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['success' => false, 'error' => 'Please enter a valid email address.'];
    }
    if (!satunscape_valid_phone($phone)) {
        return ['success' => false, 'error' => 'Please enter a valid phone number.'];
    }
    if ($nationality === '' || mb_strlen($nationality) < 2 || mb_strlen($nationality) > 60) {
        return ['success' => false, 'error' => 'Please select or enter your nationality.'];
    }
    if (strlen($password) < SATUNSCAPE_MIN_PASSWORD_LENGTH) {
        return ['success' => false, 'error' => 'Password must be at least ' . SATUNSCAPE_MIN_PASSWORD_LENGTH . ' characters.'];
    }
    if ($password !== $confirmPassword) {
        return ['success' => false, 'error' => 'Passwords do not match.'];
    }

    $result = null;

    satunscape_with_users_locked(function (array $users) use ($name, $email, $password, $phone, $nationality, &$result) {
        if (satunscape_find_user_by_email($users, $email) !== null) {
            $result = ['success' => false, 'error' => 'An account with that email already exists.'];
            return $users;
        }

        $newUser = [
            'id' => satunscape_generate_user_id(),
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'nationality' => $nationality,
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'created_at' => date('c'),
        ];

        $users[] = $newUser;
        $result = [
            'success' => true,
            'error' => null,
            'user' => satunscape_public_user($newUser),
        ];
        return $users;
    });

    return $result ?? ['success' => false, 'error' => 'Something went wrong. Please try again.'];
}

/**
 * Verifies email/password. Deliberately returns the same generic error
 * whether the email doesn't exist or the password is wrong, so a bad
 * actor can't use the login form to discover which emails are registered.
 */
function satunscape_verify_login(string $email, string $password): array
{
    $users = satunscape_load_users();
    $user = satunscape_find_user_by_email($users, $email);

    if ($user === null || !password_verify($password, $user['password_hash'] ?? '')) {
        return ['success' => false, 'error' => 'Incorrect email or password.'];
    }

    return [
        'success' => true,
        'error' => null,
        'user' => satunscape_public_user($user),
    ];
}

/**
 * Starts a password-reset request. Always looks like it succeeded from the
 * caller's point of view (never reveal whether an email is registered) —
 * the ['found' => bool] flag is for the server itself to decide whether to
 * actually send an email, not something the HTTP response should expose.
 */
function satunscape_create_password_reset(string $email): array
{
    $email = satunscape_normalize_email($email);
    $token = bin2hex(random_bytes(32));
    $tokenHash = hash('sha256', $token);
    $expires = time() + 3600; // 1 hour

    $found = false;
    satunscape_with_users_locked(function (array $users) use ($email, $tokenHash, $expires, &$found) {
        foreach ($users as &$u) {
            if (($u['email'] ?? '') === $email) {
                $u['reset_token_hash'] = $tokenHash;
                $u['reset_token_expires'] = $expires;
                $found = true;
            }
        }
        unset($u);
        return $users;
    });

    return ['found' => $found, 'token' => $token];
}

function satunscape_verify_reset_token(string $email, string $token): bool
{
    $email = satunscape_normalize_email($email);
    $users = satunscape_load_users();
    $user = satunscape_find_user_by_email($users, $email);

    if ($user === null || empty($user['reset_token_hash']) || empty($user['reset_token_expires'])) {
        return false;
    }
    if (time() > (int) $user['reset_token_expires']) {
        return false;
    }
    return hash_equals($user['reset_token_hash'], hash('sha256', $token));
}

/**
 * Sets a new password once a reset link has been verified. The token is
 * one-time use — it's cleared as soon as it's spent, win or lose isn't the
 * point, it just can't be replayed after a successful reset.
 */
function satunscape_reset_password(string $email, string $token, string $newPassword, string $confirmPassword): array
{
    if (strlen($newPassword) < SATUNSCAPE_MIN_PASSWORD_LENGTH) {
        return ['success' => false, 'error' => 'Password must be at least ' . SATUNSCAPE_MIN_PASSWORD_LENGTH . ' characters.'];
    }
    if ($newPassword !== $confirmPassword) {
        return ['success' => false, 'error' => 'Passwords do not match.'];
    }
    if (!satunscape_verify_reset_token($email, $token)) {
        return ['success' => false, 'error' => 'This reset link is invalid or has expired. Please request a new one.'];
    }

    $email = satunscape_normalize_email($email);
    $done = false;
    satunscape_with_users_locked(function (array $users) use ($email, $newPassword, &$done) {
        foreach ($users as &$u) {
            if (($u['email'] ?? '') === $email) {
                $u['password_hash'] = password_hash($newPassword, PASSWORD_DEFAULT);
                unset($u['reset_token_hash'], $u['reset_token_expires']);
                $done = true;
            }
        }
        unset($u);
        return $users;
    });

    if (!$done) {
        return ['success' => false, 'error' => 'This reset link is invalid or has expired. Please request a new one.'];
    }
    return ['success' => true, 'error' => null];
}

function satunscape_log_in_user(array $user): void
{
    satunscape_start_session();
    // Regenerate the session id on privilege change (login) to prevent
    // session fixation attacks.
    session_regenerate_id(true);
    $_SESSION['user'] = $user;
}

function satunscape_log_out_user(): void
{
    satunscape_start_session();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(SATUNSCAPE_SESSION_NAME, '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
}

/**
 * Returns the logged-in user (['id','name','email']) or null.
 */
function satunscape_current_user(): ?array
{
    satunscape_start_session();
    return $_SESSION['user'] ?? null;
}

function satunscape_require_login(): array
{
    $user = satunscape_current_user();
    if ($user === null) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Please log in first.']);
        exit;
    }
    return $user;
}

/* ---------- CSRF protection ---------- */

function satunscape_csrf_token(): string
{
    satunscape_start_session();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function satunscape_require_csrf(): void
{
    satunscape_start_session();
    $submitted = $_POST['csrf_token'] ?? ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    $expected = $_SESSION['csrf_token'] ?? '';

    if ($expected === '' || $submitted === '' || !hash_equals($expected, $submitted)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Your session expired. Please refresh the page and try again.']);
        exit;
    }
}
