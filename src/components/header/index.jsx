//admin的左侧导航
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd'

import memoryUtils from '../../untils/memoryUtils'
import LinkButton from '../link-button'
import {removeUser} from '../../untils/storageUtils'
import menuConfig from '../../config/menuConfig.js'
import {reqWeather} from '../../api'
import {formateDate} from '../../untils/dateUtils'



import './index.less'

class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '', // 天气图片的url
        weather: ''
      }
    //退出登录
    logOut = () => {
        Modal.confirm({
            title: '确认退出吗?',
            onOk: () => {
                // 删除保存的user数据
                removeUser()
                memoryUtils.user = {}
                // 跳转到login
                this.props.history.replace('/login')
            },
            onCancel() {
                console.log('Cancel')
            },
        })
    }
    //得到对应的标题
    getTitle = () => {
        let title = ''
        const path = this.props.location.pathname
        menuConfig.forEach(item => {
            //判断
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    async componentDidMount (){
        //更新时间
        this.timer = setInterval(() => {
            //获取现在时间
            const currentTime = formateDate(Date.now())
            //更新状态
            this.setState({ currentTime})
        }, 1000);
        //异步获取天气信息显示
        const { dayPictureUrl, weather } = await reqWeather('北京')
        this.setState({ dayPictureUrl, weather })
    }

    componentWillUnmount(){
        clearInterval(this.timer)
    }
    render() {
        const user = memoryUtils.user
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎,{user.username}</span>
                    <LinkButton onClick={this.logOut}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{this.state.currentTime}</span>
                        {this.state.dayPictureUrl ? <img src={this.state.dayPictureUrl} alt="weather" /> : null}
                        <span>{this.state.weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)
