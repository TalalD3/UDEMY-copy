import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ShopContext } from './Context/ShopContext';

const AdminRoute = ({ Component  }) => {
    const { role } = useContext(ShopContext);
    const isAdmin = role === 'admin';

    return isAdmin ? <Component /> : <Navigate to="/" />;
    // return isAdmin ? element : <Navigate to="/" replace />;
};

export default AdminRoute;
