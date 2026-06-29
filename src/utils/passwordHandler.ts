import bcrypt from 'bcrypt';

export const hashPassword = async (password: any) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password: any, hashedPassword: any) => {
    return await bcrypt.compare(password, hashedPassword);
};
