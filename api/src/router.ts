import { useContainer, useExpressServer } from "routing-controllers";
import { Container } from "typedi";
import { Router } from "express";
import "reflect-metadata";

import { AccessController } from "./controllers/access-controller.js";
import "./logger.js";

export const router = Router()

useContainer(Container);
useExpressServer(router, {
    routePrefix: "/api",
    controllers: [
        AccessController,
    ]
});
