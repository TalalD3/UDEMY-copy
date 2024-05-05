import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import Item from '../component/item/Item';

import './css/search.css'
import Foot from '../component/footer/Foot';

const Search = () => {
  const { published_course } = useContext(ShopContext);

  const [searchValue, setSearchValue] = useState('');
  const [searchedCourses, setSearchedCourses] = useState([]);
  const [searchParams] = useSearchParams('');

  // useEffect(() => {

  //   const searchData = searchParams.get('data');
  //   setSearchValue(searchData || ''); // Set searchValue state to the value of the 'data' query parameter

  //   setSearchedCourses(filterPrompts(searchData || ''));

  // }, [searchParams,searchedCourses.length,searchValue]);

  // console.log(searchParams.get('data'));

  useEffect(() => {
    const fetchData = async () => {
      const searchData = searchParams.get('data');
      setSearchValue(searchData || '');

      // Fetch data asynchronously
      const searchedData = await filterPrompts(searchData || '');

      // Update state after fetching data
      setSearchedCourses(searchedData);
    };

    fetchData(); // Call fetchData when component mounts

  }, [searchParams,published_course ]); // Remove searchedCourses.length from the dependency array


  const filterPrompts = (searchValue) => {
    const regex = new RegExp(searchValue, "i"); // 'i' flag for case-insensitive search
    return published_course.filter(
      (course) =>
        regex.test(course.creator.username) ||
        regex.test(course.small_description) ||
        regex.test(course.category) ||
        regex.test(course.title)
    );
  };


  return (
    <div>
    <section className="section">
      <div className="container">
        <div>
          <h1>Search Results</h1>
          <p>{searchedCourses.length} results for  “{searchValue}”</p>
          {/* <p>Search Query: {searchValue}</p> */}
          <div className='search-container'>
            {
              searchValue ? (
                searchedCourses.length ? (
                  searchedCourses?.map((course) => (
                    <Item course={course} key={course._id} />
                  ))
                ) : (
                  <div>
                    no course found
                  </div>
                )
              ) : (
                <div>
                  please write Something
                </div>
              )
            }
          </div>
        </div>
      </div>
    </section>
    <Foot />
    </div>
  )
}

export default Search