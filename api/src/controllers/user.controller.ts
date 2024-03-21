import { plainToClass } from "class-transformer";
import { Get, JsonController } from "routing-controllers";
import { Service } from "typedi";
import { Logger } from "winston";
import { UserApiModel } from "../models/api/index.js";
import { UserRepository } from "../repositories/index.js";

@JsonController("/users")
@Service()
export class UserController {

    public constructor(
        private logger: Logger,
        private userRepository: UserRepository
    ) {
    }

    /**
     */
    @Get()
    public async searchUsers() {
        this.logger.debug("GET /users");

        const usersDB = this.userRepository.list();

        const usersAPI = plainToClass(UserApiModel, usersDB);

        return usersAPI;
    }
}
