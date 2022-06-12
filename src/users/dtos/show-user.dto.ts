import { Exclude, Expose } from "class-transformer";

export class ShowUserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Exclude()
    passord: string;
}