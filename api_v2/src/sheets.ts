import sheets from '@googleapis/sheets';

class sheetsHandler {
    constructor(keyfilePath: string | undefined, api_key: string | undefined) {
        this.keyfilePath = keyfilePath;
        this.api_key = api_key;
        this.client;
    }

    setupAuth() {
        const auth = new sheets.auth.GoogleAuth({
            keyFilename: this.keyfilePath,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
        const client = sheets.sheets({
            version: 'v4',
            auth: auth,
            key: this.api_key
        });
        return client;
    }

    async getValues(spreadsheetId: any, range: any) {
        const client = this.setupAuth();
        try {
            const result = await client.spreadsheets.values.get( {
                spreadsheetId: spreadsheetId,
                range: range
            });
            // console.debug('in sheets.getValues', result.data.values);
            return result.data.values;
        } catch (e) {
            console.error('sheets.fetchSpreadsheet ERROR', e);
            return e;
        }
    }

    // Type Definitions
    keyfilePath: string | undefined;
    api_key: string | undefined;
    client: any;
    spreadsheetId: string | undefined;
}

export { sheetsHandler };