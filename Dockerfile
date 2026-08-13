FROM node
ENV POSTGRES_PASSWORD=dev \
POSTGRES_DB=tasks
WORKDIR /home/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm create-table
RUN npm run seed
CMD ["npm", "run", "dev"]
