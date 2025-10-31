// npm install @solana/web3.js @solana/wallet-adapter-wallets @solana/wallet-adapter-base
class SolanaPayment {
    constructor() {
        this.connection = new Connection('https://api.mainnet-beta.solana.com');
        this.merchantWallet = new PublicKey('D6khWoqvc2zX46HVtSZcNrPumnPLPM72SnSuDhBrZeTC');
        this.priceService = new CryptoPriceService();
        
        // Prix des packs en EUR (fixes)
        this.packPricesEur = {
            1: 4.90,   // Pack Starter
            2: 19.90,  // Pack Pro  
            3: 49.90   // Pack Expert
        };
    }

    async getPackPriceSol(packId) {
        const eurPrice = this.packPricesEur[packId];
        if (!eurPrice) throw new Error('Pack invalide');
        
        const solPrice = await this.priceService.eurToSol(eurPrice);
        
        // Prix minimum pour éviter les micro-transactions
        return Math.max(solPrice, 0.001); // Au moins 0.001 SOL
    }

    async getPaymentDetails(packId) {
        const solAmount = await this.getPackPriceSol(packId);
        const eurAmount = this.packPricesEur[packId];
        const currentRate = await this.priceService.getSolToEurPrice();
        
        return {
            packId,
            solAmount,
            eurAmount, 
            currentRate,
            solAmountFormatted: solAmount.toFixed(4),
            eurEquivalent: (solAmount * currentRate).toFixed(2)
        };
    }

    async showPaymentModal(packId) {
        const details = await this.getPaymentDetails(packId);
        
        const modalHTML = `
            <div class="crypto-payment-modal">
                <div class="modal-header">
                    <h3>🪙 Paiement Crypto</h3>
                    <button class="close-btn">&times;</button>
                </div>
                
                <div class="payment-details">
                    <div class="amount-section">
                        <div class="crypto-amount">
                            ${details.solAmountFormatted} <strong>SOL</strong>
                        </div>
                        <div class="fiat-equivalent">
                            ≈ ${details.eurEquivalent} €
                        </div>
                    </div>
                    
                    <div class="rate-info">
                        <small>💱 1 SOL = ${details.currentRate.toFixed(2)} €</small>
                    </div>
                    
                    <div class="pack-info">
                        <strong>Pack ${this.getPackName(packId)}</strong>
                        <br>
                        <span class="points-amount">+${this.getPackPoints(packId)} 💎</span>
                    </div>
                </div>
                
                <div class="payment-actions">
                    <button class="btn btn-primary" onclick="solanaPayment.processPayment(${packId})">
                        🔷 Payer avec Solana
                    </button>
                    <button class="btn btn-secondary" onclick="purchaseWithLemon(${packId})">
                        💳 Payer par Carte
                    </button>
                </div>
                
                <div class="wallet-info">
                    <small>📍 Envoi vers: ${this.merchantWallet.toString().slice(0, 8)}...${this.merchantWallet.toString().slice(-8)}</small>
                </div>
            </div>
        `;
        
        this.showModal(modalHTML);
        return details;
    }

    async processPayment(packId) {
        try {
            const details = await this.getPaymentDetails(packId);
            
            if (!window.solana || !window.solana.isConnected) {
                await this.connectWallet();
            }

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: window.solana.publicKey,
                    toPubkey: this.merchantWallet,
                    lamports: details.solAmount * 1000000000
                })
            );

            const { signature } = await window.solana.signAndSendTransaction(transaction);
            const confirmation = await this.connection.confirmTransaction(signature);
            
            if (confirmation) {
                await this.creditPoints(packId, signature, details.solAmount);
                this.closeModal();
                return { success: true, signature, details };
            }

        } catch (error) {
            console.error('Erreur paiement Solana:', error);
            notify.error('Erreur de paiement', error.message);
            return { success: false, error: error.message };
        }
    }

    getPackName(packId) {
        const names = { 1: 'Starter', 2: 'Pro', 3: 'Expert' };
        return names[packId] || 'Inconnu';
    }

    getPackPoints(packId) {
        const points = { 1: 100, 2: 500, 3: 1500 };
        return points[packId] || 0;
    }

    // Méthodes UI pour la modal
    showModal(html) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = html;
        document.body.appendChild(modal);
        
        modal.querySelector('.close-btn').onclick = () => this.closeModal();
        modal.onclick = (e) => { if (e.target === modal) this.closeModal(); };
    }

    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) modal.remove();
    }
}
