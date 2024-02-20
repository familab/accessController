FamiLAB Access Controller
=========================

Access Control software written for Familab.

## Development Setup
1. Install Node 18+
2. Globally install `pnpm`
```bash
npm install --global pnpm
```
3. Install Node packages
```bash
pnpm install
```
4. Follow Development Setup instructions for the sub-project you wish to work on.


## Version 2 Goals
* Move the canonical list of badges to the cloud to protect from an SD card failure
* Expand the system to support more access types than just the front door
* Improve security for who can update the badge list

## API v2
_Note: More details can be found in the readme in the api_v2 folder_.

Includes a single API endpoint.
Retrieves badge access list from a Google Spreadsheet.
Compares badge and location from API request to list from google spreadsheets and returns a boolean true/false.

## Microcontroller v2
TBD
