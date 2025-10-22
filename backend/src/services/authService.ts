import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import prisma from "../config/database";

type PublicUser = Omit<User, 'passwordHash'>;

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

export const registerUserService = async (userData: { name: string; email: string; password: string }): Promise<{ user: PublicUser; token: string }> => {
    try {
        const normalEmail = userData.email.toLowerCase().trim();
        const existingUser = await prisma.user.findUnique(
            {
                where: { email: normalEmail }
            }
        );
        if (existingUser) {
            throw new Error('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        const user = await prisma.user.create({
            data: {
                name: userData.name,
                email: normalEmail,
                passwordHash: hashedPassword
            }
        });

        const { passwordHash, ...publicUser } = user;

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        return { user: publicUser, token };

    } catch (error) {
        throw(error);
    }
};

export const loginUserService = async (creds: { email: string; password: string }): Promise<{ user: PublicUser; token: string }> => {
    try {
        const email = creds.email.toLowerCase().trim();

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const passwordOk = await bcrypt.compare(creds.password, user.passwordHash);
        if (!passwordOk) {
            throw new Error('Invalid credentials');
        }

        const { passwordHash, ...publicUser } = user;

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        return { user: publicUser, token };

    } catch (error) {
        throw Error;
    }
};