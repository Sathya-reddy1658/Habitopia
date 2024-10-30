FROM node:18-alpine

WORKDIR /app

EXPOSE 3000

COPY package*.json .

RUN npm install 

COPY . .


EXPOSE 5173

CMD ["npm", "run", "dev"]