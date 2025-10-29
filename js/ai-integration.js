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

**RESPONSE REQUIREMENTS:**

1. **START WITH ANALYSIS**: Show your step-by-step thinking process
2. **USE REAL DATA**: Reference actual prices, volumes, percentages from market data above
3. **BE SPECIFIC**: Give exact entry points, targets, stop losses with numbers
4. **SHOW CONFIDENCE**: State your confidence level (0-100%) and explain why
5. **MANAGE RISK**: Always include risk warnings and position sizing advice
6. **CITE SOURCES**: Reference which indicators, patterns, or data points you're using
7. **BE CONCISE**: Important info first, details after
8. **USE EMOJIS**: Make it readable (📈 for bullish, 📉 for bearish, ⚠️ for warnings)

**CONFIDENCE SCORING RULES:**
- 80-100%: Multiple strong signals align, low risk, clear trend
- 60-79%: Good signals, moderate risk, some uncertainty
- 40-59%: Mixed signals, higher risk, neutral territory
- 20-39%: Weak signals, high risk, conflicting data
- 0-19%: Insufficient data or very high risk

Remember: You're a professional crypto analyst. Give actionable, data-driven advice!`;

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

                // Calculate technical metrics
                const price = data.price || data.current_price || 0;
                const change24h = data.price_change_24h || data.price_change_percentage_24h || 0;
                const volume = data.volume || data.total_volume || 0;
                const marketCap = data.market_cap || 0;
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

                // Build technical section
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
${this.generateQuickSignals(change24h, rsiClamped, volatility)}

---
`;
            }

            return section;
        };

        /**
         * 🎯 Generate Quick Trading Signals
         */
        proto.generateQuickSignals = function(change24h, rsi, volatility) {
            const signals = [];

            // Trend signals
            if (change24h > 5) {
                signals.push('🟢 Strong Uptrend - Consider long positions');
            } else if (change24h < -5) {
                signals.push('🔴 Strong Downtrend - Consider short positions or wait');
            }

            // RSI signals
            if (rsi > 70) {
                signals.push('⚠️ Overbought - Potential reversal or pullback');
            } else if (rsi < 30) {
                signals.push('🎯 Oversold - Potential bounce opportunity');
            }

            // Volatility signals
            if (volatility > 10) {
                signals.push('⚡ High Volatility - Use tight stop losses');
            } else if (volatility < 3) {
                signals.push('😴 Low Volatility - Possible breakout brewing');
            }

            // Momentum signals
            if (change24h > 3 && rsi < 70) {
                signals.push('🚀 Bullish Momentum - Trend likely to continue');
            } else if (change24h < -3 && rsi > 30) {
                signals.push('🔻 Bearish Momentum - Downtrend may persist');
            }

            return signals.length > 0 ? signals.map(s => `  - ${s}`).join('\n') : '  - No clear signals - Wait for better setup';
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

            // Additional validation for confidence scores
            if (!response.includes('%') && !response.includes('confidence')) {
                console.warn('⚠️ Response missing confidence score, adding disclaimer...');
                response += '\n\n📊 *Confidence assessment pending - please analyze multiple indicators before trading.*';
            }

            // Ensure risk warnings are present
            if (!response.toLowerCase().includes('risk') && !response.includes('⚠️')) {
                response += '\n\n⚠️ **Risk Warning**: All investments carry risk. Never invest more than you can afford to lose.';
            }

            return response;
        };

        console.log('✅ Enhanced AI methods integrated into SamCryptoAI');
    }

})();

