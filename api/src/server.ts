import express from "express";
import { Container } from "typedi";
import { Logger } from "winston";

import { env } from "./env.js";
import { router } from "./router.js";

const logger = Container.get(Logger).child({file: import.meta.url});

const app = express();
app.use(router);

// Start the server
const port = env.serverPort;
app.listen(port, () => {
    logger.info(`Server started. Explore API at http://localhost:${port}/explorer.`);
});
