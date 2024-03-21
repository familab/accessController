import { Service } from "typedi";
import { DataSource, Equal, Repository } from "typeorm";

import { UserDatabaseModel } from "../models/database/index.js";

@Service()
export class UserRepository {

    private db: Repository<UserDatabaseModel>;

    public constructor(datasource: DataSource) {
        this.db = datasource.getRepository(UserDatabaseModel);
    }

    public async list(): Promise<UserDatabaseModel[]> {
        return await this.db.find();
    }

    public async getByName(name: string): Promise<UserDatabaseModel | null> {
        const user = await this.db.findOneBy({
            name: Equal(name)
        });

        if (user) {
            user.locationsCanAccess ??= [];
            user.media ??= [];
        }
        return user;
    }

    public async create(user: UserDatabaseModel): Promise<UserDatabaseModel> {
        user = await this.db.save(user);
        user.locationsCanAccess ??= [];
        user.media ??= [];
        return user;
    }

    public async update(user: UserDatabaseModel): Promise<UserDatabaseModel> {
        user = await this.db.save(user);
        user.locationsCanAccess ??= [];
        user.media ??= [];
        return user;
    }

    public async delete(user: UserDatabaseModel): Promise<void> {
        await this.db.remove(user);
    }

    public async canUserAccess(mediaCode: string, locationCode: string): Promise<boolean> {
        const results = await this.db.query(queries.canUserAccess, [mediaCode, locationCode]);
        return results.at(0)?.userCanAccess === 1;
    }

    public async addUserLocationAccess(userId: number, locationId: number) {
        await this.db.query(queries.addUserLocationAccess, [userId, locationId]);
    }

    public async removeUserLocationAccess(userId: number, locationId: number) {
        await this.db.query(queries.removeUserLocationAccess, [userId, locationId]);
    }
}

const queries = {
    addUserLocationAccess:
        "INSERT INTO user_location_access (user_id, location_id) VALUES (?, ?)",
    removeUserLocationAccess:
        "DELETE FROM user_location_access WHERE user_id = ? AND location_id = ?",
    canUserAccess:
        `SELECT (count(*) > 0) as userCanAccess
         FROM media
                  JOIN user_location_access as ula ON media.user_id = ula.user_id
                  JOIN locations ON ula.location_id = locations.id
         WHERE media.code = ?
           AND locations.code = ?`
}
