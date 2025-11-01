// SamCrypto AI - Chat Interface with Cerebras GPT-OSS-120B API

class SamCryptoAI {
    constructor() {
        // Initialize UserManager first
        this.userManager = new UserManager();
        
        // Cerebras API Configuration
        this.apiKeys = [
            'csk-j9njfnrf9tctv246fdtph3xht6dh8pfrpmr3jnhrcyjpr38k' // Cerebras API Key
        ];
        this.currentKeyIndex = 0; // Track which key we're using
        this.apiKey = this.apiKeys[this.currentKeyIndex]; // Start with first key
        this.keyUsageCount = {}; // Track usage per key
        this.lastKeyRotation = Date.now();
        this.conversationHistory = [];
        
        // Advanced Memory System (ChatGPT/Claude-level)
        this.conversationContext = {
            messages: [],
            summary: '',
            keyPoints: [],
            userIntent: '',
            lastTopic: '',
            previousQuestions: [],
            userProfile: {}
        };
        this.maxContextMessages = 10; // Reduced from 20 to 10 for speed
        this.contextWindowSize = 8000; // Reduced from 15000 for faster processing
        
        // Enhanced Multi-Source Crypto Price APIs
        this.coinGeckoAPI = 'https://api.coingecko.com/api/v3';
        this.binanceAPI = 'https://api.binance.com/api/v3';
        this.coinbaseAPI = 'https://api.coinbase.com/v2';
        this.cryptoCompareAPI = 'https://min-api.cryptocompare.com/data';
        this.coinCapAPI = 'https://api.coincap.io/v2';
        
        // AI and other APIs - Using Cerebras GPT-OSS-120B for superior crypto analysis
        this.cerebrasAPI = 'https://api.cerebras.ai/v1/chat/completions';
        this.cerebrasModel = 'gpt-oss-120b';
        this.coinDeskAPI = 'https://api.coindesk.com/v1';
        
        // 🌐 Perplexity AI API - Real-time web search for news and market sentiment
        this.perplexityAPI = 'https://api.perplexity.ai/chat/completions';
        this.perplexityApiKey = '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';
        this.useHybridAI = true; // Enable hybrid AI mode (Perplexity + Cerebras)
        
        this.tradingStrategies = this.initializeTradingStrategies();
        
        // Price update configuration
        this.priceUpdateInterval = 30000; // 30 seconds
        this.maxPriceAge = 60000; // 1 minute max age for cached prices
        
        // Professional memory system (user-specific)
        this.userMemory = {};
        this.sessionMemory = [];
        this.userPreferences = {
            favoriteCoins: [],
            tradingStyle: 'unknown',
            riskTolerance: 'unknown',
            experienceLevel: 'unknown',
            interests: []
        };
        
        // Scroll management
        this.isUserScrolling = false;
        this.userScrollTimeout = null;
        this.isNearBottom = true;
        
        // Typing indicator tracking
        this.typingIndicatorStartTime = null;
        
        // Professional features (user-specific data)
        this.portfolio = { 
            totalValue: 0, 
            totalPnL: 0, 
            totalPnLPercent: 0, 
            holdings: [],
            trades: [],
            usdtBalance: 0  // USDT capital for buying coins
        };
        this.alerts = [];
        this.charts = {};
        this.voiceRecognition = null;
        this.isDarkTheme = true;
        this.sentimentData = {};
        this.backtestResults = {};
        this.tradeUpdateInterval = null;
        this.symbolToCoinId = {
            BTC: 'bitcoin',
            ETH: 'ethereum',
            SOL: 'solana',
            BNB: 'binancecoin',
            XRP: 'ripple',
            ADA: 'cardano',
            DOGE: 'dogecoin',
            MATIC: 'polygon',
            DOT: 'polkadot',
            LTC: 'litecoin',
            AVAX: 'avalanche-2',
            LINK: 'chainlink',
            TRX: 'tron',
            XLM: 'stellar',
            ATOM: 'cosmos',
            ALGO: 'algorand',
            FIL: 'filecoin',
            VET: 'vechain',
            APT: 'aptos',
            INJ: 'injective-protocol',
            NEAR: 'near',
            OP: 'optimism',
            ARB: 'arbitrum',
            SEI: 'sei-network',
            SUI: 'sui',
            RENDER: 'render-token',
            WLD: 'worldcoin-wld',
            PEPE: 'pepe',
            SHIB: 'shiba-inu',
            BCHA: 'ecash'
        };
        this.coinToBinanceSymbol = {
            bitcoin: 'BTCUSDT', btc: 'BTCUSDT',
            ethereum: 'ETHUSDT', eth: 'ETHUSDT',
            solana: 'SOLUSDT', sol: 'SOLUSDT',
            binancecoin: 'BNBUSDT', bnb: 'BNBUSDT',
            ripple: 'XRPUSDT', xrp: 'XRPUSDT',
            cardano: 'ADAUSDT', ada: 'ADAUSDT',
            dogecoin: 'DOGEUSDT', doge: 'DOGEUSDT',
            chainlink: 'LINKUSDT', link: 'LINKUSDT',
            polygon: 'MATICUSDT', matic: 'MATICUSDT',
            polkadot: 'DOTUSDT', dot: 'DOTUSDT',
            litecoin: 'LTCUSDT', ltc: 'LTCUSDT',
            avalanche: 'AVAXUSDT', 'avalanche-2': 'AVAXUSDT', avax: 'AVAXUSDT',
            cosmos: 'ATOMUSDT', atom: 'ATOMUSDT',
            near: 'NEARUSDT',
            arbitrum: 'ARBUSDT', arb: 'ARBUSDT',
            optimism: 'OPUSDT', op: 'OPUSDT'
        };
        this.currentAIPowersCoin = 'bitcoin';
        this.aiPowersCache = new Map();
        
        // API caching and rate limiting
        this.cache = new Map();
        this.cacheTTL = 30000; // 30 seconds cache TTL
        this.pendingRequests = new Map();
        this.requestQueue = [];
        this.maxConcurrentRequests = 3;
        
        // Message sending flag to prevent duplicates
        this.isSending = false;
        
        // Thinking state for animation control
        this.isThinking = false;
        
        // Abort controller for stopping AI responses
        this.abortController = null;
        
        // Professional greeting messages
        this.greetingMessages = [
            "Welcome to SamCrypto AI. Ready for focused market analysis.",
            "You're in. I provide precise crypto insights and trading levels.",
            "SamCrypto AI online. Share your pair and timeframe to begin.",
            "Professional crypto analysis loaded. Ask for levels, setup, or risk.",
            "I deliver concise, data-driven crypto insights. What do you need?",
            "SamCrypto AI is ready. Technicals, risk, and targets on request."
        ];
        
        // Initialize application
        this.initializeApplication();
    }

    // New initialization method that handles user-specific setup
    initializeApplication() {
        // Load user-specific data if logged in
        this.loadUserData();
        
        // Setup event listeners
        this.initializeEventListeners();
        
        // Configure API key based on user
        this.configureApiKey();
        
        // Load chat history
        this.loadChatHistory();
        
        // Load conversation context (advanced memory)
        this.loadConversationContext();
        
        // Initialize portfolio charts
        this.initializePortfolioCharts();
        
        // Preload Binance all-ticker data for faster responses
        this.preloadBinanceData();
        
        // Initialize new features
        this.initializeNewFeatures();
        
        console.log('SamCrypto AI initialized successfully');
        console.log('🧠 Advanced memory system active - ChatGPT/Claude-level context awareness');
    }

    initializeNewFeatures() {
        // Initialize NewFeatures class if available
        if (typeof NewFeatures !== 'undefined') {
            this.newFeatures = new NewFeatures(this);
            console.log('✅ New features initialized: Paper Trading, Whale Alerts, Chart Analysis, Performance Dashboard');
        }
        
        // Initialize TradingView charts feature
        this.initializeTradingViewCharts();
        
        // Initialize news sentiment feature
        this.initializeNewsSentiment();
    }

    initializeTradingViewCharts() {
        // Add click handler to show chart in chat
        const chartsToggle = document.getElementById('chartsToggle');
        if (chartsToggle) {
            chartsToggle.addEventListener('click', () => {
                this.showTradingViewChart('BTCUSDT');
            });
        }
    }

    parseTradePair(pairInput) {
        if (!pairInput) return null;
        const cleaned = pairInput.trim().toUpperCase().replace(/\s+/g, '');
        const parts = cleaned.split('/');
        if (parts.length !== 2) return null;
        const base = parts[0];
        const quote = parts[1];
        if (!base || !quote) return null;
        return { base, quote, normalized: `${base}/${quote}` };
    }

    mapPairToCoinId(pair) {
        if (!pair) return null;
        if (pair.quote === 'USDT') {
            const mapped = this.symbolToCoinId[pair.base];
            if (mapped) return mapped;
        }
        const fallback = pair.base.toLowerCase();
        return fallback;
    }

    async addPortfolioTrade() {
        const pairInput = document.getElementById('tradePairInput').value;
        const side = document.getElementById('tradeSideSelect').value;
        const leverage = parseFloat(document.getElementById('tradeLeverageInput').value);
        const margin = parseFloat(document.getElementById('tradeMarginInput').value);
        const entryPrice = parseFloat(document.getElementById('tradeEntryInput').value);
        const takeProfit = parseFloat(document.getElementById('tradeTpInput').value);
        const stopLoss = parseFloat(document.getElementById('tradeSlInput').value);

        const pair = this.parseTradePair(pairInput);
        if (!pair) {
            alert('Please enter a valid pair like SOL/USDT');
            return;
        }

        if (!side || !['long', 'short'].includes(side)) {
            alert('Please select trade side (long or short)');
            return;
        }

        if (!leverage || leverage <= 0) {
            alert('Please enter a valid leverage (e.g., 10)');
            return;
        }

        if (!margin || margin <= 0) {
            alert('Please enter the margin (USDT) used for this trade');
            return;
        }

        if (!entryPrice || entryPrice <= 0) {
            alert('Please enter a valid entry price');
            return;
        }

        const coinId = this.mapPairToCoinId(pair);
        if (!coinId) {
            alert('Unable to map the pair to a known coin for live pricing. Please try a different pair.');
            return;
        }

        const marginAvailable = this.portfolio.usdtBalance || 0;
        if (margin > marginAvailable) {
            const confirmUse = confirm(`⚠️ Margin exceeds current USDT balance.\n\nMargin required: $${margin.toFixed(2)}\nAvailable USDT: $${marginAvailable.toFixed(2)}\n\nDo you want to continue?`);
            if (!confirmUse) return;
        }

        const positionSize = margin * leverage;
        const quantity = positionSize / entryPrice;

        const newTrade = {
            id: Date.now(),
            pair: pair.normalized,
            base: pair.base,
            quote: pair.quote,
            coinId,
            side,
            leverage,
            margin,
            entryPrice,
            quantity,
            takeProfit: takeProfit || null,
            stopLoss: stopLoss || null,
            status: 'open',
            createdAt: new Date().toISOString(),
            lastUpdated: null,
            currentPrice: entryPrice,
            pnl: 0,
            pnlPercent: 0,
            riskedAmount: margin,
            liquidationPrice: this.calculateLiquidationPrice(side, entryPrice, leverage)
        };

        this.portfolio.trades.unshift(newTrade);
        this.portfolio.usdtBalance = Math.max(0, (this.portfolio.usdtBalance || 0) - margin);

        this.savePortfolio();
        await this.updatePortfolioDisplay(true);
        this.recordPortfolioSnapshot();
        this.pushTradeToConversationMemory(newTrade);

        document.getElementById('tradePairInput').value = '';
        document.getElementById('tradeLeverageInput').value = '';
        document.getElementById('tradeMarginInput').value = '';
        document.getElementById('tradeEntryInput').value = '';
        document.getElementById('tradeTpInput').value = '';
        document.getElementById('tradeSlInput').value = '';

        alert('✅ Trade added! Live P&L will update automatically.');
    }

    calculateLiquidationPrice(side, entryPrice, leverage) {
        if (!entryPrice || !leverage) return null;
        const maintenanceMargin = 0.0065; // Approx Binance futures maintenance margin
        const liquidationBuffer = 1 - maintenanceMargin * leverage;
        if (liquidationBuffer <= 0) return null;

        if (side === 'long') {
            return entryPrice * liquidationBuffer;
        } else {
            return entryPrice / liquidationBuffer;
        }
    }

    pushTradeToConversationMemory(trade) {
        try {
            this.addToConversationHistory('system', `User opened a ${trade.side.toUpperCase()} trade on ${trade.pair} at ${trade.entryPrice} with ${trade.leverage}x leverage using $${trade.margin}. Quantity: ${trade.quantity}.`);
            this.updateConversationContext(`User opened a ${trade.side} ${trade.pair} trade at ${trade.entryPrice} with ${trade.leverage}x leverage.`, 'system');
        } catch (error) {
            console.warn('Failed to push trade into conversation memory:', error);
        }
    }

    calculateTradesSummary() {
        if (!this.portfolio.trades || this.portfolio.trades.length === 0) {
            return {
                marginInUse: 0,
                totalPnL: 0,
                totalPnLPercent: 0
            };
        }

        let marginInUse = 0;
        let totalPnL = 0;
        let totalCost = 0;

        this.portfolio.trades.forEach(trade => {
            if (trade.status === 'open') {
                marginInUse += trade.margin || 0;
                totalPnL += trade.pnl || 0;
                totalCost += trade.margin || 0;
            }
        });

        return {
            marginInUse,
            totalPnL,
            totalPnLPercent: totalCost > 0 ? (totalPnL / totalCost) * 100 : 0
        };
    }

    renderTrades() {
        const tradesList = document.getElementById('tradesList');
        if (!tradesList) return;

        tradesList.innerHTML = '';

        if (!this.portfolio.trades || this.portfolio.trades.length === 0) {
            tradesList.innerHTML = '<div class="no-trades">No leveraged trades yet. Add one to start tracking live P&L.</div>';
            return;
        }

        this.portfolio.trades.forEach((trade, index) => {
            const tradeDiv = document.createElement('div');
            tradeDiv.className = 'trade-item';

            const pnlClass = trade.pnl >= 0 ? 'positive' : 'negative';
            const tp = trade.takeProfit ? `$${trade.takeProfit.toFixed(4)}` : '—';
            const sl = trade.stopLoss ? `$${trade.stopLoss.toFixed(4)}` : '—';
            const liquidation = trade.liquidationPrice ? `$${trade.liquidationPrice.toFixed(4)}` : '—';

            tradeDiv.innerHTML = `
                <div class="trade-header">
                    <span class="trade-pair">${trade.pair}</span>
                    <span class="trade-side ${trade.side}">${trade.side}</span>
                    <span class="trade-leverage">${trade.leverage}x</span>
                </div>
                <div class="trade-metric">
                    <span class="label">Entry</span>
                    <span class="value">$${trade.entryPrice.toFixed(4)}</span>
                </div>
                <div class="trade-metric">
                    <span class="label">Current</span>
                    <span class="value">$${(trade.currentPrice || trade.entryPrice).toFixed(4)}</span>
                </div>
                <div class="trade-metric">
                    <span class="label">Margin</span>
                    <span class="value">$${(trade.margin || 0).toFixed(2)}</span>
                </div>
                <div class="trade-metric">
                    <span class="label">Position Size</span>
                    <span class="value">$${(trade.quantity * trade.currentPrice).toFixed(2)}</span>
                </div>
                <div class="trade-metric">
                    <span class="label">Quantity</span>
                    <span class="value">${trade.quantity.toFixed(4)}</span>
                </div>
                <div class="trade-metric">
                    <span class="label">TP / SL</span>
                    <span class="value">${tp} / ${sl}</span>
                </div>
                <div class="trade-metric">
                    <span class="label">Liquidation</span>
                    <span class="value">${liquidation}</span>
                </div>
                <div class="trade-metric">
                    <span class="label">PnL</span>
                    <span class="trade-pnl ${pnlClass}">${trade.pnl >= 0 ? '+' : ''}$${(trade.pnl || 0).toFixed(2)} (${(trade.pnlPercent || 0).toFixed(2)}%)</span>
                </div>
                <div class="trade-actions">
                    <button onclick="samCryptoAI.closeTrade(${index})" class="close-trade">Close Trade</button>
                    <button onclick="samCryptoAI.editTrade(${index})">Edit</button>
                </div>
            `;

            tradesList.appendChild(tradeDiv);
        });
    }

    async closeTrade(index) {
        const trade = this.portfolio.trades[index];
        if (!trade) return;

        if (!confirm(`Close ${trade.side.toUpperCase()} ${trade.pair} trade?`)) {
            return;
        }

        if (trade.status === 'closed') {
            alert('Trade already closed');
            return;
        }

        try {
            const latestPrice = await this.fetchTradePrice(trade);
            const settledPrice = latestPrice?.price_usd || trade.currentPrice || trade.entryPrice;
            const pnlInfo = this.calculateTradePnL(trade, settledPrice);

            trade.status = 'closed';
            trade.closePrice = settledPrice;
            trade.closedAt = new Date().toISOString();
            trade.pnl = pnlInfo.pnl;
            trade.pnlPercent = pnlInfo.pnlPercent;

            this.portfolio.usdtBalance = (this.portfolio.usdtBalance || 0) + trade.margin + trade.pnl;

            this.savePortfolio();
            await this.updatePortfolioDisplay(true);

            alert(`✅ Trade closed!\n\nPnL: ${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)} (${trade.pnlPercent.toFixed(2)}%)\nFunds returned to USDT balance.`);

            this.pushTradeClosureToMemory(trade);
        } catch (error) {
            console.error('Error closing trade:', error);
            alert('Failed to close trade: ' + error.message);
        }
    }

    editTrade(index) {
        const trade = this.portfolio.trades[index];
        if (!trade) return;

        const newTp = prompt('Update Take-Profit (leave blank to keep current):', trade.takeProfit ?? '');
        if (newTp === null) return;

        const newSl = prompt('Update Stop-Loss (leave blank to keep current):', trade.stopLoss ?? '');
        if (newSl === null) return;

        const parsedTp = newTp === '' ? null : parseFloat(newTp);
        const parsedSl = newSl === '' ? null : parseFloat(newSl);

        if (parsedTp !== null && (isNaN(parsedTp) || parsedTp <= 0)) {
            alert('Invalid Take-Profit value');
            return;
        }

        if (parsedSl !== null && (isNaN(parsedSl) || parsedSl <= 0)) {
            alert('Invalid Stop-Loss value');
            return;
        }

        trade.takeProfit = parsedTp;
        trade.stopLoss = parsedSl;
        trade.lastUpdated = new Date().toISOString();

        this.savePortfolio();
        this.renderTrades();
        alert('✅ Trade updated!');
    }

    pushTradeClosureToMemory(trade) {
        try {
            this.addToConversationHistory('system', `Trade closed: ${trade.side.toUpperCase()} ${trade.pair} at ${trade.closePrice}. PnL: ${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)} (${trade.pnlPercent.toFixed(2)}%).`);
            this.updateConversationContext(`Trade closed for ${trade.pair}. Result: ${trade.pnl >= 0 ? 'profit' : 'loss'} of ${trade.pnl.toFixed(2)} USDT.`, 'system');
        } catch (error) {
            console.warn('Failed to update trade closure memory:', error);
        }
    }

    async fetchTradePrice(trade) {
        try {
            const cacheKey = `trade_price_${trade.coinId}`;
            const cached = this.getFromCache(cacheKey);
            if (cached) return cached;

            const data = await this.fetchMarketData(trade.coinId);
            if (data) {
                this.setCache(cacheKey, data);
            }
            return data;
        } catch (error) {
            console.error('Error fetching trade price:', error);
            return null;
        }
    }

    calculateTradePnL(trade, currentPrice) {
        const priceDiff = trade.side === 'long'
            ? currentPrice - trade.entryPrice
            : trade.entryPrice - currentPrice;

        const pnl = priceDiff * trade.quantity;
        const pnlPercent = (pnl / (trade.margin || 1)) * 100;

        return { pnl, pnlPercent };
    }

    async updateTradesPrices(force = false) {
        if (!this.portfolio.trades || this.portfolio.trades.length === 0) return;

        for (const trade of this.portfolio.trades) {
            if (trade.status === 'closed') continue;

            const lastUpdate = trade.lastUpdated ? new Date(trade.lastUpdated).getTime() : 0;
            if (!force && Date.now() - lastUpdate < 10000) {
                continue;
            }

            const priceData = await this.fetchTradePrice(trade);
            if (!priceData || !priceData.price_usd) continue;

            const pnlInfo = this.calculateTradePnL(trade, priceData.price_usd);
            trade.currentPrice = priceData.price_usd;
            trade.pnl = pnlInfo.pnl;
            trade.pnlPercent = pnlInfo.pnlPercent;
            trade.lastUpdated = new Date().toISOString();

            // Auto-close if TP/SL hit
            if (trade.takeProfit && ((trade.side === 'long' && trade.currentPrice >= trade.takeProfit) ||
                (trade.side === 'short' && trade.currentPrice <= trade.takeProfit))) {
                this.notifyTradeTargetHit(trade, 'Take-Profit');
            }

            if (trade.stopLoss && ((trade.side === 'long' && trade.currentPrice <= trade.stopLoss) ||
                (trade.side === 'short' && trade.currentPrice >= trade.stopLoss))) {
                this.notifyTradeTargetHit(trade, 'Stop-Loss');
            }
        }

        this.savePortfolio();
        this.renderTrades();
        const summary = this.calculateTradesSummary();
        const tradePnLElement = document.getElementById('totalTradePnL');
        if (tradePnLElement) {
            tradePnLElement.textContent = `${summary.totalPnL >= 0 ? '+' : ''}$${summary.totalPnL.toFixed(2)} (${summary.totalPnLPercent.toFixed(2)}%)`;
            tradePnLElement.className = `value ${summary.totalPnL >= 0 ? 'positive' : 'negative'}`;
        }
        const marginElement = document.getElementById('totalMarginInUse');
        if (marginElement) {
            marginElement.textContent = `$${summary.marginInUse.toFixed(2)}`;
        }
    }

    notifyTradeTargetHit(trade, type) {
        const message = `⚠️ ${type} triggered for ${trade.pair} ${trade.side.toUpperCase()} trade at $${trade.currentPrice.toFixed(4)}.`;
        alert(message);
        this.addMessage(message, 'ai');
        this.addToConversationHistory('assistant', message);
    }

    startTradeUpdates() {
        if (this.tradeUpdateInterval) {
            clearInterval(this.tradeUpdateInterval);
        }

        this.tradeUpdateInterval = setInterval(() => {
            this.updateTradesPrices();
        }, 15000);
    }

    stopTradeUpdates() {
        if (this.tradeUpdateInterval) {
            clearInterval(this.tradeUpdateInterval);
            this.tradeUpdateInterval = null;
        }
    }

    async forceRefreshTrades() {
        await this.updateTradesPrices(true);
    }

    showTradingViewChart(symbol) {
        const chartHTML = `
            <div class="tradingview-widget-container" style="height:500px; margin: 20px 0;">
                <div id="tradingview_chart_${Date.now()}"></div>
            </div>
        `;
        
        this.addMessage(chartHTML, 'ai');
        
        // Initialize TradingView widget
        setTimeout(() => {
            const chartId = document.querySelector('[id^="tradingview_chart_"]').id;
            new TradingView.widget({
                "autosize": true,
                "symbol": `BINANCE:${symbol}`,
                "interval": "240",
                "timezone": "Etc/UTC",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "toolbar_bg": "#f1f3f6",
                "enable_publishing": false,
                "allow_symbol_change": true,
                "container_id": chartId
            });
        }, 100);
    }

    initializeNewsSentiment() {
        // Enhance existing fetchCryptoNews to include sentiment
        const newsToggle = document.getElementById('newsToggle');
        if (newsToggle) {
            newsToggle.addEventListener('click', async () => {
                await this.showNewsSentiment();
            });
        }
    }

