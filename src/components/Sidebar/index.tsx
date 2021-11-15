import './styles.scss';

import sidebarItems from '../../assets/JsonData/sidebar_routes.json';

import logo from '../../assets/img/logo-blue.png'
import { Link, useLocation} from 'react-router-dom';

interface ISideBarItem {
  active: boolean;
  icon: string;
  title: string;
}

const SidebarItem = ({ active, icon, title } : ISideBarItem ) => {

  const activeStr = active ? 'active' : ''

  return (
      <div className="sidebar__item">
          <div className={`sidebar__item-inner ${activeStr}`}>
              <i className={icon}></i>
              <span>
                  {title}
              </span>
          </div>
      </div>
  )
}

export function Sidebar() {

  const location = useLocation()

  const activeItem = sidebarItems.findIndex(item => item.route === location.pathname)
  
  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <img src={logo} alt="logo"/>
      </div>
      {
        sidebarItems.map((item, index) => (
          <Link to={item.route} key={index}>
            <SidebarItem title={item.display_name} icon={item.icon} active={index === activeItem}/> 
          </Link>
        ))
      }
    </div>
  );
}
