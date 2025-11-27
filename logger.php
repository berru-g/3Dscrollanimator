<?php
// logger.php - Garde TOUT l'historique
$logFile = 'hackers.log';
$maxSize = 5 * 1024 * 1024; // 5MB max

// Si le fichier devient trop gros, on l'archive
if (file_exists($logFile) && filesize($logFile) > $maxSize) {
    rename($logFile, 'hackers_archive_' . date('Y-m-d_His') . '.log');
}

$data = json_decode(file_get_contents('php://input'), true);
$logEntry = date('Y-m-d H:i:s') . " | " . 
           ($data['ip'] ?? $_SERVER['REMOTE_ADDR']) . " | " .
           ($data['action'] ?? 'unknown') . " | " .
           ($data['data']['message'] ?? '') . "\n";

file_put_contents($logFile, $logEntry, FILE_APPEND);