import React, { useContext } from 'react'
import Item from '../item/Item'
import './featuredCourse.css'
import { ShopContext } from '../../Context/ShopContext'

function FeaturedCourse() {

    const { published_course } = useContext(ShopContext);
    const courses = published_course.slice(0, 6)


    return (
        <section className='section'>
            <h1 className="section_title">Featured <span className='green'>Course</span></h1>
            <p className="section_subtitle">Unlock the pinnacle of learning in our courses.</p>
            <div className="container featuredCourse">
                {
                    courses.map((course) => (
                        <Item course={course} key={course._id} />
                    ))
                }
            </div>
        </section>
    )
}

export default FeaturedCourse