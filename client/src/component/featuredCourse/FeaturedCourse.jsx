import React, { useContext } from 'react'
import Item from '../item/Item'
import itemImg1 from '../../assets/images/itemImg1.png'
import './featuredCourse.css'
import { ShopContext } from '../../Context/ShopContext'

const items = [
    {
        id: 1,
        title: 'Data Entry basic to advance',
        littleDescription: 'Covers pretty much everything you need to know about UX',
        creator: 'Dr. Abdesselam Mohamed',
        new_props: 350,
        old_props: 420,
        image: itemImg1,
        rating: 4.5,
    },
    {
        id: 1,
        title: 'Data Entry basic to advance',
        littleDescription: 'Covers pretty much everything you need to know about UX',
        creator: 'Dr. Abdesselam Mohamed',
        new_props: 350,
        old_props: 420,
        image: itemImg1,
        rating: 4.5,
    },
    {
        id: 1,
        title: 'Data Entry basic to advance',
        littleDescription: 'Covers pretty much everything you need to know about UX',
        creator: 'Dr. Abdesselam Mohamed',
        new_props: 350,
        old_props: 420,
        image: itemImg1,
        rating: 4.5,
    },
    {
        id: 1,
        title: 'Data Entry basic to advance',
        littleDescription: 'Covers pretty much everything you need to know about UX',
        creator: 'Dr. Abdesselam Mohamed',
        new_props: 350,
        old_props: 420,
        image: itemImg1,
        rating: 4.5,
    },
    {
        id: 1,
        title: 'Data Entry basic to advance',
        littleDescription: 'Covers pretty much everything you need to know about UX',
        creator: 'Dr. Abdesselam Mohamed',
        new_props: 350,
        old_props: 420,
        image: itemImg1,
        rating: 4.5,
    },
    {
        id: 1,
        title: 'Data Entry basic to advance',
        littleDescription: 'Covers pretty much everything you need to know about UX',
        creator: 'Dr. Abdesselam Mohamed',
        new_props: 350,
        old_props: 420,
        image: itemImg1,
        rating: 4.5,
    },
]

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