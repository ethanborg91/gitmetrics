FROM node:24-alpine
WORKDIR /src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm","start", "--", "-p","3000"]