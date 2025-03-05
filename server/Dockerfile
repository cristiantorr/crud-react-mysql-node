# Usamos una imagen base de Node.js
FROM node:20

# Definimos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos package.json y package-lock.json al contenedor
COPY package*.json ./

# Instalamos las dependencias del backend
RUN npm install

# Copiamos todos los archivos del backend al contenedor
COPY . .

# Exponemos el puerto que va a utilizar el backend (el que se usa en tu código, 8081)
EXPOSE 8081

# Comando para arrancar el servidor
CMD ["node", "index.js"]
