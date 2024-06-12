#!/bin/bash

IMAGE_TAG='app-frontend'

# env_port=$(cat .env | grep PORT | cut -d = -f 2 | tr -d "'")
# env_host=$(cat .env | grep HOST | cut -d = -f 2 | tr -d "'")

# Build docker image with name and tag
sudo docker build --tag ${IMAGE_TAG}:${IMAGE_TAG} .

# List docker images
sudo docker images

# Run docker image
# docker -p <host-machine-port>:<docker-port> image
# sudo docker run -p 3101:80 ${IMAGE_TAG}:${IMAGE_TAG} 
sudo docker run --net=host ${IMAGE_TAG}:${IMAGE_TAG} 

# List containers
# sudo docker ps -a

# Stop container
# sudo docker stop c16349310ef7

# Remove container
# sudo docker rm 3ae30d88a42e

# Stop and remove container by image name 
# docker rm $(docker stop $(docker ps -a -q --filter ancestor=<${IMAGE_TAG}:${IMAGE_TAG}> --format="{{.ID}}"))

# Remove image
# sudo docker image rm ${IMAGE_TAG}:${IMAGE_TAG}



# Remove all unused images
# docker image prune