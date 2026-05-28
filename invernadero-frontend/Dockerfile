# Etapa 1: build
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

# 🔥 FIX REAL DEL BUG
RUN rm -rf node_modules package-lock.json \
 && npm install --legacy-peer-deps --include=optional

COPY . .

RUN npm run build

# Etapa 2
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]