import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './Pages/Header'
import Home from './Pages/Home'
import Courses from './Pages/Courses'
import Course from './Pages/Course'
import Cart from './Pages/Cart'
import Login from './Pages/Login'
import AddCourse from './Pages/AddCourse'


function App() {


  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/courses' element={<Courses />} />
          <Route path='/addCourse' element={<AddCourse />} />
          <Route path='/course' element={<Course />}>
            <Route path=':courseId' element={<Course />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
