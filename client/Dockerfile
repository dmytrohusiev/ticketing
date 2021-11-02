FROM node:16.4.0-alpine

WORKDIR /app
COPY . .

ENV NOYARNPOSTINSTALL 1
RUN ["yarn", "install"]
RUN ["yarn", "run", "build"]

EXPOSE 3000

STOPSIGNAL SIGTERM

CMD ["npm", "run", "start"]
