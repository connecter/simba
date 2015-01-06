FROM nginx:1.7
MAINTAINER Jan Vincent Liwanag <jvliwanag@gmail.com>

ENV JITSI_MEET_VER 302

ADD https://github.com/jitsi/jitsi-meet/archive/$JITSI_MEET_VER.tar.gz /tmp/jitsi-meet.tar.gz

RUN tar xvzf /tmp/jitsi-meet.tar.gz -C /tmp && \
  mv /tmp/jitsi-meet-* /srv/jitsi-meet && \
  rm /tmp/jitsi-meet.tar.gz

ADD config.js /srv/jitsi-meet/config.js

ADD nginx.conf /etc/nginx/nginx.conf

