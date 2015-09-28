accessController
================

Node Library to manage access control hardware

Version 2 Requirements

SQLite
  - node-migrate https://github.com/rsandor/node-migrate

nfc
  We are going to attach a nfc reader to an ardinuo which will communicate with
  the this app via udp packets
  - https://www.adafruit.com/products/789
  - https://dangerousthings.com/shop/simple-pn532/
  - https://github.com/adafruit/Adafruit-PN532/releases

Raspberry Pi 2
  - Raspbian
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
Name
UID
MemberId
Enabled

Logs (LIST)
/api/v1/api/logs
-----
Action
UID
Success

## Migrate

``` bash
cd api
npm run-script migrate
```
