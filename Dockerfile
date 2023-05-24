FROM node:10-stretch-slim
RUN apt-get install --yes python3
#CMD ["npm","add","-g","@sap/cds-dk"]
WORKDIR /react-ui/
COPY ./react-ui/package.json .
COPY ./react-ui/ .
RUN ["npm","i","--force"]
RUN ["npm","run","build"]
WORKDIR /crypto-gaze/
COPY  ./crypto-gaze/package.json .
COPY ./crypto-gaze/ .
RUN ["npm","i"]
RUN ["npx","cds","deploy","--to","sqlite"]
CMD ["npx","cds","run"]]

#FROM node:alpine
#WORKDIR /react-ui
#COPY package.json ./
#COPY package-lock.json ./
#COPY ./ ./
#RUN ["npm","i"]
#RUN ["npm","run","build"]
#WORKDIR /crypto-gaze
#COPY package.json ./
#COPY package-lock.json ./
#COPY ./ ./
#RUN ["npm","i"]
#RUN ["npx","cds","deploy","--to","sqlite"]
#CMD ["npx","cds","run"]