import { Service } from "typedi";
import { DataSource, Repository } from "typeorm";

import { MediaDatabaseModel } from "../models/database/index.js";

@Service()
export class MediaRepository {

    private db: Repository<MediaDatabaseModel>;

    public constructor(datasource: DataSource) {
        this.db = datasource.getRepository(MediaDatabaseModel);
    }
}
