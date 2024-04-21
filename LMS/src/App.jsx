import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './Pages/Header'
import Home from './Pages/Home'
import Courses from './Pages/Courses'
import Course from './Pages/Course'
import Cart from './Pages/Cart'
import Login from './Pages/Login'
import AddCourse from './Pages/AddCourse'
import AddCourseForm from './component/addCourse/AddCourseForm'
import AddChapterForm from './component/addCourse/AddChapterForm'
import AddChapter from './component/forme/AddChapter'
import Sidebar from './component/sidebar/Sidebar'
import Dashboard from './component/dashboard/Dashboard'
import WatchCourse from './Pages/WatchCourse'
import Search from './Pages/Search'


function App() {


  return (
    <div>
      <BrowserRouter>
        <Header />
        {/* <Sidebar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/search" element={<Search />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          {/* <Route path="/teacher/addCourse" element={<AddCourse />}/> */}
          <Route path="/teacher/addCourse/:courseId" element={<AddCourseForm />}/>
          <Route path="/teacher/addCourse/:courseId/chapters/:chapterId" element={<AddChapter />}/>
          <Route path="/course/:courseId" element={<Course />} />
          <Route path="/watchCourse/:courseId" element={<WatchCourse />} />
        </Routes>
        {/* <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/courses' element={<Courses />} />
          <Route path='/teacher/addCourse' element={<AddCourse />} >
            <Route path=':courseId' element={<AddCourseForm />} >
              <Route path='/chapter/:chapterId' element={<AddChaptereForm />} />
            </Route>
          </Route>
          <Route path='/course' element={<Course />}>
            <Route path=':courseId' element={<Course />} />
          </Route>
        </Routes> */}
      </BrowserRouter>
    </div>
  )
}

export default App
