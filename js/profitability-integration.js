// 🔗 Profitability Integration - Connects Profitability Engine to SamCrypto AI
// This module integrates profitability features into the main AI system

(function() {
    'use strict';

    // Wait for required modules to load
    window.addEventListener('DOMContentLoaded', function() {
        initializeProfitabilityEngine();
    });

    function initializeProfitabilityEngine() {
        console.log('💰 Initializing Profitability Engine...');

        // Check if required classes exist
        if (typeof SamCryptoAI === 'undefined') {
            console.warn('⚠️ SamCryptoAI not found, waiting...');
            setTimeout(initializeProfitabilityEngine, 500);
            return;
        }

        if (typeof ProfitabilityEngine === 'undefined') {
            console.warn('⚠️ ProfitabilityEngine not found, waiting...');
            setTimeout(initializeProfitabilityEngine, 500);
            return;
        }

        // Create singleton instance
        window.profitabilityEngine = new ProfitabilityEngine();
        console.log('✅ Profitability Engine initialized');

        // Extend SamCryptoAI with profitability features
        enhanceWithProfitability();

        console.log('🎉 Profitability features successfully integrated!');
    }

    function enhanceWithProfitability() {
        const proto = SamCryptoAI.prototype;
        const engine = window.profitabilityEngine;

        // Store original method
        proto._originalCreateAdvancedSystemPrompt = proto.createAdvancedSystemPrompt;

        /**
         * 💰 Enhanced System Prompt with Profitability Focus
         */
        proto.createAdvancedSystemPrompt = function(marketData, newsData, intent, userMessage, perplexityInsights = null) {
            // Get original prompt
            let prompt = proto._originalCreateAdvancedSystemPrompt.call(this, marketData, newsData, intent, userMessage, perplexityInsights);

            // Add profitability enhancement section
            const profitabilitySection = this.createProfitabilityEnhancementSection(marketData, userMessage);
            
            // Insert profitability section before the final instructions
            prompt = prompt.replace(
                /## REAL-TIME NEWS & EVENTS:/,
                profitabilitySection + '\n\n## REAL-TIME NEWS & EVENTS:'
            );

            // Add profitability-focused instructions
            const profitabilityInstructions = `

💰 SHORT-TERM PROFITABILITY OPTIMIZATION MODULE:

**Your Mission: Maximize SHORT-TERM Trading Profits**

⚡ FOCUS: You are a SHORT-TERM trading specialist. Every recommendation must be optimized for QUICK profits!

You now have access to advanced profitability analysis that helps you provide MORE PROFITABLE SHORT-TERM recommendations:

1. **PROFITABILITY SCORING:**
   - Every recommendation should include a Profitability Score (0-100)
   - Scores 80+ = Exceptional opportunity (recommend larger positions)
   - Scores 65-79 = Good opportunity (standard position sizing)
   - Scores 50-64 = Moderate opportunity (smaller positions)
   - Scores <50 = Weak opportunity (avoid or wait)

2. **ALWAYS INCLUDE:**
   - ✅ Profitability Score and Rating (e.g., "Profitability: 78/100 - Excellent ⭐")
   - ✅ Specific Risk/Reward Ratio (e.g., "Risk/Reward: 1:2.5" - minimum 1:2)
   - ✅ Expected Profit Potential (e.g., "Expected Profit: 12-15% over 1-2 weeks")
   - ✅ Optimal Position Size (based on user's risk tolerance and capital)
   - ✅ Specific Profit Targets (Target 1, 2, 3 with percentages)
   - ✅ Entry Timing Quality (Excellent/Good/Fair/Poor)

3. **SHORT-TERM PROFIT-MAXIMIZING STRATEGIES:**
   - 🎯 Only recommend SHORT-TERM trades with Risk/Reward ≥ 1:2 (prefer 1:3+)
   - ⏰ Focus on QUICK timeframes: 30min-4hrs MAX
   - 💰 Suggest SMALLER positions (1-2% risk max for fast trades)
   - 📈 Provide QUICK profit targets (1-3% = target 1, 2-5% = target 2, 3-8% = target 3)
   - 🔄 Exit strategies: Take profits FAST, move stops to break-even quickly
   - 🚨 Emphasize URGENCY for immediate opportunities
   - 🚫 Warn against holding overnight or low-profitability trades (score <50)

4. **PORTFOLIO OPTIMIZATION:**
   - Analyze user's current holdings
   - Suggest reducing positions with low profitability scores
   - Recommend new opportunities with high profitability scores
   - Consider diversification and risk management

5. **RESPONSE FORMAT:**
   When making trading recommendations, structure your response as:

   📊 **SHORT-TERM ANALYSIS:**
   [Your technical analysis focused on quick opportunities]

   💰 **PROFITABILITY SCORE: X/100** (Rating: Excellent/Good/Fair/Poor)
   - Technical Strength: X/100
   - Risk/Reward Ratio: 1:X.X (✅ Excellent / ⚠️ Good / ❌ Poor)
   - Entry Timing: Excellent/Good/Fair/Poor
   - Expected Profit: X-X% over [HOURS/TIME]

   ⏰ **TIME HORIZON: [30min-4hrs]** - Specify exact exit time!
   🔥 **URGENCY: [NOW/Within 1hr/Wait]** - How quickly to act!

   🎯 **QUICK TRADING PLAN:**
   - Entry: $X.XX (Right now / On pullback to $X.XX)
   - TIGHT Stop Loss: $X.XX (0.5-1% risk)
   - Target 1: $X.XX (+1-3%) - Take 50% profit FAST here
   - Target 2: $X.XX (+2-5%) - Take 30% profit
   - Target 3: $X.XX (+3-8%) - Take remaining 20% profit
   - Exit Time: [HOURS] MAX - Don't hold overnight!

   💵 **POSITION SIZING (SMALL for quick trades):**
   - Based on $X,XXX capital and 1-2% risk per trade
   - Suggested Position Size: X.XX coins ($XXX.XX)
   - Risk Amount: $XX.XX (1-2% of capital)
   - Maximum Loss: $XX.XX if stop-loss hits

   ⚠️ **SHORT-TERM RISKS:**
   [List specific risks - emphasize tight stops, quick exits, avoiding overnight]

6. **OPPORTUNITY SCANNING:**
   - Proactively identify high-profitability opportunities
   - Alert user to exceptional setups (score 85+)
   - Compare current opportunity against historical performance

**CRITICAL RULES FOR SHORT-TERM TRADING:**
- ALWAYS specify TIME HORIZON (hours, NOT days/weeks!)
- ALWAYS use TIGHT stops (0.5-1%, NOT 2-3%!)
- ALWAYS emphasize QUICK exits
- ALWAYS warn against holding overnight
- Never recommend a trade without clear profitability score, risk/reward, and position sizing
- Prioritize SPEED and EXIT PLANS over large positions
`;

            // Append profitability instructions
            prompt += profitabilityInstructions;

            return prompt;
        };

        /**
         * 💰 Create Profitability Enhancement Section for Prompt
         */
        proto.createProfitabilityEnhancementSection = function(marketData, userMessage) {
            if (!marketData || Object.keys(marketData).length === 0) {
                return '\n## 💰 PROFITABILITY ANALYSIS:\nNo market data available for profitability analysis.';
            }

            let section = '\n## 💰 PROFITABILITY ANALYSIS:\n\n';
            const engine = window.profitabilityEngine;

            // Analyze each coin mentioned or in market data
            for (const [coinId, data] of Object.entries(marketData)) {
                if (!data || typeof data !== 'object') continue;

                // Quick profitability analysis
                const analysis = engine.quickTechnicalAnalysis(data);
                const profitability = engine.calculateProfitabilityScore(analysis, data, 'mixed');

                // Calculate position sizing if user has capital
                const userCapital = (this.portfolio?.usdtBalance || 0) + (this.portfolio?.totalValue || 0);
                let positionSize = null;
                if (userCapital > 0 && analysis.entry && analysis.stopLoss) {
                    positionSize = engine.calculatePositionSize(
                        userCapital,
                        1.5, // 1.5% risk for short-term trading
                        analysis.entry,
                        analysis.stopLoss
                    );
                }

                // Suggest profit targets
                const targets = engine.suggestProfitTargets(
                    analysis.entry,
                    analysis.stopLoss,
                    analysis.trend?.direction || 'neutral',
                    analysis.resistanceLevel
                );

                section += `### ${coinId.toUpperCase()} Profitability Analysis:\n\n`;
                section += `**Profitability Score: ${profitability.score}/100** (${profitability.rating.level} ${profitability.rating.emoji})\n`;
                section += `- Risk/Reward Ratio: 1:${profitability.riskReward.ratio}\n`;
                section += `- Expected Profit: ${profitability.expectedProfit.percentage}% (Conservative: ${profitability.expectedProfit.riskAdjusted}%)\n`;
                section += `- Entry Timing: ${profitability.entryQuality.quality.toUpperCase()} (${profitability.entryQuality.score}/100)\n`;
                section += `- Time Frame: ${profitability.expectedProfit.timeFrame}\n\n`;

                if (positionSize && positionSize.size > 0) {
                    section += `**Optimal Position Size (1.5% risk for SHORT-TERM):**\n`;
                    section += `- Position Size: ${positionSize.size} ${coinId.toUpperCase()}\n`;
                    section += `- USDT Value: $${positionSize.usdtValue.toFixed(2)}\n`;
                    section += `- Risk Amount: $${positionSize.riskAmount.toFixed(2)} (SMALL for quick exit)\n\n`;
                }

                section += `**Profit Targets:**\n`;
                section += `- Target 1 (Conservative 2:1 R/R): $${targets.conservative.price} (+${targets.conservative.rewardPercent}%) - ${targets.conservative.action}\n`;
                section += `- Target 2 (Moderate 3:1 R/R): $${targets.moderate.price} (+${targets.moderate.rewardPercent}%) - ${targets.moderate.action}\n`;
                section += `- Target 3 (Aggressive 4:1+ R/R): $${targets.aggressive.price} (+${targets.aggressive.rewardPercent}%) - ${targets.aggressive.action}\n\n`;

                section += `**Recommendation:** ${profitability.recommendation}\n\n`;
                section += `---\n\n`;
            }

            // Portfolio optimization suggestions
            if (this.portfolio && this.portfolio.holdings.length > 0) {
                const optimization = engine.optimizePortfolio(
                    this.portfolio.holdings,
                    this.portfolio.usdtBalance || 0,
                    marketData
                );

                if (optimization.rebalanceSuggestions.length > 0 || optimization.newOpportunities.length > 0) {
                    section += `## 💼 PORTFOLIO OPTIMIZATION SUGGESTIONS:\n\n`;

                    if (optimization.rebalanceSuggestions.length > 0) {
                        section += `### Rebalancing Recommendations:\n`;
                        optimization.rebalanceSuggestions.forEach(suggestion => {
                            section += `- **${suggestion.coin}**: ${suggestion.action} - ${suggestion.reason}\n`;
                            section += `  → ${suggestion.suggestedAction}\n\n`;
                        });
                    }

                    if (optimization.newOpportunities.length > 0) {
                        section += `### New High-Profitability Opportunities:\n`;
                        optimization.newOpportunities.forEach(opp => {
                            section += `- **${opp.coin}**: ${opp.action} - Profitability Score: ${opp.profitability.score}/100\n`;
                            section += `  → Suggested Allocation: $${opp.suggestedAllocation.toFixed(2)}\n`;
                            section += `  → Reason: ${opp.reason}\n\n`;
                        });
                    }
                }
            }

            return section;
        };

        /**
         * 🔍 Scan for High-Profitability Opportunities
         */
        proto.scanProfitabilityOpportunities = async function(coinIds = ['bitcoin', 'ethereum', 'solana', 'cardano', 'binancecoin']) {
            const engine = window.profitabilityEngine;
            
            console.log('🔍 Scanning for high-profitability opportunities...');

            try {
                // Fetch market data for all coins
                const marketDataPromises = coinIds.map(async (coinId) => {
                    try {
                        const response = await fetch(
                            `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true&include_24hr_high=true&include_24hr_low=true`
                        );
                        if (!response.ok) return null;
                        const data = await response.json();
                        return { coinId, data: data[coinId] };
                    } catch (error) {
                        console.error(`Error fetching ${coinId}:`, error);
                        return null;
                    }
                });

                const results = await Promise.all(marketDataPromises);
                const marketDataMap = {};
                
                results.forEach(result => {
                    if (result && result.data) {
                        // Convert to standard format
                        marketDataMap[result.coinId] = {
                            price_usd: result.data.usd,
                            price: result.data.usd,
                            price_change_24h: result.data.usd_24h_change,
                            change_24h: result.data.usd_24h_change,
                            volume_24h: result.data.usd_24h_vol,
                            volume: result.data.usd_24h_vol,
                            market_cap: result.data.usd_market_cap,
                            market_cap_usd: result.data.usd_market_cap,
                            high_24h: result.data.usd_24h_high,
                            low_24h: result.data.usd_24h_low
                        };
                    }
                });

                // Scan for opportunities
                const opportunities = await engine.scanOpportunities(coinIds, marketDataMap);
                
                return opportunities.map(opp => engine.formatOpportunity(opp));
            } catch (error) {
                console.error('Error scanning opportunities:', error);
                return [];
            }
        };

        /**
         * 💰 Get Profitability Analysis for a Coin
         */
        proto.getProfitabilityAnalysis = function(coinId, marketData) {
            const engine = window.profitabilityEngine;
            
            if (!marketData) {
                console.warn('No market data provided for profitability analysis');
                return null;
            }

            const analysis = engine.quickTechnicalAnalysis(marketData);
            const profitability = engine.calculateProfitabilityScore(analysis, marketData, 'mixed');
            const targets = engine.suggestProfitTargets(
                analysis.entry,
                analysis.stopLoss,
                analysis.trend?.direction || 'neutral',
                analysis.resistanceLevel
            );

            const userCapital = (this.portfolio?.usdtBalance || 0) + (this.portfolio?.totalValue || 0);
            let positionSize = null;
            if (userCapital > 0 && analysis.entry && analysis.stopLoss) {
                positionSize = engine.calculatePositionSize(userCapital, 2, analysis.entry, analysis.stopLoss);
            }

            return {
                profitability: profitability,
                analysis: analysis,
                targets: targets,
                positionSize: positionSize,
                coinId: coinId.toUpperCase()
            };
        };

        /**
         * 💰 Proactively Suggest Profitable Opportunities
         */
        proto.suggestProfitableOpportunities = async function() {
            console.log('🔍 Proactively scanning for profitable opportunities...');
            
            try {
                const opportunities = await this.scanProfitabilityOpportunities();
                
                if (opportunities.length === 0) {
                    return null;
                }

                // Format opportunities for AI suggestion
                const topOpportunity = opportunities[0];
                const suggestion = `💰 **EXCEPTIONAL OPPORTUNITY DETECTED!**

I've identified a high-profitability trading opportunity:

**${topOpportunity.coin}**
- Profitability Score: **${topOpportunity.score}/100** (${topOpportunity.rating.level} ${topOpportunity.rating.emoji})
- Risk/Reward: **1:${topOpportunity.riskReward}**
- Expected Profit: **${topOpportunity.expectedProfit}%**
- Entry: **$${topOpportunity.entry}**
- Stop Loss: **$${topOpportunity.stopLoss}**
- Target: **$${topOpportunity.target}**

**Recommendation:** ${topOpportunity.recommendation}

Would you like me to provide a complete analysis with position sizing and profit targets?`;

                return suggestion;
            } catch (error) {
                console.error('Error suggesting opportunities:', error);
                return null;
            }
        };

        // Hook into message processing to proactively suggest opportunities
        proto._originalProcessMessage = proto.processMessage || proto.sendMessage;
        
        // Enhance the system to check for opportunities periodically
        if (typeof proto.sendMessage !== 'undefined') {
            const originalSendMessage = proto.sendMessage;
            
            proto.sendMessage = async function() {
                // Call original sendMessage
                const result = await originalSendMessage.apply(this, arguments);
                
                // After response, check if we should suggest opportunities
                // Only suggest if no specific coin was asked about
                const input = document.getElementById('messageInput');
                const lastMessage = (input?.value || '').toLowerCase();
                const isGeneralQuery = !lastMessage.match(/\b(bitcoin|btc|ethereum|eth|solana|sol|cardano|ada|buy|sell|trade)\b/i);
                
                if (isGeneralQuery && Math.random() > 0.7) { // 30% chance to suggest
                    setTimeout(async () => {
                        try {
                            const suggestion = await this.suggestProfitableOpportunities();
                            if (suggestion) {
                                // Add as AI suggestion (non-intrusive)
                                console.log('💡 Proactive opportunity suggestion available');
                                // Could show as a notification or button
                            }
                        } catch (error) {
                            console.error('Error in proactive suggestion:', error);
                        }
                    }, 3000); // Wait 3 seconds after response
                }
                
                return result;
            };
        }

        console.log('✅ Profitability methods integrated into SamCryptoAI');
    }

})();

