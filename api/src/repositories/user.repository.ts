import { Service } from "typedi";
import { DataSource, Repository } from "typeorm";

import { UserDatabaseModel } from "../models/database/index.js";

@Service()
export class UserRepository {

    private db: Repository<UserDatabaseModel>;

    public constructor(datasource: DataSource) {
        this.db = datasource.getRepository(UserDatabaseModel);
    }
}
