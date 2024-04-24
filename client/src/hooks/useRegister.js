import React, { useState } from 'react'
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';

const useRegister = () => {
    const { login } = useAuth();  
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const registerUser = async (values) => {
        try{
            setError(null);
            setLoading(true);
            const res = await fetch('https://marketplace-api-xi.vercel.app/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();
            if(res.status === 201){
                message.success(data.message);
                login(data.token, data.user);
            } else if (res.status === 400){
                setError(data.message);
            } else {
                message.error('Registration failed!')
            }

        }
        catch(error){   
            message.error(error);
        }finally{
            setLoading(false);
        }
    };

  return {loading, error, registerUser};
}

export default useRegister