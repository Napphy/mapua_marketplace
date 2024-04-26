import React from 'react'

const useProduct = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const uploadProduct = async (values) => {
        try {
            setError(null);
            setLoading(true);
            const res = await fetch('https://marketplace-3ph4.onrender.com/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();
            if (res.status === 201) {
                message.success(data.message);
            } else if (res.status === 400) {
                setError(data.message);
            } else {
                message.error('Product upload failed!');
            }
        } catch (error) {   
            message.error('Error uploading product');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, uploadProduct };
}

export default useProduct;