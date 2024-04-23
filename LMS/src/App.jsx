import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Pages/Header';
import Home from './Pages/Home';
import Courses from './Pages/Courses';
import Course from './Pages/Course';
import Cart from './Pages/Cart';
import Login from './Pages/Login';
import AddCourseForm from './component/addCourse/AddCourseForm';
import AddChapter from './component/forme/AddChapter';
import Dashboard from './component/dashboard/Dashboard';
import WatchCourse from './Pages/WatchCourse';
import Search from './Pages/Search';
import AdminSidebar from './component/sidebar/AdminSidebar';
import ManageCourses from './component/dashboard/ManageCourses';
import ManageUsers from './component/dashboard/ManageUsers';

import { ShopContext } from './Context/ShopContext';
import AddCourse from './Pages/AddCourse';
import { Profile } from './Pages/Profile';
import MyCourses from './Pages/MyCourses';

function App({ location }) {
  const { role } = useContext(ShopContext);

  // const [therole,setrole] = useState('user');
  // const [isLoginPage, setIsLoginPage] = useState(false);

  // useEffect(() => {
  //   const isLoginpage = location.pathname === '/login';
  //   setIsLoginPage(isLoginpage);
  // }, [location.pathname]);

  // console.log(isLoginPage);
  // console.log(role);


  return (
    <div>
      <BrowserRouter>
        {/* {!isLoginPage && <Header />} */}
        <Header />
        {role === 'admin' && <AdminSidebar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/myCourses" element={<MyCourses />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/managecourses" element={<ManageCourses />} />
          <Route path="/admin/manageusers" element={<ManageUsers />} />
          {/* <Route path="/teacher/addCourse" element={<AddCourse />} /> */}
          <Route path="/teacher/addCourse/:courseId" element={<AddCourseForm />} />
          <Route path="/teacher/addCourse/:courseId/chapters/:chapterId" element={<AddChapter />} />
          <Route path="/course/:courseId" element={<Course />} />
          <Route path="/watchCourse/:courseId" element={<WatchCourse />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
