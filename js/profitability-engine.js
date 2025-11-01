// 💰 Profitability Engine - Makes AI recommendations more profitable
// This module focuses on finding profitable opportunities and optimizing trades

class ProfitabilityEngine {
    constructor() {
        // Profitability scoring weights
        this.profitabilityWeights = {
            technicalStrength: 0.30,    // Technical indicators alignment
            riskReward: 0.25,           // Risk/Reward ratio quality
            entryTiming: 0.20,          // Entry timing quality
            marketConditions: 0.15,     // Overall market conditions
            volumeConfirmation: 0.10    // Volume confirmation
        };

        // SHORT-TERM Trading Strategy Performance
        this.strategyPerformance = {
            'rsi_scalping': { winRate: 0.78, avgProfit: 0.025, maxDrawdown: 0.01, timeframe: 'hours' },
            'quick_breakout': { winRate: 0.72, avgProfit: 0.035, maxDrawdown: 0.015, timeframe: '1-4 hours' },
            'momentum_scalp': { winRate: 0.75, avgProfit: 0.03, maxDrawdown: 0.01, timeframe: '30min-2hrs' },
            'support_bounce': { winRate: 0.80, avgProfit: 0.02, maxDrawdown: 0.01, timeframe: 'hours' },
            'volume_spike': { winRate: 0.85, avgProfit: 0.045, maxDrawdown: 0.015, timeframe: '1-2 hours' },
            'fibonacci_bounce': { winRate: 0.73, avgProfit: 0.02, maxDrawdown: 0.01, timeframe: 'hours' },
            'quick_reversal': { winRate: 0.82, avgProfit: 0.035, maxDrawdown: 0.015, timeframe: 'hours' },
            'pattern_trade': { winRate: 0.76, avgProfit: 0.03, maxDrawdown: 0.015, timeframe: 'hours' }
        };

        // Opportunity thresholds
        this.opportunityThresholds = {
            minimumProfitScore: 70,      // Minimum score for opportunity alert
            minimumRiskReward: 2.0,      // Minimum R/R ratio
            minimumConfidence: 0.65      // Minimum confidence level
        };
    }

    /**
     * 🎯 Calculate Profitability Score for a Trading Opportunity
     */
    calculateProfitabilityScore(analysis, marketData, strategyType = 'mixed') {
        let score = 0;
        const factors = {};

        // 1. Technical Strength (30%)
        if (analysis.technical) {
            const techScore = analysis.technical.score || 50;
            factors.technicalStrength = techScore;
            score += (techScore / 100) * this.profitabilityWeights.technicalStrength * 100;
        }

        // 2. Risk/Reward Ratio (25%)
        const riskReward = this.calculateRiskRewardRatio(analysis);
        factors.riskReward = riskReward.ratio;
        if (riskReward.ratio >= 3.0) {
            score += 25; // Perfect R/R
        } else if (riskReward.ratio >= 2.0) {
            score += 20; // Good R/R
        } else if (riskReward.ratio >= 1.5) {
            score += 15; // Acceptable R/R
        } else {
            score += 10; // Poor R/R
        }

        // 3. Entry Timing Quality (20%)
        const entryQuality = this.assessEntryTiming(analysis, marketData);
        factors.entryTiming = entryQuality.score;
        score += (entryQuality.score / 100) * this.profitabilityWeights.entryTiming * 100;

        // 4. Market Conditions (15%)
        const marketScore = this.assessMarketConditions(marketData);
        factors.marketConditions = marketScore;
        score += (marketScore / 100) * this.profitabilityWeights.marketConditions * 100;

        // 5. Volume Confirmation (10%)
        const volumeScore = this.assessVolumeConfirmation(marketData);
        factors.volumeConfirmation = volumeScore;
        score += (volumeScore / 100) * this.profitabilityWeights.volumeConfirmation * 100;

        // Strategy-specific bonus
        if (this.strategyPerformance[strategyType]) {
            const strategyBonus = this.strategyPerformance[strategyType].winRate * 10;
            score += strategyBonus;
        }

        // Normalize to 0-100
        score = Math.min(100, Math.max(0, score));

        return {
            score: Math.round(score),
            rating: this.getProfitabilityRating(score),
            factors: factors,
            riskReward: riskReward,
            entryQuality: entryQuality,
            expectedProfit: this.calculateExpectedProfit(score, strategyType),
            recommendation: this.getProfitabilityRecommendation(score)
        };
    }

