import React from 'react'
import FeaturedCourse from '../component/featuredCourse/FeaturedCourse'
import Introduction from "../component/introduction/Introduction"
import About from "../component/About/About.jsx"
import Categories from '../component/categories/Rcategories.jsx'
import Ad from "../component/Advert/Ad.jsx"
import Reviews from '../component/reviews/Reviews.jsx'
import Foot from '../component/footer/Foot.jsx'

function Home() {
  return (
    <div>
      <Introduction />
      <FeaturedCourse />
      <About />
      <Categories />
      <Ad />
      <Reviews />
      <Foot />
    </div>
  )
}

export default Home