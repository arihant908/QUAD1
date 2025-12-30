# Quad 🕶️  
*A low-key, college-only marketplace.*

Quad is a request-based campus marketplace built for students — no payments, no commissions, no noise.  
Buyers browse, sellers list, and deals happen **offline** at a mutually agreed place.

Designed to feel minimal, underground, and intentional.

---

## ✨ Features

### 🔐 Authentication
- Google sign-in (Firebase Auth)
- One account = buyer + seller access

### 🛒 Marketplace
- Real-time listings (Firestore)
- Mandatory product image for every listing
- Price shown upfront
- No in-app payments

### 📸 Images (No Firebase Billing)
- Camera opens directly on mobile
- Auto image compression (~200–250 KB)
- Hosted on Cloudinary (free tier)
- Blurred thumbnails for buyers (revealed on interaction)

### 🔁 Request Flow
- Buyer sends **request to buy**
- Seller receives request in dashboard
- Seller accepts and shares meetup details
- Listing marked as sold

### 🎭 UI / UX
- Editorial, minimal design
- Subtle scroll + hover animations
- Animated list transitions
- Intentional “chor-bazaar” vibe

---

## 🧠 How It Works (Flow)

1. User signs in with Google
2. Seller posts a listing (image mandatory)
3. Buyer browses available listings
4. Buyer clicks **Take** → request sent
5. Seller accepts request
6. Buyer & seller meet offline and complete the deal

---

## 🧱 Tech Stack

- **Frontend**: React + Vite  
- **Auth**: Firebase Authentication  
- **Database**: Cloud Firestore  
- **Images**: Cloudinary (unsigned uploads)  
- **Animations**: Motion  
- **Hosting**: (planned)

---

## 📂 Project Structure

```txt
src/
├── components/
│   └── AnimatedList.jsx
├── pages/
│   ├── BuyerDashboard.jsx
│   ├── SellerDashboard.jsx
│   └── Auth.jsx
├── firebase.js
└── App.jsx

