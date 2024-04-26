import { Avatar, Button, Card, Typography, Flex, Space, Modal, Form, Input, InputNumber, Upload, message  } from 'antd';
import React, { useState } from 'react'; // Import useState from React
import { useAuth } from '../contexts/AuthContext';
import { UserOutlined } from '@ant-design/icons';
import useProduct from '../hooks/useProduct';
import axios from 'axios';

const Dashboard = () => {
  const { userData, logout } = useAuth();
  const [form] = Form.useForm(); // Create form instance
  const { uploadProduct } = useProduct();
  const { TextArea } = Input;
  const [img, setImg] = useState(null);

  const handleLogout = async() => {
    await logout();
  }

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };


  const handleProduct = (values) => {
    uploadProduct(values);
    console.log(values);
  }


  const uploadImage = async (type) => {
    const data = new FormData();

    const file = type === 'image' ? img : null; // Check if the file is valid
    if (!file) {
      throw new Error('No file selected.');
    }

    data.append("file", type === 'image' ? img : img);
    data.append("upload_preset", type === 'image' ? 'marketplace_preset' : 'marketplace_preset');

    try {
     // let cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      let CLOUD = 'ddttcgieo'
      let resourceType = type === 'image' ? 'image' : 'video';
      let api = `https://api.cloudinary.com/v1_1/${CLOUD}/${resourceType}/upload`;

      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      console.log(secure_url);
      return secure_url;
    } catch (error) {
      console.error(error);
    }
  }

  const handleOk = async () => {
    try {
      const imageUrl = await uploadImage('image');
      if (imageUrl) {
        form.validateFields().then((values) => {
          const productData = { ...values, createdBy: userData.name, image: imageUrl };
          handleProduct(productData);
          form.resetFields();
          setImg(null);
          setOpen(false);
        });
      } else {
        message.error('Failed to upload image to Cloudinary.');
      }
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields(); 
    setImg(null);
    setOpen(false);
  };



  return (

    <>
      <Card>
        <Flex vertical gap='small' align='center'>
          <Avatar size={150} icon={<UserOutlined />} className='avatar' />
          <Typography.Title level={2} strong className='username'>
            {userData.name}
          </Typography.Title>
          <Button onClick={handleLogout}>Logout</Button>
        </Flex>
        
        <Flex gap ='small' align='center'>
            <Button type="primary" onClick={showModal}>
            Add an item to sell!
          </Button>
            <Modal
              open={open}
              title="Fill information here!"
              onOk={handleOk}
              onCancel={handleCancel}
              footer={[
                <Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                  Submit
                </Button>,
              ]}
            >
              <Form
              form={form} // Use the form instance
              layout = "vertical"
              // onFinish = {handleProduct}
              autoComplete = "off"
              >
                <Form.Item label="Item Name" name="item" rules={[{
                    required: true,
                    message: 'Please enter item name here!',
                }]}>
                  <Input placeholder='Enter item name here' />
                </Form.Item>
                <Form.Item label="Item Price" name="price" rules={[{
                    required: true,
                    message: 'Please enter item price here!',
                }]}>
                  <Input placeholder='Enter item price here' />
                </Form.Item>
                <Form.Item label="Item Description" name="description" rules={[{
                    required: true,
                    message: 'Please enter item price here!',
                }]}>
                      <TextArea
                        showCount
                        maxLength={100}
                        placeholder="Please add item description here!"
                        style={{
                          height: 120,
                          resize: 'none',
                        }}
                      />
                </Form.Item>

                {/* Item pic here */}
                <Form.Item label="Item Image">
                  {/* <Upload {...props} 
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload> */}

                  <input 
                    type='file'
                    accept='image/*'
                    id='img'
                    onChange={(e) => setImg((prev) => e.target.files[0])}
                  />
              </Form.Item>

              </Form>

            </Modal>
        </Flex>
      </Card>
    </>
  
  )
}

export default Dashboard;