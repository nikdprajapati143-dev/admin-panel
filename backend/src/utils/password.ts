import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
    candidate: string,
    hashed: string,
): Promise<boolean> => {
    return await bcrypt.compare(candidate, hashed);
};
