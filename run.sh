#!/bin/bash

# sudo python3 -m http.server 80 -d /home/pi/GCAL
# su - root -c "sleep 10 && python3 -m http.server 80 -d /home/pi/GCAL"
sleep 10 && python3 -m http.server 80 -d /home/pi/GCAL
su - pi -c "sleep 10 && cd /home/pi/GCAL && python3 screenshot.py"
