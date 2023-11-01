import type { Relation } from "typeorm";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { UserStatusEnum } from "../../enums/user-status.enum.js";
import { LocationDatabaseModel } from "./location.database-model.js";
import { MediaDatabaseModel } from "./media.database-model.js";

@Entity("users")
export class UserDatabaseModel {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: "varchar" })
    status: UserStatusEnum;

    @Column({ nullable: true })
    name?: string;

    @ManyToMany(() => LocationDatabaseModel)
    @JoinTable({
        name: "user_location_access",
        joinColumn: { name: "user_id" },
        inverseJoinColumn: { name: "location_id" }
    })
    locationsCanAccess: LocationDatabaseModel[];

    @OneToMany(() => MediaDatabaseModel, media => media.user)
    media: Relation<MediaDatabaseModel>[];
}
