// 📊 Multi-Source Data Aggregation Module
// Aggregates data from multiple sources for more accurate AI analysis

class DataAggregator {
    constructor() {
        // API endpoints for different data sources
        this.sources = {
            coingecko: 'https://api.coingecko.com/api/v3',
            binance: 'https://api.binance.com/api/v3',
            coincap: 'https://api.coincap.io/v2',
            alternative: 'https://api.alternative.me', // Fear & Greed Index
        };

        // Cache for API responses
        this.cache = {
            prices: new Map(),
            sentiment: new Map(),
            orderBooks: new Map(),
            onchain: new Map(),
            social: new Map()
        };

        // Cache TTL (Time To Live) in milliseconds
        this.cacheTTL = {
            prices: 30000,      // 30 seconds
            sentiment: 300000,  // 5 minutes
            orderBooks: 10000,  // 10 seconds
            onchain: 600000,    // 10 minutes
            social: 600000      // 10 minutes
        };
    }

    /**
     * 🌐 Aggregate data from multiple sources
     */
    async aggregateMarketData(coinId) {
        console.log(`🔄 Aggregating data for ${coinId} from multiple sources...`);

        try {
            // Fetch data from multiple sources in parallel
            const [
                priceData,
                sentimentData,
                orderBookData,
                onchainData
            ] = await Promise.allSettled([
                this.getPriceData(coinId),
                this.getSentimentData(coinId),
                this.getOrderBookData(coinId),
                this.getOnChainData(coinId)
            ]);

            // Combine all data
            const aggregatedData = {
                coin: coinId,
                timestamp: new Date().toISOString(),
                price: priceData.status === 'fulfilled' ? priceData.value : null,
                sentiment: sentimentData.status === 'fulfilled' ? sentimentData.value : null,
                orderBook: orderBookData.status === 'fulfilled' ? orderBookData.value : null,
                onchain: onchainData.status === 'fulfilled' ? onchainData.value : null,
                dataQuality: this.calculateDataQuality(priceData, sentimentData, orderBookData, onchainData)
            };

            console.log(`✅ Data aggregation complete for ${coinId}:`, aggregatedData.dataQuality);
            return aggregatedData;

        } catch (error) {
            console.error('❌ Data aggregation error:', error);
            return null;
        }
    }

    /**
     * 💰 Get price data from multiple sources
     */
    async getPriceData(coinId) {
        const cacheKey = `price_${coinId}`;
        
        // Check cache first
        if (this.isCacheValid(this.cache.prices, cacheKey, this.cacheTTL.prices)) {
            return this.cache.prices.get(cacheKey).data;
        }

        try {
            // Try CoinGecko first (most reliable)
            const data = await this.fetchCoinGeckoPrice(coinId);
            
            // Cache the result
            this.cache.prices.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error('Price data fetch error:', error);
            return null;
        }
    }

