import type { Response } from "express";
import { HeaderParam, JsonController, Param, Post, Res } from "routing-controllers";
import { Service } from "typedi";
import { Logger } from "winston";

import { UserRepository } from "../repositories/index.js";
import { AccessService } from "../services/access.service.js";

@JsonController("/access")
@Service()
export class AccessController {

    public constructor(
        private readonly logger: Logger,
        private readonly accessService: AccessService,
        private readonly userRepository: UserRepository
    ) {
        this.logger = logger.child({ file: import.meta.url });
    }

    /**
     */
    @Post("/:media_code")
    public async postAccess(
        @HeaderParam("x-location-code", { required: true })
            locationCode: string,
        @Param("media_code")
            mediaCode: string,
        @Res()
            res: Response
    ) {
        try {
            this.logger.info("POST /access", locationCode, mediaCode);

            await this.accessService.updateDatabaseFromGoogleSheet();
            const userCanAccess = await this.userRepository.canUserAccess(mediaCode, locationCode);

            if (userCanAccess) {
                res.status(200);
                this.logger.info("POST /access [200]");
                return true;
            } else {
                res.status(401);
                this.logger.info("POST /access [401]");
                return false;
            }
        } catch (e) {
            res.status(500);
            this.logger.info("POST /access [500]");
            throw e;
        }
    }
}
