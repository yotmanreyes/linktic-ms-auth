# Usa la imagen oficial de Node.js como base
FROM node:18 AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia package.json y package-lock.json (si está disponible) al directorio de trabajo
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto del código de tu aplicación al directorio de trabajo
COPY . .

# Compila la aplicación NestJS
RUN npm run build

# Etapa final para ejecutar la aplicación
FROM node:18

# Establece el directorio de trabajo en la nueva imagen
WORKDIR /usr/src/app

# Copia solo los archivos necesarios desde la etapa de construcción
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Instala solo las dependencias de producción
RUN npm install --only=production

# Expone el puerto en el que se ejecuta tu aplicación
EXPOSE 5000

# Comando para ejecutar tu aplicación en producción
CMD ["node", "dist/main"]