import { Service } from "typedi";
import { DataSource, In, Repository } from "typeorm";
import { LocationDatabaseModel } from "../models/database/index.js";

@Service()
export class LocationRepository {

    private db: Repository<LocationDatabaseModel>;

    public constructor(datasource: DataSource) {
        this.db = datasource.getRepository(LocationDatabaseModel);
    }

    /**
     * Given a list of location codes, return list of location entities in the same order as the list of codes.
     *
     * If the code doesn't exist in the database, create it.
     *
     * @param locationCodes
     */
    public async getLocations(locationCodes: string[]): Promise<LocationDatabaseModel[]> {

        // Try inserting all location codes
        const insertResponse = await this.db.createQueryBuilder()
            .insert()
            .values(locationCodes.map(code => ({code})))
            .orIgnore()
            .execute();
        console.log(insertResponse);

        // Fetch all location codes that match the list
        const locations = await this.db.findBy({
            code: In(locationCodes)
        });

        // Sort location entities to match order of codes passed in
        const codeToLocation: Record<string, LocationDatabaseModel> = Object.fromEntries(locations.map(l => ([l.code, l])))
        return locationCodes.map(l => codeToLocation[l]);
    }
}
