import process from "node:process";
import fs from "node:fs";

class Env {
    public static string(variableName: string): string;
    public static string(variableName: string, defaultValue: string): string;
    public static string(variableName: string, arg2?: string): string | undefined {
        let val = process.env[variableName];

        // If no value is present for the env var, check if its saved as a file?
        if (val == null) {
            const filename = process.env[variableName + "#file"];
            if (filename && fs.existsSync(filename)) {
                val = fs.readFileSync(filename, { encoding: "utf-8" })
            }
        }

        if (val != null) return val;
        if (typeof arg2 === "string") return arg2;
        throw new Error(`Missing environment variable '${variableName}'`);
    }

    public static number(variableName: string): number {
        const val1 = Env.string(variableName);
        const val2 = Number(val1);
        if (isNaN(val2)) {
            throw new Error(`Invalid environment variable '${variableName}=${val1}'`);
        }
        return val2;
    }
}

export const env = {
    serverPort: Env.number("SERVER_PORT"),
    logging: {
        level: Env.string("LOGGING.LEVEL", "off"),
        logfile: Env.string("LOGGING.LOGFILE", "logfile.log"),
    },
    database: Env.string("DATABASE", ".temp.sqlite"),
    google: {
        credentials: {
            client_email: Env.string("GOOGLE.CREDENTIALS.CLIENT_EMAIL"),
            private_key: Env.string("GOOGLE.CREDENTIALS.PRIVATE_KEY")
                .replaceAll("\\n", "\n"),
        },
        spreadsheetId: Env.string("GOOGLE.SPREADSHEET_ID"),
        spreadsheetRange: Env.string("GOOGLE.SPREADSHEET_RANGE", "Sheet1"),
    }
}
