import React, { Component } from 'react'
import { Form, Input} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

class CategoryForm extends Component {
  //限制类型
  static propTypes = {
    categoryName: PropTypes.string,
    setForm: PropTypes.func.isRequired
  }
  //将form对象传给父组件
  componentWillMount(){
    this.props.setForm(this.props.form)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { categoryName} = this.props
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: categoryName || '',  // 如果手动输入了任意值, 再指定新的默认值, 无效(显示的是输入的值)
              rules: [
                { required: true, message: '分类名称是必须的' }
              ]
            })(
              <Input type="text" placeholder="分类名称" />
            )
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(CategoryForm)
