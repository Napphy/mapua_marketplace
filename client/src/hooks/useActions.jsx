import React, { useState } from 'react';

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
            return true; 
        } catch (error) {
            setLoading(false);
            setError('Error deleting item');
            console.error('Error deleting item:', error);
            return false; 
        }
    };

    const editItem = async (productId, newData) => {
        try {
            setError(null);
            setLoading(true);
            const res = await fetch(`https://marketplace-3ph4.onrender.com/edit/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });

            if (!res.ok) {
                throw new Error('Failed to edit item');
            }

            setLoading(false);
            return true;
        } catch (error) {
            setLoading(false);
            setError('Error editing item');
            console.error('Error editing item:', error);
            return false;
        }
    };

    return { loading, error, deleteItem, editItem };
};

export default useActions;
