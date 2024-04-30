import React from 'react'
import { Card, Flex, Input, Typography, Form, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import useLogin from '../hooks/useLogin';

import './Login.css';

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
        <div>
                <img
                        className='background-image'
                        src="https://storage.googleapis.com/bukas-website-v3-prd/website_v3/images/Mapua_facade_3.original.jpg"
                        alt="Background"
                    />
        
        <Card className='form-container'>


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
    </div>
  )
}

export default Login