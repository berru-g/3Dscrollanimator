<?php /* webhook.php pour gérer les paiements via lemonsqueezie ou Stripe*/

require_once './includes/config.php';
require_once 'purchase_points.php';

$pointPurchase = new PointPurchase();
$pointPurchase->handleWebhook();

$payload = @file_get_contents('php://input');
$sig = $_SERVER['HTTP_X_SIGNATURE'];

if (hash_hmac('sha256', $payload, 'TON_SECRET_WEBHOOK') === $sig) {
    $data = json_decode($payload, true);
    
    if ($data['event_name'] === 'order_created') {
        $email = $data['data']['attributes']['user_email'];
        
        // Trouver l'utilisateur et le passer en pro
        $db->prepare("UPDATE users SET subscription_type = 'pro' WHERE email = ?")
           ->execute([$email]);
    }
}
?>