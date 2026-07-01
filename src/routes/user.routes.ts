import { Router } from 'express';
import { validateRegister } from '../middleware/validations/validateRegister.js';
import { validateLogin } from '../middleware/validations/validateLogin.js';
import * as c from '../controllers/user.controller.js';

const r = Router();

// @route   POST api/auth/register
// @desc    Create new User
r.post('/register', validateRegister, c.register);

// @route   POST api/auth/login
// @desk    Login Existing User
r.post('/login', validateLogin, c.login);

export default r;
