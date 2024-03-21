import { Service } from "typedi";
import { DataSource, Repository } from "typeorm";

import { MediaDatabaseModel } from "../models/database/index.js";
import { MediaStatusEnum } from "../enums/media-status.enum.js";

@Service()
export class MediaRepository {

    private db: Repository<MediaDatabaseModel>;

    public constructor(datasource: DataSource) {
        this.db = datasource.getRepository(MediaDatabaseModel);
    }

    public async create(media: MediaDatabaseModel): Promise<MediaDatabaseModel> {
        return await this.db.save(media);
    }

    public async findByCode(code: string): Promise<MediaDatabaseModel | undefined> {
        return await this.db.findOneBy({
            code
        }) ?? undefined;
    }

    public async deactivateByCode(code: string): Promise<void> {
        const media = await this.db.findOneBy({code: code});
        if (!media) {
            return;
        }
        media.status = MediaStatusEnum.INACTIVE;
        await this.db.save(media);
    }
}
