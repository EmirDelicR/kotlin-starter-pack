FROM node:22-alpine

WORKDIR /app

COPY package.json .

COPY package-lock.json .

#RUN npm install -g pnpm
#RUN  pnpm install

RUN CYPRESS_INSTALL_BINARY=0 npm ci --no-audit

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]