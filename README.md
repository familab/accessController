# accessController
Access Control software written for Familab.

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