    /**
     * 💵 Calculate Risk/Reward Ratio
     */
    calculateRiskRewardRatio(analysis) {
        if (!analysis || !analysis.entry || !analysis.targets || !analysis.stopLoss) {
            return { ratio: 0, entry: null, stopLoss: null, target: null };
        }

        const entry = analysis.entry;
        const stopLoss = analysis.stopLoss;
        const primaryTarget = analysis.targets[0] || analysis.targets;

        const risk = Math.abs(entry - stopLoss);
        const reward = Math.abs(primaryTarget - entry);

        if (risk === 0) return { ratio: 0, entry, stopLoss, target: primaryTarget };

        const ratio = reward / risk;

        return {
            ratio: parseFloat(ratio.toFixed(2)),
            entry: entry,
            stopLoss: stopLoss,
            target: primaryTarget,
            riskPercent: ((risk / entry) * 100).toFixed(2),
            rewardPercent: ((reward / entry) * 100).toFixed(2)
        };
    }

    /**
     * ⏰ Assess Entry Timing Quality
     */
    assessEntryTiming(analysis, marketData) {
        let timingScore = 50; // Base score

        // Check if we're at support/resistance
        if (analysis.supportLevel && analysis.resistanceLevel) {
            const currentPrice = marketData.price || marketData.current_price || 0;
            const distanceToSupport = Math.abs(currentPrice - analysis.supportLevel) / currentPrice;
            const distanceToResistance = Math.abs(currentPrice - analysis.resistanceLevel) / currentPrice;

            // Good timing if near support (for longs) or resistance (for shorts)
            if (distanceToSupport < 0.02) timingScore += 20; // Very close to support
            else if (distanceToSupport < 0.05) timingScore += 10; // Near support
            if (distanceToResistance < 0.02) timingScore -= 15; // Too close to resistance for longs
        }

        // Check RSI timing
        if (analysis.rsi) {
            if (analysis.rsi < 40 && analysis.rsi > 30) timingScore += 15; // Good oversold entry
            if (analysis.rsi > 60 && analysis.rsi < 70) timingScore -= 10; // Overbought, poor entry
        }

        // Check momentum alignment
        if (analysis.momentum && analysis.trend) {
            if (analysis.momentum.direction === analysis.trend.direction) {
                timingScore += 10; // Momentum aligned with trend
            }
        }

        return {
            score: Math.min(100, Math.max(0, timingScore)),
            quality: timingScore >= 70 ? 'excellent' : timingScore >= 60 ? 'good' : timingScore >= 50 ? 'fair' : 'poor',
            notes: this.getTimingNotes(timingScore)
        };
    }

    /**
     * 🌍 Assess Market Conditions
     */
    assessMarketConditions(marketData) {
        let score = 50;

        // Volume analysis
        if (marketData.volume_24h) {
            const volume = marketData.volume_24h;
            if (volume > 1000000000) score += 15; // High volume = good liquidity
            else if (volume > 100000000) score += 10;
            else if (volume < 10000000) score -= 10; // Low volume = risk
        }

        // Volatility assessment
        if (marketData.high_24h && marketData.low_24h && marketData.price) {
            const priceRange = (marketData.high_24h - marketData.low_24h) / marketData.price;
            if (priceRange > 0.15) score -= 15; // Too volatile
            else if (priceRange > 0.10) score -= 5;
            else if (priceRange < 0.03) score += 10; // Stable conditions
        }

        // Price momentum
        if (marketData.price_change_24h !== undefined) {
            const change = Math.abs(marketData.price_change_24h);
            if (change > 15) score -= 10; // Extreme movement
            else if (change > 5 && change < 15) score += 5; // Healthy momentum
        }

        return Math.min(100, Math.max(0, score));
    }

    /**
     * 📊 Assess Volume Confirmation
     */
    assessVolumeConfirmation(marketData) {
        if (!marketData.volume_24h) return 50;

        const volume = marketData.volume_24h;
        let score = 50;

        // Volume tiers (normalized for different market caps)
        if (volume > 5000000000) score = 90; // Extremely high volume
        else if (volume > 1000000000) score = 80; // Very high volume
        else if (volume > 100000000) score = 70; // High volume
        else if (volume > 10000000) score = 60; // Moderate volume
        else score = 40; // Low volume

        return score;
    }

