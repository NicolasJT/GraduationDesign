const koa = require('koa');
const app = new koa;
app.keys = ['some scret hurr'];

const router = require('./router');//router support
const middleWare = require('./middleware');

middleWare(app);
router(app);

app.listen(3000,() => {
	console.log('Server start 3000');
});