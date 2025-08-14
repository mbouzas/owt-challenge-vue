# Step 1: Build the app
FROM node:18-alpine AS builder
WORKDIR /appfrontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the built files
FROM nginx:stable-alpine
COPY --from=builder /appfrontend/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
