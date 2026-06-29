import { Router } from 'express';
import * as c from '../controllers/user.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { validateProfile } from '../middleware/validations/validateProfile.js';

const r = Router();

r.use(authenticate, authorizeRoles('admin', 'user'));

// @route   PUT api/profile/update
// @desc    Update user profile
r.put('/update', validateProfile, c.updateUserData);

// @route   PUT api/profile/delete
// @desc    Deactivate user and delete associated history
r.put('/delete', c.toggleProfileStatus);

export default r;
