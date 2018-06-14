FROM node:8.11
RUN mkdir /app
WORKDIR /app
ADD package.json /app
ADD src/ /app/src
RUN npm i
