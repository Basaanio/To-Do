export class UserRegisterDTO{
    userId: number
    username: string
    email: string
    password: string

    constructor() {
        this.userId = 0,
        this.username = ''
        this.email = ''
        this.password = ''
    }
}