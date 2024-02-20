import path from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import { Container } from "typedi";
import { createLogger, format, Logger, transports } from "winston";

import { env } from "./env.js";

let maxFileLen = 20;

Container.set({
    id: Logger,
    factory: () => createLogger({
        level: env.logging.level,
        levels: {
            off: 0,
            crit: 1,
            error: 2,
            warn: 3,
            info: 4,
            query: 5,
            debug: 6
        },
        format: format((info) => {
            info.timestamp = new Date().toISOString();
            info.file = path.posix.normalize(path.relative(process.cwd(), fileURLToPath(info.file)));
            // info.file = path.relative(process.cwd(), info.file).replace("\\", "/");
            maxFileLen = Math.max(maxFileLen, info.file?.length ?? 0);
            return info;
        })(),
        transports: [
            new transports.Console({
                format: format.printf(i => [
                    `[${chalk.grey(i.timestamp)}]`,
                    chalk.green(i.level.toUpperCase()),
                    chalk.blue((i.file ?? "").padEnd(maxFileLen, " ")),
                    chalk.bold(":"),
                    i.message
                ].join(" "))
            }),
            new transports.File({
                filename: env.logging.logfile,
                format: format.json()
            })
        ]
    })
});

declare module "logform" {
    interface TransformableInfo {
        timestamp: string;
        file: string;
    }
}
