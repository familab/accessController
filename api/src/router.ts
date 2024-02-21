import { Router } from "express";
import { getMetadataArgsStorage, RoutingControllersOptions, useContainer, useExpressServer } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { serve, setup } from "swagger-ui-express";
import { Container } from "typedi";
import "reflect-metadata";

import { AccessController } from "./controllers/access.controller.js";
import "./logger.js";

// Declare router
export const router = Router();

// Define configuration for RoutingControllers
const options: RoutingControllersOptions = {
    routePrefix: "/api",
    controllers: [
        AccessController,
    ]
};

// Setup routing-controllers server
useContainer(Container);
useExpressServer(router, options);

// Setup Swagger explorer
const swaggerSpec = routingControllersToSpec(getMetadataArgsStorage(), options, {
    info: {
        title: "FamiLAB Access Control",
        version: "4"
    }
});
router.use('/explorer', serve, setup(swaggerSpec));
