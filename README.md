# AgriConnect 🌾

AgriConnect is a comprehensive, AI-powered digital platform designed to empower farmers with modern technology. From instant crop disease diagnosis to real-time market access and community support, AgriConnect serves as a digital companion for the modern agricultural landscape.

## 🚀 Key Features

### 🤖 Groot: Your Agri AI Assistant
*   **Intelligent Chat**: Ask anything about farming, pest control, or crop management.
*   **Voice Enabled**: Listen to Groot's advice using built-in Text-to-Speech (TTS) capabilities.
*   **Context Aware**: Remembers your conversation to provide tailored agricultural guidance.

### 🔍 AI Pest & Disease Diagnosis
*   **Photo Detection**: Upload a photo of your affected crop for instant AI analysis.
*   **Symptom Description**: Describe the problem in words if a photo isn't available.
*   **Problem & Solution**: Get clear identification of the issue along with organic and chemical treatment plans.

### 🛒 Agricultural Marketplace
*   **Curated Products**: Access high-quality seeds, fertilizers, and tools.
*   **Direct Links**: Integrated with trusted providers like TradeIndia and Utkarsh Agro for seamless purchasing.
*   **Category Filtering**: Easily find exactly what your farm needs.

### 👥 Farmer Community
*   **Locality Filtering**: Connect with farmers in your specific region (Guntur, Nellore, etc.).
*   **Success Stories**: Share your achievements and learn from others in the forum.
*   **Cooperatives**: Access contact information for local agricultural societies and unions.

### 📊 Financial & Resource Tools
*   **Loan Calculator**: Plan your finances with a dedicated agricultural loan EMI calculator.
*   **Government Schemes**: Stay updated with direct links to PM-Kisan, Fasal Bima Yojana, and Soil Health Card portals.
*   **Weather Updates**: Real-time weather monitoring for informed planting decisions.

### 🔐 Secure Profile Management
*   **Firebase Auth**: Secure login and registration for every farmer.
*   **Personalized Profiles**: Save your farm size, primary crops, and location for a tailored experience.

## 🛠️ Tech Stack

*   **Frontend**: React 18, TypeScript, Vite
*   **Styling**: Tailwind CSS (Modern, responsive design)
*   **AI Engine**: Google Gemini API (Flash 3 & 2.5 series)
*   **Backend/Auth**: Firebase (Authentication & Firestore)
*   **Animations**: Motion (formerly Framer Motion)
*   **Icons**: Lucide React

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   Gemini API Key
*   Firebase Project Credentials

### Environment Variables
Create a `.env` file in the root directory and add the following:

```env
GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/agriconnect.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built with ❤️ for the farming community.*
