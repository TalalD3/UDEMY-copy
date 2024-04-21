import React, { useContext, useEffect, useState } from 'react'

import './dashboard.css'

import Card from './Card'
import StackedAreaChart from './StackedAreaChart'
import SimpleBarChart from './SimpleBarChart'
import EnhancedTable from './Table'
import { ShopContext } from '../../Context/ShopContext'

const Dashboard = () => {

    const { fetchOrdersPerCourse, getTotlaCourses, getTotlaOrder, getTotlaUsers, fetchOrdersPerMonth, fetchUsersPerMonth, fetchCoursesPerMonth, fetchOrdersPerCategory } = useContext(ShopContext);
    const [totalCourses, setTotalCourses] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [coursesPerMonth, setCoursesPerMonth] = useState([]);
    const [ordersPerMonth, setOrdersPerMonth] = useState([]);
    const [usersPerMonth, setUsersPerMonth] = useState([]);
    const [ordersPerCategory, setOrdersPerCategory] = useState([]);
    const [ordersPerCourse, setOrdersPerCourse] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courses = await getTotlaCourses();
                setTotalCourses(courses);
            } catch (error) {
                console.error("Error fetching total courses:", error);
            }

            try {
                const orders = await getTotlaOrder();
                setTotalOrders(orders);
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
                const orders = await fetchOrdersPerMonth();
                // console.log('oreders:', orders);
                setOrdersPerMonth(orders);
            } catch (error) {
                console.error("Error fetching total users:", error);
            }

            try {
                const users = await fetchUsersPerMonth();
                // console.log('users:', users);
                setUsersPerMonth(users);
            } catch (error) {
                console.error("Error fetching total users:", error);
            }

            try {
                const courses = await fetchCoursesPerMonth();
                // console.log('courses:', courses);
                setCoursesPerMonth(courses);
            } catch (error) {
                console.error("Error fetching total users:", error);
            }

            try {
                const ordersCategory = await fetchOrdersPerCategory();
                // console.log('ordersCategory:', ordersCategory);
                setOrdersPerCategory(ordersCategory);
            } catch (error) {
                console.error("Error fetching total users:", error);
            }

            try {
                const ordersCourse = await fetchOrdersPerCourse();
                // console.log('ordersCourse:', ordersCourse);
                setOrdersPerCourse(ordersCourse);
            } catch (error) {
                console.error("Error fetching total users:", error);
            }
        };

        fetchData();
    }, [getTotlaCourses, getTotlaOrder, getTotlaUsers]);


    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const courses = await getTotlaCourses();
    //             setTotalCourses(courses);
    //         } catch (error) {
    //             console.error("Error fetching total courses:", error);
    //         }

    //         try {
    //             const orders = await getTotlaOrder();
    //             setTotalOrders(orders);
    //         } catch (error) {
    //             console.error("Error fetching total orders:", error);
    //         }

    //         try {
    //             const users = await getTotlaUsers();
    //             setTotalUsers(users);
    //         } catch (error) {
    //             console.error("Error fetching total users:", error);
    //         }

    //         try {
    //             const orders = await fetchOrdersPerMonth();
    //             // console.log('oreders:', orders);
    //             setOrdersPerMonth(orders);
    //         } catch (error) {
    //             console.error("Error fetching total users:", error);
    //         }

    //         try {
    //             const users = await fetchUsersPerMonth();
    //             // console.log('users:', users);
    //             setUsersPerMonth(users);
    //         } catch (error) {
    //             console.error("Error fetching total users:", error);
    //         }

    //         try {
    //             const courses = await fetchCoursesPerMonth();
    //             // console.log('courses:', courses);
    //             setCoursesPerMonth(courses);
    //         } catch (error) {
    //             console.error("Error fetching total users:", error);
    //         }
    //     };

    //     fetchData();
    // }, [getTotlaCourses, getTotlaOrder, getTotlaUsers,usersPerMonth, ordersPerMonth , coursesPerMonth]);


    return (
        <section className="section">
            <div className="container">
                <div className='cards'>
                    <Card total={'Orders'} number={totalOrders} extra={'35,000 '} />
                    <Card total={'Users'} number={totalUsers} extra={'35,000 '} />
                    <Card total={'Course'} number={totalCourses} extra={'35,000 '} />
                    {/* <Card total={'Page Views'} number={'4,42,236'} extra={'35,000 '} /> */}
                </div>
                <div className='analytics'>
                    <p className='analytics-title'>Analytics Orders, Users and Course</p>
                    <p className='analytics-title'>Top categories</p>
                    <div className='dashboard-card'>
                        <StackedAreaChart userData={usersPerMonth} orderData={ordersPerMonth} courseData={coursesPerMonth} />
                    </div>
                    <div className='dashboard-card last'>
                        <SimpleBarChart ordersPerCategory={ordersPerCategory} />
                    </div>
                </div>
                <div className='teble'>
                    <p className='analytics-title'>Recent Orders</p>
                    {
                        ordersPerCourse.length > 0 &&
                        <EnhancedTable rows={ordersPerCourse} />
                    }
                </div>
            </div>
        </section>
    )
}

export default Dashboard