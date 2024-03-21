import { Expose } from "class-transformer";
import { UserStatusEnum } from "../../enums/user-status.enum.js";

export class UserApiModel {

    @Expose()
    id: number;

    @Expose()
    status: UserStatusEnum;

    @Expose()
    name: string;
}
