// SamCrypto AI - Chat Interface with Gemini API

class SamCryptoAI {
    constructor() {
        // Initialize UserManager first
        this.userManager = new UserManager();
        
        // Core API configuration
        this.apiKey = 'AIzaSyBAgDmA7Uak6FIGh9MsN2582ouRaqpQ_Cg'; // Default API key
        this.conversationHistory = [];
        this.coinGeckoAPI = 'https://api.coingecko.com/api/v3';
        this.geminiAPI = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
        this.coinDeskAPI = 'https://api.coindesk.com/v1';
        this.tradingStrategies = this.initializeTradingStrategies();
        
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
        
        // Professional features (user-specific data)
        this.portfolio = { totalValue: 0, totalPnL: 0, totalPnLPercent: 0, holdings: [] };
        this.alerts = [];
        this.charts = {};
        this.voiceRecognition = null;
        this.isDarkTheme = true;
        this.sentimentData = {};
        this.backtestResults = {};
        
        // API caching and rate limiting
        this.cache = new Map();
        this.cacheTTL = 30000; // 30 seconds cache TTL
        this.pendingRequests = new Map();
        this.requestQueue = [];
        this.maxConcurrentRequests = 3;
        
        // Message sending flag to prevent duplicates
        this.isSending = false;
        
        // Voice input state
        this.isRecording = false;
        this.recognition = null;
        
        // Professional greeting messages
        this.greetingMessages = [
            "Welcome to SamCrypto AI! Ready to analyze the markets and find profitable opportunities? 📈💰",
            "Hello! I'm your professional crypto trading assistant. Let's dive into market analysis! 🚀",
            "Greetings! Time for some serious market analysis and trading insights. What can I help you with? 💎",
            "Welcome! I'm here to provide professional crypto analysis and trading recommendations. 📊⚡",
            "Hello trader! Ready to explore market opportunities with data-driven insights? 🎯💰",
            "Welcome to professional crypto analysis! Let's find you some winning trading opportunities! 📈🚀"
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
        
        // Update welcome message
        this.updateWelcomeMessage();
        
        console.log('SamCrypto AI initialized successfully');
    }

    // Load user-specific data
    loadUserData() {
        const currentUser = this.userManager.getCurrentUser();
        if (currentUser) {
            // Load user's portfolio
            this.portfolio = currentUser.portfolio || { totalValue: 0, totalPnL: 0, totalPnLPercent: 0, holdings: [] };
            
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
            this.portfolio = { totalValue: 0, totalPnL: 0, totalPnLPercent: 0, holdings: [] };
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
            const savedApiKey = localStorage.getItem('gemini_api_key');
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
        sendButton.addEventListener('click', () => this.sendMessage());
        saveApiKey?.addEventListener('click', () => this.saveApiKey());
        skipApiKey?.addEventListener('click', () => this.skipApiKey());
        
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
        
        // Voice Input Button
        const voiceInputButton = document.getElementById('voiceInputButton');
        voiceInputButton?.addEventListener('click', () => this.toggleVoiceInput());

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
        }
        // Always hide modal since we have default API key
        this.hideApiModal();
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
        // Use requestAnimationFrame for smooth 60fps updates
        if (this.inputChangeFrame) {
            cancelAnimationFrame(this.inputChangeFrame);
        }
        
        this.inputChangeFrame = requestAnimationFrame(() => {
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
        const message = input.value.trim();
        
        if (!message) return;
        
        // Prevent multiple simultaneous sends
        if (this.isSending) {
            console.warn('⚠️ Already sending a message, please wait...');
            return;
        }
        
        this.isSending = true;
        console.log('📤 Sending message:', message);
        
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
            
            // Safety check - ensure we have a valid response
            if (!response || response.trim() === '') {
                throw new Error('Empty response received');
            }
            
            // Hide typing indicator and add AI response
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
            this.addToConversationHistory('assistant', response);
            
        } catch (error) {
            console.error('❌ Error generating response:', error);
            console.error('❌ Error stack:', error.stack);
            this.hideTypingIndicator();
            
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
        } finally {
            // Always reset sending flag
            this.isSending = false;
            console.log('✅ Message send complete');
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
            'xlm': 'stellar',
            'ripple': 'ripple',
            'xrp': 'ripple',
            'dogecoin': 'dogecoin',
            'doge': 'dogecoin',
            'avalanche': 'avalanche-2',
            'avax': 'avalanche-2',
            'polygon': 'matic-network',
            'matic': 'matic-network',
            'uniswap': 'uniswap',
            'uni': 'uniswap',
            'tron': 'tron',
            'trx': 'tron',
            'monero': 'monero',
            'xmr': 'monero',
            'ethereum classic': 'ethereum-classic',
            'etc': 'ethereum-classic',
            'cosmos': 'cosmos',
            'atom': 'cosmos',
            'algorand': 'algorand',
            'algo': 'algorand',
            'vechain': 'vechain',
            'vet': 'vechain',
            'filecoin': 'filecoin',
            'fil': 'filecoin'
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
        
        // Create new request
        const requestPromise = (async () => {
            try {
                // Try multiple APIs for more accurate data
                const [coinGeckoData, binanceData] = await Promise.allSettled([
                    this.fetchFromCoinGecko(coinId),
                    this.fetchFromBinance(coinId)
                ]);
                
                let result;
                // Use CoinGecko as primary source, Binance as backup
                if (coinGeckoData.status === 'fulfilled' && coinGeckoData.value) {
                    result = coinGeckoData.value;
                } else if (binanceData.status === 'fulfilled' && binanceData.value) {
                    result = binanceData.value;
                } else {
                    throw new Error('All API sources failed');
                }
                
                // Cache the result
                this.setCache(cacheKey, result);
                return result;
                
            } catch (error) {
                console.error('Market data fetch error:', error);
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
        console.log('🤖 Generating AI response for:', userMessage);
        console.log('🔑 API Key available:', !!this.apiKey);
        
        if (!this.apiKey) {
            console.warn('⚠️ No API key, using demo response');
            return this.generateDemoResponse(userMessage, marketData);
        }

        try {
            // Detect user intent for smarter responses
            const intent = this.detectIntent(userMessage);
            console.log('🎯 Detected intent:', intent);
            
            // Gather comprehensive context
            const isNewsQuery = this.isNewsRelatedQuery(userMessage);
            let newsData = null;
            
            if (isNewsQuery || intent.topic === 'news') {
                newsData = await this.fetchCoinDeskNews();
            }
            
            // Build enhanced system prompt
            const systemPrompt = this.createAdvancedSystemPrompt(marketData, newsData, intent);
            
            // Build conversation history for multi-turn context
            const conversationContents = this.buildConversationHistory(systemPrompt, userMessage);
            console.log('📝 Conversation contents prepared, messages:', conversationContents.length);
            
            // Dynamic generation config based on intent
            const generationConfig = this.getOptimalGenerationConfig(intent);
            
            console.log('📡 Sending request to Gemini API...');
            const response = await fetch(`${this.geminiAPI}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: conversationContents,
                    generationConfig: generationConfig,
                    safetySettings: [
                        {
                            category: 'HARM_CATEGORY_HARASSMENT',
                            threshold: 'BLOCK_NONE'
                        },
                        {
                            category: 'HARM_CATEGORY_HATE_SPEECH',
                            threshold: 'BLOCK_NONE'
                        },
                        {
                            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                            threshold: 'BLOCK_NONE'
                        },
                        {
                            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                            threshold: 'BLOCK_NONE'
                        }
                    ]
                })
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API error details:', errorText);
                throw new Error(`API request failed: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ API response received:', data);
            
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                console.error('❌ Invalid response structure:', data);
                throw new Error('Invalid API response - no candidates');
            }
            
            const aiResponse = data.candidates[0].content.parts[0].text;
            console.log('✅ AI response generated successfully, length:', aiResponse.length);
            return aiResponse;
            
        } catch (error) {
            console.error('❌ Gemini API error:', error);
            console.log('🔄 Falling back to demo response');
            return this.generateDemoResponse(userMessage, marketData);
        }
    }

    detectIntent(message) {
        const messageLower = message.toLowerCase();
        
        // Intent categories
        const intents = {
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
        
        // Add system instruction as first user message
        contents.push({
            role: 'user',
            parts: [{ text: systemPrompt }]
        });
        
        // Add acknowledgment from model
        contents.push({
            role: 'model',
            parts: [{ text: 'Understood! I\'m ready to provide professional crypto trading advice with real-time data, technical analysis, and personalized recommendations. I\'ll be friendly, detailed, and always include specific numbers and actionable insights.' }]
        });
        
        // Add recent conversation history (last 6 messages for context)
        const recentHistory = this.conversationHistory.slice(-6);
        for (const msg of recentHistory) {
            contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            });
        }
        
        // Add current user message
        contents.push({
            role: 'user',
            parts: [{ text: currentMessage }]
        });
        
        return contents;
    }

    getOptimalGenerationConfig(intent) {
        // Dynamic config based on intent
        const baseConfig = {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
        };
        
        // Adjust based on intent type
        switch (intent.type) {
            case 'trade_advice':
            case 'price_check':
                return { ...baseConfig, temperature: 0.4, topK: 30 }; // More focused for trading
            case 'learning':
            case 'comparison':
                return { ...baseConfig, temperature: 0.8, maxOutputTokens: 3072 }; // More creative for explanations
            case 'analysis':
                return { ...baseConfig, temperature: 0.5, topK: 35 }; // Balanced for analysis
            default:
                return baseConfig;
        }
    }

    createAdvancedSystemPrompt(marketData, newsData, intent) {
        const currentTime = new Date().toISOString();
        const userPortfolio = this.portfolio;
        const userAlerts = this.alerts;
        
        let prompt = `Hey there! I'm SamCrypto AI, your personal crypto trading buddy! 🚀💰

I'm here to help YOU make REAL MONEY in crypto, not just give you boring generic advice. I know the market inside out and I want to see you succeed!

🎯 MY MISSION: Help you profit from crypto trading with personalized, actionable advice!

💡 MY APPROACH:
- I'm your FRIEND first, advisor second
- I give you SPECIFIC trades that can make you money
- I explain WHY I'm recommending something
- I help you understand the risks and rewards
- I celebrate your wins and help you learn from losses
- I adapt my advice to YOUR situation and goals

🔥 WHAT MAKES ME DIFFERENT:
- I use REAL market data, not fake numbers
- I give you EXACT entry/exit prices
- I tell you HOW MUCH to invest
- I explain the profit potential
- I help you manage risk like a pro
- I'm always honest about what could go wrong

📊 YOUR CURRENT SITUATION:
- Portfolio Value: $${userPortfolio.totalValue.toLocaleString()}
- Total Holdings: ${userPortfolio.holdings.length} coins
- Active Alerts: ${userAlerts.length} price alerts
- Current P&L: ${userPortfolio.totalPnL >= 0 ? '+' : ''}$${userPortfolio.totalPnL.toLocaleString()} (${userPortfolio.totalPnLPercent.toFixed(2)}%)

🎪 MY TRADING STRATEGIES (I use these to find you profits):
${JSON.stringify(this.tradingStrategies, null, 2)}

📈 LIVE MARKET DATA (${currentTime}):`;

        if (marketData) {
            for (const [coinId, data] of Object.entries(marketData)) {
                const coinName = coinId.charAt(0).toUpperCase() + coinId.slice(1).replace('-', ' ');
                const volumeFormatted = data.volume_24h ? `$${(data.volume_24h / 1000000000).toFixed(2)}B` : 'N/A';
                const marketCapFormatted = data.market_cap ? `$${(data.market_cap / 1000000000).toFixed(2)}B` : 'N/A';
                const source = data.source || 'Unknown';
                
                prompt += `\n\n📊 ${coinName} (${source}):
- Current Price: $${data.price_usd.toLocaleString()}
- 24h Change: ${data.change_24h > 0 ? '+' : ''}${data.change_24h.toFixed(2)}%
- 24h Volume: ${volumeFormatted}
- Market Cap: ${marketCapFormatted}
- Last Updated: ${data.last_updated ? new Date(data.last_updated).toLocaleString() : 'Unknown'}`;
                
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
            intentGuidance = `\n\n🎯 USER INTENT: They want TRADING ADVICE
- Provide specific BUY/SELL/HOLD recommendation
- Include exact entry price, target, and stop-loss
- Calculate potential profit in dollars
- Explain risk/reward ratio
- Reference the trading strategies that apply`;
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
- Discuss potential scenarios (bullish/bearish)
- Always emphasize this is analysis, not financial advice`;
        } else if (intent.type === 'portfolio') {
            intentGuidance = `\n\n🎯 USER INTENT: Portfolio Management
- Review their current holdings
- Analyze their P&L
- Suggest rebalancing if needed
- Identify opportunities to improve returns
- Reference their actual portfolio data`;
        } else if (intent.type === 'news') {
            intentGuidance = `\n\n🎯 USER INTENT: Market News
- Summarize the latest news provided
- Explain how it affects crypto prices
- Connect news to trading opportunities
- Discuss market sentiment impact`;
        }

        prompt += intentGuidance;

        prompt += `\n\n🎯 HOW TO RESPOND (Be my awesome trading buddy!):

**ALWAYS START WITH:**
- A friendly, enthusiastic greeting
- Acknowledge what they're asking about
- Reference their portfolio if relevant ($${userPortfolio.totalValue.toLocaleString()} total value)
- Show genuine excitement about helping them!

**PROVIDE COMPREHENSIVE ANALYSIS:**
- Use ALL the live market data I provided above
- Reference technical indicators (RSI, support/resistance, volatility)
- Analyze price trends (24h, 7d, 30d changes)
- Consider market sentiment and volume
- Apply relevant trading strategies from my list

**GIVE SPECIFIC, ACTIONABLE ADVICE:**
- Current Price: $X,XXX.XX (exact from live data)
- Recommended Action: BUY/SELL/HOLD with confidence %
- Entry Price: $X,XXX.XX (specific level)
- Target Prices: $X,XXX.XX (short-term), $X,XXX.XX (long-term)
- Stop Loss: $X,XXX.XX (risk management)
- Position Size: $XXX or X% of portfolio
- Potential Profit: $XXX (XX% gain)
- Risk/Reward Ratio: 1:X

**EXPLAIN YOUR REASONING:**
- WHY this is a good/bad trade right now
- WHICH technical indicators support this
- WHAT strategy you're applying
- HOW the risk is managed
- WHEN to enter/exit

**STRUCTURE YOUR RESPONSE:**
1. Friendly greeting + acknowledge their question
2. Current market analysis with real numbers
3. Your recommendation with specific prices
4. Detailed explanation of WHY
5. Risk management guidance
6. Encouraging action step

**CRITICAL RULES:**
- ALWAYS use the actual live data provided (prices, RSI, volume, etc.)
- ALWAYS give EXACT dollar amounts and percentages
- ALWAYS explain WHY using technical analysis
- BE SPECIFIC - no vague "the price might go up" - give targets!
- REFERENCE their portfolio value and personalize advice
- USE emojis strategically for engagement 💰📈🚀
- BALANCE optimism with realistic risk assessment
- END with a clear call-to-action

**TONE & STYLE:**
- Friendly and encouraging like a trading buddy
- Professional and knowledgeable
- Clear and easy to understand
- Excited about opportunities but honest about risks
- Personal and engaging, not robotic

Let's help them make some serious profits! 🚀💰`;

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

*Tip: For the best experience, get your free Gemini API key to unlock my full AI-powered analysis!*`;
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
        
        document.getElementById('refreshPortfolio')?.addEventListener('click', async () => {
            console.log('Refreshing portfolio prices...');
            await this.updatePortfolioDisplay();
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
                console.error('❌ WebSocket error:', error);
                this.isConnected = false;
                // Start REST API fallback on error
                if (!this.restApiInterval) {
                    this.startRestApiFallback();
                }
            };
            
        } catch (error) {
            console.error('❌ Failed to connect to Binance WebSocket:', error);
            this.isConnected = false;
            // Start REST API fallback
            this.startRestApiFallback();
        }
    }
    
    // REST API fallback when WebSocket fails
    startRestApiFallback() {
        if (this.restApiInterval) return; // Already running
        
        console.log('🔄 Starting REST API fallback for price updates...');
        
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
                console.log('✅ WebSocket reconnected, stopping REST API fallback');
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
            
            console.log('✅ Prices updated via REST API fallback');
        } catch (error) {
            console.error('❌ REST API fallback failed:', error);
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
        // Safety check: ensure arrays are initialized
        if (!this.conversationHistory) {
            console.warn(' conversationHistory was undefined, initializing...');
            this.conversationHistory = [];
        }
        if (!this.sessionMemory) {
            console.warn(' sessionMemory was undefined, initializing...');
            this.sessionMemory = [];
        }
        if (!this.userMemory) {
            console.warn(' userMemory was undefined, initializing...');
            this.userMemory = {
                conversations: [],
                userProfile: {},
                tradingHistory: [],
                preferences: {},
                lastUpdated: new Date().toISOString()
            };
        }
        if (!this.userMemory.conversations) {
            this.userMemory.conversations = [];
        }
        
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
        // Safety check - ensure message and content exist
        if (!message || !message.content) {
            console.warn('⚠️ extractUserPreferences called with invalid message:', message);
            return;
        }
        
        const content = message.content.toLowerCase();
        
        // Safety check - ensure userPreferences is initialized
        if (!this.userPreferences) {
            console.warn('⚠️ userPreferences not initialized, initializing now...');
            this.userPreferences = {
                favoriteCoins: [],
                tradingStyle: 'unknown',
                riskTolerance: 'unknown',
                experienceLevel: 'unknown',
                interests: []
            };
        }
        
        // Ensure favoriteCoins array exists
        if (!this.userPreferences.favoriteCoins) {
            this.userPreferences.favoriteCoins = [];
        }
        
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
            console.log('✅ Features page opened');
            
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
                    document.querySelector('.char-count').textContent = `${transcript.length}/1000`;
                    
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
            const voiceButton = document.getElementById('voiceInputButton');
            voiceButton.classList.add('recording');
            
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
        const voiceButton = document.getElementById('voiceInputButton');
        voiceButton.classList.remove('recording');
        
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
            this.populateCoinSelects();
        }
    }

    async updatePortfolioDisplay() {
        await this.calculatePortfolioValue();
        document.getElementById('totalPortfolioValue').textContent = `$${this.portfolio.totalValue.toLocaleString()}`;
        document.getElementById('totalPnL').textContent = `${this.portfolio.totalPnL >= 0 ? '+' : ''}$${this.portfolio.totalPnL.toLocaleString()} (${this.portfolio.totalPnLPercent.toFixed(2)}%)`;
        document.getElementById('totalPnL').className = `value ${this.portfolio.totalPnL >= 0 ? 'positive' : 'negative'}`;
        document.getElementById('portfolioValue').textContent = `$${this.portfolio.totalValue.toLocaleString()}`;
        
        this.renderHoldings();
    }

    async calculatePortfolioValue() {
        let totalValue = 0;
        let totalCost = 0;
        
        console.log('Calculating portfolio value for holdings:', this.portfolio.holdings);
        
        for (const holding of this.portfolio.holdings) {
            try {
                console.log(`Fetching market data for ${holding.coinId}...`);
                const marketData = await this.fetchMarketData(holding.coinId);
                console.log(`Market data for ${holding.coinId}:`, marketData);
                
                const currentValue = holding.amount * marketData.price_usd;
                const cost = holding.amount * holding.buyPrice;
                
                console.log(`Holding: ${holding.amount} ${holding.coinId}`);
                console.log(`Buy Price: $${holding.buyPrice}`);
                console.log(`Current Price: $${marketData.price_usd}`);
                console.log(`Current Value: $${currentValue.toFixed(2)}`);
                console.log(`Cost: $${cost.toFixed(2)}`);
                console.log(`P&L: $${(currentValue - cost).toFixed(2)}`);
                
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
        
        console.log('Portfolio calculation complete:');
        console.log(`Total Value: $${totalValue.toFixed(2)}`);
        console.log(`Total Cost: $${totalCost.toFixed(2)}`);
        console.log(`Total P&L: $${(totalValue - totalCost).toFixed(2)}`);
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

    removeHolding(index) {
        if (index >= 0 && index < this.portfolio.holdings.length) {
            this.portfolio.holdings.splice(index, 1);
            this.savePortfolio();
            this.updatePortfolioDisplay();
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

    async addHolding() {
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
        await this.updatePortfolioDisplay();
        
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

    clearCache() {
        this.cache.clear();
        console.log('Cache cleared');
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
