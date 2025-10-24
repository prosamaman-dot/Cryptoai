// Auth Screen - Particle Animation & Logic
// Converted from React/Framer Motion to Vanilla JS

class AuthScreen {
    constructor() {
        this.canvas = document.getElementById('authParticles');
        this.ctx = this.canvas?.getContext('2d');
        this.particles = [];
        this.animationFrame = null;
        this.isVisible = true;
        
        this.init();
    }
    
    init() {
        if (!this.canvas || !this.ctx) return;
        
        // Setup canvas
        this.setCanvasSize();
        window.addEventListener('resize', () => this.onResize());
        
        // Initialize particles
        this.initParticles();
        
        // Start animation
        this.animate();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Check if user is already logged in
        this.checkAuthStatus();
    }
    
    setCanvasSize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    initParticles() {
        if (!this.canvas) return;
        this.particles = [];
        const count = Math.floor((this.canvas.width * this.canvas.height) / 9000);
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        if (!this.canvas) return null;
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            velocity: Math.random() * 0.25 + 0.05,
            opacity: Math.random() * 0.35 + 0.15
        };
    }
    
    animate() {
        if (!this.ctx || !this.canvas) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            if (!particle) return;
            
            // Move particle up
            particle.y -= particle.velocity;
            
            // Reset particle when it goes off screen
            if (particle.y < 0) {
                particle.x = Math.random() * this.canvas.width;
                particle.y = this.canvas.height + Math.random() * 40;
                particle.velocity = Math.random() * 0.25 + 0.05;
                particle.opacity = Math.random() * 0.35 + 0.15;
            }
            
            // Draw particle
            this.ctx.fillStyle = `rgba(250, 250, 250, ${particle.opacity})`;
            this.ctx.fillRect(particle.x, particle.y, 0.7, 2.2);
        });
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    onResize() {
        this.setCanvasSize();
        this.initParticles();
    }
    
    setupEventListeners() {
        // Password toggle
        const toggleBtn = document.getElementById('authPasswordToggle');
        const passwordInput = document.getElementById('auth-password');
        const eyeIcon = document.getElementById('authEyeIcon');
        const eyeOffIcon = document.getElementById('authEyeOffIcon');
        
        toggleBtn?.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            eyeIcon.style.display = isPassword ? 'none' : 'block';
            eyeOffIcon.style.display = isPassword ? 'block' : 'none';
        });
        
        // Tab switching (Login/Signup)
        const tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const mode = tab.dataset.tab;
                this.switchMode(mode);
            });
        });
        
        // Footer toggle link
        const toggleLink = document.getElementById('authToggleLink');
        toggleLink?.addEventListener('click', (e) => {
            e.preventDefault();
            const activeTab = document.querySelector('.auth-tab.active');
            const currentMode = activeTab?.dataset.tab || 'login';
            this.switchMode(currentMode === 'login' ? 'signup' : 'login');
        });
        
        // Continue button
        const continueBtn = document.getElementById('authContinueBtn');
        continueBtn?.addEventListener('click', () => {
            const activeTab = document.querySelector('.auth-tab.active');
            const mode = activeTab?.dataset.tab || 'login';
            if (mode === 'signup') {
                this.handleSignup();
            } else {
                this.handleLogin();
            }
        });
        
        // Enter key to submit
        const nameInput = document.getElementById('auth-name');
        const emailInput = document.getElementById('auth-email');
        
        nameInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.handleSignup();
        });
        emailInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const activeTab = document.querySelector('.auth-tab.active');
                const mode = activeTab?.dataset.tab || 'login';
                mode === 'signup' ? this.handleSignup() : this.handleLogin();
            }
        });
        passwordInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const activeTab = document.querySelector('.auth-tab.active');
                const mode = activeTab?.dataset.tab || 'login';
                mode === 'signup' ? this.handleSignup() : this.handleLogin();
            }
        });
    }
    
    switchMode(mode) {
        // Update tabs
        const tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach(tab => {
            if (tab.dataset.tab === mode) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Update content
        const nameGroup = document.getElementById('authNameGroup');
        const rememberRow = document.querySelector('.auth-remember-row');
        const title = document.getElementById('authTitle');
        const desc = document.getElementById('authDesc');
        const continueBtn = document.getElementById('authContinueBtn');
        const footerText = document.getElementById('authFooterText');
        const toggleLink = document.getElementById('authToggleLink');
        
        if (mode === 'signup') {
            // Show name field
            if (nameGroup) nameGroup.style.display = 'grid';
            // Hide remember me
            if (rememberRow) rememberRow.style.display = 'none';
            // Update text
            if (title) title.textContent = 'Create account';
            if (desc) desc.textContent = 'Sign up to get started';
            if (continueBtn) continueBtn.textContent = 'Create Account';
            if (footerText) footerText.textContent = 'Already have an account?';
            if (toggleLink) toggleLink.textContent = 'Sign in';
        } else {
            // Hide name field
            if (nameGroup) nameGroup.style.display = 'none';
            // Show remember me
            if (rememberRow) rememberRow.style.display = 'flex';
            // Update text
            if (title) title.textContent = 'Welcome back';
            if (desc) desc.textContent = 'Sign in to your account';
            if (continueBtn) continueBtn.textContent = 'Continue';
            if (footerText) footerText.textContent = "Don't have an account?";
            if (toggleLink) toggleLink.textContent = 'Create one';
        }
    }
    
    checkAuthStatus() {
        // Wait a moment for UserManager to initialize
        setTimeout(() => {
            // Check if user is already logged in
            const userManager = window.samCrypto?.userManager;
            
            // Check multiple ways to see if user is logged in
            const hasSession = localStorage.getItem('samcrypto_session');
            const currentUser = userManager?.currentUser;
            const isLoggedIn = userManager?.isLoggedIn?.();
            
            console.log('🔍 Checking auth status:', {
                hasSession: !!hasSession,
                currentUser: !!currentUser,
                isLoggedIn: isLoggedIn
            });
            
            if ((hasSession && currentUser) || isLoggedIn) {
                console.log('✅ User already logged in, hiding auth screen');
                this.hide();
            } else {
                console.log('🔐 No user logged in, showing auth screen');
                this.show();
            }
        }, 500); // Wait 500ms for UserManager to load
    }
    
    handleLogin() {
        const email = document.getElementById('auth-email')?.value;
        const password = document.getElementById('auth-password')?.value;
        
        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }
        
        console.log('🔐 Attempting login:', email);
        
        // Try to login with existing UserManager
        const userManager = window.samCrypto?.userManager;
        if (userManager) {
            // Check if user exists
            const users = Object.values(userManager.users);
            const user = users.find(u => u.email === email);
            
            if (user && user.password === password) {
                // Successful login
                console.log('✅ Login successful');
                userManager.currentUser = user;
                
                // Set session (correct method name)
                if (typeof userManager.setSession === 'function') {
                    userManager.setSession(user.id, true);
                } else {
                    // Fallback: save session directly
                    localStorage.setItem('samcrypto_session', JSON.stringify({
                        userId: user.id,
                        loginTime: Date.now()
                    }));
                }
                
                // Update UI
                if (typeof userManager.updateUIForLoggedInUser === 'function') {
                    userManager.updateUIForLoggedInUser();
                }
                
                this.hide();
            } else if (user) {
                // Wrong password
                alert('❌ Invalid password');
            } else {
                // User not found
                alert('❌ No account found with this email. Please sign up first.');
            }
        } else {
            // No user manager yet, just hide auth screen
            console.log('⚠️ No UserManager found, hiding auth screen');
            this.hide();
        }
    }
    
    handleSignup() {
        const name = document.getElementById('auth-name')?.value;
        const email = document.getElementById('auth-email')?.value;
        const password = document.getElementById('auth-password')?.value;
        
        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        
        console.log('📝 Attempting signup:', email);
        
        // Try to signup with existing UserManager
        const userManager = window.samCrypto?.userManager;
        if (userManager) {
            // Check if user already exists
            const users = Object.values(userManager.users);
            const existingUser = users.find(u => u.email === email);
            
            if (existingUser) {
                alert('❌ An account with this email already exists. Please login instead.');
                this.switchMode('login');
                return;
            }
            
            // Create new user
            const userId = 'user_' + Date.now();
            const newUser = {
                id: userId,
                name: name,
                email: email,
                password: password,
                createdAt: new Date().toISOString(),
                portfolio: {
                    totalValue: 0,
                    totalPnL: 0,
                    totalPnLPercent: 0,
                    holdings: [],
                    usdtBalance: 0
                },
                alerts: [],
                chatHistory: [],
                conversationMemory: {
                    userContext: {},
                    preferences: {},
                    pastConversations: [],
                    learnings: {}
                },
                preferences: {},
                stats: {
                    totalMessages: 0,
                    lastActive: Date.now()
                }
            };
            
            // Save user
            userManager.users[userId] = newUser;
            
            // Save to localStorage (use correct method)
            if (typeof userManager.saveUsers === 'function') {
                userManager.saveUsers();
            } else {
                // Fallback: save directly to localStorage
                localStorage.setItem('samcrypto_users', JSON.stringify(userManager.users));
            }
            
            // Login the new user
            userManager.currentUser = newUser;
            
            // Set session (correct method name)
            if (typeof userManager.setSession === 'function') {
                userManager.setSession(userId, true);
            } else {
                // Fallback: save session directly
                localStorage.setItem('samcrypto_session', JSON.stringify({
                    userId: userId,
                    loginTime: Date.now()
                }));
            }
            
            // Update UI
            if (typeof userManager.updateUIForLoggedInUser === 'function') {
                userManager.updateUIForLoggedInUser();
            }
            
            console.log('✅ Signup successful!');
            
            // Hide auth screen immediately
            this.hide();
            
            // Show welcome message after auth screen is hidden
            setTimeout(() => {
                alert(`🎉 Welcome ${name}! Your account has been created.`);
            }, 100);
        } else {
            // No user manager yet, just hide auth screen
            console.log('⚠️ No UserManager found, hiding auth screen');
            this.hide();
        }
    }
    
    show() {
        const authScreen = document.getElementById('authScreen');
        if (authScreen) {
            authScreen.classList.remove('hidden');
            this.isVisible = true;
            
            // Hide main chat
            const chatContainer = document.querySelector('.chat-container');
            if (chatContainer) {
                chatContainer.style.display = 'none';
            }
        }
    }
    
    hide() {
        const authScreen = document.getElementById('authScreen');
        if (authScreen) {
            authScreen.classList.add('hidden');
            this.isVisible = false;
            
            // Show main chat
            const chatContainer = document.querySelector('.chat-container');
            if (chatContainer) {
                chatContainer.style.display = 'flex';
            }
            
            // Stop animation to save resources
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
            }
        }
    }
    
    destroy() {
        window.removeEventListener('resize', () => this.onResize());
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Initialize auth screen when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.authScreen = new AuthScreen();
    console.log('🔐 Auth screen initialized');
});
