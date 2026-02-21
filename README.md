# 3D Print Store

Une plateforme complète de commande d'impressions 3D avec paiement Stripe et dashboard admin.

## 🎯 Fonctionnalités

✅ **Formulaire de commande** pour les clients
- Lien du modèle 3D
- Sélection de couleur
- Quantité
- Spécifications (Infill, paroi, etc.)

✅ **Paiement sécurisé** par Stripe (Carte Bleue)
✅ **Devis automatique** par email après paiement
✅ **Dashboard admin** avec authentification
✅ **Gestion des statuts** de commandes (En attente, En production, Prêt, Livré)
✅ **Notifications email** automatiques aux clients

## 🚀 Installation

### 1. Clone le repository
```bash
git clone https://github.com/Blitzfury42/3d-print-store.git
cd 3d-print-store
```

### 2. Installe les dépendances
```bash
npm install
```

### 3. Configure les variables d'environnement
```bash
cp .env.example .env.local
```

### 4. Crée la base de données
```bash
psql -U postgres -d print3d_store -f schema.sql
```

### 5. Lance le serveur
```bash
npm run dev
```

## 📍 Accès aux pages

- 🛒 **Formulaire client** : http://localhost:3000
- 🔐 **Admin login** : http://localhost:3000/admin/login
- 📊 **Admin dashboard** : http://localhost:3000/admin/dashboard

## 🔧 Stack technologique

- **Frontend** : Next.js 14, React, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes
- **Database** : PostgreSQL
- **Paiement** : Stripe
- **Emails** : Resend
- **Authentification** : NextAuth.js

## 📄 License

MIT