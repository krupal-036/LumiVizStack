
import { IUser } from "../models/User.model";
import { signToken } from "../utils/tokenHandler";
import { responseHandler } from "../utils/responseHandler";
import * as repo from "../repositories/user.repo";

export const register = async (userData: Pick<IUser, "username" | "email" | "password">) => {
    try {
        const user = await repo.createUser(userData);
        const token = signToken({
            userId: user.id,
            name: user.username,
            email: user.email,
            role: user.role,
            credits: user.credits,
        });
        return responseHandler(201, { token })
    } catch (err: any) {
        return responseHandler(400, { message: "Server not Available" });
    }
}

export const login = async (user: any) => {
    try {
        const token = signToken({
            userId: user.id,
            role: user.role,
            name: user.username,
            email: user.email,
            credits: user.credits
        });
        return responseHandler(200, { token });
    } catch (err: any) {
        return responseHandler(400, { message: "Server not Available" });
    }
}

export const updateUserData = async (req: any) => {
    const { username, password } = req.body;
    try {
        const user = req.validatedUserData;
        if (username) user.username = username;
        if (password) user.password = password;
        await user.save();
        return responseHandler(200, {
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        return responseHandler(500, { message: "Profile Update failed." });
    }
};
