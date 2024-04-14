import React, { useEffect, useState } from 'react'
import Titre from '../component/coursetitle/Titre.jsx'
import imagecourse from "../assets/images/itemImg1.png"
import Foot from '../component/footer/Foot.jsx';
import Carte from '../component/coursetitle/Carte.jsx';
import './css/course.css';
import Courseinfos from '../component/coursetitle/Courseinfos.jsx';
import Carousel from '../component/coursetitle/Carousel.jsx';
import { useParams } from 'react-router-dom';
import { Alert, message } from 'antd';


function Course() {
  const { courseId } = useParams();
  const [course, setCourse] = useState({});

  useEffect( () => {
    async function fetchData() {
      let responceData;
      console.log(courseId);
      if (courseId) {
        await fetch('http://localhost:5000/api/getCoursebyId', {
          method: 'POST',
          headers: {
            Access: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ courseId: courseId })
        }).then(resp => resp.json()).then(data => responceData = data)
        if (responceData.success) {
          setCourse(responceData.course);
        }
        else {
          // <Alert message="Error Text" type="error" />
          window.location.replace('/');
          alert('course not found');
          // navigate("/");
          // message.error('course not found');
          // <Alert message="Course not found" type="error" />
        }
      }
    }
    fetchData();

  }, [courseId]);


  // const course =
  // {
  //   id: 1,
  //   title: 'Data Entry basic to advance',
  //   littleDescription: 'Covers pretty much everything you need to know about UX Covers pretty much everything you need to know about UX Covers pretty much everything you need to know about UX Covers pretty much everything you need to know about UX',
  //   creator: 'Dr. Abdesselam Mohamed',
  //   bigdescription: 'This course will teach you everything you need to know about UX, including design, content, and coding. And you ll learn from the ground up, so it doesnt matter how much experience you have when you start.This course will teach you everything you need to know about UX, including design, content, and coding. And you ll learn from the ground up, so it doesnt matter how much experience you have when you start.This course will teach you everything you need to know about UX, including design, content, and coding. And you ll learn from the ground up, so it doesnt matter how much experience you have when you start.This course will teach you everything you need to know about UX, including design, content, and coding. And you ll learn from the ground up, so it doesnt matter how much experience you have when you start.',
  //   new_props: 350,
  //   old_props: 420,
  //   img: imagecourse,
  //   rating: 4.5,
  //   price: '1000$',
  // }


  const formatDescription = (description) => {
    const maxLength = 100;
    if (description.length > maxLength) {
      const words = description.split(' ');
      let chunk = '';
      const chunks = [];
      for (let i = 0; i < words.length; i++) {
        if (chunk.length + words[i].length + 1 <= maxLength) {
          chunk += (chunk ? ' ' : '') + words[i];
        } else {
          chunks.push(chunk);
          chunk = words[i];
        }
      }
      if (chunk) chunks.push(chunk);
      return (
        <span>
          {chunks.map((chunk, index) => (
            <React.Fragment key={index}>
              {chunk}
              <br />
            </React.Fragment>
          ))}
        </span>
      );
    }
    return description;
  };




  return (


    <div>

      <Titre
        key={course._id}
        title={course.title}
        creator={course.creator}
        littleDescription={course.small_description}
        rating={course.rating}
      />

      <div className='cartabout'>
        <div className='cart'>
          <Carte img={course.image}
            title={course.title}
            price={course.price}
          />
        </div>

        <div className='infomation'>
          <Courseinfos bigdescription={course.description} />
          <Carousel />
        </div>

      </div>

      <Foot />

    </div>
  )
}


export default Course