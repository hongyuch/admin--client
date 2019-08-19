/* 
包含n个接口请求函数的模块，每个函数的返回值都是promise对象
根据接口文档编写
*/
import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

const BASE = ''
//1.登录
export const reqLogin = ({ username,password }) => ajax.post(BASE + '/login',{ username,password })
//2.添加用户
export const reqAddUser = (user) => ajax({
    url:BASE + '/manage/user/add',
    method:'POST',
    data:user
})
//更新用户
export const reqUpdateUser = (user) => ajax.post('/manage/user/update',user)
//删除用户
export const reqDeleteUser = (userId) => ajax.post('/manage/user/delete', {
  userId
})
//获取所有用户列表
export const reqUsers = () => ajax('/manage/user/list')
//3.获取天气
export const reqWeather = (city) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2&${Date.now()}`
    return new Promise((resolve, reject) => {
        jsonp(url, {}, (error, response) => {
            if (!error && response.status == 'success') {
              const {dayPictureUrl, weather} = response.results[0].weather_data[0]
              resolve({dayPictureUrl, weather})
            } else {
              message.error('获取天气信息失败')
            }
          })
      
    })
}
//4.获取分类列表
export const reqCategorys = () => ajax('/manage/category/list')
//5.添加分类
export const reqAddCategory = (categoryName) => ajax.post('/manage/category/add', {
  categoryName
})
//根据分类ID获取分类
export const reqCategory = (categoryId) => ajax('/manage/category/info',{
  params:{
    categoryId
  }
})
//6.修改分类
export const reqUpdateCategory = (categoryId,categoryName) => ajax.post('/manage/category/update', {
  categoryId,categoryName
})
//7.获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax.get('/manage/product/list',{
  params: { // 值是对象, 对象中包含的是query参数数据
    pageNum,
    pageSize
  }
})
// 根据Name/desc搜索产品分页列表
export const reqSearchProducts = ({
    pageNum,
    pageSize,
    searchType,
    searchName
  }) => ajax('/manage/product/search', {
   params: { // 值是对象, 对象中包含的是query参数数据
     pageNum,
     pageSize,
     [searchType]: searchName
   }
})
//对商品进行上架/下架处理
export const reqUpdateStatus = (productId, status) => ajax({
  method:'POST',
  url:'/manage/product/updateStatus',
  data:{
    productId,
    status
  }
})
//根据商品ID获取商品
export const reqProduct = (productId) => ajax('/manage/product/info', {
  params:{
    productId
  }
})
//删除图片
export const reqDelImg = (name) => ajax.post('/manage/img/delete', {name})
//添加商品
export const reqAddUpdateProduct = (product) => ajax.post('/manage/product/' + (product._id ? 'update' : 'add'), product)
//获取角色列表
export const reqRoles = () => ajax('/manage/role/list')
//添加角色
export const reqAddRole = (roleName) => ajax.post('/manage/role/add', {
  roleName
})
//更新角色
export const reqUpdateRole = ({
    _id,
    menus,
    auth_time,
    auth_name
  }) => ajax.post('/manage/role/update', {
  _id,
  menus,
  auth_time,
  auth_name
})
