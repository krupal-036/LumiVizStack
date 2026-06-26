import * as service from "../services/user.service"

export const register = async (req: any, res: any) => {
    const result: any = await service.register(req.body);
    res.cookie('token', result.data?.token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 10 * 24 * 60 * 60 * 1000
    });
    return res.status(result.code).json(result.data);
}

export const login = async (req: any, res: any) => {
    const result: any = await service.login(req.user);
    res.cookie('token', result.data?.token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 10 * 24 * 60 * 60 * 1000
    });
    return res.status(result.code).json(result.data);
}

export const updateUserData = async (req: any, res: any) => {
    const result = await service.updateUserData(req.body);
    return res.status(result.code).json(result.data);
}