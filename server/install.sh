#!/bin/bash

# install Python if not available
if ! command -v python3 &> /dev/null
then
    echo "Python not found, installing..."
    apt-get update && apt-get install -y python3 python3-pip
fi

# install Python dependencies
pip3 install -r scripts/requirements.txt
