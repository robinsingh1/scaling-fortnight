# General Guidelines
# - Docker Actions that change often should be separated and moved lower in the order,
#     to speed up build times (e.g. copying app code)
# - Docker Actions that change rarely should be combined to reduce layers,
#     which speeds up deploy times (e.g. setting ENV VARS)

FROM ubuntu:trusty

# ENV VARS are loaded in a single line to reduce number of images

USER root
RUN apt-get update
RUN apt-get install -y openssh-client

RUN mkdir /ssh
WORKDIR /ssh
COPY id_rsa /ssh/id_rsa
RUN chmod -R 700 /ssh
CMD ["/usr/bin/ssh", "-o", "StrictHostKeyChecking=no", "-o", "ServerAliveInterval=60", "-i", "./id_rsa", "-N", "compose@aws-us-east-1-portal.2.dblayer.com", "-p", "10726", "-L", "0.0.0.0:28015:10.58.40.2:28015"]

EXPOSE 28015
