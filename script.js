// SamCrypto AI - Chat Interface with Gemini API

class SamCryptoAI {
    constructor() {
        this.apiKey = 'AIzaSyBAgDmA7Uak6FIGh9MsN2582ouRaqpQ_Cg';
        this.conversationHistory = [];
        this.coinGeckoAPI = 'https://api.coingecko.com/api/v3';
        this.geminiAPI = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
        this.coinDeskAPI = 'https://api.coindesk.com/v1';
        this.tradingStrategies = this.initializeTradingStrategies();
        
        // Memory system
        this.userMemory = this.loadUserMemory();
        this.sessionMemory = [];
        this.userPreferences = this.loadUserPreferences();
        
        // Random greeting messages
        this.greetingMessages = [
            "Hey! Ready to make some crypto profits? 💰",
            "What's up! Let's talk crypto trading! 🚀",
            "Yo! Time to make some money moves! 💎",
            "Hey there! Ready to analyze some coins? 📈",
            "What's good! Let's dive into crypto! ⚡"
        ];
        
        this.initializeEventListeners();
        this.hideApiModal(); // Hide modal since we have API key
        this.loadChatHistory();
        this.updateWelcomeMessage();
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
        const clearChat = document.getElementById('clearChat');
        const refreshMarket = document.getElementById('refreshMarket');
        const memoryStatus = document.getElementById('memoryStatus');
        const dropdownToggle = document.getElementById('dropdownToggle');
        const dropdownMenu = document.getElementById('dropdownMenu');
        const saveApiKey = document.getElementById('saveApiKey');
        const skipApiKey = document.getElementById('skipApiKey');

        messageInput.addEventListener('input', () => this.handleInputChange());
        messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        sendButton.addEventListener('click', () => this.sendMessage());
        clearChat.addEventListener('click', () => this.clearConversation());
        refreshMarket.addEventListener('click', () => this.refreshMarketData());
        memoryStatus.addEventListener('click', () => this.showMemoryStatus());
        dropdownToggle.addEventListener('click', () => this.toggleDropdown());
        saveApiKey.addEventListener('click', () => this.saveApiKey());
        skipApiKey.addEventListener('click', () => this.skipApiKey());

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        // Reposition dropdown on window resize
        window.addEventListener('resize', () => this.repositionDropdown());

        // Initialize action buttons
        this.initializeActionButtons();

        // Initialize market data updates
        this.initializeMarketData();
    }

    checkApiKey() {
        const savedApiKey = localStorage.getItem('gemini_api_key');
        if (savedApiKey) {
            this.apiKey = savedApiKey;
            this.hideApiModal();
        } else {
            this.showApiModal();
        }
    }

    showApiModal() {
        document.getElementById('apiModal').classList.remove('hidden');
    }

    hideApiModal() {
        document.getElementById('apiModal').classList.add('hidden');
    }

    saveApiKey() {
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        if (apiKey) {
            this.apiKey = apiKey;
            localStorage.setItem('gemini_api_key', apiKey);
            this.hideApiModal();
        }
    }

    skipApiKey() {
        this.hideApiModal();
    }

    handleInputChange() {
        const input = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const charCount = document.querySelector('.char-count');
        
        // Auto-resize textarea
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        
        // Update character count
        charCount.textContent = `${input.value.length}/1000`;
        
        // Enable/disable send button
        sendButton.disabled = input.value.trim().length === 0;
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }

    async sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Hide welcome message on first user message
        this.hideWelcomeMessage();
        
        // Add user message to chat and memory
        this.addMessage(message, 'user');
        this.addToConversationHistory('user', message);
        
        // Extract user preferences from the message
        this.extractUserPreferences({ content: message });
        
        // Clear input
        input.value = '';
        input.style.height = 'auto';
        document.getElementById('sendButton').disabled = true;
        document.querySelector('.char-count').textContent = '0/1000';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get market data for crypto-related queries
            const marketData = await this.getMarketDataForQuery(message);
            
            // Generate AI response
            const response = await this.generateAIResponse(message, marketData);
            
