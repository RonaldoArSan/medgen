# MedGen 💊

MedGen is a comprehensive mobile application designed to help users manage their medications, track orders from pharmacies, and monitor stock levels. Built with React Native and Expo, it offers a modern, user-friendly interface with dark mode support.

## 📱 Features

- **Medication Management**:

  - **Track Medications**: Keep a detailed list of all your medications, including dosage, form, and frequency.
  - **CRUD Operations**: Easily add, edit, and delete medications.
  - **Stock Monitoring**: Set low stock thresholds and receive visual alerts when supplies are running low.
  - **Barcode Scanning**: Quickly add medications by scanning their barcodes (implementation in progress).

- **Pharmacy Integration**:

  - **Product Search**: Find products available in partner pharmacies.
  - **Order Tracking**: Monitor the status of your orders (Pending, Shipped, Delivered, etc.) in real-time.
  - **Direct Purchase**: Seamlessly navigate from a low-stock medication to purchasing it from a pharmacy.

- **User Experience**:
  - **Dark Mode**: A sleek, eye-friendly dark theme.
  - **Intuitive Dashboard**: Get a quick summary of your health and medication status on the home screen.
  - **Responsive Design**: Optimized for various screen sizes.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Ionicons](https://ionic.io/ionicons) & [MaterialIcons](https://fonts.google.com/icons)
- **Storage**: Async Storage (Local Persistence)
- **Styling**: Custom Theme System

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- Expo Go app on your physical device OR an Android/iOS emulator

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/medgen.git
    cd medgen
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the application:**

    ```bash
    npx expo start
    ```

4.  **Run on device/emulator:**
    - **Physical Device**: Scan the QR code displayed in the terminal using the Expo Go app.
    - **Emulator**: Press `a` for Android or `i` for iOS in the terminal window.

## 📂 Project Structure

```
src/
├── app/              # Expo Router pages and layouts
│   ├── (tabs)/       # Main tab navigation (Home, Medications, Pharmacy, Orders, Profile)
│   ├── medication/   # Medication details and add/edit screens
│   └── ...
├── components/       # Reusable UI components (MedicationCard, etc.)
├── services/         # Business logic and data services (MedicationService, OrderService)
├── theme/            # Design tokens (Colors, Spacing, Typography)
└── types/            # TypeScript definitions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
