# 🚀 Guide de Déploiement Firebase - ISET Kairouan

## 📋 Prérequis

1. ✅ Firebase CLI installé (`npm install -g firebase-tools`)
2. ✅ Compte Google avec accès au projet Firebase `iset-kr`
3. ✅ MongoDB Atlas configuré (pour la production)

## 🔧 Configuration Initiale

### 1. Connexion à Firebase
```bash
firebase login
```

### 2. Vérifier le projet
```bash
firebase projects:list
```

### 3. Configurer les variables d'environnement

**Pour MongoDB Atlas (IMPORTANT) :**
```bash
firebase functions:config:set mongodb.uri="YOUR_MONGODB_ATLAS_CONNECTION_STRING"
```

Exemple :
```bash
firebase functions:config:set mongodb.uri="mongodb+srv://username:password@cluster.mongodb.net/iset_kairouan?retryWrites=true&w=majority"
```

**Vérifier la configuration :**
```bash
firebase functions:config:get
```

## 📦 Déploiement

### Option 1 : Déploiement Complet (Frontend + Backend)
```bash
npm run deploy
```

Cette commande va :
1. Builder le frontend Angular en mode production
2. Déployer le frontend sur Firebase Hosting
3. Déployer les Cloud Functions (backend API)

### Option 2 : Déploiement Frontend Uniquement
```bash
npm run deploy:hosting
```

### Option 3 : Déploiement Backend Uniquement
```bash
cd functions
npm run deploy
```

Ou depuis la racine :
```bash
firebase deploy --only functions
```

## 🧪 Test Local

### Tester les Cloud Functions localement
```bash
cd functions
npm run serve
```

Cela démarre l'émulateur Firebase Functions sur `http://localhost:5001`

### Tester le frontend avec l'émulateur
1. Dans un terminal, démarrez l'émulateur :
   ```bash
   firebase emulators:start
   ```

2. Dans un autre terminal, démarrez le frontend :
   ```bash
   npm start
   ```

3. Mettez à jour `src/environments/environment.ts` pour pointer vers l'émulateur :
   ```typescript
   apiUrl: 'http://localhost:5001/iset-kr/us-central1/api'
   ```

## 🔍 Vérification Post-Déploiement

### 1. Vérifier le déploiement
```bash
firebase hosting:channel:list
```

### 2. Voir les logs des fonctions
```bash
firebase functions:log
```

### 3. Tester l'API en production
```bash
curl https://YOUR-PROJECT-ID.web.app/api/health
```

## 📊 URLs de Production

Après le déploiement, votre application sera disponible sur :

- **Frontend** : `https://iset-kr.web.app` ou `https://iset-kr.firebaseapp.com`
- **API** : `https://iset-kr.web.app/api/*`

## ⚙️ Configuration MongoDB Atlas

**IMPORTANT** : Pour la production, vous devez :

1. Créer un cluster MongoDB Atlas
2. Créer un utilisateur de base de données
3. Whitelist les IPs Firebase (ou autoriser toutes les IPs : `0.0.0.0/0`)
4. Copier la connection string
5. Configurer avec : `firebase functions:config:set mongodb.uri="YOUR_CONNECTION_STRING"`

## 🔄 Mise à Jour

Pour mettre à jour l'application après des modifications :

```bash
# 1. Commit vos changements
git add .
git commit -m "Description des changements"

# 2. Redéployer
npm run deploy
```

## 🐛 Dépannage

### Erreur de connexion MongoDB
```bash
# Vérifier la configuration
firebase functions:config:get

# Reconfigurer si nécessaire
firebase functions:config:set mongodb.uri="NEW_CONNECTION_STRING"

# Redéployer
firebase deploy --only functions
```

### Voir les erreurs en temps réel
```bash
firebase functions:log --only api
```

### Nettoyer et redéployer
```bash
# Supprimer les anciennes fonctions
firebase functions:delete api

# Redéployer
firebase deploy --only functions
```

## 📝 Notes Importantes

1. **Cold Start** : La première requête après un certain temps peut être lente (cold start des Cloud Functions)
2. **Quotas** : Firebase a des quotas gratuits. Surveillez votre usage sur la console Firebase
3. **Sécurité** : Assurez-vous que votre MongoDB Atlas n'autorise que les IPs Firebase
4. **Logs** : Les logs sont conservés pendant 30 jours dans Firebase

## 🎯 Commandes Rapides

```bash
# Build production
npm run build:prod

# Deploy tout
npm run deploy

# Deploy hosting seulement
npm run deploy:hosting

# Deploy functions seulement
firebase deploy --only functions

# Logs en temps réel
firebase functions:log --only api

# Liste des projets
firebase projects:list

# Changer de projet
firebase use iset-kr
```

## 🔐 Sécurité

Avant le déploiement en production :

1. ✅ Configurer les règles de sécurité Firebase
2. ✅ Activer CORS correctement
3. ✅ Sécuriser MongoDB Atlas
4. ✅ Utiliser des variables d'environnement pour les secrets
5. ✅ Activer HTTPS uniquement
6. ✅ Configurer l'authentification Firebase si nécessaire

## 📞 Support

En cas de problème :
1. Vérifier les logs : `firebase functions:log`
2. Vérifier la console Firebase : https://console.firebase.google.com
3. Vérifier MongoDB Atlas : https://cloud.mongodb.com

---

**Dernière mise à jour** : Janvier 2026
