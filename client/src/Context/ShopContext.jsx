import { message } from "antd";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
// import all_course from "../Components/Assets/all_course";
// import { set } from "mongoose";

export const ShopContext = createContext(null);
const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300; index++) {
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [all_course, setAll_course] = useState([]);
    const [published_course, setPublished_course] = useState([]);
    const [role, setRole] = useState('');


    useEffect(() => {
        fetch('http://localhost:5000/api/allcourses')
            .then(resp => resp.json())
            .then(data => setAll_course(data))

        fetch('http://localhost:5000/api/publishedcourses')
            .then(resp => resp.json())
            .then(data => setPublished_course(data))

        const fetchRole = async () => {
            if (localStorage.getItem('auth-token')) {

                await fetch('http://localhost:5000/api/getrole', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/form-data',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application.json'
                    },
                    body: ""
                }).then(resp => resp.json()).then(data => setRole(data.role))

            }
        }

        fetchRole();


    }, [])

    const addToCart = (itemId) => {
        setCartItems(prev => ({
            ...prev,
            [itemId]: prev[itemId] + 1,
        }))
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:5000/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'itemId': itemId })
            }).then(resp => resp.json()).then(data => console.log(data))
        }
    }

    const setTeacher = () => {
        setRole('teacher');
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:5000/api/setTeacher', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: ''
            }).then(resp => resp.json()).then(data => message.info('congratulations, you are now a teacher'))
        }
    }

    const userEnrollCourse = async (courseId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/userEnrollCourse/${courseId}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json'
                },
                body: ''
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error enrolling course:', error);
            throw error; // Rethrow the error for handling in the calling function
        }
    };

    const getUserData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/getuserdata`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error('Error enrolling course:', error);
            throw error; // Rethrow the error for handling in the calling function
        }
    };

    const setAdmin = () => {
        setRole(true);
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:5000/api/setAdmin', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: ''
            }).then(resp => resp.json()).then(data => message.info(data.JSON))
        }
    }

    const getCreator = async (userId) => {
        // console.log(userId);
        try {
            const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
            if (response.status === 200) {
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.log('[get creator]', error);
            return null;
        }
    }

    const getTotalOrdersByCourseId = async(courseId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/orders-by-course/${courseId}`);
            if (response.status === 200) {
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.log('[get total order by course id]', error);
            return null;
        }
    }

    const getAllUsers = async () => {
        // console.log(userId);
        try {
            const response = await axios.get(`http://localhost:5000/api/users`);
            // console.log(response.data);
            // return response.data;
            if (response.status === 200) {
                // console.log(response.data.user);
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.log('[get all users]', error);
            return null;
        }
    }

    const getCategories = () => {
        return (
            [
                { "id": 1, "name": "Technology" },
                { "id": 2, "name": "Science" },
                { "id": 3, "name": "Programming" },
                { "id": 4, "name": "Cooking" },
                { "id": 5, "name": "Business" },
                { "id": 6, "name": "History" },
                { "id": 7, "name": "Mathematics" },
                { "id": 8, "name": "Health & Fitness" },
                { "id": 9, "name": "Sport" }
            ]
        )
    }

    const fetchOrdersPerCategory = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/orders-per-category');
            if (!response.ok) {
                throw new Error('Failed to fetch orders per category');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching orders per category:", error);
            throw error;
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems(prev => ({
            ...prev,
            [itemId]: prev[itemId] - 1,
        }))
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:5000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'itemId': itemId })
            }).then(resp => resp.json()).then(data => console.log(data))
        }
    }

    const getTotlaCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_course.find((e) => (e.id === Number(item)));
                totalAmount += itemInfo.new_price * cartItems[item]
            }
        }
        return totalAmount;
    }

    const getTotlaUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/countusers');
            if (!response.ok) {
                throw new Error('Failed to fetch total users');
            }

            const data = await response.json();
            return data.totalUsers;
        } catch (error) {
            console.log("Error fetching total users:", error);
            throw error;
        }
    }

    const getTotlaTeachers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/count-teachers');
            return (response.data.totalTeachers);
        } catch (error) {
            console.error('Error fetching total teachers:', error);
        }
    };

    const getTotlaAdmins = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/count-admins');
            return (response.data.totalAdmins);
        } catch (error) {
            console.error('Error fetching total admins:', error);
        }
    };

    const getTotlaOrder = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/countorders');
            if (!response.ok) {
                throw new Error('Failed to fetch total orders');
            }
            const data = await response.json();
            return data.totalOrders;
        } catch (error) {
            console.error("Error fetching total orders:", error);
            throw error;
        }
    }

    const getTotlaCourses = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/countcourses');
            if (!response.ok) {
                throw new Error('Failed to fetch total courses');
            }

            const data = await response.json();
            return data.totalCourses;
        } catch (error) {
            console.error("Error fetching total courses:", error);
            throw error;
        }
    }

    const fetchUsersPerMonth = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/countusers-per-month');
            if (!response.ok) {
                throw new Error('Failed to fetch total users per month');
            }
            const data = await response.json();
            return (data);
        } catch (error) {
            console.error("Error fetching total users per month:", error);
        }
    };

    const fetchCoursesPerMonth = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/countcourses-per-month');
            if (!response.ok) {
                throw new Error('Failed to fetch total courses per month');
            }
            const data = await response.json();
            return (data);
        } catch (error) {
            console.error("Error fetching total courses per month:", error);
        }
    };

    const fetchOrdersPerMonth = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/countorders-per-month');
            if (!response.ok) {
                throw new Error('Failed to fetch total orders per month');
            }
            const data = await response.json();
            return (data);
        } catch (error) {
            console.error("Error fetching total orders per month:", error);
        }
    };

    const getTotlaCartItem = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }

    const fetchOrdersPerCourse = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/orders-per-course');
            if (!response.ok) {
                throw new Error('Failed to fetch orders per course');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching orders per course:', error);
            throw error;
        }
    };

    const contextValue = { all_course, published_course, cartItems, role, getUserData, getTotalOrdersByCourseId, userEnrollCourse, setTeacher, setAdmin, getAllUsers, getCreator, getCategories, fetchOrdersPerCourse, fetchOrdersPerCategory, fetchOrdersPerMonth, fetchUsersPerMonth, fetchCoursesPerMonth, getTotlaCourses, getTotlaOrder, getTotlaUsers, getTotlaTeachers, getTotlaAdmins, addToCart, removeFromCart, getTotlaCartAmount, getTotlaCartItem };


    return (
        <ShopContext.Provider value={contextValue} >
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;