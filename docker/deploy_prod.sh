#!/bin/bash
rsync -az --delete ./ root@159.203.91.107:/root/triggeriq-dockerfiles
ssh root@159.203.91.107 "cd /root/triggeriq-dockerfiles && \
docker pull picobit/triggeriq-base:latest && \
docker-compose build && \
docker-compose up -d && \
docker-compose scale worker=4"
