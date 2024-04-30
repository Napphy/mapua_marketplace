import React, { useEffect, useState } from 'react';
import { Button, Card, Space, Modal } from 'antd';
import getProduct from '../hooks/getProduct';
import NavBar from './components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import https from 'https'; 

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
        // const mailtoUrl = `mailto:${email}`;
        // window.open(mailtoUrl, '_blank');


        const senderId = "PhilSMS";
        const recipient = number; // Get recipient number from selectedProduct
        console.log(number);
        const message = `${truncateName(userData.name)} is interested in your ${item}`;
        const token = import.meta.env.VITE_SMS_API_TOKEN;

        const sendData = {
            sender_id: senderId,
            recipient: recipient,
            message: message,
        };
        const parameters = JSON.stringify(sendData);
        console.log(sendData);

        // const options = {
        //     hostname: 'app.philsms.com',
        //     path: '/api/v3/sms/send',
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${token}`
        //     }
        // };

        // const req = https.request(options, res => {
        //     let data = '';

        //     res.on('data', chunk => {
        //         data += chunk;
        //     });

        //     res.on('end', () => {
        //         console.log(JSON.parse(data));
        //     });
        // });

        // req.on('error', error => {
        //     console.error('Error:', error);
        // });

        // req.write(parameters);
        // req.end();
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
                        Send Notification to the Seller
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
                        <p>Number: {selectedProduct.createdByNumber}</p>
                        <img src={selectedProduct.image} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                    </>
                )}


            </Modal>
        </>
    );
};

export default Home;
