// crypto-price-service.js
class CryptoPriceService {
    constructor() {
        this.solToEur = 0;
        this.lastUpdate = 0;
        this.cacheDuration = 60000; // 1 minute
    }

    async getSolToEurPrice() {
        // Vérifier le cache
        if (Date.now() - this.lastUpdate < this.cacheDuration && this.solToEur > 0) {
            return this.solToEur;
        }

        try {
            const response = await fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=eur'
            );
            const data = await response.json();
            
            this.solToEur = data.solana.eur;
            this.lastUpdate = Date.now();
            
            console.log('💰 Prix SOL mis à jour:', this.solToEur + '€');
            return this.solToEur;
            
        } catch (error) {
            console.error('Erreur API CoinGecko:', error);
            // Fallback au dernier prix ou prix par défaut
            return this.solToEur || 150; // 150€ par défaut si erreur
        }
    }

    async eurToSol(eurAmount) {
        const solPrice = await this.getSolToEurPrice();
        const solAmount = eurAmount / solPrice;
        
        // Arrondir à 4 décimales pour éviter les micro-transactions
        return Math.round(solAmount * 10000) / 10000;
    }

    async solToEur(solAmount) {
        const solPrice = await this.getSolToEurPrice();
        return solAmount * solPrice;
    }
}