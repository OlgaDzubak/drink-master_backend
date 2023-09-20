FROM node

WORKDIR /app

COPY . .

RUN npm install

RUN npm uninstall bcrypt
RUN npm install bcrypt

EXPOSE 8000

CMD ["npm", "start"]