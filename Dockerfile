FROM node:lts

RUN apt-get update && apt-get upgrade -y

USER node
RUN curl -fsSL https://bun.sh/install | bash
WORKDIR /app
