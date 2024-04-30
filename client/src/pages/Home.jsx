import React, { useEffect, useState } from 'react';
import { Button, Card, Space, Modal } from 'antd';
import getProduct from '../hooks/getProduct';
import NavBar from './components/Navbar';
import { useAuth } from '../contexts/AuthContext';

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

    const handleOk = () => {
        setModalVisible(false);
    };
    
    const handleCancel = () => {
        setModalVisible(false);
    };    

    const openModal = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
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
                onOk={handleOk} 
                onCancel={handleCancel} 
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
