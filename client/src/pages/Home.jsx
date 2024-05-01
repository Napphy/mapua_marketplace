import React, { useEffect, useState } from 'react';
import { Button, Card, Space, Modal, message } from 'antd';
import getProduct from '../hooks/getProduct';
import NavBar from './components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Home = () => {
    const { userData } = useAuth();
    const { fetchAllProducts, allProducts } = getProduct();

    useEffect(() => {
        fetchAllProducts();
    }, []);

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

    
    const handleCancel = () => {
        setModalVisible(false);
    };    

    const openModal = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const handleSendNotif = (item, number) => {
        
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
        const parameters = JSON.stringify(sendData);
        axios.post('https://app.philsms.com/api/v3/sms/send', sendData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            message.success('SMS notification sent successfully. Please wait for an email from the seller.');
        })
        .catch(error => {
            console.error('Error:', error);
            message.error('SMS notification was not sent');
        });
        setModalVisible(false);
    };
    

    return (
        <>
            <NavBar />
            <Space direction="vertical" style={{ margin: '20px' }}>
                <Button type="primary" onClick={refreshItems}>
                    Refresh
                </Button>
                <Space wrap>
                    {allProducts.map((product) => (
                        <Card
                            key={product._id} 
                            title={product.item}
                            style={{ width: 500, height: 600 }}
                            onClick={() => openModal(product)}
                        >
                            <p>Price: ₱{product.price}</p>
                            <p>Description: {product.description}</p>
                            <p>Seller: {truncateName(product.createdBy)}</p>
                            <img src={product.image} alt="Product" style={{ width: '100%', height: 400, objectFit: 'cover' }} />
                        </Card>
                    ))}
                </Space>
            </Space>
            <Modal 
                title="Interested?"
                open={modalVisible} 
                footer={[
                    <Button key="sendEmail" type="primary" onClick={() => handleSendNotif(selectedProduct.item, selectedProduct.createdByNumber)}>
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
                        <p>Seller: {selectedProduct.createdBy}</p>
                        <img src={selectedProduct.image} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                    </>
                )}


            </Modal>
        </>
    );
};

export default Home;