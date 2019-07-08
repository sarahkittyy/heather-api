import express from 'express';
import * as path from 'path';
import appRoot from 'app-root-path';
import * as fs from 'fs';
import request from 'request';

// Get the captcha key.
const captcha_key: string = fs.readFileSync(appRoot.resolve('private/captcha_key.txt')).toString().split('\n')[0].trim();

const heather = express.Router();
heather.use(express.urlencoded({extended: true}));

heather.get('/doot', (req, res) => {
	res.sendFile(appRoot.resolve('img/heatherdoot.jpg'));
});

heather.get('/message', (req, res) => {
	res.sendFile(appRoot.resolve('html/message.html'));
});

heather.get('/messages', (req, res) => {
	res.sendFile(appRoot.resolve('html/messages.html'));
});

heather.get('/messages/all', (req, res) => {
	fs.readFile(appRoot.resolve('cache.json'), (err, data) => {
		if(err)
		{
			res.send('Error gettin messages ;w;');
			return;
		}
		
		let content: any = JSON.parse(data.toString());
		res.send(JSON.stringify(content.messages));
	});
});

heather.post('/message', (req, res) => {
	if(!req.body.message)
	{
		res.send('..chu didn\'t send h a message ;w;');
		return;
	}
	if(!req.body['g-recaptcha-response'])
	{
		res.send('chu need to fill out the captcha, grr');
		return;
	}
	request('https://www.google.com/recaptcha/api/siteverify', {
		form: {
			secret: captcha_key,
			response: req.body['g-recaptcha-response'],
			remoteip: req.ip
		},
		method: 'POST'
	}, (err, resp, body ) => {
		let data = JSON.parse(body);
		if(!data.success)
		{
			res.send('invalid captcha, grr');
			return;
		}
		
		if(req.body.message.length > 80)
		{
			res.send('TOO BIG, SHTAP SPAMMING COPY-PASTA');
			return;
		}
		
		if(!fs.existsSync(appRoot.resolve('cache.json')))
		{
			fs.writeFileSync(appRoot.resolve('cache.json'), JSON.stringify({}));
		}
		fs.readFile(appRoot.resolve('cache.json'), (err, data) => {
			if(err) throw err;
			
			let obj: any = JSON.parse(data.toString());
			if(!obj.messages)
			{
				obj.messages = new Array<string>();
			}
			obj.messages.push(req.body.message);
			
			fs.writeFile(appRoot.resolve('cache.json'), JSON.stringify(obj), (err) => {
				if(err) throw err;
			
				res.sendFile(appRoot.resolve('html/successful.html'));
			});
		});
	});
});

export default heather;