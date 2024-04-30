import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';




const NavBar = () => {
    return (
        <Menu mode="horizontal" theme="dark">
            <Menu.Item key="dashboard">
                <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="home">
                <Link to="/home">Home</Link>
            </Menu.Item>
        </Menu>
    );
};

export default NavBar;