            // Hide typing indicator and add AI response
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
            this.addToConversationHistory('assistant', response);
            
        } catch (error) {
            console.error('Error generating response:', error);
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'ai');
        }
    }

    async getMarketDataForQuery(query) {
        // Extract cryptocurrency mentions from the query
        const cryptoMentions = this.extractCryptoMentions(query);
        
        if (cryptoMentions.length === 0) {
            return null;
        }
        
        const marketData = {};
        
        for (const crypto of cryptoMentions) {
            try {
                const data = await this.fetchMarketData(crypto);
                marketData[crypto] = data;
            } catch (error) {
                console.error(`Error fetching data for ${crypto}:`, error);
            }
        }
        
        return marketData;
    }

    extractCryptoMentions(query) {
        const cryptoMap = {
            'bitcoin': 'bitcoin',
            'btc': 'bitcoin',
            'ethereum': 'ethereum',
            'eth': 'ethereum',
            'binance': 'binancecoin',
            'bnb': 'binancecoin',
            'binancecoin': 'binancecoin',
            'cardano': 'cardano',
            'ada': 'cardano',
            'solana': 'solana',
            'sol': 'solana',
            'polkadot': 'polkadot',
            'dot': 'polkadot',
            'chainlink': 'chainlink',
            'link': 'chainlink',
            'litecoin': 'litecoin',
            'ltc': 'litecoin',
            'bitcoin cash': 'bitcoin-cash',
            'bch': 'bitcoin-cash',
            'stellar': 'stellar',
            'xlm': 'stellar'
        };
        
        const queryLower = query.toLowerCase();
        const mentionedCryptos = [];
        
        for (const [mention, coinId] of Object.entries(cryptoMap)) {
            if (queryLower.includes(mention)) {
                if (!mentionedCryptos.includes(coinId)) {
                    mentionedCryptos.push(coinId);
                }
            }
        }
        
        return mentionedCryptos;
    }

    async fetchMarketData(coinId) {
        try {
            const response = await fetch(`${this.coinGeckoAPI}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch market data');
            }
            
            const data = await response.json();
            const coinData = data[coinId];
            
            if (!coinData) {
                throw new Error('Coin data not found');
            }
            
            return {
                price_usd: coinData.usd,
                change_24h: coinData.usd_24h_change,
                volume_24h: coinData.usd_24h_vol,
                market_cap: coinData.usd_market_cap
            };
        } catch (error) {
            console.error('Market data fetch error:', error);
            // Return mock data for demo purposes
            return this.getMockMarketData(coinId);
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

    // CoinDesk API Integration Methods
    async fetchCoinDeskNews() {
        try {
            // CoinDesk News API endpoint
            const response = await fetch(`${this.coinDeskAPI}/news/`);
            
            if (!response.ok) {
                throw new Error('CoinDesk API request failed');
            }
            
            const data = await response.json();
            
            // Transform CoinDesk news format to our standard format
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
            console.error('Error fetching CoinDesk news:', error);
            // Return mock news data as fallback
            return this.getMockNewsData();
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

    async generateAIResponse(userMessage, marketData) {
        if (!this.apiKey) {
            return this.generateDemoResponse(userMessage, marketData);
        }

        try {
            // Check if user is asking about news
            const isNewsQuery = this.isNewsRelatedQuery(userMessage);
            let newsData = null;
            
            if (isNewsQuery) {
                newsData = await this.fetchCoinDeskNews();
            }
            
            const systemPrompt = this.createSystemPrompt(marketData, newsData);
            const memoryContext = this.getMemoryContext();
            const prompt = `${systemPrompt}\n\n${memoryContext}\n\nUser: ${userMessage}\n\nSamCrypto AI:`;
            
            const response = await fetch(`${this.geminiAPI}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.8,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
            
        } catch (error) {
            console.error('Gemini API error:', error);
            return this.generateDemoResponse(userMessage, marketData);
        }
    }

    createSystemPrompt(marketData, newsData) {
        let prompt = `You are SamCrypto AI, a professional cryptocurrency trading advisor with a fun rap personality. You give REAL trading advice to help users make profit.

Your expertise:
- Professional crypto market analysis
- Technical analysis using 9 proven strategies
- Real-time market data interpretation
- Risk management and position sizing
- Market timing and entry/exit strategies
- Latest cryptocurrency news and market sentiment

TRADING STRATEGIES YOU USE:
${JSON.stringify(this.tradingStrategies, null, 2)}

Current market data:`;

        if (marketData) {
            for (const [coinId, data] of Object.entries(marketData)) {
                const coinName = coinId.charAt(0).toUpperCase() + coinId.slice(1).replace('-', ' ');
                prompt += `\n${coinName}: $${data.price_usd.toLocaleString()} (${data.change_24h > 0 ? '+' : ''}${data.change_24h.toFixed(2)}% 24h)`;
            }
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

        prompt += `\n\nRESPONSE FORMAT - Give actionable trading advice:
**Price:** $X,XXX (+/-X.X%)
**Action:** BUY/SELL/HOLD NOW (XX% confidence)
**Strategy:** [specific trading advice with reasoning]
**Entry:** $X,XXX | **Stop-Loss:** $X,XXX | **Take-Profit:** $X,XXX
**Timing:** [exact timing - now, today, wait X days]
**News Impact:** [how current news affects this trade]
**Rap:** [2-3 lines about the trade]

Be direct, professional, and helpful. Give real advice to make profit. Use the trading strategies and current news to justify your recommendations.`;

        return prompt;
    }

    generateDemoResponse(userMessage, marketData) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('bitcoin') || message.includes('btc')) {
            const data = marketData?.bitcoin || this.getMockMarketData('bitcoin');
            return this.generateBitcoinResponse(data);
        } else if (message.includes('ethereum') || message.includes('eth')) {
            const data = marketData?.ethereum || this.getMockMarketData('ethereum');
            return this.generateEthereumResponse(data);
        } else if (message.includes('solana') || message.includes('sol')) {
            const data = marketData?.solana || this.getMockMarketData('solana');
            return this.generateSolanaResponse(data);
        } else if (message.includes('rap') || message.includes('rhyme')) {
            return this.generateRapResponse();
        } else {
            return this.generateGeneralResponse();
        }
    }

    generateBitcoinResponse(data) {
        const change = data.change_24h;
        const price = data.price_usd;
        const signal = change > 2 ? 'BUY' : change < -2 ? 'SELL' : 'HOLD';
        const confidence = Math.min(0.9, 0.6 + Math.abs(change) * 0.05);
        const rsi = 50 + change * 2;
        
        // Determine which strategies are active
        let activeStrategies = [];
        if (rsi < 30) activeStrategies.push('RSI Strategy (Oversold)');
        if (rsi > 70) activeStrategies.push('RSI Strategy (Overbought)');
        if (Math.abs(change) > 3) activeStrategies.push('Volume Spike Confirmation');
        if (change > 0) activeStrategies.push('EMA Trend Filter (Bullish)');
        if (change < 0) activeStrategies.push('EMA Trend Filter (Bearish)');
        
        return `**Bitcoin** 📈\n\n**Price:** $${price.toLocaleString()} (${change > 0 ? '+' : ''}${change.toFixed(2)}%)\n**Action:** ${signal} NOW (${Math.round(confidence * 100)}% confidence)\n**Strategy:** ${signal === 'BUY' ? 'Buy the dip - strong support at current levels' : signal === 'SELL' ? 'Take profits - resistance approaching' : 'Wait for breakout - consolidation phase'}\n**Entry:** $${price.toLocaleString()} | **Stop-Loss:** $${(price * (signal === 'BUY' ? 0.95 : 1.05)).toLocaleString()} | **Take-Profit:** $${(price * (signal === 'BUY' ? 1.15 : 0.85)).toLocaleString()}\n**Timing:** ${signal === 'BUY' ? 'Enter now before price moves up' : signal === 'SELL' ? 'Sell within 24h' : 'Wait 1-2 days for direction'}\n\n**Rap:** 🎤\n"Bitcoin ${change > 0 ? 'pumping' : 'dumping'}, ${change > 0 ? 'time to stack' : 'time to pack'}!\n${Math.round(confidence * 100)}% sure this trend is real,\n${signal === 'BUY' ? 'Buy the dip' : signal === 'SELL' ? 'Sell the rip' : 'Hold your chips'} and make that deal!"`;
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
        return `**SamCrypto AI - Crypto Trading Advisor** 🎤₿\n\nI'm SamCrypto AI, your professional crypto trading advisor with 9 proven strategies!\n\n**Ask me:**\n- "What's Bitcoin doing?"\n- "Should I buy ETH now?"\n- "When to sell Solana?"\n- "Analyze Cardano for me"\n\n**I'll give you:**\n- Real-time market analysis\n- BUY/SELL/HOLD recommendations\n- Entry and exit prices\n- Stop-loss and take-profit levels\n- Exact timing for trades\n- Plus a rap about the market!\n\n**Trading Strategies:** RSI, MACD, EMA, Bollinger Bands, Volume, Support/Resistance, Candlestick patterns, Breakouts, Divergences`;
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
            this.smoothScrollToBottom(messagesContainer);
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
                
                // Smooth scroll to bottom
                this.smoothScrollToBottom(container);
                
                // Variable typing speed for more natural feel
                const baseDelay = 8;
                const randomDelay = Math.random() * 5;
                const delay = baseDelay + randomDelay;
                
                setTimeout(type, delay);
            } else {
                // Remove cursor when typing is complete
                messageElement.innerHTML = currentText;
            }
        };
        
        type();
    }

    smoothScrollToBottom(container) {
        const scrollHeight = container.scrollHeight;
        const currentScroll = container.scrollTop;
        const targetScroll = scrollHeight - container.clientHeight;
        
        if (currentScroll < targetScroll) {
            const scrollStep = (targetScroll - currentScroll) / 10;
            container.scrollTop += scrollStep;
            
            if (container.scrollTop < targetScroll) {
                requestAnimationFrame(() => this.smoothScrollToBottom(container));
            }
        }
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
        document.getElementById('typingIndicator').classList.remove('hidden');
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        document.getElementById('typingIndicator').classList.add('hidden');
    }

    clearConversation() {
        const messagesContainer = document.getElementById('chatMessages');
        // Keep only the first AI message
        const firstMessage = messagesContainer.querySelector('.ai-message');
        messagesContainer.innerHTML = '';
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

    initializeMarketData() {
        // Show immediate prices first
        this.showImmediatePrices();
        
        // Connect to Binance WebSocket for real-time data
        this.connectToBinanceWebSocket();
        
        // Fallback: Update prices every 3 seconds using REST API
        this.fallbackInterval = setInterval(() => {
            this.updateMarketPricesFallback();
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
            this.ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker/ethusdt@ticker/solusdt@ticker');
            
            this.ws.onopen = () => {
                console.log('Connected to Binance WebSocket');
                this.isConnected = true;
            };
            
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.updatePriceFromWebSocket(data);
            };
            
            this.ws.onclose = () => {
                console.log('WebSocket connection closed');
                this.isConnected = false;
                // Attempt to reconnect after 2 seconds (faster reconnection)
                setTimeout(() => {
                    this.connectToBinanceWebSocket();
                }, 2000);
            };
            
            this.ws.onerror = (error) => {
                console.log('WebSocket error:', error);
                this.isConnected = false;
            };
            
        } catch (error) {
            console.log('Failed to connect to Binance WebSocket:', error);
            this.isConnected = false;
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
            localStorage.setItem('crypto_ai_memory', JSON.stringify(this.userMemory));
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
            localStorage.setItem('crypto_ai_preferences', JSON.stringify(this.userPreferences));
        } catch (error) {
            console.log('Error saving preferences:', error);
        }
    }

    addToConversationHistory(role, content, timestamp = new Date().toISOString()) {
        const message = { role, content, timestamp };
        this.conversationHistory.push(message);
        this.sessionMemory.push(message);
        
        // Keep only last 50 messages in memory to manage size
        if (this.conversationHistory.length > 50) {
            this.conversationHistory.shift();
        }
        
        // Save to persistent memory
        this.userMemory.conversations.push(message);
        
        // Keep only last 200 conversations in persistent storage
        if (this.userMemory.conversations.length > 200) {
            this.userMemory.conversations.shift();
        }
        
        this.saveUserMemory();
    }

    extractUserPreferences(message) {
        const content = message.content.toLowerCase();
        
        // Extract favorite coins
        const coinMentions = ['bitcoin', 'btc', 'ethereum', 'eth', 'solana', 'sol', 'cardano', 'ada', 'polkadot', 'dot'];
        coinMentions.forEach(coin => {
            if (content.includes(coin) && !this.userPreferences.favoriteCoins.includes(coin)) {
                this.userPreferences.favoriteCoins.push(coin);
            }
        });
        
        // Extract trading style
        if (content.includes('day trading') || content.includes('scalp')) {
            this.userPreferences.tradingStyle = 'day_trading';
        } else if (content.includes('swing') || content.includes('hold')) {
            this.userPreferences.tradingStyle = 'swing_trading';
        } else if (content.includes('long term') || content.includes('hodl')) {
            this.userPreferences.tradingStyle = 'long_term';
        }
        
        // Extract risk tolerance
        if (content.includes('conservative') || content.includes('safe') || content.includes('low risk')) {
            this.userPreferences.riskTolerance = 'conservative';
        } else if (content.includes('aggressive') || content.includes('high risk') || content.includes('yolo')) {
            this.userPreferences.riskTolerance = 'aggressive';
        } else if (content.includes('moderate') || content.includes('balanced')) {
            this.userPreferences.riskTolerance = 'moderate';
        }
        
        // Extract experience level
        if (content.includes('beginner') || content.includes('new to') || content.includes('learning')) {
            this.userPreferences.experienceLevel = 'beginner';
        } else if (content.includes('experienced') || content.includes('advanced') || content.includes('expert')) {
            this.userPreferences.experienceLevel = 'advanced';
        } else if (content.includes('intermediate') || content.includes('some experience')) {
            this.userPreferences.experienceLevel = 'intermediate';
        }
        
        // Extract interests
        const interests = ['defi', 'nft', 'staking', 'mining', 'yield farming', 'liquidity', 'trading bots'];
        interests.forEach(interest => {
            if (content.includes(interest) && !this.userPreferences.interests.includes(interest)) {
                this.userPreferences.interests.push(interest);
            }
        });
        
        this.saveUserPreferences();
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
        
        const statusMessage = `🧠 SamCrypto AI Memory Status:
        
📊 Total Conversations: ${totalConversations}
🪙 Favorite Coins: ${favoriteCoins} (${this.userPreferences.favoriteCoins.join(', ') || 'None'})
🎯 Trading Style: ${this.userPreferences.tradingStyle}
⚖️ Risk Tolerance: ${this.userPreferences.riskTolerance}
📈 Experience Level: ${this.userPreferences.experienceLevel}
🔍 Interests: ${interests} (${this.userPreferences.interests.join(', ') || 'None'})
⏰ Last Updated: ${lastUpdated}

SamCrypto AI remembers your preferences and conversation history to provide personalized crypto advice! 🚀`;

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
        
        if (dropdownMenu.classList.contains('show')) {
            const toggleRect = dropdownToggle.getBoundingClientRect();
            dropdownMenu.style.top = (toggleRect.bottom + 5) + 'px';
            dropdownMenu.style.right = (window.innerWidth - toggleRect.right) + 'px';
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

    updateWelcomeMessage() {
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            const randomGreeting = this.greetingMessages[Math.floor(Math.random() * this.greetingMessages.length)];
            const messageText = welcomeMessage.querySelector('.message-text');
            if (messageText) {
                messageText.innerHTML = `
                    <h2 class="welcome-title">What can I help with?</h2>
                    <div class="action-buttons">
                        <button class="action-btn" data-action="analyze-bitcoin">
                            <div class="btn-icon bitcoin-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                    <path d="M12 17h.01"/>
                                </svg>
                            </div>
                            <span>Bitcoin</span>
                        </button>
                        <button class="action-btn" data-action="get-advice">
                            <div class="btn-icon advice-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4"/>
                                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                                </svg>
                            </div>
                            <span>Advice</span>
                        </button>
                        <button class="action-btn" data-action="market-analysis">
                            <div class="btn-icon chart-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                                </svg>
                            </div>
                            <span>Analysis</span>
                        </button>
                        <button class="action-btn" data-action="portfolio-help">
                            <div class="btn-icon portfolio-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                    <line x1="8" y1="21" x2="16" y2="21"/>
                                    <line x1="12" y1="17" x2="12" y2="21"/>
                                </svg>
                            </div>
                            <span>Portfolio</span>
                        </button>
                        <button class="action-btn" data-action="latest-news">
                            <div class="btn-icon news-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 11a9 9 0 0 1 9 9"></path>
                                    <path d="M4 4a16 16 0 0 1 16 16"></path>
                                    <circle cx="5" cy="19" r="1"></circle>
                                </svg>
                            </div>
                            <span>News</span>
                        </button>
                        <button class="action-btn" data-action="more-options">
                            <div class="btn-icon more-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="1"/>
                                    <circle cx="19" cy="12" r="1"/>
                                    <circle cx="5" cy="12" r="1"/>
                                </svg>
                            </div>
                            <span>More</span>
                        </button>
                    </div>
                `;
            }
            // Re-initialize action buttons after updating
            this.initializeActionButtons();
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
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
            const chatHistory = JSON.parse(savedHistory);
            const chatMessages = document.getElementById('chatMessages');
            const welcomeMessage = document.getElementById('welcomeMessage');
            
            // Clear existing messages except welcome message
            chatMessages.innerHTML = '';
            if (welcomeMessage) {
                chatMessages.appendChild(welcomeMessage);
            }
            
            // If there's chat history, hide welcome message
            if (chatHistory.length > 0) {
                this.hideWelcomeMessage();
            }
            
            // Load saved messages
            chatHistory.forEach(msg => {
                this.addMessage(msg.content, msg.sender, false);
            });
        }
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
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SamCryptoAI();
});
