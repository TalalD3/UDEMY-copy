import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SidebarIcon = ({ link, icon, description, horizontal, active, setActive}) => {
    const [openDescription, setOpenDescription] = useState(false);
    // const [active, setActive] = useState('home');

    return (
        <div>
            <Link to={`/${link}`}>
                <div className='item' onClick={()=>{setActive(description)}} onMouseOver={()=>{setOpenDescription(true)}} onMouseLeave={()=>{setOpenDescription(false)}}>
                    <i class={`bx bx-${icon} sidebar-icon ${horizontal} ${active===description && 'sidebar-icon-click'}`}></i>
                    {openDescription && <div className="sidebar-description">
                        <span>{description}</span>
                        {/* {description} */}
                    </div>}
                </div>
            </Link>
        </div>
    )
}

export default SidebarIcon