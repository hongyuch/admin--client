/*用来发ajax请求的函数模块
包装的就是axios ==> 向外暴露本质就是axios
    1).将post请求的data对象数据转换为urlencode格式的字符串数据 ==> 请求拦截器（后台接口不能处理json格式请求参数）
    2).请求成功得到的数据不是response，而是response.data ===> 响应拦截器（成功的回调）
    3）.统一处理请求异常，外部调用者不用再处理异常 ===> 响应拦截器（失败的回调）
*/

import axios from 'axios'
import {message} from 'antd'
const qs = require('qs')

//使用请求拦截器
axios.interceptors.request.use(config => {
    console.log(config)
    //判断
    if(config.method.toUpperCase() === 'POST' && config.data instanceof Object){
        config.data = qs.stringify(config.data)
    }
    return config
})
//使用响应拦截器
axios.interceptors.response.use(
    response => {//ajax请求成功

        return response.data
    },
    error => {//ajax请求异常
        message.error('请求失败', + error.message)
        //返回一个pending状态的promise === 中断promise链
        return new Promise(() => {})
    }
)

// axios.post('/login',{username:'admin',password:'admin'})
//     .then(
//         data => {

//         }
//     )

export default axios