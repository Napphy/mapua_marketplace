import { useState } from 'react';

const getProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProductsByUser = async (userName) => {
        try {
            setError(null);
            setLoading(true);
            const res = await fetch(`https://marketplace-3ph4.onrender.com/getProductsByUser?createdBy=${userName}`, {
                method: 'GET',
            });
            const data = await res.json();
            if (res.status === 200) {
                setProducts(data.products);
            } else if (res.status === 400) {
                setError(data.message);
            } else {
                setError('Error fetching products');
            }
        } catch (error) {
            setError('Error fetching products');
            setLoading(false);
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return { products, loading, error, fetchProductsByUser };
};

export default getProduct;
