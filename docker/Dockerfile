FROM nginx

MAINTAINER Enerbos

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai  /etc/localtime

COPY docker/nginx.conf /etc/nginx/nginx.conf

COPY dist /home/yiweibao-user-web

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
