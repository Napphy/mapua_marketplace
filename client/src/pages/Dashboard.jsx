import { Avatar, Button, Card, Typography, Flex, Space, Modal  } from 'antd';
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { UserOutlined } from '@ant-design/icons';

const Dashboard = () => {
  const { userData, logout } = useAuth();

  const handleLogout = async() => {
    await logout();
  }

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (


    <Card>
      <Flex vertical gap='small' align='center'>
        <Avatar size={150} icon={<UserOutlined />} className='avatar' />
        <Typography.Title level={2} strong className='username'>
          {userData.name}
        </Typography.Title>
        <Button onClick={handleLogout}>Logout</Button>
      </Flex>
      
      <Flex gap ='small' align='center'>
        <Space>
          <Button type="primary" onClick={showModal}>
              Open Modal
            </Button>
            <Button
              type="primary"
              onClick={() => {
                Modal.confirm({
                  title: 'Confirm',
                  content: 'Bla bla ...',
                  footer: (_, { OkBtn, CancelBtn }) => (
                    <>
                      <Button>Custom Button</Button>
                      <CancelBtn />
                      <OkBtn />
                    </>
                  ),
                });
              }}
            >
              Open Modal Confirm
            </Button>
        </Space>
        <Modal
          open={open}
          title="Title"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={(_, { OkBtn, CancelBtn }) => (
            <>
              <Button>Custom Button</Button>
              <CancelBtn />
              <OkBtn />
            </>
          )}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </Flex>
    </Card>
    
  
  )
}

export default Dashboard;