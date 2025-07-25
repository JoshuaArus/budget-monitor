# Utilise une image Node officielle
FROM node:20-alpine

# Crée le dossier de l'app
WORKDIR /usr/src/app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install --production

# Copie le reste du code
COPY . .

# Expose le port de l'API
EXPOSE 3000

# Lance l'application
CMD ["node", "src/index.js"] 