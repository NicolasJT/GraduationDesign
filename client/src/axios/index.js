import axios from 'axios';
import { get , post } from './tools';
import * as config from './config';

const GIT_OAUTH = 'https://github.com/login/oauth';
export const gitOauthLogin = () => axios.get(`${GIT_OAUTH}/authorize?client_id=f83ccdd2ce867f227ef6&redirect_uri=http://localhost:3006/&scope=user&state=reactAdmin`);
export const gitOauthToken = code => axios.post('https://cors-anywhere.herokuapp.com/' + GIT_OAUTH + '/access_token', {...{client_id: 'f83ccdd2ce867f227ef6',
    client_secret: '19cc53fb4145e7f93fbe404257b9d6856600d95c', redirect_uri: 'http://localhost:3006/', state: 'reactAdmin'}, code: code}, {headers: {Accept: 'application/json'}})
    .then(res => res.data).catch(err => console.log(err));
export const gitOauthInfo = access_token => axios({
    method: 'get',
    url: 'https://api.github.com/user?access_token=' + access_token,
}).then(res => res.data).catch(err => console.log(err));

// easy-mock数据交互
// 管理员权限获取
export const admin = () => get({url: config.MOCK_AUTH_ADMIN});

// 访问权限获取
export const guest = () => get({url: config.MOCK_AUTH_VISITOR});

export const management = () => get({url: config.MANAGEMENT_DATA});

export const postManagementObj = (obj) => post({url: config.UPDATE_MANAGEMENT_DATA , data: obj});

export const delMan = (obj) => post({url: config.DEL_MAN, data: obj});

export const stockAll = () => get({url: config.STOCK_ALL});

export const addUser = userData => post({url: config.ADD_USER, data: userData});

export const userTest = testData => post({url: config.USER_TEST, data: testData});

export const rbac = userid => post({url: config.RBAC, data: userid});

export const subDemand = data => post({url: config.SUB_DEMAND, data: data});

export const distribute = () => get({url: config.DISTRIBUTE});

export const getrecord = () => get({url: config.GET_RECORD});