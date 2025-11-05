<?php
require_once 'config.php';

class NotificationManager
{

    public static function getUnreadCount($userId)
    {
        try {
            $db = getDB();
            $stmt = $db->prepare("SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE");
            $stmt->execute([$userId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ? $result['count'] : 0;
        } catch (PDOException $e) {
            error_log("NotificationManager Error: " . $e->getMessage());
            return 0;
        }
    }

    // Notifier tous les users sauf le créateur quand un nouveau projet est créé
    public static function notifyNewProject($projectId, $creatorId)
    {
        try {
            $db = getDB();
            $stmt = $db->prepare("SELECT id FROM users WHERE id != ?");
            $stmt->execute([$creatorId]);
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($users as $user) {
                $stmt = $db->prepare("INSERT INTO notifications (user_id, type, project_id, from_user_id) VALUES (?, 'new_project', ?, ?)");
                $stmt->execute([$user['id'], $projectId, $creatorId]);
            }
            return true;
        } catch (PDOException $e) {
            error_log("NotifyNewProject Error: " . $e->getMessage());
            return false;
        }
    }

    // Notifier le propriétaire quand son projet est liké
    public static function notifyProjectLiked($projectId, $likerId)
    {
        try {
            $db = getDB();
            // Trouver le propriétaire du projet
            $stmt = $db->prepare("SELECT user_id FROM projects WHERE id = ?");
            $stmt->execute([$projectId]);
            $project = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($project && $project['user_id'] != $likerId) {
                $stmt = $db->prepare("INSERT INTO notifications (user_id, type, project_id, from_user_id) VALUES (?, 'like', ?, ?)");
                return $stmt->execute([$project['user_id'], $projectId, $likerId]);
            }
            return false;
        } catch (PDOException $e) {
            error_log("NotifyProjectLiked Error: " . $e->getMessage());
            return false;
        }
    }

    public static function markAllAsRead($userId)
    {
        try {
            $db = getDB();
            $stmt = $db->prepare("UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE");
            return $stmt->execute([$userId]);
        } catch (PDOException $e) {
            error_log("MarkAllAsRead Error: " . $e->getMessage());
            return false;
        }
    }

    public static function getUserNotifications($userId, $limit = 10)
    {
        try {
            $db = getDB();

            // Version ultra simple sans JOIN d'abord
            $stmt = $db->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?");
            $stmt->execute([$userId, $limit]);
            $notifs = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Debug direct
            echo "<!-- DEBUG: " . count($notifs) . " notifications trouvées -->";

            if (count($notifs) > 0) {
                // Maintenant avec les JOIN mais en debug
                $stmt = $db->prepare("
                SELECT n.*, p.title as project_title, u.username as from_username
                FROM notifications n
                LEFT JOIN projects p ON n.project_id = p.id
                LEFT JOIN users u ON n.from_user_id = u.id
                WHERE n.user_id = ?
                ORDER BY n.created_at DESC 
                LIMIT ?
            ");
                $stmt->execute([$userId, $limit]);
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                echo "<!-- DEBUG JOIN: " . count($result) . " résultats après JOIN -->";

                // Ajout du message
                foreach ($result as &$notif) {
                    switch ($notif['type']) {
                        case 'new_project':
                            $notif['message'] = 'a créé un nouveau projet';
                            break;
                        case 'like':
                            $notif['message'] = 'a aimé votre projet';
                            break;
                        case 'comment':
                            $notif['message'] = 'a commenté votre projet';
                            break;
                        default:
                            $notif['message'] = 'a interagi avec votre projet';
                    }
                }

                return $result;
            }

            return [];

        } catch (PDOException $e) {
            echo "<!-- ERROR: " . $e->getMessage() . " -->";
            return [];
        }
    }

    // Notifier le propriétaire quand son projet est commenté
    public static function notifyProjectCommented($projectId, $commenterId)
    {
        try {
            $db = getDB();
            // Trouver le propriétaire du projet
            $stmt = $db->prepare("SELECT user_id FROM projects WHERE id = ?");
            $stmt->execute([$projectId]);
            $project = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($project && $project['user_id'] != $commenterId) {
                $stmt = $db->prepare("INSERT INTO notifications (user_id, type, project_id, from_user_id) VALUES (?, 'comment', ?, ?)");
                return $stmt->execute([$project['user_id'], $projectId, $commenterId]);
            }
            return false;
        } catch (PDOException $e) {
            error_log("NotifyProjectCommented Error: " . $e->getMessage());
            return false;
        }
    }
}
?>