#!/bin/bash

apt-get install -y python-software-properties debconf-utils apt-transport-https
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
add-apt-repository -y ppa:webupd8team/java
echo "deb https://artifacts.elastic.co/packages/6.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-6.x.list
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
apt-get update
echo "oracle-java8-installer shared/accepted-oracle-license-v1-1 select true" | sudo debconf-set-selections
apt-get install -y oracle-java8-installer 
apt-get install -y elasticsearch kibana
apt-get install -y nodejs build-essential jq
mkdir -p /home/ubuntu/.npm-packages
chown ubuntu:ubuntu /home/ubuntu/.npm-packages
echo 'prefix=${HOME}/.npm-packages' >> /home/ubuntu/.npmrc
chown ubuntu:ubuntu /home/ubuntu/.npmrc
echo 'NPM_PACKAGES="${HOME}/.npm-packages"' >> /home/ubuntu/.bashrc
echo 'PATH="$NPM_PACKAGES/bin:$PATH"' >> /home/ubuntu/.bashrc
echo 'unset MANPATH' >> /home/ubuntu/.bashrc
echo 'export MANPATH="$NPM_PACKAGES/share/man:$(manpath)"' >> /home/ubuntu/.bashrc
