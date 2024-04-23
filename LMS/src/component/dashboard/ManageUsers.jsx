import React, { useContext, useEffect, useState } from 'react'

import './dashboard.css'

import Card from './Card'
import StackedAreaChart from './StackedAreaChart'
import { ShopContext } from '../../Context/ShopContext'
import TableUsers from './TableUsers'
import { useNavigate } from 'react-router-dom'

const ManageUsers = ({role}) => {

    const navigate = useNavigate();

    useEffect(() => {
        if (role !== 'admin') {
            navigate('/');
        }
    }, [role, navigate]);

    const { getAllUsers, getTotlaUsers, getTotlaTeachers, getTotlaAdmins } = useContext(ShopContext);

    const [totalUsers, setTotalUsers] = useState(0);
    const [totalTeachers, setTotalTeachers] = useState(0);
    const [totalAdmins, setTotalAdmins] = useState(0);

    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const admins = await getTotlaAdmins();
                setTotalAdmins(admins);
            } catch (error) {
                console.error("Error fetching total courses:", error);
            }

            try {
                const teachers = await getTotlaTeachers();
                setTotalTeachers(teachers);
            } catch (error) {
                console.error("Error fetching total orders:", error);
            }

            try {
                const users = await getTotlaUsers();
                setTotalUsers(users);
            } catch (error) {
                console.error("Error fetching total users:", error);
            }

            try {
                const users = await getAllUsers();
                // console.log('users:', users);
                setAllUsers(users);
            } catch (error) {
                console.error("Error fetching total users:", error);
            }
        };

        fetchData();
    }, [getTotlaUsers, getTotlaTeachers, getTotlaAdmins]);


    return (
        <section className="section">
            <div className="container">
                <div className='cards'>
                    <Card total={'Users'} number={totalUsers} extra={'35,000 '} />
                    <Card total={'Teachers'} number={totalTeachers} extra={'35,000 '} />
                    <Card total={'Admins'} number={totalAdmins} extra={'35,000 '} />
                </div>
                {/* <div className='analytics'>
                    <p className='analytics-title'>Analytics Users and Teacher, admins</p>
                    <p className='analytics-title'></p>
                    <div className='dashboard-card'>
                        <StackedAreaChart userData={usersPerMonth} orderData={ordersPerMonth} courseData={coursesPerMonth} />
                    </div>
                    <div className='dashboard-card last'>
                        <SimpleBarChart ordersPerCategory={ordersPerCategory} />
                    </div>
                </div> */}
                <div className='teble'>
                    <p className='analytics-title'>All Users</p>
                    {
                        allUsers.length > 0 &&
                        <TableUsers rows={allUsers} />
                    }
                </div>
            </div>
        </section>
    )
}

export default ManageUsers