    /**
     * 🎯 Calculate Expected Profit Potential
     */
    calculateExpectedProfit(profitabilityScore, strategyType) {
        const baseProfit = this.strategyPerformance[strategyType]?.avgProfit || 0.10;
        const scoreMultiplier = profitabilityScore / 100;
        const expectedProfit = baseProfit * scoreMultiplier;

        return {
            percentage: (expectedProfit * 100).toFixed(2),
            riskAdjusted: (expectedProfit * 0.7 * 100).toFixed(2), // Conservative estimate
            timeFrame: this.getExpectedTimeFrame(strategyType)
        };
    }

    /**
     * 💡 Get Profitability Rating
     */
    getProfitabilityRating(score) {
        if (score >= 85) return { level: 'Exceptional', emoji: '🔥', color: 'green' };
        if (score >= 75) return { level: 'Excellent', emoji: '⭐', color: 'green' };
        if (score >= 65) return { level: 'Good', emoji: '✅', color: 'blue' };
        if (score >= 55) return { level: 'Fair', emoji: '➡️', color: 'yellow' };
        return { level: 'Poor', emoji: '⚠️', color: 'red' };
    }

    /**
     * 📝 Get Profitability Recommendation
     */
    getProfitabilityRecommendation(score) {
        if (score >= 80) {
            return 'Strong buy opportunity with high profit potential. Consider larger position size.';
        } else if (score >= 65) {
            return 'Good trading opportunity. Use standard position sizing.';
        } else if (score >= 50) {
            return 'Moderate opportunity. Use smaller position size and tight stop-loss.';
        } else {
            return 'Weak opportunity. Wait for better setup or avoid this trade.';
        }
    }

    /**
     * 🔍 Scan for Profitable Opportunities
     */
    async scanOpportunities(coins, marketDataMap) {
        const opportunities = [];

        for (const coinId of coins) {
            const marketData = marketDataMap[coinId];
            if (!marketData) continue;

            // Quick technical analysis
            const quickAnalysis = this.quickTechnicalAnalysis(marketData);
            
            // Calculate profitability score
            const profitability = this.calculateProfitabilityScore(
                quickAnalysis,
                marketData,
                'mixed'
            );

            // Only add if it meets minimum thresholds
            if (profitability.score >= this.opportunityThresholds.minimumProfitScore &&
                profitability.riskReward.ratio >= this.opportunityThresholds.minimumRiskReward) {
                
                opportunities.push({
                    coin: coinId.toUpperCase(),
                    profitability: profitability,
                    analysis: quickAnalysis,
                    marketData: marketData,
                    priority: this.calculateOpportunityPriority(profitability)
                });
            }
        }

        // Sort by priority (highest first)
        opportunities.sort((a, b) => b.priority - a.priority);

        return opportunities.slice(0, 5); // Top 5 opportunities
    }

    /**
     * 📊 Quick Technical Analysis for Opportunity Scanning
     */
    quickTechnicalAnalysis(marketData) {
        const price = marketData.price_usd || marketData.price || marketData.current_price || 0;
        const change24h = marketData.price_change_24h || marketData.change_24h || 0;
        const volume = marketData.volume_24h || marketData.volume || 0;
        const high24h = marketData.high_24h || price * 1.05;
        const low24h = marketData.low_24h || price * 0.95;

        // Estimate RSI from price change
        const rsiEstimate = 50 + (change24h * 2);
        const rsiClamped = Math.max(0, Math.min(100, rsiEstimate));

        // Determine trend
        const trend = change24h > 3 ? 'bullish' : change24h < -3 ? 'bearish' : 'neutral';
        const trendStrength = Math.abs(change24h);

        // Calculate support and resistance
        const supportLevel = low24h * 0.98;
        const resistanceLevel = high24h * 1.02;

        // Suggest entry, targets, and stop-loss
        const entry = price;
        const stopLoss = supportLevel * 0.97; // 3% below support
        const target1 = resistanceLevel * 0.98; // Near resistance
        const target2 = resistanceLevel * 1.05; // Extended target

        return {
            price: price,
            trend: { direction: trend, strength: trendStrength },
            rsi: { value: rsiClamped, signal: rsiClamped > 70 ? 'overbought' : rsiClamped < 30 ? 'oversold' : 'neutral' },
            supportLevel: supportLevel,
            resistanceLevel: resistanceLevel,
            entry: entry,
            stopLoss: stopLoss,
            targets: [target1, target2],
            technical: {
                score: this.calculateQuickTechnicalScore(change24h, rsiClamped, volume, trendStrength)
            },
            momentum: {
                direction: trend,
                strength: trendStrength
            }
        };
    }

