var express = require('express');
var apiRouter = express.Router();
var User = require('./models/user');
var jwt = require('jsonwebtoken');

module.exports = apiRouter;

apiRouter.post('/authenticate', function(req, res) {
	User.findOne({ name: req.body.name }, function(err, user) {
		if (err) {
			throw err;
		}
		if (!user) {
			res.json({ success: false, message: 'Authentication fail. User doesn\'t exist' });
		} else {
			if (user.password !== req.body.password) {
				res.json( {success: false, message: 'Authentication fail. Password is invalid'} );
			} else {
				// if user exists and password is valid
				// then server side will create a jwt token
				var token = jwt.sign({
					name: req.body.name,
					password: req.body.password,
					exp:   Math.floor(new Date().getTime()/1000) + 60
				}, process.env.SECRET);

				// return all information 
				res.json({
					success: true,
					message: 'Enjoy your token',
					token: token
				});
			}
		}
	});
});

apiRouter.use(function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-across-token'];
	if (!token) {
		return res.status(403).json({
			success: false,
			message: 'No proivded token'
		});
	} else {
		jwt.verify(token, process.env.SECRET, function(err, decoded) {
			if (err) {
				return res.json({
					success: false,
					message: 'Failed to authenticate token'
				});
			}

			req.decoded = decoded;
			next();
		});
	}
});

apiRouter.get('/', function(req, res) {
	res.json({ 
		message: 'welcome to api',
		name: req.decoded['name'],
		password: req.decoded['password'] 
	});
});

apiRouter.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		if (err) {
			res.json({ error: true });
		}
		res.json({
			users: users,
			decoded: req.decoded
		});
	});
});

