#  Mobile Ordering App (Quick Order Service)

Welcome to the repository for the **Mobile Ordering App**, a cross-platform (iOS and Android) solution built with Expo and React Native, focusing on a fast, themed, and efficient food ordering process.

This project implements a full user flow from browsing products to placing an order, including persistent cart state, dynamic theming, and local notification mockups.

## ✨ Features Implemented

| Category | Features |
| :--- | :--- |
| **User Experience** | 🌓 **Dynamic Theming** (Light/Dark Mode toggle in Profile) |
| **Ordering Flow** | 🛒 Persistent **Cart Management** (using `CartContext`) |
| **Checkout** | 🗺️ Dynamic **Delivery Location** selection and confirmation |
| **Order Status** | ⏱️ Mocked **Order Status** screen with lifecycle updates |
| **Notifications** | 🔔 Local **Notification Mockup** for order status updates |
| **Architecture** | 🚀 **Expo Router** for clean, file-based navigation |
| **Data Handling** | 🌐 Custom `useFetchData` hook for API interaction |

***

## ⚙️ Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

1.  Node.js (LTS version recommended)
2.  Expo CLI (`npm install -g eas-cli`)
3.  An Android Emulator or iOS Simulator/Device.

### Installation

1.  **Clone the Repository** (If you haven't already):
    ```bash
    git clone [https://github.com/shahruchi1212/Mobile_Ordering_App.git](https://github.com/shahruchi1212/Mobile_Ordering_App.git)
    cd Mobile_Ordering_App
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the Development Server:**
    ```bash
    npx expo start
    ```

### Running the App

After running `npx expo start`, the Metro bundler will launch. You can open the app using one of these methods:

* **Android:** Press `a` in the terminal to open it in an Android Emulator.
* **iOS:** Press `i` in the terminal to open it in an iOS Simulator.
* **Expo Go:** Scan the QR code using the **Expo Go** app on your device (limited support for all native modules).

***

## 📦 Project Structure

The key files and directories are organized as follows:

Since your project is now successfully uploaded to GitHub, the best file to copy and paste is the updated README.md we just prepared. This ensures your repository is immediately useful to anyone viewing it.

Here is the complete content for your README.md file.

Markdown

# Mobile Ordering App (Quick Order Service)

Welcome to the repository for the **Mobile Ordering App**, a cross-platform (iOS and Android) solution built with Expo and React Native, focusing on a fast, themed, and efficient food ordering process.

This project implements a full user flow from browsing products to placing an order, including persistent cart state, dynamic theming, and local notification mockups.

## ✨ Features Implemented

| Category | Features |
| :--- | :--- |
| **User Experience** | 🌓 **Dynamic Theming** (Light/Dark Mode toggle in Profile) |
| **Ordering Flow** | 🛒 Persistent **Cart Management** (using `CartContext`) |
| **Checkout** | 🗺️ Dynamic **Delivery Location** selection and confirmation |
| **Order Status** | ⏱️ Mocked **Order Status** screen with lifecycle updates |
| **Notifications** | 🔔 Local **Notification Mockup** for order status updates |
| **Architecture** | 🚀 **Expo Router** for clean, file-based navigation |
| **Data Handling** | 🌐 Custom `useFetchData` hook for API interaction |

***

## ⚙️ Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

1.  Node.js (LTS version recommended)
2.  Expo CLI (`npm install -g eas-cli`)
3.  An Android Emulator or iOS Simulator/Device.

### Installation

1.  **Clone the Repository** (If you haven't already):
    ```bash
    git clone [https://github.com/shahruchi1212/Mobile_Ordering_App.git](https://github.com/shahruchi1212/Mobile_Ordering_App.git)
    cd Mobile_Ordering_App
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the Development Server:**
    ```bash
    npx expo start
    ```

### Running the App

After running `npx expo start`, the Metro bundler will launch. You can open the app using one of these methods:

* **Android:** Press `a` in the terminal to open it in an Android Emulator.
* **iOS:** Press `i` in the terminal to open it in an iOS Simulator.
* **Expo Go:** Scan the QR code using the **Expo Go** app on your device (limited support for all native modules).

***

## 📦 Project Structure

The key files and directories are organized as follows:

MobileOrderingApp/
├── app/                      # 🚀 Expo Router's file-based routes
│   ├── (stack)/              # Nested navigator for Order/Delivery/Status screens
│   ├── (tabs)/               # Tab navigator (Home, Profile)
│   ├── _layout.tsx           # Main navigation layout and global context providers
├── components/
│   ├── base/                 # Reusable components (ScreenContainer)
│   ├── specific/             # Components tied to domain logic (ProductCard)
├── hooks/
│   ├── useFetchData.ts       # Custom hook for API data fetching/caching
│   ├── useNotifications.ts   # Logic for local notification scheduling and permissions
├── services/
│   ├── api.ts                # Mocked or integrated API calls (fetchProducts, placeOrder)
├── store/
│   ├── CartContext.tsx       # Global state for cart items and logic
│   ├── ThemeContext.tsx      # Global state for theme management (light/dark mode)
└── package.json


***

## 🛠️ Key Technologies

| Technology | Purpose |
| :--- | :--- |
| **React Native** | Core mobile development framework |
| **Expo SDK** | Managed workflow features (Notifications, File System) |
| **Expo Router** | Native navigation and deep linking |
| **TypeScript** | Static typing for reliability and scalability |
| **Context API** | State management for Cart and Theming |

***
