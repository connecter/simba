FROM nginx:1.7
MAINTAINER Jan Vincent Liwanag <jvliwanag@gmail.com>

ADD dist /srv/jitsi-meet

ADD docker/nginx.conf.in /etc/nginx/nginx.conf.in

ADD docker/start-meet /usr/local/bin/start-meet
RUN chmod +x /usr/local/bin/start-meet

CMD ["start-meet"]
