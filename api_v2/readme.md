# API v2
## Goals
Create a single, authorative data source for members that the access control system can tie into. 
* Expand the door control system to be able to support other devices.
* Allow "dumb" device control that only needs to make a single api call to check for access.

## Design
A google spreadsheet will be used as the authoritative data source for badges.
The accessController API will provide a single endpoint with two variables: `badgeI` and `location`. When a request comes in, a canonical google sheet will be queried via Google's APIs to retrieve the list of badges and their access.

From the returned spreadsheet, a row matching the `badgeId` will be checked for a matching value for `location`. accessController API will then return a boolean true/false.

## TODO:
* Logging for historical records
* Cache most recent parsed spreadsheet for use when internet is offline