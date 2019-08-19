import React, { Component } from 'react'
import { Form, Input,Tree } from 'antd'
import PropTypes from 'prop-types'

import menuList from '../../config/menuConfig';

const Item = Form.Item
const { TreeNode } = Tree

export default class AuthForm extends Component {
  static propTypes = {
    role: PropTypes.object
  }
  state = {
    checkedKeys:[]
  }
  //进行勾选操作时的回调 checkedKeys: 最新的所有勾选的node的key的数组
  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys})
  }
  //为了把menu传给父
  getMenus = () => {
    return this.state.checkedKeys
  }
  //获取menuList
  getTreeNodes = (menuList) => {
    return menuList.map((item) => (
      <TreeNode title={item.title} key={item.key}>
        {item.children ? this.getTreeNodes(item.children) : null}
      </TreeNode>
    ))
  }
  componentWillMount(){
    this.TreeNodes = this.getTreeNodes(menuList)
    const menus = this.props.role.menus
    this.setState({ checkedKeys: menus})
  }
  /* 
  组件将要接收到新的props
  */
  componentWillReceiveProps(nextProps) {
    // 读取最新传入的role, 更新checkedKeys状态
    const menus = nextProps.role.menus
    this.setState({ checkedKeys: menus })
  }
  render() {
    // const { getFieldDecorator } = this.props.form
    const checkedKeys = this.state.checkedKeys
    const role = this.props.role
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 }
    }
    return (
      <Form>
        <Item label='角色名称' {...formItemLayout}>
          <Input value={role.name} disabled></Input>
        </Item>
        <Tree
          checkable//复选框
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="all">
            {this.TreeNodes}
          </TreeNode>
        </Tree>
      </Form>
    )
  }
}