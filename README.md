accessController
================

Node Library to manage access control hardware

Version 1 Requirements

SQLite
  - node-migrate https://github.com/rsandor/node-migrate

nfc
  We are going to attach a nfc reader to an ardinuo to the raspberry pi
  - https://www.adafruit.com/products/789
  - https://dangerousthings.com/shop/simple-pn532/
  - https://www.arduino.cc/en/Main/ArduinoBoardYun?from=Products.ArduinoYUN
  - https://github.com/adafruit/Adafruit-PN532/releases

gpio pins on raspberry pi
   - https://www.npmjs.com/package/rpi-gpio
   - https://www.npmjs.com/package/pi-gpio
   - https://www.sparkfun.com/products/11042

Raspberry Pi 2
  - Raspbian
  - minicom - serial port testing `minicom -b 115200 -o -D /dev/ttyAMA0`
  - adafruit repo - `curl -sLS https://apt.adafruit.com/add | sudo bash`
  - node js - `sudo apt-get install node`

## DB Schema

Members (LIST, GET, POST, DELETE)
/api/v1/members
/api/v1/members/:id
-----
ID
Name
Email
Enabled

Cards (LIST, GET, POST, DELETE)
/api/v1/cards
/api/v1/cards/:id
-----
ID
UID
MemberId
Enabled

Logs (LIST)
/api/v1/api/logs
-----
Timestamp
MemberID
CardID

## Migrate

``` bash
mkdir .data
touch .data/db.sqlite3
cd api/db
node migrate.js migrate
```
