FROM node:latest as build

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install

RUN npm run build

COPY . .

RUN npm run build --configuration=production

FROM nginx:latest

COPY --from=build  /usr/local/app/dist/book-store/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
