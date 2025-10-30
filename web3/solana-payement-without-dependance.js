// solana-payment-simple.js
class SolanaPaymentSimple {
    constructor() {
        this.merchantAddress = 'TON_ADRESSE_SOLANA'; // Remplace par ton adresse
        this.packPrices = {
            1: 0.03,  // 100 points ~ 0.03 SOL
            2: 0.12,  // 500 points ~ 0.12 SOL  
            3: 0.30   // 1500 points ~ 0.30 SOL
        };
    }

    async payWithSolana(packId) {
        try {
            // Vérifier Phantom Wallet
            if (!window.solana) {
                return this.fallbackToLemon(packId);
            }

            const solAmount = this.packPrices[packId];
            
            // Transaction simple
            const transaction = {
                recipient: this.merchantAddress,
                amount: solAmount,
                label: `Achat Pack ${packId} - 3DScrollAnimator`
            };

            // Ouvrir le wallet
            const response = await window.solana.connect();
            console.log('Wallet connecté:', response.publicKey.toString());
            
            // Envoyer la transaction (méthode simplifiée)
            // Note: En vrai, faudrait utiliser @solana/web3.js mais on garde simple
            
            notify.info('Redirection vers ton wallet...', 'Solana');
            
            // Fallback vers transfert manuel
            this.showManualPayment(packId, solAmount);
            
        } catch (error) {
            console.error('Erreur Solana:', error);
            this.fallbackToLemon(packId);
        }
    }

    showManualPayment(packId, solAmount) {
        const message = `
💰 **Paiement Manuel Solana**

📤 Envoie: ${solAmount} SOL
📍 À: ${this.merchantAddress}
📝 Référence: Pack ${packId}

Une fois envoyé, contacte-nous avec le hash de transaction!
        `;
        
        if (confirm(message + '\n\nCliquer OK pour copier l\'adresse')) {
            navigator.clipboard.writeText(this.merchantAddress);
            notify.success('Adresse copiée!', 'Solana');
        }
        
        // Fallback automatique après 5s
        setTimeout(() => {
            if (confirm('Paiement trop compliqué? Utiliser carte bancaire à la place?')) {
                this.fallbackToLemon(packId);
            }
        }, 5000);
    }

    fallbackToLemon(packId) {
        notify.info('Redirection vers paiement carte...', 'Lemon Squeezie');
        purchaseWithLemon(packId);
    }
}

// Utilisation ultra simple
const solanaPay = new SolanaPaymentSimple();

// Sur tes boutons d'achat
document.querySelectorAll('.buy-points').forEach(btn => {
    btn.onclick = function() {
        const packId = this.closest('.point-pack').dataset.packId;
        solanaPay.payWithSolana(packId);
    };
});