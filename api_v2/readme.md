# API v2
## Goals
Create a single, authorative data source for members that the access control system can tie into. 
* Expand the door control system to be able to support other devices.
* Allow "dumb" device control that only needs to make a single api call to check for access.

## Design
A google spreadsheet will be used as the authoritative data source for badges.
The accessController API will provide a single endpoint with two variables: `badgeId` and `location`. When a request comes in, a canonical google sheet will be queried via Google's APIs to retrieve the list of badges and their access.

From the returned spreadsheet, a row matching the `badgeId` will be checked for a matching value for `location`. accessController API will then return a boolean true/false.

## Download and Build:
### Prerequisities:
`nodejs` v16.15 or later.
### Download:
Pull branch and run `npm install` to download dependencies
### Build:
Run `npm build run` from the working directory. Server will start on localhost at the port specified in the `.env` file.

## Development Status:
### Complete:
* Create GET endpoint supporting two variables: `badgeId`, `location`
* Query google spreadsheet using google API
* Parse retrieved sheet to JSON
* Compare incoming `badgeId` and `location` to parsed json and return `[true, false]`
* Log requests to disk (and console.)
### TODO:
* Provide a way to retrieve logs that's nicer than grepping the .log file.
* Rotate logfile occasionally if it ends up growing too big.
* Create a default badge list to be stored in the .env file to use when device starts in offline.
* Cache most recent parsed spreadsheet for use when internet is offline