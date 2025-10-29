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

**RESPONSE REQUIREMENTS - KEEP IT CONCISE:**

1. **BE BRIEF BUT COMPLETE**: 150-250 words maximum
2. **KEY INFO ONLY**: Price, trend, recommendation, confidence, entry/exit
3. **NO FLUFF**: Skip long explanations, get to the point
4. **USE BULLET POINTS**: Easy to scan and read quickly
5. **SHOW CONFIDENCE**: One line with percentage
6. **SPECIFIC NUMBERS**: Entry, targets, stop loss in one section
7. **QUICK RISK NOTE**: One sentence warning
8. **USE EMOJIS**: Visual clarity (📈📉⚠️✅❌)

**FORMAT EXAMPLE (FOLLOW THIS):**
📊 [COIN] - $[PRICE] ([CHANGE]%)

**Analysis:**
• Trend: [Bullish/Bearish] (RSI: X, MACD: Y)
• Sentiment: [Score]/100
• Volume: [High/Medium/Low]

**Recommendation:** [BUY/HOLD/SELL]
**Confidence:** [X]% ([High/Medium/Low])

**Strategy:**
• Entry: $X-Y
• Target: $Z (+X%)
• Stop: $W (-X%)
• Size: X% portfolio

⚠️ **Risk:** [One sentence]

**STRICT RULES:**
- Maximum 250 words total
- No long paragraphs
- No step-by-step explanations
- Just actionable info
- Be direct and clear

**CONFIDENCE LEVELS:**
- 80-100%: Strong signal ✅
- 60-79%: Good signal 👍
- 40-59%: Weak signal ⚠️
- Below 40%: Avoid ❌

**REMEMBER:** 
- Keep response under 250 words
- Be direct and actionable
- No long explanations
- Professional but concise`;

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

                // Build concise technical section
                section += `
**${coinId.toUpperCase()}:** $${price.toFixed(2)} (${change24h.toFixed(2)}% ${trendEmoji})
• Trend: ${trend}, RSI: ${rsiClamped.toFixed(0)} (${rsiSignal})
• Volume: ${volumeRank} ($${this.formatLargeNumber(volume)})
• Resistance: $${resistance1} / Support: $${support1}
• Signals: ${this.getQuickSignalSummary(change24h, rsiClamped, volatility)}

`;
            }

            return section;
        };

        /**
         * 🎯 Generate Quick Trading Signals Summary (Concise)
         */
        proto.getQuickSignalSummary = function(change24h, rsi, volatility) {
            const signals = [];

            // Trend
            if (change24h > 5) signals.push('Strong Up📈');
            else if (change24h < -5) signals.push('Strong Down📉');
            else if (change24h > 2) signals.push('Bullish');
            else if (change24h < -2) signals.push('Bearish');
            else signals.push('Neutral');

            // RSI
            if (rsi > 70) signals.push('Overbought⚠️');
            else if (rsi < 30) signals.push('Oversold🎯');

            // Volatility
            if (volatility > 10) signals.push('High Vol⚡');

            return signals.join(', ');
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
         * 📰 Format News Data (Concise)
         */
        proto.formatNewsData = function(newsData) {
            if (!newsData || !Array.isArray(newsData) || newsData.length === 0) {
                return 'No recent news';
            }

            let formatted = '\n';
            newsData.slice(0, 3).forEach((article, index) => {
                const title = article.title || 'Untitled';
                const time = this.getTimeAgo(article.publishedAt || article.published_at);
                formatted += `• ${title.substring(0, 60)}... (${time})\n`;
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

            // Trim excessive length (keep under ~300 words)
            const words = response.split(/\s+/).length;
            if (words > 350) {
                console.warn(`⚠️ Response too long (${words} words), may need trimming`);
            }

            // Add confidence if missing
            if (!response.includes('%') && !response.includes('onfidence')) {
                response += '\n\n📊 Confidence: Medium';
            }

            // Add brief risk warning if missing
            if (!response.toLowerCase().includes('risk') && !response.includes('⚠️')) {
                response += '\n⚠️ Risk: Always use stop losses';
            }

            return response;
        };

        console.log('✅ Enhanced AI methods integrated into SamCryptoAI');
    }

})();

