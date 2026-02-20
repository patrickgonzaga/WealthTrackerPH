# WealthTrackPH

<div align="center">

![WealthTrackPH Logo](https://img.shields.io/badge/WealthTrackPH-Wealth%20Management-blue?style=for-the-badge&logo=finance)

**Personal Wealth Management Dashboard for Filipino Users**

[![GitHub stars](https://img.shields.io/github/stars/patrickgonzaga/WealthTrackerPH?style=flat-square)](https://github.com/patrickgonzaga/WealthTrackerPH/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/patrickgonzaga/WealthTrackerPH?style=flat-square)](https://github.com/patrickgonzaga/WealthTrackerPH/network)
[![GitHub issues](https://img.shields.io/github/issues/patrickgonzaga/WealthTrackerPH?style=flat-square)](https://github.com/patrickgonzaga/WealthTrackerPH/issues)
[![License](https://img.shields.io/github/license/patrickgonzaga/WealthTrackerPH?style=flat-square)](https://github.com/patrickgonzaga/WealthTrackerPH/blob/main/LICENSE)

[Live Demo](https://wealthtrackph.netlify.app) | [Web App](#web-version) | [Mobile App](#mobile-version) | [Documentation](#documentation)

</div>

## 📖 About

WealthTrackPH is a comprehensive wealth tracking application designed specifically for Filipino users. It provides real-time portfolio management across multiple asset types, helping users monitor and grow their wealth effectively.

### 🎯 Key Features

- **Multi-Asset Support**: Track savings, stocks, crypto, forex, and time deposits
- **Real-time Dashboard**: Interactive charts and portfolio overview
- **Risk Analysis**: Visual risk distribution and allocation insights
- **CRUD Operations**: Full create, read, update, delete functionality for all assets
- **User Authentication**: Secure login and data protection
- **Cross-Platform**: Web and mobile applications
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🚀 Live Demo

Experience WealthTrackPH live at: **[https://wealthtrackph.netlify.app](https://wealthtrackph.netlify.app)**

## 📱 Screenshots

### Web Dashboard

#### Main Dashboard
![Web Dashboard](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=WealthTrackPH+Web+Dashboard)
*Comprehensive overview of all assets with real-time valuations*

#### Asset Management
![Asset Management](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Asset+Management+Interface)
*Detailed view of individual asset types with editing capabilities*

#### Risk Distribution
![Risk Analysis](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Risk+Distribution+Chart)
*Visual representation of portfolio risk across different asset classes*

### Mobile Application

#### Mobile Dashboard
![Mobile Dashboard](https://via.placeholder.com/300x600/1a1a1a/ffffff?text=Mobile+Dashboard)
*Optimized mobile interface with touch-friendly controls*

#### Asset Lists
![Mobile Assets](https://via.placeholder.com/300x600/1a1a1a/ffffff?text=Asset+Lists)
*Scrollable lists with quick actions for asset management*

#### Add/Edit Forms
![Mobile Forms](https://via.placeholder.com/300x600/1a1a1a/ffffff?text=Add+Asset+Form)
*Streamlined forms for adding and updating assets*

## 🛠️ Technology Stack

### Web Version
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL + Auth)

### Mobile Version
- **Framework**: Flutter
- **State Management**: Riverpod
- **Backend**: Supabase Flutter SDK
- **Platform**: Android & iOS

## 📦 Installation

### Web Version

1. **Clone the repository**
```bash
git clone https://github.com/patrickgonzaga/WealthTrackerPH.git
cd WealthTrackerPH/web
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

4. **Run the development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
npm start
```

### Mobile Version

1. **Prerequisites**
- Flutter SDK (>=3.9.0)
- Android Studio / Xcode
- Supabase project

2. **Clone and navigate to mobile app**
```bash
git clone https://github.com/patrickgonzaga/WealthTrackerPH.git
cd WealthTrackerPH/mobile_app
```

3. **Install dependencies**
```bash
flutter pub get
```

4. **Configure Supabase**
- Update `lib/core/constants.dart` with your Supabase URL and anon key

5. **Run the app**
```bash
flutter run
```

6. **Build APK**
```bash
flutter build apk --release
```

## 🔧 Configuration

### Supabase Setup

1. **Create a new project** at [supabase.com](https://supabase.com)
2. **Run the migration script** located in `web/supabase/migration.sql`
3. **Set up Row Level Security (RLS)** policies for data protection
4. **Get your project URL and anon key** from Supabase settings
5. **Configure environment variables** in both web and mobile apps

### Environment Variables

#### Web (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Mobile (lib/core/constants.dart)
```dart
class AppConstants {
  static const String supabaseUrl = 'your_supabase_url';
  static const String supabaseAnonKey = 'your_supabase_anon_key';
}
```

## 📊 Features Overview

### Asset Types Supported

| Asset Type | Description | Features |
|------------|-------------|----------|
| 💰 **Savings** | Bank accounts and cash savings | Balance tracking, account management |
| 📈 **Stocks** | Equity investments | Quantity, current price, total value |
| 💎 **Crypto** | Cryptocurrency holdings | Real-time price tracking |
| 💱 **Forex** | Foreign exchange positions | Currency pair management |
| 🏦 **Time Deposits** | Fixed-term deposits | Interest calculation, maturity tracking |

### Dashboard Features

- **Net Worth Overview**: Total portfolio value with allocation percentages
- **Risk Distribution**: Visual chart showing asset allocation by risk level
- **Asset Registry**: Quick access to all asset types
- **Recent Activity**: Latest transactions and updates
- **Performance Metrics**: Gains, losses, and portfolio changes

## 🎨 UI/UX Highlights

- **Dark Theme**: Easy on the eyes for extended use
- **Glass Morphism**: Modern, translucent design elements
- **Responsive Layout**: Adapts seamlessly to different screen sizes
- **Micro-interactions**: Smooth animations and transitions
- **Accessibility**: WCAG compliant design patterns

## 🔐 Security

- **User Authentication**: Secure login with Supabase Auth
- **Row Level Security**: Data isolation between users
- **API Key Protection**: Environment-based configuration
- **HTTPS**: Encrypted data transmission
- **Input Validation**: Client and server-side validation

## 📱 Deployment

### Web Deployment (Netlify)

1. **Push to GitHub** (already done!)
2. **Connect Netlify** to your GitHub repository
3. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `out`
4. **Add environment variables** in Netlify dashboard
5. **Deploy automatically** on git push

### Mobile Deployment

#### Android
```bash
# Build release APK
flutter build apk --release

# Install on device
adb install build/app/outputs/flutter-apk/app-release.apk
```

#### iOS (requires Mac)
```bash
# Build for iOS
flutter build ios --release

# Use Xcode to upload to App Store
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Roadmap

- [ ] **Portfolio Analytics**: Advanced performance metrics
- [ ] **Goal Setting**: Financial goals and tracking
- [ ] **Import/Export**: CSV and PDF reports
- [ ] **Notifications**: Price alerts and reminders
- [ ] **Multi-currency**: Support for different currencies
- [ ] **Budget Tracking**: Expense management features
- [ ] **Investment Suggestions**: AI-powered recommendations

## 🐛 Bug Reports & Feature Requests

- **Bug Reports**: [Create an issue](https://github.com/patrickgonzaga/WealthTrackerPH/issues/new?template=bug_report.md)
- **Feature Requests**: [Create an issue](https://github.com/patrickgonzaga/WealthTrackerPH/issues/new?template=feature_request.md)

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the amazing backend-as-a-service platform
- **Next.js** team for the excellent React framework
- **Flutter** team for cross-platform development tools
- **Netlify** for seamless deployment solutions
- **Filipino community** for inspiration and feedback

## 📞 Support

- 📧 Email: support@wealthtrackph.com
- 💬 Discord: [Join our community](https://discord.gg/wealthtrackph)
- 🐦 Twitter: [@WealthTrackPH](https://twitter.com/wealthtrackph)
- 📱 GitHub Issues: [Report problems](https://github.com/patrickgonzaga/WealthTrackerPH/issues)

---

<div align="center">

**Made with ❤️ for Filipino investors**

[⭐ Star this repo](https://github.com/patrickgonzaga/WealthTrackerPH) | [🍴 Fork on GitHub](https://github.com/patrickgonzaga/WealthTrackerPH/fork) | [📖 Read the docs](#documentation)

</div>
