require('dotenv').config();

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var User = require('./app/models/user');
var apiRouter = require('./app/router');

var port = process.env.PORT || 3000;
var app = express();

mongoose.connect(process.env.DB_URL);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api', apiRouter);

app.get('/', function(req, res) {
	res.send('hello');
});

app.get('/seed', function(req, res) {
	var user = new User({
		name: 'willy',
		password: 'password',
		admin: true
	});

	user.save(function(err) {
		if (err) {
			throw err;
		}
		res.send({ success: true });
	})
});

app.listen(port, function() {
	console.log('jwt server is started');
})