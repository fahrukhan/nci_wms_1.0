FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Remove the db:migrate step from here
RUN npm run db:generate

CMD ["npm", "start"]