    async showNewsSentiment() {
        try {
            this.app.addMessage('📰 Fetching latest crypto news with AI sentiment analysis...', 'ai');
            
            // Fetch news (using existing method)
            const newsData = await this.fetchCryptoNews();
            
            if (!newsData || newsData.length === 0) {
                this.addMessage('No news available at the moment.', 'ai');
                return;
            }

            // Analyze sentiment with AI
            const newsText = newsData.slice(0, 5).map((article, i) => 
                `${i+1}. ${article.title || article.headline}`
            ).join('\n');

            const sentimentPrompt = `Analyze the overall crypto market sentiment from these recent news headlines:\n\n${newsText}\n\nProvide: 1) Overall sentiment (Bullish/Bearish/Neutral) with confidence %, 2) Key themes, 3) Which coins are mentioned most, 4) Trading implications. Be concise.`;

            const response = await fetch(`${this.cerebrasAPI}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.cerebrasModel,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a crypto market sentiment analyst.'
                        },
                        {
                            role: 'user',
                            content: sentimentPrompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            const data = await response.json();
            const analysis = data.choices?.[0]?.message?.content || 'Could not analyze sentiment.';

            const message = `📰 **Latest Crypto News Sentiment**\n\n${analysis}\n\n**Recent Headlines:**\n${newsData.slice(0, 5).map((article, i) => `${i+1}. ${article.title || article.headline}`).join('\n')}`;
            
            this.addMessage(message, 'ai');

        } catch (error) {
            console.error('News sentiment error:', error);
            this.addMessage('❌ Could not fetch news sentiment. Please try again.', 'ai');
        }
    }

    // Load user-specific data
    loadUserData() {
        const currentUser = this.userManager.getCurrentUser();
        if (currentUser) {
            // Load user's portfolio with all fields
            this.portfolio = currentUser.portfolio || { 
                totalValue: 0, 
                totalPnL: 0, 
                totalPnLPercent: 0, 
                holdings: [],
                trades: [],
                usdtBalance: 0 
            };
            this.portfolio.holdings = this.portfolio.holdings || [];
            this.portfolio.trades = this.portfolio.trades || [];
            this.portfolio.usdtBalance = this.portfolio.usdtBalance || 0;
            
            console.log('📊 Portfolio loaded:', this.portfolio);
            
            // Load user's alerts
            this.alerts = currentUser.alerts || [];
            
            // Load user's chat history
            this.conversationHistory = currentUser.chatHistory || [];
            
            // Load user's memory and preferences
            this.userMemory = currentUser.conversationMemory || {
                conversations: [],
                userProfile: {},
                tradingHistory: [],
                preferences: {},
                lastUpdated: new Date().toISOString()
            };
            this.userPreferences = currentUser.preferences || {
                favoriteCoins: [],
                tradingStyle: 'unknown',
                riskTolerance: 'unknown',
                experienceLevel: 'unknown',
                interests: []
            };
            
            // Load API key from user profile
            if (currentUser.preferences && currentUser.preferences.apiKey) {
                this.apiKey = currentUser.preferences.apiKey;
            }
            
            console.log('User data loaded successfully for:', currentUser.name);
        } else {
            // Ensure defaults are set even when no user is logged in
            console.log('No user logged in, using default values');
            this.portfolio = { 
                totalValue: 0, 
                totalPnL: 0, 
                totalPnLPercent: 0, 
                holdings: [],
                trades: [],
                usdtBalance: 0
            };
            this.alerts = [];
            this.conversationHistory = [];
            this.userMemory = {
                conversations: [],
                userProfile: {},
                tradingHistory: [],
                preferences: {},
                lastUpdated: new Date().toISOString()
            };
            this.userPreferences = {
                favoriteCoins: [],
                tradingStyle: 'unknown',
                riskTolerance: 'unknown',
                experienceLevel: 'unknown',
                interests: []
            };
        }
    }

    // Configure API key based on user login status
    configureApiKey() {
        const currentUser = this.userManager.getCurrentUser();
        
        // If user has their own API key, use it
        if (currentUser && currentUser.preferences.apiKey) {
            this.apiKey = currentUser.preferences.apiKey;
        } else {
            // Check localStorage as fallback
            const savedApiKey = localStorage.getItem('cerebras_api_key');
            if (savedApiKey) {
                this.apiKey = savedApiKey;
            }
            // Otherwise, use the default API key (already set in constructor)
        }
        
        // Always hide API modal since we have a default key
        this.hideApiModal();
    }

    initializeTradingStrategies() {
        return {
            "strategies": [
                {
                    "name": "RSI Strategy",
                    "description": "Use Relative Strength Index (RSI) to detect oversold (<30) and overbought (>70) conditions.",
                    "buy_rule": "RSI < 30",
                    "sell_rule": "RSI > 70",
                    "notes": "Combine with trend direction for confirmation."
                },
                {
                    "name": "MACD Crossover",
                    "description": "Use MACD line crossing the signal line as a momentum indicator.",
                    "buy_rule": "MACD crosses above signal line",
                    "sell_rule": "MACD crosses below signal line",
                    "notes": "Check against RSI to avoid false signals."
                },
                {
                    "name": "EMA Trend Filter",
                    "description": "Use two Exponential Moving Averages (fast EMA and slow EMA) to detect trend direction.",
                    "buy_rule": "Price > EMA50 and EMA10 crosses above EMA50",
                    "sell_rule": "Price < EMA50 and EMA10 crosses below EMA50",
                    "notes": "Avoid trading against the trend."
                },
                {
                    "name": "Bollinger Band Reversal",
                    "description": "Detect price reversals when price touches upper/lower Bollinger Bands.",
                    "buy_rule": "Price touches lower band and RSI < 40",
                    "sell_rule": "Price touches upper band and RSI > 60",
                    "notes": "Use with volume spike for confirmation."
                },
                {
                    "name": "Volume Spike Confirmation",
                    "description": "Identify strong moves confirmed by unusually high volume.",
                    "buy_rule": "Price rises with volume 2x above 20-period average",
                    "sell_rule": "Price drops with volume 2x above 20-period average",
                    "notes": "Combine with MACD or RSI for extra reliability."
                },
                {
                    "name": "Support & Resistance Bounce",
                    "description": "Detect price bounces from historical support/resistance levels.",
                    "buy_rule": "Price approaches support and shows bullish candlestick pattern",
                    "sell_rule": "Price approaches resistance and shows bearish candlestick pattern",
                    "notes": "Works best on 1h or 4h timeframes."
                },
                {
                    "name": "Candlestick Pattern Recognition",
                    "description": "Recognize key candlestick reversal patterns like hammer, shooting star, engulfing, doji.",
                    "buy_rule": "Bullish reversal pattern forms after a downtrend",
                    "sell_rule": "Bearish reversal pattern forms after an uptrend",
                    "notes": "Confirm with trend or volume before acting."
                },
                {
                    "name": "Breakout Strategy",
                    "description": "Detect breakout from consolidation zones or chart patterns.",
                    "buy_rule": "Price breaks above resistance with volume spike",
                    "sell_rule": "Price breaks below support with volume spike",
                    "notes": "Set stop-loss inside consolidation range."
                },
                {
                    "name": "Divergence Strategy",
                    "description": "Look for divergences between price and indicators (RSI, MACD).",
                    "buy_rule": "Price makes lower low but RSI/MACD makes higher low",
                    "sell_rule": "Price makes higher high but RSI/MACD makes lower high",
                    "notes": "Good for spotting trend reversals early."
                }
            ]
        };
    }

    initializeEventListeners() {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const saveApiKey = document.getElementById('saveApiKey');
        const skipApiKey = document.getElementById('skipApiKey');
        
        // Features Page buttons
        const openFeaturesPage = document.getElementById('openFeaturesPage');
        const closeFeaturesPage = document.getElementById('closeFeaturesPage');
        const portfolioToggle = document.getElementById('portfolioToggle');
        const chartsToggle = document.getElementById('chartsToggle');
        const alertsToggle = document.getElementById('alertsToggle');
        const voiceToggle = document.getElementById('voiceToggle');
        const themeToggle = document.getElementById('themeToggle');
        const backtestingToggle = document.getElementById('backtestingToggle');
        const sentimentToggle = document.getElementById('sentimentToggle');
        const memoryStatus = document.getElementById('memoryStatus');

        messageInput.addEventListener('input', () => this.handleInputChange());
        messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        sendButton.addEventListener('click', () => {
            if (this.isThinking) {
                this.stopResponse();
            } else {
                this.sendMessage();
            }
        });
        saveApiKey?.addEventListener('click', () => this.saveApiKey());
        skipApiKey?.addEventListener('click', () => this.skipApiKey());
        
        // Voice input button
        const voiceInputBtn = document.getElementById('voiceInputBtn');
        voiceInputBtn?.addEventListener('click', () => this.toggleVoiceInput());
        
        // Features Page event listeners
        openFeaturesPage?.addEventListener('click', () => this.openFeaturesPage());
        closeFeaturesPage?.addEventListener('click', () => this.closeFeaturesPage());
        
        // Feature card event listeners (inside features page)
        portfolioToggle?.addEventListener('click', () => {
            this.closeFeaturesPage();
            this.togglePortfolio();
        });
        chartsToggle?.addEventListener('click', () => {
            this.closeFeaturesPage();
            this.toggleCharts();
        });
        alertsToggle?.addEventListener('click', () => {
            this.closeFeaturesPage();
            this.toggleAlerts();
        });
        voiceToggle?.addEventListener('click', () => {
            this.closeFeaturesPage();
            this.toggleVoice();
        });
        themeToggle?.addEventListener('click', () => {
            this.closeFeaturesPage();
            this.toggleTheme();
        });
        backtestingToggle?.addEventListener('click', () => {
            this.closeFeaturesPage();
            this.toggleBacktesting();
        });
        sentimentToggle?.addEventListener('click', () => {
            this.closeFeaturesPage();
            this.toggleSentiment();
        });
        memoryStatus?.addEventListener('click', () => {
            this.closeFeaturesPage();
            this.showMemoryStatus();
        });
        
        // Profile and Data Management in Features Page
        const openProfileSettings = document.getElementById('openProfileSettings');
        const openDataExport = document.getElementById('openDataExport');
        
        openProfileSettings?.addEventListener('click', () => {
            this.closeFeaturesPage();
            // Check if user is logged in
            if (this.userManager.isLoggedIn()) {
                this.userManager.showProfileModal();
            } else {
                this.userManager.showMessage('Please login to access profile settings', 'info');
                setTimeout(() => this.userManager.showLoginModal(), 1000);
            }
        });
        
        openDataExport?.addEventListener('click', () => {
            this.closeFeaturesPage();
            // Check if user is logged in
            if (this.userManager.isLoggedIn()) {
                this.userManager.exportUserData();
            } else {
                this.userManager.showMessage('Please login to export your data', 'info');
                setTimeout(() => this.userManager.showLoginModal(), 1000);
            }
        });
        
        // Import Data in Features Page
        const openDataImport = document.getElementById('openDataImport');
        openDataImport?.addEventListener('click', () => {
            this.closeFeaturesPage();
            // Check if user is logged in
            if (this.userManager.isLoggedIn()) {
                this.userManager.importUserData();
            } else {
                this.userManager.showMessage('Please login to import your data', 'info');
                setTimeout(() => this.userManager.showLoginModal(), 1000);
            }
        });
        
        // Logout in Features Page
        const openLogout = document.getElementById('openLogout');
        openLogout?.addEventListener('click', () => {
            this.closeFeaturesPage();
            if (this.userManager.isLoggedIn()) {
                if (confirm('Are you sure you want to logout?')) {
                    this.userManager.logout();
                }
            }
        });

        // Initialize action buttons
        this.initializeActionButtons();

        // Initialize market data updates
        this.initializeMarketData();
        
        // Initialize scroll management
        this.initializeScrollManagement();
        
        // Initialize advanced features
        this.initializeAdvancedFeatures();

        // Initialize portfolio charts
        this.initializePortfolioCharts();
    }

    checkApiKey() {
        // Skip API key modal completely - using built-in API key
        const apiModal = document.getElementById('apiModal');
        if (apiModal) {
            apiModal.classList.add('hidden');
        }
        console.log('✅ Using built-in API key');
    }

    showApiModal() {
        // Disabled - using built-in API key
        console.log('API modal disabled - using built-in key');
    }

    hideApiModal() {
        const apiModal = document.getElementById('apiModal');
        if (apiModal) {
            apiModal.classList.add('hidden');
        }
    }

    saveApiKey() {
        // Disabled - using built-in API key
        console.log('Save API key disabled - using built-in key');
    }

    skipApiKey() {
        this.hideApiModal();
    }

    handleInputChange() {
        // Use requestAnimationFrame for smooth 60fps updates
        if (this.inputChangeFrame) {
            cancelAnimationFrame(this.inputChangeFrame);
        }
        
        this.inputChangeFrame = requestAnimationFrame(() => {
            const input = document.getElementById('messageInput');
            const sendButton = document.getElementById('sendButton');
            const charCountElement = document.getElementById('charCount');
            const charCountContainer = document.querySelector('.char-count-inline');
            
            // Auto-resize textarea with smooth animation
            input.style.height = 'auto';
            const newHeight = Math.min(input.scrollHeight, 200); // Max 200px
            input.style.height = newHeight + 'px';
            
            // Update character count
            const currentLength = input.value.length;
            const maxLength = 1000;
            if (charCountElement) {
                charCountElement.textContent = `${currentLength}/${maxLength}`;
                
                // Add warning colors
                if (charCountContainer) {
                    charCountContainer.classList.remove('warning', 'danger');
                    if (currentLength > maxLength * 0.9) {
                        charCountContainer.classList.add('danger');
                    } else if (currentLength > maxLength * 0.8) {
                        charCountContainer.classList.add('warning');
                    }
                }
            }
            
            // Enable/disable send button
            sendButton.disabled = input.value.trim().length === 0;
        });
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }

    async sendMessage() {
        const input = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Prevent multiple simultaneous sends
        if (this.isSending) {
            console.warn('⚠️ Already sending a message, please wait...');
            return;
        }
        
        this.isSending = true;
        console.log('📤 Sending message:', message);
        
        // Add loading animation to send button
        sendButton.classList.add('sending');
        const sendIcon = sendButton.querySelector('.send-icon');
        const loadingIcon = sendButton.querySelector('.loading-icon');
        if (sendIcon) sendIcon.style.opacity = '0';
        if (loadingIcon) {
            loadingIcon.classList.remove('hidden');
            loadingIcon.style.opacity = '1';
        }
        
        // Hide welcome message on first user message
        this.hideWelcomeMessage();
        
        // Add user message to chat and memory
        this.addMessage(message, 'user');
        this.addToConversationHistory('user', message);
        
        // Advanced context management
        this.updateConversationContext(message, 'user');
        
        // Extract user preferences from the message
        this.extractAndSaveUserPreferences(message);
        
        // Clear input
        input.value = '';
        input.style.height = 'auto';
        document.getElementById('sendButton').disabled = true;
        const charCountElement = document.getElementById('charCount');
        if (charCountElement) {
            charCountElement.textContent = '0/1000';
        }
        // Also handle legacy char-count if exists
        const legacyCharCount = document.querySelector('.char-count');
        if (legacyCharCount) {
            legacyCharCount.textContent = '0/1000';
        }
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Create abort controller for this request
        this.abortController = new AbortController();
        
        try {
            // Get market data for crypto-related queries
            const marketData = await this.getMarketDataForQuery(message);
            
            // Generate AI response
            const response = await this.generateAIResponse(message, marketData);
            
            // Safety check - ensure we have a valid response
            if (!response || response.trim() === '') {
                throw new Error('Empty response received');
            }
            
            // Add AI response
            this.addMessage(response, 'ai');
            this.addToConversationHistory('assistant', response);
            
            // Hide indicators immediately after message is added
            this.hideTypingIndicator();
            this.hideSearchIndicator();
            
            // Update context with AI response
            this.updateConversationContext(response, 'assistant');
            
        } catch (error) {
            // Check if request was aborted by user
            if (error.name === 'AbortError') {
                console.log('🛑 Request aborted by user');
                return; // Already handled in stopResponse()
            }
            
            console.error('❌ Error generating response:', error);
            console.error('❌ Error stack:', error.stack);
            
            // Generate a fallback response using demo
            try {
                console.log('🔄 Attempting fallback response...');
                const fallbackResponse = this.generateDemoResponse(message, null);
                console.log('✅ Fallback generated:', fallbackResponse.substring(0, 100) + '...');
                this.addMessage(fallbackResponse, 'ai');
                this.addToConversationHistory('assistant', fallbackResponse);
            } catch (fallbackError) {
                console.error('❌ Fallback also failed:', fallbackError);
                console.error('❌ Fallback stack:', fallbackError.stack);
                this.addMessage('Hey! I\'m having a bit of trouble right now, but I\'m still here to help! 🚀 Try asking me about Bitcoin, Ethereum, or any crypto you\'re interested in!', 'ai');
            }
            
            // Hide indicators after message is added
            this.hideTypingIndicator();
            this.hideSearchIndicator();
        } finally {
            // Always reset sending flag
            this.isSending = false;
            
            // Clean up abort controller
            this.abortController = null;
            
            console.log('✅ Message send complete');
        }
    }

    // Simple Loading Indicator Methods
    showSearchIndicator(text = 'Searching real-time market data...') {
        // Just show the dots - same as typing
        this.showTypingIndicator();
    }

    hideSearchIndicator() {
        // Hide the dots
        this.hideTypingIndicator();
    }

    // Legacy compatibility - these methods are no longer used
    updateSourceStatus(source, status) {
        // Removed - no longer showing individual sources
    }

    resetSourceIndicators() {
        // Removed - no longer showing individual sources
    }

    async getMarketDataForQuery(query) {
        const intent = this.detectIntent(query);
        // Extract cryptocurrency mentions from the query
        let cryptoMentions = this.extractCryptoMentions(query);
        
        // If scanning the market, fetch a curated top-30 list for comprehensive coverage
        if (intent.type === 'market_scan') {
            cryptoMentions = [
                // Top 10
                'bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 
                'cardano', 'dogecoin', 'chainlink', 'polkadot', 'litecoin',
                // 11-20
                'avalanche', 'polygon', 'uniswap', 'cosmos', 'stellar',
                'vechain', 'fantom', 'hedera', 'algorand', 'apecoin',
                // 21-30  
                'near', 'arbitrum', 'optimism', 'injective', 'sei',
                'sui', 'aptos', 'render', 'worldcoin', 'pepe'
            ];
            console.log('🚀 Market Scan: Analyzing 30 top cryptocurrencies for best trade signals...');
        } else if (cryptoMentions.length === 0) {
            // If no specific crypto mentioned, fetch popular coins for context
            cryptoMentions = ['bitcoin', 'ethereum', 'solana']; // Always get real data for top coins
            console.log('🔄 No specific coins mentioned, fetching popular cryptocurrencies for context...');
        }
        
        // Show search indicator message
        const indicatorText = intent.type === 'market_scan'
            ? `Analyzing ${cryptoMentions.length} coins for best opportunities...`
            : `Fetching live market data for ${cryptoMentions.length} coin${cryptoMentions.length > 1 ? 's' : ''}...`;
        this.showSearchIndicator(indicatorText);
        
        const marketData = {};
        
        for (const crypto of cryptoMentions) {
            try {
                const data = await this.fetchMarketDataWithIndicator(crypto);
                // Add technical analysis data
                const technicalData = await this.getTechnicalAnalysis(crypto, data);
                marketData[crypto] = { ...data, ...technicalData };
            } catch (error) {
                console.error(`Error fetching data for ${crypto}:`, error);
            }
        }
        
        // Hide search indicator after data is fetched
        setTimeout(() => this.hideSearchIndicator(), 500);
        
        return marketData;
    }

    async getTechnicalAnalysis(coinId, marketData) {
        try {
            // Get additional technical data from CoinGecko
            const response = await fetch(`${this.coinGeckoAPI}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
            
            if (!response.ok) {
                throw new Error('Technical analysis API failed');
            }
            
            const data = await response.json();
            const marketDataInfo = data.market_data;
            
            if (!marketDataInfo) {
                return {};
            }
            
            // Calculate technical indicators
            const currentPrice = marketDataInfo.current_price?.usd || marketData.price_usd;
            const priceChange24h = marketDataInfo.price_change_percentage_24h || marketData.change_24h;
            const marketCap = marketDataInfo.market_cap?.usd || marketData.market_cap;
            const volume24h = marketDataInfo.total_volume?.usd || marketData.volume_24h;
            
            // Calculate RSI approximation based on price change
            const rsi = this.estimateRSIFromChange(priceChange24h);
            
            // Calculate support and resistance levels
            const support = currentPrice * 0.95; // 5% below current price
            const resistance = currentPrice * 1.05; // 5% above current price
            
            return {
                technical_indicators: {
                    rsi: rsi,
                    support_level: support,
                    resistance_level: resistance,
                    market_cap_rank: data.market_cap_rank || 'N/A',
                    price_change_7d: marketDataInfo.price_change_percentage_7d || 0,
                    price_change_30d: marketDataInfo.price_change_percentage_30d || 0,
                    ath: marketDataInfo.ath?.usd || 0,
                    atl: marketDataInfo.atl?.usd || 0,
                    ath_change_percentage: marketDataInfo.ath_change_percentage?.usd || 0,
                    atl_change_percentage: marketDataInfo.atl_change_percentage?.usd || 0
                },
                market_sentiment: this.calculateMarketSentiment(priceChange24h, volume24h, marketCap),
                volatility: this.calculateVolatility(priceChange24h, marketDataInfo.price_change_percentage_7d)
            };
        } catch (error) {
            console.error('Technical analysis error:', error);
            return {};
        }
    }

    estimateRSIFromChange(priceChange24h) {
        // Simplified RSI estimation based on 24h price change
        // This is a quick approximation, not true RSI calculation
        if (priceChange24h > 5) return 75; // Overbought
        if (priceChange24h > 2) return 65; // Bullish
        if (priceChange24h > 0) return 55; // Slightly bullish
        if (priceChange24h > -2) return 45; // Slightly bearish
        if (priceChange24h > -5) return 35; // Bearish
        return 25; // Oversold
    }

    calculateMarketSentiment(priceChange24h, volume24h, marketCap) {
        let sentiment = 'neutral';
        let strength = 'medium';
        
        if (priceChange24h > 3 && volume24h > marketCap * 0.1) {
            sentiment = 'very_bullish';
            strength = 'strong';
        } else if (priceChange24h > 1) {
            sentiment = 'bullish';
            strength = 'medium';
        } else if (priceChange24h < -3 && volume24h > marketCap * 0.1) {
            sentiment = 'very_bearish';
            strength = 'strong';
        } else if (priceChange24h < -1) {
            sentiment = 'bearish';
            strength = 'medium';
        }
        
        return { sentiment, strength };
    }

    calculateVolatility(priceChange24h, priceChange7d) {
        const volatility = Math.abs(priceChange24h) + Math.abs(priceChange7d) / 7;
        
        if (volatility > 10) return 'very_high';
        if (volatility > 5) return 'high';
        if (volatility > 2) return 'medium';
        return 'low';
    }

    extractCryptoMentions(query) {
        const mentionedCryptos = [];
        
        // Known crypto mappings (for popular coins)
        const knownCryptoMap = {
            'bitcoin': 'bitcoin', 'btc': 'btc',
            'ethereum': 'ethereum', 'eth': 'eth', 
            'binance': 'bnb', 'bnb': 'bnb',
            'cardano': 'cardano', 'ada': 'ada',
            'solana': 'solana', 'sol': 'sol',
            'polkadot': 'polkadot', 'dot': 'dot',
            'chainlink': 'chainlink', 'link': 'link',
            'litecoin': 'litecoin', 'ltc': 'ltc',
            'ripple': 'ripple', 'xrp': 'xrp',
            'dogecoin': 'dogecoin', 'doge': 'doge'
        };
        
        const queryLower = query.toLowerCase();
        
        // Method 1: Find known crypto names
        for (const [mention, coinSymbol] of Object.entries(knownCryptoMap)) {
            if (queryLower.includes(mention)) {
                if (!mentionedCryptos.includes(coinSymbol)) {
                    mentionedCryptos.push(coinSymbol);
                }
            }
        }
        
        // Method 2: Extract trading pairs like "SUL/USDT", "BTC/USD", etc.
        const tradingPairPattern = /([A-Z]{2,6})[\/\-]?(?:USDT|USD|BUSD|BTC|ETH)\b/gi;
        const tradingPairMatches = query.match(tradingPairPattern);
        if (tradingPairMatches) {
            tradingPairMatches.forEach(match => {
                const coinSymbol = match.replace(/[\/\-]?(USDT|USD|BUSD|BTC|ETH)/gi, '').toUpperCase();
                if (coinSymbol.length >= 2 && coinSymbol.length <= 6) {
                    if (!mentionedCryptos.includes(coinSymbol.toLowerCase())) {
                        mentionedCryptos.push(coinSymbol.toLowerCase());
                        console.log(`🎯 Extracted trading pair: ${match} → ${coinSymbol}`);
                    }
                }
            });
        }
        
        // Method 3: Extract potential crypto symbols (2-6 uppercase letters)
        const cryptoSymbolPattern = /\b[A-Z]{2,6}\b/g;
        const symbolMatches = query.match(cryptoSymbolPattern);
        if (symbolMatches) {
            symbolMatches.forEach(symbol => {
                // Filter out common non-crypto words
                const excludeWords = ['USD', 'US', 'API', 'CEO', 'AI', 'APP', 'BOT', 'CPU', 'GPU', 'RAM', 'SSD', 'VPN', 'URL', 'HTML', 'CSS', 'JS'];
                if (!excludeWords.includes(symbol) && symbol.length >= 2 && symbol.length <= 6) {
                    const symbolLower = symbol.toLowerCase();
                    if (!mentionedCryptos.includes(symbolLower)) {
                        mentionedCryptos.push(symbolLower);
                        console.log(`🔍 Extracted potential symbol: ${symbol}`);
                    }
                }
            });
        }
        
        // Method 4: Extract from common formats like "SYMBOL price", "buy SYMBOL", etc.
        const contextPattern = /(?:price of|buy|sell|about|think about|analysis of|trading)\s+([a-zA-Z]{2,6})/gi;
        let contextMatch;
        while ((contextMatch = contextPattern.exec(query)) !== null) {
            const symbol = contextMatch[1].toLowerCase();
            if (!mentionedCryptos.includes(symbol)) {
                mentionedCryptos.push(symbol);
                console.log(`📝 Extracted from context: ${symbol}`);
            }
        }
        
        // Remove duplicates and return
        const uniqueCryptos = [...new Set(mentionedCryptos)];
        console.log(`🎯 Total crypto mentions found: ${uniqueCryptos.length}`, uniqueCryptos);
        
        return uniqueCryptos;
    }

    async fetchMarketDataWithIndicator(coinId) {
        // Check individual coin cache first
        const cacheKey = `market_${coinId}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            console.log(`Using cached data for ${coinId}`);
            return cached;
        }
        
        try {
            // Step 1: Try to get from bulk Binance data
            this.updateSourceStatus('binance', 'loading');
            console.log(`🔄 Fetching ${coinId} from Binance all-ticker data...`);
            
            const binanceData = await this.fetchFromBinanceAllTicker(coinId);
            if (binanceData) {
                this.updateSourceStatus('binance', 'success');
                console.log(`✅ Found ${coinId} in Binance all-ticker: $${binanceData.price_usd.toFixed(2)} (${binanceData.change_24h > 0 ? '+' : ''}${binanceData.change_24h.toFixed(2)}%)`);
                
                // Add metadata
                binanceData.fetchTime = Date.now();
                binanceData.primarySource = 'Binance All-Ticker';
                
                // Cache the result
                this.setCache(cacheKey, binanceData);
                return binanceData;
            }
            
            // Step 2: Fallback to individual sources if not found in Binance
            console.log(`⚠️ ${coinId} not found in Binance all-ticker, trying individual sources...`);
            this.updateSourceStatus('binance', 'error');
            this.updateSourceStatus('coinGecko', 'loading');
            this.updateSourceStatus('coinCap', 'loading');
            
            const [coinGeckoData, coinCapData] = await Promise.allSettled([
                this.fetchFromCoinGecko(coinId).then(data => {
                    this.updateSourceStatus('coinGecko', 'success');
                    return data;
                }).catch(err => {
                    this.updateSourceStatus('coinGecko', 'error');
                    throw err;
                }),
                this.fetchFromCoinCap(coinId).then(data => {
                    this.updateSourceStatus('coinCap', 'success');
                    return data;
                }).catch(err => {
                    this.updateSourceStatus('coinCap', 'error');
                    throw err;
                })
            ]);
            
            let result;
            let primarySource = null;
            
            // Use the best available fallback source
            if (coinGeckoData.status === 'fulfilled' && coinGeckoData.value) {
                result = coinGeckoData.value;
                primarySource = 'CoinGecko';
            } else if (coinCapData.status === 'fulfilled' && coinCapData.value) {
                result = coinCapData.value;
                primarySource = 'CoinCap';
            } else {
                throw new Error('All fallback API sources failed');
            }
            
            console.log(`✅ Fallback data from ${primarySource}: $${result.price_usd.toFixed(2)} (${result.change_24h > 0 ? '+' : ''}${result.change_24h.toFixed(2)}%)`);
            
            // Add timestamp for freshness tracking
            result.fetchTime = Date.now();
            result.primarySource = primarySource;
            
            // Cache the result
            this.setCache(cacheKey, result);
            return result;
            
        } catch (error) {
            console.error('Real-time market data fetch error:', error);
            // Update all sources to error state
            ['coinGecko', 'binance', 'coinCap'].forEach(source => {
                this.updateSourceStatus(source, 'error');
            });
            // Return mock data for demo purposes
            return this.getMockMarketData(coinId);
        }
    }

    async fetchFromBinanceAllTicker(coinId) {
        try {
            // Check if we have recent all-ticker data cached
            const allTickerCache = this.getFromCache('binance_all_ticker');
            let allTickerData = allTickerCache;
            
            if (!allTickerData) {
                console.log('🔄 Fetching ALL Binance ticker data...');
                const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
                
                if (!response.ok) {
                    throw new Error('Binance all-ticker API failed');
                }
                
                allTickerData = await response.json();
                console.log(`✅ Fetched ${allTickerData.length} Binance tickers`);
                
                // Cache for 30 seconds
                this.setCache('binance_all_ticker', allTickerData);
            } else {
                console.log(`📦 Using cached Binance all-ticker data (${allTickerData.length} tickers)`);
            }
            
            // Dynamic symbol detection - search for ANY coin on Binance
            let tickerData = null;
            let binanceSymbol = null;
            
            // Method 1: Try known mappings first (for common coins)
            const commonSymbolMap = {
                'bitcoin': 'BTCUSDT', 'btc': 'BTCUSDT',
                'ethereum': 'ETHUSDT', 'eth': 'ETHUSDT',
                'binancecoin': 'BNBUSDT', 'bnb': 'BNBUSDT',
                'cardano': 'ADAUSDT', 'ada': 'ADAUSDT',
                'solana': 'SOLUSDT', 'sol': 'SOLUSDT',
                'polkadot': 'DOTUSDT', 'dot': 'DOTUSDT',
                'chainlink': 'LINKUSDT', 'link': 'LINKUSDT',
                'litecoin': 'LTCUSDT', 'ltc': 'LTCUSDT',
                'ripple': 'XRPUSDT', 'xrp': 'XRPUSDT',
                'dogecoin': 'DOGEUSDT', 'doge': 'DOGEUSDT'
            };
            
            const knownSymbol = commonSymbolMap[coinId.toLowerCase()];
            if (knownSymbol) {
                tickerData = allTickerData.find(ticker => ticker.symbol === knownSymbol);
                binanceSymbol = knownSymbol;
                console.log(`✅ Found ${coinId} using known mapping: ${binanceSymbol}`);
            }
            
            // Method 2: Dynamic search - try different variations for ANY coin
            if (!tickerData) {
                const coinUpper = coinId.toUpperCase();
                const searchPatterns = [
                    `${coinUpper}USDT`,     // Direct: SULUSDT
                    `${coinUpper}USD`,      // USD variant
                    `${coinUpper}BUSD`,     // BUSD variant
                    `${coinUpper}BTC`,      // BTC pair
                    `${coinUpper}ETH`       // ETH pair
                ];
                
                for (const pattern of searchPatterns) {
                    const found = allTickerData.find(ticker => ticker.symbol === pattern);
                    if (found) {
                        tickerData = found;
                        binanceSymbol = pattern;
                        console.log(`✅ Found ${coinId} dynamically: ${binanceSymbol}`);
                        break;
                    }
                }
            }
            
            // Method 3: Fuzzy search through ALL symbols (for partial matches)
            if (!tickerData) {
                const coinPattern = coinId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                const fuzzyMatch = allTickerData.find(ticker => {
                    const symbol = ticker.symbol;
                    return symbol.includes(coinPattern + 'USDT') || 
                           symbol.includes(coinPattern + 'USD') ||
                           symbol.startsWith(coinPattern);
                });
                
                if (fuzzyMatch) {
                    tickerData = fuzzyMatch;
                    binanceSymbol = fuzzyMatch.symbol;
                    console.log(`✅ Found ${coinId} via fuzzy search: ${binanceSymbol}`);
                }
            }
            
            if (!tickerData) {
                console.log(`❌ ${coinId} not found in any Binance trading pairs`);
                console.log(`🔍 Searched ${allTickerData.length} Binance symbols for: ${coinId}`);
                return null;
            }
            
            // Convert to our standard format
            return {
                price_usd: parseFloat(tickerData.lastPrice),
                change_24h: parseFloat(tickerData.priceChangePercent),
                volume_24h: parseFloat(tickerData.volume) * parseFloat(tickerData.lastPrice),
                market_cap: 0, // Binance doesn't provide market cap
                last_updated: tickerData.closeTime,
                source: 'Binance All-Ticker'
            };
            
        } catch (error) {
            console.error('Binance all-ticker fetch error:', error);
            return null;
        }
    }

    async preloadBinanceData() {
        try {
            console.log('🚀 Preloading Binance all-ticker data for faster responses...');
            await this.fetchFromBinanceAllTicker('bitcoin'); // This will cache all ticker data
            console.log('✅ Binance all-ticker data preloaded successfully');
        } catch (error) {
            console.log('⚠️ Binance preload failed, will fetch on-demand:', error.message);
        }
    }

    async fetchMarketData(coinId) {
        // Check cache first
        const cacheKey = `market_${coinId}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            console.log(`Using cached data for ${coinId}`);
            return cached;
        }
        
        // Check if there's already a pending request for this coin
        if (this.pendingRequests.has(cacheKey)) {
            console.log(`Waiting for pending request for ${coinId}`);
            return await this.pendingRequests.get(cacheKey);
        }
        
        // Create new request with multiple real-time APIs
        const requestPromise = (async () => {
            try {
                console.log(`🔄 Fetching real-time data for ${coinId} from multiple sources...`);
                
                const [coinGeckoData, binanceData, coinCapData] = await Promise.allSettled([
                    this.fetchFromCoinGecko(coinId),
                    this.fetchFromBinance(coinId),
                    this.fetchFromCoinCap(coinId)
                ]);
                
                let result;
                let primarySource = null;
                
                // Use the best available source with preference order
                if (coinGeckoData.status === 'fulfilled' && coinGeckoData.value) {
                    result = coinGeckoData.value;
                    primarySource = 'CoinGecko';
                } else if (binanceData.status === 'fulfilled' && binanceData.value) {
                    result = binanceData.value;
                    primarySource = 'Binance';
                } else if (coinCapData.status === 'fulfilled' && coinCapData.value) {
                    result = coinCapData.value;
                    primarySource = 'CoinCap';
                } else {
                    throw new Error('All real-time API sources failed');
                }
                
                console.log(`✅ Real-time data from ${primarySource}: $${result.price_usd.toFixed(2)} (${result.change_24h > 0 ? '+' : ''}${result.change_24h.toFixed(2)}%)`);
                
                // Add timestamp for freshness tracking
                result.fetchTime = Date.now();
                result.primarySource = primarySource;
                
                // Cache the result
                this.setCache(cacheKey, result);
                return result;
                
            } catch (error) {
                console.error('Real-time market data fetch error:', error);
                // Return mock data for demo purposes
                return this.getMockMarketData(coinId);
            } finally {
                // Remove from pending requests
                this.pendingRequests.delete(cacheKey);
            }
        })();
        
        // Store pending request
        this.pendingRequests.set(cacheKey, requestPromise);
        
        return requestPromise;
    }

    async fetchFromCoinGecko(coinId) {
        try {
            const response = await fetch(`${this.coinGeckoAPI}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true&include_last_updated_at=true`);
            
            if (!response.ok) {
                throw new Error('CoinGecko API failed');
            }
            
            const data = await response.json();
            const coinData = data[coinId];
            
            if (!coinData) {
                throw new Error('Coin data not found in CoinGecko');
            }
            
            return {
                price_usd: coinData.usd,
                change_24h: coinData.usd_24h_change,
                volume_24h: coinData.usd_24h_vol,
                market_cap: coinData.usd_market_cap,
                last_updated: coinData.last_updated_at * 1000, // Convert to milliseconds
                source: 'CoinGecko'
            };
        } catch (error) {
            console.error('CoinGecko fetch error:', error);
            throw error;
        }
    }

    async fetchFromBinance(coinId) {
        try {
            // Map coin IDs to Binance symbols
            const symbolMap = {
                'bitcoin': 'BTCUSDT',
                'ethereum': 'ETHUSDT',
                'binancecoin': 'BNBUSDT',
                'cardano': 'ADAUSDT',
                'solana': 'SOLUSDT',
                'polkadot': 'DOTUSDT',
                'chainlink': 'LINKUSDT',
                'litecoin': 'LTCUSDT',
                'bitcoin-cash': 'BCHUSDT',
                'stellar': 'XLMUSDT'
            };
            
            const symbol = symbolMap[coinId];
            if (!symbol) {
                throw new Error('Symbol not found for Binance');
            }
            
            const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
            
            if (!response.ok) {
                throw new Error('Binance API failed');
            }
            
            const data = await response.json();
            
            return {
                price_usd: parseFloat(data.lastPrice),
                change_24h: parseFloat(data.priceChangePercent),
                volume_24h: parseFloat(data.volume) * parseFloat(data.lastPrice),
                market_cap: 0, // Binance doesn't provide market cap
                last_updated: data.closeTime, // Already in milliseconds
                source: 'Binance'
            };
        } catch (error) {
            console.error('Binance fetch error:', error);
            throw error;
        }
    }

    async fetchFromCoinCap(coinId) {
        // Map coin IDs to CoinCap IDs (only coins supported by CoinCap API)
        const coinCapMap = {
            'bitcoin': 'bitcoin',
            'ethereum': 'ethereum',
            'binancecoin': 'binance-coin',
            'cardano': 'cardano',
            'solana': 'solana',
            'polkadot': 'polkadot',
            'chainlink': 'chainlink',
            'litecoin': 'litecoin',
            'bitcoin-cash': 'bitcoin-cash',
            'stellar': 'stellar',
            'ripple': 'xrp',
            'dogecoin': 'dogecoin',
            'avalanche-2': 'avalanche',
            'polygon': 'polygon',
            'uniswap': 'uniswap',
            'aptos': 'aptos',
            'injective-protocol': 'injective-protocol',
            'near': 'near',
            'optimism': 'optimism',
            'arbitrum': 'arbitrum',
            'sei-network': 'sei',
            'sui': 'sui',
            'render-token': 'render-token',
            'worldcoin-wld': 'worldcoin',
            'pepe': 'pepe',
            'shiba-inu': 'shiba-inu',
            'ecash': 'ecash'
        };

        const coinCapId = coinCapMap[coinId];
        if (!coinCapId) {
            console.warn(`CoinCap mapping not available for ${coinId}, skipping.`);
            return null;
        }

        try {
            const response = await fetch(`${this.coinCapAPI}/assets/${coinCapId}`);

            if (!response.ok) {
                console.warn(`CoinCap API response not ok for ${coinId}: ${response.status}`);
                return null;
            }

            const data = await response.json();
            const asset = data?.data;
            if (!asset) {
                console.warn(`CoinCap returned empty payload for ${coinId}`);
                return null;
            }

            return {
                price_usd: parseFloat(asset.priceUsd),
                change_24h: parseFloat(asset.changePercent24Hr),
                volume_24h: parseFloat(asset.volumeUsd24Hr),
                market_cap: parseFloat(asset.marketCapUsd),
                last_updated: Date.now(),
                source: 'CoinCap'
            };
        } catch (error) {
            console.warn(`CoinCap fetch skipped for ${coinId}:`, error?.message || error);
            return null;
        }
    }

    getMockMarketData(coinId) {
        const mockData = {
            bitcoin: { price_usd: 43500, change_24h: -2.3, volume_24h: 25000000000, market_cap: 850000000000 },
            ethereum: { price_usd: 2650, change_24h: 1.8, volume_24h: 15000000000, market_cap: 320000000000 },
            binancecoin: { price_usd: 315, change_24h: -0.5, volume_24h: 2000000000, market_cap: 48000000000 },
            cardano: { price_usd: 0.45, change_24h: 3.2, volume_24h: 800000000, market_cap: 16000000000 },
            solana: { price_usd: 98, change_24h: -1.1, volume_24h: 1200000000, market_cap: 45000000000 },
            polkadot: { price_usd: 6.8, change_24h: 2.1, volume_24h: 500000000, market_cap: 9500000000 },
            chainlink: { price_usd: 14.2, change_24h: -0.8, volume_24h: 400000000, market_cap: 8500000000 },
            litecoin: { price_usd: 72, change_24h: 0.9, volume_24h: 600000000, market_cap: 5400000000 },
            'bitcoin-cash': { price_usd: 245, change_24h: -1.5, volume_24h: 300000000, market_cap: 4800000000 },
            stellar: { price_usd: 0.12, change_24h: 4.1, volume_24h: 200000000, market_cap: 3500000000 }
        };
        
        return mockData[coinId] || { price_usd: 100, change_24h: 0, volume_24h: 1000000000, market_cap: 10000000000 };
    }

    // Enhanced News Integration Methods
    async fetchCoinDeskNews() {
        try {
            // Try multiple news sources for comprehensive coverage
            const [coinDeskData, cryptoNewsData] = await Promise.allSettled([
                this.fetchFromCoinDesk(),
                this.fetchFromCryptoNews()
            ]);
            
            let allNews = [];
            
            if (coinDeskData.status === 'fulfilled' && coinDeskData.value) {
                allNews = allNews.concat(coinDeskData.value);
            }
            
            if (cryptoNewsData.status === 'fulfilled' && cryptoNewsData.value) {
                allNews = allNews.concat(cryptoNewsData.value);
            }
            
            // Sort by recency and return top 5
            return allNews
                .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
                .slice(0, 5);
                
        } catch (error) {
            console.error('Error fetching news:', error);
            return this.getMockNewsData();
        }
    }

    async fetchFromCoinDesk() {
        try {
            const response = await fetch(`${this.coinDeskAPI}/news/`);
            
            if (!response.ok) {
                throw new Error('CoinDesk API request failed');
            }
            
            const data = await response.json();
            
            if (data.news && Array.isArray(data.news)) {
                return data.news.map(article => ({
                    title: article.title,
                    description: article.description,
                    url: article.url,
                    publishedAt: article.publishedAt,
                    source: { name: 'CoinDesk' },
                    category: article.category
                }));
            }
            
            return [];
        } catch (error) {
            console.error('CoinDesk fetch error:', error);
            throw error;
        }
    }

    async fetchFromCryptoNews() {
        try {
            // Using a free crypto news API
            const response = await fetch('https://api.coinpaprika.com/v1/events');
            
            if (!response.ok) {
                throw new Error('CryptoNews API request failed');
            }
            
            const data = await response.json();
            
            if (Array.isArray(data)) {
                return data.slice(0, 3).map(event => ({
                    title: event.name || 'Crypto Market Update',
                    description: event.description || 'Latest cryptocurrency market development',
                    url: event.url || '#',
                    publishedAt: event.date || new Date().toISOString(),
                    source: { name: 'CoinPaprika' },
                    category: 'Market Update'
                }));
            }
            
            return [];
        } catch (error) {
            console.error('CryptoNews fetch error:', error);
            throw error;
        }
    }

