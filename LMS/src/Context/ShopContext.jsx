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
    const [isTeacher, setIsTeacher] = useState(false);


    useEffect(() => {
        fetch('http://localhost:5000/api/allcourses')
            .then(resp => resp.json())
            .then(data => setAll_course(data))

        const isTeacher = async () => {
            if (localStorage.getItem('auth-token')) {

                await fetch('http://localhost:5000/api/isTeacher', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/form-data',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application.json'
                    },
                    body: ""
                }).then(resp => resp.json()).then(data => setIsTeacher(data.isTeacher))
            }
        }

        isTeacher();


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
        setIsTeacher(true);
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:5000/api/setTeacher', {
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
            console.log(response.data);
            return response.data;
            // if (response.status === 200) {
            //     console.log(response.data.user);
            //     return response.data.user;
            // } else {
            //     return null;
            // }
        } catch (error) {
            console.log('[get creator]', error);
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

    const getTotlaCartItem = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }

    const contextValue = { all_course, cartItems, isTeacher, setTeacher, getCreator, getCategories, addToCart, removeFromCart, getTotlaCartAmount, getTotlaCartItem };


    return (
        <ShopContext.Provider value={contextValue} >
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;