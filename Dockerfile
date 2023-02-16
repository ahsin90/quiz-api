FROM node:17

# Create app directory
WORKDIR /usr/src/app

ARG app_version="1.0"
ENV APP_VERSION=$app_version

ENV PORT=80

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 80


CMD [ "node", "app.js" ]