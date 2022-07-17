# Modern API rewrite

## Goals
Create a single, authorative data source for members that the access control system can tie into. 
* Expand the door control system to be able to support other devices.
* Allow "dumb" device control that only needs to make a single api call to check for access.

## Design
Database will contain a user class (req. @familab.org email and "admin" flag) that allows for making modifications to the door database.

Updated database schema will use the badge ID as a key with the member's name as additional data. Each ID can have "endorsements" granting them access to various systems including doors and tools (in the future)

### Potential database object
```json
{
    "id": <pkey>,
    "badgeId": 0xBAD7E123,
    "name": "String",
    "endorsements": 
        [
            "string",
            "string",
        ]
}
```