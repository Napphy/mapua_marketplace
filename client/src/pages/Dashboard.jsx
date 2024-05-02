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
  const { deleteItem, editItem } = useActions();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editForm] = Form.useForm();

  

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
      const CLOUD_NAME =  import.meta.env.VITE_CLOUD_NAME || process.env.VITE_CLOUD_NAME;
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


    const handleEdit = (productId) => {
      const itemToEdit = products.find((item) => item._id === productId);
      if (itemToEdit) {
        setCurrentItem(itemToEdit);
        fetchProductsByUser(userData.name); 
        editForm.resetFields(); 
        setEditModalVisible(true);
      }
    };

  const handleEditItem = async () => {
    fetchProductsByUser(userData.name);
    try {
      editForm.validateFields().then((values) => {
        const { editedItem, editedPrice, editedDescription } = values;
        let dataToUpdate = { item: editedItem, price: editedPrice, description: editedDescription };
  
        if (img) {
          uploadImage('image').then((imageUrl) => {
            if (imageUrl) {
              dataToUpdate = { ...dataToUpdate, image: imageUrl };
              editItem(currentItem._id, dataToUpdate).then((success) => {
                if (success) {
                  message.success('Item edited successfully');
                  setEditModalVisible(false);
                  editForm.resetFields();
                  fetchProductsByUser(userData.name);
                } else {
                  message.error('Failed to edit item');
                }
              });
            } else {
              message.error('Failed to upload image to Cloudinary.');
            }
          });
        } else {
          console.log('Data to update:', dataToUpdate);
  
          editItem(currentItem._id, dataToUpdate).then((success) => {
            if (success) {
              message.success('Item edited successfully');
              setEditModalVisible(false);
              editForm.resetFields();
              fetchProductsByUser(userData.name);
            } else {
              message.error('Failed to edit item');
            }
          });
        }
      });
    } catch (error) {
      console.error('Error editing item:', error);
      message.error('Failed to edit item');
    }
  };


  
  

  const editModalCancel = async () => {
    editForm.resetFields();
    setEditModalVisible(false);
  }
  

  const columns = [
    {
        title: 'Item Name',
        dataIndex: 'item',
        key: 'item',
    },
    {
        title: 'Price in Peso',
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
          <Button type="primary" onClick={() => handleEdit(record._id)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record)}>Delete</Button>
        </Space>
      ),
    },
];

const handleDelete = async (record) => {
  try {
    const { _id } = record;
    await deleteItem(_id); 
    fetchProductsByUser(userData.name); 
  }catch(error){
    message(error);
  }
};


  return (
    <>


      <div className='navbar-container'>
        <NavBar />  
      </div>

      <Flex vertical gap='small' align='left'>
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
            <Button type="primary" onClick={showModal}>
              Add an item to sell!
            </Button>
            <br></br>
            <Button type="primary" onClick={refreshItems}>
              Refresh
            </Button>
          <Table dataSource={products} columns={columns} pagination={{ pageSize: 5 }} />
          </Card>
        </div>
        </Flex>
      <Modal
        open={open}
        title="Fill information here!"
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
                        maxLength={500}
                        placeholder="Please add item description here!"
                        style={{
                          height: 120,
                          resize: 'none',
                        }}
                      />
                </Form.Item>

                {/* Item pic here */}
                <Form.Item label="Item Image" name="image" rules={[{
                    required: true,
                    message: 'Please select an item image!',
                }]}>
                    <input 
                        required
                        type='file'
                        accept='image/*'
                        id='img'
                        onChange={(e) => setImg(e.target.files[0])}
                    />
                </Form.Item>
        </Form>

      </Modal>
          <Modal
            title="Edit Item"
            open={editModalVisible}
            onCancel={editModalCancel}
            footer={[
              <Button key="back" onClick={editModalCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={handleEditItem}>
                Submit
              </Button>,
            ]}
          >
            <Form 
            form={editForm} 
            layout="vertical">
              <Form.Item label="Item Name" name="editedItem" initialValue={currentItem?.item}>
              <Input placeholder="Enter item name" />
              </Form.Item>
              <Form.Item label="Price" name="editedPrice" initialValue={currentItem?.price}>
                <InputNumber placeholder="Enter price" />
              </Form.Item>
              <Form.Item label="Description" name="editedDescription" initialValue={currentItem?.description}>
                <Input.TextArea placeholder="Enter description" />
              </Form.Item>
              <Form.Item label="Image" name="image">
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