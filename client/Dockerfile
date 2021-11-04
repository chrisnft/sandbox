FROM node:lts-alpine

WORKDIR /app

COPY ./app/ /app/

ENV REMOTE_NODE_URL="http://sandbox-remote-blockchain:8545"

RUN \
	apk update \
	&& apk add --no-cache \
	git \
	neovim \
	&& npm install \
	&& rm -rf /var/cache/apk/*

EXPOSE 8545

CMD ["npx", "hardhat", "console"]
