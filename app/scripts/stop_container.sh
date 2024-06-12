#!/bin/bash

RED='\033[0;31m' 
GREEN='\033[0;32m'
BLUE='\033[0;34m'
WHITE='\033[0;37m' 
NC='\033[0m'

IMAGE_TAG='app-frontend'

# Stop and remove container by image name 
# sudo docker rm $(docker stop $(docker ps -a -q --filter ancestor=${IMAGE_TAG}:${IMAGE_TAG} --format="{{.ID}}"))

# List containers
sudo docker ps -a

# List docker images
sudo docker images

container_id=$(docker ps -a -q --filter ancestor=${IMAGE_TAG}:${IMAGE_TAG})

if [ -z "$container_id" ]; then
    echo -e "${RED}There is no running container for image: ${BLUE}${IMAGE_TAG}"
    exit 1
fi

echo -e "${BLUE}Stoping container ${RED}${container_id}${BLUE}! ${NC}Proccess is running please wait!"
sudo docker stop ${container_id}
echo -e "${GREEN}Container: ${RED}${container_id}${GREEN} was stoped successfuly. ${NC}"

echo -e "${BLUE}Do you want to remove docker container.${RED}"
read -e -p "[yes/no]: " -i "no" remove_docker_container

if [ "$remove_docker_container" == "yes" ]; then
    # Remove container
    sudo docker rm ${container_id}
    echo -e "${GREEN}Container is removed!"
elif [ "$remove_docker_container" == "no" ]; then
    echo -e "${WHITE}Container is not removed!"
    exit 1    
else 
    echo -e "${WHITE}Container is  not removed! Try to type ${RED}[yes/no] ${WHITE}next time."
    exit 1
fi

echo -e "${BLUE}Do you want to remove docker image.${RED}"
read -e -p "[yes/no]: " -i "no" remove_docker_image

if [ "$remove_docker_image" == "yes" ]; then
    # Remove image
    sudo docker image rm ${IMAGE_TAG}:${IMAGE_TAG}
    echo -e "${GREEN}Image is removed!"
elif [ "$remove_docker_image" == "no" ]; then
    echo -e "${WHITE}Image is  not removed!"    
else 
    echo -e "${WHITE}Image is  not removed! Try to type ${RED}[yes/no] ${WHITE}next time."
fi
