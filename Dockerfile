FROM node:18


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install


COPY . .


ENV PORT=8080
ENV NODE_ENV=production


EXPOSE 8080


CMD ["npm", "start"]
