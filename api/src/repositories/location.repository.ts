import { Service } from "typedi";
import { DataSource, Repository } from "typeorm";
import { LocationDatabaseModel } from "../models/database/index.js";

@Service()
export class LocationRepository {

    private db: Repository<LocationDatabaseModel>;

    public constructor(datasource: DataSource) {
        this.db = datasource.getRepository(LocationDatabaseModel);
    }
}
