import React from 'react'
import { Upload, Icon, Modal,message } from 'antd';
import PropTypes from 'prop-types'

import { reqDelImg } from '../../api'
import {BASE_IMG} from '../../untils/constants'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  //類型限制，接收參數申明
  static propTypes = {
    imgs:PropTypes.array
  }
  //初始狀態
  state = {
    previewVisible: false,//是否显示大图
    previewImage: '',//大图预览的url
    //所有上传文件的列表
    fileList: [],
  };
  //大图的回调,关闭大图预览
  handleCancel = () => this.setState({ previewVisible: false })
  //显示大图预览
  handlePreview = async file => {
    //preview是base那个编译的地址
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  //当进行文件上传、删除时，文件状态发生改变
  handleChange = async ({ file,fileList }) => {
    console.log(file.status )
    //判断，上传完成后数据才可以拿到（会经历3个状态uploading，uploading，done）
    if (file.status === 'done'){
      //指定file是最后一个file
      file = fileList[fileList.length - 1]
      file.name = file.response.data.name
      file.url = file.response.data.url
    } else if (file.status === 'removed'){
      const result = await reqDelImg(file.name)
      if (result.status === 0){
        message.success('刪除图片成功')
      }
    }
    //更新状态
    this.setState({ fileList })
  }
  //得到imgs
  getImgs = () => {
    return (this.state.fileList.map(file => file.name))
  }

  componentWillMount(){
    const imgs = this.props.imgs
    if (imgs && imgs.length>0){
      //如果有值，生成動態數組,更新狀態
      const fileList = imgs.map((img,index) => ({
        uid:-index,
        name:img,
        status:'done',
        url: BASE_IMG + img
      }))
      this.setState({ fileList })
    }
  }
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"
          name='image'//指定参数
          listType="picture-card"//显示的风格
          fileList={fileList}//图片列表
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 6 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}