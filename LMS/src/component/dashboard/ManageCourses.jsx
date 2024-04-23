import React, { useContext, useEffect, useState } from 'react'

import './dashboard.css'

import Card from './Card'
import StackedAreaChart from './StackedAreaChart'
import { ShopContext } from '../../Context/ShopContext'
import TableUsers from './TableUsers'
import TableCourses from './TableCourses'
import { useNavigate } from 'react-router-dom'

const ManageCourses = ({role}) => {

    const navigate = useNavigate();

    useEffect(() => {
        if (role !== 'admin') {
            navigate('/');
        }
    }, [role, navigate]);

    const { getAllUsers, all_course, published_course } = useContext(ShopContext);


    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {

            try {
                const users = await getAllUsers();
                // console.log('users:', users);
                setAllUsers(users);
            } catch (error) {
                console.error("Error fetching total users:", error);
            }
        };

        fetchData();
    }, []);


    return (
        <section className="section">
            <div className="container">
                <div className='cards'>
                    <Card total={'Course'} number={all_course.length} extra={'35,000 '} />
                    <Card total={'Published Course'} number={published_course.length} extra={'35,000 '} />
                    <Card total={'Inpublished Course'} number={all_course.length - published_course.length} extra={'35,000 '} />
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
                    <p className='analytics-title'>All courses</p>
                    {
                        all_course.length > 0 &&
                        <TableCourses rows={all_course} />
                    }
                </div>
            </div>
        </section>
    )
}

export default ManageCourses