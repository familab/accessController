import type { Relation } from "typeorm";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { MediaStatusEnum } from "../../enums/media-status.enum.js";
import { UserDatabaseModel } from "./user.database-model.js";

@Entity("media")
export class MediaDatabaseModel {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => UserDatabaseModel, user => user.media)
    @JoinColumn({ name: "user_id" })
    user?: Relation<UserDatabaseModel>;

    @Column({ unique: true })
    code: string

    @Column({ type: "varchar" })
    status: MediaStatusEnum;

    @Column({ nullable: true })
    description?: string
}
