// 🚀 Advanced AI Enhancement System for SamCrypto AI
// This module provides state-of-the-art AI capabilities for accurate crypto trading analysis

class AIEnhancementEngine {
    constructor() {
        // Advanced Technical Analysis Configuration
        this.indicators = {
            rsi: { period: 14, overbought: 70, oversold: 30 },
            macd: { fast: 12, slow: 26, signal: 9 },
            ema: { periods: [9, 21, 50, 200] },
            bollinger: { period: 20, stdDev: 2 },
            fibonacci: { levels: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1] },
            ichimoku: { tenkan: 9, kijun: 26, senkouB: 52 },
            stochastic: { period: 14, kPeriod: 3, dPeriod: 3 }
        };

        // Machine Learning Prediction Confidence System
        this.confidenceWeights = {
            technical: 0.25,      // Technical indicators
            fundamental: 0.20,    // Market fundamentals
            sentiment: 0.20,      // Social sentiment
            onchain: 0.15,        // On-chain metrics
            orderBook: 0.15,      // Order book depth
            correlation: 0.05     // Market correlation
        };

        // Pattern Recognition Database
        this.patterns = {
            bullish: [
                'double_bottom', 'inverse_head_shoulders', 'ascending_triangle',
                'cup_and_handle', 'bullish_flag', 'morning_star', 'hammer',
                'bullish_engulfing', 'piercing_pattern', 'three_white_soldiers'
            ],
            bearish: [
                'double_top', 'head_and_shoulders', 'descending_triangle',
                'bearish_flag', 'evening_star', 'shooting_star',
                'bearish_engulfing', 'dark_cloud_cover', 'three_black_crows'
            ],
            continuation: [
                'pennant', 'flag', 'wedge', 'rectangle'
            ]
        };

        // Market Regime Classification
        this.marketRegimes = {
            trending_up: { volatility: 'medium', direction: 'bullish' },
            trending_down: { volatility: 'medium', direction: 'bearish' },
            ranging: { volatility: 'low', direction: 'neutral' },
            volatile: { volatility: 'high', direction: 'uncertain' }
        };

