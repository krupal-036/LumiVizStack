import { NextFunction } from 'express';
import { comparePassword } from '../../utils/passwordHandler';
import { emailRegex, passwordRegex } from '../../utils/regex';
import { getUserByField } from '../../repositories/user.repo';

export const validateLogin = async (req: any, res: any, next: NextFunction) => {
    const { password } = req.body;
    const email = req.body.email?.trim()?.toLowerCase();

    if (!email || !password || !req.body) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!email) return res.status(400).json({ message: 'Email is required' });
    if (!password)
        return res.status(400).json({ message: 'Password is required' });

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid Email Format' });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message:
                'Invalid Password Format. Check length and required characters.',
        });
    }

    try {
        const user = await getUserByField({ email: email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email Address..' });
        }

        if (req.siteLoginDisabled && user.role !== 'admin') {
            return res.status(403).json({
                message:
                    'Login is temporarily disabled for users. Please try again later.',
            });
        }

        if (user.isDeleted) {
            return res
                .status(400)
                .json({ message: 'Your Account was deactivated' });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Server validation failed during login' });
    }
};
