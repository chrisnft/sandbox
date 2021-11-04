FROM node:lts-alpine

WORKDIR /sandbox-remote-blockchain

COPY ./app/ /sandbox-remote-blockchain/

RUN \
	apk update \
	&& apk add --no-cache \
	git \
	neovim \
	&& npm install

EXPOSE 8545

CMD ["sh","-c","npm start"]
