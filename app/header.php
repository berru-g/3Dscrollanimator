<?php
require_once 'config.php';
require_once 'auth.php';
require_once 'PointsManager.php';
/* Affichage des notif - en cours de debug
require_once 'NotificationManager.php';
$unreadCount = NotificationManager::getUnreadCount($_SESSION['user_id']);
$notifications = NotificationManager::getUserNotifications($_SESSION['user_id'], 5);

function timeAgo($datetime)
{
    $time = strtotime($datetime);
    $time = time() - $time;

    $units = array(
        31536000 => 'an',
        2592000 => 'mois',
        604800 => 'semaine',
        86400 => 'jour',
        3600 => 'heure',
        60 => 'minute',
        1 => 'seconde'
    );

    foreach ($units as $unit => $val) {
        if ($time < $unit)
            continue;
        $numberOfUnits = floor($time / $unit);
        return $numberOfUnits . ' ' . $val . (($numberOfUnits > 1) ? 's' : '');
    }

    return 'maintenant';
}
    */
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Scroll Animator</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        /* ====== HEADER MODERNE ====== */
        :root {
            --white: #f1f1f1;
            --dark: #151517;
            --grey: #1b1b1c;
            --grey-light: #2c2c2e;
            --primary: #ab9ff2;
            --rose: #cba6f7;
            --border: #dcdcdc;
            --success: #60d394;
            --error: #ee6055;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: var(--dark);
            color: var(--rose);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            min-height: 100vh;
        }

        .modern-header {
            background: rgba(21, 21, 23, 0.95);
            /*#0a0718*/
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border);
            padding: 0.8rem 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 2rem;
        }

        .header-left img {
            height: 55px;
            width: auto;
            border-radius: 100%;
        }

        .logo {
            font-size: 1.2rem;
            font-weight: bold;
            color: var(--dark);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .logo-icon {
            color: var(--primary);
            font-size: 1.5rem;
        }

        .nav-icons {
            display: flex;
            gap: 1rem;
        }

        .nav-icon {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1.2rem;
            border-radius: 25px;
            text-decoration: none;
            color: var(--white);
            transition: all 0.3s ease;
            border: 1px solid transparent;
        }

        .nav-icon:hover {
            background: rgba(171, 159, 242, 0.1);
            border-color: var(--primary);
            transform: translateY(-2px);
        }

        .nav-icon.active {
            background: rgba(241, 241, 241, 0.14);
            color: var(--white);
        }

        .nav-icon i {
            font-size: 1.1rem;
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .auth-buttons {
            display: flex;
            gap: 0.8rem;
        }

        .btn-cta {
            background: linear-gradient(90deg, var(--primary), var(--rose));
            color: #0f0f16;
            text-decoration: none;
            padding: 12px 18px;
            border-radius: 10px;
            border: none;
            font-weight: 400;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(203, 166, 247, 0.32);
            display: inline-flex;
            gap: 10px;
            align-items: center;
        }

        .btn-join {
            background: linear-gradient(90deg, var(--border), var(--white));
            color: #0f0f16;
            text-decoration: none;
            padding: 12px 18px;
            border-radius: 10px;
            border: none;
            font-weight: 400;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(203, 166, 247, 0.32);
            display: inline-flex;
            gap: 10px;
            align-items: center;
        }

        /* Menu utilisateur */
        .user-menu {
            display: flex;
            align-items: center;
            gap: 1rem;
            position: relative;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), var(--rose));
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--dark);
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .user-avatar:hover {
            transform: scale(1.1);
        }

        .user-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background: var(--dark);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1rem;
            min-width: 200px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        }

        .user-menu:hover .user-dropdown {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .user-dropdown-item {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            padding: 0.8rem;
            color: var(--white);
            text-decoration: none;
            border-radius: 8px;
            transition: background 0.3s ease;
        }

        .user-dropdown-item:hover {
            background: rgba(171, 159, 242, 0.1);
        }

        .user-dropdown-item i {
            width: 20px;
            color: var(--primary);
        }

        .user-dropdown-divider {
            height: 1px;
            background: var(--border);
            margin: 0.5rem 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .modern-header {
                padding: 0.8rem 1rem;
            }

            .nav-icon span {
                display: none;
            }

            .header-left span {
                display: none;
            }

            .auth-buttons span {
                display: none;
            }

            .nav-icon {
                padding: 0.6rem;
            }

            .btn {
                padding: 0.6rem 1rem;
                font-size: 0.8rem;
            }
        }

        /* system de points */
        .user-points {
            background: var(--primary);
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            margin-left: 8px;
            font-weight: bold;
        }

        .points-info {
            background: var(--grey-light);
            padding: 10px;
            border-radius: 6px;
            margin: 10px 0;
            text-align: center;
            /*border-left: 4px solid var(--primary);*/
        }

        .points-cost {
            color: var(--rose);
            font-weight: bold;
        }

        /* Menu notifications */
        .notification-menu {
            position: relative;
            display: inline-block;
        }

        .notification-icon {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(171, 159, 242, 0.1);
            color: var(--white);
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .notification-icon:hover {
            background: rgba(171, 159, 242, 0.2);
            transform: scale(1.05);
        }

        .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ff4757;
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            font-size: 0.7rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        /* Dropdown notifications */
        .notification-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background: var(--dark);
            border: 1px solid var(--border);
            border-radius: 12px;
            width: 320px;
            max-height: 400px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 1001;
        }

        .notification-menu:hover .notification-dropdown {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .notification-header {
            padding: 1rem;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .notification-header h4 {
            margin: 0;
            color: var(--white);
            font-size: 1rem;
        }

        .mark-all-read {
            font-size: 0.8rem;
            color: var(--primary);
            text-decoration: none;
        }

        .mark-all-read:hover {
            text-decoration: underline;
        }

        .notification-list {
            max-height: 300px;
            overflow-y: auto;
        }

        .notification-item {
            display: flex;
            padding: 0.8rem;
            border-bottom: 1px solid var(--grey-light);
            text-decoration: none;
            color: var(--white);
            transition: background 0.3s ease;
            gap: 0.8rem;
        }

        .notification-item:hover {
            background: rgba(171, 159, 242, 0.1);
        }

        .notification-item.unread {
            background: rgba(171, 159, 242, 0.05);
            border-left: 3px solid var(--primary);
        }

        .notification-item.empty {
            justify-content: center;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            color: var(--grey-light);
            padding: 2rem;
        }

        .notification-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), var(--rose));
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--dark);
            font-weight: bold;
            flex-shrink: 0;
            font-size: 0.8rem;
        }

        .notification-content {
            flex: 1;
            min-width: 0;
        }

        .notification-content strong {
            color: var(--rose);
            font-size: 0.9rem;
        }

        .notification-project {
            color: var(--primary);
            font-size: 0.8rem;
            margin-top: 0.2rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .notification-time {
            color: var(--grey-light);
            font-size: 0.7rem;
            margin-top: 0.2rem;
        }

        .notification-footer {
            padding: 0.8rem;
            text-align: center;
            border-top: 1px solid var(--border);
        }

        .notification-footer a {
            color: var(--primary);
            text-decoration: none;
            font-size: 0.9rem;
        }

        .notification-footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <header class="modern-header">
        <div class="header-left">
            <a href="../" class="logo">
                <img src="../img/3Dscrollanimator-logo.png">
                <span>3DScrollAnimate</span>
            </a>

            <div class="nav-icons">
                <a href="index.php"
                    class="nav-icon <?= basename($_SERVER['PHP_SELF']) == 'index.php' ? 'active' : '' ?>">
                    <i class="fa-regular fa-pen-to-square"></i>
                    <span>Edit</span>
                </a>
                <a href="gallery.php"
                    class="nav-icon <?= basename($_SERVER['PHP_SELF']) == 'gallery.php' ? 'active' : '' ?>">
                    <i class="fa-regular fa-folder-open"></i>
                    <span>Explore</span>
                </a>
            </div>
        </div>

        <div class="header-right">
            <?php if (Auth::isLoggedIn()): ?>

                <!-- Notif debug en cours --
                 <div class="notification-menu">
                    <div class="notification-icon">
                        <i class="fa-regular fa-bell"></i>
                        <?php if ($unreadCount > 0): ?>
                            <span class="notification-badge"><?= $unreadCount ?></span>
                        <?php endif; ?>
                    </div>

                    !-- DEBUG TEMPORAIRE --
    <div style="color: white; position: absolute; top: 20px; left: -200px; background: grey; padding: 5px;">
        Unread: <?= $unreadCount ?> | Notifs count: <?= count($notifications) ?>
    </div>

                    <div class="notification-dropdown">
                        <div class="notification-header">
                            <h4>Notifications</h4>
                            <?php if ($unreadCount > 0): ?>
                                <a href="mark_all_read.php" class="mark-all-read">Tout marquer comme lu</a>
                            <?php endif; ?>
                        </div>

                        <div class="notification-list">
                            <?php if (empty($notifications)): ?>
                                <div class="notification-item empty">
                                    <i class="fa-regular fa-bell-slash"></i>
                                    <span>Salut <?= htmlspecialchars($_SESSION['user_name'] ?? '') ?>, rien ici aujourd'hui</span>
                                </div>
                            <?php else: ?>
                                <?php foreach ($notifications as $notif): ?>
                                    <a href="project.php?id=<?= $notif['project_id'] ?>&notif=<?= $notif['id'] ?>"
                                        class="notification-item <?= !$notif['is_read'] ? 'unread' : '' ?>">
                                        <div class="notification-avatar">
                                            <?= strtoupper(substr($notif['from_username'] ?? 'S', 0, 1)) ?>
                                        </div>
                                        <div class="notification-content">
                                            <strong><?= htmlspecialchars($notif['from_username'] ?? 'Système') ?></strong>
                                            <?= $notif['message'] ?>
                                            <div class="notification-project">
                                                "<?= htmlspecialchars($notif['project_title']) ?>"
                                            </div>
                                            <div class="notification-time">
                                                <?= timeAgo($notif['created_at']) ?>
                                            </div>
                                        </div>
                                    </a>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>

                        <div class="notification-footer">
                            <a href="notifications.php">Voir toutes les notifications</a>
                        </div>
                    </div>
                </div>-->



                <div class="points-info">
                    <!--<span><?= htmlspecialchars($_SESSION['user_name']) ?></span>-->
                    <strong><span id="current-points"><?= $_SESSION['user_points'] ?? 200 ?></span></strong> 💎
                </div>

                <div class="user-menu">
                    <div class="user-avatar">
                        <?= strtoupper(substr($_SESSION['user_name'], 0, 1)) ?>
                    </div>

                    <div class="user-dropdown">

                        <a href="dashboard.php" class="user-dropdown-item">
                            <i class="fa-regular fa-user"></i>
                            <span>Profil</span>
                        </a>

                        <?php if (Auth::isLoggedIn() && $_SESSION['user_id'] == 1): ?>
                            <a href="admin.php" class="user-dropdown-item">
                                <i class="fa-solid fa-code-branch"></i>
                                <span>Stat</span>
                            </a>
                            <div class="user-dropdown-divider"></div>
                            <a href="history.php" class="user-dropdown-item">
                                <i class="fa-solid fa-code-merge"></i>
                                <span>History TR</span>
                            </a>
                        <?php endif; ?>



                        <div class="user-dropdown-divider"></div>

                        <a href="?logout" class="user-dropdown-item">
                            <i class="fa-regular fa-share-from-square"></i>
                            <span>Log Out</span>
                        </a>
                    </div>
                </div>
            <?php else: ?>
                <div class="auth-buttons">
                    <a href="login.php" class="btn-cta">
                        <i class="fa-regular fa-square-plus"></i>
                        <span> Create</span>
                    </a>
                    <a href="register.php" class="btn-join">
                        <i class="fa-solid fa-rocket"></i>
                        <span> Join we</span>
                    </a>
                </div>
            <?php endif; ?>
        </div>
    </header>

    <main>