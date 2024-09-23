export class UserProfile {
    userId: number
    username: string
    email: string
    password: string
    role: string;

    constructor() {
        this.userId = 0,
        this.username = ''
        this.email = ''
        this.password = ''
        this.role = ''
    }
}