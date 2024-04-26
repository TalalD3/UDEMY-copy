import React, { useContext, useEffect, useRef, useState } from 'react'
import Titre from '../component/coursetitle/Titre.jsx'
import imagecourse from "../assets/images/itemImg1.png"
import Foot from '../component/footer/Foot.jsx';
import Carte from '../component/coursetitle/Carte.jsx';
import './css/course.css';
import Courseinfos from '../component/coursetitle/Courseinfos.jsx';
import Carousel from '../component/coursetitle/Carousel.jsx';
import { useParams } from 'react-router-dom';
import { Alert, Button, message, Modal } from 'antd';
import { ShopContext } from '../Context/ShopContext.jsx';


function Course() {
  const { courseId } = useParams();

  const [course, setCourse] = useState({});
  const [playVideoUrl, setPlayVideoUrl] = useState('');
  const videoRef = useRef(null);
  const [username, setUsername] = useState('');
  const [isUserEnroll, setIsUserEnroll] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orederCourse, setOrederCourse] = useState(0);

  const { getCreator, userEnrollCourse, getTotalOrdersByCourseId } = useContext(ShopContext);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
    };
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
    };
  };


  useEffect(() => {
    async function fetchData() {
      let responceData;
      // console.log(courseId);
      if (courseId) {
        await fetch(`http://localhost:5000/api/courses/${courseId}`)
          .then(resp => resp.json()).then(data => responceData = data)
        if (responceData.success) {
          setCourse(responceData.course);
        }
        else {
          window.location.replace('/');
          message.error('course not found');
        }
      }
    }



    fetchData();

  }, [courseId, username, isUserEnroll]);


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

  const fetchData = async () => {
    if (course.creator) {
      const user = await getCreator(course.creator);
      setUsername(user.username);
    }
    if (localStorage.getItem('auth-token')) {
      try {
        const data = await userEnrollCourse(courseId);
        setIsUserEnroll(data.success);
        // console.log(data.success);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    try {
      const oreder = await getTotalOrdersByCourseId(courseId);
      setOrederCourse(oreder.totalOrders);
    } catch (error) {
      console.log('error fetching order course:', error);
    }
  };

  fetchData();


  const enrollCourse = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/enroll-course', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'courseId': courseId })
      });

      if (!response.ok) {
        throw new Error('Failed to enroll in course');
      }

      const data = await response.json();

      message.success(data.message);  // Output success message
      window.location.reload();

    } catch (error) {
      message.error('Error enrolling in course');
    }
  };


  return (



    <div className='fullheight'>

      <Modal
        open={isModalOpen}
        title="Watch Lesson"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            Ok
          </Button>
        ]}>
        <div className='PlayVideoContainer'>
          <div className='PlayVideo'>
            <video
              className='freeVideo'
              controls
              ref={videoRef}
              src={playVideoUrl}
              width={'470px'}
              height={'350px'}
            ></video>
          </div>
        </div>
      </Modal>

      <div>

        <Titre
          key={course._id}
          title={course.title}
          creator={username}
          littleDescription={course.small_description}
          rating={course.rating}
          orederCourse={orederCourse}
        />

        <div className='container cartabout'>
        <div className='cart'>
            <Carte
              img={course.image}
              title={course.title}
              price={course.price}
              enrollCourse={enrollCourse}
              isUserEnroll={isUserEnroll}
              courseId={courseId}
            />
          </div>

          <div className='infomation'>
            <Courseinfos bigdescription={course.description} chapters={course.chapters} setPlayVideoUrl={setPlayVideoUrl} showModal={showModal} />
            <Carousel />
          </div>

        </div>

        <Foot />

      </div>


    </div>
  )
}


export default Course