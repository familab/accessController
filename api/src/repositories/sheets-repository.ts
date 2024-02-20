import { sheets_v4 } from "@googleapis/sheets";
import { GoogleAuth } from "googleapis-common";
import { Service } from "typedi";
import { Logger } from "winston";

import { env } from "../env.js";
import Sheets = sheets_v4.Sheets;

type BadgeId = string;
type Endorsement = string;
type AccessCache = Record<BadgeId, Endorsement[]>;

@Service()
export class SheetsRepository {

    private readonly sheetsClient: Sheets;
    private accessCache: AccessCache = {};

    public constructor(
        private logger: Logger,
    ) {
        this.logger = logger.child({file: import.meta.url});

        this.sheetsClient = new Sheets({
            auth: new GoogleAuth({
                keyFile: env.google.credentialsFile,
                scopes: ['https://www.googleapis.com/auth/spreadsheets']
            })
        });
    }

    /**
     * Check if the given media can access the given location.
     *
     * @param mediaCode
     * @param locationCode
     */
    public async canUserAccess(mediaCode: string, locationCode: string): Promise<boolean> {
        await this.refreshAccessTable();

        const media = this.accessCache[mediaCode];

        if (!media) {
            this.logger.info(`Media '${mediaCode}' not found`);
            return false;
        }

        if (!media.includes(locationCode)) {
            this.logger.info(`Media '${mediaCode}' cannot access '${locationCode}'`);
            return false;
        }

        this.logger.info(`Media '${mediaCode}' can access '${locationCode}'`);
        return true;
    }

    /**
     * Pulls the Google Sheet and refreshes the access table cache.
     * @private
     */
    private async refreshAccessTable(): Promise<void> {
        this.logger.info("refreshAccessTable(): Entered");

        // Pull whole sheet from Google
        let table: string[][] | null;
        try {
            const result = await this.sheetsClient.spreadsheets.values.get({
                spreadsheetId: env.google.spreadsheetId,
                range: env.google.spreadsheetRange
            });
            table = result.data.values!;
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            this.logger.error("Table fetch failed: " + message);
            return;
        }

        // Ensure the response has content
        if (!table) {
            this.logger.error("Table fetch returned empty");
            return;
        }

        // Map the table to the access cache
        const [headers, ...rows] = table;
        this.accessCache = Object.fromEntries(
            rows.map((row) => {
                const mediaCode = row[0];
                const locationCodes = headers.filter((_, i) => row[i] === "TRUE");
                return [mediaCode, locationCodes];
            })
        );

        this.logger.debug("accessCache", this.accessCache);
        this.logger.info("refreshAccessTable(): Exited");
    }
}
