import * as type from './type';
import * as http from '../axios/index';

const requestData = category => ({
    type: type.REQUEST_DATA,
    category
});
export const receiveData = (data, category) => ({
    type: type.RECEIVE_DATA,
    data,
    category
});
/**
 * 请求数据调用方法
 * @param funcName      请求接口的函数名
 * @param params        请求接口的参数
 */
export const fetchData = ({funcName, params, stateName, userId}) => dispatch => {
    !stateName && (stateName = funcName);
    dispatch(requestData(stateName));
    console.log('|||userId', userId);
    const data = {id: userId};
    return http[funcName](data).then(res => {
       console.log('res', res);
       dispatch(receiveData(res, stateName))
   }); 
};