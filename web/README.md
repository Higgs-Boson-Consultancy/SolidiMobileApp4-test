# Solidi Web Platform

This is the web version of the Solidi Mobile App, built with React Native Web. It shares the same codebase as the mobile app while providing a desktop-optimized experience.

## 🚀 Features

- **Responsive Design**: Works on desktop, tablet, and mobile browsers
- **Shared Codebase**: Reuses components and logic from the React Native mobile app
- **Modern UI**: Clean, professional interface optimized for web
- **Fast Development**: Hot reload for instant feedback

## 📁 Project Structure

```
web/
├── public/              # Static assets
│   └── index.html      # Main HTML with responsive CSS
├── src/
│   ├── index.js        # Web entry point
│   └── SolidiWebApp.js # Main web application component
├── config-overrides.js # Webpack customization
├── .babelrc           # Babel configuration
└── package.json       # Dependencies

../src/                 # Shared mobile app code
```

## 🛠️ Development

### Start Development Server
```bash
cd web
npm start
```

The app will run on http://localhost:3000

### Build for Production
```bash
cd web
npm run build
```

Output will be in `web/build/` directory.

## 🎨 Current Pages

1. **Home** - Landing page with hero section and features
2. **Trade** - Crypto trading interface (placeholder)
3. **Wallet** - Balance and wallet management (placeholder)
4. **Payments** - Payment methods display (placeholder)
5. **Account** - Authentication interface (placeholder)

## 📱 Responsive Breakpoints

- **Desktop**: > 768px - Full navigation bar
- **Mobile**: ≤ 768px - Hamburger menu

## 🔧 Customization

### Adding New Pages

1. Add a new case in `renderPage()` method
2. Create a render method (e.g., `renderNewPage()`)
3. Add navigation item in `navItems` array

### Styling

Styles use React Native StyleSheet API. All styles are in the `styles` object at the bottom of `SolidiWebApp.js`.

### Web-Specific Components

To create web-specific versions of mobile components:

1. Create a `.web.js` version: `Component.web.js`
2. React Native Web will automatically use the `.web.js` version on web
3. Mobile app continues using the regular `.js` version

Example:
```
src/components/Button.js       # Used by mobile
src/components/Button.web.js   # Used by web
```

## 🚫 Mobile App Independence

**Important**: The web platform is completely separate from the mobile app:

- Mobile app code in `/src/` remains unchanged
- Mobile build process (`npx react-native run-android/ios`) unaffected
- No mobile dependencies required for web build
- Web platform uses simplified components to avoid native dependencies

## 📚 Tech Stack

- **React Native Web** v0.21.2 - React Native for web
- **React** v19.2.0 - UI library
- **Create React App** v5.0.1 - Build tooling
- **React App Rewired** - Webpack customization
- **Babel** - JavaScript compiler

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
