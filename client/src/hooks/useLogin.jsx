import React, { useState } from 'react'
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';

const useLogin = () => {
    const { login } = useAuth();  
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const loginUser = async (values) => {
        try{
            setError(null);
            setLoading(true);
            const res = await fetch('https://marketplace-api-xi.vercel.app/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();
            if(res.status === 200){
                message.success(data.message);
                login(data.token, data.user);
            } else if (res.status === 404){
                setError(data.message);
            } else {
                message.error('Login failed!')
            }

        }
        catch(error){   
            message.error('Login failed because: ', error);
        }finally{
            setLoading(false);
        }
    };

  return {loading, error, loginUser};
}

export default useLogin