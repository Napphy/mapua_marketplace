import { Avatar, Button, Card, Typography, Flex, Space, Modal, Form, Input, InputNumber, Upload, message, Table  } from 'antd';
import React, { useState, useEffect } from 'react'; // Import useState from React
import { useAuth } from '../contexts/AuthContext';
import { UserOutlined } from '@ant-design/icons';
import useProduct from '../hooks/useProduct';
import axios from 'axios';
import getProduct from '../hooks/getProduct';
import useActions from '../hooks/useActions';
import NavBar from './components/Navbar';
import './Dashboard.css'


const Dashboard = () => {
  const { userData, logout } = useAuth();
  const [form] = Form.useForm();
  const { uploadProduct } = useProduct();
  const { fetchProductsByUser, products } = getProduct();
  const { TextArea } = Input;
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { deleteItem } = useActions();

  useEffect (() => {
    fetchProductsByUser(userData.name);
    fetchProductsByUser(userData.name);
  }, [])



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

    const file = type === 'image' ? img : null;
    if (!file) {
      throw new Error('No file selected.');
    }

    data.append("file", type === 'image' ? img : img);
    data.append("upload_preset", type === 'image' ? 'marketplace_preset' : 'marketplace_preset');

    try {
      const CLOUD_NAME =  import.meta.env.VITE_CLOUD_NAME;
      let resourceType = type === 'image' ? 'image' : 'video';
      let api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

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
          const productData = { ...values, createdBy: userData.name, createdByEmail: userData.email, createdByNumber: userData.number, image: imageUrl };
          handleProduct(productData);
          form.resetFields();
          setImg(null);
          setOpen(false);
          fetchProductsByUser(userData.name);
          fetchProductsByUser(userData.name);
          fetchProductsByUser(userData.name); //para sure haha
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


    const refreshItems = async (name) => {
      try {
        fetchProductsByUser(userData.name);
        console.log('refresh');
      }catch(error){
        console.error(error);
      }
    }
  

  const columns = [
    {
        title: 'Item Name',
        dataIndex: 'item',
        key: 'item',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        render: (image) => <img src={image} alt="Product" style={{ width: 100, height: 100 }} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="small">
          <Button type="primary" onClick={() => handleEdit(products._id)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record)}>Delete</Button>
        </Space>
      ),
    },
];

const handleDelete = async (record) => {
  try {
    const { _id } = record;
    const success = await deleteItem(_id); 
    fetchProductsByUser(userData.name); 
  }catch(error){
    message(error);
  }
};


  return (
    <>
      <NavBar />
      <Flex vertical gap='small' align='center'>
        <Card>
          <Flex horizontal gap='small' align='center' >
            <Avatar size={150} icon={<UserOutlined />} className='avatar' />
            <Typography.Title level={2} strong className='username'>
              {userData.name}
            </Typography.Title>
            <Button onClick={handleLogout}>Logout</Button>
          </Flex>
        </Card>
        <div className='full-width-container'>
          <Card className='full-width-card'>
            <Typography.Title level={3}>Your Uploaded Products</Typography.Title>
            <Button type="primary" onClick={showModal}  style={{ marginLeft: 'auto' }}>
              Add an item to sell!
            </Button>
            <br></br>
            <Button type="primary" onClick={refreshItems}  style={{ marginRight: '10px' }}>
              Refresh
            </Button>
          <Table dataSource={products} columns={columns} pagination={{ pageSize: 5 }} />
          </Card>
        </div>
        </Flex>
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
          form={form}
          layout="vertical"
          autoComplete="off"
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
                },    
                {
                  type: 'number',
                  min: 0,
                  message: 'Price must be a real number!',
                },
                ]}>
                  <InputNumber placeholder='Enter item price here' />
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
                  <input 
                    type='file'
                    accept='image/*'
                    id='img'
                    onChange={(e) => setImg((prev) => e.target.files[0])}
                  />
              </Form.Item>
        </Form>
      </Modal>
    </>
  
  )
}

export default Dashboard;