        // Sentiment Analysis Sources
        this.sentimentSources = [
            'twitter', 'reddit', 'telegram', 'news', 'fear_greed_index'
        ];
    }

    /**
     * 🧠 Advanced Chain-of-Thought Reasoning System
     * This creates a step-by-step reasoning process like GPT-4
     */
    createChainOfThoughtPrompt(userMessage, marketData, context) {
        const cot = `
# CRYPTO ANALYSIS - CONCISE FORMAT

**Question:** "${userMessage}"
**Intent:** ${this.classifyIntent(userMessage)} | **Risk:** ${context.userProfile?.riskTolerance || 'moderate'}

## MARKET DATA:
${this.formatMarketData(marketData)}

## YOUR TASK:
Analyze using: RSI, MACD, EMA, Volume, Sentiment
Provide: Recommendation, Confidence %, Entry/Exit, Risk

## OUTPUT FORMAT (MUST FOLLOW):
Keep under 250 words. Use this structure:

📊 **[COIN] - $[PRICE] ([CHANGE]%)**

**Analysis:**
• Trend: [Direction] (Key indicators)
• Sentiment: [Score]/100
• Volume: [Level]

**Recommendation:** [Action]
**Confidence:** [%] ([Level])

**Strategy:**
• Entry: $[range]
• Target: $[price] (+%)
• Stop: $[price] (-%)
• Size: [%] portfolio

⚠️ **Risk:** [One sentence]

---

**RULES**:
✅ Maximum 250 words
✅ Use bullet points
✅ Real numbers from data
✅ Be direct and clear
✅ No long explanations
❌ No step-by-step thinking shown
❌ No multiple paragraphs
❌ No fluff or filler

User risk: ${context.userProfile?.riskTolerance || 'moderate'}
`;
        return cot;
    }

    /**
     * 📊 Advanced Technical Analysis Engine
     */
    async performTechnicalAnalysis(coinId, priceHistory) {
        const analysis = {
            trend: {},
            momentum: {},
            volatility: {},
            patterns: [],
            signals: [],
            score: 0
        };

        try {
            // Ensure we have price history
            if (!priceHistory || priceHistory.length < 50) {
                console.warn('Insufficient price history for deep technical analysis');
                return this.getBasicTechnicalAnalysis(coinId);
            }

            // 1. Trend Analysis
            analysis.trend = this.analyzeTrend(priceHistory);
            
            // 2. Momentum Indicators
            analysis.momentum = this.calculateMomentumIndicators(priceHistory);
            
            // 3. Volatility Metrics
            analysis.volatility = this.calculateVolatility(priceHistory);
            
            // 4. Pattern Recognition
            analysis.patterns = this.detectPatterns(priceHistory);
            
            // 5. Generate Trading Signals
            analysis.signals = this.generateSignals(analysis);
            
            // 6. Calculate Overall Technical Score (0-100)
            analysis.score = this.calculateTechnicalScore(analysis);

            return analysis;
        } catch (error) {
            console.error('Technical analysis error:', error);
            return this.getBasicTechnicalAnalysis(coinId);
        }
    }

    /**
     * 📈 Trend Analysis using Multiple EMAs
     */
    analyzeTrend(prices) {
        const closePrices = prices.map(p => p.close || p.price || p);
        const currentPrice = closePrices[closePrices.length - 1];

        const ema9 = this.calculateEMA(closePrices, 9);
        const ema21 = this.calculateEMA(closePrices, 21);
        const ema50 = this.calculateEMA(closePrices, 50);
        const ema200 = closePrices.length >= 200 ? this.calculateEMA(closePrices, 200) : null;

        const trend = {
            direction: 'neutral',
            strength: 0,
            ema9: ema9,
            ema21: ema21,
            ema50: ema50,
            ema200: ema200,
            currentPrice: currentPrice
        };

        // Determine trend direction
        if (ema9 > ema21 && ema21 > ema50) {
            trend.direction = 'bullish';
            trend.strength = this.calculateTrendStrength(ema9, ema21, ema50);
        } else if (ema9 < ema21 && ema21 < ema50) {
            trend.direction = 'bearish';
            trend.strength = this.calculateTrendStrength(ema9, ema21, ema50);
        }

        // Golden Cross / Death Cross
        if (ema50 && ema200) {
            if (ema50 > ema200 && closePrices[closePrices.length - 2] <= ema200) {
                trend.goldenCross = true;
            } else if (ema50 < ema200 && closePrices[closePrices.length - 2] >= ema200) {
                trend.deathCross = true;
            }
        }

        return trend;
    }

    /**
     * 💪 Calculate Momentum Indicators
     */
    calculateMomentumIndicators(prices) {
        const closePrices = prices.map(p => p.close || p.price || p);
        
        return {
            rsi: this.calculateRSI(closePrices, 14),
            macd: this.calculateMACD(closePrices),
            stochastic: this.calculateStochastic(prices),
            momentum: this.calculateMomentum(closePrices, 10)
        };
    }

    /**
     * 📉 RSI Calculation
     */
    calculateRSI(prices, period = 14) {
        if (prices.length < period + 1) return null;

        let gains = 0;
        let losses = 0;

        // Calculate initial average gain/loss
        for (let i = 1; i <= period; i++) {
            const change = prices[i] - prices[i - 1];
            if (change > 0) gains += change;
            else losses += Math.abs(change);
        }

        let avgGain = gains / period;
        let avgLoss = losses / period;

        // Calculate RSI using smoothed averages
        for (let i = period + 1; i < prices.length; i++) {
            const change = prices[i] - prices[i - 1];
            const gain = change > 0 ? change : 0;
            const loss = change < 0 ? Math.abs(change) : 0;

            avgGain = (avgGain * (period - 1) + gain) / period;
            avgLoss = (avgLoss * (period - 1) + loss) / period;
        }

        if (avgLoss === 0) return 100;
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));

        return {
            value: rsi,
            signal: rsi > 70 ? 'overbought' : rsi < 30 ? 'oversold' : 'neutral',
            strength: rsi > 70 || rsi < 30 ? 'strong' : rsi > 60 || rsi < 40 ? 'moderate' : 'weak'
        };
    }

    /**
     * 📊 MACD Calculation
     */
    calculateMACD(prices, fast = 12, slow = 26, signal = 9) {
        if (prices.length < slow) return null;

        const emaFast = this.calculateEMA(prices, fast);
        const emaSlow = this.calculateEMA(prices, slow);
        const macdLine = emaFast - emaSlow;

        // Calculate signal line (EMA of MACD)
        const macdHistory = [];
        for (let i = slow; i < prices.length; i++) {
            const emaF = this.calculateEMA(prices.slice(0, i), fast);
            const emaS = this.calculateEMA(prices.slice(0, i), slow);
            macdHistory.push(emaF - emaS);
        }

        const signalLine = this.calculateEMA(macdHistory, signal);
        const histogram = macdLine - signalLine;

        return {
            macd: macdLine,
            signal: signalLine,
            histogram: histogram,
            signal_type: histogram > 0 ? 'bullish' : 'bearish',
            crossover: this.detectMACDCrossover(macdHistory, signal)
        };
    }

    /**
     * 📐 EMA Calculation
     */
    calculateEMA(prices, period) {
        if (prices.length < period) return null;

        const multiplier = 2 / (period + 1);
        let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;

        for (let i = period; i < prices.length; i++) {
            ema = (prices[i] - ema) * multiplier + ema;
        }

        return ema;
    }

    /**
     * 🎯 Calculate Volatility Metrics
     */
    calculateVolatility(prices) {
        const closePrices = prices.map(p => p.close || p.price || p);
        const returns = [];

        for (let i = 1; i < closePrices.length; i++) {
            returns.push((closePrices[i] - closePrices[i - 1]) / closePrices[i - 1]);
        }

        const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
        const stdDev = Math.sqrt(variance);

        // Bollinger Bands
        const sma20 = this.calculateSMA(closePrices, 20);
        const upperBand = sma20 + (stdDev * 2);
        const lowerBand = sma20 - (stdDev * 2);
        const currentPrice = closePrices[closePrices.length - 1];

        return {
            standardDeviation: stdDev,
            annualizedVolatility: stdDev * Math.sqrt(365) * 100,
            bollingerBands: {
                upper: upperBand,
                middle: sma20,
                lower: lowerBand,
                position: currentPrice > upperBand ? 'above_upper' : 
                         currentPrice < lowerBand ? 'below_lower' : 'inside'
            },
            volatilityScore: Math.min(100, (stdDev * 1000)) // 0-100 scale
        };
    }

    /**
     * 📊 SMA Calculation
     */
    calculateSMA(prices, period) {
        if (prices.length < period) return null;
        const slice = prices.slice(-period);
        return slice.reduce((a, b) => a + b, 0) / period;
    }

    /**
     * 🔍 Pattern Detection
     */
    detectPatterns(prices) {
        const patterns = [];
        
        // Detect common patterns
        if (this.isDoubleBottom(prices)) patterns.push({ name: 'Double Bottom', type: 'bullish', confidence: 75 });
        if (this.isDoubleTop(prices)) patterns.push({ name: 'Double Top', type: 'bearish', confidence: 75 });
        if (this.isHeadAndShoulders(prices)) patterns.push({ name: 'Head and Shoulders', type: 'bearish', confidence: 80 });
        if (this.isBullishEngulfing(prices)) patterns.push({ name: 'Bullish Engulfing', type: 'bullish', confidence: 70 });
        if (this.isBearishEngulfing(prices)) patterns.push({ name: 'Bearish Engulfing', type: 'bearish', confidence: 70 });

        return patterns;
    }

    /**
     * 🎲 Simple pattern detection helpers
     */
    isDoubleBottom(prices) {
        if (prices.length < 20) return false;
        const recent = prices.slice(-20);
        const lows = recent.map((p, i) => ({ price: p.low || p, index: i }))
            .sort((a, b) => a.price - b.price);
        
        // Check if two lowest points are similar and separated
        if (lows.length >= 2) {
            const diff = Math.abs(lows[0].price - lows[1].price) / lows[0].price;
            const separation = Math.abs(lows[0].index - lows[1].index);
            return diff < 0.02 && separation > 5;
        }
        return false;
    }

    isDoubleTop(prices) {
        if (prices.length < 20) return false;
        const recent = prices.slice(-20);
        const highs = recent.map((p, i) => ({ price: p.high || p, index: i }))
            .sort((a, b) => b.price - a.price);
        
        if (highs.length >= 2) {
            const diff = Math.abs(highs[0].price - highs[1].price) / highs[0].price;
            const separation = Math.abs(highs[0].index - highs[1].index);
            return diff < 0.02 && separation > 5;
        }
        return false;
    }

    isHeadAndShoulders(prices) {
        // Simplified detection - needs 3 peaks with middle one highest
        if (prices.length < 30) return false;
        const recent = prices.slice(-30);
        const peaks = this.findPeaks(recent);
        
        if (peaks.length >= 3) {
            const sorted = [...peaks].sort((a, b) => b.price - a.price);
            const head = sorted[0];
            const shoulders = peaks.filter(p => p !== head);
            
            if (shoulders.length >= 2) {
                const avgShoulder = shoulders.reduce((sum, s) => sum + s.price, 0) / shoulders.length;
                return head.price > avgShoulder * 1.05;
            }
        }
        return false;
    }

    isBullishEngulfing(prices) {
        if (prices.length < 2) return false;
        const prev = prices[prices.length - 2];
        const curr = prices[prices.length - 1];
        
        const prevClose = prev.close || prev;
        const prevOpen = prev.open || prevClose * 0.99;
        const currClose = curr.close || curr;
        const currOpen = curr.open || currClose * 1.01;
        
        return prevClose < prevOpen && // Previous was bearish
               currClose > currOpen && // Current is bullish
               currOpen < prevClose && // Opens below previous close
               currClose > prevOpen;   // Closes above previous open
    }

    isBearishEngulfing(prices) {
        if (prices.length < 2) return false;
        const prev = prices[prices.length - 2];
        const curr = prices[prices.length - 1];
        
        const prevClose = prev.close || prev;
        const prevOpen = prev.open || prevClose * 1.01;
        const currClose = curr.close || curr;
        const currOpen = curr.open || currClose * 0.99;
        
        return prevClose > prevOpen && // Previous was bullish
               currClose < currOpen && // Current is bearish
               currOpen > prevClose && // Opens above previous close
               currClose < prevOpen;   // Closes below previous open
    }

    /**
     * 🔎 Find peaks in price data
     */
    findPeaks(prices) {
        const peaks = [];
        for (let i = 1; i < prices.length - 1; i++) {
            const price = prices[i].high || prices[i];
            const prevPrice = prices[i - 1].high || prices[i - 1];
            const nextPrice = prices[i + 1].high || prices[i + 1];
            
            if (price > prevPrice && price > nextPrice) {
                peaks.push({ price, index: i });
            }
        }
        return peaks;
    }

    /**
     * 📊 Calculate Stochastic Oscillator
     */
    calculateStochastic(prices, period = 14) {
        if (prices.length < period) return null;

        const recent = prices.slice(-period);
        const currentClose = recent[recent.length - 1].close || recent[recent.length - 1];
        const highestHigh = Math.max(...recent.map(p => p.high || p));
        const lowestLow = Math.min(...recent.map(p => p.low || p));

        const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;

        return {
            k: k,
            signal: k > 80 ? 'overbought' : k < 20 ? 'oversold' : 'neutral'
        };
    }

    /**
     * 📈 Calculate Momentum
     */
    calculateMomentum(prices, period = 10) {
        if (prices.length < period) return null;
        const current = prices[prices.length - 1];
        const past = prices[prices.length - period - 1];
        return ((current - past) / past) * 100;
    }

    /**
     * 🎯 Generate Trading Signals
     */
    generateSignals(analysis) {
        const signals = [];

        // Trend signals
        if (analysis.trend.direction === 'bullish' && analysis.trend.strength > 60) {
            signals.push({ type: 'BUY', reason: 'Strong bullish trend', weight: 0.8 });
        } else if (analysis.trend.direction === 'bearish' && analysis.trend.strength > 60) {
            signals.push({ type: 'SELL', reason: 'Strong bearish trend', weight: 0.8 });
        }

        // RSI signals
        if (analysis.momentum.rsi) {
            if (analysis.momentum.rsi.value < 30) {
                signals.push({ type: 'BUY', reason: 'RSI oversold', weight: 0.7 });
            } else if (analysis.momentum.rsi.value > 70) {
                signals.push({ type: 'SELL', reason: 'RSI overbought', weight: 0.7 });
            }
        }

        // MACD signals
        if (analysis.momentum.macd) {
            if (analysis.momentum.macd.signal_type === 'bullish' && analysis.momentum.macd.histogram > 0) {
                signals.push({ type: 'BUY', reason: 'MACD bullish crossover', weight: 0.75 });
            } else if (analysis.momentum.macd.signal_type === 'bearish' && analysis.momentum.macd.histogram < 0) {
                signals.push({ type: 'SELL', reason: 'MACD bearish crossover', weight: 0.75 });
            }
        }

        // Pattern signals
        analysis.patterns.forEach(pattern => {
            if (pattern.type === 'bullish') {
                signals.push({ type: 'BUY', reason: `${pattern.name} pattern detected`, weight: pattern.confidence / 100 });
            } else if (pattern.type === 'bearish') {
                signals.push({ type: 'SELL', reason: `${pattern.name} pattern detected`, weight: pattern.confidence / 100 });
            }
        });

        return signals;
    }

    /**
     * 🏆 Calculate Overall Technical Score
     */
    calculateTechnicalScore(analysis) {
        let score = 50; // Neutral baseline

        // Trend contribution (±20 points)
        if (analysis.trend.direction === 'bullish') {
            score += analysis.trend.strength * 0.2;
        } else if (analysis.trend.direction === 'bearish') {
            score -= analysis.trend.strength * 0.2;
        }

        // RSI contribution (±15 points)
        if (analysis.momentum.rsi) {
            if (analysis.momentum.rsi.value < 30) score += 15;
            else if (analysis.momentum.rsi.value > 70) score -= 15;
            else if (analysis.momentum.rsi.value < 40) score += 7;
            else if (analysis.momentum.rsi.value > 60) score -= 7;
        }

        // MACD contribution (±10 points)
        if (analysis.momentum.macd) {
            if (analysis.momentum.macd.histogram > 0) score += 10;
            else score -= 10;
        }

        // Pattern contribution (±15 points)
        const bullishPatterns = analysis.patterns.filter(p => p.type === 'bullish').length;
        const bearishPatterns = analysis.patterns.filter(p => p.type === 'bearish').length;
        score += (bullishPatterns * 5) - (bearishPatterns * 5);

        return Math.max(0, Math.min(100, score));
    }

    /**
     * 🎯 Calculate Prediction Confidence
     */
    calculateConfidence(technicalAnalysis, marketData, sentiment) {
        let confidence = 0;

        // Technical Analysis Weight (25%)
        if (technicalAnalysis && technicalAnalysis.score) {
            const techScore = technicalAnalysis.score > 50 ? 
                (technicalAnalysis.score - 50) / 50 : 
                (50 - technicalAnalysis.score) / 50;
            confidence += techScore * this.confidenceWeights.technical * 100;
        }

        // Volume & Liquidity Weight (20%)
        if (marketData && marketData.volume) {
            const volumeScore = Math.min(1, marketData.volume / 1000000000); // Normalize to billions
            confidence += volumeScore * this.confidenceWeights.fundamental * 100;
        }

        // Market Cap Weight (15%)
        if (marketData && marketData.market_cap) {
            const mcapScore = Math.min(1, marketData.market_cap / 100000000000); // Normalize to 100B
            confidence += mcapScore * 0.15 * 100;
        }

        // Price Change Consistency (20%)
        if (marketData && marketData.price_change_24h !== undefined) {
            const changeScore = Math.abs(marketData.price_change_24h) < 10 ? 1 : 0.5;
            confidence += changeScore * this.confidenceWeights.sentiment * 100;
        }

        // Normalize to 0-100
        return Math.min(100, Math.max(0, confidence));
    }

    /**
     * 🎯 Helper Functions
     */
    calculateTrendStrength(ema9, ema21, ema50) {
        const spread = Math.abs(ema9 - ema50) / ema50 * 100;
        return Math.min(100, spread * 10); // 0-100 scale
    }

    detectMACDCrossover(macdHistory, signalPeriod) {
        if (macdHistory.length < signalPeriod + 2) return null;
        const current = macdHistory[macdHistory.length - 1];
        const previous = macdHistory[macdHistory.length - 2];
        const signalCurrent = this.calculateEMA(macdHistory.slice(-signalPeriod), signalPeriod);
        const signalPrevious = this.calculateEMA(macdHistory.slice(-signalPeriod - 1, -1), signalPeriod);

        if (current > signalCurrent && previous <= signalPrevious) {
            return 'bullish_crossover';
        } else if (current < signalCurrent && previous >= signalPrevious) {
            return 'bearish_crossover';
        }
        return null;
    }

    classifyIntent(message) {
        const msg = message.toLowerCase();
        if (msg.includes('buy') || msg.includes('invest')) return 'trading_decision';
        if (msg.includes('analyze') || msg.includes('analysis')) return 'technical_analysis';
        if (msg.includes('price')) return 'price_inquiry';
        if (msg.includes('predict') || msg.includes('future')) return 'prediction';
        if (msg.includes('compare')) return 'comparison';
        return 'general_inquiry';
    }

    extractCoins(message) {
        const coins = [];
        const coinKeywords = ['bitcoin', 'btc', 'ethereum', 'eth', 'solana', 'sol', 'cardano', 'ada', 'ripple', 'xrp', 'dogecoin', 'doge'];
        const msg = message.toLowerCase();
        coinKeywords.forEach(coin => {
            if (msg.includes(coin)) coins.push(coin);
        });
        return coins.length > 0 ? coins.join(', ') : 'not specified';
    }

    extractTimeHorizon(message) {
        const msg = message.toLowerCase();
        if (msg.includes('short') || msg.includes('day trade') || msg.includes('scalp')) return 'short-term';
        if (msg.includes('long') || msg.includes('hold') || msg.includes('invest')) return 'long-term';
        if (msg.includes('swing')) return 'medium-term';
        return 'medium-term';
    }

    formatMarketData(marketData) {
        if (!marketData || Object.keys(marketData).length === 0) {
            return 'Market data not available';
        }

        let formatted = '### REAL-TIME MARKET DATA:\n';
        for (const [coin, data] of Object.entries(marketData)) {
            if (data && typeof data === 'object') {
                formatted += `\n**${coin.toUpperCase()}:**\n`;
                formatted += `- Price: $${data.price || data.current_price || 'N/A'}\n`;
                formatted += `- 24h Change: ${data.price_change_24h || data.change_24h || 'N/A'}%\n`;
                formatted += `- Volume: $${data.volume || data.total_volume || 'N/A'}\n`;
                formatted += `- Market Cap: $${data.market_cap || 'N/A'}\n`;
                if (data.high_24h) formatted += `- 24h High: $${data.high_24h}\n`;
                if (data.low_24h) formatted += `- 24h Low: $${data.low_24h}\n`;
            }
        }
        return formatted;
    }

    getBasicTechnicalAnalysis(coinId) {
        return {
            trend: { direction: 'neutral', strength: 50 },
            momentum: { rsi: { value: 50, signal: 'neutral' } },
            volatility: { volatilityScore: 50 },
            patterns: [],
            signals: [],
            score: 50
        };
    }
}

// Export for use in main application
window.AIEnhancementEngine = AIEnhancementEngine;

