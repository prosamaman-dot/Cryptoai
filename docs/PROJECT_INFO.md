# 📋 SamCrypto AI - Project Information

## 🏗️ Architecture Overview

### Frontend Architecture
- **Vanilla JavaScript** - No framework dependencies
- **Modular Design** - Separated concerns with clean file structure
- **Event-Driven** - Real-time updates and user interactions
- **Responsive Design** - Mobile-first approach

### Data Flow
```
User Input → AI Processing → Market Data → Analysis → UI Update
     ↓              ↑              ↑            ↑         ↑
Voice/Text → Gemini 2.5 Pro → Real-time APIs → Portfolio → Charts
```

### File Structure Details

#### `/css/` - Stylesheets
- `styles.css` - Main application styles and layout
- `auth-styles.css` - User authentication UI components
- `performance.css` - Performance optimizations and animations
- `auth-fix.css` - Authentication bug fixes and improvements
- `features-page.css` - Features page and modal styling
- `voice-input.css` - Voice input interface styling

#### `/js/` - JavaScript Modules
- `script.js` - Main application logic (186KB+)
  - SamCryptoAI class
  - Market data integration
  - AI response handling
  - Portfolio management
  - Technical analysis
- `user-manager.js` - User management system (37KB+)
  - Authentication
  - Data persistence
  - User profiles
  - Session management

#### `/docs/` - Documentation
- `README.md` - Main project documentation
- `DATA_PERSISTENCE_FIX.md` - Data storage fixes
- `DEBUG_GUIDE.md` - Debugging instructions
- `EXPORT_IMPORT_GUIDE.md` - User data management
- `MOBILE_PERMISSIONS.md` - Mobile device permissions
- `VOICE_PERMISSION_GUIDE.md` - Voice input setup
- `TEST_AUTH.md` - Authentication testing
- `MANUAL_TEST_CHECKLIST.md` - QA testing procedures

### API Integration

#### AI Services
- **Google Gemini 2.5 Pro**
  - Model: `gemini-2.5-pro`
  - Rate limit: 1 RPM / 447K TPM
  - Context window: 2M+ tokens
  - Enhanced reasoning capabilities

#### Market Data Sources
1. **CoinGecko API** (Primary)
   - Comprehensive market data
   - Historical prices
   - Technical indicators
   - Market rankings

2. **Binance API** (Secondary)
   - High-frequency data
   - Trading pairs
   - 24h statistics
   - Real-time prices

3. **CoinCap API** (Tertiary)
   - Alternative price source
   - Market validation
   - Redundancy backup
   - Asset information

### Performance Optimizations

#### Caching Strategy
- **30-second TTL** for market data
- **Request deduplication** to prevent API spam
- **Intelligent fallback** between data sources
- **LocalStorage persistence** for user data

#### User Experience
- **Real-time updates** every 30 seconds
- **Smooth animations** with CSS transitions
- **Progressive loading** for better perceived performance
- **Offline capability** with cached data

### Security Features

#### Data Protection
- **Client-side encryption** for sensitive data
- **No API key exposure** (built-in Gemini key)
- **Secure session management** with tokens
- **Input validation** and sanitization

#### Privacy
- **Local data storage** - no external servers
- **Optional user accounts** - guest mode available
- **Data export/import** - user owns their data
- **No tracking** - privacy-first approach

### Browser Compatibility

#### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

#### Required Features
- ES6+ JavaScript support
- Fetch API
- LocalStorage
- WebRTC (for voice input)
- Canvas API (for charts)

### Development Guidelines

#### Code Standards
- **ESNext syntax** with backward compatibility
- **Modular architecture** for maintainability
- **Error handling** with graceful degradation
- **Console logging** for debugging

#### Testing Approach
- **Manual testing** with comprehensive checklists
- **Cross-browser testing** for compatibility
- **Mobile testing** for responsive design
- **Performance monitoring** for optimization

### Deployment Options

#### GitHub Pages (Recommended)
```bash
1. Push to GitHub repository
2. Enable Pages in settings
3. Deploy from main branch
4. Access at https://username.github.io/repo
```

#### Local Development
```bash
# Option 1: Direct file access
open index.html

# Option 2: Local server
python -m http.server 8000
# Access at http://localhost:8000
```

#### Custom Hosting
- Any static file hosting service
- CDN deployment
- Custom domain support
- SSL certificate recommended

---

**Built with ❤️ for the crypto community**
