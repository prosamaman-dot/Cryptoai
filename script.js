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
        
        // Scroll management
        this.isUserScrolling = false;
        this.userScrollTimeout = null;
        this.isNearBottom = true;
        
        // Advanced features
        this.portfolio = this.loadPortfolio();
        this.alerts = this.loadAlerts();
        this.charts = {};
        this.voiceRecognition = null;
        this.isDarkTheme = true;
        this.sentimentData = {};
        this.backtestResults = {};
        
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
        
        // Advanced feature buttons
        const portfolioToggle = document.getElementById('portfolioToggle');
        const chartsToggle = document.getElementById('chartsToggle');
        const alertsToggle = document.getElementById('alertsToggle');
        const voiceToggle = document.getElementById('voiceToggle');
        const themeToggle = document.getElementById('themeToggle');
        const backtestingToggle = document.getElementById('backtestingToggle');
        const sentimentToggle = document.getElementById('sentimentToggle');

        messageInput.addEventListener('input', () => this.handleInputChange());
        messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        sendButton.addEventListener('click', () => this.sendMessage());
        clearChat.addEventListener('click', () => this.clearConversation());
        refreshMarket.addEventListener('click', () => this.refreshMarketData());
        memoryStatus.addEventListener('click', () => this.showMemoryStatus());
        dropdownToggle.addEventListener('click', () => this.toggleDropdown());
        saveApiKey.addEventListener('click', () => this.saveApiKey());
        skipApiKey.addEventListener('click', () => this.skipApiKey());
        
        // Advanced feature event listeners
        portfolioToggle.addEventListener('click', () => this.togglePortfolio());
        chartsToggle.addEventListener('click', () => this.toggleCharts());
        alertsToggle.addEventListener('click', () => this.toggleAlerts());
        voiceToggle.addEventListener('click', () => this.toggleVoice());
        themeToggle.addEventListener('click', () => this.toggleTheme());
        backtestingToggle.addEventListener('click', () => this.toggleBacktesting());
        sentimentToggle.addEventListener('click', () => this.toggleSentiment());

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        // Reposition dropdown on window resize
        window.addEventListener('resize', () => this.repositionDropdown());

        // Initialize action buttons
        this.initializeActionButtons();

        // Initialize market data updates
        this.initializeMarketData();
        
        // Initialize scroll management
        this.initializeScrollManagement();
        
        // Initialize advanced features
        this.initializeAdvancedFeatures();
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
                // Add technical analysis data
                const technicalData = await this.getTechnicalAnalysis(crypto, data);
                marketData[crypto] = { ...data, ...technicalData };
            } catch (error) {
                console.error(`Error fetching data for ${crypto}:`, error);
            }
        }
        
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
            const rsi = this.calculateRSI(priceChange24h);
            
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

    calculateRSI(priceChange24h) {
        // Simplified RSI calculation based on 24h price change
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
            // Try multiple APIs for more accurate data
            const [coinGeckoData, binanceData] = await Promise.allSettled([
                this.fetchFromCoinGecko(coinId),
                this.fetchFromBinance(coinId)
            ]);
            
            // Use CoinGecko as primary source, Binance as backup
            if (coinGeckoData.status === 'fulfilled' && coinGeckoData.value) {
                return coinGeckoData.value;
            } else if (binanceData.status === 'fulfilled' && binanceData.value) {
                return binanceData.value;
            } else {
                throw new Error('All API sources failed');
            }
        } catch (error) {
            console.error('Market data fetch error:', error);
            // Return mock data for demo purposes
            return this.getMockMarketData(coinId);
        }
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
                last_updated: coinData.last_updated_at,
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
                last_updated: data.closeTime,
                source: 'Binance'
            };
        } catch (error) {
            console.error('Binance fetch error:', error);
            throw error;
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
                        temperature: 0.3, // Lower temperature for more focused, professional responses
                        topK: 20, // More focused token selection
                        topP: 0.8, // More deterministic responses
                        maxOutputTokens: 2048, // Allow longer, more detailed responses
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
        const currentTime = new Date().toISOString();
        let prompt = `You are SamCrypto AI, a PROFESSIONAL cryptocurrency trading advisor with institutional-grade analysis capabilities. You provide REAL, ACTIONABLE trading advice based on live market data and technical analysis.

CRITICAL INSTRUCTIONS:
- Use ONLY the provided real-time market data
- Give specific, actionable trading recommendations
- Include precise entry/exit points with stop-losses
- Provide risk management advice
- Base all analysis on current market conditions
- Be direct and professional in your analysis

YOUR EXPERTISE:
- Real-time cryptocurrency market analysis
- Technical analysis using 9 proven institutional strategies
- Risk management and position sizing
- Market timing and entry/exit strategies
- Live market data interpretation
- Professional trading psychology

PROFESSIONAL TRADING STRATEGIES:
${JSON.stringify(this.tradingStrategies, null, 2)}

LIVE MARKET DATA (${currentTime}):`;

        if (marketData) {
            for (const [coinId, data] of Object.entries(marketData)) {
                const coinName = coinId.charAt(0).toUpperCase() + coinId.slice(1).replace('-', ' ');
                const volumeFormatted = data.volume_24h ? `$${(data.volume_24h / 1000000000).toFixed(2)}B` : 'N/A';
                const marketCapFormatted = data.market_cap ? `$${(data.market_cap / 1000000000).toFixed(2)}B` : 'N/A';
                const source = data.source || 'Unknown';
                
                prompt += `\n${coinName} (${source}):
- Current Price: $${data.price_usd.toLocaleString()}
- 24h Change: ${data.change_24h > 0 ? '+' : ''}${data.change_24h.toFixed(2)}%
- 24h Volume: ${volumeFormatted}
- Market Cap: ${marketCapFormatted}
- Last Updated: ${data.last_updated ? new Date(data.last_updated * 1000).toLocaleString() : 'Unknown'}`;
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

        prompt += `\n\nPROFESSIONAL RESPONSE FORMAT - Provide institutional-grade analysis:

**MARKET ANALYSIS:**
- Current Price: $X,XXX.XX (Live from ${marketData ? Object.values(marketData)[0]?.source || 'API' : 'Market Data'})
- 24h Performance: +/-X.XX% (Volume: $X.XXB)
- Technical Signal: [BUY/SELL/HOLD] (Confidence: XX%)

**TRADING RECOMMENDATION:**
- Action: [BUY/SELL/HOLD] NOW
- Entry Price: $X,XXX.XX
- Stop-Loss: $X,XXX.XX (X.X% risk)
- Take-Profit: $X,XXX.XX (X.X% reward)
- Risk/Reward Ratio: 1:X.X

**STRATEGY & REASONING:**
- Primary Strategy: [Specific strategy from the 9 available]
- Technical Indicators: [RSI, MACD, EMA, etc.]
- Market Sentiment: [Bullish/Bearish/Neutral]
- Key Levels: Support: $X,XXX | Resistance: $X,XXX

**TIMING & EXECUTION:**
- Entry Timing: [Immediate/Within X hours/Wait for X]
- Position Size: [X% of portfolio]
- Risk Management: [Specific risk controls]

**MARKET CONTEXT:**
- News Impact: [How current events affect this trade]
- Market Conditions: [Overall market analysis]
- Correlation: [How this relates to other assets]

**PROFESSIONAL INSIGHT:**
[2-3 lines of expert analysis and market psychology]

CRITICAL: Base ALL recommendations on the provided live market data. Be specific with numbers and timing.`;

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
        // Only scroll if user is near bottom and not actively scrolling
        if (!this.isNearBottom || this.isUserScrolling) {
            return;
        }
        
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
        
        // Only auto-scroll to bottom if user is near bottom and not actively scrolling
        if (this.isNearBottom && !this.isUserScrolling) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
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

    initializeScrollManagement() {
        const messagesContainer = document.getElementById('chatMessages');
        
        // Add scroll event listener to detect user scrolling
        messagesContainer.addEventListener('scroll', () => {
            this.handleUserScroll(messagesContainer);
        });
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
        
        // Form submissions
        document.getElementById('addHoldingBtn')?.addEventListener('click', () => {
            this.addHolding();
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
            
            // Clear existing messages except welcome message
            chatMessages.innerHTML = '';
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
        // Don't automatically load chat history on page refresh
        // This keeps the conversation data stored but shows a fresh chat interface
        const chatMessages = document.getElementById('chatMessages');
        const welcomeMessage = document.getElementById('welcomeMessage');
        
        // Clear existing messages and show welcome message
        chatMessages.innerHTML = '';
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
            const stored = localStorage.getItem('crypto_portfolio');
            return stored ? JSON.parse(stored) : { holdings: [], totalValue: 0, totalPnL: 0 };
        } catch (error) {
            console.error('Error loading portfolio:', error);
            return { holdings: [], totalValue: 0, totalPnL: 0 };
        }
    }

    savePortfolio() {
        try {
            localStorage.setItem('crypto_portfolio', JSON.stringify(this.portfolio));
        } catch (error) {
            console.error('Error saving portfolio:', error);
        }
    }

    togglePortfolio() {
        const panel = document.getElementById('portfolioPanel');
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden')) {
            this.updatePortfolioDisplay();
            this.populateCoinSelects();
        }
    }

    updatePortfolioDisplay() {
        this.calculatePortfolioValue();
        document.getElementById('totalPortfolioValue').textContent = `$${this.portfolio.totalValue.toLocaleString()}`;
        document.getElementById('totalPnL').textContent = `${this.portfolio.totalPnL >= 0 ? '+' : ''}$${this.portfolio.totalPnL.toLocaleString()} (${this.portfolio.totalPnLPercent.toFixed(2)}%)`;
        document.getElementById('totalPnL').className = `value ${this.portfolio.totalPnL >= 0 ? 'positive' : 'negative'}`;
        document.getElementById('portfolioValue').textContent = `$${this.portfolio.totalValue.toLocaleString()}`;
        
        this.renderHoldings();
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

    renderHoldings() {
        const holdingsList = document.getElementById('holdingsList');
        holdingsList.innerHTML = '';
        
        this.portfolio.holdings.forEach((holding, index) => {
            const holdingDiv = document.createElement('div');
            holdingDiv.className = 'holding-item';
            holdingDiv.innerHTML = `
                <div class="holding-info">
                    <div class="holding-coin">${holding.coinId.toUpperCase()}</div>
                    <div class="holding-amount">${holding.amount} coins</div>
                </div>
                <div class="holding-value">
                    <div class="holding-price">$${holding.currentValue.toLocaleString()}</div>
                    <div class="holding-pnl ${holding.pnl >= 0 ? 'positive' : 'negative'}">
                        ${holding.pnl >= 0 ? '+' : ''}$${holding.pnl.toLocaleString()} (${holding.pnlPercent.toFixed(2)}%)
                    </div>
                </div>
            `;
            holdingsList.appendChild(holdingDiv);
        });
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
            const stored = localStorage.getItem('crypto_alerts');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading alerts:', error);
            return [];
        }
    }

    saveAlerts() {
        try {
            localStorage.setItem('crypto_alerts', JSON.stringify(this.alerts));
        } catch (error) {
            console.error('Error saving alerts:', error);
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
        
        // Simulate backtesting (in real implementation, you'd use historical data)
        const results = {
            totalReturn: (Math.random() - 0.5) * 100,
            winRate: Math.random() * 100,
            maxDrawdown: Math.random() * 50,
            sharpeRatio: Math.random() * 3,
            totalTrades: Math.floor(Math.random() * 100) + 10
        };
        
        this.displayBacktestResults(results);
    }

    displayBacktestResults(results) {
        const resultsDiv = document.getElementById('backtestResults');
        resultsDiv.innerHTML = `
            <div class="backtest-metric">
                <span class="label">Total Return</span>
                <span class="value ${results.totalReturn >= 0 ? 'positive' : 'negative'}">
                    ${results.totalReturn >= 0 ? '+' : ''}${results.totalReturn.toFixed(2)}%
                </span>
            </div>
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
        `;
    }

    // Utility Methods
    populateCoinSelects() {
        const coins = ['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot', 'chainlink', 'litecoin', 'binancecoin'];
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

    addHolding() {
        const coinId = document.getElementById('coinSelect').value;
        const amount = parseFloat(document.getElementById('amountInput').value);
        const buyPrice = parseFloat(document.getElementById('priceInput').value);
        
        if (!coinId || !amount || !buyPrice) {
            alert('Please fill in all fields');
            return;
        }
        
        this.portfolio.holdings.push({
            coinId,
            amount,
            buyPrice,
            currentValue: 0,
            currentPrice: 0,
            pnl: 0,
            pnlPercent: 0
        });
        
        this.savePortfolio();
        this.updatePortfolioDisplay();
        
        // Clear form
        document.getElementById('coinSelect').value = '';
        document.getElementById('amountInput').value = '';
        document.getElementById('priceInput').value = '';
    }

    addAlert() {
        const coinId = document.getElementById('alertCoinSelect').value;
        const condition = document.getElementById('alertCondition').value;
        const value = parseFloat(document.getElementById('alertValue').value);
        
        if (!coinId || !value) {
            alert('Please fill in all fields');
            return;
        }
        
        this.alerts.push({
            coinId,
            condition,
            value,
            active: true,
            createdAt: new Date().toISOString()
        });
        
        this.saveAlerts();
        this.updateAlertsDisplay();
        
        // Clear form
        document.getElementById('alertCoinSelect').value = '';
        document.getElementById('alertValue').value = '';
    }

    removeAlert(index) {
        this.alerts.splice(index, 1);
        this.saveAlerts();
        this.updateAlertsDisplay();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SamCryptoAI();
});
