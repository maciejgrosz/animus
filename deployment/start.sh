#!/bin/sh

docker build -t animus-app .
docker run -it --rm -p 5000:5000 animus-app