import { Service } from "typedi";
import { Logger } from "winston";

import { LocationRepository, MediaRepository, SheetsRepository, UserRepository } from "../repositories/index.js";
import { UserStatusEnum } from "../enums/user-status.enum.js";
import { MediaStatusEnum } from "../enums/media-status.enum.js";
import { UserDatabaseModel } from "../models/database/index.js";
import { plainToInstance } from "class-transformer";

@Service()
export class AccessService {

    public constructor(
        private readonly logger: Logger,
        private readonly sheetsRepository: SheetsRepository,
        private readonly userRepository: UserRepository,
        private readonly mediaRepository: MediaRepository,
        private readonly locationRepository: LocationRepository,
    ) {
        this.logger = logger.child({ file: import.meta.url });
    }

    public async updateDatabaseFromGoogleSheet(): Promise<void> {
        // Get the spreadsheet from Google
        const [headers, ...rows] = await this.sheetsRepository.getTable();

        // Get location entities for the location codes in the spreadsheet
        const [, , ...locationCodes] = headers;
        const locations = await this.locationRepository.getLocations(locationCodes.reverse());

        // Loop through each row in the table
        for (let row of rows) {
            // First and second cells are mediacode and username
            const [mediaCode, userName, ...access] = row;

            // Get or create user
            let user: UserDatabaseModel | null = await this.userRepository.getByName(userName);
            if (!user) {

                user = plainToInstance(UserDatabaseModel, {
                    name: userName,
                    status: UserStatusEnum.ACTIVE,
                    locationsCanAccess: [],
                    media: []
                });
                user = await this.userRepository.create(user);
            }

            // Ensure user has media
            let media = user.media.find(media => media.code === mediaCode);
            if (!media) {
                media = await this.mediaRepository.findByCode(mediaCode);
                if (media) {
                    user.media.push(media);
                }
            }
            if (!media) {
                media = await this.mediaRepository.create({
                    code: mediaCode,
                    status: MediaStatusEnum.ACTIVE
                });
                user.media.push(media);
            }

            // Loop through each access code
            for (const accessInstance of access) {
                const index = access.indexOf(accessInstance);
                const targetedLocation = locations[index];

                const userLocationIndex = user.locationsCanAccess
                    .findIndex(l => l.id === targetedLocation.id);

                // Add or remove location to user
                if (accessInstance.toLowerCase() === "true") {
                    if (userLocationIndex === -1) {
                        user.locationsCanAccess.push(targetedLocation);
                    }
                } else {
                    if (userLocationIndex != -1) {
                        user.locationsCanAccess.splice(userLocationIndex, 1);
                    }
                }
            }

            // Save user
            await this.userRepository.update(user);
        }

        // Synced whole spreadsheet to database
    }
}
