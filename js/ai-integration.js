// 🔗 AI Integration Module - Connects Advanced AI Engine to SamCrypto AI
// This module integrates the AI Enhancement Engine with the main application

(function() {
    'use strict';

    // Wait for both main app and AI engine to load
    window.addEventListener('DOMContentLoaded', function() {
        initializeAIEnhancements();
    });

    function initializeAIEnhancements() {
        console.log('🚀 Initializing Advanced AI Enhancements...');

        // Check if required classes exist
        if (typeof SamCryptoAI === 'undefined') {
            console.warn('⚠️ SamCryptoAI not found, waiting...');
            setTimeout(initializeAIEnhancements, 500);
            return;
        }

        if (typeof AIEnhancementEngine === 'undefined') {
            console.warn('⚠️ AIEnhancementEngine not found, waiting...');
            setTimeout(initializeAIEnhancements, 500);
            return;
        }

        // Create singleton instance of AI Enhancement Engine
        window.aiEnhancer = new AIEnhancementEngine();
        console.log('✅ AI Enhancement Engine initialized');

        // Extend SamCryptoAI prototype with enhanced methods
        enhanceSamCryptoAI();

        console.log('🎉 Advanced AI features successfully integrated!');
    }

    function enhanceSamCryptoAI() {
        const proto = SamCryptoAI.prototype;

        // Store original method
        proto._originalCreateAdvancedSystemPrompt = proto.createAdvancedSystemPrompt;

        /**
         * 🧠 Enhanced System Prompt with Chain-of-Thought Reasoning
         */
        proto.createAdvancedSystemPrompt = function(marketData, newsData, intent, userMessage) {
            console.log('🧠 Creating enhanced system prompt with chain-of-thought...');

            // Get AI enhancer instance
            const enhancer = window.aiEnhancer;

            // Create chain-of-thought prompt
            const cotPrompt = enhancer.createChainOfThoughtPrompt(
                userMessage,
                marketData,
                {
                    conversationContext: this.conversationContext,
                    userProfile: this.userPreferences || {}
                }
            );

            // Create enhanced technical analysis section
            let technicalSection = '';
            if (marketData && Object.keys(marketData).length > 0) {
                technicalSection = this.createTechnicalAnalysisSection(marketData);
            }

            // Build comprehensive prompt
            const enhancedPrompt = `${cotPrompt}

${technicalSection}

## REAL-TIME NEWS & EVENTS:
${newsData ? this.formatNewsData(newsData) : 'No recent news available'}

## USER CONTEXT:
- Trading Experience: ${this.userPreferences.experienceLevel || 'intermediate'}
- Risk Tolerance: ${this.userPreferences.riskTolerance || 'moderate'}
- Preferred Style: ${this.userPreferences.tradingStyle || 'balanced'}
- Recent Topics: ${this.conversationContext.keyPoints.slice(0, 5).join(', ') || 'none'}

## CONVERSATION MEMORY:
${this.getContextualPromptEnhancement()}

---

You are SamCrypto AI — a concise, professional crypto assistant modeled after ChatGPT.

RESPONSE RULES:
- Be concise: 1–4 short paragraphs max. No filler.
- Use clear structure with short sentences and bullet points when helpful.
- Use real data from above; show numbers for calculations/signals.
- Provide precise trading insights: levels, entries/stops/targets, risk.
- Do not ask questions; respond directly to the user’s request.
- No emojis unless the user used them first.
- Maintain a calm, factual tone. End with a complete answer.
`;

            return enhancedPrompt;
        };

        /**
         * 📊 Create Technical Analysis Section
         */
        proto.createTechnicalAnalysisSection = function(marketData) {
            const enhancer = window.aiEnhancer;
            let section = '\n## TECHNICAL ANALYSIS:\n\n';

            for (const [coinId, data] of Object.entries(marketData)) {
                if (!data || typeof data !== 'object') continue;

                section += `### ${coinId.toUpperCase()} Technical Indicators:\n\n`;

                // Calculate technical metrics - support multiple field names
                const price = data.price_usd || data.price || data.current_price || 0;
                const change24h = data.change_24h || data.price_change_24h || data.price_change_percentage_24h || 0;
                const volume = data.volume_24h || data.volume || data.total_volume || 0;
                const marketCap = data.market_cap_usd || data.market_cap || 0;
                const high24h = data.high_24h || price * 1.05;
                const low24h = data.low_24h || price * 0.95;

                // Calculate quick technical indicators
                const volatility = ((high24h - low24h) / price) * 100;
                const volumeRank = this.getVolumeRank(volume);
                const trendStrength = Math.abs(change24h);

                // Determine trend
                let trend = 'Neutral';
                let trendEmoji = '➡️';
                if (change24h > 3) {
                    trend = 'Strong Bullish';
                    trendEmoji = '📈';
                } else if (change24h > 0) {
                    trend = 'Bullish';
                    trendEmoji = '📊';
                } else if (change24h < -3) {
                    trend = 'Strong Bearish';
                    trendEmoji = '📉';
                } else if (change24h < 0) {
                    trend = 'Bearish';
                    trendEmoji = '📊';
                }

                // Calculate simple RSI estimate from price change
                const rsiEstimate = 50 + (change24h * 2); // Rough approximation
                const rsiClamped = Math.max(0, Math.min(100, rsiEstimate));
                let rsiSignal = 'Neutral';
                if (rsiClamped > 70) rsiSignal = 'Overbought ⚠️';
                else if (rsiClamped < 30) rsiSignal = 'Oversold 🎯';

                // Calculate support and resistance levels
                const support1 = (low24h * 0.98).toFixed(2);
                const support2 = (low24h * 0.96).toFixed(2);
                const resistance1 = (high24h * 1.02).toFixed(2);
                const resistance2 = (high24h * 1.04).toFixed(2);

                // Build detailed technical section
                section += `
**Price Action:**
- Current: $${price.toFixed(2)}
- 24h Range: $${low24h.toFixed(2)} - $${high24h.toFixed(2)}
- 24h Change: ${change24h.toFixed(2)}% ${trendEmoji}
- Volatility: ${volatility.toFixed(2)}%

**Trend Analysis:**
- Direction: ${trend} ${trendEmoji}
- Strength: ${trendStrength > 5 ? 'Strong' : trendStrength > 2 ? 'Moderate' : 'Weak'}
- RSI (Estimated): ${rsiClamped.toFixed(0)} - ${rsiSignal}

**Volume Analysis:**
- 24h Volume: $${this.formatLargeNumber(volume)}
- Volume Rank: ${volumeRank}
- Market Cap: $${this.formatLargeNumber(marketCap)}

**Key Levels:**
- Resistance 2: $${resistance2} (Strong)
- Resistance 1: $${resistance1} (Immediate)
- **CURRENT PRICE: $${price.toFixed(2)}**
- Support 1: $${support1} (Immediate)
- Support 2: $${support2} (Strong)

**Trading Signals:**
${this.generateDetailedSignals(change24h, rsiClamped, volatility)}

---
`;
            }

            return section;
        };

        /**
         * 🎯 Generate Detailed Trading Signals
         */
        proto.generateDetailedSignals = function(change24h, rsi, volatility) {
            const signals = [];

            // Trend signals
            if (change24h > 5) {
                signals.push('🟢 Strong Uptrend - Consider long positions with proper risk management');
            } else if (change24h < -5) {
                signals.push('🔴 Strong Downtrend - Consider short positions or wait for reversal');
            }

            // RSI signals
            if (rsi > 70) {
                signals.push('⚠️ Overbought - Potential reversal or pullback ahead, consider taking profits');
            } else if (rsi < 30) {
                signals.push('🎯 Oversold - Potential bounce opportunity, watch for reversal confirmation');
            }

            // Volatility signals
            if (volatility > 10) {
                signals.push('⚡ High Volatility - Use tight stop losses and smaller position sizes');
            } else if (volatility < 3) {
                signals.push('😴 Low Volatility - Possible breakout brewing, watch for volume increase');
            }

            // Momentum signals
            if (change24h > 3 && rsi < 70) {
                signals.push('🚀 Bullish Momentum - Trend likely to continue, look for entry opportunities');
            } else if (change24h < -3 && rsi > 30) {
                signals.push('🔻 Bearish Momentum - Downtrend may persist, avoid catching falling knives');
            }

            return signals.length > 0 ? signals.map(s => `  - ${s}`).join('\n') : '  - No clear signals - Wait for better setup before entering';
        };

        /**
         * 📊 Get Volume Rank
         */
        proto.getVolumeRank = function(volume) {
            if (volume > 10000000000) return 'Extremely High 🔥';
            if (volume > 1000000000) return 'Very High 📈';
            if (volume > 100000000) return 'High ✅';
            if (volume > 10000000) return 'Moderate ➡️';
            return 'Low ⚠️';
        };

        /**
         * 💰 Format Large Numbers
         */
        proto.formatLargeNumber = function(num) {
            if (num >= 1000000000000) return (num / 1000000000000).toFixed(2) + 'T';
            if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
            if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
            if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
            return num.toFixed(2);
        };

        /**
         * 📰 Format News Data
         */
        proto.formatNewsData = function(newsData) {
            if (!newsData || !Array.isArray(newsData) || newsData.length === 0) {
                return 'No recent news available';
            }

            let formatted = '';
            newsData.slice(0, 5).forEach((article, index) => {
                const title = article.title || 'Untitled';
                const description = article.description || article.summary || '';
                const time = this.getTimeAgo(article.publishedAt || article.published_at);
                
                formatted += `
**${index + 1}. ${title}**
${description ? `   ${description.substring(0, 150)}...` : ''}
   ⏰ ${time}
`;
            });

            return formatted;
        };

        /**
         * ⏰ Get Time Ago
         */
        proto.getTimeAgo = function(timestamp) {
            if (!timestamp) return 'Unknown time';
            
            const date = new Date(timestamp);
            const now = new Date();
            const seconds = Math.floor((now - date) / 1000);

            if (seconds < 60) return 'Just now';
            if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
            if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
            return `${Math.floor(seconds / 86400)} days ago`;
        };

        /**
         * 🎯 Enhanced Response Validation
         */
        proto._originalValidateAIResponse = proto.validateAIResponse;
        
        proto.validateAIResponse = function(response) {
            // Run original validation if it exists
            if (this._originalValidateAIResponse) {
                response = this._originalValidateAIResponse(response);
            }

            // Log response length (no restrictions)
            const words = response.split(/\s+/).length;
            console.log(`📝 Response length: ${words} words`);

            // Remove emojis to match persona unless user initiated them
            response = response.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '');

            // Ensure a brief risk reminder is present (emoji-free)
            if (!/risk/i.test(response)) {
                response += '\n\nRisk: Crypto is volatile. Use stops and size conservatively.';
            }

            return response;
        };

        console.log('✅ Enhanced AI methods integrated into SamCryptoAI');
    }

})();

