const mysql = require('mysql');
const config = require('./config');

module.exports = () => {
	var connection = mysql.createConnection(config);
	return connection;
}