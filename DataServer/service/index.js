const management = require('./mysqlservice/management');
const rbac = require('./mysqlservice/rbac');
const stock = require('./mysqlservice/stock');
const users = require('./mysqlservice/users');
const demand = require('./mysqlservice/demand');
const distribute = require('./util/dituibute');
const store = require('./mysqlservice/store');
module.exports = {
	management: management,
	rbac: rbac,
	stock: stock,
	users: users,
	demand: demand,
	distribute: distribute,
	store: store
}