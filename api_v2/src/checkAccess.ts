import dotenv from "dotenv";
import { sheetsHandler } from "./sheets.js";

class checkAccess {
    constructor() {
        dotenv.config();
        this.api_key = process.env.API_KEY;
        this.credentials = process.env.CREDENTIALS;
        this.spreadsheet_id = process.env.SPREADSHEET_ID;
        this.spreadsheet_sheet_id = process.env.SPREADSHEET_SHEET_NAME;
        this.retrievedBadgeId = '';

        this.handler = new sheetsHandler(this.credentials, this.api_key);
    }

    async checkBadgeId(badgeId: string, location: string) {
        const sheet = await this.handler.getValues(this.spreadsheet_id, [this.spreadsheet_sheet_id]) // This is a 2d array representation of the table. [row:[cell,cell],row:[cell,cell]]
        const members = this.convertSheetsArrayToObject(sheet as Array<Array<any>>);
        if(badgeId in members) {
            return members[badgeId as keyof accessObject].includes(location);
        }
        return false;
    }

    convertSheetsArrayToObject(sheet: Array<Array<any>>) {
        let accessObject = {} as accessObject;

        sheet.forEach((row: Array<any>, i: number) => {
            if (i > 0) { //skip first row, its frozen labels.
                let retrievedBadgeId = row[0] as string;
                let endorsementsArray: Array<string> = []
                row.forEach((value, i) => {
                    if (i > 0 && value === 'TRUE') { // skip first element, its the badge ID
                        endorsementsArray.push(sheet[0][i]);
                    }
                })
                accessObject[retrievedBadgeId as keyof accessObject] = endorsementsArray;
            }
        });
        
        return accessObject;
    }


    api_key: string | undefined;
    credentials: string | undefined;
    handler: sheetsHandler;
    retrievedBadgeId: string;
    spreadsheet_id: string | undefined;
    spreadsheet_sheet_id: string | undefined;
}

interface accessObject {
    key: string[];
}

export { checkAccess };