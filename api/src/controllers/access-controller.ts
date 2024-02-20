import { Response } from "express";
import { HeaderParam, JsonController, Param, Post, Res } from "routing-controllers";
import { Service } from "typedi";
import { Logger } from "winston";

import { SheetsRepository } from "../repositories/sheets-repository.js";

@JsonController("/access")
@Service()
export class AccessController {

    public constructor(
        private readonly logger: Logger,
        private readonly sheetsRepository: SheetsRepository
    ) {
        this.logger = logger.child({file: import.meta.url});
    }

    /**
     */
    @Post("/:media_code")
    public async postAccess(
        @HeaderParam("x-location-code", {required: true})
            locationCode: string,
        @Param("media_code")
            mediaCode: string,
        @Res()
            res: Response
    ) {
        this.logger.info("POST /access", locationCode, mediaCode);

        const userCanAccess = await this.sheetsRepository.canUserAccess(mediaCode, locationCode);

        if (userCanAccess) {
            res.status(200);
            this.logger.info("POST /access [200]");
            return true;
        } else {
            res.status(401);
            this.logger.info("POST /access [401]");
            return false;
        }
    }
}
