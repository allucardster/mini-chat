import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    async authenticate(input: AuthInput): Promise<AuthResult> {
        const user = await this.validateUser(input);

        if (null === user) {
            throw new UnauthorizedException();
        }

        return this.signIn(user);
    }

    async validateUser(input: AuthInput): Promise<SignInData | null> {
        const user = await this.usersService.findByEmail(input.username);
        if (!user) {
            return null;
        }

        const inputPasswordHash = await bcrypt.hash(input.password, user.salt);
        if (user.password === inputPasswordHash) {
            return {
                id: user.id,
                username: user.email
            };
        }

        return null;
    }

    async signIn(user: SignInData): Promise<AuthResult> {
        const payload = {
            sub: user.id,
            username: user.username
        };
        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken: accessToken,
            userId: user.id,
            username: user.username
        };
    }
}
