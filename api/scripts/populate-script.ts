import { Container } from "typedi";
import { DataSource } from "typeorm";
import { Chance } from "chance";
import "reflect-metadata";

import { LocationDatabaseModel, MediaDatabaseModel } from "../src/models/database/index.js";
import { UserStatusEnum } from "../src/enums/user-status.enum.js";
import "../src/logger.js";
import "../src/datasource.js";
import { UserRepository } from "../src/repositories/user.repository.js";

const userRepo = Container.get(UserRepository);
const mediaRepo = Container.get(DataSource).getRepository(MediaDatabaseModel);
const locationRepo = Container.get(DataSource).getRepository(LocationDatabaseModel);

const chance = new Chance();

const user = await userRepo.saveUser({
    id: undefined,
    name: chance.name(),
    status: UserStatusEnum.ACTIVE,
    locationsCanAccess: []
});

const media = await mediaRepo.save({
    code: chance.string({length: 20, alpha: true}),
    user: user,
    status: "ACTIVE"
});

const description = chance.company()
const location = await locationRepo.save({
    code: description.toLowerCase().replaceAll(" ", "-") + "-front-door",
    description,
});

await userRepo.addUserLocationAccess(user.id, location.id);
