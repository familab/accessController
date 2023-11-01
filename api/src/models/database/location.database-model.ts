import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("locations")
export class LocationDatabaseModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    code: string;

    @Column({ nullable: true })
    description?: string;
}
