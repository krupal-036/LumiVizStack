import { Router } from 'express';
import * as c from '../controllers/history.controller.js';
import { validateHistory } from '../middleware/validations/validateHistory.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const r = Router();

r.use(authenticate, authorizeRoles('admin', 'user'));

// @route   POST api/history/save
// @desc    Save visualization history (Max 10 per user)
r.post('/save', validateHistory, c.createHistory);


// @route   PUT api/history/:id/toggle
// @desc    Toggle isPublic flag
r.put('/:id/toggle', c.toggleHistoryStatus);


// @route   GET api/history/user
// @desc    Get All History (User Specific)
r.get('/user', c.getAllHistoryForUser);


// @route   GET api/history/public/:shareId
// @desc    Get public history by Share ID (accessible by anyone)
r.get('/public/:shareId', c.getPublicHistory);


// @route   PUT api/history/delete-all
// @desc    Mark all history as deleted (Soft Delete)
r.put('/delete-all', c.toggleDeleteAllHistory);


// @route   DELETE api/history/delete-all
// @desc    Delete all history items
r.delete('/delete-all', c.deleteAllHistoryUser);


// @route   DELETE api/history/:id
// @desc    Delete a history item
r.delete('/:id', c.deleteOneHistoryItem);


// @route   PUT api/history/:id/
// @desc    Toggle isDelete flag
r.put('/:id', c.toggleDeleteHistory);

export default r;
