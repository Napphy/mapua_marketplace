import { Avatar, Button, Card, Typography, Flex, Space, Modal, Form, Input, InputNumber, Upload, message  } from 'antd';
import React, { useState } from 'react'; // Import useState from React
import { useAuth } from '../contexts/AuthContext';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import useProduct from '../hooks/useProduct';

const Dashboard = () => {
  const { userData, logout } = useAuth();
  const [form] = Form.useForm(); // Create form instance
  const { uploadProduct } = useProduct();
  const { TextArea } = Input;
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleLogout = async() => {
    await logout();
  }

  const handleProduct = async (values) => {
    uploadProduct(values);

  };

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };



  const handleOk = () => {
    form.validateFields().then((values) => {

      //to show image 
      // const imgSrc = `data:image/jpeg;base64,${base64Image}`;

      const productData = { ...values, createdBy: userData.name, image: 'uploadedImage' };
      handleProduct(productData);

      form.resetFields(); 
      setUploadedImage(null);
      setOpen(false);
    }).catch((errorInfo) => {
      console.log('Validation failed:', errorInfo);
    });
  };


  const handleCancel = () => {
    form.resetFields(); 
    setUploadedImage(null);
    setOpen(false);
  };


  // const props = {
  //   name: 'file',
  //   headers: {
  //     authorization: 'authorization-text',
  //   },
  //   onChange(info) {
  //     if (info.file.status !== 'uploading') {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (info.file.status === 'done') {
  //     const reader = new FileReader();
  //       reader.onload = (event) => {
  //         const base64Image = event.target.result;
  //         setUploadedImage(base64Image);
  //         message.success(`${info.file.name} file uploaded successfully`);
  //       }
  //     } else if (info.file.status === 'error') {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  //   progress: {
  //     strokeColor: {
  //       '0%': '#108ee9',
  //       '100%': '#87d068',
  //     },
  //     strokeWidth: 3,
  //     format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
  //   },
  // };


  const props = {
    name: 'file',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
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
                <Form.Item label="Item Name" name="item name" rules={[{
                    required: true,
                    message: 'Please enter item name here!',
                }]}>
                  <Input placeholder='Enter item name here' />
                </Form.Item>
                <Form.Item label="Item Price" name="item price" rules={[{
                    required: true,
                    message: 'Please enter item price here!',
                }]}>
                  <Input placeholder='Enter item price here' />
                </Form.Item>
                <Form.Item label="Item Description" name="item description" rules={[{
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
                  <Upload {...props}
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
              </Form.Item>

              </Form>

            </Modal>
        </Flex>
      </Card>
    </>
  
  )
}

export default Dashboard;