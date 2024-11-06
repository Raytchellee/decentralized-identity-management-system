# DIMC - Decentralized Identity Management Commission

**DIMC** is a decentralized identity management system that allows users to securely manage their identities using **Decentralized Identifiers (DIDs)**. By leveraging blockchain technology, DIMC provides a secure, self-sovereign way for users to authenticate themselves without relying on a central authority. This project uses **DID** for authentication and is built with **Yarn** as the package manager.

## 🔗 Live Link

Explore the live application here: [DIMC - Decentralized Identity Management System](https://decentralized-identity-management-system.vercel.app/)

## 📝 Features

- **Decentralized Identity Management**: Users can create and manage their own DIDs.
- **Secure Authentication**: Users authenticate through DIDs, ensuring data privacy and control.
- **Wallet Integration**: Connects with Algorand-compatible wallets for identity verification.
- **User Control**: Only DIDs created and managed by a user's account are considered valid, providing secure, self-owned identities.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Make sure you have Node.js installed on your machine.
- **Yarn**: This project uses Yarn as the package manager. You can install it globally if it's not installed:

  ```bash
  npm install -g yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Raytchellee/decentralized-identity-management-system.git

2. Navigate to the project directory:

   ```bash
   cd decentralized-identity-management-system

3. Install dependencies with Yarn:

   ```bash
   yarn install
### Running the application

1. To start the development server:

   ```bash
   yarn dev

This will start the application on `http://localhost:3000`, where you can view it in the browser.

## 🛠️ Usage

1. **Connect Wallet**: On the home screen, click "Connect Wallet" to link your Algorand-compatible wallet to DIMC.
2. **Retrieve or Create DID**: Once connected, DIMC will display any existing DIDs associated with your wallet. If you don’t have a DID, you can create a new one.
3. **Authentication**: DIMC verifies identity using DIDs, allowing only valid DIDs created by the user to be used for authentication.

## 📦 Built With

- **React** - Frontend framework for building the user interface.
- **Nest.js** - Node.js framework for scalable and maintainable server-side applications.
- **Algorand** - Blockchain technology for managing DIDs.
- **DID Protocol** - For decentralized identity management.
- **Yarn** - Package manager for handling dependencies.

## 💻 Development

### Scripts

- **Start Development Server**: `yarn dev`
- **Build for Production**: `yarn build`
- **Run Tests**: `yarn test`

## 🛡️ Security and Privacy

DIMC prioritizes user privacy and control over identity. DIDs are stored on a decentralized ledger, and only the user has control over the associated private key, ensuring their data remains private and secure.
