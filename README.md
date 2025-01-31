# AI-Powered-Transaction-Analysis-System

AI-Powered Transaction Analysis System
An AI-driven financial transaction analysis tool built with NestJS (backend) and React + Tailwind CSS (frontend).
The system performs merchant name normalization and pattern detection (e.g., recurring or subscription transactions).

Table of Contents
Overview
Features
Merchant Name Normalization
Pattern Detection
Tech Stack
Live Demo Links
Getting Started (Local)
Prerequisites
Backend Setup
Frontend Setup
API Endpoints
POST /api/analyze/merchant
POST /api/analyze/patterns
POST /api/upload
Sample CSV Format
License
Overview
This system helps users analyze financial transactions by:

Normalizing merchant names (e.g., “AMZN MKTP US\*Z1234ABC” → “Amazon”).
Detecting patterns such as subscriptions or recurring payments over time.
Providing a React UI for CSV upload and real-time display of analysis results.
Features
Merchant Name Normalization
Maps messy transaction descriptors (e.g. “AMZN MKTPLACE” or “NFLX DIGITAL NTFLX US”) to clean merchant data.
Provides a confidence score, category, subcategory, and relevant flags (e.g., “subscription,” “online_purchase”).
Pattern Detection
Identifies recurring or subscription transactions (like Netflix, Spotify).
Offers details like next expected date, frequency (monthly/weekly), and confidence.
Tech Stack
Backend: NestJS (TypeScript), with:
A minimal “AI” approach (could be fuzzy logic, local embeddings, or custom logic).
Endpoints for file upload and transaction analysis.
Frontend: React + Tailwind CSS.
Simple CSV upload interface.
Shows normalized transactions and detected patterns in a user-friendly format.
Live Demo Links
Frontend (Deployed on Netlify/Vercel/...):
https://your-frontend.netlify.app

Backend (Deployed on Railway/Render/...):
https://your-backend.up.railway.app

Note: Replace the URLs above with your actual deployment links.

Getting Started (Local)
Prerequisites
Node.js (v16 or above)
npm or yarn
A Git-compatible environment
Backend Setup
Clone this repository (or download the ZIP).
Navigate to the backend folder:
bash
Kopyala
Düzenle
cd backend
Install dependencies:
bash
Kopyala
Düzenle
npm install
Run the NestJS server in development mode:
bash
Kopyala
Düzenle
npm run start:dev
By default, the server listens on http://localhost:3000.
Confirm it logs: “**Server is running on http://localhost:3000**”.
Frontend Setup
Navigate to the frontend folder (e.g., ai-frontend/):
bash
Kopyala
Düzenle
cd ai-frontend
Install dependencies:

npm install
Start the development server:

npm run dev
Open the React app in your browser at http://localhost:5173 (or the port displayed in your terminal).
Important: Make sure the React code calls the correct backend URL (e.g., http://localhost:3000/api/analyze/upload). If deployed, replace localhost:3000 with your production backend domain.

API Endpoints
Below are the required endpoints per the case study.

POST /api/analyze/merchant
Request Body

{
"description": "AMZN MKTP US\*Z1234ABC",
"amount": -89.97,
"date": "2024-01-15"
}
Response

{
"normalized": {
"merchant": "Amazon",
"category": "Shopping",
"sub_category": "Online Retail",
"confidence": 0.95,
"is_subscription": false,
"flags": ["online_purchase", "marketplace"],
"amount": -89.97
}
}
POST /api/analyze/patterns
Request Body

{
"transactions": [
{
"description": "NETFLIX",
"amount": -19.99,
"date": "2024-01-01"
}
]
}
Response

{
"patterns": [
{
"type": "subscription",
"merchant": "Netflix",
"amount": 19.99,
"frequency": "monthly",
"confidence": 0.98,
"next_expected": "2024-02-01"
}
]
}
POST /api/upload
Request
Multipart form containing a .csv file in the file field.
Sample CSV
2024-01-01,NETFLIX,-19.99
2024-01-15,AMZN MKTP US\*Z1234ABC,-89.97
2024-01-22,SPOTIFY,-9.99
Response

{
"normalized_transactions": [
{
"original": "NETFLIX",
"normalized": {
"merchant": "Netflix",
"category": "Entertainment",
"sub_category": "Streaming Service",
"confidence": 0.98,
"is_subscription": true,
"flags": ["subscription", "digital_service"],
"amount": -19.99
}
},
{
"original": "AMZN MKTP US*Z1234ABC",
"normalized": {
"merchant": "Amazon",
"category": "Shopping",
"sub_category": "Online Retail",
"confidence": 0.95,
"is_subscription": false,
"flags": ["online_purchase", "marketplace"],
"amount": -89.97
}
},
...
],
"detected_patterns": [
{
"type": "subscription",
"merchant": "Netflix",
"amount": 19.99,
"frequency": "monthly",
"confidence": 0.98,
"next_expected": "2024-02-01"
}
]
}
Sample CSV Format:
Each line in the CSV should have date, description, amount:
YYYY-MM-DD,Transaction Description,Amount
2024-01-01,NETFLIX,-19.99
2024-01-15,AMZN MKTP US*Z1234ABC,-89.97
Dates in YYYY-MM-DD format
Description is raw text (commas or special chars can break lines)
Amount negative for expenses, positive for credits (depending on your convention)
License
This project is under the MIT License—feel free to use and modify. See the LICENSE file for details.

Contact / Contributing
Issues: For bug reports or feature requests, open a GitHub issue in this repo.
Contributions: Fork the repo, make your changes, and open a Pull Request.
Thank you for using the AI-Powered Transaction Analysis System! If you have any questions, please reach out via GitHub issues or contact the maintainer.
