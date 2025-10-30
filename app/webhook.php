<?php /* webhook.php pour gérer les paiements via lemonsqueezie ou Stripe*/

require_once 'config.php';
require_once 'purchase_points.php';
require_once 'PointsManager.php';

// Logger pour debug
error_log("=== LEMON SQUEEZY WEBHOOK ===");
error_log("Payload: " . file_get_contents('php://input'));

$payload = @file_get_contents('php://input');
$signature = $_SERVER['HTTP_SIGNATURE'] ?? '';

// Vérifier la signature (à configurer dans ton dashboard Lemon)
$secret = 'TON_WEBHOOK_SECRET';
$computedSignature = hash_hmac('sha256', $payload, $secret);

if (!hash_equals($computedSignature, $signature)) {
    error_log("Signature invalide");
    http_response_code(401);
    exit;
}

$data = json_decode($payload, true);

if ($data['event_name'] === 'order_created') {
    $orderData = $data['data'];
    $transactionId = $orderData['attributes']['custom_data']['transaction_id'] ?? null;
    $email = $orderData['attributes']['user_email'];
    $amount = $orderData['attributes']['total_usd']; // ou EUR selon ta config
    
    if ($transactionId) {
        // Récupérer la transaction
        $db = getDB();
        $stmt = $db->prepare("SELECT * FROM point_transactions WHERE id = ? AND status = 'pending'");
        $stmt->execute([$transactionId]);
        $transaction = $stmt->fetch();
        
        if ($transaction) {
            // Ajouter les points à l'utilisateur
            PointsManager::addPoints($transaction['user_id'], $transaction['points_amount']);
            
            // Marquer comme complété
            $stmt = $db->prepare("UPDATE point_transactions SET status = 'completed', external_id = ? WHERE id = ?");
            $stmt->execute([$orderData['id'], $transactionId]);
            
            error_log("Points ajoutés: " . $transaction['points_amount'] . " pour user: " . $transaction['user_id']);
        }
    }
}

http_response_code(200);
echo 'OK';
?>