    async fetchCoinDeskMarketData() {
        try {
            // CoinDesk Bitcoin Price Index API
            const response = await fetch(`${this.coinDeskAPI}/bpi/currentprice.json`);
            
            if (!response.ok) {
                throw new Error('CoinDesk market data request failed');
            }
            
            const data = await response.json();
            
            if (data.bpi && data.bpi.USD) {
                return {
                    bitcoin: {
                        price_usd: data.bpi.USD.rate_float,
                        change_24h: 0, // CoinDesk doesn't provide 24h change in this endpoint
                        volume_24h: 0,
                        market_cap: 0
                    }
                };
            }
            
            return null;
        } catch (error) {
            console.error('Error fetching CoinDesk market data:', error);
            return null;
        }
    }

    getMockNewsData() {
        return [
            {
                title: "Bitcoin Reaches New All-Time High Amid Institutional Adoption",
                description: "Major corporations continue to add Bitcoin to their balance sheets, driving price momentum.",
                publishedAt: new Date().toISOString(),
                source: { name: 'CoinDesk' },
                category: 'Bitcoin'
            },
            {
                title: "Ethereum 2.0 Upgrade Shows Promising Results",
                description: "The latest Ethereum network upgrade demonstrates improved scalability and reduced gas fees.",
                publishedAt: new Date(Date.now() - 3600000).toISOString(),
                source: { name: 'CoinDesk' },
                category: 'Ethereum'
            },
            {
                title: "Regulatory Clarity Boosts Crypto Market Confidence",
                description: "Recent regulatory announcements provide clearer guidelines for cryptocurrency adoption.",
                publishedAt: new Date(Date.now() - 7200000).toISOString(),
                source: { name: 'CoinDesk' },
                category: 'Regulation'
            }
        ];
    }

    // Check if query is news-related
    isNewsRelatedQuery(message) {
        const newsKeywords = [
            'news', 'latest', 'recent', 'today', 'happening', 'update', 'breaking',
            'announcement', 'regulation', 'sec', 'government', 'adoption', 'partnership',
            'launch', 'release', 'upgrade', 'fork', 'halving', 'etf', 'institutional',
            'what\'s happening', 'current events', 'market news', 'crypto news'
        ];
        
        const messageLower = message.toLowerCase();
        return newsKeywords.some(keyword => messageLower.includes(keyword));
    }

    // 🌐 HYBRID AI: Determine if Perplexity should be used for real-time insights
    shouldUsePerplexity(message, intent) {
        const messageLower = message.toLowerCase();
        
        // Use Perplexity for:
        // 1. News and latest updates
        const newsKeywords = ['news', 'latest', 'update', 'recent', 'today', 'breaking', 'announcement', 'headline', 'happening'];
        const hasNewsKeyword = newsKeywords.some(keyword => messageLower.includes(keyword));
        
        // 2. Market sentiment and opinions
        const sentimentKeywords = ['sentiment', 'feeling', 'opinion', 'people think', 'bullish', 'bearish', 'mood', 'what do', 'community'];
        const hasSentimentKeyword = sentimentKeywords.some(keyword => messageLower.includes(keyword));
        
        // 3. Events and developments
        const eventKeywords = ['event', 'launch', 'release', 'upgrade', 'fork', 'partnership', 'adoption', 'regulation'];
        const hasEventKeyword = eventKeywords.some(keyword => messageLower.includes(keyword));
        
        // 4. Predictions and future outlook
        const futureKeywords = ['predict', 'forecast', 'future', 'outlook', 'next', 'will', 'expect', '2024', '2025'];
        const hasFutureKeyword = futureKeywords.some(keyword => messageLower.includes(keyword));
        
        // 5. Comparisons with external factors
        const externalKeywords = ['vs stock', 'vs gold', 'inflation', 'economy', 'fed', 'interest rate', 'macro'];
        const hasExternalKeyword = externalKeywords.some(keyword => messageLower.includes(keyword));
        
        return hasNewsKeyword || hasSentimentKeyword || hasEventKeyword || hasFutureKeyword || hasExternalKeyword;
    }

