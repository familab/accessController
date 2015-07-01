accessController
================

Node Library to manage access control hardware

Version 1 Requirements

SQLite
  - node-migrate https://github.com/rsandor/node-migrate
libnfc
  - https://www.adafruit.com/products/789
  - https://www.npmjs.com/package/nfc (requires node v10)
gpio pins on raspberry pi
   - https://www.npmjs.com/package/rpi-gpio
   - https://www.npmjs.com/package/pi-gpio

## DB Schema

Members
-----
ID
Name
Email
Enabled

Cards
-----
ID
UID
Enabled

Logs
-----
Timestamp
MemberID
CardID
