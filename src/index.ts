import express from 'express';
import api from './api/api';

const app = express();
app.use('/static', express.static('static'));

app.use('/api', api);

app.listen(process.env.port || 3000, () => {
	console.log('Server started!');
});