// New Features Implementation
// 1. TradingView Charts
// 2. Paper Trading
// 3. Whale Alerts
// 4. AI News Sentiment
// 5. Chart Screenshot Analysis
// 6. Performance Dashboard

class NewFeatures {
    constructor(samCryptoAI) {
        this.app = samCryptoAI;
        this.paperPortfolio = this.loadPaperPortfolio();
        this.performanceData = this.loadPerformanceData();
        this.whaleAlerts = [];
        
        this.initializeEventListeners();
        this.startWhaleAlertFeed();
    }

    initializeEventListeners() {
        // Paper Trading
        document.getElementById('paperTradingToggle')?.addEventListener('click', () => this.openPaperTrading());
        document.getElementById('paperTradingClose')?.addEventListener('click', () => this.closePaperTrading());
        document.getElementById('resetPaperAccount')?.addEventListener('click', () => this.resetPaperAccount());
        document.getElementById('comparePaperLive')?.addEventListener('click', () => this.comparePaperToLive());
        
        // Order form controls
        document.querySelectorAll('.order-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchOrderType(e.target.dataset.type));
        });
        
        document.getElementById('paperCoinSelect')?.addEventListener('change', (e) => this.onCoinChange(e.target.value));
        document.getElementById('paperOrderType')?.addEventListener('change', (e) => this.onOrderTypeChange(e.target.value));
        document.getElementById('paperAmount')?.addEventListener('input', () => this.calculateTotal());
        document.getElementById('paperLimitPrice')?.addEventListener('input', () => this.calculateTotal());
        
