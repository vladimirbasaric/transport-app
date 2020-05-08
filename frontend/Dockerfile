FROM node:12.2.0 as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@8.3.0
#RUN ng update --next @angular/cli --force
RUN npm audit fix

COPY . /app

#CMD ng serve --host 0.0.0.0
RUN ng build --output-path=dist

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]