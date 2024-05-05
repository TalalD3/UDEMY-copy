import React from 'react';
import { Link } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export default function Dashbord({ setTeacher, showModal,role }) {

    const [openCategory, setOpenCategory] = React.useState(false);

    return (


        <div>
            <div className='navLink' onClick={() => setOpenCategory(!openCategory)} onWheel={() => setOpenCategory(false)} >
                <button className='ghostbtn dashboard'><PersonOutlineIcon /></button>
                {/* <Link to="/Category" ><button>Category</button></Link> */}
                <div className={!openCategory ? '' : 'shooo'} onClick={() => setOpenCategory(false)} />
                <ul className={!openCategory ? 'hidden' : 'dropdown'} >
                    {/* <li >
                        <Link to={`/profile`} onClick={() => setOpenCategory(false)}>
                            <button className='dropdownCategory'>Profile</button>
                        </Link>
                    </li> */}
                    {
                        (role === 'admin' || role === 'teacher') ?
                            <li className='navLink nav-block'><button className='dropdownCategory' onClick={showModal}>Add course</button></li> :
                            // <Link to="/addCourse" ><button className='add-course' ><AddCircleOutlineIcon fontSize="large" /></button></Link>:
                            <li className='navLink nav-block'><button className='dropdownCategory' onClick={() => setTeacher()}>Teach mode</button></li>
                        // <Link to="/" ><button className=''>Teach mode</button></Link>
                    }
                    <li >
                        <Link to={`/myCourses`} onClick={() => setOpenCategory(false)}>
                            <button className='dropdownCategory'>Profile</button>
                        </Link>
                    </li>
                    
                    <li className='navLink nav-block'><Link to="/courses" ><button className='dropdownCategory'>Courses</button></Link></li>


                    <li >
                        <button className='dropdownCategory bold' onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/') }}>Logout</button>
                    </li>
                </ul>
            </div>
        </div>
    );
}