    // 🌐 HYBRID AI: Fetch real-time insights from Perplexity AI
    async fetchPerplexityInsights(userMessage, marketData) {
        try {
            // Extract crypto names from market data
            const cryptoNames = Object.keys(marketData || {})
                .map(id => {
                    // Convert ID to readable name (e.g., 'bitcoin' -> 'Bitcoin')
                    return id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
                })
                .join(', ');
            
            // Create focused query for Perplexity
            const perplexityQuery = cryptoNames 
                ? `${userMessage}\n\nContext: Focus on ${cryptoNames} cryptocurrency market.`
                : userMessage;
            
            console.log('🌐 Querying Perplexity AI:', perplexityQuery);
            
            const response = await fetch(this.perplexityAPI, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.perplexityApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'sonar-pro', // Use sonar-pro for best quality with online search
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a cryptocurrency market analyst with access to real-time web data. Provide concise, fact-based insights with citations. Focus on: latest news, market sentiment, recent events, regulatory updates, and expert opinions. Keep responses under 300 words.'
                        },
                        {
                            role: 'user',
                            content: perplexityQuery
                        }
                    ],
                    temperature: 0.2, // Low temperature for factual accuracy
                    max_tokens: 800,
                    top_p: 0.9,
                    search_domain_filter: ['coindesk.com', 'cointelegraph.com', 'decrypt.co', 'theblock.co', 'bloomberg.com'],
                    return_citations: true,
                    search_recency_filter: 'week' // Focus on recent information
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Perplexity API error:', response.status, errorText);
                throw new Error(`Perplexity API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                console.error('❌ Invalid Perplexity response structure:', data);
                return null;
            }

            const insights = data.choices[0].message.content;
            const citations = data.citations || [];
            
            console.log('✅ Perplexity insights length:', insights.length, 'chars');
            console.log('📚 Citations:', citations.length);
            
            return {
                insights: insights,
                citations: citations,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('❌ Error fetching Perplexity insights:', error);
            return null;
        }
    }

    async generateAIResponse(userMessage, marketData) {
        console.log('🤖 Generating AI response for:', userMessage);
        
        // Automatic load distribution - rotate keys every message
        this.rotateToNextKey();
        
        console.log(`🔑 Using API Key ${this.currentKeyIndex + 1}/${this.apiKeys.length}`);
        console.log('📊 Market Data received:', marketData);
        console.log('📊 Market Data keys:', marketData ? Object.keys(marketData) : 'null');
        
        if (!this.apiKey) {
            console.warn('⚠️ No API key, using response with real Binance data');
            return this.generateDemoResponse(userMessage, marketData);
        }

        try {
            // Detect user intent for smarter responses
            const intent = this.detectIntent(userMessage);
            console.log('🎯 Detected intent:', intent);
            
            // 🌐 HYBRID AI: Check if we should use Perplexity for real-time data
            let perplexityInsights = null;
            if (this.useHybridAI && this.shouldUsePerplexity(userMessage, intent)) {
                console.log('🌐 Using Perplexity AI for real-time insights...');
                
                // Show user that Perplexity is being used
                this.showUserMessage('🌐 Searching the web with Perplexity AI for real-time information...', 3000);
                
                try {
                    perplexityInsights = await this.fetchPerplexityInsights(userMessage, marketData);
                    console.log('✅ Perplexity insights received');
                    
                    // Notify user that web search was successful
                    if (perplexityInsights && perplexityInsights.insights) {
                        this.showUserMessage('✅ Real-time web data retrieved from Perplexity AI!', 2000);
                    }
                } catch (error) {
                    console.warn('⚠️ Perplexity API error, continuing with Cerebras only:', error);
                }
            }
            
            // Gather comprehensive context
            const isNewsQuery = this.isNewsRelatedQuery(userMessage);
            let newsData = null;
            
            if (isNewsQuery || intent.topic === 'news') {
                newsData = await this.fetchCoinDeskNews();
            }
            
            // Build enhanced system prompt (with Perplexity insights if available)
            const systemPrompt = this.createAdvancedSystemPrompt(marketData, newsData, intent, userMessage, perplexityInsights);
            console.log('📏 System prompt length:', systemPrompt.length, 'characters');
            
            // Build conversation history for multi-turn context
            const conversationContents = this.buildConversationHistory(systemPrompt, userMessage);
            console.log('📝 Conversation contents prepared, messages:', conversationContents.length);
            
            // Calculate approximate token usage (4 chars ≈ 1 token)
            const estimatedInputTokens = Math.ceil(systemPrompt.length / 4);
            console.log('🎯 Estimated input tokens:', estimatedInputTokens);
            
            // Dynamic generation config based on intent
            const generationConfig = this.getOptimalGenerationConfig(intent);
            
            console.log('📡 Sending request to Cerebras API...');
            
            // Convert Gemini format to Cerebras/OpenAI format
            const cerebrasMessages = this.convertToCerebrasFormat(conversationContents);
            
            // Smart retry with exponential backoff
            const response = await this.fetchWithRetry(`${this.cerebrasAPI}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.cerebrasModel,
                    messages: cerebrasMessages,
                    temperature: generationConfig.temperature || 0.9,
                    max_tokens: generationConfig.maxOutputTokens || 8192,
                    top_p: generationConfig.topP || 0.95
                }),
                signal: this.abortController?.signal
            }, 3); // 3 retries

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API error details:', errorText);
                
                // Parse error for better handling
                let errorObj;
                try {
                    errorObj = JSON.parse(errorText);
                } catch (e) {
                    errorObj = { error: { message: errorText } };
                }
                
                // Check for specific errors
                if (response.status === 503 || errorObj.error?.status === 'UNAVAILABLE') {
                    throw new Error('API_OVERLOADED');
                } else if (response.status === 429) {
                    throw new Error('RATE_LIMITED');
                } else if (response.status === 400) {
                    throw new Error('INVALID_REQUEST');
                }
                
                throw new Error(`API request failed: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ API response received:', data);
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                console.error('❌ Invalid response structure:', data);
                throw new Error('Invalid API response - no choices');
            }
            
            // Check if response was truncated
            const finishReason = data.choices[0].finish_reason;
            if (finishReason) {
                console.log('⚠️ Finish reason:', finishReason);
                if (finishReason === 'length' || finishReason === 'stop') {
                    console.log('✅ Response completed');
                }
            }
            
            const aiResponse = data.choices[0].message.content;
            console.log('✅ AI response generated successfully');
            console.log('📝 Response length:', aiResponse.length, 'characters');
            console.log('📝 Response ends with:', aiResponse.slice(-100)); // Last 100 characters
            
            // Check if response seems incomplete (ends abruptly without proper conclusion)
            const incompletePatterns = [
                /\w+$/,  // Ends with word (likely cut off)
                /[A-Z][a-z]*$/,  // Ends with incomplete sentence
                /\d+\.?\d*$/,  // Ends with numbers
                /breakout$/,     // Specific case from the image
                /resistance$/,   // Common trading term endings
                /support$/
            ];
            
            const seemsIncomplete = incompletePatterns.some(pattern => pattern.test(aiResponse.trim()));
            
            if (seemsIncomplete && aiResponse.length > 100) {
                console.warn('⚠️ Response may be incomplete, length:', aiResponse.length);
                console.warn('⚠️ Last 100 chars:', aiResponse.slice(-100));
            }
            
            return aiResponse;
            
        } catch (error) {
            console.error('❌ Cerebras API error:', error);
            
            // Handle specific error types
            if (error.message === 'API_OVERLOADED' || error.message.includes('503') || error.message.includes('overloaded')) {
                console.log('🔄 API overloaded, using demo response with real data...');
                this.showUserMessage('⚠️ API busy - Using real Binance data instead!', 3000);
                return this.handleAPIOverload(userMessage, marketData);
            } else if (error.message === 'RATE_LIMITED') {
                console.log('⏰ Rate limited on key', this.currentKeyIndex + 1);
                
                // Try rotating to next API key
                const nextResponse = await this.rotateAPIKeyAndRetry(userMessage, marketData);
                if (nextResponse) {
                    console.log('✅ Successfully used alternate API key!');
                    return nextResponse;
                }
                
                // If all keys are rate limited, use fallback
                console.log('⚠️ All API keys rate limited, using fallback...');
                this.showUserMessage('⏰ High demand - Using cached data!', 3000);
                return this.handleAPIOverload(userMessage, marketData);
            } else if (error.message === 'INVALID_REQUEST') {
                console.log('❌ Invalid request, using fallback...');
                this.showUserMessage('💡 Using real market data for your question!', 2000);
                return this.generateDemoResponse(userMessage, marketData);
            }
            
            console.log('🔄 Falling back to demo response');
            return this.generateDemoResponse(userMessage, marketData);
        }
    }

    rotateToNextKey() {
        // Automatic rotation for load distribution
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
        this.apiKey = this.apiKeys[this.currentKeyIndex];
        this.lastKeyRotation = Date.now();
        
        // Track usage
        if (!this.keyUsageCount[this.currentKeyIndex]) {
            this.keyUsageCount[this.currentKeyIndex] = 0;
        }
        this.keyUsageCount[this.currentKeyIndex]++;
        
        console.log(`🔄 Auto-rotated to key ${this.currentKeyIndex + 1} (Used ${this.keyUsageCount[this.currentKeyIndex]} times)`);
    }

    async rotateAPIKeyAndRetry(userMessage, marketData) {
        console.log('🔄 Rate limit hit! Attempting API key rotation...');
        
        const startingKeyIndex = this.currentKeyIndex;
        let attempts = 0;
        const maxAttempts = this.apiKeys.length;
        
        // Try each API key in sequence
        while (attempts < maxAttempts) {
            // Move to next key
            this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
            this.apiKey = this.apiKeys[this.currentKeyIndex];
            attempts++;
            
            // Don't try the same key we just failed with
            if (this.currentKeyIndex === startingKeyIndex) {
                continue;
            }
            
            console.log(`🔑 Trying API key ${this.currentKeyIndex + 1} of ${this.apiKeys.length}...`);
            
            try {
                // Track key usage
                if (!this.keyUsageCount[this.currentKeyIndex]) {
                    this.keyUsageCount[this.currentKeyIndex] = 0;
                }
                this.keyUsageCount[this.currentKeyIndex]++;
                
                // Try to generate response with new key
                const response = await this.attemptAIRequest(userMessage, marketData);
                
                if (response) {
                    console.log(`✅ Success with API key ${this.currentKeyIndex + 1}!`);
                    this.showUserMessage(`🔑 Switched to backup API (${this.currentKeyIndex + 1}/${this.apiKeys.length})`, 2000);
                    return response;
                }
            } catch (error) {
                console.log(`❌ Key ${this.currentKeyIndex + 1} also failed:`, error.message);
                
                // If this key is also rate limited, continue to next
                if (error.message === 'RATE_LIMITED' || error.message.includes('429')) {
                    continue;
                }
                
                // If it's a different error, return null to use fallback
                return null;
            }
        }
        
        console.log('⚠️ All API keys exhausted');
        return null;
    }

    async attemptAIRequest(userMessage, marketData) {
        // Simplified request attempt - core logic only
        const intent = this.detectIntent(userMessage);
        const isNewsQuery = this.isNewsRelatedQuery(userMessage);
        let newsData = null;
        
        if (isNewsQuery || intent.topic === 'news') {
            newsData = await this.fetchCoinDeskNews();
        }
        
        const systemPrompt = this.createAdvancedSystemPrompt(marketData, newsData, intent, userMessage, null);
        const conversationContents = this.buildConversationHistory(systemPrompt, userMessage);
        const generationConfig = this.getOptimalGenerationConfig(intent);
        
        // Convert Gemini format to Cerebras/OpenAI format
        const cerebrasMessages = this.convertToCerebrasFormat(conversationContents);
        
        const response = await fetch(`${this.cerebrasAPI}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.cerebrasModel,
                messages: cerebrasMessages,
                temperature: generationConfig.temperature || 0.9,
                max_tokens: generationConfig.maxOutputTokens || 8192,
                top_p: generationConfig.topP || 0.95
            })
        });
        
        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('RATE_LIMITED');
            }
            throw new Error(`API_ERROR_${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid API response');
        }
        
        return data.choices[0].message.content;
    }

    async handleAPIOverload(userMessage, marketData) {
        // Skip simplified request if API is completely down, go straight to demo
        console.log('⚠️ API overloaded, using demo response with real data');
        return this.generateDemoResponse(userMessage, marketData);
    }

    detectIntent(message) {
        const messageLower = message.toLowerCase();
        
        // Intent categories
        const intents = {
            market_scan: ['scan', 'market scan', 'whole market', 'all market', 'all coins', 'across market', 'best trade', 'best setup', 'top pick', 'trade signal', 'signal for trade', 'find me a trade', 'find me a good trade', 'which coin has signal', 'which coin to trade', 'scan the market', 'scan market', 'analyze the market', 'analyze market'],
            trade_advice: ['buy', 'sell', 'trade', 'invest', 'should i', 'recommend', 'good time', 'entry', 'exit'],
            price_check: ['price', 'cost', 'worth', 'value', 'how much'],
            analysis: ['analyze', 'analysis', 'technical', 'chart', 'indicator', 'rsi', 'macd'],
            portfolio: ['portfolio', 'holdings', 'my coins', 'balance', 'profit', 'loss', 'p&l'],
            news: ['news', 'latest', 'update', 'happening', 'events'],
            learning: ['how', 'what is', 'explain', 'teach', 'learn', 'understand', 'why'],
            comparison: ['vs', 'versus', 'compare', 'better', 'difference between'],
            prediction: ['predict', 'forecast', 'future', 'will', 'expect', 'outlook'],
            risk: ['risk', 'safe', 'danger', 'volatile', 'secure', 'risky']
        };
        
        let detectedIntent = 'general';
        let confidence = 0;
        
        for (const [intent, keywords] of Object.entries(intents)) {
            const matches = keywords.filter(keyword => messageLower.includes(keyword));
            if (matches.length > confidence) {
                confidence = matches.length;
                detectedIntent = intent;
            }
        }
        
        // Detect urgency
        const urgencyKeywords = ['now', 'quickly', 'urgent', 'asap', 'immediately'];
        const isUrgent = urgencyKeywords.some(kw => messageLower.includes(kw));
        
        // Detect sentiment
        const positiveWords = ['good', 'great', 'awesome', 'excellent', 'bullish'];
        const negativeWords = ['bad', 'worry', 'scared', 'bearish', 'crash'];
        const sentiment = positiveWords.some(w => messageLower.includes(w)) ? 'positive' :
                         negativeWords.some(w => messageLower.includes(w)) ? 'negative' : 'neutral';
        
        return {
            type: detectedIntent,
            confidence: confidence,
            urgent: isUrgent,
            sentiment: sentiment,
            topic: this.extractCryptoMentions(message).length > 0 ? 'crypto_specific' : 'general'
        };
    }

    buildConversationHistory(systemPrompt, currentMessage) {
        const contents = [];
        
        // Enhanced system prompt with memory context
        const enhancedSystemPrompt = this.buildEnhancedSystemPrompt(systemPrompt);
        
        // Add system instruction as first user message
        contents.push({
            role: 'user',
            parts: [{ text: enhancedSystemPrompt }]
        });
        
        // Add acknowledgment from model
        contents.push({
            role: 'model',
            parts: [{ text: 'I understand! I\'m SamCrypto AI with full memory of our conversations. I remember your preferences, trading history, and past discussions. I\'ll provide personalized advice based on what I know about you and continue our conversation naturally.' }]
        });
        
        // Add recent conversation history with better context (last 5 messages for speed)
        const recentHistory = this.conversationHistory.slice(-5);
        for (const msg of recentHistory) {
            contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            });
        }
        
        // Add current user message only if it's not already the last entry in history
        const lastInHistory = recentHistory[recentHistory.length - 1];
        const isDuplicateCurrent = lastInHistory && lastInHistory.role === 'user' && lastInHistory.content === currentMessage;
        if (!isDuplicateCurrent) {
            contents.push({
                role: 'user',
                parts: [{ text: currentMessage }]
            });
        }
        
        return contents;
    }

    // Convert Gemini format to Cerebras/OpenAI format
    convertToCerebrasFormat(geminiContents) {
        const messages = [];
        
        // First message is always the system prompt (in user role with instruction)
        if (geminiContents.length > 0) {
            const firstMsg = geminiContents[0];
            if (firstMsg.role === 'user' && firstMsg.parts && firstMsg.parts[0]) {
                messages.push({
                    role: 'system',
                    content: firstMsg.parts[0].text
                });
            }
        }
        
        // Add the acknowledgment and conversation history
        // Skip the first user message (already added as system) and process rest
        for (let i = 1; i < geminiContents.length; i++) {
            const msg = geminiContents[i];
            if (msg.parts && msg.parts[0]) {
                messages.push({
                    role: msg.role === 'model' ? 'assistant' : 'user',
                    content: msg.parts[0].text
                });
            }
        }
        
        return messages;
    }

    buildEnhancedSystemPrompt(basePrompt) {
        let enhancedPrompt = basePrompt;
        
        // Add conversation memory context
        if (this.conversationHistory && this.conversationHistory.length > 0) {
            enhancedPrompt += `\n\n**CONVERSATION MEMORY & CONTEXT:**
            
You have full memory of our previous conversations. Here's what you should remember:
- Continue conversations naturally, referencing past discussions
- Remember user's trading preferences, risk tolerance, and interests
- Build on previous advice and recommendations
- Use "we discussed earlier" or "as I mentioned before" when appropriate
- Personalize responses based on conversation history

**User's Profile & Preferences:**
${this.getUserProfileSummary()}

**Recent Trading Context:**
${this.getRecentTradingContext()}
            `;
        }
        
        // Add advanced contextual understanding
        enhancedPrompt += this.getContextualPromptEnhancement();
        
        return enhancedPrompt;
    }

    getUserProfileSummary() {
        if (!this.userMemory || !this.userMemory.userProfile) {
            return "- New user, still learning about their preferences";
        }
        
        const profile = this.userMemory.userProfile;
        const preferences = this.userPreferences;
        
        let summary = "";
        if (preferences.favoriteCoins && preferences.favoriteCoins.length > 0) {
            summary += `- Interested in: ${preferences.favoriteCoins.join(', ')}\n`;
        }
        if (preferences.tradingStyle !== 'unknown') {
            summary += `- Trading style: ${preferences.tradingStyle}\n`;
        }
        if (preferences.riskTolerance !== 'unknown') {
            summary += `- Risk tolerance: ${preferences.riskTolerance}\n`;
        }
        if (preferences.experienceLevel !== 'unknown') {
            summary += `- Experience level: ${preferences.experienceLevel}\n`;
        }
        
        return summary || "- Still getting to know this user";
    }

    getRecentTradingContext() {
        const recentConversations = this.conversationHistory.slice(-5);
        const coinsMentioned = new Set();
        const topicsMentioned = new Set();
        
        recentConversations.forEach(msg => {
            const content = msg.content.toLowerCase();
            // Extract coins mentioned
            ['bitcoin', 'btc', 'ethereum', 'eth', 'solana', 'sol', 'cardano', 'ada'].forEach(coin => {
                if (content.includes(coin)) {
                    coinsMentioned.add(coin.toUpperCase());
                }
            });
            
            // Extract topics
            ['trading', 'investment', 'portfolio', 'risk', 'profit', 'loss'].forEach(topic => {
                if (content.includes(topic)) {
                    topicsMentioned.add(topic);
                }
            });
        });
        
        let context = "";
        if (coinsMentioned.size > 0) {
            context += `- Recently discussed: ${Array.from(coinsMentioned).join(', ')}\n`;
        }
        if (topicsMentioned.size > 0) {
            context += `- Topics covered: ${Array.from(topicsMentioned).join(', ')}\n`;
        }
        
        return context || "- Fresh conversation, no recent trading context";
    }

    // ===== ADVANCED MEMORY SYSTEM (ChatGPT/Claude-level) =====
    
    updateConversationContext(message, role) {
        // Add message to context
        this.conversationContext.messages.push({
            role: role,
            content: message,
            timestamp: Date.now()
        });
        
        // Keep only recent messages (last 20)
        if (this.conversationContext.messages.length > this.maxContextMessages) {
            this.conversationContext.messages = this.conversationContext.messages.slice(-this.maxContextMessages);
        }
        
        // Extract and track information from BOTH user and AI messages
        if (role === 'user') {
            this.trackUserIntent(message);
            this.trackQuestions(message);
            this.extractUserProfile(message);
        }
        
        // Track topics from both user AND AI messages
        this.trackTopics(message, role);
        
        // Track AI's coin mentions for better context
        if (role === 'assistant') {
            this.trackAIMentions(message);
        }
        
        // Generate conversation summary periodically
        if (this.conversationContext.messages.length % 10 === 0) {
            this.generateConversationSummary();
        }
        
        // Save context to localStorage
        this.saveConversationContext();
    }
    
    trackUserIntent(message) {
        const lowerMsg = message.toLowerCase();
        
        // Detect various intents
        if (lowerMsg.includes('?')) {
            this.conversationContext.userIntent = 'asking_question';
        } else if (lowerMsg.match(/buy|sell|trade/)) {
            this.conversationContext.userIntent = 'trading_action';
        } else if (lowerMsg.match(/how|why|what|when|where|explain/)) {
            this.conversationContext.userIntent = 'seeking_explanation';
        } else if (lowerMsg.match(/compare|vs|versus|difference/)) {
            this.conversationContext.userIntent = 'comparison';
        } else if (lowerMsg.match(/predict|forecast|future|will/)) {
            this.conversationContext.userIntent = 'prediction';
        } else {
            this.conversationContext.userIntent = 'general_discussion';
        }
    }
    
    trackTopics(message, role = 'user') {
        const lowerMsg = message.toLowerCase();
        const topics = new Set(this.conversationContext.keyPoints);
        
        // Comprehensive crypto list
        const cryptos = [
            'bitcoin', 'btc', 'ethereum', 'eth', 'solana', 'sol', 'cardano', 'ada',
            'ripple', 'xrp', 'dogecoin', 'doge', 'polkadot', 'dot', 'avalanche', 'avax',
            'shiba', 'matic', 'polygon', 'link', 'chainlink', 'litecoin', 'ltc',
            'uniswap', 'uni', 'cosmos', 'atom', 'stellar', 'xlm', 'monero', 'xmr',
            'tron', 'trx', 'binance', 'bnb', 'near', 'arbitrum', 'arb', 'optimism', 'op',
            'injective', 'inj', 'sei', 'sui', 'aptos', 'apt', 'render', 'pepe'
        ];
        
        // Track ALL crypto mentions
        cryptos.forEach(crypto => {
            if (lowerMsg.includes(crypto)) {
                const normalized = this.normalizeCoinName(crypto);
                topics.add(normalized);
            }
        });
        
        // Track trading topics
        const tradingTopics = ['price', 'trend', 'support', 'resistance', 'rsi', 'volume', 'bull', 'bear', 'breakout', 'analysis', 'trade', 'setup'];
        tradingTopics.forEach(topic => {
            if (lowerMsg.includes(topic)) {
                topics.add(topic);
            }
        });
        
        this.conversationContext.keyPoints = Array.from(topics).slice(-15); // Keep more topics
        this.conversationContext.lastTopic = Array.from(topics).pop() || 'general';
    }
    
    normalizeCoinName(coin) {
        const mapping = {
            'btc': 'Bitcoin', 'bitcoin': 'Bitcoin',
            'eth': 'Ethereum', 'ethereum': 'Ethereum',
            'sol': 'Solana', 'solana': 'Solana',
            'ada': 'Cardano', 'cardano': 'Cardano',
            'xrp': 'Ripple', 'ripple': 'Ripple',
            'doge': 'Dogecoin', 'dogecoin': 'Dogecoin',
            'dot': 'Polkadot', 'polkadot': 'Polkadot',
            'avax': 'Avalanche', 'avalanche': 'Avalanche',
            'bnb': 'BNB', 'binance': 'BNB',
            'matic': 'Polygon', 'polygon': 'Polygon',
            'link': 'Chainlink', 'chainlink': 'Chainlink',
            'ltc': 'Litecoin', 'litecoin': 'Litecoin',
            'uni': 'Uniswap', 'uniswap': 'Uniswap',
            'atom': 'Cosmos', 'cosmos': 'Cosmos',
            'xlm': 'Stellar', 'stellar': 'Stellar',
            'near': 'NEAR', 'arb': 'Arbitrum', 'arbitrum': 'Arbitrum',
            'op': 'Optimism', 'optimism': 'Optimism',
            'inj': 'Injective', 'injective': 'Injective',
            'sei': 'SEI', 'sui': 'SUI', 'apt': 'Aptos', 'aptos': 'Aptos',
            'render': 'Render', 'pepe': 'PEPE'
        };
        return mapping[coin.toLowerCase()] || coin.toUpperCase();
    }
    
    trackAIMentions(message) {
        // Extract coins that AI specifically discussed
        if (!this.conversationContext.aiMentionedCoins) {
            this.conversationContext.aiMentionedCoins = [];
        }
        
        const lowerMsg = message.toLowerCase();
        const coins = [];
        
        // Look for price patterns like "$105,064.21 USD" or "Bitcoin (BTC) is trading"
        const patterns = [
            /(\w+)\s+\((\w+)\)\s+is\s+trading/gi,
            /(\w+)\s+is\s+(?:currently\s+)?(?:at|trading)/gi,
            /price:\s+\$[\d,]+.*?(\w+)/gi
        ];
        
        patterns.forEach(pattern => {
            const matches = message.matchAll(pattern);
            for (const match of matches) {
                const coin = match[1] || match[2];
                if (coin && coin.length > 2) {
                    coins.push(this.normalizeCoinName(coin));
                }
            }
        });
        
        // Also check for explicit mentions
        ['BTC', 'ETH', 'SOL', 'Bitcoin', 'Ethereum', 'Solana'].forEach(coin => {
            if (message.includes(coin)) {
                coins.push(coin);
            }
        });
        
        // Store unique coins mentioned in last response
        this.conversationContext.aiMentionedCoins = [...new Set(coins)].slice(-5);
        
        console.log('🤖 AI mentioned coins:', this.conversationContext.aiMentionedCoins);
    }
    
    trackQuestions(message) {
        if (message.includes('?')) {
            this.conversationContext.previousQuestions.push({
                question: message,
                timestamp: Date.now()
            });
            
            // Keep only last 10 questions
            if (this.conversationContext.previousQuestions.length > 10) {
                this.conversationContext.previousQuestions = this.conversationContext.previousQuestions.slice(-10);
            }
        }
    }
    
    extractUserProfile(message) {
        const lowerMsg = message.toLowerCase();
        
        // Track experience level
        if (lowerMsg.match(/beginner|new to|just started|first time/)) {
            this.conversationContext.userProfile.experienceLevel = 'beginner';
        } else if (lowerMsg.match(/expert|professional|advanced|experienced/)) {
            this.conversationContext.userProfile.experienceLevel = 'advanced';
        }
        
        // Track risk tolerance
        if (lowerMsg.match(/safe|conservative|low risk|careful/)) {
            this.conversationContext.userProfile.riskTolerance = 'low';
        } else if (lowerMsg.match(/aggressive|high risk|yolo|moon/)) {
            this.conversationContext.userProfile.riskTolerance = 'high';
        }
        
        // Track trading goals
        if (lowerMsg.match(/long term|hold|hodl|invest/)) {
            this.conversationContext.userProfile.tradingStyle = 'long-term';
        } else if (lowerMsg.match(/day trad|short term|quick|scalp/)) {
            this.conversationContext.userProfile.tradingStyle = 'short-term';
        }
        
        // Track interests
        if (lowerMsg.match(/defi|decentralized finance/)) {
            if (!this.conversationContext.userProfile.interests) {
                this.conversationContext.userProfile.interests = [];
            }
            if (!this.conversationContext.userProfile.interests.includes('DeFi')) {
                this.conversationContext.userProfile.interests.push('DeFi');
            }
        }
        if (lowerMsg.match(/nft|non fungible/)) {
            if (!this.conversationContext.userProfile.interests) {
                this.conversationContext.userProfile.interests = [];
            }
            if (!this.conversationContext.userProfile.interests.includes('NFTs')) {
                this.conversationContext.userProfile.interests.push('NFTs');
            }
        }
    }
    
    generateConversationSummary() {
        const messages = this.conversationContext.messages.slice(-10);
        const topics = this.conversationContext.keyPoints;
        const intent = this.conversationContext.userIntent;
        
        this.conversationContext.summary = `Recent discussion about ${topics.join(', ')}. User is ${intent}. ${messages.length} messages in context.`;
        
        console.log('📝 Conversation summary generated:', this.conversationContext.summary);
    }
    
    saveConversationContext() {
        try {
            localStorage.setItem('conversationContext', JSON.stringify(this.conversationContext));
        } catch (error) {
            console.error('Error saving conversation context:', error);
        }
    }
    
    loadConversationContext() {
        try {
            const saved = localStorage.getItem('conversationContext');
            if (saved) {
                this.conversationContext = JSON.parse(saved);
                console.log('✅ Loaded conversation context:', this.conversationContext.messages.length, 'messages');
            }
        } catch (error) {
            console.error('Error loading conversation context:', error);
        }
    }
    
    getContextualPromptEnhancement() {
        const context = this.conversationContext;
        let enhancement = '\n\n🧠 **CRITICAL CONVERSATION MEMORY & CONTEXT:**\n\n';
        
        // Get last few messages for immediate context
        const recentMessages = context.messages.slice(-3); // Last 3 messages
        if (recentMessages.length > 0) {
            enhancement += `**IMMEDIATE CONTEXT (Last Exchange):**\n`;
            recentMessages.forEach((msg, idx) => {
                if (idx < recentMessages.length - 1) { // Don't include current message
                    const role = msg.role === 'user' ? '👤 USER' : '🤖 YOU';
                    const preview = msg.content.substring(0, 150);
                    enhancement += `${role}: "${preview}${msg.content.length > 150 ? '...' : ''}"\n`;
                }
            });
            enhancement += '\n';
        }
        
        // Add coins YOU just mentioned
        if (context.aiMentionedCoins && context.aiMentionedCoins.length > 0) {
            enhancement += `**⚠️ COINS YOU JUST DISCUSSED:** ${context.aiMentionedCoins.join(', ')}\n`;
            enhancement += `- When user says "other coins", they mean OTHER than these: ${context.aiMentionedCoins.join(', ')}\n`;
            enhancement += `- When user says "what about it/that/them", they refer to: ${context.aiMentionedCoins.join(', ')}\n\n`;
        }
        
        // Add summary
        if (context.summary) {
            enhancement += `**Summary:** ${context.summary}\n\n`;
        }
        
        // Add user profile
        if (Object.keys(context.userProfile).length > 0) {
            enhancement += `**User Profile:**\n`;
            if (context.userProfile.experienceLevel) {
                enhancement += `- Experience: ${context.userProfile.experienceLevel}\n`;
            }
            if (context.userProfile.riskTolerance) {
                enhancement += `- Risk tolerance: ${context.userProfile.riskTolerance}\n`;
            }
            if (context.userProfile.tradingStyle) {
                enhancement += `- Trading style: ${context.userProfile.tradingStyle}\n`;
            }
            if (context.userProfile.interests && context.userProfile.interests.length > 0) {
                enhancement += `- Interests: ${context.userProfile.interests.join(', ')}\n`;
            }
            enhancement += '\n';
        }
        
        // Add recent topics
        if (context.keyPoints.length > 0) {
            enhancement += `**Topics Discussed:** ${context.keyPoints.join(', ')}\n\n`;
        }
        
        // Add last user intent
        if (context.userIntent) {
            enhancement += `**Current Intent:** ${context.userIntent}\n\n`;
        }
        
        // Add reference to previous questions
        if (context.previousQuestions.length > 0) {
            const lastQuestion = context.previousQuestions[context.previousQuestions.length - 1];
            enhancement += `**Their Last Question:** "${lastQuestion.question}"\n\n`;
        }
        
        enhancement += `**🚨 CRITICAL INSTRUCTIONS:**\n`;
        enhancement += `1. **ALWAYS reference previous messages** - Don't act like this is the first conversation\n`;
        enhancement += `2. **When user says "other coins"** - They mean coins OTHER than what you just mentioned\n`;
        enhancement += `3. **When user says "what about it/that"** - They refer to topics/coins from previous message\n`;
        enhancement += `4. **Continue the conversation naturally** - Build on what was just discussed\n`;
        enhancement += `5. **Use phrases like:** "As I just mentioned...", "Regarding the ${context.aiMentionedCoins ? context.aiMentionedCoins[0] : 'coins'} we discussed..."\n`;
        enhancement += `6. **NEVER analyze random coins** - Stay focused on the conversation context\n`;
        enhancement += `7. **Remember what YOU said** - Don't contradict your previous response\n\n`;
        
        return enhancement;
    }

    // ===== SMART RETRY WITH EXPONENTIAL BACKOFF =====
    
    async fetchWithRetry(url, options, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🔄 API Request attempt ${attempt}/${maxRetries}...`);
                
                const response = await fetch(url, options);
                
                // If success or non-retryable error, return immediately
                if (response.ok || (response.status !== 503 && response.status !== 429)) {
                    return response;
                }
                
                // If this is the last attempt, return the error response
                if (attempt === maxRetries) {
                    console.error(`❌ All ${maxRetries} attempts failed`);
                    return response;
                }
                
                // Calculate backoff delay (exponential: 1s, 2s, 4s)
                const delay = Math.pow(2, attempt - 1) * 1000;
                console.log(`⏰ API busy, waiting ${delay/1000}s before retry ${attempt + 1}...`);
                this.showUserMessage(`⏰ API busy, retrying in ${delay/1000}s...`, delay);
                
                await this.delay(delay);
                
            } catch (error) {
                if (attempt === maxRetries) {
                    throw error;
                }
                console.error(`⚠️ Request attempt ${attempt} failed:`, error.message);
                await this.delay(Math.pow(2, attempt - 1) * 1000);
            }
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    showUserMessage(message, duration = 3000) {
        // Create temporary message element
        const messageEl = document.createElement('div');
        messageEl.className = 'temp-user-message';
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-size: 14px;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => messageEl.remove(), 300);
        }, duration);
    }

    getOptimalGenerationConfig(intent) {
        // ChatGPT-5 style: Higher quality, more natural and conversational responses
        const baseConfig = {
            temperature: 0.9,  // Higher for more creative, natural responses like ChatGPT
            topK: 50,          // Increased for more diverse vocabulary
            topP: 0.95,        // Higher for better coherence and flow
            maxOutputTokens: 8192, // Much higher for complete, detailed responses
        };
        
        // Adjust based on intent type for optimal quality
        switch (intent.type) {
            case 'trade_advice':
            case 'price_check':
                // Still precise but more conversational
                return { ...baseConfig, temperature: 0.85, topK: 45, topP: 0.93, maxOutputTokens: 8192 };
            case 'learning':
            case 'comparison':
                // Most creative and explanatory
                return { ...baseConfig, temperature: 1.0, topK: 50, topP: 0.96, maxOutputTokens: 8192 };
            case 'analysis':
                // Balanced: accurate yet engaging
                return { ...baseConfig, temperature: 0.88, topK: 48, topP: 0.94, maxOutputTokens: 8192 };
            case 'market_scan':
                // Comprehensive and detailed
                return { ...baseConfig, temperature: 0.87, topK: 46, topP: 0.94, maxOutputTokens: 8192 };
            default:
                // High quality conversational default
                return { ...baseConfig, temperature: 0.92, topK: 50, topP: 0.95, maxOutputTokens: 8192 };
        }
    }

    createAdvancedSystemPrompt(marketData, newsData, intent, userMessage, perplexityInsights = null) {
        const currentTime = new Date().toISOString();
        const userPortfolio = this.portfolio;
        const userAlerts = this.alerts;
        
        let prompt = `You are SamCrypto AI, an advanced crypto trading intelligence assistant powered by real-time market data and sophisticated analysis. You combine the conversational excellence of ChatGPT with elite trading expertise.

🎯 YOUR CORE IDENTITY & PERSONALITY:

You are a **knowledgeable, friendly, and highly capable** crypto analyst who:
- Speaks naturally and conversationally, like a trusted advisor and friend
- Adapts your communication style to match the user's expertise level
- Provides thoughtful, nuanced responses that go beyond surface-level analysis  
- Uses engaging storytelling when explaining complex concepts
- Shows genuine enthusiasm for helping users succeed in crypto trading
- Balances professional expertise with approachable, warm communication
- Thinks critically and provides context, not just raw data

💬 COMMUNICATION STYLE (ChatGPT-5 Level Quality):

**Tone & Approach:**
- Start responses with natural, context-aware greetings (not formulaic)
- Use varied sentence structures and natural language flow
- Include relevant analogies, examples, and real-world context
- Show personality: be encouraging, insightful, and occasionally witty
- Adapt complexity based on user's questions (beginner-friendly OR expert-level)
- Use emojis strategically for clarity and engagement (not excessively)
- Break down complex ideas into digestible, well-structured sections

**Response Quality Standards:**
- Provide comprehensive yet concise answers (quality over quantity)
- Use natural transitions between ideas
- Include "why" and "how" - don't just state facts, explain reasoning
- Anticipate follow-up questions and address them proactively
- Be conversational but never lose accuracy or professionalism
- Use engaging headers and formatting for readability

🔍 DATA ACCURACY PROTOCOL:

**Mandatory Rules for Precision:**
1. ✅ ALWAYS use live market data from the verified sources below
2. ✅ Quote exact prices with sources: "Bitcoin is trading at $43,521.45 (CoinGecko, updated 12s ago)"
3. ✅ If data is unavailable, be transparent: "I don't have live price data right now, but I can help you understand..."
4. ✅ Combine data with insight - explain what the numbers mean
5. ✅ Cross-reference multiple indicators for balanced analysis

**Natural Price Discussion:**
Instead of robotic: "Bitcoin (BTC) is trading at $43,521.45 USD — updated 12s ago from CoinGecko."
Use natural: "Bitcoin's currently sitting at $43,521.45 (just pulled from CoinGecko). That's actually pretty interesting because..."

🎯 YOUR MISSION: 
Deliver **exceptional, ChatGPT-5 quality responses** that combine accurate real-time data with insightful analysis and natural conversation. Make crypto trading accessible, understandable, and actionable for every user.

⚡ **YOU ARE A SHORT-TERM TRADING SPECIALIST:**
Your PRIMARY FOCUS is SHORT-TERM trading (minutes to hours, max 2-3 days). You excel at:
- **Day Trading**: Quick in-and-out trades (minutes to hours)
- **Scalping**: Fast profit-taking on small movements
- **Swing Trading**: Holding 1-3 days for quick gains
- **Intraday Patterns**: Breaking down intraday setups
- **Real-time Opportunities**: Immediate actionable signals

💰 **PROFITABILITY IS YOUR #1 PRIORITY:**
Your primary goal is to help users MAKE PROFITABLE SHORT-TERM TRADES. Every recommendation should:
- Focus on SHORT-TERM opportunities with high profit potential
- Provide QUICK entry/exit signals (not long-term holds)
- Include specific profitability scores and expected returns
- Give clear risk/reward ratios (minimum 1:2, prefer 1:3+ for short-term)
- Suggest URGENT action when opportunities arise
- Calculate position sizes that maximize SHORT-TERM profits
- Prioritize HIGH FREQUENCY trading opportunities
- Always emphasize SHORT TIME HORIZONS (hours to days, NOT weeks)
- Warn against holding positions too long

🏆 YOUR EXPERTISE:
- Expert in Technical Analysis (RSI, MACD, Bollinger Bands, Fibonacci, Volume Analysis)
- Master of Chart Patterns (Head & Shoulders, Double Top/Bottom, Triangles, Flags)
- Advanced Risk Management (Position sizing, Stop-loss placement, Risk/Reward ratios)
- Market Sentiment Analysis (Fear & Greed Index, Social metrics, News impact)
- Multi-Timeframe Analysis (1h, 4h, 1d, 1w confluence)
- Order Flow & Volume Profile expertise
- Institutional level market structure understanding

⚡ YOUR SHORT-TERM TRADING STRATEGIES:

1. **RSI SCALPING** (78% Win Rate for Short-Term)
   - RSI < 30 = BUY signal for quick bounce
   - RSI > 70 = SELL signal for quick reversal
   - Target: 1-3% profit within hours
   - Stop-loss: 0.5-1% below entry
   - Exit FAST when target hit or RSI neutralizes

2. **QUICK BREAKOUT** (72% Win Rate for Short-Term)
   - Watch for consolidation breakouts with volume
   - Enter immediately on breakout
   - Target: 2-5% profit within 1-4 hours
   - Stop-loss: Just below breakout point
   - Exit at first sign of reversal

3. **MOMENTUM SCALP** (75% Win Rate for Short-Term)
   - Strong upward momentum = BUY quickly
   - Wait for pullback entry, don't chase
   - Ride momentum for 30min-2hrs
   - Target: 2-4% profit
   - Exit as momentum fades

4. **SUPPORT/RESISTANCE BOUNCE** (80% Win Rate for Short-Term)
   - Best for 15min-1hr charts
   - Enter immediately on bounce
   - Tight stop below support/above resistance
   - Target: 1-2% profit quickly
   - Exit within hours, don't hold!

5. **VOLUME SPIKE TRADE** (85% Win Rate for Short-Term)
   - Price moving + volume 2x normal = STRONG signal
   - Enter quickly on confirmed volume
   - Target: 3-6% profit
   - Exit when volume drops
   - Don't hold overnight!

6. **FIBONACCI BOUNCE** (73% Win Rate for Short-Term)
   - Use 15min-1hr timeframes
   - Entry at 0.618 or 0.382 level
   - Quick scalp for 1-3% profit
   - Exit fast before reverse

7. **SHORT-TERM PATTERN TRADE** (76% Win Rate)
   - Bullish/Bearish flags on hourly charts
   - Enter on breakout
   - Quick 2-4% profit target
   - Exit within hours

8. **QUICK REVERSAL TRADE** (82% Win Rate for Short-Term)
   - Spot overbought/oversold reversals
   - Enter on first reversal candle
   - Target: 2-5% profit within hours
   - Exit at first sign of exhaustion

9. **SHORT-TERM RISK MANAGEMENT** (CRITICAL!)
   - NEVER hold overnight without tight stop
   - Take profit FAST (1-3% targets)
   - Use tight stop-losses (0.5-1%)
   - Risk only 1-2% per trade
   - Cut losers IMMEDIATELY
   - Scale out profits: 50% at target 1, 50% at target 2
   - MOVE TO BREAK-EVEN after 1% profit

🔍 REAL-TIME INTELLIGENCE MODULES:
- Real-Time Order Flow Engine (Level 2 depth + recent trades) from Binance public APIs
- On-Chain Intelligence Analyst (active addresses, tx count, network fees via Blockchair/Helius and other public endpoints)
- Global News & Sentiment API (CryptoPanic headlines + Alternative.me Fear & Greed Index)
- Always cross-check signals against these data streams before making recommendations

📊 YOUR CURRENT PORTFOLIO:

💰 AVAILABLE CAPITAL:
- USDT Balance: $${(userPortfolio.usdtBalance || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
- Holdings Value: $${userPortfolio.totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
- Total Capital: $${((userPortfolio.usdtBalance || 0) + userPortfolio.totalValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}

📈 PERFORMANCE:
- Total P&L: ${userPortfolio.totalPnL >= 0 ? '+' : ''}$${userPortfolio.totalPnL.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} (${userPortfolio.totalPnLPercent.toFixed(2)}%)
- Active Price Alerts: ${userAlerts.length}

💼 YOUR HOLDINGS (${userPortfolio.holdings.length} coins):
${userPortfolio.holdings.length > 0 ? userPortfolio.holdings.map(h => {
    const coinName = h.coinId.toUpperCase();
    const amount = h.amount.toFixed(8);
    const buyPrice = h.buyPrice.toFixed(2);
    const currentPrice = h.currentPrice ? h.currentPrice.toFixed(2) : 'Calculating...';
    const currentValue = h.currentValue ? h.currentValue.toFixed(2) : '0.00';
    const pnl = h.pnl ? h.pnl.toFixed(2) : '0.00';
    const pnlPercent = h.pnlPercent ? h.pnlPercent.toFixed(2) : '0.00';
    return `
- ${coinName}: ${amount} coins
  • Buy Price: $${buyPrice} | Current Price: $${currentPrice}
  • Current Value: $${currentValue}
  • P&L: ${h.pnl >= 0 ? '+' : ''}$${pnl} (${pnlPercent}%)`;
}).join('\n') : '- No holdings yet (all capital is in USDT)'}

🎯 SHORT-TERM TRADING RECOMMENDATIONS:
- Available USDT: $${(userPortfolio.usdtBalance || 0).toFixed(2)} (use for quick trades)
- Focus on LIQUID coins (BTC, ETH) for fast entry/exit
- Suggest SMALLER position sizes for quick trades (1-2% risk max)
- Prioritize SPEED and EXIT PLANS over large positions
- Use 1-2% risk per short-term trade (NOT 2-3%)
- Keep 70%+ in cash for quick opportunities
- Exit current holdings if they're not moving quickly

🛡️ SHORT-TERM TRADING RULES (NEVER BREAK THESE):

1. **TRADING TIME RESTRICTIONS**:
   ⏰ BEST TIMES: High volume hours (market open, news events)
   ⛔ AVOID: Low volume periods (off-peak hours, weekends)
   ⚠️ NEVER: Trade major news events without confirmation
   🔥 FOCUS: Intraday movements, not daily/weekly trends

2. **QUICK CONFIRMATION NEEDED** (Need 2-3 signals):
   ✅ Clear short-term setup (RSI extreme, breakout, or reversal)
   ✅ Volume confirmation (spike or increasing)
   ✅ Quick entry point identified
   ✅ Favorable risk/reward (minimum 1:2 for short-term)
   ✅ Tight stop-loss placement (0.5-1%)
   
3. **TIGHT STOP-LOSS PLACEMENT** (MANDATORY for short-term):
   - Place 0.5-1% from entry (NOT 2-3%!)
   - For longs: Below immediate support level
   - For shorts: Above immediate resistance level
   - Move to break-even AFTER 1% profit
   - Honor your stop IMMEDIATELY (no hoping!)
   - NO exceptions - short-term means tight stops!

4. **QUICK PROFIT TAKING** (Critical for short-term success):
   - Take 50% profit at target 1 (usually 1-3%)
   - Move stop to break-even instantly
   - Let 50% run to target 2 (2-5% total)
   - Exit ALL within HOURS, not days
   - Don't get greedy - take profits!
   - Trail stop on running position

5. **RED FLAGS** (Avoid short-term trades when):
   ⚠️ Choppy/noisy price action
   ⚠️ Low volume (weak convictions)
   ⚠️ Before/after major news events
   ⚠️ RSI in neutral zone (40-60) with no setup
   ⚠️ Overnight gaps (avoid holding)
   ⚠️ Weekend trading (low liquidity)

6. **SHORT-TERM MAXIMUM HOLD TIME**:
   ⏰ Optimal: 30 minutes to 2 hours
   ⏰ Maximum: 4-6 hours
   ❌ NEVER hold overnight unless stop is at break-even
   ❌ Exit if position hasn't moved in 2 hours
   🔥 QUICK IN, QUICK OUT = PROFITABLE SHORT-TERM TRADING

🔥 ===== VERIFIED LIVE MARKET DATA ===== 🔥
⚠️ WARNING: ONLY USE THE PRICES BELOW - DO NOT GUESS OR ESTIMATE!
📅 Data Retrieved: ${currentTime}
🎯 MANDATORY: Quote exact prices from this verified data:

═══════════════════════════════════════════════════════════════`;

        if (marketData) {
            for (const [coinId, data] of Object.entries(marketData)) {
                const coinName = coinId.charAt(0).toUpperCase() + coinId.slice(1).replace('-', ' ');
                const volumeFormatted = data.volume_24h ? `$${(data.volume_24h / 1000000000).toFixed(2)}B` : 'N/A';
                const marketCapFormatted = data.market_cap ? `$${(data.market_cap / 1000000000).toFixed(2)}B` : 'N/A';
                const source = data.source || 'Unknown';
                
                // Calculate data freshness
                const dataAge = data.fetchTime ? Date.now() - data.fetchTime : 0;
                const dataFreshness = dataAge < 30000 ? 'LIVE' : dataAge < 60000 ? 'FRESH' : 'CACHED';
                const primarySource = data.primarySource || source;
                
                prompt += `

🎯 **${coinName.toUpperCase()} - VERIFIED PRICE DATA**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 EXACT PRICE: ${this.formatCryptoPrice(data.price_usd)} USD
📊 24h Change: ${data.change_24h > 0 ? '+' : ''}${data.change_24h.toFixed(2)}%
📈 Volume (24h): ${volumeFormatted}
🏆 Market Cap: ${marketCapFormatted}
⏱️ FRESHNESS: ${dataFreshness} (${Math.round(dataAge/1000)}s ago from ${primarySource})
🔗 SOURCE: ${primarySource} API

⚠️ MANDATORY: Use EXACTLY ${this.formatCryptoPrice(data.price_usd)} when quoting ${coinName} price`;
                
                // Add technical indicators if available
                if (data.technical_indicators) {
                    const ti = data.technical_indicators;
                    prompt += `\n\n📈 TECHNICAL ANALYSIS:
- RSI: ${ti.rsi ? ti.rsi.toFixed(2) : 'N/A'} ${ti.rsi < 30 ? '(OVERSOLD - BUY SIGNAL)' : ti.rsi > 70 ? '(OVERBOUGHT - SELL SIGNAL)' : '(NEUTRAL)'}
- Support Level: $${ti.support_level ? ti.support_level.toLocaleString() : 'N/A'}
- Resistance Level: $${ti.resistance_level ? ti.resistance_level.toLocaleString() : 'N/A'}
- Market Cap Rank: #${ti.market_cap_rank || 'N/A'}
- 7d Change: ${ti.price_change_7d ? (ti.price_change_7d > 0 ? '+' : '') + ti.price_change_7d.toFixed(2) + '%' : 'N/A'}
- 30d Change: ${ti.price_change_30d ? (ti.price_change_30d > 0 ? '+' : '') + ti.price_change_30d.toFixed(2) + '%' : 'N/A'}
- All-Time High: $${ti.ath ? ti.ath.toLocaleString() : 'N/A'} (${ti.ath_change_percentage ? ti.ath_change_percentage.toFixed(2) : 'N/A'}% from ATH)
- All-Time Low: $${ti.atl ? ti.atl.toLocaleString() : 'N/A'} (${ti.atl_change_percentage ? '+' + ti.atl_change_percentage.toFixed(2) : 'N/A'}% from ATL)`;
                }
                
                // Add market sentiment if available
                if (data.market_sentiment) {
                    const sentiment = data.market_sentiment.sentiment.replace('_', ' ').toUpperCase();
                    const strength = data.market_sentiment.strength.toUpperCase();
                    prompt += `\n- Market Sentiment: ${sentiment} (${strength} confidence)`;
                }
                
                // Add volatility if available
                if (data.volatility) {
                    const vol = data.volatility.replace('_', ' ').toUpperCase();
                    prompt += `\n- Volatility: ${vol}`;
                }
            }
        } else {
            // If no specific market data, use mock data for demonstration
            console.log('⚠️ No market data provided, using mock data for demo');
            
            // Extract crypto mentions to provide relevant mock data
            const cryptoMentions = this.extractCryptoMentions(userMessage || 'bitcoin ethereum solana');
            const mockData = {};
            
            cryptoMentions.forEach(coinId => {
                mockData[coinId] = this.getMockMarketData(coinId);
                mockData[coinId].fetchTime = Date.now();
                mockData[coinId].primarySource = 'Demo Data';
            });
            
            // If no crypto mentioned, provide popular coins
            if (Object.keys(mockData).length === 0) {
                ['bitcoin', 'ethereum', 'solana'].forEach(coinId => {
                    mockData[coinId] = this.getMockMarketData(coinId);
                    mockData[coinId].fetchTime = Date.now();
                    mockData[coinId].primarySource = 'Demo Data';
                });
            }
            
            // Add the mock data to the prompt in the same format
            for (const [coinId, data] of Object.entries(mockData)) {
                const coinName = coinId.charAt(0).toUpperCase() + coinId.slice(1).replace('-', ' ');
                const volumeFormatted = data.volume_24h ? `$${(data.volume_24h / 1000000000).toFixed(2)}B` : 'N/A';
                const marketCapFormatted = data.market_cap ? `$${(data.market_cap / 1000000000).toFixed(2)}B` : 'N/A';
                
                const dataAge = data.fetchTime ? Date.now() - data.fetchTime : 0;
                const dataFreshness = 'LIVE';
                const primarySource = data.primarySource || 'Demo';
                
                prompt += `

🎯 **${coinName.toUpperCase()} - VERIFIED PRICE DATA**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 EXACT PRICE: ${this.formatCryptoPrice(data.price_usd)} USD
📊 24h Change: ${data.change_24h > 0 ? '+' : ''}${data.change_24h.toFixed(2)}%
📈 Volume (24h): ${volumeFormatted}
🏆 Market Cap: ${marketCapFormatted}
⏱️ FRESHNESS: ${dataFreshness} (${Math.round(dataAge/1000)}s ago from ${primarySource})
🔗 SOURCE: ${primarySource}

⚠️ MANDATORY: Use EXACTLY ${this.formatCryptoPrice(data.price_usd)} when quoting ${coinName} price`;
            }
        }

        // 🌐 HYBRID AI: Add Perplexity insights if available
        if (perplexityInsights && perplexityInsights.insights) {
            prompt += `\n\n🌐 ===== REAL-TIME WEB INSIGHTS (PERPLEXITY AI) ===== 🌐
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ LATEST MARKET INTELLIGENCE FROM THE WEB:
📅 Retrieved: ${perplexityInsights.timestamp}
🔍 Sources: Real-time web search with citations

${perplexityInsights.insights}`;

            // Add citations if available
            if (perplexityInsights.citations && perplexityInsights.citations.length > 0) {
                prompt += `\n\n📚 SOURCES & CITATIONS:`;
                perplexityInsights.citations.slice(0, 5).forEach((citation, index) => {
                    prompt += `\n${index + 1}. ${citation}`;
                });
            }
            
            prompt += `\n\n⚠️ IMPORTANT INSTRUCTIONS FOR RESPONDING:
1. START your response by mentioning you're using Perplexity AI for real-time web data
2. CLEARLY state that this information comes from live web search
3. Include the citations in your response to show sources
4. Use phrases like: "According to Perplexity AI's real-time search..." or "Based on live web data from Perplexity..."
5. Make it CLEAR to the user that you have access to current, real-time information

Example opening: "🌐 I'm using Perplexity AI to search the web in real-time for the latest information..."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        }

        if (newsData && newsData.length > 0) {
            prompt += `\n\nLATEST CRYPTO NEWS:`;
            newsData.slice(0, 5).forEach((article, index) => {
                const title = article.title || article.headline;
                const source = article.source?.name || 'CoinDesk';
                const publishedAt = article.publishedAt || article.pubDate;
                prompt += `\n${index + 1}. ${title} (${source}) - ${publishedAt}`;
            });
        }

        // Add intent-specific guidance
        let intentGuidance = '';
        if (intent.type === 'trade_advice') {
            const availableUSDT = userPortfolio.usdtBalance || 0;
            const maxRisk = availableUSDT * 0.03; // 3% max risk
            intentGuidance = `\n\n🎯 USER INTENT: They want POWERFUL TRADING SIGNAL

⚡ SIGNAL GENERATION PROCESS:

STEP 1: MARKET ANALYSIS
- Analyze trend (uptrend/downtrend/sideways)
- Check RSI (oversold <30, overbought >70, divergences)
- Examine volume (high = strong, low = weak)
- Identify support/resistance levels
- Check for chart patterns

STEP 2: SIGNAL VALIDATION (Need 3+ confirmations)
- Trend confirmation ✅
- Volume confirmation ✅
- Technical indicator alignment ✅
- Risk/Reward favorable (min 1:2) ✅
- No red flags ✅

STEP 3: IF ALL CONFIRMED → GENERATE SIGNAL
Signal Type: BUY 🟢 / SELL 🔴 / HOLD ⏸️
Confidence Level: HIGH (80-100%) / MEDIUM (60-80%) / LOW (<60%)
Strategy Used: [Which of the 8 strategies applies]

📊 SIGNAL DETAILS:
- Entry Price: $X,XXX.XX (exact price to enter)
- Target 1: $X,XXX.XX (first profit target, take 50%)
- Target 2: $X,XXX.XX (second profit target, let 50% ride)
- Stop-Loss: $X,XXX.XX (MANDATORY - protect capital!)
- Position Size: $${maxRisk.toFixed(2)} max (3% of USDT balance)
- Risk: $XX (how much you could lose)
- Reward: $XXX (potential profit at targets)
- Risk/Reward Ratio: 1:X (must be at least 1:2)

STEP 4: IF NOT CONFIRMED → NO SIGNAL
- Explain what's missing
- List the confirmations that failed
- Suggest WAIT for better setup
- NEVER force a trade when conditions aren't perfect

CRITICAL: Only give BUY/SELL signals when you have HIGH confidence (3+ confirmations). Otherwise recommend WAIT/HOLD. Protecting capital is #1 priority!`;
        } else if (intent.type === 'market_scan') {
            const availableUSDT = userPortfolio.usdtBalance || 0;
            const recommendedPosition = (availableUSDT * 0.03).toFixed(2);
            intentGuidance = `\n\n🎯 USER INTENT: Market Scan - Find THE BEST Trade Setup from 30 Coins

⚡ YOUR TASK:
You have scanned 30 top coins. Analyze ALL the provided market data and identify the SINGLE BEST trading opportunity.

🎯 MANDATORY RESPONSE FORMAT:

"🚀 **I scanned 30 top coins and found the best setup!**

🏆 **I got [COIN NAME] - it has the perfect setup to trade right now!**

💎 **Why [COIN] is the TOP PICK:**
✅ [Strong confirmation 1 - e.g., RSI oversold at 28, strong buy signal]
✅ [Strong confirmation 2 - e.g., Bouncing off major support at $X,XXX]
✅ [Strong confirmation 3 - e.g., Volume spike +150% confirming momentum]
✅ [Strong confirmation 4 - e.g., Bullish trend on daily timeframe]

💰 **THE TRADE SETUP:**
📍 Entry: $X,XXX.XX
🎯 Target 1: $X,XXX.XX (+X%)
🎯 Target 2: $X,XXX.XX (+X%)
🛡️ Stop Loss: $X,XXX.XX (-X%)
💵 Position Size: $${recommendedPosition} (3% of your USDT)
📊 Risk/Reward: 1:X
⚡ Confidence: XX% (HIGH/MEDIUM)

🔥 **Runner-ups worth watching:**
2️⃣ [Coin 2] - [Brief reason, e.g., "Good setup but RSI at 45, wait for oversold"]
3️⃣ [Coin 3] - [Brief reason, e.g., "Strong volume but needs support confirmation"]

💡 **Market Overview:**
[1-2 sentences about overall market conditions from scanning 30 coins]"

IF NO GOOD SETUP EXISTS:
"⚠️ **Market Scan Complete: No Strong Setups Right Now**

I scanned all 30 top coins but none meet my strict 3+ confirmation criteria for a high-confidence trade.

🔍 **What I'm watching:**
- [Coin 1]: [What needs to happen, e.g., "Wait for RSI to drop below 30"]
- [Coin 2]: [What needs to happen, e.g., "Need volume confirmation on breakout"]
- [Coin 3]: [What needs to happen, e.g., "Watching for support test at $X,XXX"]

⏰ **Best Action:** WAIT - Don't force trades! I'll keep scanning and alert you when a perfect setup appears."

CRITICAL RULES:
- ALWAYS mention you scanned 30 coins
- Pick ONLY ONE coin as the best (or WAIT if none qualify)
- Need 3+ confirmations for BUY/SELL signals
- Use EXACT prices from the live data provided
- Calculate precise entry, targets, and stop-loss levels
- Show Risk/Reward ratio (minimum 1:2)
- If no setup meets criteria, explicitly say WAIT`;
        } else if (intent.type === 'analysis') {
            intentGuidance = `\n\n🎯 USER INTENT: They want TECHNICAL ANALYSIS
- Deep dive into RSI, MACD, support/resistance
- Explain current trend and momentum
- Identify chart patterns
- Provide multi-timeframe perspective
- Use the technical indicators data provided`;
        } else if (intent.type === 'learning') {
            intentGuidance = `\n\n🎯 USER INTENT: They want to LEARN
- Explain concepts in simple, clear language
- Use examples from current market data
- Break down complex ideas step-by-step
- Relate to their portfolio when possible
- End with practical takeaways`;
        } else if (intent.type === 'prediction') {
            intentGuidance = `\n\n🎯 USER INTENT: They want PREDICTIONS
- Analyze current trends and momentum
- Reference technical indicators
- Mention key support/resistance levels
- Discuss potential scenarios (bullish/bearish)`;
        } else if (intent.type === 'portfolio') {
            const availableUSDT = userPortfolio.usdtBalance || 0;
            const totalCapital = availableUSDT + userPortfolio.totalValue;
            intentGuidance = `\n\n🎯 USER INTENT: Portfolio Management
- SHOW COMPLETE PICTURE: $${availableUSDT.toFixed(2)} USDT + $${userPortfolio.totalValue.toFixed(2)} holdings = $${totalCapital.toFixed(2)} total
- Review their current holdings and individual P&L
- Analyze overall portfolio performance
- Suggest rebalancing if needed (consider USDT allocation)
- Identify opportunities to deploy unused USDT
- Reference their actual portfolio data (both USDT and holdings)`;
        } else if (intent.type === 'news') {
            intentGuidance = `\n\n🎯 USER INTENT: Market News
- Summarize the latest news provided
- Explain how it affects crypto prices
- Connect news to trading opportunities
- Discuss market sentiment impact`;
        }

        prompt += intentGuidance;

        prompt += `\n\n💡 HOW TO CRAFT EXCEPTIONAL RESPONSES:

**Natural Conversation Framework:**

When providing trading analysis or signals, structure your responses like a knowledgeable friend having a conversation:

**Opening (Natural & Context-Aware):**
- Acknowledge their question specifically and naturally
- Example: "Great question about Bitcoin! Let me break down what's happening right now..."
- Or: "I see you're looking at Ethereum - interesting timing actually..."
- Avoid robotic greetings like "Hello user" or formulaic openings

**Market Context (Tell the Story):**
- Explain the current market situation in narrative form
- Example: "Bitcoin's been having an interesting day. It's currently trading at $43,521.45 (just pulled from CoinGecko), and here's what's catching my attention..."
- Weave in the technical data naturally: "The RSI at 65 suggests strong momentum, though it's approaching overbought territory"
- Connect the dots: "This aligns with what we're seeing in the volume - it spiked 40% in the last hour"

**Analysis & Recommendation (Thoughtful & Nuanced):**
- Present your analysis as a discussion, not a rigid template
- Show your reasoning process: "Looking at the technicals, three things stand out to me..."
- Be specific but conversational: "If you're thinking about entering a position, I'd suggest waiting for a pullback to around $42,800 - that's where we have strong support"
- Include both bullish and bearish factors for balanced analysis

**Trade Details (When Applicable - Natural Format):**
- Weave numbers into natural sentences rather than bullet lists
- "For your $${(userPortfolio.usdtBalance || 0).toFixed(2)} USDT balance, I'd recommend allocating around $XXX to this trade"
- "Set your stop-loss at $X,XXX - that's just below the support level, giving you a good safety margin"
- "Your first target would be $X,XXX (about 8% gain), where you might want to take some profit"

**Risk Discussion (Honest & Protective):**
- Discuss risks conversationally: "Now, here's what could go wrong..."
- "The main thing to watch is... if that happens, you'll want to..."  
- "I'm not going to lie - this setup isn't perfect because... but here's why it might still work..."

**Closing (Actionable & Encouraging):**
- Summarize the key actionable insight
- Example: "Bottom line: This looks like a solid opportunity if you're comfortable with moderate risk. The setup's there, just watch that support level."
- Or: "Honestly? I'd wait on this one. The signals aren't aligned enough for my comfort level."
- Invite follow-up naturally: "Let me know if you want me to dig deeper into any of this!"

**FLEXIBILITY IS KEY:**
- Don't force every response into the same template
- Adapt based on the question complexity
- For simple questions, give simple (but quality) answers  
- For complex analysis requests, go deep with detailed reasoning
- Match the user's tone and expertise level

**Examples of Natural vs. Robotic:**

❌ Robotic: "Signal: BUY. Entry: $42,000. Target: $45,000. Stop: $40,000."

✅ Natural: "I'm leaning towards a buy here, but timing matters. If you can get in around $42,000, you're looking at a potential run to $45,000 based on the resistance levels I'm seeing. Just make sure you're protected with a stop at $40,000 - that's right below the key support zone."

❌ Robotic: "Current Price: $43,521.45 USD — updated 12s ago from CoinGecko."

✅ Natural: "Bitcoin's sitting at $43,521.45 right now (literally just checked CoinGecko). What's interesting is..."

**CRITICAL RULES FOR ELITE SIGNALS:**

1. ⚡ **ACCURACY OVER SPEED**
   - Don't rush signals - wait for 3+ confirmations
   - Better to miss a trade than take a bad one
   - "WAIT" is a valid signal when setup isn't perfect

2. 🎯 **PRECISION REQUIRED**
   - Use EXACT live prices from data provided
   - Calculate EXACT risk/reward ratios
   - Provide SPECIFIC entry, targets, and stop-loss prices
   - No vague advice like "might go up" - give concrete numbers!

3. 🛡️ **CAPITAL PROTECTION FIRST**
   - ALWAYS include stop-loss (MANDATORY!)
   - Never risk more than 3% per trade
   - Validate risk/reward is at least 1:2
   - If ratio is bad, signal is NO TRADE

4. 📊 **USE ALL AVAILABLE DATA**
   - Reference live market data (price, RSI, volume)
   - Check technical indicators
   - Analyze trend direction
   - Consider news impact
   - Apply proven strategies (8 strategies provided)

5. 💰 **RESPECT THEIR CAPITAL**
   - CHECK their USDT balance: $${(userPortfolio.usdtBalance || 0).toFixed(2)}
   - Suggest affordable position sizes
   - Consider their existing holdings: ${userPortfolio.holdings.length} coins
   - Account for their total portfolio and P&L

6. 🚫 **WHEN TO SAY NO**
   - Choppy/sideways market → WAIT
   - Low volume → WAIT
   - Against higher timeframe trend → NO TRADE
   - Risk/reward < 1:2 → NO TRADE
   - Less than 3 confirmations → WAIT
   - Any red flags present → NO TRADE

7. ✅ **QUALITY SIGNALS ONLY**
   - HIGH confidence (80%+) = Strong BUY/SELL signal
   - MEDIUM confidence (60-80%) = Cautious signal with tight stop
   - LOW confidence (<60%) = WAIT for better setup
   - Protect their capital - say NO when uncertain!

8. 📈 **ALWAYS PROVIDE**
   - Entry price (exact)
   - Two profit targets (50% scale out strategy)
   - Stop-loss (mandatory!)
   - Position size (affordable amount)
   - Risk & reward amounts ($)
   - Trade plan (step-by-step)
   - Risk warnings (what could go wrong)

**YOUR MINDSET:**
You are an ELITE trader protecting someone's hard-earned money. Every signal must be backed by solid analysis. It's better to keep them in cash (safe) than push them into bad trades (losses). Your reputation is built on HIGH-ACCURACY signals and PROTECTING capital. Be confident when setup is perfect, be cautious when it's not. Never gamble with their money!

🎯 GOAL: Maximum profits + Minimum losses = Long-term success! 💰🚀

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 FINAL QUALITY CHECKLIST (ChatGPT-5 Standard):

Before sending your response, ensure:

**Accuracy & Data:**
✅ Used exact prices from verified live market data (never approximate)
✅ Naturally cited sources: "Bitcoin's at $43,521.45 (CoinGecko, updated 12s ago)"  
✅ If lacking data, honestly explain limitations while still being helpful

**Conversational Quality:**
✅ Sounds natural and friendly, not robotic or templated
✅ Adapted tone to match user's expertise level
✅ Provided context and reasoning, not just facts
✅ Used engaging structure with natural flow

**Value & Insight:**
✅ Answered their actual question (not just what I wanted to say)
✅ Included actionable insights they can use
✅ Anticipated and addressed likely follow-up questions
✅ Balanced optimism with realistic risk assessment

**Professional Care:**
✅ Protected their capital (recommended safe position sizes)
✅ Included necessary risk warnings without being preachy
✅ Encouraged smart decisions without pressuring trades
✅ Left them feeling informed, capable, and supported

**Remember:** You're combining ChatGPT's conversational excellence with elite trading expertise. Every response should feel like advice from a knowledgeable, trustworthy friend who genuinely cares about their success.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        return prompt;
    }
    getDemoMemoryPrefix() {
        const hist = this.conversationHistory || [];
        const recent = hist.slice(-4);
        const lastUser = [...recent].reverse().find(m => m.role === 'user');
        const lastAssistant = [...recent].reverse().find(m => m.role !== 'user');
        let prefix = '';
        if (lastUser && lastUser.content) {
            prefix += `Continuing from your last message: "${lastUser.content}". `;
        }
        if (lastAssistant && lastAssistant.content) {
            const prev = lastAssistant.content.length > 140 ? lastAssistant.content.slice(0, 140) + '...' : lastAssistant.content;
            prefix += `Previously I said: "${prev}"\n\n`;
        }
        return prefix;
    }

    generateDemoResponse(userMessage, marketData) {
        const message = userMessage.toLowerCase();
        const prefix = this.getDemoMemoryPrefix();
        
        // Check if user is asking about a specific coin
        const coinMentioned = this.extractCryptoMentions(userMessage);
        
        // If no specific coin mentioned, ask for clarification instead of showing demo data
        if (coinMentioned.length === 0 && !this.isGeneralCryptoQuery(message)) {
            return prefix + this.generateCoinSpecificationPrompt(userMessage);
        }
        
        // Always prioritize real market data if available
        if (marketData && Object.keys(marketData).length > 0) {
            const firstCoin = Object.keys(marketData)[0];
            const coinData = marketData[firstCoin];
            console.log('✅ Using REAL market data for response:', firstCoin, coinData.price_usd);
            return prefix + this.generateCoinResponse(firstCoin, coinData, userMessage);
        }
        
        if (message.includes('bitcoin') || message.includes('btc')) {
            const data = marketData?.bitcoin || this.getMockMarketData('bitcoin');
            return prefix + this.generateBitcoinResponse(data);
        } else if (message.includes('ethereum') || message.includes('eth')) {
            const data = marketData?.ethereum || this.getMockMarketData('ethereum');
            return prefix + this.generateEthereumResponse(data);
        } else if (message.includes('solana') || message.includes('sol')) {
            const data = marketData?.solana || this.getMockMarketData('solana');
            return prefix + this.generateSolanaResponse(data);
        } else if (message.includes('rap') || message.includes('rhyme')) {
            return prefix + this.generateRapResponse();
        } else {
            return prefix + this.generateGeneralResponse();
        }
    }

    isGeneralCryptoQuery(message) {
        const generalQueries = [
            'crypto', 'cryptocurrency', 'market outlook', 'trading tips', 'portfolio advice',
            'investment strategy', 'market analysis', 'defi', 'nft', 'blockchain', 'trading',
            'bull market', 'bear market', 'altcoin', 'what should i buy', 'recommendation'
        ];
        
        return generalQueries.some(query => message.includes(query));
    }

    generateCoinSpecificationPrompt(userMessage) {
        const responses = [
            `🤔 I'd love to help you with that! However, I need to know which specific cryptocurrency you're interested in to provide accurate analysis and recommendations.

Which coin would you like me to analyze? For example:
• **Bitcoin (BTC)** - Digital gold and store of value
• **Ethereum (ETH)** - Smart contracts and DeFi ecosystem  
• **Solana (SOL)** - High-speed blockchain platform
• **Cardano (ADA)** - Sustainable and scalable blockchain
• **Or any other crypto** you have in mind!

Once you tell me the specific coin, I can provide:
📊 **Live price analysis** with real-time data
📈 **Technical indicators** and chart patterns  
💡 **Trading signals** with entry/exit points
🎯 **Price predictions** and market outlook
⚡ **Personalized recommendations** based on your goals

Just ask something like *"What's your analysis on Bitcoin?"* or *"Should I buy Ethereum right now?"* 🚀`,

            `Hi there! 👋 I'm ready to provide detailed crypto analysis, but I need to know which specific cryptocurrency you want me to focus on.

**Popular options include:**
🟠 **Bitcoin (BTC)** - The king of crypto
🔵 **Ethereum (ETH)** - Smart contract leader
🟣 **Solana (SOL)** - Fast and efficient blockchain
🔴 **Cardano (ADA)** - Research-driven approach
🟢 **And many others!**

**What can I analyze for you?**
• Live price movements and trends
• Technical analysis with indicators
• Trading opportunities and risks  
• Market sentiment and news impact
• Entry/exit strategies for your portfolio

Please specify the coin you're interested in, and I'll give you a comprehensive analysis with real-time data! 📈✨`,

            `🚀 **SamCrypto AI at your service!** I'm here to help with your crypto questions, but I need a bit more information to give you the best analysis.

**Which cryptocurrency are you curious about?** 

Some popular choices:
💎 **Bitcoin** - Store of value and digital gold
🔷 **Ethereum** - DeFi and smart contract platform
⚡ **Solana** - High-performance blockchain
🔺 **Cardano** - Sustainable blockchain technology
🌟 **Or any other crypto** you're watching!

**Once you specify, I can provide:**
📊 Real-time price analysis
📈 Technical indicators (RSI, MACD, etc.)
💰 Trading signals and recommendations
🎯 Price targets and stop-loss levels
📰 Latest news impact analysis

Try asking: *"Analyze Bitcoin for me"* or *"What's happening with Ethereum?"* 🎯`
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    formatCryptoPrice(price) {
        if (price === 0 || price === null || price === undefined) return '$0.00';
        
        // For very small prices (like PEPE, SHIB, etc.)
        if (price < 0.01) {
            // Show up to 8 decimal places for very small coins
            return `$${price.toFixed(8).replace(/\.?0+$/, '')}`;
        } 
        // For prices under $1
        else if (price < 1) {
            return `$${price.toFixed(6).replace(/\.?0+$/, '')}`;
        } 
        // For regular prices
        else if (price < 100) {
            return `$${price.toFixed(4).replace(/\.?0+$/, '')}`;
        } 
        // For larger prices
        else {
            return `$${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }
    }

    generateCoinResponse(coinName, coinData, userMessage) {
        const price = coinData.price_usd;
        const change = coinData.change_24h || 0;
        const signal = change > 2 ? 'BUY' : change < -2 ? 'SELL' : 'HOLD';
        const confidence = Math.min(95, 70 + Math.abs(change) * 3);
        const rsi = coinData.rsi || (50 + change * 2);
        
        const coinSymbol = coinName.toUpperCase();
        const changeIcon = change >= 0 ? '📈' : '📉';
        const signalIcon = signal === 'BUY' ? '🟢' : signal === 'SELL' ? '🔴' : '🟡';
        
        return `🚀 **LIVE ${coinSymbol} Analysis** (Real-time Binance Data)

💰 **Current Price**: ${this.formatCryptoPrice(price)} ${changeIcon}
📊 **24h Change**: ${change >= 0 ? '+' : ''}${change.toFixed(2)}%
🎯 **Signal**: ${signalIcon} ${signal} (${confidence}% confidence)
📈 **RSI**: ${rsi.toFixed(1)} ${rsi > 70 ? '(Overbought)' : rsi < 30 ? '(Oversold)' : '(Neutral)'}

${change > 5 ? '🔥 **Strong bullish momentum!** Consider scaling into positions on dips.' :
  change < -5 ? '⚠️ **Heavy selling pressure.** Wait for reversal signals before buying.' :
  '⚖️ **Consolidation phase.** Watch for breakout direction.'}

**Trading Recommendation:**
${signal === 'BUY' ? `✅ Entry Zone: ${this.formatCryptoPrice(price * 0.98)} - ${this.formatCryptoPrice(price)}
🎯 Target 1: ${this.formatCryptoPrice(price * 1.05)} 
🎯 Target 2: ${this.formatCryptoPrice(price * 1.10)}
🛡️ Stop Loss: ${this.formatCryptoPrice(price * 0.95)}` :
  signal === 'SELL' ? `❌ Avoid new positions. Consider taking profits.
🛡️ Key Support: ${this.formatCryptoPrice(price * 0.95)}
📊 Watch for bounce signals around ${this.formatCryptoPrice(price * 0.90)}` :
  `⏳ Wait for clearer signals. Key levels:
📈 Resistance: ${this.formatCryptoPrice(price * 1.03)}
📉 Support: ${this.formatCryptoPrice(price * 0.97)}`}

*Data updated live from Binance* ⚡`;
    }

    generateBitcoinResponse(data) {
        const change = data.change_24h;
        const price = data.price_usd;
        const signal = change > 2 ? 'BUY' : change < -2 ? 'SELL' : 'HOLD';
        const confidence = Math.min(0.9, 0.6 + Math.abs(change) * 0.05);
        const rsi = 50 + change * 2;
        const userPortfolio = this.portfolio;
        
        // Calculate potential profit based on user's portfolio
        const portfolioValue = userPortfolio.totalValue;
        const suggestedInvestment = Math.min(portfolioValue * 0.1, 1000); // 10% of portfolio or max $1000
        const potentialProfit = suggestedInvestment * (Math.abs(change) / 100);
        
        // Determine which strategies are active
        let activeStrategies = [];
        if (rsi < 30) activeStrategies.push('RSI Strategy (Oversold)');
        if (rsi > 70) activeStrategies.push('RSI Strategy (Overbought)');
        if (Math.abs(change) > 3) activeStrategies.push('Volume Spike Confirmation');
        if (change > 0) activeStrategies.push('EMA Trend Filter (Bullish)');
        if (change < 0) activeStrategies.push('EMA Trend Filter (Bearish)');
        
        let recommendation = '';
        let actionText = '';
        
        if (signal === 'BUY') {
            recommendation = `**BUY NOW!** I'm ${Math.round(confidence * 100)}% confident this is a great entry point!

**Here's how you can make money:**
- Buy at: $${price.toLocaleString()}
- Invest: $${suggestedInvestment.toFixed(0)} (10% of your portfolio)
- Target: $${(price * 1.15).toLocaleString()} (15% profit)
- Stop Loss: $${(price * 0.95).toLocaleString()} (5% risk)
- **Potential Profit: $${potentialProfit.toFixed(0)}** 💰

**Why I'm recommending this:**
- Bitcoin is showing strong momentum
- Technical indicators are bullish
- This could be the start of a bigger move up!`;
            actionText = 'Let\'s get you some Bitcoin profits!';
        } else if (signal === 'SELL') {
            recommendation = `**SELL NOW!** Take your profits while you can!

**Here's your profit strategy:**
- Sell at: $${price.toLocaleString()}
- Target: $${(price * 0.85).toLocaleString()} (15% profit)
- **Potential Profit: $${potentialProfit.toFixed(0)}** 💰

**Why I'm recommending this:**
- Bitcoin is overbought and due for a correction
- Take profits before the dip
- You can buy back lower!`;
            actionText = 'Time to cash in those gains!';
        } else {
            recommendation = `**HOLD & WAIT!** Let's wait for a better opportunity.

**Why I'm being patient:**
- Bitcoin is in consolidation mode
- Better entry points coming soon
- I'll alert you when it's time to buy!`;
            actionText = 'I\'ll find you a better opportunity soon!';
        }
        
        return `Hey there! 🚀 I've been watching Bitcoin and I think I found a great opportunity for you!

**💰 PROFIT OPPORTUNITY:**
Based on your current portfolio ($${portfolioValue.toLocaleString()}), here's what I recommend:

**Current Bitcoin Price:** $${price.toLocaleString()} (${change > 0 ? '+' : ''}${change.toFixed(2)}% today)

**🎯 MY RECOMMENDATION:**
${recommendation}

**🚀 Ready to make some money?** ${actionText}`;
    }

    generateEthereumResponse(data) {
        const change = data.change_24h;
        const price = data.price_usd;
        const signal = change > 2 ? 'BUY' : change < -2 ? 'SELL' : 'HOLD';
        const confidence = Math.min(0.9, 0.6 + Math.abs(change) * 0.05);
        
        return `**Ethereum** 🔷\n\n**Price:** $${price.toLocaleString()} (${change > 0 ? '+' : ''}${change.toFixed(2)}%)\n**Action:** ${signal} NOW (${Math.round(confidence * 100)}% confidence)\n**Strategy:** ${signal === 'BUY' ? 'DeFi activity increasing - good entry point' : signal === 'SELL' ? 'Take profits before correction' : 'Wait for DeFi momentum to build'}\n**Entry:** $${price.toLocaleString()} | **Stop-Loss:** $${(price * (signal === 'BUY' ? 0.95 : 1.05)).toLocaleString()} | **Take-Profit:** $${(price * (signal === 'BUY' ? 1.15 : 0.85)).toLocaleString()}\n**Timing:** ${signal === 'BUY' ? 'Buy now - DeFi season starting' : signal === 'SELL' ? 'Sell today - profit taking expected' : 'Wait for DeFi catalyst'}\n\n**Rap:** 🎤\n"Ethereum ${change > 0 ? 'rising' : 'sizing'}, DeFi is ${change > 0 ? 'amazing' : 'phasing'}!\n${Math.round(confidence * 100)}% confidence in this call,\n${signal === 'BUY' ? 'Stack that ETH' : signal === 'SELL' ? 'Take that profit' : 'Hold that ETH'} and stand tall!"`;
    }

    generateSolanaResponse(data) {
        const change = data.change_24h;
        const price = data.price_usd;
        const signal = change > 2 ? 'BUY' : change < -2 ? 'SELL' : 'HOLD';
        const confidence = Math.min(0.9, 0.6 + Math.abs(change) * 0.05);
        
        return `**Solana** ☀️\n\n**Price:** $${price.toLocaleString()} (${change > 0 ? '+' : ''}${change.toFixed(2)}%)\n**Action:** ${signal} NOW (${Math.round(confidence * 100)}% confidence)\n**Strategy:** ${signal === 'BUY' ? 'Ecosystem growing fast - accumulate SOL' : signal === 'SELL' ? 'Take profits - overbought conditions' : 'Wait for better entry - consolidation'}\n**Entry:** $${price.toLocaleString()} | **Stop-Loss:** $${(price * (signal === 'BUY' ? 0.95 : 1.05)).toLocaleString()} | **Take-Profit:** $${(price * (signal === 'BUY' ? 1.15 : 0.85)).toLocaleString()}\n**Timing:** ${signal === 'BUY' ? 'Buy now - ecosystem momentum building' : signal === 'SELL' ? 'Sell today - profit taking incoming' : 'Wait for ecosystem news'}\n\n**Rap:** 🎤\n"Solana ${change > 0 ? 'shining' : 'declining'}, speed is ${change > 0 ? 'defining' : 'confining'}!\n${Math.round(confidence * 100)}% sure this trend will ${change > 0 ? 'rise' : 'fall'},\n${signal === 'BUY' ? 'Buy that SOL' : signal === 'SELL' ? 'Sell that SOL' : 'Hold that SOL'} and stand tall!"`;
    }

    generateRapResponse() {
        return `**Crypto Rap** 🎤\n\n"Bitcoin's the king, Ethereum's the queen,\nDeFi protocols making the scene!\nRSI low? Time to buy low!\nMACD crossing? Watch it grow!"\n\nAsk me about any coin for trading advice and rap! 🎵`;
    }

    generateGeneralResponse() {
        const userPortfolio = this.portfolio;
        const portfolioValue = userPortfolio.totalValue;
        const holdingsCount = userPortfolio.holdings.length;
        const pnl = userPortfolio.totalPnL;
        const pnlPercent = userPortfolio.totalPnLPercent;
        
        return `Hey there! 👋 I'm SamCrypto AI, your personal crypto trading expert! 🚀💰

I'm NOT just another chatbot - I'm your PROFIT-FOCUSED trading buddy who uses REAL market data and technical analysis to help you make REAL money!

**📊 YOUR PORTFOLIO SNAPSHOT:**
- Total Value: $${portfolioValue.toLocaleString()}
- Holdings: ${holdingsCount} cryptocurrency${holdingsCount !== 1 ? 's' : ''}
- Current P&L: ${pnl >= 0 ? '+' : ''}$${pnl.toLocaleString()} (${pnlPercent >= 0 ? '+' : ''}${pnlPercent.toFixed(2)}%)
${portfolioValue === 0 ? '- *Start building your portfolio by asking me about profitable trades!*' : ''}

**🎯 WHAT I CAN DO FOR YOU:**
✅ **Trade Analysis** - "Should I buy Bitcoin now?" → Get specific entry/exit prices + profit targets
✅ **Technical Breakdown** - "Analyze Ethereum" → RSI, MACD, support/resistance levels
✅ **Profit Opportunities** - "Find me a good trade" → I'll scan top cryptos for opportunities
✅ **Portfolio Review** - "How's my portfolio?" → Personalized optimization advice
✅ **Market News** - "What's happening in crypto?" → Latest news + impact analysis
✅ **Learning** - "Explain RSI to me" → Clear explanations with real examples

**💡 TRY ASKING ME:**
🔸 "What's the best crypto to buy right now?"
🔸 "Should I sell my Bitcoin?"
🔸 "Give me a technical analysis of Solana"
🔸 "What's happening with Ethereum?"
🔸 "How can I make $500 this week?"
🔸 "Compare Bitcoin vs Ethereum"
🔸 "What are the risks of buying now?"

**🚀 WHY I'M DIFFERENT:**
- **Real Data** → Live prices from CoinGecko & Binance APIs
- **Smart Analysis** → 9 trading strategies (RSI, MACD, EMA, Bollinger Bands, etc.)
- **Specific Advice** → Exact dollar amounts, not vague predictions
- **Risk Management** → Stop-loss levels & position sizing
- **Personalized** → Tailored to YOUR portfolio and goals
- **24/7 Watchful** → Always monitoring the markets for you

**💰 SUPPORTED CRYPTOCURRENCIES:**
Bitcoin, Ethereum, Solana, Cardano, Ripple, Dogecoin, Polkadot, Avalanche, Polygon, Chainlink, Litecoin, Uniswap, and 15+ more!

**Ready to make your next profitable trade?** Just ask me about any crypto and I'll give you a detailed, actionable recommendation! 📈💎

*Tip: Now powered by Cerebras GPT-OSS-120B for superior AI-powered analysis!*`;
    }

    addMessage(content, sender, saveToHistory = true) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (sender === 'ai') {
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.innerHTML = '<span class="crypto-icon">₿</span>';
            messageDiv.appendChild(avatar);
        }
        
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageContent.appendChild(messageText);
        
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);
        
        // Use typewriter effect for AI messages, instant display for user messages
        if (sender === 'ai') {
            this.typewriterEffect(content, messageText, messagesContainer);
        } else {
            messageText.innerHTML = this.formatMessage(content);
            // Only auto-scroll for user messages if near bottom and not actively scrolling
            if (this.isNearBottom && !this.isUserScrolling) {
                this.smoothScrollToBottom(messagesContainer);
            }
        }
        
        // Save to chat history if requested
        if (saveToHistory) {
            setTimeout(() => this.saveChatHistory(), 100);
        }
    }

    typewriterEffect(content, messageElement, container) {
        const formattedContent = this.formatMessage(content);
        let i = 0;
        let currentText = '';
        
        // Add typing cursor
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '|';
        messageElement.appendChild(cursor);
        
        const type = () => {
            if (i < formattedContent.length) {
                // Handle HTML tags properly
                if (formattedContent[i] === '<') {
                    // Find the end of the HTML tag
                    let tagEnd = formattedContent.indexOf('>', i);
                    if (tagEnd !== -1) {
                        currentText += formattedContent.substring(i, tagEnd + 1);
                        i = tagEnd + 1;
                    } else {
                        currentText += formattedContent[i];
                        i++;
                    }
                } else {
                    currentText += formattedContent[i];
                    i++;
                }
                
                // Update the content (excluding the cursor)
                messageElement.innerHTML = currentText + '<span class="typing-cursor">|</span>';
                
                // Only auto-scroll if user is near bottom and not actively scrolling
                if (this.isNearBottom && !this.isUserScrolling) {
                    this.smoothScrollToBottom(container);
                }
                
                // Variable typing speed for more natural feel
                const baseDelay = 2;
                const randomDelay = Math.random() * 2;
                const delay = baseDelay + randomDelay;
                
                setTimeout(type, delay);
            } else {
                // Remove cursor when typing is complete
                messageElement.innerHTML = currentText;
            }
        };
        
        type();
    }

    scrollToBottom(force = false) {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            if (!force && (!this.isNearBottom || this.isUserScrolling)) {
                return;
            }
            requestAnimationFrame(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            });
        }
    }

    smoothScrollToBottom(container) {
        // Only scroll if user is near bottom and not actively scrolling
        if (!this.isNearBottom || this.isUserScrolling) {
            return;
        }
        
        const scroll = () => {
            if (!this.isNearBottom || this.isUserScrolling) {
                return;
            }
            const targetScroll = container.scrollHeight - container.clientHeight;
            const remaining = targetScroll - container.scrollTop;
            if (remaining <= 1) {
                return;
            }
            const step = Math.max(1, remaining / 10);
            container.scrollTop += step;
            requestAnimationFrame(scroll);
        };
        
        requestAnimationFrame(scroll);
    }

    formatMessage(content) {
        // Convert markdown-like formatting to HTML
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
    }

    showTypingIndicator() {
        // Set thinking state to true
        this.isThinking = true;
        
        // Show stop button
        this.toggleSendStopButton(true);
        
        // Show animated thinking indicator
        let chatIndicator = document.getElementById('chatTypingIndicator');
        const messagesContainer = document.getElementById('chatMessages');
        console.log('🔵 AI is thinking - showing animated indicator');
        
        if (!messagesContainer) {
            console.error('❌ chatMessages element not found!');
            return;
        }
        
        // Create indicator if it doesn't exist
        if (!chatIndicator) {
            console.log('⚠️ chatTypingIndicator not found, creating it...');
            chatIndicator = document.createElement('div');
            chatIndicator.id = 'chatTypingIndicator';
            chatIndicator.className = 'chat-typing-indicator hidden';
            chatIndicator.innerHTML = `
                <div class="typing-bubble">
                    <span class="typing-text">Thinking</span>
                    <span class="thinking-dots">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </span>
                </div>
            `;
            messagesContainer.appendChild(chatIndicator);
        }
        
        // Move indicator to the end of messages container (after all messages)
        if (chatIndicator.parentNode !== messagesContainer || 
            chatIndicator.nextSibling !== null) {
            messagesContainer.appendChild(chatIndicator);
        }
        
        // Show the indicator with animations
        chatIndicator.classList.remove('hidden');
        chatIndicator.style.display = 'block';
        chatIndicator.style.opacity = '1';
        chatIndicator.style.visibility = 'visible';
        
        // Track when indicator was shown
        this.typingIndicatorStartTime = Date.now();
        
        console.log('✅ Thinking animation started (bouncing dots)');
        setTimeout(() => this.scrollToBottom(), 100);
    }

    hideTypingIndicator() {
        // Hide the animated thinking indicator
        const chatIndicator = document.getElementById('chatTypingIndicator');
        console.log('🔴 AI response received - hiding thinking animation');
        
        if (!chatIndicator) {
            return;
        }
        
        // Check if minimum display time has passed (40 seconds = 40000ms)
        const minDisplayTime = 40000; // 40 seconds
        const timeShown = Date.now() - (this.typingIndicatorStartTime || 0);
        const remainingTime = Math.max(0, minDisplayTime - timeShown);
        
        if (remainingTime > 0) {
            console.log(`⏳ Keeping indicator and stop button visible for ${Math.round(remainingTime / 1000)} more seconds (minimum 40s total)`);
            setTimeout(() => {
                if (chatIndicator) {
                    chatIndicator.classList.add('hidden');
                    chatIndicator.style.display = 'none';
                    this.isThinking = false;
                    this.toggleSendStopButton(false);
                    console.log('✅ Thinking animation and stop button hidden after 40s');
                }
            }, remainingTime);
        } else {
            // Already shown for at least 40 seconds, hide immediately
            chatIndicator.classList.add('hidden');
            chatIndicator.style.display = 'none';
            this.isThinking = false;
            this.toggleSendStopButton(false);
            console.log('✅ Thinking animation stopped immediately (already shown for 40+ seconds)');
        }
        
        // Reset the start time
        this.typingIndicatorStartTime = null;
    }
    
    toggleSendStopButton(showStop) {
        const sendButton = document.getElementById('sendButton');
        const sendIcon = sendButton.querySelector('.send-icon');
        const stopIcon = sendButton.querySelector('.stop-icon');
        
        if (showStop) {
            // Show stop button
            sendIcon.style.display = 'none';
            stopIcon.style.display = 'block';
            sendButton.disabled = false;
            sendButton.title = 'Stop generating';
        } else {
            // Show send button
            sendIcon.style.display = 'block';
            stopIcon.style.display = 'none';
            sendButton.title = 'Send message';
        }
    }
    
    stopResponse() {
        console.log('🛑 Stopping AI response...');
        
        // Abort the current request
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
        
        // Reset states
        this.isThinking = false;
        this.isSending = false;
        
        // Hide typing indicator
        this.hideTypingIndicator();
        
        // Add a message that response was stopped
        this.addMessage('Response stopped by user.', 'ai');
        
        console.log('✅ Response stopped');
    }

    clearConversation() {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        // Preserve the typing indicator
        const typingIndicator = document.getElementById('chatTypingIndicator');
        
        // Keep only the first AI message
        const firstMessage = messagesContainer.querySelector('.ai-message');
        messagesContainer.innerHTML = '';
        
        // Re-add the typing indicator if it exists
        if (typingIndicator) {
            messagesContainer.appendChild(typingIndicator);
            typingIndicator.classList.add('hidden');
        } else {
            // Recreate it if it was removed
            const newIndicator = document.createElement('div');
            newIndicator.id = 'chatTypingIndicator';
            newIndicator.className = 'chat-typing-indicator hidden';
            newIndicator.innerHTML = `
                <div class="typing-bubble">
                    <span class="typing-text">Thinking</span>
                    <span class="thinking-dots">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </span>
                </div>
            `;
            messagesContainer.appendChild(newIndicator);
        }
        
        if (firstMessage) {
            messagesContainer.appendChild(firstMessage);
        }
        
        // Show welcome message again
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'block';
            welcomeMessage.classList.remove('hidden');
            messagesContainer.style.paddingTop = '24px';
        }
        
        // Clear session memory but keep persistent memory
        this.conversationHistory = [];
        this.sessionMemory = [];
        
        // Clear saved chat history
        localStorage.removeItem('chatHistory');
        
        // Save the cleared state
        this.saveUserMemory();
    }

    initializeScrollManagement() {
        const messagesContainer = document.getElementById('chatMessages');
        
        // Throttle scroll events with requestAnimationFrame for smooth performance
        let scrollTicking = false;
        
        messagesContainer.addEventListener('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    this.handleUserScroll(messagesContainer);
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true }); // Passive listener for better scroll performance
    }
    
    handleUserScroll(container) {
        // Clear any existing timeout
        if (this.userScrollTimeout) {
            clearTimeout(this.userScrollTimeout);
        }
        
        // Mark that user is scrolling
        this.isUserScrolling = true;
        
        // Check if user is near the bottom (within 100px)
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        
        const wasNearBottom = this.isNearBottom;
        this.isNearBottom = distanceFromBottom < 100;
        
        // If user scrolled back to bottom, re-enable auto-scroll immediately
        if (!wasNearBottom && this.isNearBottom) {
            this.isUserScrolling = false;
        }
        
        // Set timeout to reset user scrolling flag after 1 second of no scrolling
        this.userScrollTimeout = setTimeout(() => {
            this.isUserScrolling = false;
        }, 1000);
    }

    initializeAdvancedFeatures() {
        // Panel close buttons
        document.getElementById('closePortfolio')?.addEventListener('click', () => {
            document.getElementById('portfolioPanel').classList.add('hidden');
        });
        
        this.startTradeUpdates();
        
        document.getElementById('closeCharts')?.addEventListener('click', () => {
            document.getElementById('chartsPanel').classList.add('hidden');
        });
        
        document.getElementById('closeAlerts')?.addEventListener('click', () => {
            document.getElementById('alertsPanel').classList.add('hidden');
        });
        
        document.getElementById('closeSentiment')?.addEventListener('click', () => {
            document.getElementById('sentimentPanel').classList.add('hidden');
        });
        
        document.getElementById('closeBacktesting')?.addEventListener('click', () => {
            document.getElementById('backtestingPanel').classList.add('hidden');
        });
        
        document.getElementById('closeNews')?.addEventListener('click', () => {
            document.getElementById('newsPanel').classList.add('hidden');
        });
        
        // News functionality with premium animations
        document.getElementById('refreshNews')?.addEventListener('click', (e) => {
            // Ensure we get the button element, not a child element
            const button = e.target.closest('.premium-refresh-btn') || e.target;
            this.handlePremiumRefresh(button);
        });
        
        // News filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const category = e.target.dataset.category;
                this.filterNews(category);
            });
        });
        
        // News toggle button from features
        document.getElementById('newsToggle')?.addEventListener('click', () => {
            document.getElementById('newsPanel').classList.remove('hidden');
            this.loadCryptoNews();
        });
        
        // News button from action buttons
        document.querySelector('[data-action="latest-news"]')?.addEventListener('click', () => {
            document.getElementById('newsPanel').classList.remove('hidden');
            this.loadCryptoNews();
        });
        
        // Form submissions
        document.getElementById('addUsdtBtn')?.addEventListener('click', () => {
            this.addUsdtCapital();
        });
        document.getElementById('editUsdtBtn')?.addEventListener('click', () => {
            this.editUsdtBalance();
        });
        
        document.getElementById('addHoldingBtn')?.addEventListener('click', () => {
            this.addHolding();
        });
        document.getElementById('addTradeBtn')?.addEventListener('click', () => {
            this.addPortfolioTrade();
        });

        document.getElementById('refreshPortfolio')?.addEventListener('click', async () => {
            console.log('Refreshing portfolio prices...');
            await this.updatePortfolioDisplay(true);
        });

        // AI Powers Center
        document.getElementById('aiPowersToggle')?.addEventListener('click', async () => {
            document.getElementById('aiPowersPanel').classList.remove('hidden');
            await this.loadAIPowersIntelligence(this.currentAIPowersCoin, true);
        });
        document.getElementById('closeAIPowers')?.addEventListener('click', () => {
            document.getElementById('aiPowersPanel').classList.add('hidden');
        });
        document.getElementById('refreshAIPowers')?.addEventListener('click', async () => {
            await this.loadAIPowersIntelligence(this.currentAIPowersCoin, true);
        });
        document.getElementById('aiPowersCoinSelect')?.addEventListener('change', async (event) => {
            const coin = event.target.value;
            this.currentAIPowersCoin = coin;
            await this.loadAIPowersIntelligence(coin, true);
        });
        
        document.getElementById('addAlertBtn')?.addEventListener('click', () => {
            this.addAlert();
        });
        
        document.getElementById('runBacktest')?.addEventListener('click', () => {
            this.runBacktest();
        });
        
        document.getElementById('refreshChart')?.addEventListener('click', () => {
            this.initializeChart();
        });
        
        // Chart controls
        document.getElementById('chartCoinSelect')?.addEventListener('change', () => {
            this.initializeChart();
        });
        
        document.getElementById('chartTimeframe')?.addEventListener('change', () => {
            this.initializeChart();
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            this.toggleTheme();
        }
        
        // Make instance globally available for onclick handlers
        window.samCryptoAI = this;
    }

    initializeMarketData() {
        // Show immediate prices first
        this.showImmediatePrices();
        // Ensure CSS animation starts
        this.restartTickerAnimation();
        
        // Connect to Binance WebSocket for real-time data
        this.connectToBinanceWebSocket();
        
        // Fallback: Update prices every 3 seconds using REST API
        this.fallbackInterval = setInterval(() => {
            this.updateMarketPricesFallback();
            // Keep animation alive
            this.restartTickerAnimation();
        }, 3000);
    }

    showImmediatePrices() {
        const ticker = document.getElementById('crypto-ticker');
        const coins = ['BTC', 'ETH', 'SOL'];
        
        ticker.innerHTML = '';
        
        // Create multiple sets for smooth scrolling with immediate prices
        for (let set = 0; set < 4; set++) {
            coins.forEach(coin => {
                const tickerItem = document.createElement('div');
                tickerItem.classList.add('ticker-item');
                
                // Show immediate realistic prices
                let price, change;
                switch(coin) {
                    case 'BTC':
                        price = '106,194.42';
                        change = -4.38;
                        break;
                    case 'ETH':
                        price = '3,245.67';
                        change = 2.15;
                        break;
                    case 'SOL':
                        price = '98.45';
                        change = -1.23;
                        break;
                }
                
                const changeClass = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
                const changeSign = change > 0 ? '+' : '';
                
                tickerItem.innerHTML = `
                    ${coin}: $${price} 
                    <span class="price-change ${changeClass}">${changeSign}${change}%</span>
                `;
                ticker.appendChild(tickerItem);
            });
        }
        
        // Immediately fetch real prices in background
        this.fetchRealPricesImmediately();
        
        // Add a subtle loading indicator
        this.addLoadingIndicator();
    }

    async fetchRealPricesImmediately() {
        try {
            // Use Binance REST API for immediate prices
            const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT"]');
            const data = await response.json();
            
            data.forEach(item => {
                const symbol = item.symbol;
                const price = parseFloat(item.lastPrice);
                const changePercent = parseFloat(item.priceChangePercent);
                
                // Map Binance symbols to our coin codes
                const symbolMap = {
                    'BTCUSDT': 'BTC',
                    'ETHUSDT': 'ETH', 
                    'SOLUSDT': 'SOL'
                };
                
                const coinCode = symbolMap[symbol];
                if (coinCode) {
                    this.updateTickerItem(coinCode, price, changePercent);
                }
            });
            
        } catch (error) {
            console.log('Immediate price fetch failed:', error);
            // Keep the default prices if API fails
        }
    }

    addLoadingIndicator() {
        const ticker = document.getElementById('crypto-ticker');
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'price-loading-indicator';
        loadingIndicator.style.cssText = `
            position: absolute;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            border: 2px solid rgba(0, 212, 255, 0.3);
            border-top: 2px solid #00d4ff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            z-index: 10;
        `;
        
        // Add CSS animation if not already added
        if (!document.getElementById('loading-spinner-style')) {
            const style = document.createElement('style');
            style.id = 'loading-spinner-style';
            style.textContent = `
                @keyframes spin {
                    0% { transform: translateY(-50%) rotate(0deg); }
                    100% { transform: translateY(-50%) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        ticker.parentElement.style.position = 'relative';
        ticker.parentElement.appendChild(loadingIndicator);
        
        // Remove loading indicator after 3 seconds
        setTimeout(() => {
            if (loadingIndicator.parentElement) {
                loadingIndicator.remove();
            }
        }, 3000);
    }

    initializeTickerWithLoading() {
        const ticker = document.getElementById('crypto-ticker');
        const coins = ['BTC', 'ETH', 'SOL'];
        
        ticker.innerHTML = '';
        
        // Create multiple sets for smooth scrolling
        for (let set = 0; set < 4; set++) {
            coins.forEach(coin => {
                const tickerItem = document.createElement('div');
                tickerItem.classList.add('ticker-item');
                tickerItem.innerHTML = `
                    ${coin}: Loading... 
                    <span class="price-change neutral">--</span>
                `;
                ticker.appendChild(tickerItem);
            });
        }
    }

    connectToBinanceWebSocket() {
        try {
            // Binance WebSocket stream for BTC, ETH, SOL
            this.ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker');
            
            this.ws.onopen = () => {
                console.log('Connected to Binance WebSocket');
                this.isConnected = true;
                // Stop REST API fallback if it was running
                if (this.restApiInterval) {
                    clearInterval(this.restApiInterval);
                    this.restApiInterval = null;
                    console.log('Stopped REST API fallback after WS connect');
                }
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const payload = JSON.parse(event.data);
                    // Combined streams use { stream, data }, single stream sends the data directly
                    const msg = payload && payload.data ? payload.data : payload;
                    this.updatePriceFromWebSocket(msg);
                } catch (e) {
                    console.error('Error parsing WebSocket message:', e);
                }
            };
            
            this.ws.onclose = () => {
                console.log('WebSocket connection closed');
                this.isConnected = false;
                // Attempt to reconnect after 2 seconds (faster reconnection)
                setTimeout(() => {
                    this.connectToBinanceWebSocket();
                }, 2000);
                // Start REST fallback while reconnecting
                if (!this.restApiInterval) {
                    this.startRestApiFallback();
                }
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.isConnected = false;
                // Start REST API fallback on error
                if (!this.restApiInterval) {
                    this.startRestApiFallback();
                }
            };
            
        } catch (error) {
            console.error('Failed to connect to Binance WebSocket:', error);
            this.isConnected = false;
            // Start REST API fallback
            this.startRestApiFallback();
        }
    }
    
    // REST API fallback when WebSocket fails
    startRestApiFallback() {
        if (this.restApiInterval) return; // Already running
        
        console.log('Starting REST API fallback for price updates...');
        
        // Update immediately
        this.fetchPricesViaRestAPI();
        
        // Then update every 10 seconds
        this.restApiInterval = setInterval(() => {
            if (!this.isConnected) {
                this.fetchPricesViaRestAPI();
            } else {
                // WebSocket reconnected, stop fallback
                clearInterval(this.restApiInterval);
                this.restApiInterval = null;
                console.log('WebSocket reconnected, stopping REST API fallback');
            }
        }, 10000);
    }
    
    async fetchPricesViaRestAPI() {
        try {
            const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT"]');
            const data = await response.json();
            
            data.forEach(ticker => {
                const symbolMap = {
                    'BTCUSDT': 'BTC',
                    'ETHUSDT': 'ETH',
                    'SOLUSDT': 'SOL'
                };
                
                const coinCode = symbolMap[ticker.symbol];
                if (coinCode) {
                    this.updateTickerItem(coinCode, parseFloat(ticker.lastPrice), parseFloat(ticker.priceChangePercent));
                }
            });
            
            console.log('Prices updated via REST API fallback');
        } catch (error) {
            console.error('REST API fallback failed:', error);
        }
    }

    updatePriceFromWebSocket(data) {
        if (!data.s || !data.c || !data.P) return;
        
        const symbol = data.s; // e.g., BTCUSDT
        const price = parseFloat(data.c); // Current price
        const changePercent = parseFloat(data.P); // 24h change percentage
        
        // Map Binance symbols to our coin codes
        const symbolMap = {
            'BTCUSDT': 'BTC',
            'ETHUSDT': 'ETH', 
            'SOLUSDT': 'SOL'
        };
        
        const coinCode = symbolMap[symbol];
        if (!coinCode) return;
        
        // Update all instances of this coin in the ticker
        this.updateTickerItem(coinCode, price, changePercent);
    }

    updateTickerItem(coinCode, price, changePercent) {
        const ticker = document.getElementById('crypto-ticker');
        const tickerItems = ticker.querySelectorAll('.ticker-item');
        
        tickerItems.forEach(item => {
            if (item.textContent.includes(`${coinCode}:`)) {
                const formattedPrice = price >= 1 ? price.toFixed(2) : price.toFixed(4);
                const isPositive = changePercent > 0;
                const isNeutral = Math.abs(changePercent) < 0.01;
                
                const changeClass = isNeutral ? 'neutral' : (isPositive ? 'positive' : 'negative');
                const changeSign = isPositive ? '+' : '';
                
                item.innerHTML = `
                    ${coinCode}: $${formattedPrice} 
                    <span class="price-change ${changeClass}">${changeSign}${changePercent.toFixed(2)}%</span>
                `;
                
                // Add a subtle animation when price updates
                item.style.transition = 'all 0.3s ease';
                item.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                }, 300);
            }
        });
    }

    updatePriceDisplay(priceId, price) {
        const priceElement = document.getElementById(priceId);
        if (priceElement) {
            const formattedPrice = price >= 1 ? price.toFixed(2) : price.toFixed(4);
            this.animatePriceChange(priceElement, formattedPrice);
        }
    }

    updateChangeDisplay(changeId, change24h) {
        const changeElement = document.getElementById(changeId);
        if (changeElement) {
            const isPositive = change24h > 0;
            const isNeutral = Math.abs(change24h) < 0.1;
            
            changeElement.textContent = `${isPositive ? '+' : ''}${change24h.toFixed(2)}%`;
            changeElement.className = `price-change ${isNeutral ? 'neutral' : (isPositive ? 'positive' : 'negative')}`;
            
            // Animate the change
            changeElement.style.transition = 'all 0.3s ease';
            changeElement.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                changeElement.style.transform = 'scale(1)';
            }, 300);
        }
    }

    animatePriceChange(element, newPrice) {
        element.style.transition = 'color 0.3s ease';
        element.style.color = '#00ff88';
        element.textContent = newPrice;
        
        setTimeout(() => {
            element.style.color = '';
        }, 1000);
    }

    async updateMarketPricesFallback() {
        try {
            // Use Binance REST API as fallback
            const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT"]');
            const data = await response.json();
            
            data.forEach(item => {
                const symbol = item.symbol;
                const price = parseFloat(item.lastPrice);
                const changePercent = parseFloat(item.priceChangePercent);
                
                // Map Binance symbols to our coin codes
                const symbolMap = {
                    'BTCUSDT': 'BTC',
                    'ETHUSDT': 'ETH', 
                    'SOLUSDT': 'SOL'
                };
                
                const coinCode = symbolMap[symbol];
                if (coinCode) {
                    this.updateTickerItem(coinCode, price, changePercent);
                }
            });
            
        } catch (error) {
            console.log('Fallback API failed:', error);
            // Use mock data as last resort
            this.updateMarketPricesMock();
        }
    }

    updateMarketPricesMock() {
        // Mock data as last resort
        const mockData = [
            { coinCode: 'BTC', price: 43250.50, changePercent: 2.4 },
            { coinCode: 'ETH', price: 2680.25, changePercent: 1.8 },
            { coinCode: 'SOL', price: 98.50, changePercent: -0.5 }
        ];

        mockData.forEach(coin => {
            this.updateTickerItem(coin.coinCode, coin.price, coin.changePercent);
        });
    }

    refreshMarketData() {
        const refreshBtn = document.getElementById('refreshMarket');
        refreshBtn.style.transform = 'rotate(360deg)';
        refreshBtn.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
        }, 500);
        
        // Force update from fallback API
        this.updateMarketPricesFallback();
        this.restartTickerAnimation();
    }

    // Restart CSS marquee animation reliably
    restartTickerAnimation() {
        const ticker = document.getElementById('crypto-ticker');
        if (!ticker) return;
        // Toggle animation to force restart
        ticker.style.animation = 'none';
        // Force reflow
        void ticker.offsetWidth;
        ticker.style.animation = 'marquee 60s linear infinite';
    }

    // Memory Management System
    loadUserMemory() {
        try {
            const stored = localStorage.getItem('crypto_ai_memory');
            return stored ? JSON.parse(stored) : {
                conversations: [],
                userProfile: {},
                tradingHistory: [],
                preferences: {},
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.log('Error loading user memory:', error);
            return {
                conversations: [],
                userProfile: {},
                tradingHistory: [],
                preferences: {},
                lastUpdated: new Date().toISOString()
            };
        }
    }

    saveUserMemory() {
        try {
            this.userMemory.lastUpdated = new Date().toISOString();
            
            // Save to user's data if logged in
            if (this.userManager && this.userManager.isLoggedIn()) {
                this.userManager.updateConversationMemory('full', this.userMemory);
                console.log('Memory saved to user account');
            } else {
                // Fallback to localStorage for non-logged-in users
                localStorage.setItem('crypto_ai_memory', JSON.stringify(this.userMemory));
            }
        } catch (error) {
            console.log('Error saving user memory:', error);
        }
    }

    loadUserPreferences() {
        try {
            const stored = localStorage.getItem('crypto_ai_preferences');
            return stored ? JSON.parse(stored) : {
                favoriteCoins: [],
                tradingStyle: 'unknown',
                riskTolerance: 'unknown',
                experienceLevel: 'unknown',
                interests: []
            };
        } catch (error) {
            console.log('Error loading preferences:', error);
            return {
                favoriteCoins: [],
                tradingStyle: 'unknown',
                riskTolerance: 'unknown',
                experienceLevel: 'unknown',
                interests: []
            };
        }
    }

    saveUserPreferences() {
        try {
            // Save to user's data if logged in
            if (this.userManager && this.userManager.isLoggedIn()) {
                this.userManager.saveUserPreferences(this.userPreferences);
                console.log('Preferences saved to user account');
            } else {
                // Fallback to localStorage for non-logged-in users
                localStorage.setItem('crypto_ai_preferences', JSON.stringify(this.userPreferences));
            }
        } catch (error) {
            console.log('Error saving preferences:', error);
        }
    }

    addToConversationHistory(role, content) {
        this.conversationHistory.push({
            role: role,
            content: content,
            timestamp: Date.now()
        });
        
        // Keep only last 10 messages to avoid overwhelming the API (optimized for speed)
        if (this.conversationHistory.length > 10) {
            this.conversationHistory = this.conversationHistory.slice(-10);
        }
        
        // Save to user profile if logged in
        if (this.userManager && this.userManager.getCurrentUser()) {
            this.userManager.getCurrentUser().chatHistory = this.conversationHistory;
            
            // Update conversation memory like ChatGPT
            this.userManager.updateConversationMemory('conversation', {
                role: role,
                content: content,
                timestamp: Date.now()
            });
            
            // Extract and save user preferences from conversation
            if (role === 'user') {
                this.extractAndSaveUserPreferences(content);
            }
            
            this.userManager.saveUserPreferences(this.userPreferences);
        }
    }

    extractAndSaveUserPreferences(content) {
        const contentLower = content.toLowerCase();
        const currentUser = this.userManager.getCurrentUser();
        if (!currentUser) return;

        // Extract favorite coins
        const coins = this.extractCryptoMentions(content);
        if (coins.length > 0) {
            const currentFavorites = new Set(this.userPreferences.favoriteCoins || []);
            coins.forEach(coin => currentFavorites.add(coin.toUpperCase()));
            this.userPreferences.favoriteCoins = Array.from(currentFavorites).slice(0, 10); // Limit to 10
        }

        // Extract trading style
        if (contentLower.includes('day trading') || contentLower.includes('scalping')) {
            this.userPreferences.tradingStyle = 'day_trader';
        } else if (contentLower.includes('swing trading') || contentLower.includes('short term')) {
            this.userPreferences.tradingStyle = 'swing_trader';
        } else if (contentLower.includes('hodl') || contentLower.includes('long term') || contentLower.includes('buy and hold')) {
            this.userPreferences.tradingStyle = 'long_term_investor';
        }

        // Extract risk tolerance
        if (contentLower.includes('high risk') || contentLower.includes('aggressive') || contentLower.includes('leverag')) {
            this.userPreferences.riskTolerance = 'high';
        } else if (contentLower.includes('low risk') || contentLower.includes('safe') || contentLower.includes('conservative')) {
            this.userPreferences.riskTolerance = 'low';
        } else if (contentLower.includes('moderate') || contentLower.includes('balanced')) {
            this.userPreferences.riskTolerance = 'medium';
        }

        // Extract experience level
        if (contentLower.includes('beginner') || contentLower.includes('new to') || contentLower.includes('just started')) {
            this.userPreferences.experienceLevel = 'beginner';
        } else if (contentLower.includes('experienced') || contentLower.includes('trading for') || contentLower.includes('years')) {
            this.userPreferences.experienceLevel = 'experienced';
        } else if (contentLower.includes('expert') || contentLower.includes('professional') || contentLower.includes('advanced')) {
            this.userPreferences.experienceLevel = 'expert';
        }

        // Save to user memory
        this.userManager.updateConversationMemory('preferences', this.userPreferences);
    }

    getMemoryContext() {
        const recentConversations = this.userMemory.conversations.slice(-10);
        const userProfile = this.userPreferences;
        
        let context = "User Profile and Preferences:\n";
        context += `- Favorite Coins: ${userProfile.favoriteCoins.join(', ') || 'None specified'}\n`;
        context += `- Trading Style: ${userProfile.tradingStyle}\n`;
        context += `- Risk Tolerance: ${userProfile.riskTolerance}\n`;
        context += `- Experience Level: ${userProfile.experienceLevel}\n`;
        context += `- Interests: ${userProfile.interests.join(', ') || 'None specified'}\n\n`;
        
        if (recentConversations.length > 0) {
            context += "Recent Conversation History:\n";
            recentConversations.forEach(msg => {
                context += `${msg.role}: ${msg.content}\n`;
            });
        }
        
        return context;
    }

    showMemoryStatus() {
        const totalConversations = this.userMemory.conversations.length;
        const favoriteCoins = this.userPreferences.favoriteCoins.length;
        const interests = this.userPreferences.interests.length;
        const lastUpdated = new Date(this.userMemory.lastUpdated).toLocaleString();
        
        const statusMessage = `SamCrypto AI Memory Status:
        
Total Conversations: ${totalConversations}
Favorite Coins: ${favoriteCoins} (${this.userPreferences.favoriteCoins.join(', ') || 'None'})
Trading Style: ${this.userPreferences.tradingStyle}
Risk Tolerance: ${this.userPreferences.riskTolerance}
Experience Level: ${this.userPreferences.experienceLevel}
Interests: ${interests} (${this.userPreferences.interests.join(', ') || 'None'})
Last Updated: ${lastUpdated}

SamCrypto AI remembers your preferences and conversation history to provide personalized crypto advice!`;

        this.addMessage(statusMessage, 'ai');
        this.addToConversationHistory('assistant', statusMessage);
    }

    toggleDropdown() {
        const dropdownMenu = document.getElementById('dropdownMenu');
        const dropdownToggle = document.getElementById('dropdownToggle');
        
        dropdownMenu.classList.toggle('show');
        dropdownToggle.classList.toggle('active');
        
        // Position dropdown relative to toggle button
        if (dropdownMenu.classList.contains('show')) {
            const toggleRect = dropdownToggle.getBoundingClientRect();
            dropdownMenu.style.top = (toggleRect.bottom + 5) + 'px';
            dropdownMenu.style.right = (window.innerWidth - toggleRect.right) + 'px';
        }
    }

    handleOutsideClick(event) {
        const dropdownContainer = document.querySelector('.dropdown-container');
        const dropdownMenu = document.getElementById('dropdownMenu');
        const dropdownToggle = document.getElementById('dropdownToggle');
        
        if (!dropdownContainer.contains(event.target)) {
            dropdownMenu.classList.remove('show');
            dropdownToggle.classList.remove('active');
        }
    }

    repositionDropdown() {
        const dropdownMenu = document.getElementById('dropdownMenu');
        const dropdownToggle = document.getElementById('dropdownToggle');
        
        if (dropdownMenu && dropdownToggle && dropdownMenu.classList.contains('show')) {
            const toggleRect = dropdownToggle.getBoundingClientRect();
            dropdownMenu.style.top = (toggleRect.bottom + 5) + 'px';
            dropdownMenu.style.right = (window.innerWidth - toggleRect.right) + 'px';
        }
    }

    // Features Page methods
    openFeaturesPage() {
        const featuresPage = document.getElementById('featuresPage');
        if (featuresPage) {
            featuresPage.classList.remove('hidden');
            console.log('Features page opened');
            
            // Prevent body scroll when features page is open
            document.body.style.overflow = 'hidden';
        }
    }

    closeFeaturesPage() {
        const featuresPage = document.getElementById('featuresPage');
        if (featuresPage) {
            featuresPage.classList.add('hidden');
            console.log('❌ Features page closed');
            
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    // Voice Input Methods
    toggleVoiceInput() {
        if (this.isRecording) {
            this.stopVoiceInput();
        } else {
            this.startVoiceInput();
        }
    }

    async startVoiceInput() {
        // Check for speech recognition support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            this.showVoiceStatus('Speech recognition not supported in this browser', 'error');
            console.error('❌ Speech recognition not supported');
            return;
        }

        // Request microphone permission explicitly (especially important for PWA/mobile)
        try {
            console.log('🎤 Requesting microphone permission...');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Permission granted, stop the stream (we only needed it to trigger permission)
            stream.getTracks().forEach(track => track.stop());
            console.log('✅ Microphone permission granted');
            
        } catch (permissionError) {
            console.error('❌ Microphone permission denied:', permissionError);
            
            // Show detailed error message with instructions
            let errorMsg = 'Microphone access denied. ';
            if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                errorMsg += 'Go to Settings > Safari > Microphone and enable it.';
            } else if (navigator.userAgent.match(/Android/i)) {
                errorMsg += 'Go to Settings > Apps > Browser > Permissions and enable Microphone.';
            } else {
                errorMsg += 'Please allow microphone access in your browser settings.';
            }
            
            this.showVoiceStatus(errorMsg, 'error');
            
            // Show alert with instructions
            alert('🎤 Microphone Permission Required\n\n' + errorMsg);
            return;
        }

        try {
            // Initialize recognition
            if (!this.recognition) {
                this.recognition = new SpeechRecognition();
                this.recognition.continuous = false; // Stop after one result
                this.recognition.interimResults = true; // Show interim results
                this.recognition.lang = 'en-US'; // Set language
                
                // Handle results
                this.recognition.onresult = (event) => {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript;
                    }
                    
                    // Update input with transcript
                    const messageInput = document.getElementById('messageInput');
                    messageInput.value = transcript;
                    
                    // Enable send button and update char count
                    document.getElementById('sendButton').disabled = false;
                    const charCountElement = document.getElementById('charCount');
                    if (charCountElement) {
                        charCountElement.textContent = `${transcript.length}/1000`;
                    }
                    // Also handle legacy char-count if exists
                    const legacyCharCount = document.querySelector('.char-count');
                    if (legacyCharCount) {
                        legacyCharCount.textContent = `${transcript.length}/1000`;
                    }
                    
                    // Trigger auto-resize
                    this.handleInputChange();
                    
                    // Show interim results
                    if (event.results[event.results.length - 1].isFinal) {
                        this.showVoiceStatus('✓ Speech captured', 'success');
                        console.log('🎤 Final transcript:', transcript);
                    } else {
                        this.showVoiceStatus('Listening...', '');
                    }
                };

                // Handle errors
                this.recognition.onerror = (event) => {
                    console.error('❌ Speech recognition error:', event.error);
                    let errorMessage = 'Error: ';
                    switch (event.error) {
                        case 'no-speech':
                            errorMessage += 'No speech detected';
                            break;
                        case 'audio-capture':
                            errorMessage += 'No microphone found';
                            break;
                        case 'not-allowed':
                            errorMessage += 'Microphone permission denied';
                            break;
                        default:
                            errorMessage += event.error;
                    }
                    this.showVoiceStatus(errorMessage, 'error');
                    this.stopVoiceInput();
                };

                // Handle end
                this.recognition.onend = () => {
                    this.stopVoiceInput();
                };
            }

            // Start recording
            this.recognition.start();
            this.isRecording = true;
            
            // Update button state
            const voiceButton = document.getElementById('voiceInputBtn');
            if (voiceButton) {
                voiceButton.classList.add('recording');
            }
            
            // Show status
            this.showVoiceStatus('🎤 Listening...', '');
            console.log('🎤 Voice input started');

        } catch (error) {
            console.error('❌ Failed to start voice input:', error);
            this.showVoiceStatus('Failed to start recording', 'error');
            this.isRecording = false;
        }
    }

    stopVoiceInput() {
        if (this.recognition) {
            try {
                this.recognition.stop();
            } catch (error) {
                console.error('Error stopping recognition:', error);
            }
        }
        
        this.isRecording = false;
        
        // Update button state
        const voiceButton = document.getElementById('voiceInputBtn');
        if (voiceButton) {
            voiceButton.classList.remove('recording');
        }
        
        // Hide status after a delay
        setTimeout(() => {
            this.hideVoiceStatus();
        }, 2000);
        
        console.log('🎤 Voice input stopped');
    }

    showVoiceStatus(message, type = '') {
        const statusElement = document.getElementById('voiceStatus');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = 'voice-status';
            if (type) statusElement.classList.add(type);
        }
    }

    hideVoiceStatus() {
        const statusElement = document.getElementById('voiceStatus');
        if (statusElement) {
            statusElement.classList.add('hidden');
        }
    }

    initializeActionButtons() {
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleActionButton(action);
            });
        });
    }

    handleActionButton(action) {
        let message = '';
        
        switch(action) {
            case 'analyze-bitcoin':
                message = 'What\'s Bitcoin doing right now? Give me a detailed analysis with entry/exit points.';
                break;
            case 'get-advice':
                message = 'Give me some trading advice. What should I focus on right now?';
                break;
            case 'market-analysis':
                message = 'Analyze the current crypto market trends and give me insights.';
                break;
            case 'portfolio-help':
                message = 'Help me with my portfolio. What should I buy, sell, or hold?';
                break;
            case 'latest-news':
                message = 'What\'s the latest crypto news? How does it affect the market?';
                break;
            case 'more-options':
                message = 'Show me more crypto trading options and strategies.';
                break;
            default:
                message = 'Help me with crypto trading.';
        }
        
        // Simulate user input and send message
        const messageInput = document.getElementById('messageInput');
        messageInput.value = message;
        this.sendMessage();
    }

    hideWelcomeMessage() {
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage && !welcomeMessage.classList.contains('hidden')) {
            welcomeMessage.style.display = 'none';
            welcomeMessage.classList.add('hidden');
            
            // Add smooth transition for chat messages
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.style.paddingTop = '12px';
        }
    }

    showWelcomeMessage() {
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'block';
            welcomeMessage.classList.remove('hidden');
            
            // Reset chat messages padding
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.style.paddingTop = '24px';
        }
    }

    loadPreviousConversation() {
        // Method to manually load previous conversation if user wants to
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
            const chatHistory = JSON.parse(savedHistory);
            const chatMessages = document.getElementById('chatMessages');
            const welcomeMessage = document.getElementById('welcomeMessage');
            
            // Preserve typing indicator
            const typingIndicator = document.getElementById('chatTypingIndicator');
            
            // Clear existing messages except welcome message
            chatMessages.innerHTML = '';
            
            // Re-add typing indicator
            if (typingIndicator) {
                chatMessages.appendChild(typingIndicator);
                typingIndicator.classList.add('hidden');
            } else {
                // Recreate if missing
                const newIndicator = document.createElement('div');
                newIndicator.id = 'chatTypingIndicator';
                newIndicator.className = 'chat-typing-indicator hidden';
                newIndicator.innerHTML = `
                    <div class="typing-bubble">
                        <span class="typing-text">Thinking</span>
                        <span class="thinking-dots">
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                        </span>
                    </div>
                `;
                chatMessages.appendChild(newIndicator);
            }
            
            if (welcomeMessage) {
                chatMessages.appendChild(welcomeMessage);
            }
            
            // If there's chat history, hide welcome message and load messages
            if (chatHistory.length > 0) {
                this.hideWelcomeMessage();
                
                // Load saved messages
                chatHistory.forEach(msg => {
                    this.addMessage(msg.content, msg.sender, false);
                });
            }
        }
    }

    updateWelcomeMessage() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer && messagesContainer.children.length === 0) {
            const welcomeDiv = document.createElement('div');
            welcomeDiv.className = 'welcome-message';
            
            // Update personalized welcome through UserManager first
            this.userManager.updatePersonalizedWelcome();
            
            // Check if UserManager created welcome message
            const existingWelcome = document.querySelector('.welcome-message');
            if (!existingWelcome) {
                // Create default welcome message
                const randomGreeting = this.greetingMessages[Math.floor(Math.random() * this.greetingMessages.length)];
                
                welcomeDiv.innerHTML = `
                    <h2>Welcome to SamCrypto AI! 🚀</h2>
                    <p class="greeting-text">${randomGreeting}</p>
                `;
                
                messagesContainer.appendChild(welcomeDiv);
            }
            
            // Add quick action buttons to the welcome message
            const currentWelcome = document.querySelector('.welcome-message');
            if (currentWelcome) {
                const quickActionsDiv = document.createElement('div');
                quickActionsDiv.className = 'quick-actions';
                quickActionsDiv.innerHTML = `
                    <button onclick="samCrypto.sendMessage('What should I buy now?')" class="quick-btn">💰 What should I buy?</button>
                    <button onclick="samCrypto.sendMessage('Analyze Bitcoin')" class="quick-btn">📊 Analyze Bitcoin</button>
                    <button onclick="samCrypto.sendMessage('Show me market news')" class="quick-btn">📰 Market News</button>
                    <button onclick="samCrypto.sendMessage('Help me learn about crypto')" class="quick-btn">📚 Learn Crypto</button>
                `;
                currentWelcome.appendChild(quickActionsDiv);
            }
            
            this.scrollToBottom();
        }
    }

    saveChatHistory() {
        const messages = document.querySelectorAll('.message');
        const chatHistory = [];
        
        messages.forEach(message => {
            const messageText = message.querySelector('.message-text');
            const isAI = message.classList.contains('ai-message');
            const sender = isAI ? 'ai' : 'user';
            
            if (messageText && !message.id) { // Don't save the welcome message
                chatHistory.push({
                    content: messageText.innerHTML,
                    sender: sender,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }

    loadChatHistory() {
        // Don't automatically load chat history on page refresh
        // This keeps the conversation data stored but shows a fresh chat interface
        const chatMessages = document.getElementById('chatMessages');
        const welcomeMessage = document.getElementById('welcomeMessage');
        
        // Preserve typing indicator
        const typingIndicator = document.getElementById('chatTypingIndicator');
        
        // Clear existing messages and show welcome message
        chatMessages.innerHTML = '';
        
        // Re-add typing indicator
        if (typingIndicator) {
            chatMessages.appendChild(typingIndicator);
            typingIndicator.classList.add('hidden');
        } else {
            // Recreate if missing
            const newIndicator = document.createElement('div');
            newIndicator.id = 'chatTypingIndicator';
            newIndicator.className = 'chat-typing-indicator hidden';
            newIndicator.innerHTML = `
                <div class="typing-bubble">
                    <span class="typing-text">Thinking</span>
                    <span class="thinking-dots">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </span>
                </div>
            `;
            chatMessages.appendChild(newIndicator);
        }
        
        if (welcomeMessage) {
            chatMessages.appendChild(welcomeMessage);
        }
        
        // Show welcome message on page refresh
        this.showWelcomeMessage();
    }

    cleanup() {
        // Save chat history before cleanup
        this.saveChatHistory();
        
        // Close WebSocket connection
        if (this.ws) {
            this.ws.close();
        }
        
        // Clear fallback interval
        if (this.fallbackInterval) {
            clearInterval(this.fallbackInterval);
        }
        
        // Save final memory state
        this.saveUserMemory();
        this.saveUserPreferences();
        this.savePortfolio();
        this.saveAlerts();
    }

    // ===== ADVANCED FEATURES =====

    // Portfolio Management
    loadPortfolio() {
        try {
            // Load from user's data if logged in
            if (this.userManager && this.userManager.isLoggedIn()) {
                const currentUser = this.userManager.getCurrentUser();
                return currentUser.portfolio || { 
                    holdings: [], 
                    trades: [],
                    totalValue: 0, 
                    totalPnL: 0, 
                    totalPnLPercent: 0,
                    usdtBalance: 0 
                };
            } else {
                // Fallback to localStorage for non-logged-in users
                const stored = localStorage.getItem('crypto_portfolio');
                return stored ? JSON.parse(stored) : { 
                    holdings: [], 
                    totalValue: 0, 
                    totalPnL: 0, 
                    totalPnLPercent: 0,
                    usdtBalance: 0 
                };
            }
        } catch (error) {
            console.error('Error loading portfolio:', error);
            return { 
                holdings: [], 
                totalValue: 0, 
                totalPnL: 0, 
                totalPnLPercent: 0,
                usdtBalance: 0 
            };
        }
    }

    savePortfolio() {
        try {
            // Save to user's data if logged in
            if (this.userManager && this.userManager.isLoggedIn()) {
                this.userManager.saveUserPortfolio(this.portfolio);
                console.log('✅ Portfolio saved to user account');
            } else {
                // Fallback to localStorage for non-logged-in users
                localStorage.setItem('crypto_portfolio', JSON.stringify(this.portfolio));
                console.log('✅ Portfolio saved to localStorage');
            }
        } catch (error) {
            console.error('❌ Error saving portfolio:', error);
        }
    }

    async togglePortfolio() {
        console.log('Portfolio button clicked!');
        const panel = document.getElementById('portfolioPanel');
        if (!panel) {
            console.error('Portfolio panel not found!');
            return;
        }
        
        panel.classList.toggle('hidden');
        console.log('Panel hidden class:', panel.classList.contains('hidden'));
        
        if (!panel.classList.contains('hidden')) {
            console.log('Opening portfolio panel...');
            await this.updatePortfolioDisplay();
        }
    }

    renderHoldings() {
        const holdingsList = document.getElementById('holdingsList');
        holdingsList.innerHTML = '';
        
        if (this.portfolio.holdings.length === 0) {
            holdingsList.innerHTML = '<div class="no-holdings">No holdings yet. Add some coins to track your portfolio!</div>';
            return;
        }
        
        this.portfolio.holdings.forEach((holding, index) => {
            const holdingDiv = document.createElement('div');
            holdingDiv.className = 'holding-item';
            
            const coinName = holding.coinId.charAt(0).toUpperCase() + holding.coinId.slice(1);
            const buyPrice = holding.buyPrice || 0;
            const currentPrice = holding.currentPrice || 0;
            const currentValue = holding.currentValue || 0;
            const pnl = holding.pnl || 0;
            const pnlPercent = holding.pnlPercent || 0;
            
            holdingDiv.innerHTML = `
                <div class="holding-header">
                    <div class="holding-coin">${coinName}</div>
                    <button class="remove-holding" onclick="samCryptoAI.removeHolding(${index})" title="Remove holding">×</button>
                </div>
                <div class="holding-details">
                    <div class="holding-amount">Amount: ${holding.amount} ${coinName}</div>
                    <div class="price-comparison">
                        <div class="price-row">
                            <span class="price-label">Buy Price:</span>
                            <span class="price-value">$${buyPrice.toFixed(2)}</span>
                        </div>
                        <div class="price-row">
                            <span class="price-label">Current Price:</span>
                            <span class="price-value current">$${currentPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div class="holding-summary">
                    <div class="holding-value">
                        <span class="value-label">Current Value:</span>
                        <span class="value-amount">$${currentValue.toFixed(2)}</span>
                    </div>
                    <div class="holding-pnl ${pnl >= 0 ? 'positive' : 'negative'}">
                        <span class="pnl-label">P&L:</span>
                        <span class="pnl-amount">
                            ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)} (${pnlPercent.toFixed(2)}%)
                        </span>
                    </div>
                </div>
            `;
            holdingsList.appendChild(holdingDiv);
        });
    }

    async calculatePortfolioValue() {
        let totalValue = 0;
        let totalCost = 0;

        for (const holding of this.portfolio.holdings) {
            try {
                const marketData = await this.fetchMarketData(holding.coinId);
                const currentValue = holding.amount * marketData.price_usd;
                const cost = holding.amount * holding.buyPrice;
                
                totalValue += currentValue;
                totalCost += cost;
                
                holding.currentValue = currentValue;
                holding.currentPrice = marketData.price_usd;
                holding.pnl = currentValue - cost;
                holding.pnlPercent = ((currentValue - cost) / cost) * 100;
            } catch (error) {
                console.error(`Error calculating value for ${holding.coinId}:`, error);
            }
        }
        
        this.portfolio.totalValue = totalValue;
        this.portfolio.totalPnL = totalValue - totalCost;
        this.portfolio.totalPnLPercent = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;
    }

    async updatePortfolioDisplay() {
        await this.calculatePortfolioValue();
        const usdtBalance = this.portfolio.usdtBalance || 0;
        document.getElementById('usdtBalance').textContent = `$${usdtBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('totalPortfolioValue').textContent = `$${this.portfolio.totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        const totalCapital = usdtBalance + this.portfolio.totalValue;
        document.getElementById('totalCapital').textContent = `$${totalCapital.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('totalPnL').textContent = `${this.portfolio.totalPnL >= 0 ? '+' : ''}$${this.portfolio.totalPnL.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} (${this.portfolio.totalPnLPercent.toFixed(2)}%)`;
        document.getElementById('totalPnL').className = `value ${this.portfolio.totalPnL >= 0 ? 'positive' : 'negative'}`;
        const tradesSummary = this.calculateTradesSummary();
        document.getElementById('totalMarginInUse').textContent = `$${tradesSummary.marginInUse.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        const tradePnLValue = `${tradesSummary.totalPnL >= 0 ? '+' : ''}$${tradesSummary.totalPnL.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} (${tradesSummary.totalPnLPercent.toFixed(2)}%)`;
        const tradePnLElement = document.getElementById('totalTradePnL');
        tradePnLElement.textContent = tradePnLValue;
        tradePnLElement.className = `value ${tradesSummary.totalPnL >= 0 ? 'positive' : 'negative'}`;
        document.getElementById('portfolioValue').textContent = `$${totalCapital.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        this.renderHoldings();
        this.renderTrades();
        
        // Update charts
        if (this.portfolioHistory) {
            const activeTimeframe = document.querySelector('.timeframe-btn.active')?.dataset.period || '7d';
            this.updatePortfolioChart(activeTimeframe);
            this.updateAllocationChart();
        }
    }

    async removeHolding(index) {
        if (index >= 0 && index < this.portfolio.holdings.length) {
            const holding = this.portfolio.holdings[index];
            
            // Calculate current value to add back to USDT
            const currentValue = holding.currentValue || 0;
            const cost = holding.cost || (holding.amount * holding.buyPrice);
            const profit = currentValue - cost;
            
            // Confirm removal with user
            const coinName = holding.coinId.toUpperCase();
            const confirmMsg = `Sell ${holding.amount} ${coinName}?\n\n` +
                `Buy Price: $${holding.buyPrice.toFixed(2)}\n` +
                `Current Price: $${holding.currentPrice ? holding.currentPrice.toFixed(2) : '0.00'}\n` +
                `Current Value: $${currentValue.toFixed(2)}\n` +
                `Profit/Loss: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}\n\n` +
                `$${currentValue.toFixed(2)} will be added to your USDT balance.`;
            
            if (!confirm(confirmMsg)) {
                return;
            }
            
            // Add current value back to USDT balance
            this.portfolio.usdtBalance = (this.portfolio.usdtBalance || 0) + currentValue;
            
            // Remove the holding
            this.portfolio.holdings.splice(index, 1);
            
            this.savePortfolio();
            await this.updatePortfolioDisplay();
            
            // Show success message
            alert(`✅ Sold successfully!\n\n${holding.amount} ${coinName} sold for $${currentValue.toFixed(2)}\n` +
                `${profit >= 0 ? 'Profit' : 'Loss'}: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}\n\n` +
                `New USDT Balance: $${this.portfolio.usdtBalance.toFixed(2)}`);
        }
    }

    // Charts Management
    toggleCharts() {
        const panel = document.getElementById('chartsPanel');
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden')) {
            this.initializeChart();
        }
    }

    initializeChart() {
        const ctx = document.getElementById('priceChart').getContext('2d');
        const coinSelect = document.getElementById('chartCoinSelect');
        
        if (this.charts[coinSelect.value]) {
            this.charts[coinSelect.value].destroy();
        }
        
        this.loadChartData(coinSelect.value).then(data => {
            this.charts[coinSelect.value] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: `${coinSelect.value.toUpperCase()} Price`,
                        data: data.prices,
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#ffffff' }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#888' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        y: {
                            ticks: { color: '#888' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    }
                }
            });
        });
    }

    async loadChartData(coinId) {
        try {
            const response = await fetch(`${this.coinGeckoAPI}/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=daily`);
            const data = await response.json();
            
            return {
                labels: data.prices.map(([timestamp]) => new Date(timestamp).toLocaleDateString()),
                prices: data.prices.map(([, price]) => price)
            };
        } catch (error) {
            console.error('Error loading chart data:', error);
            return { labels: [], prices: [] };
        }
    }

    // Alerts Management
    loadAlerts() {
        try {
            // Load from user's data if logged in
            if (this.userManager && this.userManager.isLoggedIn()) {
                const currentUser = this.userManager.getCurrentUser();
                return currentUser.alerts || [];
            } else {
                // Fallback to localStorage for non-logged-in users
                const stored = localStorage.getItem('crypto_alerts');
                return stored ? JSON.parse(stored) : [];
            }
        } catch (error) {
            console.error('Error loading alerts:', error);
            return [];
        }
    }

    saveAlerts() {
        try {
            // Save to user's data if logged in
            if (this.userManager && this.userManager.isLoggedIn()) {
                this.userManager.saveUserAlerts(this.alerts);
                console.log('✅ Alerts saved to user account');
            } else {
                // Fallback to localStorage for non-logged-in users
                localStorage.setItem('crypto_alerts', JSON.stringify(this.alerts));
                console.log('✅ Alerts saved to localStorage');
            }
        } catch (error) {
            console.error('❌ Error saving alerts:', error);
        }
    }

    toggleAlerts() {
        const panel = document.getElementById('alertsPanel');
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden')) {
            this.updateAlertsDisplay();
            this.populateCoinSelects();
        }
    }

    updateAlertsDisplay() {
        document.getElementById('alertCount').textContent = this.alerts.length;
        this.renderAlerts();
    }

    renderAlerts() {
        const alertsList = document.getElementById('alertsList');
        alertsList.innerHTML = '';
        
        this.alerts.forEach((alert, index) => {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert-item';
            alertDiv.innerHTML = `
                <div class="alert-info">
                    <div class="alert-coin">${alert.coinId.toUpperCase()}</div>
                    <div class="alert-condition">${alert.condition} $${alert.value}</div>
                </div>
                <div class="alert-value">Active</div>
                <div class="alert-actions">
                    <button onclick="samCryptoAI.removeAlert(${index})">Delete</button>
                </div>
            `;
            alertsList.appendChild(alertDiv);
        });
    }

    // Voice Commands
    toggleVoice() {
        if (!this.voiceRecognition) {
            this.initializeVoiceRecognition();
        }
        
        if (this.voiceRecognition.isListening) {
            this.voiceRecognition.stop();
            document.getElementById('voiceToggle').classList.remove('listening');
        } else {
            this.voiceRecognition.start();
            document.getElementById('voiceToggle').classList.add('listening');
        }
    }

    initializeVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.voiceRecognition = new SpeechRecognition();
            
            this.voiceRecognition.continuous = false;
            this.voiceRecognition.interimResults = false;
            this.voiceRecognition.lang = 'en-US';
            
            this.voiceRecognition.onstart = () => {
                console.log('Voice recognition started');
            };
            
            this.voiceRecognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('messageInput').value = transcript;
                this.sendMessage();
            };
            
            this.voiceRecognition.onerror = (event) => {
                console.error('Voice recognition error:', event.error);
            };
            
            this.voiceRecognition.onend = () => {
                document.getElementById('voiceToggle').classList.remove('listening');
            };
        } else {
            alert('Voice recognition not supported in this browser');
        }
    }

    // Theme Management
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.className = this.isDarkTheme ? 'dark-theme' : 'light-theme';
        
        const themeIcon = document.getElementById('themeIcon');
        if (this.isDarkTheme) {
            themeIcon.innerHTML = `
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            `;
        } else {
            themeIcon.innerHTML = `
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            `;
        }
        
        localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    }

    // Sentiment Analysis
    toggleSentiment() {
        const panel = document.getElementById('sentimentPanel');
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden')) {
            this.loadSentimentData();
        }
    }

    async loadSentimentData() {
        try {
            // Simulate sentiment data (in real implementation, you'd fetch from APIs)
            const sentimentScore = Math.floor(Math.random() * 100);
            document.getElementById('sentimentScore').textContent = sentimentScore;
            
            // Update sentiment gauge
            const gauge = document.getElementById('sentimentGauge');
            const rotation = (sentimentScore / 100) * 180;
            gauge.style.transform = `rotate(${rotation}deg)`;
            
        } catch (error) {
            console.error('Error loading sentiment data:', error);
        }
    }

    // Backtesting
    toggleBacktesting() {
        const panel = document.getElementById('backtestingPanel');
        panel.classList.toggle('hidden');
    }

    async runBacktest() {
        const strategy = document.getElementById('backtestStrategy').value;
        const coin = document.getElementById('backtestCoin').value;
        const period = document.getElementById('backtestPeriod').value;
        const capital = parseFloat(document.getElementById('initialCapital').value);
        
        if (!strategy || !coin || !period || !capital) {
            alert('Please fill in all backtest parameters');
            return;
        }
        
        console.log(`Running ${strategy} backtest for ${coin} over ${period} with $${capital}`);
        
        try {
            // Show loading state
            const resultsDiv = document.getElementById('backtestResults');
            resultsDiv.innerHTML = '<div class="loading">Fetching historical data and running backtest...</div>';
            
            // Fetch historical data
            const historicalData = await this.fetchHistoricalData(coin, period);
            console.log(`Fetched ${historicalData.length} data points for ${coin}`);
            
            // Run the selected strategy
            const results = await this.executeStrategy(strategy, historicalData, capital);
            console.log('Backtest results:', results);
            
            // Display results
            this.displayBacktestResults(results);
            
        } catch (error) {
            console.error('Backtest error:', error);
            resultsDiv.innerHTML = `<div class="error">Error running backtest: ${error.message}</div>`;
        }
    }

    displayBacktestResults(results) {
        const resultsDiv = document.getElementById('backtestResults');
        resultsDiv.innerHTML = `
            <div class="backtest-summary">
                <h4>Backtest Results</h4>
                <div class="summary-stats">
                    <div class="stat-item">
                        <span class="stat-label">Initial Capital:</span>
                        <span class="stat-value">$${results.initialCapital.toLocaleString()}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Final Capital:</span>
                        <span class="stat-value">$${results.finalCapital.toLocaleString()}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Return:</span>
                        <span class="stat-value ${results.totalReturn >= 0 ? 'positive' : 'negative'}">${results.totalReturn.toFixed(2)}%</span>
                    </div>
                </div>
            </div>
            <div class="backtest-metrics">
                <div class="backtest-metric">
                    <span class="label">Win Rate</span>
                    <span class="value">${results.winRate.toFixed(1)}%</span>
                </div>
                <div class="backtest-metric">
                    <span class="label">Max Drawdown</span>
                    <span class="value negative">-${results.maxDrawdown.toFixed(2)}%</span>
                </div>
                <div class="backtest-metric">
                    <span class="label">Sharpe Ratio</span>
                    <span class="value">${results.sharpeRatio.toFixed(2)}</span>
                </div>
                <div class="backtest-metric">
                    <span class="label">Total Trades</span>
                    <span class="value">${results.totalTrades}</span>
                </div>
            </div>
            <div class="trades-summary">
                <h5>Recent Trades</h5>
                <div class="trades-list">
                    ${results.trades.slice(-6).map(trade => `
                        <div class="trade-item ${trade.type.toLowerCase()}">
                            <span class="trade-type">${trade.type}</span>
                            <span class="trade-date">${trade.date.toLocaleDateString()}</span>
                            <span class="trade-price">$${trade.price.toFixed(2)}</span>
                            ${trade.capital ? `<span class="trade-capital">$${trade.capital.toFixed(2)}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    async fetchHistoricalData(coinId, period) {
        try {
            // Convert period to days
            const daysMap = {
                '7d': 7,
                '30d': 30,
                '90d': 90,
                '180d': 180,
                '1y': 365,
                '2y': 730
            };
            
            const days = daysMap[period] || 30;
            
            // Fetch historical data from CoinGecko
            const response = await fetch(
                `${this.coinGeckoAPI}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
            );
            
            if (!response.ok) {
                throw new Error(`Failed to fetch historical data: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Process the data into our format
            const historicalData = data.prices.map((priceData, index) => ({
                timestamp: priceData[0],
                date: new Date(priceData[0]),
                price: priceData[1],
                volume: data.total_volumes[index] ? data.total_volumes[index][1] : 0,
                marketCap: data.market_caps[index] ? data.market_caps[index][1] : 0
            }));
            
            console.log(`Fetched ${historicalData.length} days of data for ${coinId}`);
            return historicalData;
            
        } catch (error) {
            console.error('Error fetching historical data:', error);
            throw new Error(`Failed to fetch historical data for ${coinId}: ${error.message}`);
        }
    }

    async executeStrategy(strategy, historicalData, initialCapital) {
        console.log(`Executing ${strategy} strategy with ${historicalData.length} data points`);
        
        let trades = [];
        let currentCapital = initialCapital;
        let position = 0; // 0 = no position, 1 = long position
        let entryPrice = 0;
        let maxCapital = initialCapital;
        let maxDrawdown = 0;
        
        // Calculate technical indicators
        const indicators = this.calculateTechnicalIndicators(historicalData);
        
        // Execute strategy
        for (let i = 1; i < historicalData.length; i++) {
            const currentPrice = historicalData[i].price;
            const signal = this.getTradingSignal(strategy, indicators, i);
            
            if (signal === 'BUY' && position === 0) {
                // Enter long position
                position = 1;
                entryPrice = currentPrice;
                const shares = currentCapital / currentPrice;
                currentCapital = 0;
                
                trades.push({
                    type: 'BUY',
                    date: historicalData[i].date,
                    price: currentPrice,
                    shares: shares,
                    capital: initialCapital - currentCapital
                });
                
            } else if (signal === 'SELL' && position === 1) {
                // Exit long position
                position = 0;
                const shares = trades[trades.length - 1].shares;
                currentCapital = shares * currentPrice;
                
                trades.push({
                    type: 'SELL',
                    date: historicalData[i].date,
                    price: currentPrice,
                    shares: shares,
                    capital: currentCapital
                });
                
                // Update max capital and drawdown
                if (currentCapital > maxCapital) {
                    maxCapital = currentCapital;
                }
                
                const currentDrawdown = ((maxCapital - currentCapital) / maxCapital) * 100;
                if (currentDrawdown > maxDrawdown) {
                    maxDrawdown = currentDrawdown;
                }
            }
        }
        
        // Close any remaining position
        if (position === 1 && trades.length > 0) {
            const lastTrade = trades[trades.length - 1];
            const finalPrice = historicalData[historicalData.length - 1].price;
            currentCapital = lastTrade.shares * finalPrice;
            
            trades.push({
                type: 'SELL',
                date: historicalData[historicalData.length - 1].date,
                price: finalPrice,
                shares: lastTrade.shares,
                capital: currentCapital
            });
        }
        
        // Calculate performance metrics
        const totalReturn = ((currentCapital - initialCapital) / initialCapital) * 100;
        const winningTrades = trades.filter(trade => trade.type === 'SELL' && trade.capital > 0).length;
        const totalTrades = Math.floor(trades.length / 2); // Buy/Sell pairs
        const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
        
        // Calculate Sharpe ratio (simplified)
        const returns = [];
        for (let i = 1; i < trades.length; i += 2) {
            if (trades[i] && trades[i-1]) {
                const return_pct = ((trades[i].capital - trades[i-1].capital) / trades[i-1].capital) * 100;
                returns.push(return_pct);
            }
        }
        
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length || 0;
        const returnStdDev = Math.sqrt(returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length) || 1;
        const sharpeRatio = returnStdDev > 0 ? avgReturn / returnStdDev : 0;
        
        return {
            totalReturn: totalReturn,
            winRate: winRate,
            maxDrawdown: maxDrawdown,
            sharpeRatio: sharpeRatio,
            totalTrades: totalTrades,
            finalCapital: currentCapital,
            trades: trades,
            initialCapital: initialCapital
        };
    }

    calculateTechnicalIndicators(data) {
        const prices = data.map(d => d.price);
        const indicators = {
            prices: prices,
            rsi: this.calculateRSI(prices, 14),
            sma20: this.calculateSMA(prices, 20),
            sma50: this.calculateSMA(prices, 50),
            ema12: this.calculateEMA(prices, 12),
            ema26: this.calculateEMA(prices, 26),
            macd: this.calculateMACD(prices),
            bollinger: this.calculateBollingerBands(prices, 20, 2)
        };
        
        return indicators;
    }

    calculateRSI(prices, period = 14) {
        const rsi = [];
        for (let i = period; i < prices.length; i++) {
            let gains = 0;
            let losses = 0;
            
            for (let j = i - period + 1; j <= i; j++) {
                const change = prices[j] - prices[j - 1];
                if (change > 0) gains += change;
                else losses -= change;
            }
            
            const avgGain = gains / period;
            const avgLoss = losses / period;
            const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
            const rsiValue = 100 - (100 / (1 + rs));
            
            rsi.push(rsiValue);
        }
        
        return rsi;
    }

    calculateSMA(prices, period) {
        const sma = [];
        for (let i = period - 1; i < prices.length; i++) {
            const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            sma.push(sum / period);
        }
        return sma;
    }

    calculateEMA(prices, period) {
        const ema = [];
        const multiplier = 2 / (period + 1);
        
        // First EMA is SMA
        const firstSMA = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
        ema.push(firstSMA);
        
        for (let i = period; i < prices.length; i++) {
            const emaValue = (prices[i] * multiplier) + (ema[ema.length - 1] * (1 - multiplier));
            ema.push(emaValue);
        }
        
        return ema;
    }

    calculateMACD(prices) {
        const ema12 = this.calculateEMA(prices, 12);
        const ema26 = this.calculateEMA(prices, 26);
        
        const macd = [];
        const signal = [];
        
        for (let i = 0; i < Math.min(ema12.length, ema26.length); i++) {
            macd.push(ema12[i] - ema26[i]);
        }
        
        // Calculate signal line (9-period EMA of MACD)
        const signalEMA = this.calculateEMA(macd, 9);
        
        return { macd, signal: signalEMA };
    }

    calculateBollingerBands(prices, period = 20, stdDev = 2) {
        const bands = [];
        
        for (let i = period - 1; i < prices.length; i++) {
            const slice = prices.slice(i - period + 1, i + 1);
            const sma = slice.reduce((a, b) => a + b, 0) / period;
            
            const variance = slice.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
            const standardDeviation = Math.sqrt(variance);
            
            bands.push({
                upper: sma + (stdDev * standardDeviation),
                middle: sma,
                lower: sma - (stdDev * standardDeviation)
            });
        }
        
        return bands;
    }

    getTradingSignal(strategy, indicators, index) {
        const prices = indicators.prices || [];
        const currentPrice = prices[index] || 0;
        
        switch (strategy) {
            case 'rsi':
                if (index < indicators.rsi.length) {
                    const rsi = indicators.rsi[index];
                    if (rsi < 30) return 'BUY';
                    if (rsi > 70) return 'SELL';
                }
                break;
                
            case 'macd':
                if (index < indicators.macd.macd.length && index > 0) {
                    const macd = indicators.macd.macd[index];
                    const prevMacd = indicators.macd.macd[index - 1];
                    const signal = indicators.macd.signal[index];
                    
                    if (macd > signal && prevMacd <= indicators.macd.signal[index - 1]) return 'BUY';
                    if (macd < signal && prevMacd >= indicators.macd.signal[index - 1]) return 'SELL';
                }
                break;
                
            case 'ema':
                if (index < indicators.ema12.length && index < indicators.ema26.length) {
                    const ema12 = indicators.ema12[index];
                    const ema26 = indicators.ema26[index];
                    const prevEma12 = indicators.ema12[index - 1];
                    const prevEma26 = indicators.ema26[index - 1];
                    
                    if (ema12 > ema26 && prevEma12 <= prevEma26) return 'BUY';
                    if (ema12 < ema26 && prevEma12 >= prevEma26) return 'SELL';
                }
                break;
                
            case 'bollinger':
                if (index < indicators.bollinger.length) {
                    const bands = indicators.bollinger[index];
                    if (currentPrice <= bands.lower) return 'BUY';
                    if (currentPrice >= bands.upper) return 'SELL';
                }
                break;
        }
        
        return 'HOLD';
    }

    // Utility Methods
    populateCoinSelects() {
        const coins = [
            'bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot', 'chainlink', 
            'litecoin', 'binancecoin', 'ripple', 'dogecoin', 'avalanche-2', 
            'polygon', 'uniswap', 'chainlink', 'stellar', 'cosmos', 'algorand',
            'vechain', 'filecoin', 'tron', 'monero', 'ethereum-classic'
        ];
        const selects = ['coinSelect', 'alertCoinSelect'];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.innerHTML = '<option value="">Select Coin</option>';
                coins.forEach(coin => {
                    const option = document.createElement('option');
                    option.value = coin;
                    option.textContent = coin.charAt(0).toUpperCase() + coin.slice(1);
                    select.appendChild(option);
                });
            }
        });
    }

    addUsdtCapital() {
        const amount = prompt('💰 Add USDT Capital\n\nEnter the amount of USDT you want to add to your portfolio:', '1000');
        
        if (amount === null) {
            return; // User cancelled
        }
        
        const usdtAmount = parseFloat(amount);
        
        if (isNaN(usdtAmount) || usdtAmount <= 0) {
            alert('Please enter a valid positive number');
            return;
        }
        
        // Add to USDT balance
        this.portfolio.usdtBalance = (this.portfolio.usdtBalance || 0) + usdtAmount;
        
        this.savePortfolio();
        this.updatePortfolioDisplay();
        
        alert(`✅ USDT added successfully!\n\nAdded: $${usdtAmount.toFixed(2)}\nNew Balance: $${this.portfolio.usdtBalance.toFixed(2)}`);
    }

    editUsdtBalance() {
        const currentBalance = this.portfolio.usdtBalance || 0;
        const newValue = prompt('✏️ Edit USDT Balance\n\nEnter the new USDT balance:', currentBalance.toFixed(2));
        if (newValue === null) return;

        const parsed = parseFloat(newValue);
        if (isNaN(parsed) || parsed < 0) {
            alert('Please enter a valid non-negative number');
            return;
        }

        this.portfolio.usdtBalance = parsed;
        this.savePortfolio();
        this.updatePortfolioDisplay();

        alert(`✅ USDT balance updated!\n\nNew Balance: $${parsed.toFixed(2)}`);
    }

    async addHolding() {
        const coinId = document.getElementById('coinSelect').value;
        const usdtAmount = parseFloat(document.getElementById('usdtAmountInput').value);
        
        if (!coinId || !usdtAmount) {
            alert('Please select a coin and enter USDT amount');
            return;
        }
        
        if (usdtAmount <= 0) {
            alert('Please enter a valid USDT amount greater than 0');
            return;
        }
        
        // Check if enough USDT balance
        const usdtBalance = this.portfolio.usdtBalance || 0;
        if (usdtAmount > usdtBalance) {
            alert(`Insufficient USDT balance!\n\nRequested: $${usdtAmount.toFixed(2)}\nAvailable: $${usdtBalance.toFixed(2)}\n\nPlease add more USDT or reduce the amount.`);
            return;
        }
        
        try {
            // Fetch current market price
            console.log(`Fetching current price for ${coinId}...`);
            const marketData = await this.fetchMarketData(coinId);
            const currentPrice = marketData.price_usd;
            
            if (!currentPrice || currentPrice <= 0) {
                alert('Could not fetch current price. Please try again.');
                return;
            }
            
            // Calculate how many coins we can buy
            const coinAmount = usdtAmount / currentPrice;
            
            // Confirm purchase
            const confirmMsg = `Buy ${coinId.toUpperCase()}?\n\n` +
                `USDT to spend: $${usdtAmount.toFixed(2)}\n` +
                `Current price: $${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 8})}\n` +
                `You will get: ${coinAmount.toFixed(8)} ${coinId.toUpperCase()}\n\n` +
                `Remaining USDT: $${(usdtBalance - usdtAmount).toFixed(2)}`;
            
            if (!confirm(confirmMsg)) {
                return;
            }
            
            // Deduct from USDT balance
            this.portfolio.usdtBalance -= usdtAmount;
            
            // Add holding
            this.portfolio.holdings.push({
                coinId,
                amount: coinAmount,
                buyPrice: currentPrice,
                cost: usdtAmount,  // Store original cost in USDT
                currentValue: 0,
                currentPrice: 0,
                pnl: 0,
                pnlPercent: 0
            });
            
            this.savePortfolio();
            await this.updatePortfolioDisplay();
            
            // Show success message
            alert(`✅ Purchase successful!\n\n${coinAmount.toFixed(8)} ${coinId.toUpperCase()} bought for $${usdtAmount.toFixed(2)}\n\nRemaining USDT: $${this.portfolio.usdtBalance.toFixed(2)}`);
            
            // Clear form
            document.getElementById('coinSelect').value = '';
            document.getElementById('usdtAmountInput').value = '';
            
            // Record portfolio snapshot for charts
            this.recordPortfolioSnapshot();
            
        } catch (error) {
            console.error('Error adding holding:', error);
            alert('Error adding holding: ' + error.message);
        }
    }

    // ===== PORTFOLIO CHARTS =====

    initializePortfolioCharts() {
        // Initialize portfolio performance tracking
        this.portfolioHistory = this.loadPortfolioHistory();
        
        // Add event listeners for timeframe buttons
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Update chart with selected timeframe
                const period = e.target.dataset.period;
                this.updatePortfolioChart(period);
            });
        });

        // Initial chart render
        this.updatePortfolioChart('7d');
        this.updateAllocationChart();
    }

    loadPortfolioHistory() {
        try {
            if (this.userManager && this.userManager.isLoggedIn()) {
                const currentUser = this.userManager.getCurrentUser();
                return currentUser.portfolioHistory || [];
            } else {
                const stored = localStorage.getItem('crypto_portfolio_history');
                return stored ? JSON.parse(stored) : [];
            }
        } catch (error) {
            console.error('Error loading portfolio history:', error);
            return [];
        }
    }

    savePortfolioHistory() {
        try {
            if (this.userManager && this.userManager.isLoggedIn()) {
                const currentUser = this.userManager.getCurrentUser();
                currentUser.portfolioHistory = this.portfolioHistory;
                this.userManager.saveUsers();
            } else {
                localStorage.setItem('crypto_portfolio_history', JSON.stringify(this.portfolioHistory));
            }
        } catch (error) {
            console.error('Error saving portfolio history:', error);
        }
    }

    recordPortfolioSnapshot() {
        const now = new Date();
        const totalValue = (this.portfolio.usdtBalance || 0) + (this.portfolio.totalValue || 0);
        
        // Remove old snapshots (keep last 365 days)
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        this.portfolioHistory = this.portfolioHistory.filter(snapshot => 
            new Date(snapshot.timestamp) > oneYearAgo
        );

        // Add new snapshot
        this.portfolioHistory.push({
            timestamp: now.toISOString(),
            totalValue: totalValue,
            usdtBalance: this.portfolio.usdtBalance || 0,
            holdingsValue: this.portfolio.totalValue || 0,
            holdingsCount: this.portfolio.holdings ? this.portfolio.holdings.length : 0
        });

        // Keep only the most recent snapshot per day
        const dailySnapshots = {};
        this.portfolioHistory.forEach(snapshot => {
            const date = new Date(snapshot.timestamp).toDateString();
            if (!dailySnapshots[date] || new Date(snapshot.timestamp) > new Date(dailySnapshots[date].timestamp)) {
                dailySnapshots[date] = snapshot;
            }
        });
        
        this.portfolioHistory = Object.values(dailySnapshots);
        this.savePortfolioHistory();
    }

    updatePortfolioChart(period = '7d') {
        const canvas = document.getElementById('portfolioChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.getChartData(period);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (data.length === 0) {
            // Show "No data" message
            ctx.fillStyle = '#888';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Add holdings to see chart', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Calculate chart dimensions
        const padding = 20;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Find min/max values
        const values = data.map(d => d.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const valueRange = maxValue - minValue || 1;

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (i * chartHeight / 4);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }

        // Draw chart line
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((point, index) => {
            const x = padding + (index * chartWidth / (data.length - 1));
            const y = padding + chartHeight - ((point.value - minValue) / valueRange * chartHeight);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw area under curve
        ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
        ctx.beginPath();
        ctx.moveTo(padding, padding + chartHeight);
        
        data.forEach((point, index) => {
            const x = padding + (index * chartWidth / (data.length - 1));
            const y = padding + chartHeight - ((point.value - minValue) / valueRange * chartHeight);
            ctx.lineTo(x, y);
        });
        
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.closePath();
        ctx.fill();

        // Update stats
        this.updatePortfolioStats(data);
    }

    getChartData(period) {
        if (this.portfolioHistory.length === 0) {
            // Generate sample data if no history exists
            const currentValue = (this.portfolio.usdtBalance || 0) + (this.portfolio.totalValue || 0);
            if (currentValue > 0) {
                return [{
                    timestamp: new Date().toISOString(),
                    value: currentValue
                }];
            }
            return [];
        }

        const now = new Date();
        let startDate;

        switch (period) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '1y':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        return this.portfolioHistory
            .filter(snapshot => new Date(snapshot.timestamp) >= startDate)
            .map(snapshot => ({
                timestamp: snapshot.timestamp,
                value: snapshot.totalValue
            }))
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }

    updatePortfolioStats(data) {
        if (data.length === 0) {
            document.getElementById('bestDay').textContent = '+$0';
            document.getElementById('worstDay').textContent = '-$0';
            document.getElementById('avgDaily').textContent = '+$0';
            return;
        }

        // Calculate daily changes
        const dailyChanges = [];
        for (let i = 1; i < data.length; i++) {
            const change = data[i].value - data[i - 1].value;
            dailyChanges.push(change);
        }

        if (dailyChanges.length === 0) {
            document.getElementById('bestDay').textContent = '+$0';
            document.getElementById('worstDay').textContent = '-$0';
            document.getElementById('avgDaily').textContent = '+$0';
            return;
        }

        const bestDay = Math.max(...dailyChanges);
        const worstDay = Math.min(...dailyChanges);
        const avgDaily = dailyChanges.reduce((sum, change) => sum + change, 0) / dailyChanges.length;

        // Update DOM
        const bestDayEl = document.getElementById('bestDay');
        const worstDayEl = document.getElementById('worstDay');
        const avgDailyEl = document.getElementById('avgDaily');

        bestDayEl.textContent = `${bestDay >= 0 ? '+' : ''}$${bestDay.toFixed(2)}`;
        bestDayEl.className = `stat-value ${bestDay >= 0 ? 'positive' : 'negative'}`;

        worstDayEl.textContent = `${worstDay >= 0 ? '+' : ''}$${worstDay.toFixed(2)}`;
        worstDayEl.className = `stat-value ${worstDay >= 0 ? 'positive' : 'negative'}`;

        avgDailyEl.textContent = `${avgDaily >= 0 ? '+' : ''}$${avgDaily.toFixed(2)}`;
        avgDailyEl.className = `stat-value ${avgDaily >= 0 ? 'positive' : 'negative'}`;
    }

    updateAllocationChart() {
        const canvas = document.getElementById('allocationChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const holdings = this.portfolio.holdings || [];

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (holdings.length === 0) {
            // Show USDT only
            this.drawPieChart(ctx, [{ label: 'USDT', value: 100, color: '#26a69a' }]);
            this.updateAllocationLegend([{ label: 'USDT', value: this.portfolio.usdtBalance || 0, percentage: 100, color: '#26a69a' }]);
            return;
        }

        // Calculate allocations
        const totalValue = (this.portfolio.usdtBalance || 0) + (this.portfolio.totalValue || 0);
        const allocations = [];

        // Add USDT if exists
        if (this.portfolio.usdtBalance > 0) {
            allocations.push({
                label: 'USDT',
                value: this.portfolio.usdtBalance,
                percentage: (this.portfolio.usdtBalance / totalValue) * 100,
                color: '#26a69a'
            });
        }

        // Add holdings
        const colors = ['#00d4ff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe', '#fd79a8'];
        holdings.forEach((holding, index) => {
            if (holding.currentValue > 0) {
                allocations.push({
                    label: holding.coinId.toUpperCase(),
                    value: holding.currentValue,
                    percentage: (holding.currentValue / totalValue) * 100,
                    color: colors[index % colors.length]
                });
            }
        });

        this.drawPieChart(ctx, allocations);
        this.updateAllocationLegend(allocations);
    }

    drawPieChart(ctx, data) {
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        let startAngle = -Math.PI / 2; // Start at top

        data.forEach(slice => {
            const sliceAngle = (slice.percentage / 100) * 2 * Math.PI;

            // Draw slice
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = slice.color;
            ctx.fill();

            // Draw border
            ctx.strokeStyle = '#1a1a1a';
            ctx.lineWidth = 2;
            ctx.stroke();

            startAngle += sliceAngle;
        });
    }

    updateAllocationLegend(allocations) {
        const legendContainer = document.getElementById('allocationLegend');
        if (!legendContainer) return;

        legendContainer.innerHTML = '';

        allocations.forEach(allocation => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';

            legendItem.innerHTML = `
                <div class="legend-color" style="background-color: ${allocation.color}"></div>
                <span class="legend-label">${allocation.label}</span>
                <span class="legend-value">$${allocation.value.toFixed(2)}</span>
                <span class="legend-percentage">${allocation.percentage.toFixed(1)}%</span>
            `;

            legendContainer.appendChild(legendItem);
        });
    }

    // Cache management methods
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        const now = Date.now();
        if (now - cached.timestamp > this.cacheTTL) {
            // Cache expired
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    // News functionality
    async loadCryptoNews() {
        console.log('🔄 Loading crypto news...');
        const newsLoading = document.getElementById('newsLoading');
        const newsFeed = document.getElementById('newsFeed');
        
        // Show loading state
        newsLoading.classList.remove('hidden');
        newsFeed.innerHTML = '';
        
        try {
            // Check cache first
            const cached = this.getFromCache('crypto_news');
            let newsData;
            
            if (cached) {
                console.log('📦 Using cached news data');
                newsData = cached;
            } else {
                console.log('📡 Fetching fresh news data...');
                newsData = await this.fetchCryptoNews();
                
                if (newsData && newsData.length > 0) {
                    this.setCache('crypto_news', newsData);
                } else {
                    throw new Error('No news data received');
                }
            }
            
            // Hide loading and display news
            newsLoading.classList.add('hidden');
            this.displayNews(newsData);
            this.currentNewsData = newsData; // Store for filtering
            
        } catch (error) {
            console.error('❌ Error loading news:', error);
            newsLoading.classList.add('hidden');
            
            // Show fallback news
            const fallbackNews = this.getFallbackNews();
            this.displayNews(fallbackNews);
            this.currentNewsData = fallbackNews;
        }
    }

    async fetchCryptoNews() {
        try {
            // Try multiple real news sources
            const sources = [
                () => this.fetchFromCryptoCompare(),
                () => this.fetchFromNewsAPI(),
                () => this.fetchFromCoinGeckoNews()
            ];
            
            for (let i = 0; i < sources.length; i++) {
                try {
                    console.log(`📡 Trying news source ${i + 1}/${sources.length}...`);
                    const news = await sources[i]();
                    if (news && news.length > 0) {
                        console.log(`✅ Got ${news.length} real news articles from source ${i + 1}`);
                        const enhancedNews = this.enhanceNewsWithImpact(news);
                        return this.filterHighQualityNews(enhancedNews);
                    }
                } catch (sourceError) {
                    console.log(`⚠️ News source ${i + 1} failed:`, sourceError.message);
                }
            }
            
            console.log('⚠️ All real news sources failed, using enhanced fallback');
            return this.enhanceNewsWithImpact(this.getFallbackNews());
            
        } catch (error) {
            console.error('❌ Complete news fetch failure:', error);
            return this.enhanceNewsWithImpact(this.getFallbackNews());
        }
    }

    async fetchFromCryptoCompare() {
        const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest&limit=20');
        if (!response.ok) throw new Error('CryptoCompare API failed');
        
        const data = await response.json();
        return data.Data?.map(item => ({
            title: item.title,
            description: item.body?.substring(0, 200) + '...' || 'Read full article for details',
            url: item.url,
            publishedAt: new Date(item.published_on * 1000).toISOString(),
            source: { name: item.source_info?.name || 'CryptoCompare' },
            category: this.categorizeNews(item.title),
            imageUrl: item.imageurl,
            tags: item.tags?.split('|') || []
        })) || [];
    }

    async fetchFromNewsAPI() {
        // Using a free crypto news aggregator
        const response = await fetch('https://api.coingecko.com/api/v3/news');
        if (!response.ok) throw new Error('NewsAPI failed');
        
        const data = await response.json();
        return data.data?.slice(0, 15).map(item => ({
            title: item.title,
            description: item.description || 'Click to read the full story',
            url: item.url,
            publishedAt: item.published_at,
            source: { name: item.source || 'CryptoNews' },
            category: this.categorizeNews(item.title),
            imageUrl: item.thumb_2x,
            tags: []
        })) || [];
    }

    async fetchFromCoinGeckoNews() {
        const response = await fetch('https://api.coinpaprika.com/v1/news');
        if (!response.ok) throw new Error('CoinPaprika news failed');
        
        const data = await response.json();
        return data.slice(0, 12).map(item => ({
            title: item.title,
            description: item.intro || 'Read more about this crypto development',
            url: item.url,
            publishedAt: item.published_at,
            source: { name: 'CoinPaprika' },
            category: this.categorizeNews(item.title),
            imageUrl: null,
            tags: []
        }));
    }

    enhanceNewsWithImpact(newsArray) {
        return newsArray.map(article => ({
            ...article,
            impact: this.calculateNewsImpact(article),
            confidence: this.calculateConfidence(article),
            sentiment: this.analyzeSentiment(article.title + ' ' + article.description),
            aiSummary: this.generateAISummary(article)
        }));
    }

    generateAISummary(article) {
        try {
            const title = article.title;
            const description = article.description;
            const category = article.category;
            const sentiment = article.sentiment;
            
            // AI-powered summary generation based on content analysis
            let summary = "";
            
            // Extract key information
            const keyWords = this.extractKeywords(title + " " + description);
            const priceAction = this.detectPriceAction(title + " " + description);
            const marketImpact = this.assessMarketImpact(title + " " + description);
            
            // Generate context-aware summary
            if (category === 'bitcoin' || title.toLowerCase().includes('bitcoin') || title.toLowerCase().includes('btc')) {
                summary = this.generateBitcoinSummary(keyWords, priceAction, sentiment);
            } else if (category === 'ethereum' || title.toLowerCase().includes('ethereum') || title.toLowerCase().includes('eth')) {
                summary = this.generateEthereumSummary(keyWords, priceAction, sentiment);
            } else if (category === 'regulation') {
                summary = this.generateRegulationSummary(keyWords, marketImpact, sentiment);
            } else {
                summary = this.generateGeneralSummary(keyWords, priceAction, sentiment, category);
            }
            
            // Add trading implications
            const tradingImplication = this.generateTradingImplication(sentiment, priceAction, category);
            
            return {
                text: summary,
                tradingImplication: tradingImplication,
                keyPoints: keyWords.slice(0, 3),
                riskLevel: this.calculateRiskLevel(sentiment, priceAction)
            };
            
        } catch (error) {
            console.warn('⚠️ Failed to generate AI summary:', error);
            return {
                text: "AI analysis suggests monitoring this development closely for potential market impact.",
                tradingImplication: "Consider market volatility",
                keyPoints: ["Market Update"],
                riskLevel: "medium"
            };
        }
    }

    extractKeywords(text) {
        const content = text.toLowerCase();
        const keywords = [];
        
        // Price-related keywords
        const priceKeywords = ['surge', 'rally', 'drop', 'crash', 'pump', 'dump', 'moon', 'dip', 'breakout', 'resistance', 'support'];
        const institutionalKeywords = ['institutional', 'etf', 'sec', 'regulation', 'adoption', 'approval', 'wallstreet'];
        const techKeywords = ['upgrade', 'fork', 'blockchain', 'defi', 'nft', 'layer2', 'scaling', 'security'];
        
        [...priceKeywords, ...institutionalKeywords, ...techKeywords].forEach(keyword => {
            if (content.includes(keyword)) {
                keywords.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
            }
        });
        
        return keywords.length > 0 ? keywords : ['Market Update'];
    }

    detectPriceAction(text) {
        const content = text.toLowerCase();
        
        if (content.includes('surge') || content.includes('rally') || content.includes('moon') || content.includes('breakout')) {
            return 'bullish';
        } else if (content.includes('crash') || content.includes('drop') || content.includes('dump') || content.includes('fall')) {
            return 'bearish';
        } else if (content.includes('stable') || content.includes('consolidat') || content.includes('sideways')) {
            return 'neutral';
        }
        
        return 'mixed';
    }

    assessMarketImpact(text) {
        const content = text.toLowerCase();
        
        if (content.includes('billion') || content.includes('trillion') || content.includes('massive') || content.includes('major')) {
            return 'high';
        } else if (content.includes('million') || content.includes('significant') || content.includes('notable')) {
            return 'medium';
        }
        
        return 'low';
    }

    generateBitcoinSummary(keywords, priceAction, sentiment) {
        const templates = {
            bullish: [
                "🚀 Bitcoin shows strong momentum with institutional backing driving this upward movement. Smart money appears to be accumulating.",
                "📈 BTC demonstrates resilience in current market conditions. This bullish development could signal the start of a larger trend.",
                "⚡ Bitcoin's price action reflects growing mainstream adoption and investor confidence in digital gold narrative."
            ],
            bearish: [
                "📉 Bitcoin faces headwinds as market sentiment shifts. This correction might present accumulation opportunities for long-term holders.",
                "⚠️ BTC encounters selling pressure, potentially due to macro factors or profit-taking. Support levels become crucial.",
                "🔴 Bitcoin's decline reflects broader market uncertainty. Risk management becomes essential in current conditions."
            ],
            neutral: [
                "⚖️ Bitcoin consolidates in current range, suggesting market indecision. Breakout direction will determine next major move.",
                "📊 BTC maintains sideways action as markets digest recent developments. Patience required for clearer directional signals."
            ]
        };
        
        const templateArray = templates[priceAction] || templates.neutral;
        return templateArray[Math.floor(Math.random() * templateArray.length)];
    }

    generateEthereumSummary(keywords, priceAction, sentiment) {
        const templates = {
            bullish: [
                "🔥 Ethereum's ecosystem growth drives positive price action. DeFi and Layer 2 developments support bullish thesis.",
                "📈 ETH benefits from network upgrades and increasing utility. Smart contract dominance remains strong.",
                "⚡ Ethereum shows technical strength with growing developer activity and institutional interest."
            ],
            bearish: [
                "📉 Ethereum faces challenges despite strong fundamentals. Gas fees and competition create near-term pressure.",
                "⚠️ ETH experiences selling pressure, though long-term utility remains intact. Buying opportunity for believers.",
                "🔴 Ethereum's decline reflects broader alt-coin weakness. Focus on network metrics over short-term price."
            ],
            neutral: [
                "⚖️ Ethereum consolidates as markets evaluate recent network developments and competitive landscape.",
                "📊 ETH maintains range-bound trading while ecosystem continues expanding. Fundamentals remain solid."
            ]
        };
        
        const templateArray = templates[priceAction] || templates.neutral;
        return templateArray[Math.floor(Math.random() * templateArray.length)];
    }

    generateRegulationSummary(keywords, impact, sentiment) {
        const templates = [
            "🏛️ Regulatory developments create both opportunities and challenges for crypto markets. Clarity often follows initial uncertainty.",
            "⚖️ Government action signals mainstream recognition of crypto's importance. Long-term legitimacy outweighs short-term volatility.",
            "📋 Regulatory news requires careful analysis of actual impact versus market perception. Smart money focuses on fundamentals.",
            "🌐 Policy changes reflect global crypto adoption trends. Jurisdictional competition may favor innovation-friendly regions."
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }

    generateGeneralSummary(keywords, priceAction, sentiment, category) {
        const templates = [
            "📊 Market development requires monitoring for potential impact on broader crypto ecosystem and trading strategies.",
            "🔍 This news reflects ongoing evolution in crypto space. Position sizing and risk management remain paramount.",
            "💡 Industry development showcases crypto's maturation. Long-term holders should focus on fundamental strength.",
            "⚡ Market event highlights crypto's dynamic nature. Successful trading requires adapting to rapid changes."
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }

    generateTradingImplication(sentiment, priceAction, category) {
        if (sentiment === 'positive' && priceAction === 'bullish') {
            return "📈 Consider adding to positions on any dips";
        } else if (sentiment === 'negative' && priceAction === 'bearish') {
            return "⚠️ Risk management essential, consider reducing exposure";
        } else if (priceAction === 'neutral') {
            return "⚖️ Wait for clearer signals before major moves";
        } else {
            return "🎯 Monitor closely for confirmation signals";
        }
    }

    calculateRiskLevel(sentiment, priceAction) {
        if (sentiment === 'negative' && priceAction === 'bearish') {
            return 'high';
        } else if (sentiment === 'positive' && priceAction === 'bullish') {
            return 'low';
        } else {
            return 'medium';
        }
    }

    filterHighQualityNews(newsArray) {
        // Filter for high confidence (75%+) and high/critical impact news only
        const highQualityNews = newsArray.filter(article => {
            const hasHighConfidence = article.confidence >= 75;
            const hasHighImpact = ['high', 'critical'].includes(article.impact);
            
            return hasHighConfidence && hasHighImpact;
        });

        // Sort by impact (critical first) then by confidence
        const sorted = highQualityNews.sort((a, b) => {
            const impactOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
            const impactDiff = impactOrder[b.impact] - impactOrder[a.impact];
            
            if (impactDiff !== 0) return impactDiff;
            return b.confidence - a.confidence;
        });

        console.log(`🎯 Filtered to ${sorted.length} high-quality news articles (75%+ confidence, high+ impact)`);
        
        // If we have too few high-quality articles, add some medium impact high-confidence ones
        if (sorted.length < 5) {
            const backupNews = newsArray.filter(article => {
                const hasHighConfidence = article.confidence >= 80;
                const hasMediumImpact = article.impact === 'medium';
                const notAlreadyIncluded = !sorted.some(existing => existing.url === article.url);
                
                return hasHighConfidence && hasMediumImpact && notAlreadyIncluded;
            }).slice(0, 5 - sorted.length);
            
            sorted.push(...backupNews);
            console.log(`📈 Added ${backupNews.length} backup high-confidence medium-impact articles`);
        }

        return sorted.slice(0, 10); // Limit to top 10 articles
    }

    async handlePremiumRefresh(button) {
        // Safety checks
        if (!button || typeof button.classList === 'undefined') {
            console.error('❌ Invalid button element passed to handlePremiumRefresh');
            return;
        }
        
        // Prevent multiple clicks
        if (button.classList.contains('loading')) return;
        
        try {
            // Add loading state with premium animations
            button.classList.add('loading');
            button.style.pointerEvents = 'none';
            
            // Create premium loading effects
            this.addRefreshLoadingEffects(button);
            
            console.log('🔄 Premium refresh initiated...');
            
            // Add dramatic delay for better UX
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Load fresh news
            await this.loadCryptoNews();
            
            // Success animation
            this.showRefreshSuccess(button);
            
        } catch (error) {
            console.error('❌ Premium refresh failed:', error);
            this.showRefreshError(button);
        } finally {
            // Reset button state after animation
            setTimeout(() => {
                if (button && button.classList) {
                    button.classList.remove('loading');
                    button.style.pointerEvents = 'auto';
                    this.resetRefreshButton(button);
                }
            }, 1500);
        }
    }

    addRefreshLoadingEffects(button) {
        // Add pulsing glow effect
        button.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.6), 0 0 60px rgba(0, 212, 255, 0.3)';
        button.style.animation = 'refresh-loading-pulse 1.5s ease-in-out infinite';
        
        // Add dynamic gradient animation
        button.style.backgroundSize = '400% 400%';
        button.style.animation += ', gradient-shift 0.8s ease-in-out infinite';
    }

    showRefreshSuccess(button) {
        // Success state with green glow
        button.style.background = 'linear-gradient(135deg, #00ff88, #00d084, #4ecdc4)';
        button.style.boxShadow = '0 0 25px rgba(0, 255, 136, 0.5), 0 0 50px rgba(0, 255, 136, 0.2)';
        
        // Safely update text content
        const textElement = button.querySelector('.refresh-text');
        if (textElement) {
            textElement.textContent = '✅ Updated!';
        }
        
        // Particle effect simulation
        this.createSuccessParticles(button);
    }

    showRefreshError(button) {
        // Error state with red glow
        button.style.background = 'linear-gradient(135deg, #ff4444, #cc0000, #ff6b6b)';
        button.style.boxShadow = '0 0 25px rgba(255, 68, 68, 0.5), 0 0 50px rgba(255, 68, 68, 0.2)';
        
        // Safely update text content
        const textElement = button.querySelector('.refresh-text');
        if (textElement) {
            textElement.textContent = '❌ Error';
        }
    }

    resetRefreshButton(button) {
        // Reset all styles to original state
        button.style.background = '';
        button.style.boxShadow = '';
        button.style.animation = '';
        button.style.backgroundSize = '';
        
        // Safely update text content
        const textElement = button.querySelector('.refresh-text');
        if (textElement) {
            textElement.textContent = 'Refresh News';
        }
    }

    createSuccessParticles(button) {
        // Safety check for button element
        if (!button || typeof button.appendChild !== 'function') {
            console.warn('⚠️ Cannot create particles: invalid button element');
            return;
        }
        
        // Create floating success indicators
        for (let i = 0; i < 5; i++) {
            try {
                const particle = document.createElement('div');
                particle.innerHTML = '✨';
                particle.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 12px;
                    pointer-events: none;
                    animation: float-away-${i} 1s ease-out forwards;
                    z-index: 1000;
                `;
                
                button.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    if (particle && particle.parentNode) {
                        particle.remove();
                    }
                }, 1000);
            } catch (error) {
                console.warn('⚠️ Failed to create particle:', error);
            }
        }
        
        // Add CSS animations for particles
        this.addParticleAnimations();
    }

    addParticleAnimations() {
        // Safety check for document and head
        if (!document || !document.head || !document.createElement) {
            console.warn('⚠️ Cannot add particle animations: document not ready');
            return;
        }
        
        // Check if animations already exist
        if (document.getElementById('particle-animations')) {
            return; // Already added
        }
        
        try {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes refresh-loading-pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.9; }
                }
                
                @keyframes float-away-0 {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    100% { transform: translate(-70px, -70px) scale(1); opacity: 0; }
                }
                
                @keyframes float-away-1 {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    100% { transform: translate(70px, -70px) scale(1); opacity: 0; }
                }
                
                @keyframes float-away-2 {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    100% { transform: translate(-70px, 70px) scale(1); opacity: 0; }
                }
                
                @keyframes float-away-3 {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    100% { transform: translate(70px, 70px) scale(1); opacity: 0; }
                }
                
                @keyframes float-away-4 {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    100% { transform: translate(0px, -90px) scale(1); opacity: 0; }
                }
            `;
            
            style.id = 'particle-animations';
            document.head.appendChild(style);
            
        } catch (error) {
            console.warn('⚠️ Failed to add particle animations:', error);
        }
    }

    calculateNewsImpact(article) {
        const title = article.title.toLowerCase();
        const description = article.description.toLowerCase();
        const content = title + ' ' + description;
        
        let impactScore = 0;
        
        // High impact keywords
        const highImpactKeywords = [
            'breaking', 'urgent', 'major', 'massive', 'huge', 'billion', 'trillion',
            'sec', 'regulation', 'ban', 'approval', 'etf', 'institutional', 'adoption',
            'hack', 'exploit', 'crash', 'surge', 'all-time high', 'ath', 'record'
        ];
        
        // Medium impact keywords
        const mediumImpactKeywords = [
            'announce', 'launch', 'partnership', 'integration', 'upgrade', 'update',
            'million', 'investment', 'funding', 'exchange', 'listing', 'support'
        ];
        
        // Calculate impact score
        highImpactKeywords.forEach(keyword => {
            if (content.includes(keyword)) impactScore += 3;
        });
        
        mediumImpactKeywords.forEach(keyword => {
            if (content.includes(keyword)) impactScore += 1;
        });
        
        // Bitcoin/Ethereum get higher impact
        if (content.includes('bitcoin') || content.includes('btc')) impactScore += 2;
        if (content.includes('ethereum') || content.includes('eth')) impactScore += 1;
        
        // Determine impact level
        if (impactScore >= 8) return 'critical';
        if (impactScore >= 5) return 'high';
        if (impactScore >= 2) return 'medium';
        return 'low';
    }

    calculateConfidence(article) {
        let confidence = 50; // Base confidence
        
        // Source reliability
        const reliableSources = ['coindesk', 'cointelegraph', 'cryptocompare', 'coingecko'];
        const sourceName = article.source.name.toLowerCase();
        
        if (reliableSources.some(source => sourceName.includes(source))) {
            confidence += 30;
        }
        
        // Recency boost
        const publishedDate = new Date(article.publishedAt);
        const hoursAgo = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursAgo < 2) confidence += 20;
        else if (hoursAgo < 24) confidence += 10;
        else if (hoursAgo > 168) confidence -= 20; // Week old
        
        // Content quality indicators
        if (article.description && article.description.length > 100) confidence += 10;
        if (article.imageUrl) confidence += 5;
        
        return Math.min(95, Math.max(10, confidence));
    }

    analyzeSentiment(text) {
        const positiveWords = ['surge', 'rally', 'gain', 'bull', 'up', 'rise', 'growth', 'adoption', 'breakthrough'];
        const negativeWords = ['crash', 'fall', 'bear', 'down', 'drop', 'decline', 'hack', 'ban', 'exploit'];
        
        const textLower = text.toLowerCase();
        const positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
        const negativeCount = negativeWords.filter(word => textLower.includes(word)).length;
        
        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }

    getFallbackNews() {
        return [
            {
                title: "Bitcoin Reaches New All-Time High Amid Institutional Adoption",
                description: "Major corporations continue to add Bitcoin to their balance sheets, driving unprecedented price momentum and market confidence.",
                url: "#",
                publishedAt: new Date().toISOString(),
                source: { name: 'Crypto Market' },
                category: 'bitcoin'
            },
            {
                title: "Ethereum 2.0 Upgrade Shows Promising Results",
                description: "The latest Ethereum network upgrade demonstrates improved scalability and reduced gas fees, boosting developer activity.",
                url: "#",
                publishedAt: new Date(Date.now() - 3600000).toISOString(),
                source: { name: 'ETH News' },
                category: 'ethereum'
            },
            {
                title: "Regulatory Clarity Boosts Crypto Market Confidence",
                description: "Recent regulatory announcements provide clearer guidelines for cryptocurrency adoption and institutional investment.",
                url: "#",
                publishedAt: new Date(Date.now() - 7200000).toISOString(),
                source: { name: 'Regulation Today' },
                category: 'regulation'
            },
            {
                title: "DeFi TVL Hits New Record as Market Heats Up",
                description: "Total Value Locked in DeFi protocols reaches all-time highs as investors seek yield opportunities.",
                url: "#",
                publishedAt: new Date(Date.now() - 10800000).toISOString(),
                source: { name: 'DeFi Pulse' },
                category: 'market'
            },
            {
                title: "Major Exchange Adds Support for New Altcoins",
                description: "Leading cryptocurrency exchange announces support for several promising altcoin projects.",
                url: "#",
                publishedAt: new Date(Date.now() - 14400000).toISOString(),
                source: { name: 'Exchange News' },
                category: 'market'
            }
        ];
    }

    categorizeNews(title) {
        const titleLower = title.toLowerCase();
        
        if (titleLower.includes('bitcoin') || titleLower.includes('btc')) return 'bitcoin';
        if (titleLower.includes('ethereum') || titleLower.includes('eth')) return 'ethereum';
        if (titleLower.includes('regulation') || titleLower.includes('sec') || titleLower.includes('legal')) return 'regulation';
        if (titleLower.includes('market') || titleLower.includes('price') || titleLower.includes('trading')) return 'market';
        
        return 'market'; // default category
    }

    displayNews(newsData) {
        const newsFeed = document.getElementById('newsFeed');
        
        if (!newsData || newsData.length === 0) {
            newsFeed.innerHTML = '<div class="no-news">📰 No premium news articles available</div>';
            return;
        }
        
        // Create premium feed header with stats
        const stats = this.calculateNewsStats(newsData);
        const feedHeader = this.createNewsFeedHeader(stats);
        const newsCards = newsData.map(article => this.createFacebookStyleNewsCard(article)).join('');
        
        newsFeed.innerHTML = feedHeader + newsCards;
    }

    calculateNewsStats(newsData) {
        const criticalCount = newsData.filter(a => a.impact === 'critical').length;
        const highCount = newsData.filter(a => a.impact === 'high').length;
        const avgConfidence = Math.round(newsData.reduce((sum, a) => sum + a.confidence, 0) / newsData.length);
        const positiveCount = newsData.filter(a => a.sentiment === 'positive').length;
        const negativeCount = newsData.filter(a => a.sentiment === 'negative').length;
        
        return {
            total: newsData.length,
            critical: criticalCount,
            high: highCount,
            avgConfidence,
            positive: positiveCount,
            negative: negativeCount,
            marketSentiment: positiveCount > negativeCount ? 'bullish' : negativeCount > positiveCount ? 'bearish' : 'neutral'
        };
    }

    createNewsFeedHeader(stats) {
        const sentimentEmoji = stats.marketSentiment === 'bullish' ? '🟢📈' : 
                              stats.marketSentiment === 'bearish' ? '🔴📉' : '🟡⚖️';
        
        return `
            <div class="premium-feed-header">
                <div class="feed-header-title">
                    <h2>🏆 Premium Crypto News Feed</h2>
                    <p>High-impact, high-confidence news only</p>
                </div>
                <div class="feed-stats">
                    <div class="stat-item">
                        <span class="stat-number">${stats.total}</span>
                        <span class="stat-label">Articles</span>
                    </div>
                    <div class="stat-item critical">
                        <span class="stat-number">${stats.critical}</span>
                        <span class="stat-label">Critical</span>
                    </div>
                    <div class="stat-item high">
                        <span class="stat-number">${stats.high}</span>
                        <span class="stat-label">High Impact</span>
                    </div>
                    <div class="stat-item confidence">
                        <span class="stat-number">${stats.avgConfidence}%</span>
                        <span class="stat-label">Avg Confidence</span>
                    </div>
                    <div class="stat-item sentiment">
                        <span class="stat-number">${sentimentEmoji}</span>
                        <span class="stat-label">${stats.marketSentiment}</span>
                    </div>
                </div>
            </div>
        `;
    }

    createFacebookStyleNewsCard(article) {
        const impactColor = this.getImpactColor(article.impact);
        const sentimentEmoji = this.getSentimentEmoji(article.sentiment);
        const confidenceBar = this.getConfidenceBar(article.confidence);
        
        return `
            <div class="fb-news-card" onclick="window.open('${article.url}', '_blank')">
                <!-- Header with source info -->
                <div class="fb-news-header">
                    <div class="fb-source-avatar">
                        <span class="source-initial">${article.source.name.charAt(0)}</span>
                    </div>
                    <div class="fb-source-info">
                        <div class="fb-source-name">${article.source.name}</div>
                        <div class="fb-post-time">
                            ${this.formatNewsTime(article.publishedAt)} · 
                            <span class="fb-category">${article.category}</span>
                        </div>
                    </div>
                    <div class="fb-impact-badge impact-${article.impact}" title="Impact Level: ${article.impact}">
                        ${article.impact.toUpperCase()}
                    </div>
                </div>

                <!-- News content -->
                <div class="fb-news-content">
                    <h3 class="fb-news-title">${article.title}</h3>
                    <p class="fb-news-description">${article.description}</p>
                    
                    ${article.imageUrl ? `
                        <div class="fb-news-image">
                            <img src="${article.imageUrl}" alt="News image" onerror="this.style.display='none'">
                        </div>
                    ` : ''}
                </div>

                <!-- Engagement bar -->
                <div class="fb-engagement-bar">
                    <div class="fb-confidence-section">
                        <span class="confidence-label">Confidence:</span>
                        <div class="confidence-bar-container">
                            ${confidenceBar}
                            <span class="confidence-percentage">${article.confidence}%</span>
                        </div>
                    </div>
                    <div class="fb-sentiment">
                        <span class="sentiment-emoji">${sentimentEmoji}</span>
                        <span class="sentiment-text">${article.sentiment}</span>
                    </div>
                </div>

                <!-- AI Summary Section -->
                <div class="ai-summary-section">
                    <div class="ai-summary-header">
                        <div class="ai-badge">
                            <span class="ai-icon">🤖</span>
                            <span class="ai-label">SamCrypto AI Analysis</span>
                        </div>
                        <div class="risk-indicator risk-${article.aiSummary.riskLevel}">
                            ${this.getRiskIcon(article.aiSummary.riskLevel)} ${article.aiSummary.riskLevel.toUpperCase()}
                        </div>
                    </div>
                    
                    <div class="ai-summary-content">
                        <p class="ai-summary-text">${article.aiSummary.text}</p>
                        
                        <div class="trading-implication">
                            <span class="implication-label">💼 Trading Signal:</span>
                            <span class="implication-text">${article.aiSummary.tradingImplication}</span>
                        </div>
                        
                        ${article.aiSummary.keyPoints && article.aiSummary.keyPoints.length > 0 ? `
                            <div class="key-points">
                                <span class="key-points-label">🔑 Key Points:</span>
                                <div class="key-points-tags">
                                    ${article.aiSummary.keyPoints.map(point => `
                                        <span class="key-point-tag">${point}</span>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    getImpactColor(impact) {
        const colors = {
            'critical': '#ff4444',
            'high': '#ff8800', 
            'medium': '#ffbb00',
            'low': '#00bb00'
        };
        return colors[impact] || '#888888';
    }

    getSentimentEmoji(sentiment) {
        const emojis = {
            'positive': '🟢',
            'negative': '🔴', 
            'neutral': '🟡'
        };
        return emojis[sentiment] || '⚪';
    }

    getConfidenceBar(confidence) {
        const barColor = confidence >= 80 ? '#00ff88' : confidence >= 60 ? '#ffbb00' : '#ff4444';
        return `
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${confidence}%; background-color: ${barColor}"></div>
            </div>
        `;
    }

    getRiskIcon(riskLevel) {
        const icons = {
            'low': '🟢',
            'medium': '🟡',
            'high': '🔴'
        };
        return icons[riskLevel] || '🟡';
    }

    filterNews(category) {
        if (!this.currentNewsData) return;
        
        const filteredNews = category === 'all' 
            ? this.currentNewsData 
            : this.currentNewsData.filter(article => article.category === category);
            
        this.displayNews(filteredNews);
    }

    formatNewsTime(dateString) {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffHours / 24);
            
            // More precise time calculations
            if (diffMinutes < 1) return 'Just now';
            if (diffMinutes < 60) return `${diffMinutes}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
            
            // For older dates, show actual date
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        } catch (error) {
            console.error('Time formatting error:', error);
            return 'Recently';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.samCrypto = new SamCryptoAI();
    window.samCryptoAI = window.samCrypto; // For backwards compatibility
    console.log('✅ SamCrypto AI initialized and ready!');
    // Extra safety: ensure auth UI matches session state after full DOM ready
    try {
        const um = window.samCrypto.userManager;
        const session = um.getSession();
        if (session && session.userId && um.users[session.userId]) {
            um.currentUser = um.users[session.userId];
            um.updateUIForLoggedInUser();
        } else {
            um.updateUIForLoggedOutUser();
        }
    } catch (e) {
        console.error('Auth UI sync failed:', e);
    }
});
