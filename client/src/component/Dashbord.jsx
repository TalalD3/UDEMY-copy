import React from 'react';
import { Link } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export default function Dashbord() {

    const [openCategory, setOpenCategory] = React.useState(false);

    return (


        <div>
            <div className='navLink' onClick={() => setOpenCategory(!openCategory)} onWheel={() => setOpenCategory(false)} >
                <button className='ghostbtn dashboard'><PersonOutlineIcon/></button>
                {/* <Link to="/Category" ><button>Category</button></Link> */}
                <div className={!openCategory ? '' : 'shooo'} onClick={() => setOpenCategory(false)} />
                <ul className={!openCategory ? 'hidden' : 'dropdown'} >
                    {/* <li >
                        <Link to={`/profile`} onClick={() => setOpenCategory(false)}>
                            <button className='dropdownCategory'>Profile</button>
                        </Link>
                    </li> */}
                    <li >
                        <Link to={`/myCourses`} onClick={() => setOpenCategory(false)}>
                            <button className='dropdownCategory'>My courses</button>
                        </Link>
                    </li>
                    {/* <li >
                        <Link to={`/dashboard`} onClick={() => setOpenCategory(false)}>
                            <button className='dropdownCategory'>Dashboard</button>
                        </Link>
                    </li> */}
                    {/* <div className="line"/> */}
                    <li >
                        <button className='dropdownCategory bold' onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/') }}>Logout</button>
                    </li>
                </ul>
            </div>
        </div>
    );
}