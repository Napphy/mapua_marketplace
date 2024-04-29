import React, { useState } from 'react';
import { message } from 'antd';

const useActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteItem = async (productId) => {
        try {
            setError(null);
            setLoading(true);
            const res = await fetch(`https://marketplace-3ph4.onrender.com/delete/${productId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Failed to delete item');
            }

            setLoading(false);

            return message('Deleted Successfully'); 
        } catch (error) {
            setLoading(false);
            setError('Error deleting item');
            console.error('Error deleting item:', error);
            return false; 
        }
    };

    return { loading, error, deleteItem };
};

export default useActions;
