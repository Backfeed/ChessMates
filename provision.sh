#! /bin/bash

sudo apt-get update
sudo apt-get upgrade -f

sudo apt-get install -y git
sudo apt-get install -y software-properties-common
sudo apt-get update

# install Meteor
curl https://install.meteor.com/ | sh

# issue when deplying on ubuntu
# might need to add to /usr/local/bin/meteor
#export LC_ALL="en_US.UTF-8"
