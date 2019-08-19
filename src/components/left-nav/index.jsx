//admin的左侧导航
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'

import menuList from '../../config/menuConfig'
import memoryUtils from '../../untils/memoryUtils'
import login from '../../assets/images/logo.png'
import './index.less'

const { SubMenu, Item } = Menu

class LeftNav extends Component {
    hasAuth = (item)  => {
        //得到当前用户的所有权限
        const user = memoryUtils.user
        const menus = user.role.menus
        //如果当前用户是admin
        //如果item是公开的
        //当前item有此item的权限
        if (user.username === 'admin' || item.public || menus.indexOf(item.key) !== -1){
            return true
        }else if(item.children){
            const cItem = item.children.find(cItem => menus.indexOf(cItem.key) != -1)
            return !!cItem
        }
        //如果当前用户有item的某个节点的权限，当前item也应该显示
        return false
    }

    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        // console.log(menuList)
        return menuList.map((item) => {
            //判断当前用户是否具有操作item的权限，如果有才显示对应的
            if(this.hasAuth(item)){
                //判断，返回的是<Item>，还是<SubMenu>
                if (!item.children) {
                    return (
                        <Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Item>
                    )
                }
                else {
                    // 当前item的children中某个item的key与当前请求的path相同, 当前item的key就是openKey
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    if (cItem) {
                        //保存openKey
                        this.openKey = item.key
                    }
                    return (
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {
                                this.getMenuNodes(item.children)
                            }
                        </SubMenu>
                    )
                }
            }
        })
    }

    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }
    render() {
        let path = this.props.location.pathname
        if (path.indexOf('/product') === 0){
            path = '/product'
        }
        return (
            <div className='left-nav'>
                <Link to='./home' className='left-nav-header'>
                    <img src={login} alt="login" />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[path]}
                    defaultOpenKeys={[this.openKey]}
                >
                    {this.menuNodes}
                </Menu>

            </div>
        )
    }
}

// 新组件会向LeftNav组件传递3个属性: history/location/match
export default withRouter(LeftNav)
