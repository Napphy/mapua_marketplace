import { Avatar, Button, Card, Typography, Flex  } from 'antd';
import React from 'react'
import { useAuth } from '../contexts/AuthContext';
import { UserOutlined } from '@ant-design/icons';

const Dashboard = () => {
  const { userData, logout } = useAuth();

  const handleLogout = async() => {
    await logout();
  }
  return (


    <Card>
      <Flex vertical gap='small' align='center'>
        <Avatar size={150} icon={<UserOutlined />} className='avatar' />
        <Typography.Title level={2} strong className='username'>
          {userData.name}
        </Typography.Title>
        <Button onClick={handleLogout}>Logout</Button>
      </Flex>
    </Card>
    
  )
}

export default Dashboard;