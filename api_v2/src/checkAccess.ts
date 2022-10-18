import dotenv from "dotenv";
import { sheetsHandler } from "./sheets.js";
import { createLogger, transports, format } from "winston";
// import winston from "winston/lib/winston/config/index.js";

class checkAccess {
    constructor() {
        dotenv.config();
        this.api_key = process.env.API_KEY;
        this.credentials = process.env.CREDENTIALS;
        this.spreadsheet_id = process.env.SPREADSHEET_ID;
        this.spreadsheet_sheet_id = process.env.SPREADSHEET_SHEET_NAME;
        this.retrievedBadgeId = '';

        this.handler = new sheetsHandler(this.credentials, this.api_key);
        const logger = createLogger({
            transports: [
                new transports.Console({
                    format: format.combine(
                        format.colorize(),
                        format.timestamp({format: 'MM-DD-YYYY HH:mm:ss'}),
                        format.printf(({ timestamp, level, message }) => {
                            return `[${timestamp}] ${level}: ${message}`;
                        })
                    )
                }),
                new transports.File({
                    filename: process.env.LOGFILE_PATH,
                    format: format.combine(format.timestamp({format: 'MM-DD-YYYY HH:mm:ss'}),format.json())
                })
            ],
        });
        this.logger = logger;
    }

    async checkBadgeId(badgeId: string, location: string) {
        this.logger.info(`Access request at ${location}: ${badgeId}`);
        const sheet = await this.handler.getValues(this.spreadsheet_id, [this.spreadsheet_sheet_id]) // This is a 2d array representation of the table. [row:[cell,cell],row:[cell,cell]]
        const members = this.convertSheetsArrayToObject(sheet as Array<Array<any>>);
        if (badgeId in members) {
            let access = members[badgeId as keyof accessObject].includes(location)
            this.logger.info(`Access ${access ? "Granted" : "Denied"} at ${location}: ${badgeId}`);
            return access;
        }
        this.logger.warn(`Access Denied at ${location}: ${badgeId}`);
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
    logger: any;
    retrievedBadgeId: string;
    spreadsheet_id: string | undefined;
    spreadsheet_sheet_id: string | undefined;
}

interface accessObject {
    key: string[];
}

export { checkAccess };