        // Amount percentage buttons
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setAmountPercent(e.target.dataset.percent));
        });
        
        // Execute order button
        document.getElementById('executePaperOrder')?.addEventListener('click', () => this.executeManualOrder());

        // Whale Alerts
        document.getElementById('whaleAlertsToggle')?.addEventListener('click', () => this.openWhaleAlerts());
        document.getElementById('whaleAlertsClose')?.addEventListener('click', () => this.closeWhaleAlerts());

        // Chart Screenshot Analysis
        document.getElementById('chartAnalysisToggle')?.addEventListener('click', () => this.openChartAnalysis());
        document.getElementById('chartAnalysisClose')?.addEventListener('click', () => this.closeChartAnalysis());
        document.getElementById('uploadChartBtn')?.addEventListener('click', () => document.getElementById('chartImageInput').click());
        document.getElementById('chartImageInput')?.addEventListener('change', (e) => this.handleChartUpload(e));
        document.getElementById('analyzeChartBtn')?.addEventListener('click', () => this.analyzeChartImage());

        // Performance Dashboard
        document.getElementById('performanceDashToggle')?.addEventListener('click', () => this.openPerformanceDashboard());
        document.getElementById('performanceDashClose')?.addEventListener('click', () => this.closePerformanceDashboard());
    }

    // ===== PAPER TRADING =====
    loadPaperPortfolio() {
        const saved = localStorage.getItem('paper_portfolio');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            balance: 10000,
            initialBalance: 10000,
            positions: [],
            trades: []
        };
    }

    savePaperPortfolio() {
        localStorage.setItem('paper_portfolio', JSON.stringify(this.paperPortfolio));
    }

    async openPaperTrading() {
        document.getElementById('paperTradingModal').classList.remove('hidden');
        
        // Load available coins
        await this.loadAvailableCoins();
        
        // Start live price updates
        this.startLivePriceUpdates();
        
        this.updatePaperDisplay();
    }

    closePaperTrading() {
        document.getElementById('paperTradingModal').classList.add('hidden');
        
        // Stop live price updates
        if (this.priceUpdateInterval) {
            clearInterval(this.priceUpdateInterval);
            this.priceUpdateInterval = null;
        }
    }

    async loadAvailableCoins() {
        try {
            const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
            const data = await response.json();
            
            // Filter USDT pairs and sort by volume
            this.availableCoins = data
                .filter(coin => coin.symbol.endsWith('USDT'))
                .map(coin => ({
                    symbol: coin.symbol,
                    name: coin.symbol.replace('USDT', ''),
                    price: parseFloat(coin.lastPrice),
                    change24h: parseFloat(coin.priceChangePercent),
                    volume: parseFloat(coin.volume)
                }))
                .sort((a, b) => b.volume - a.volume)
                .slice(0, 100); // Top 100 by volume
            
            // Populate select dropdown
            const select = document.getElementById('paperCoinSelect');
            select.innerHTML = '<option value="">Select a coin...</option>' +
                this.availableCoins.map(coin => 
                    `<option value="${coin.symbol}">${coin.name} - $${coin.price.toFixed(coin.price < 1 ? 4 : 2)}</option>`
                ).join('');
                
            console.log(`✅ Loaded ${this.availableCoins.length} trading pairs from Binance`);
            
        } catch (error) {
            console.error('Error loading coins:', error);
            document.getElementById('paperCoinSelect').innerHTML = '<option value="">Error loading coins</option>';
        }
    }

    switchOrderType(type) {
        document.querySelectorAll('.order-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');
        
        this.currentOrderType = type;
        document.getElementById('orderBtnText').textContent = type.toUpperCase();
    }

    onCoinChange(symbol) {
        if (!symbol) return;
        
        const coin = this.availableCoins.find(c => c.symbol === symbol);
        if (!coin) return;
        
        this.selectedCoin = coin;
        this.updateCurrentPrice();
    }

    onOrderTypeChange(orderType) {
        const limitPriceGroup = document.getElementById('limitPriceGroup');
        if (orderType === 'limit') {
            limitPriceGroup.style.display = 'block';
        } else {
            limitPriceGroup.style.display = 'none';
        }
    }

    setAmountPercent(percent) {
        if (!this.selectedCoin) {
            alert('Please select a coin first');
            return;
        }
        
        const balance = this.paperPortfolio.balance;
        const price = this.selectedCoin.price;
        const amount = (balance * (percent / 100)) / price;
        
        document.getElementById('paperAmount').value = amount.toFixed(6);
        this.calculateTotal();
    }

    calculateTotal() {
        const amount = parseFloat(document.getElementById('paperAmount').value) || 0;
        const orderType = document.getElementById('paperOrderType').value;
        
        let price;
        if (orderType === 'limit') {
            price = parseFloat(document.getElementById('paperLimitPrice').value) || 0;
        } else {
            price = this.selectedCoin?.price || 0;
        }
        
        const total = amount * price;
        document.getElementById('paperTotalCost').textContent = `$${total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }

    updateCurrentPrice() {
        if (!this.selectedCoin) return;
        
        const priceEl = document.getElementById('paperCurrentPrice');
        const changeEl = document.getElementById('paperPriceChange');
        
        priceEl.textContent = `$${this.selectedCoin.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: this.selectedCoin.price < 1 ? 4 : 2})}`;
        
        const change = this.selectedCoin.change24h;
        changeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
        changeEl.className = `price-change ${change >= 0 ? 'up' : 'down'}`;
    }

    async startLivePriceUpdates() {
        // Update every 2 seconds
        this.priceUpdateInterval = setInterval(async () => {
            await this.updateLivePrices();
        }, 2000);
    }

    async updateLivePrices() {
        if (!this.selectedCoin && this.paperPortfolio.positions.length === 0) return;
        
        try {
            // Get symbols to update
            const symbols = [];
            if (this.selectedCoin) symbols.push(this.selectedCoin.symbol);
            this.paperPortfolio.positions.forEach(pos => {
                const symbol = pos.coin.toUpperCase() + 'USDT';
                if (!symbols.includes(symbol)) symbols.push(symbol);
            });
            
            // Fetch latest prices from Binance
            const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=' + JSON.stringify(symbols));
            const data = await response.json();
            
            // Update selected coin price
            if (this.selectedCoin) {
                const coinData = data.find(d => d.symbol === this.selectedCoin.symbol);
                if (coinData) {
                    this.selectedCoin.price = parseFloat(coinData.price);
                    this.updateCurrentPrice();
                    this.calculateTotal();
                }
            }
            
            // Update position prices
            this.paperPortfolio.positions.forEach(pos => {
                const symbol = pos.coin.toUpperCase() + 'USDT';
                const coinData = data.find(d => d.symbol === symbol);
                if (coinData) {
                    pos.currentPrice = parseFloat(coinData.price);
                    
                    // Calculate P&L
                    const currentValue = pos.amount * pos.currentPrice;
                    const entryValue = pos.amount * pos.entryPrice;
                    pos.pnl = currentValue - entryValue;
                    pos.pnlPercent = (pos.pnl / entryValue) * 100;
                    
                    // Check stop loss and take profit
                    if (pos.stopLoss && pos.currentPrice <= pos.stopLoss) {
                        this.autoClosePaperPosition(pos, 'Stop Loss Hit');
                    } else if (pos.takeProfit && pos.currentPrice >= pos.takeProfit) {
                        this.autoClosePaperPosition(pos, 'Take Profit Hit');
                    }
                }
            });
            
            this.updatePaperDisplay();
            
        } catch (error) {
            console.error('Error updating live prices:', error);
        }
    }

    autoClosePaperPosition(position, reason) {
        const index = this.paperPortfolio.positions.indexOf(position);
        if (index !== -1) {
            this.closePaperPosition(index, position.currentPrice);
            this.app.addMessage(`🔔 ${reason}! Position ${position.coin.toUpperCase()} closed at $${position.currentPrice.toFixed(2)}`, 'ai');
        }
    }

    executeManualOrder() {
        const orderType = this.currentOrderType || 'buy';
        const coin = this.selectedCoin;
        const amount = parseFloat(document.getElementById('paperAmount').value);
        const orderMode = document.getElementById('paperOrderType').value;
        const stopLoss = parseFloat(document.getElementById('paperStopLoss').value) || null;
        const takeProfit = parseFloat(document.getElementById('paperTakeProfit').value) || null;
        
        if (!coin) {
            alert('Please select a coin');
            return;
        }
        
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        let price;
        if (orderMode === 'limit') {
            price = parseFloat(document.getElementById('paperLimitPrice').value);
            if (!price || price <= 0) {
                alert('Please enter a valid limit price');
                return;
            }
        } else {
            price = coin.price;
        }
        
        if (orderType === 'buy') {
            this.executePaperTrade(coin.name, price, amount, takeProfit, stopLoss);
        } else {
            // Sell existing position
            const posIndex = this.paperPortfolio.positions.findIndex(p => p.coin.toLowerCase() === coin.name.toLowerCase());
            if (posIndex !== -1) {
                this.closePaperPosition(posIndex, price);
            } else {
                alert('You don\'t have this coin in your portfolio');
            }
        }
        
        // Clear form
        document.getElementById('paperAmount').value = '';
        document.getElementById('paperStopLoss').value = '';
        document.getElementById('paperTakeProfit').value = '';
        document.getElementById('paperLimitPrice').value = '';
        this.calculateTotal();
    }

    updatePaperDisplay() {
        const totalValue = this.calculatePaperValue();
        const pnl = totalValue - this.paperPortfolio.initialBalance;
        const pnlPercent = (pnl / this.paperPortfolio.initialBalance) * 100;

        document.getElementById('paperBalance').textContent = `$${totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('paperPnL').textContent = `${pnl >= 0 ? '+' : ''}$${Math.abs(pnl).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} (${pnl >= 0 ? '+' : ''}${pnlPercent.toFixed(2)}%)`;
        document.getElementById('paperPnL').style.color = pnl >= 0 ? '#00ff88' : '#ff4444';

        // Display positions
        const positionsList = document.getElementById('paperPositionsList');
        if (this.paperPortfolio.positions.length === 0) {
            positionsList.innerHTML = '<p style="text-align: center; opacity: 0.6; padding: 40px;">No positions yet. Place your first order!</p>';
        } else {
            positionsList.innerHTML = this.paperPortfolio.positions.map((pos, index) => {
                const pnlColor = pos.pnl >= 0 ? '#00ff88' : '#ff4444';
                return `
                <div class="paper-position">
                    <div class="position-info">
                        <div class="position-coin">${pos.coin.toUpperCase()}</div>
                        <div class="position-details">
                            ${pos.amount.toFixed(4)} @ $${pos.entryPrice.toFixed(2)}<br>
                            Current: $${pos.currentPrice.toFixed(2)}
                            ${pos.stopLoss ? `<br>SL: $${pos.stopLoss.toFixed(2)}` : ''}
                            ${pos.takeProfit ? ` TP: $${pos.takeProfit.toFixed(2)}` : ''}
                        </div>
                    </div>
                    <div class="position-pnl">
                        <div class="pnl-value" style="color: ${pnlColor};">
                            ${pos.pnl >= 0 ? '+' : ''}$${Math.abs(pos.pnl).toFixed(2)}
                        </div>
                        <div class="pnl-percent" style="color: ${pnlColor};">
                            ${pos.pnlPercent >= 0 ? '+' : ''}${pos.pnlPercent.toFixed(2)}%
                        </div>
                    </div>
                    <button class="btn-secondary" onclick="window.samCryptoAI.newFeatures.closePaperPosition(${index}, ${pos.currentPrice})" style="padding: 8px 16px; font-size: 12px;">Close</button>
                </div>
            `}).join('');
        }
    }

    calculatePaperValue() {
        let total = this.paperPortfolio.balance;
        // Add current value of all positions
        this.paperPortfolio.positions.forEach(pos => {
            // Get current price from app
            const currentPrice = pos.currentPrice || pos.entryPrice;
            total += pos.amount * currentPrice;
        });
        return total;
    }

    resetPaperAccount() {
        if (confirm('Reset paper trading account to $10,000? All positions will be closed.')) {
            this.paperPortfolio = {
                balance: 10000,
                initialBalance: 10000,
                positions: [],
                trades: []
            };
            this.savePaperPortfolio();
            this.updatePaperDisplay();
            this.app.addMessage('✅ Paper trading account reset to $10,000', 'ai');
        }
    }

    comparePaperToLive() {
        const paperValue = this.calculatePaperValue();
        const liveValue = this.app.portfolio.totalValue + (this.app.portfolio.usdtBalance || 0);
        
        const message = `📊 **Portfolio Comparison**\n\n🎮 **Paper Trading:** $${paperValue.toLocaleString()}\n💰 **Live Portfolio:** $${liveValue.toLocaleString()}\n\n${paperValue > liveValue ? '🎉 Paper portfolio is performing better!' : '💡 Live portfolio is ahead!'}`;
        this.app.addMessage(message, 'ai');
    }

    // Execute a paper trade
    executePaperTrade(coin, entryPrice, amount, targetPrice, stopLoss) {
        const cost = amount * entryPrice;
        
        if (cost > this.paperPortfolio.balance) {
            this.app.addMessage(`❌ Insufficient paper balance! You have $${this.paperPortfolio.balance.toFixed(2)} but need $${cost.toFixed(2)}`, 'ai');
            return false;
        }

        // Deduct from balance
        this.paperPortfolio.balance -= cost;

        // Add position
        const position = {
            coin: coin,
            amount: amount,
            entryPrice: entryPrice,
            currentPrice: entryPrice,
            targetPrice: targetPrice,
            stopLoss: stopLoss,
            pnl: 0,
            pnlPercent: 0,
            timestamp: Date.now()
        };

        this.paperPortfolio.positions.push(position);
        
        // Add to trade history
        this.paperPortfolio.trades.push({
            ...position,
            status: 'open'
        });

        this.savePaperPortfolio();
        
        const message = `✅ **Paper Trade Executed!**\n\n🎮 Bought ${amount.toFixed(4)} ${coin.toUpperCase()} @ $${entryPrice.toFixed(2)}\n💰 Cost: $${cost.toFixed(2)}\n💵 Remaining Balance: $${this.paperPortfolio.balance.toFixed(2)}\n\n📊 Open Paper Trading dashboard to track this position!`;
        this.app.addMessage(message, 'ai');
        
        return true;
    }

    // Close a paper position
    closePaperPosition(index, currentPrice) {
        const position = this.paperPortfolio.positions[index];
        if (!position) return false;

        const proceeds = position.amount * currentPrice;
        const profit = proceeds - (position.amount * position.entryPrice);
        const profitPercent = (profit / (position.amount * position.entryPrice)) * 100;

        // Add proceeds back to balance
        this.paperPortfolio.balance += proceeds;

        // Update trade in history
        const trade = this.paperPortfolio.trades.find(t => 
            t.coin === position.coin && t.timestamp === position.timestamp
        );
        if (trade) {
            trade.status = 'closed';
            trade.exitPrice = currentPrice;
            trade.profit = profit;
            trade.profitPercent = profitPercent;
        }

        // Remove from positions
        this.paperPortfolio.positions.splice(index, 1);
        
        this.savePaperPortfolio();

        const message = `✅ **Paper Position Closed!**\n\n🎮 Sold ${position.amount.toFixed(4)} ${position.coin.toUpperCase()} @ $${currentPrice.toFixed(2)}\n💰 Profit: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)} (${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%)\n💵 New Balance: $${this.paperPortfolio.balance.toFixed(2)}`;
        this.app.addMessage(message, 'ai');

        return true;
    }

    // ===== WHALE ALERTS =====
    async startWhaleAlertFeed() {
        // Simulate whale alerts (in production, use real Whale Alert API)
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every interval
                this.addSimulatedWhaleAlert();
            }
        }, 30000); // Every 30 seconds
    }

    addSimulatedWhaleAlert() {
        const coins = ['Bitcoin', 'Ethereum', 'USDT', 'BNB', 'XRP'];
        const coin = coins[Math.floor(Math.random() * coins.length)];
        const amount = (Math.random() * 50 + 1) * 1000000; // $1M - $51M
        
        const alert = {
            coin: coin,
            amount: amount,
            timestamp: Date.now(),
            type: Math.random() > 0.5 ? 'transfer' : 'exchange'
        };

        this.whaleAlerts.unshift(alert);
        if (this.whaleAlerts.length > 50) this.whaleAlerts.pop();

        // Update count
        document.getElementById('whaleCount').textContent = this.whaleAlerts.length;
    }

    openWhaleAlerts() {
        document.getElementById('whaleAlertsModal').classList.remove('hidden');
        this.displayWhaleAlerts();
    }

    closeWhaleAlerts() {
        document.getElementById('whaleAlertsModal').classList.add('hidden');
    }

    displayWhaleAlerts() {
        const list = document.getElementById('whaleAlertsList');
        
        if (this.whaleAlerts.length === 0) {
            list.innerHTML = '<p class="loading-text">No whale alerts yet. Monitoring...</p>';
            return;
        }

        list.innerHTML = this.whaleAlerts.map(alert => {
            const timeAgo = this.getTimeAgo(alert.timestamp);
            return `
                <div class="whale-alert-item">
                    <div class="whale-icon">🐋</div>
                    <div class="whale-info">
                        <div class="whale-amount">$${(alert.amount / 1000000).toFixed(2)}M</div>
                        <div class="whale-coin">${alert.coin} • ${alert.type}</div>
                    </div>
                    <div class="whale-time">${timeAgo}</div>
                </div>
            `;
        }).join('');
    }

    getTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    }

    // ===== CHART SCREENSHOT ANALYSIS =====
    openChartAnalysis() {
        document.getElementById('chartAnalysisModal').classList.remove('hidden');
    }

    closeChartAnalysis() {
        document.getElementById('chartAnalysisModal').classList.add('hidden');
    }

    handleChartUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.uploadedChartImage = e.target.result;
            document.getElementById('chartPreviewImg').src = e.target.result;
            document.getElementById('chartPreview').classList.remove('hidden');
            document.getElementById('analyzeChartBtn').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    async analyzeChartImage() {
        const analyzeBtn = document.getElementById('analyzeChartBtn');
        const resultDiv = document.getElementById('chartAnalysisResult');
        const resultText = document.getElementById('chartAnalysisText');

        analyzeBtn.textContent = '🤖 Analyzing...';
        analyzeBtn.disabled = true;

        try {
            // Use Gemini Vision API to analyze the chart
            const base64Image = this.uploadedChartImage.split(',')[1];
            
            const response = await fetch(`${this.app.geminiAPI}?key=${this.app.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            {
                                text: "You are a professional crypto trader. Analyze this trading chart screenshot and provide: 1) What coin/timeframe you see, 2) Current trend (bullish/bearish/sideways), 3) Key support/resistance levels, 4) Technical patterns visible, 5) Trading recommendation (BUY/SELL/WAIT) with entry, target, and stop-loss. Be specific and actionable."
                            },
                            {
                                inline_data: {
                                    mime_type: "image/jpeg",
                                    data: base64Image
                                }
                            }
                        ]
                    }]
                })
            });

            const data = await response.json();
            const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Could not analyze chart. Please try again.';

            resultText.innerHTML = analysis.replace(/\n/g, '<br>');
            resultDiv.classList.remove('hidden');

        } catch (error) {
            console.error('Chart analysis error:', error);
            resultText.innerHTML = '❌ Analysis failed. Please ensure you have a valid API key and try again.';
            resultDiv.classList.remove('hidden');
        }

        analyzeBtn.textContent = '🤖 Analyze Chart';
        analyzeBtn.disabled = false;
    }

    // ===== PERFORMANCE DASHBOARD =====
    loadPerformanceData() {
        const saved = localStorage.getItem('performance_data');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            signals: [],
            totalSignals: 0,
            wins: 0,
            losses: 0,
            pending: 0,
            totalReturn: 0
        };
    }

    savePerformanceData() {
        localStorage.setItem('performance_data', JSON.stringify(this.performanceData));
    }

    openPerformanceDashboard() {
        document.getElementById('performanceDashModal').classList.remove('hidden');
        this.updatePerformanceDisplay();
    }

    closePerformanceDashboard() {
        document.getElementById('performanceDashModal').classList.add('hidden');
    }

    updatePerformanceDisplay() {
        const winRate = this.performanceData.totalSignals > 0 
            ? (this.performanceData.wins / this.performanceData.totalSignals * 100).toFixed(1)
            : 0;

        document.getElementById('totalSignals').textContent = this.performanceData.totalSignals;
        document.getElementById('signalWinRate').textContent = `${winRate}%`;
        document.getElementById('totalReturn').textContent = `${this.performanceData.totalReturn >= 0 ? '+' : ''}${this.performanceData.totalReturn.toFixed(1)}%`;
        
        // Update win rate in features page
        document.getElementById('winRate').textContent = `${winRate}%`;

        // Find best trade
        const bestTrade = this.performanceData.signals.reduce((best, signal) => {
            return (!best || signal.return > best.return) ? signal : best;
        }, null);
        document.getElementById('bestTrade').textContent = bestTrade ? `${bestTrade.coin} +${bestTrade.return}%` : '-';

        // Display signals history
        this.displaySignalsHistory();
    }

    displaySignalsHistory() {
        const list = document.getElementById('signalsHistoryList');
        
        if (this.performanceData.signals.length === 0) {
            list.innerHTML = '<p class="loading-text">No signals yet. Start trading to track performance!</p>';
            return;
        }

        list.innerHTML = this.performanceData.signals.slice(0, 20).map(signal => {
            const statusClass = signal.status === 'win' ? 'win' : signal.status === 'loss' ? 'loss' : 'pending';
            const statusIcon = signal.status === 'win' ? '✅' : signal.status === 'loss' ? '❌' : '⏳';
            
            return `
                <div class="signal-history-item">
                    <div>
                        <div class="signal-coin">${signal.coin.toUpperCase()}</div>
                        <div style="font-size: 12px; opacity: 0.7;">${new Date(signal.timestamp).toLocaleDateString()}</div>
                    </div>
                    <div class="signal-result ${statusClass}">
                        <span>${statusIcon}</span>
                        <span>${signal.status === 'pending' ? 'Pending' : `${signal.return >= 0 ? '+' : ''}${signal.return}%`}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Track new signal
    trackSignal(coin, entryPrice, targetPrice, stopLoss) {
        const signal = {
            coin: coin,
            entryPrice: entryPrice,
            targetPrice: targetPrice,
            stopLoss: stopLoss,
            timestamp: Date.now(),
            status: 'pending',
            return: 0
        };

        this.performanceData.signals.unshift(signal);
        this.performanceData.totalSignals++;
        this.performanceData.pending++;
        this.savePerformanceData();
    }

    // Update signal result
    updateSignalResult(signalIndex, currentPrice) {
        const signal = this.performanceData.signals[signalIndex];
        if (signal.status !== 'pending') return;

        const returnPercent = ((currentPrice - signal.entryPrice) / signal.entryPrice) * 100;

        if (currentPrice >= signal.targetPrice) {
            signal.status = 'win';
            signal.return = returnPercent;
            this.performanceData.wins++;
            this.performanceData.pending--;
            this.performanceData.totalReturn += returnPercent;
        } else if (currentPrice <= signal.stopLoss) {
            signal.status = 'loss';
            signal.return = returnPercent;
            this.performanceData.losses++;
            this.performanceData.pending--;
            this.performanceData.totalReturn += returnPercent;
        }

        this.savePerformanceData();
    }
}

// Export for use in main script
window.NewFeatures = NewFeatures;
