import { UserProfile } from "./user-profile";

export class UserResponse {
    userLoginDTO: UserProfile
    jwt: string;
    constructor() {
        this.userLoginDTO = new UserProfile()
        this.jwt = ''
    }
}