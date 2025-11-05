<?php
// mark_all_read.php
require_once 'auth.php';
require_once 'NotificationManager.php';

if (Auth::isLoggedIn()) {
    NotificationManager::markAllAsRead($_SESSION['user_id']);
}

header('Location: ' . ($_SERVER['HTTP_REFERER'] ?? 'index.php'));
exit;
?>