    /**
     * 🎯 Calculate Quick Technical Score
     */
    calculateQuickTechnicalScore(change24h, rsi, volume, trendStrength) {
        let score = 50;

        // Trend contribution
        if (change24h > 5) score += 20;
        else if (change24h > 0) score += 10;
        else if (change24h < -5) score -= 20;
        else if (change24h < 0) score -= 10;

        // RSI contribution (prefer not extreme)
        if (rsi > 30 && rsi < 70) score += 10;
        else if (rsi < 30) score += 15; // Oversold = opportunity
        else if (rsi > 70) score -= 15; // Overbought = risk

        // Volume contribution
        if (volume > 1000000000) score += 10;
        else if (volume < 10000000) score -= 10;

        return Math.min(100, Math.max(0, score));
    }

    /**
     * 🎯 Calculate Opportunity Priority
     */
    calculateOpportunityPriority(profitability) {
        return profitability.score * profitability.riskReward.ratio;
    }

    /**
     * 💼 Optimize Portfolio Allocation
     */
    optimizePortfolio(holdings, availableCapital, marketDataMap) {
        const suggestions = [];

        // Analyze current holdings
        for (const holding of holdings) {
            const marketData = marketDataMap[holding.coinId];
            if (!marketData) continue;

            const analysis = this.quickTechnicalAnalysis(marketData);
            const profitability = this.calculateProfitabilityScore(analysis, marketData);

            // Suggest actions based on profitability
            if (profitability.score < 50) {
                suggestions.push({
                    coin: holding.coinId.toUpperCase(),
                    action: 'REDUCE',
                    reason: `Low profitability score (${profitability.score}). Consider taking profits or reducing exposure.`,
                    currentValue: holding.currentValue,
                    suggestedAction: `Reduce by 25-50% if in profit, or set tight stop-loss if at loss.`
                });
            } else if (profitability.score >= 75) {
                suggestions.push({
                    coin: holding.coinId.toUpperCase(),
                    action: 'HOLD/ADD',
                    reason: `High profitability score (${profitability.score}). Strong opportunity.`,
                    currentValue: holding.currentValue,
                    suggestedAction: `Consider adding to position if trend continues, or take partial profits at targets.`
                });
            }
        }

        // Find new opportunities for available capital
        const topCoins = ['bitcoin', 'ethereum', 'solana', 'cardano', 'binancecoin'];
        const newOpportunities = [];

        for (const coinId of topCoins) {
            const isHeld = holdings.some(h => h.coinId === coinId);
            if (isHeld) continue; // Skip if already holding

            const marketData = marketDataMap[coinId];
            if (!marketData) continue;

            const analysis = this.quickTechnicalAnalysis(marketData);
            const profitability = this.calculateProfitabilityScore(analysis, marketData);

            if (profitability.score >= 70) {
                const suggestedAllocation = Math.min(
                    availableCapital * 0.15, // Max 15% per position
                    availableCapital * (profitability.score / 100) * 0.20 // Scale with score
                );

                newOpportunities.push({
                    coin: coinId.toUpperCase(),
                    action: 'BUY',
                    profitability: profitability,
                    suggestedAllocation: suggestedAllocation,
                    reason: `High profitability score (${profitability.score}) with good risk/reward.`
                });
            }
        }

        return {
            rebalanceSuggestions: suggestions,
            newOpportunities: newOpportunities.slice(0, 3), // Top 3
            totalCapital: availableCapital + holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0)
        };
    }

    /**
     * 💰 Calculate Optimal Position Size
     */
    calculatePositionSize(accountBalance, riskPercentage, entryPrice, stopLoss) {
        const riskAmount = accountBalance * (riskPercentage / 100);
        const priceRisk = Math.abs(entryPrice - stopLoss);

        if (priceRisk === 0) return { size: 0, riskAmount: 0, error: 'Invalid stop-loss' };

        const positionSize = riskAmount / priceRisk;

        return {
            size: parseFloat(positionSize.toFixed(8)),
            usdtValue: parseFloat((positionSize * entryPrice).toFixed(2)),
            riskAmount: parseFloat(riskAmount.toFixed(2)),
            riskPercent: riskPercentage,
            stopLossDistance: ((priceRisk / entryPrice) * 100).toFixed(2) + '%'
        };
    }

    /**
     * 🎯 Suggest Profit Targets
     */
    suggestProfitTargets(entryPrice, stopLoss, trend, resistanceLevel) {
        const risk = Math.abs(entryPrice - stopLoss);
        
        // SHORT-TERM Targets: Smaller, quicker profits
        // Target 1: 2:1 Risk/Reward (quick scalp - 1-3%)
        const target1 = entryPrice + (risk * 2 * (trend === 'bullish' ? 1 : -1));

        // Target 2: 3:1 Risk/Reward (moderate target - 2-5%)
        const target2 = entryPrice + (risk * 3 * (trend === 'bullish' ? 1 : -1));

        // Target 3: Moderate extension for short-term (3-8% max)
        const target3 = entryPrice + (risk * 5 * (trend === 'bullish' ? 1 : -1));

        return {
            conservative: {
                price: parseFloat(target1.toFixed(2)),
                rewardPercent: ((Math.abs(target1 - entryPrice) / entryPrice) * 100).toFixed(2),
                riskReward: '2:1',
                action: 'Take 50% profit FAST here (QUICK scalp), move stop to breakeven immediately'
            },
            moderate: {
                price: parseFloat(target2.toFixed(2)),
                rewardPercent: ((Math.abs(target2 - entryPrice) / entryPrice) * 100).toFixed(2),
                riskReward: '3:1',
                action: 'Take 30% profit here, consider trailing stop for remaining'
            },
            aggressive: {
                price: parseFloat(target3.toFixed(2)),
                rewardPercent: ((Math.abs(target3 - entryPrice) / entryPrice) * 100).toFixed(2),
                riskReward: '5:1',
                action: 'Take remaining 20% profit FAST - exit within hours!'
            }
        };
    }

    /**
     * ⏰ Get Expected Time Frame
     */
    getExpectedTimeFrame(strategyType) {
        const timeframes = {
            'rsi_scalping': '1-3 hours',
            'quick_breakout': '1-4 hours',
            'momentum_scalp': '30min-2 hours',
            'support_bounce': '1-2 hours',
            'volume_spike': '1-2 hours',
            'fibonacci_bounce': '1-3 hours',
            'quick_reversal': '1-3 hours',
            'pattern_trade': '2-4 hours',
            'rsi_divergence': '3-7 days',
            'support_resistance': '1-3 days'
        };
        return timeframes[strategyType] || '2-4 hours';
    }

    /**
     * 📝 Get Timing Notes
     */
    getTimingNotes(score) {
        if (score >= 70) return 'Excellent entry timing - near support/resistance with good momentum alignment';
        if (score >= 60) return 'Good entry timing - favorable conditions for entry';
        if (score >= 50) return 'Fair timing - acceptable but not optimal';
        return 'Poor timing - wait for better entry conditions';
    }

    /**
     * 📊 Format Opportunity for Display
     */
    formatOpportunity(opportunity) {
        const prof = opportunity.profitability;
        return {
            coin: opportunity.coin,
            score: prof.score,
            rating: prof.rating,
            riskReward: prof.riskReward.ratio,
            expectedProfit: prof.expectedProfit.percentage + '%',
            recommendation: prof.recommendation,
            entry: opportunity.analysis.entry?.toFixed(2),
            stopLoss: opportunity.analysis.stopLoss?.toFixed(2),
            target: opportunity.analysis.targets?.[0]?.toFixed(2)
        };
    }
}

// Export for use in main application
window.ProfitabilityEngine = ProfitabilityEngine;


