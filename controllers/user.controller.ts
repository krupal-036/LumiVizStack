import * as service from '../services/user.service.js';

export const register = async (req: any, res: any) => {
    const result: any = await service.register(req.body);
    res.cookie('token', result.data?.token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 10 * 24 * 60 * 60 * 1000,
    });
    return res.status(result.code).json(result.data);
};

export const login = async (req: any, res: any) => {
    const result: any = await service.login(req.user);
    res.cookie('token', result.data?.token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 10 * 24 * 60 * 60 * 1000,
    });
    return res.status(result.code).json(result.data);
};

export const updateUserData = async (req: any, res: any) => {
    const result = await service.updateUserData(req);
    return res.status(result.code).json(result.data);
};

export const toggleProfileStatus = async (req: any, res: any) => {
    const result = await service.toggleProfileStatus(req.user);
    return res.status(result.code).json(result.data);
};
