#!/bin/bash
rsync -az --delete ./ root@159.203.102.18:/root/clearspark-dockerfiles
ssh root@159.203.102.18 "cd /root/clearspark-dockerfiles && \
docker pull picobit/clearspark-base:latest && \
docker-compose build && \
docker-compose up -d && \
docker-compose scale worker=4"
