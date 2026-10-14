<?php
require_once __DIR__ . '/../includes/admin_auth.php';

satunscape_admin_logout();
header('Location: login.php');
