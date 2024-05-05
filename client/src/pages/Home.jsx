import React, { useEffect, useState } from 'react';
import { Button, Card, Space, Modal, message, FloatButton  } from 'antd';
import { ReloadOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import getProduct from '../hooks/getProduct';
import  Footer  from './components/Footer';
import  NavBar  from './components/Navbar'
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Home.css';

const Home = () => {
    const { userData, logout } = useAuth();
    const { fetchAllProducts, allProducts } = getProduct();
    const [logoutTimeout, setLogoutTimeout] = useState(null);

    useEffect(() => {


        const handleInactiveLogout = () => {
            logout();
        };

        let timeout;

        const resetTimeout = () => {
            clearTimeout(timeout);
            timeout = setTimeout(handleInactiveLogout, 600000); // 10 minutes
        };

        fetchAllProducts();

        const events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];

        events.forEach((event) => {
            window.addEventListener(event, resetTimeout);
        });

        resetTimeout(); // Start the timer initially

        return () => {
            clearTimeout(timeout);
            events.forEach((event) => {
                window.removeEventListener(event, resetTimeout);
            });
        };
    }, [logout]);
        

    const refreshItems = async () => {
        try {
            fetchAllProducts();
            console.log('refresh');
        } catch (error) {
            console.error(error);
        }
    };

    const truncateName = (name) => {
        const parts = name.split(' ');
        if (parts.length > 1) {
            return parts.slice(0, Math.ceil(parts.length / 2)).join(' ');
        } else {
            return name;
        }
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [canSendSMS, setCanSendSMS] = useState(true);
    const [supportModalVisible, setSupportModalVisible] = useState(false);

    const handleCancel = () => {
        setModalVisible(false);
    };    

    const openModal = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };



    const debouncedSendNotif = async (item, number) => {

        if (number.startsWith('0')) {
            // Replace '0' with '+639'
            number = `+63${number.slice(1)}`;
        }
        
        const token = import.meta.env.VITE_SMS_API_TOKEN;

        const senderId = "PhilSMS";
        const recipient = number;
        const messageToSend = `${truncateName(userData.name)} is interested in your ${item}. Please send them an email ${userData.email}`;
        
        const sendData = {
            sender_id: senderId,
            recipient: recipient,
            message: messageToSend,
        };

        try {
            const response = await axios.post('https://app.philsms.com/api/v3/sms/send', sendData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setCanSendSMS(false);
            message.success('SMS notification sent successfully. Please wait for an email from the seller.');
            message.warning('Please wait 1 minute before sending another SMS Notification. This is to prevent spams.');
        } catch (error) {
            console.error('Error:', error);
            message.error('SMS notification was not sent');
        }

        setModalVisible(false);

        setTimeout(() => {
            setCanSendSMS(true);
        }, 60000);
    };


    const handleEmail = async (action) => {
        let subject = '';
        let body = '';
        
        if (action === 'donate') {
            subject = 'Donation Inquiry';
            body = 'I would like to inquire about making a donation. Please provide me with more information.';
        } else if (action === 'ask') {
            subject = 'Question Inquiry';
            body = 'I have a question regarding your service. Can you please assist me?';
        }
        
        const email = 'dosgavinojr@mymail.mapua.edu.ph';
        
        const mailToLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        window.location.href = mailToLink;
    }

    

    return (
        <>

            <img
            className='background-image'
            src="https://fs2.mapua.edu.ph/2020QS/Other Evidences/CDMO/Campus Facilities/Cafeteria 3.jpg"
            alt="Background"
            />

            <NavBar />
            <Space direction="vertical" style={{ paddingTop: '130px' , margin: '20px' }}>
                <div className="product-grid">
                    {allProducts.map((product) => (
                        <Card
                            key={product._id} 
                            title={product.item}
                            className="product-card"
                            onClick={() => openModal(product)}
                        >
                            <p>Price: ₱{product.price}</p>
                            <p>Description: {product.description}</p>
                            <p>Seller: {truncateName(product.createdBy)}</p>
                            <img src={product.image} alt="Product" style={{ width: '100%', maxHeight: '350px', objectFit: 'contain' }} />
                        </Card>
                    ))}
                </div>
            </Space>
             <FloatButton.Group>

             <FloatButton 
            type="primary" 
            onClick={ refreshItems }  
            icon = {<ReloadOutlined />}
            />
                
            <FloatButton
            icon= {< CustomerServiceOutlined />}
            onClick={ () => setSupportModalVisible(true) }
            />

            </FloatButton.Group>       

            <Modal
                title="Contact Support"
                open={supportModalVisible}
                onCancel={() => setSupportModalVisible(false)}
                footer={[ 
                <Button type="primary" onClick={() => handleEmail('donate')}>Donate</Button>,
                <Button onClick={() => handleEmail('ask')}>Contact Support</Button>,
                <Button danger onClick={() => setSupportModalVisible(false)}>Close</Button>
            ]}
            >
               <p>Please choose an option.</p>
            </Modal>

            <Modal 
                title="Interested?"
                open={modalVisible} 
                onCancel={handleCancel}
                footer={[
                    <Button key="sendEmail" type="primary" onClick={() => debouncedSendNotif(selectedProduct.item, selectedProduct.createdByNumber)} disabled={!canSendSMS}>
                        Send SMS Notification to the Seller
                    </Button>,
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                ]}
            >
                {selectedProduct && (
                    <>
                        <p>Item: {selectedProduct.item}</p>
                        <p>Price: ₱{selectedProduct.price}</p>
                        <p>Description: {selectedProduct.description}</p>
                        <p>Seller: {truncateName(selectedProduct.createdBy)}</p>
                        <img src={selectedProduct.image} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </>
                )}
            </Modal>
            <Footer />
        </>
    );
};

export default Home;
