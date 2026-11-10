import React, { useContext } from 'react'
import Item from '../item/Item'
import './featuredCourse.css'
import { ShopContext } from '../../Context/ShopContext'

function FeaturedCourse() {

    const { published_course } = useContext(ShopContext);
    const sortedCourses = published_course.sort((a, b) => b.rating - a.rating);
    const courses = sortedCourses.slice(0, 8);


    return (
        <section className='section'>
            <h1 className="section_title">Featured <span className='green'>Course</span></h1>
            <p className="section_subtitle">Unlock the pinnacle of learning in our courses.</p>
            <div className="container featuredCourse">
                {
                    courses.map((sortedCourses) => (
                        <Item course={sortedCourses} key={sortedCourses._id} />
                    ))
                }
            </div>
        </section>
    )
}

export default FeaturedCourse