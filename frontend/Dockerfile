# Stage 1: Build the React app
FROM node:18-alpine AS build
WORKDIR /app

COPY .env.production ./
COPY postcss.config.cjs ./
COPY tailwind.config.js ./

COPY package*.json ./
RUN npm install --force

COPY src ./src
COPY index.html vite.config.* tsconfig.json ./

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
