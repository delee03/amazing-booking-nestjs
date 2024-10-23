#!/bin/bash
cd /home/ec2-user/amazing-booking-nestjs
pm2 stop all
pm2 start dist/src/main.js --name amazing-booking-nestjs