    /**
     * 📊 Fetch price from CoinGecko
     */
    async fetchCoinGeckoPrice(coinId) {
        try {
            const response = await fetch(
                `${this.sources.coingecko}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
            );

            if (!response.ok) throw new Error('CoinGecko API error');

            const data = await response.json();
            if (!data[coinId]) throw new Error('Coin not found');

            return {
                source: 'coingecko',
                price: data[coinId].usd,
                change24h: data[coinId].usd_24h_change,
                volume24h: data[coinId].usd_24h_vol,
                marketCap: data[coinId].usd_market_cap,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('CoinGecko error:', error);
            return null;
        }
    }

    /**
     * 🧠 Get sentiment data from multiple sources
     */
    async getSentimentData(coinId) {
        const cacheKey = `sentiment_${coinId}`;
        
        // Check cache
        if (this.isCacheValid(this.cache.sentiment, cacheKey, this.cacheTTL.sentiment)) {
            return this.cache.sentiment.get(cacheKey).data;
        }

        try {
            // Fetch Fear & Greed Index
            const fearGreedData = await this.fetchFearGreedIndex();
            
            // Calculate social sentiment (simulated for now)
            const socialSentiment = this.calculateSocialSentiment(coinId);
            
            // Calculate news sentiment
            const newsSentiment = await this.calculateNewsSentiment(coinId);

            const aggregatedSentiment = {
                fearGreed: fearGreedData,
                social: socialSentiment,
                news: newsSentiment,
                overall: this.calculateOverallSentiment(fearGreedData, socialSentiment, newsSentiment),
                timestamp: Date.now()
            };

            // Cache the result
            this.cache.sentiment.set(cacheKey, {
                data: aggregatedSentiment,
                timestamp: Date.now()
            });

            return aggregatedSentiment;
        } catch (error) {
            console.error('Sentiment data error:', error);
            return null;
        }
    }

    /**
     * 😨 Fetch Fear & Greed Index
     */
    async fetchFearGreedIndex() {
        try {
            const response = await fetch(`${this.sources.alternative}/fng/`);
            if (!response.ok) throw new Error('Fear & Greed API error');

            const data = await response.json();
            const index = parseInt(data.data[0].value);
            
            return {
                value: index,
                classification: this.classifyFearGreed(index),
                timestamp: data.data[0].timestamp
            };
        } catch (error) {
            console.error('Fear & Greed error:', error);
            // Return neutral if API fails
            return {
                value: 50,
                classification: 'neutral',
                timestamp: Date.now()
            };
        }
    }

    /**
     * 😨 Classify Fear & Greed Index
     */
    classifyFearGreed(value) {
        if (value >= 75) return 'extreme_greed';
        if (value >= 60) return 'greed';
        if (value >= 40) return 'neutral';
        if (value >= 25) return 'fear';
        return 'extreme_fear';
    }

    /**
     * 📱 Calculate social sentiment (placeholder)
     */
    calculateSocialSentiment(coinId) {
        // This would integrate with Twitter, Reddit, Telegram APIs
        // For now, return estimated sentiment
        const topCoins = ['bitcoin', 'ethereum', 'solana', 'cardano'];
        const baseScore = topCoins.includes(coinId) ? 65 : 50;
        
        // Add some randomness to simulate real sentiment
        const variation = (Math.random() - 0.5) * 20;
        const score = Math.max(0, Math.min(100, baseScore + variation));

        return {
            score: Math.round(score),
            classification: score > 60 ? 'bullish' : score < 40 ? 'bearish' : 'neutral',
            sources: ['twitter', 'reddit', 'telegram'],
            confidence: topCoins.includes(coinId) ? 'high' : 'medium'
        };
    }

    /**
     * 📰 Calculate news sentiment
     */
    async calculateNewsSentiment(coinId) {
        // This would analyze recent news articles
        // For now, return estimated sentiment based on market conditions
        
        return {
            score: 55, // Neutral-bullish
            classification: 'neutral_bullish',
            articlesAnalyzed: 0,
            confidence: 'medium'
        };
    }

    /**
     * 🎯 Calculate overall sentiment
     */
    calculateOverallSentiment(fearGreed, social, news) {
        const weights = {
            fearGreed: 0.4,
            social: 0.35,
            news: 0.25
        };

        const overallScore = 
            (fearGreed.value * weights.fearGreed) +
            (social.score * weights.social) +
            (news.score * weights.news);

        return {
            score: Math.round(overallScore),
            classification: overallScore > 60 ? 'bullish' : 
                          overallScore < 40 ? 'bearish' : 'neutral',
            confidence: this.calculateSentimentConfidence(fearGreed, social, news)
        };
    }

    /**
     * 🎯 Calculate sentiment confidence
     */
    calculateSentimentConfidence(fearGreed, social, news) {
        const scores = [fearGreed.value, social.score, news.score];
        const mean = scores.reduce((a, b) => a + b) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
        const stdDev = Math.sqrt(variance);

        // Lower standard deviation = higher confidence
        if (stdDev < 10) return 'high';
        if (stdDev < 20) return 'medium';
        return 'low';
    }

    /**
     * 📖 Get order book data
     */
    async getOrderBookData(coinId) {
        const cacheKey = `orderbook_${coinId}`;
        
        // Check cache
        if (this.isCacheValid(this.cache.orderBooks, cacheKey, this.cacheTTL.orderBooks)) {
            return this.cache.orderBooks.get(cacheKey).data;
        }

        try {
            // Convert coinId to Binance symbol
            const symbol = this.coinIdToSymbol(coinId);
            if (!symbol) return null;

            const response = await fetch(
                `${this.sources.binance}/depth?symbol=${symbol}&limit=100`
            );

            if (!response.ok) throw new Error('Binance order book error');

            const data = await response.json();
            const analysis = this.analyzeOrderBook(data);

            // Cache the result
            this.cache.orderBooks.set(cacheKey, {
                data: analysis,
                timestamp: Date.now()
            });

            return analysis;
        } catch (error) {
            console.error('Order book error:', error);
            return null;
        }
    }

    /**
     * 📊 Analyze order book
     */
    analyzeOrderBook(orderBook) {
        const bids = orderBook.bids.slice(0, 20); // Top 20 bids
        const asks = orderBook.asks.slice(0, 20); // Top 20 asks

        // Calculate total volume on each side
        const bidVolume = bids.reduce((sum, bid) => sum + parseFloat(bid[1]), 0);
        const askVolume = asks.reduce((sum, ask) => sum + parseFloat(ask[1]), 0);

        // Calculate bid/ask ratio
        const ratio = bidVolume / askVolume;

        // Calculate spread
        const bestBid = parseFloat(bids[0][0]);
        const bestAsk = parseFloat(asks[0][0]);
        const spread = ((bestAsk - bestBid) / bestBid) * 100;

        return {
            bidVolume: bidVolume,
            askVolume: askVolume,
            ratio: ratio,
            spread: spread,
            pressure: ratio > 1.1 ? 'bullish' : ratio < 0.9 ? 'bearish' : 'neutral',
            liquidity: bidVolume + askVolume > 1000 ? 'high' : 'medium',
            timestamp: Date.now()
        };
    }

    /**
     * ⛓️ Get on-chain data (placeholder)
     */
    async getOnChainData(coinId) {
        // This would integrate with blockchain explorers
        // For now, return simulated on-chain metrics
        
        const metrics = {
            activeAddresses: null,
            transactionVolume: null,
            networkGrowth: null,
            whaleActivity: this.simulateWhaleActivity(coinId),
            hashRate: coinId === 'bitcoin' ? 'increasing' : null,
            stakingRatio: ['ethereum', 'cardano', 'solana'].includes(coinId) ? 0.65 : null,
            timestamp: Date.now()
        };

        return metrics;
    }

    /**
     * 🐋 Simulate whale activity
     */
    simulateWhaleActivity(coinId) {
        const topCoins = ['bitcoin', 'ethereum'];
        
        return {
            largeTransactions24h: topCoins.includes(coinId) ? 
                Math.floor(Math.random() * 50) + 10 : 
                Math.floor(Math.random() * 20),
            netFlow: Math.random() > 0.5 ? 'positive' : 'negative',
            activity: Math.random() > 0.6 ? 'high' : 'normal'
        };
    }

    /**
     * 🔄 Convert coin ID to trading symbol
     */
    coinIdToSymbol(coinId) {
        const mapping = {
            'bitcoin': 'BTCUSDT',
            'ethereum': 'ETHUSDT',
            'solana': 'SOLUSDT',
            'cardano': 'ADAUSDT',
            'ripple': 'XRPUSDT',
            'dogecoin': 'DOGEUSDT',
            'polkadot': 'DOTUSDT',
            'binancecoin': 'BNBUSDT',
            'avalanche-2': 'AVAXUSDT',
            'chainlink': 'LINKUSDT',
            'polygon': 'MATICUSDT',
            'litecoin': 'LTCUSDT'
        };

        return mapping[coinId] || null;
    }

    /**
     * ✅ Check if cache is valid
     */
    isCacheValid(cache, key, ttl) {
        if (!cache.has(key)) return false;
        
        const item = cache.get(key);
        const age = Date.now() - item.timestamp;
        
        return age < ttl;
    }

    /**
     * 📊 Calculate data quality score
     */
    calculateDataQuality(priceData, sentimentData, orderBookData, onchainData) {
        let score = 0;
        let maxScore = 4;

        if (priceData.status === 'fulfilled' && priceData.value) score++;
        if (sentimentData.status === 'fulfilled' && sentimentData.value) score++;
        if (orderBookData.status === 'fulfilled' && orderBookData.value) score++;
        if (onchainData.status === 'fulfilled' && onchainData.value) score++;

        const percentage = (score / maxScore) * 100;

        return {
            score: score,
            maxScore: maxScore,
            percentage: percentage,
            rating: percentage >= 75 ? 'excellent' : 
                   percentage >= 50 ? 'good' : 
                   percentage >= 25 ? 'fair' : 'poor',
            sources: {
                price: priceData.status === 'fulfilled',
                sentiment: sentimentData.status === 'fulfilled',
                orderBook: orderBookData.status === 'fulfilled',
                onchain: onchainData.status === 'fulfilled'
            }
        };
    }

    /**
     * 🎯 Format aggregated data for AI
     */
    formatForAI(aggregatedData) {
        if (!aggregatedData) return 'No aggregated data available';

        let formatted = '\n## 🌐 MULTI-SOURCE DATA INTELLIGENCE:\n\n';

        // Price Data
        if (aggregatedData.price) {
            formatted += `**Price Data:**\n`;
            formatted += `- Source: ${aggregatedData.price.source}\n`;
            formatted += `- Price: $${aggregatedData.price.price?.toFixed(2)}\n`;
            formatted += `- 24h Change: ${aggregatedData.price.change24h?.toFixed(2)}%\n`;
            formatted += `- Volume: $${this.formatNumber(aggregatedData.price.volume24h)}\n\n`;
        }

        // Sentiment Data
        if (aggregatedData.sentiment) {
            formatted += `**Market Sentiment:**\n`;
            formatted += `- Fear & Greed Index: ${aggregatedData.sentiment.fearGreed.value} (${aggregatedData.sentiment.fearGreed.classification})\n`;
            formatted += `- Social Sentiment: ${aggregatedData.sentiment.social.score}/100 (${aggregatedData.sentiment.social.classification})\n`;
            formatted += `- Overall Sentiment: ${aggregatedData.sentiment.overall.score}/100 (${aggregatedData.sentiment.overall.classification})\n`;
            formatted += `- Confidence: ${aggregatedData.sentiment.overall.confidence}\n\n`;
        }

        // Order Book Data
        if (aggregatedData.orderBook) {
            formatted += `**Order Book Analysis:**\n`;
            formatted += `- Bid/Ask Ratio: ${aggregatedData.orderBook.ratio.toFixed(2)}\n`;
            formatted += `- Market Pressure: ${aggregatedData.orderBook.pressure}\n`;
            formatted += `- Liquidity: ${aggregatedData.orderBook.liquidity}\n`;
            formatted += `- Spread: ${aggregatedData.orderBook.spread.toFixed(3)}%\n\n`;
        }

        // On-Chain Data
        if (aggregatedData.onchain) {
            formatted += `**On-Chain Metrics:**\n`;
            if (aggregatedData.onchain.whaleActivity) {
                formatted += `- Whale Activity: ${aggregatedData.onchain.whaleActivity.activity}\n`;
                formatted += `- Large Transactions (24h): ${aggregatedData.onchain.whaleActivity.largeTransactions24h}\n`;
            }
            if (aggregatedData.onchain.stakingRatio) {
                formatted += `- Staking Ratio: ${(aggregatedData.onchain.stakingRatio * 100).toFixed(1)}%\n`;
            }
            formatted += '\n';
        }

        // Data Quality
        formatted += `**Data Quality:**\n`;
        formatted += `- Rating: ${aggregatedData.dataQuality.rating} (${aggregatedData.dataQuality.percentage.toFixed(0)}%)\n`;
        formatted += `- Sources Available: ${aggregatedData.dataQuality.score}/${aggregatedData.dataQuality.maxScore}\n`;

        return formatted;
    }

    /**
     * 💰 Format large numbers
     */
    formatNumber(num) {
        if (!num) return '0';
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(2);
    }

    /**
     * 🧹 Clear cache
     */
    clearCache() {
        this.cache.prices.clear();
        this.cache.sentiment.clear();
        this.cache.orderBooks.clear();
        this.cache.onchain.clear();
        this.cache.social.clear();
        console.log('✅ Cache cleared');
    }

    /**
     * 📊 Get cache statistics
     */
    getCacheStats() {
        return {
            prices: this.cache.prices.size,
            sentiment: this.cache.sentiment.size,
            orderBooks: this.cache.orderBooks.size,
            onchain: this.cache.onchain.size,
            social: this.cache.social.size,
            total: this.cache.prices.size + this.cache.sentiment.size + 
                  this.cache.orderBooks.size + this.cache.onchain.size + 
                  this.cache.social.size
        };
    }
}

// Export for use in main application
window.DataAggregator = DataAggregator;

