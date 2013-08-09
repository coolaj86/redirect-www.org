#!/bin/bash
SRV=redirect-www
sudo rsync -a ${SRV}.conf /etc/init/
sudo chmod 644 /etc/init/${SRV}.conf
sudo chown root:root /etc/init/${SRV}.conf
