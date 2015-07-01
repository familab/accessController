accessController
================

Node Library to manage access control hardware

Version 1 Requirements

SQLite
  - node-migrate https://github.com/rsandor/node-migrate
libnfc
  - https://www.adafruit.com/products/789
  - https://dangerousthings.com/shop/simple-pn532/
  - https://www.npmjs.com/package/nfc (requires node v10)
gpio pins on raspberry pi
   - https://www.npmjs.com/package/rpi-gpio
   - https://www.npmjs.com/package/pi-gpio
   - https://www.sparkfun.com/products/11042

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
