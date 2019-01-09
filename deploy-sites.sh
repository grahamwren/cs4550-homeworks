#!/bin/bash

cd ~/cs4550-homeworks
date >> ~/deploys.log
git pull >> ~/deploys.log
echo "" >> ~/deploys.log

# run make/build scripts
