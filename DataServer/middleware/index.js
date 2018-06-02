const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const miSend = require('./mi-send');
const config = require('./config');
module.exports = (app) => {
	app.use(cors(config));
	app.use(bodyParser());
	app.use(miSend());
}