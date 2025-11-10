<?php
// public_html/test-path.php
echo "Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "<br>";
echo "Script Path: " . $_SERVER['SCRIPT_FILENAME'] . "<br>";

// Essayer différents chemins
$possible_paths = [
    '/home/ubuntu/config.ini',
    '/home/user/config.ini', 
    $_SERVER['DOCUMENT_ROOT'] . '/../config.ini'
];

foreach ($possible_paths as $path) {
    echo "Testing: $path - ";
    if (file_exists($path)) {
        echo "EXISTS";
    } else {
        echo "NOT FOUND";
    }
    echo "<br>";
}
?>