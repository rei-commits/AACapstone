# Tally - Split Bills, Not Frienships

Tally is a modern bill-splitting application that makes it easy to split bills and track expenses with friends. With features like receipt scanning, real-time calculations, and intuitive item assignment, Tally takes the hassle out of group payments.
### Core Features
- 📸 Receipt Scanning: Upload and automatically extract items from receipts
- 👥 Friend Management: Add and manage friends to split bills with
- 💰 Smart Splitting: Assign items to specific people and split costs fairly
- 🧮 Automatic Calculations: Tax and tip are automatically split among participants
- 🌙 Dark/Light Mode: Comfortable viewing in any lighting condition
## Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- React Icons
- Axios for API calls
- React Hot Toast for notifications

### Backend
- Spring Boot
- Java
- RESTful API architecture
- Tesseract OCR for receipt scanning

### Authentication & Storage
- Firebase Authentication
- Firebase Storage### Prerequisites
- Node.js (v14 or higher)
- Java JDK 17 or higher
- Maven
- Firebase account
- MySQL/PostgreSQL database

### Installation

1. Clone the repository
bash
git clone [repository-url]


2. Frontend Setup
bash

cd frontend

npm install
:
Create a `.env` file in the frontend directory with your Firebase configuration:

env

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_API_URL=http://localhost:8080


3. Backend Setup

bash
cd tallybackend
mvn install

## Running the Application

1. Start the backend server:

bash
cd frontend
npm run dev

The application will be available at `http://localhost:5176`

## Features in Detail

### Receipt Scanning
- Upload receipts through the intuitive interface
- Automatic item extraction
- Manual adjustment capabilities

### Bill Splitting
- Create new splits with multiple participants
- Assign items to specific people
- Automatic tax and tip distribution
- Real-time total calculations

### User Interface
- Clean, modern design
- Responsive layout
- Animated transitions
- Toast notifications for user feedback
- Money rain animation on successful bill creation

## Acknowledgments
- Built with ❤️ by [Rei/Tally]
## Future Enhancements

### Receipt Scanning & Processing
- 🔍 Enhanced OCR accuracy with machine learning
- 📱 Real-time receipt scanning through mobile camera
- 🏷️ Smart item categorization
- 🔄 Support for multiple receipt formats and languages

### User Experience
- 📱 Mobile app development (iOS/Android)
- 🔔 Push notifications for bill reminders and payments
- 📊 Interactive spending analytics and reports
- 🎨 Customizable themes and UI preferences
- 💾 Offline mode support

### Bill Management
- 💳 Direct integration with payment platforms (Venmo, PayPal)
- 🔄 Recurring bill support
- 📤 Export bills to PDF/CSV
- 🏷️ Custom tags and categories for bills

### Social Features
- 👥 Group creation and management
- 💬 In-app messaging and bill discussions
- 🔗 Share bills via links
- 👤 User profiles with payment preferences
- 🤝 Split history with specific friends

### Integration & API
- 🏦 Bank account integration
- 📱 Mobile wallet integration
- 🔌 API for third-party integrations
- 📊 Extended API for business accounts
- 🔄 Webhook support for real-time updates

### Security & Privacy
- 🔐 Two-factor authentication
- 🛡️ End-to-end encryption for sensitive data
- 📜 Enhanced privacy settings
- 🔒 Biometric authentication support
- 📋 GDPR and privacy compliance tools

### Business Features
- 💼 Business accounts with advanced features
- 📊 Expense reporting and analytics
- 🏢 Multi-team support
- 📄 Custom branding options
- 🔍 Advanced search and filtering

### Backend Setup

1. Configure the database:
   - Copy `application.properties.template` to `application.properties`
   - Set your MySQL credentials either in the file or as environment variables:
     ```bash
     export MYSQL_USER=your_username
     export MYSQL_PASSWORD=your_password
     ```

2. Install dependencies:
   ```bash
   cd tallybackend
   mvn install
   ```
