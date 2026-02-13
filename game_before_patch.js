// game_before_patch.js
setTimeout(() => {
    console.log(`%c

Salut le curieux ! 👋 
Je sais que tu cherches des failles... 
Et devine quoi ? J'en ai quelques-unes pas encore patchées !

Choisis ton "attaque" :

• hack('credit')     - 100 crédits gratuits
• hack('admin')      - Accès admin (presque)
• hack('animation')  - Animation de points

Tape ta commande avant que je patch ! 🔧

`, "background: #1a1a1a; color: #00ff00; font-family: monospace;");

// Le jeu avec les VRAIES attaques
window.hack = function(command) {
    switch(command) {
        case 'credit':
            console.log("%c🎯 Exploitation de la faille 'add_points'...", "color: yellow;");
            
                // LA VRAIE ATTAQUE
                fetch('/app/api.php', {
                    method: 'POST', 
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: 'action=add_points&points=100'
                }).then(r => r.json())
                
                .catch(error => {
                    console.log("%c💥 Erreur lors de l'attaque", "color: red;");
                });
                break;

        case 'admin':
            console.log("%c🎯 Tentative d'accès admin...", "color: yellow;");
            
            // Simulation admin
            setTimeout(() => {
                console.log("%c🛡️ Accès admin refusé - Mais bonne tentative !", "color: orange;");
                console.log("%c💡 Faible: Vérifications insuffisantes sur certains endpoints", "color: #ff9900;");
                
                // Petit effet "hack" visuel
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    console.log(`%c⏳ Bypass sécurité: ${progress}%`, "color: cyan;");
                    if(progress >= 100) {
                        clearInterval(interval);
                        console.log("%c🔓 Interface admin simulée débloquée !", "color: #00ff00;");
                    }
                }, 200);
            }, 1500);
            break;

        case 'animation':
            console.log("%c🎯 Lancement de l'animation points...", "color: yellow;");
            
            // L'animation réelle
            showPointsAnimation(100, 'Bien joué');
            showGemsAnimation(100, 'Incroyable');
            show
            break;

        default:
            console.log("%c❌ Commande inconnue: " + command, "color: red;");
            console.log("%c💡 Commandes: credit, admin, animation", "color: #ff9900;");
    }
};



// Message final
console.log("%c⚠️  Ces failles seront patchées bientôt... Prends soin de toi  ! berru-g", "color: #ff9900; font-style: italic;");

}, 2000); // Délai de 2 secondes