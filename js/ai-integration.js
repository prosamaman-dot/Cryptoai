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

**RESPONSE REQUIREMENTS - ADAPTIVE LENGTH:**

**Adjust response length based on user's question:**

🔹 **Simple Questions** (e.g., "Bitcoin price?", "Should I buy BTC?")
   → 100-200 words, quick format, direct answer

🔹 **Analysis Requests** (e.g., "Analyze Bitcoin", "Compare BTC and ETH")
   → 300-400 words, detailed indicators, full reasoning

🔹 **Detailed Requests** (e.g., "Give me full detailed analysis", "Explain everything")
   → 400-600 words, comprehensive breakdown, step-by-step

**ALWAYS INCLUDE:**
✅ Real data and specific numbers
✅ Confidence score (%)
✅ Entry/exit points when relevant
✅ Risk warning
✅ Use bullet points for clarity
✅ Emojis for visual scanning (📈📉⚠️✅)

**CONFIDENCE LEVELS:**
- 80-100%: Strong signal ✅
- 60-79%: Good signal 👍
- 40-59%: Weak signal ⚠️
- Below 40%: Avoid ❌

**REMEMBER:** 
- Match detail level to user's question
- Be professional and clear
- Always include actionable info
- Explain reasoning when user asks for analysis`;

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

            // Check response length (warn if excessive, but don't enforce hard limit)
            const words = response.split(/\s+/).length;
            if (words > 600) {
                console.warn(`⚠️ Response very long (${words} words)`);
            } else if (words > 400) {
                console.log(`ℹ️ Detailed response (${words} words)`);
            } else {
                console.log(`✅ Response length: ${words} words`);
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

