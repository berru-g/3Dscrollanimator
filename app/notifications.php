<?php
require_once 'header.php';
require_once 'NotificationManager.php';

if (!Auth::isLoggedIn()) {
    header('Location: login.php');
    exit;
}

$notifications = NotificationManager::getUserNotifications($_SESSION['user_id'], false);
$unreadCount = NotificationManager::getUnreadCount($_SESSION['user_id']);
?>

<div class="container" style="max-width: 800px; margin: 2rem auto; padding: 0 1rem;">
    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 2rem;">
        <h1 style="color: var(--rose);">Mes Notifications</h1>
        <?php if ($unreadCount > 0): ?>
            <a href="mark_all_read.php" class="btn btn-primary" style="margin-left: auto;">
                <i class="fas fa-check-double"></i> Tout marquer comme lu
            </a>
        <?php endif; ?>
    </div>

    <?php if (empty($notifications)): ?>
        <div style="text-align: center; padding: 4rem; color: var(--grey-light);">
            <i class="fa-regular fa-bell-slash" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h3>Aucune notification</h3>
            <span>Salut <?= htmlspecialchars($_SESSION['user_name'] ?? '') ?>, rien ici aujourd'hui</span>
            <p>Vous serez notifié quand quelqu'un interagira avec vos projets.</p>
        </div>
    <?php else: ?>
        <div style="background: var(--dark); border: 1px solid var(--border); border-radius: 12px; overflow: hidden;">
            <?php foreach ($notifications as $notif): ?>
                <a href="project.php?id=<?= $notif['project_id'] ?>&notif=<?= $notif['id'] ?>" 
                   style="display: block; text-decoration: none; color: inherit;">
                    <div style="display: flex; padding: 1rem; border-bottom: 1px solid var(--border); <?= !$notif['is_read'] ? 'background: rgba(171, 159, 242, 0.05); border-left: 3px solid var(--primary);' : '' ?>">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--rose)); display: flex; align-items: center; justify-content: center; color: var(--dark); font-weight: bold; margin-right: 1rem;">
                            <?= strtoupper(substr($notif['from_username'] ?? 'S', 0, 1)) ?>
                        </div>
                        <div style="flex: 1;">
                            <div style="color: var(--white);">
                                <strong style="color: var(--rose);"><?= htmlspecialchars($notif['from_username'] ?? 'Système') ?></strong>
                                <?= $notif['message'] ?>
                            </div>
                            <div style="color: var(--primary); font-size: 0.9rem; margin-top: 0.2rem;">
                                "<?= htmlspecialchars($notif['project_title']) ?>"
                            </div>
                            <div style="color: var(--grey-light); font-size: 0.8rem; margin-top: 0.2rem;">
                                <?= timeAgo($notif['created_at']) ?>
                            </div>
                        </div>
                    </div>
                </a>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php include 'footer.php'; ?>