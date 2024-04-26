import React, { useEffect, useState } from 'react'
import Category from "./Categories"
// import cats from "./cats"
import "./catg.css"
import art from "../../assets/icons/art.png"
import design from "../../assets/icons/design.png"
import Web from "../../assets/icons/web.png"
import software from "../../assets/icons/sofware.png"
import person from "../../assets/icons/person.png"
import digital from "../../assets/icons/digitalm.svg"
import axios from 'axios'

const imge = [
    {
        img: person,
        title: 'Business',
    },
    {
        img: software,
        title: 'Technology',
    },
    {
        img: design,
        title: 'Mathematics',
    },
    {
        img: digital,
        title: 'Cooking',
    },
    {
        img: software,
        title: 'Science',
    },
    {
        img: digital,
        title: 'Health & Fitness',
    },
    {
        img: person,
        title: 'History',
    },
    {
        img: digital,
        title: 'Sport',
    },
    {
        img: Web,
        title: 'Programming',
    },
]

function Rcategories() {
    // const { getCategories } = useContext(ShopContext);
    const [totalCoursesPerCategory, setTotalCoursesPerCategory] = useState([]);
    const [category, setCategory] = useState([]);

    useEffect(() => {
        const fetchTotalCoursesPerCategory = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/total-courses-per-category');
                setTotalCoursesPerCategory(response.data);
            } catch (error) {
                console.error('Error fetching total courses per category:', error);
            }
        };

        fetchTotalCoursesPerCategory();
    }, []);

    useEffect(() => {
        const mergedData = imge.map(item => {
            const totalCourses = totalCoursesPerCategory.find(course => course._id === item.title);
            return {
                ...item,
                totalCourses: totalCourses ? totalCourses.totalCourses : 0
            };
        });

        const sortedCategory = mergedData.sort((a, b) => b.totalCourses - a.totalCourses);
        setCategory(mergedData);
    }, [totalCoursesPerCategory]);




    return (
        <div className='cats'>
            <div className='text'>
                <h3 className='top'>Top<span>Categories</span></h3>
                <h5>12,000+ unique online course list designs</h5>
            </div>
            <div className='container'>


                <div className='categories-container'>
                    {category.slice(0, 6).map(props => (

                        <Category
                            key={props.title}
                            img={props.img}
                            title={props.title}
                            courses={props.totalCourses}
                        />

                    ))}
                </div>

            </div>
        </div>
    )
}

export default Rcategories