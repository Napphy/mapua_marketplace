import React from 'react'
import { Card, Flex, Input, Typography, Form, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import useLogin from '../hooks/useLogin';


const Login = () => {

    const {loading, error, loginUser} = useLogin();
    const handleLogin = async (values) => {
        await loginUser(values);
    };

    const validateEmail = (_, value) => {
        if (value && !value.endsWith('@mymail.mapua.edu.ph')) {
            return Promise.reject('Email must end with @mymail.mapua.edu.ph');
        }
        return Promise.resolve();
    };


  return (
    <Card className='form-container'>
            <div className='video-container'>
                <video className='background-video' autoPlay muted loop>
                    <source src="https://mapua.sgp1.cdn.digitaloceanspaces.com/cms_images/IsoCwpmyzkQVgKZgyN96pIL7I9VpEXj1n8EO5Iew.mp4" type="video/mp4" />
                </video>
            </div>
        <Flex>
        {/* Form */}
            <Flex vertical flex={1}>
            <Typography.Title level={3} strong className='title'>
                Log in here!
            </Typography.Title>
            <Typography.Text type='secondary' strong className='slogan'>
                Start selling or buying!
            </Typography.Text>
                <Form layout = "vertical"
                    onFinish = {handleLogin}
                    autoComplete = "off"
                >
                    <Form.Item label="Email" name="email" rules={[{
                        required: true,
                        message: 'Please enter your email here!',
                    },
                    {
                        type: 'email',
                        message: 'Input is not a valid email!'
                    },
                    {
                        validator: validateEmail,
                    }
                    ]}>
                        <Input placeholder='Enter your school email here' />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{
                        required: true,
                        message: 'Please enter your password here!',
                    }]}>
                        <Input.Password placeholder='Enter your password here!' />
                    </Form.Item>

                    {
                        error && <Alert 
                        description={error} 
                        type='error' 
                        showIcon 
                        closable 
                        className='alert' />
                    }

                    <Form.Item>
                        <Button 
                            type={`${loading ? '' : 'primary'}`}
                            htmlType='submit'
                            className='btn'
                        >
                            {loading ?  <Spin /> : 'Login'}
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Link to ='/'>
                        <Button 
                            className='btn'
                        >
                        Don't have an account?
                        </Button>
                        </Link>
                    </Form.Item>
                </Form>
            </Flex>
        </Flex>
    </Card>
  )
}

export default Login