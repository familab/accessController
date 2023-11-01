import typeorm, { DataSource } from "typeorm";
import { Container } from "typedi";
import { Logger } from "winston";

import { env } from "./env.js";
import "./logger.js";
import { LocationDatabaseModel, MediaDatabaseModel, UserDatabaseModel } from "./models/database/index.js";

Container.set({
    id: DataSource,
    factory: () => new DataSource({
        type: "sqlite",
        database: env.database,
        synchronize: true,
        logging: true,
        logger: winstonToTypeorm(Container.get(Logger)),
        entities: [
            UserDatabaseModel,
            MediaDatabaseModel,
            LocationDatabaseModel,
        ],
        subscribers: [],
        migrations: [],
    })
});

await Container.get(DataSource).initialize();

function winstonToTypeorm(logger: Logger): typeorm.Logger {
    return {
        logQuery: (query: string, parameters?: any[]): any =>
            logger.log("query", query, { parameters }),
        logQueryError: (error: string | Error, query: string, parameters?: any[]): any =>
            logger.log("error", "Query Error: ", { error, query, parameters }),
        logQuerySlow: (time: number, query: string, parameters?: any[]): any =>
            logger.log("warn", "Migration: ", { time, query, parameters }),
        logSchemaBuild: (message: string): any =>
            logger.log("debug", "SchemaBuild: " + message),
        logMigration: (message: string): any =>
            logger.log("debug", "Migration: " + message),
        log: (level: "log" | "info" | "warn", message: any): any =>
            logger.log(level, message),
    };
}
