import * as express from 'express';
import heather from './heather';

const api = express.Router();

api.use('/heather', heather);

export default api;