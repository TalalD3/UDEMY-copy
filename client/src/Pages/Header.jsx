import React, { useContext, useState } from 'react'

import logo from "./../assets/icons/logo.svg"
import logotitle from "./../assets/icons/logoTitle.svg"
import cart from "./../assets/icons/cart.svg"
import searchicon from "./../assets/icons/searchicon.svg"

// import {AddCircleOutlineIcon} from '@mui/icons-material';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineIcon';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { Link, useNavigate } from 'react-router-dom'
import "./css/header.css"
import Dashbord from '../component/Dashbord'
import { Button, Form, Input, message, Modal } from 'antd'
import axios from 'axios'

import { ShopContext } from '../Context/ShopContext'


function Header() {
  const { role, setTeacher, getCategories } = useContext(ShopContext);

  const [form] = Form.useForm();

  const category = getCategories();

  const navigate = useNavigate();
  // const { all_product, cartItems, addToCart, removeFromCart, getTotlaCartAmount } = useContext(ShopContext);


  const [openCategory, setOpenCategory] = useState(false);

  const addCourse = async () => {
    navigate(`/teacher/addCourse`);
  };

  const addCourse1 = async () => {
    // console.log('Received values:', values.title);
    if (!localStorage.getItem('auth-token')) {
      message.info("please login first");
      navigate('/login')
    }
    try {
      fetch('http://localhost:5000/api/addcourse', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json'
        },
        body: ''
      }).then(resp => resp.json()).then(data => data.course).then((course) => {
        navigate(`/teacher/addCourse/${course._id}`);
      });
      message.info("Complete all entry fields");
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };


  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const encodedSearchInput = encodeURIComponent(searchInput);
    navigate(`/search?data=${encodedSearchInput}`); // Use navigate instead of history.push
  };


  const [isModalOpen, setIsModalOpen] = useState(false);


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = async () => {
    setIsModalOpen(false);
    if (!localStorage.getItem('auth-token')) {
      message.info("please login first");
      navigate('/')
    }
    try {
      const values = await form.getFieldsValue();
      fetch('http://localhost:5000/api/addcourse', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'title': values.title })
      }).then(resp => resp.json()).then(data => data.course).then((course) => {
        navigate(`/teacher/addCourse/${course._id}`);
      });
      form.resetFields();
      message.info("Complete all entry fields");
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <nav className='fixed'>
      <Modal
        open={isModalOpen}
        title="Add Course"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="link" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Add
          </Button>
        ]}>
        <div className='PlayVideoContainer'>
          <p className='input-title'>course title</p>
          <Form
            layout="inline"
            form={form}
            style={{ justifyContent: "start", gap: '5%' }}
            onFinish={onFinish}
          >
            <Form.Item
              style={{ width: 350, marginBottom: 20, marginRight: 0, marginLeft: 0 }}
              name='title'
              rules={[{ required: true, message: 'Please input the course title to add it' }]}
            >
              <Input placeholder="e.g 'Web developer'" />
            </Form.Item>

          </Form>
        </div>
      </Modal>

      <div className='navmenu container'>

        <div>
          <Link to="/" >
            <div className='logo'>
              <img src={logo} />
              <img src={logotitle} />
            </div>
          </Link>
        </div>


        <div className="pages">
          <ul className='navLinks'>
            <li className='navLink'><Link to="/courses" ><button>Courses</button></Link></li>
            {/* <li className='navLink'><Link to="/mycourse" ><button>My Courses</button></Link></li> */}
          </ul>
        </div>


        <form onSubmit={handleSubmit}>
          <div className="search">
            <input
              className='search-input'
              type="text"
              placeholder='search for course'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <img src={searchicon} />
          </div>
        </form>


        {/* <div>
          <Link to="/cart" >
            <div className='cart'>
              <img src={cart} className='imgcart' />
              <div className='circle'>0</div>
            </div>
          </Link>
        </div> */}


        <div className='login'>

          {
            localStorage.getItem('auth-token') ?
              <>
                {
                  (role === 'admin' || role === 'teacher') ?
                    <button className='' onClick={showModal}>Add course</button> :
                    // <Link to="/addCourse" ><button className='add-course' ><AddCircleOutlineIcon fontSize="large" /></button></Link>:
                    <button className='' onClick={() => setTeacher()}>Teach mode</button>
                  // <Link to="/" ><button className=''>Teach mode</button></Link>
                }
                <Dashbord />
              </> :
              <>
                <Link to="/login" ><button className='ghostbtn' onClick={() => message.warning('please login first')}>Teach mode</button></Link>
                <Link to="/login" ><button className='primarybtn'>Login</button></Link>
              </>
          }



          {/* {
    localStorage.getItem('auth-token') ?
      <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/') }}>Logout</button> :
      <Link to='/login'><button>Login</button></Link>
  } */}


        </div>

      </div>
    </nav>

  )
}

export default Header