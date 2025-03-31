# TravelNest
## Overview
TravelNest is an innovative online platform designed to simplify the travel planning process by offering pre-arranged, all-inclusive travel packages that include accommodation, guided tours, transportation, and other essential services for tourists. The platform centralizes multiple services under one umbrella, providing travelers with a seamless and stress-free booking experience.

Initially focused on Rwanda's tourism market, TravelNest aims to support local businesses while offering authentic, cost-effective experiences to travelers.

## Features

### For Travelers
- **User Registration and Authentication**
  - Secure account creation and login via Firebase Authentication
  - Profile management

- **Travel Package Management**
  - Browse and book all-inclusive travel packages
  - Search and filter options (by budget, region, activity type)
  - View package details including itinerary, pricing, and availability

- **Custom Travel Experiences**
  - Request custom packages when pre-arranged options don't meet specific needs
  - Specify preferences for accommodation, tours, and transportation

- **Booking and Payment**
  - Secure payment processing
  - Booking confirmation and email notifications
  - View booking history and track custom package requests

### For Administrators
- **User Management**
  - Manage user accounts and profiles
  - Handle user inquiries and support requests

- **Package Administration**
  - Create, update, and manage travel packages
  - Process and respond to custom package requests
  - Monitor bookings and generate reports

## Technology Stack

### Frontend
- **React.js** - For building the user interface
- **HTML/CSS** - For styling and layout

### Backend
- **Firebase Authentication** - For user registration and login
- **Firebase Firestore** - For data storage
- **Firebase Storage** - For storing images and assets
- **Firebase Hosting** - For web application deployment
- **Firebase Functions** - For serverless backend functionality

### External Services
- **EmailJS** - For sending confirmation emails and notifications

## Project Structure
```
travelnest/
├── .github/                  # GitHub configuration files
├── build/                    # Build output directory
├── firebase/                 # Firebase configuration files
├── functions/                # Firebase Cloud Functions
├── node_modules/             # Node.js dependencies
├── public/                   # Static files
│   ├── images/               # Image assets
│   ├── favicon.ico           # Website favicon
│   └── index.html            # Main HTML file
├── scripts/                  # Utility scripts
│   ├── create-admin.js       # Script to create admin users
│   └── service-account.json  # Firebase service account key
├── src/                      # Source code
│   ├── components/           # React components
│   │   ├── admin/            # Admin components
│   │   ├── auth/             # Authentication components
│   │   ├── booking/          # Booking related components
│   │   ├── common/           # Shared components
│   │   ├── dashboard/        # Dashboard components
│   │   └── packages/         # Package related components
│   ├── contexts/             # React contexts
│   ├── pages/                # Page components
│   ├── services/             # Service modules
│   ├── styles/               # CSS stylesheets
│   ├── utils/                # Utility functions
│   ├── App.js                # Main React component
│   ├── index.js              # Entry point
│   └── routes.js             # Application routes
├── .firebaserc               # Firebase project configuration
├── .gitignore                # Git ignore file
├── firebase.json             # Firebase configuration
├── firestore.indexes.json    # Firestore indexes
├── firestore.rules           # Firestore security rules
├── package-lock.json         # NPM dependencies lock file
├── package.json              # NPM configuration
├── storage.rules             # Firebase Storage security rules
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/travelnest.git
   cd travelnest
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure Firebase
   - Create a `.env` file in the root directory
   - Add your Firebase configuration:
     ```
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```

4. Start the development server
   ```bash
   npm start
   ```

### Deployment
To deploy the application to Firebase Hosting:

1. Login to Firebase
   ```bash
   firebase login
   ```

2. Build the project
   ```bash
   npm run build
   ```

3. Deploy to Firebase
   ```bash
   firebase deploy --only hosting
   ```

### Setting Up Admin Users
Use the provided script to create admin users:

```bash
node scripts/create-admin.js <email> <password>
```

## Authentication

TravelNest uses Firebase Authentication for user management. The `AuthContext` provides authentication state throughout the application:

```jsx
// Example usage of AuthContext
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { currentUser, login, logout } = useAuth();
  // ...
}
```

## Firebase Security

Security rules for Firestore and Storage are defined in `firestore.rules` and `storage.rules` respectively. Make sure to review and update these files to match your security requirements.

## Contributing
We welcome contributions to TravelNest! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request


## Contact
Victoria Temitope Fakunle - v.fakunle@alustudent.com

Project Link: https://travelnest-app-1.web.app/ 

## Acknowledgements
- React.js
- Firebase
- EmailJS
