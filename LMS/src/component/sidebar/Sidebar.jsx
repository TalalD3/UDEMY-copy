import React, { useState } from 'react'
import 'boxicons'

import './sidebar.css'
import SidebarIcon from './SidebarIcon'

const Sidebar = () => {
    const [active, setActive] = useState('home');

    return (
        <div className='sidebar'>
            {/* <SidebarIcon link={} icon={} description={} horizontal={}/> */}
            <SidebarIcon link={''} icon={'home-alt-2'} description={'home'} active={active} setActive={setActive} />
            {/* <SidebarIcon link={''} icon={'home-alt'} description={'home2'} active={active} setActive={setActive} /> */}
            <SidebarIcon link={'manageuser'} icon={'group'} description={'manage users'} active={active} setActive={setActive} />
            {/* <SidebarIcon link={''} icon={'image'} description={'manage courses2'} active={active} setActive={setActive} /> */}
            <SidebarIcon link={'managecourse'} icon={'play-circle'} description={'manage courses'} active={active} setActive={setActive} />
            <SidebarIcon link={'admin/dashboard'} icon={'bar-chart'} description={'analistic'} horizontal={'bx-flip-horizontal'} active={active} setActive={setActive} />
            {/* <SidebarIcon link={''} icon={'line-chart'} description={'analistic2'} active={active} setActive={setActive} /> */}
            {/* <SidebarIcon link={''} icon={'bar-chart-alt-2'} description={'analistic3'} horizontal={'bx-flip-horizontal'} active={active} setActive={setActive} /> */}

        </div>
    )
}

export default Sidebar