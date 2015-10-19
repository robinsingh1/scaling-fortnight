#!/bin/bash
rsync -az --delete ./ root@45.55.52.78:/root/clearspark-dockerfiles
ssh root@45.55.52.78 "cd /root/clearspark-dockerfiles && \
docker pull picobit/clearspark-base:latest && \
docker-compose build && \
docker-compose up -d && \
docker-compose scale worker=4"
