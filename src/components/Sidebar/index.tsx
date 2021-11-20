import './styles.scss';

import {
  LineStyle,
  Timeline,
  TrendingUp,
  PermIdentity,
  Storefront,
  AttachMoney,
  BarChart,
  MailOutline,
  DynamicFeed,
  ChatBubbleOutline,
  WorkOutline,
  Report,
} from "@material-ui/icons";
import logo from '../../assets/img/logo-blue.png'
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export function Sidebar() {

  const location = useLocation();

  function selectActiveButton() {
    const sidebarMenu = document.getElementById('sidebarMenu');
    const links = sidebarMenu && sidebarMenu.getElementsByTagName('a');
    if(links) {
      for (let i: number = 0; i < links.length; i++) {
        const link = links[i];
        const href = link.href.split('/')
        const hrefFull = ('/' + href[3])
        if(location.pathname === hrefFull){
          const item = link.firstChild as HTMLElement;
          item && item.classList.add('active');
        } else {
          const item = link.firstChild as HTMLElement;
          item && item.classList.remove('active');
        }
      }
    }
  }
  
  useEffect(() => {
    selectActiveButton()
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])


  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <img src={logo} alt="logo" />
      </div>
      <div className="sidebar__items-container">


      <div className="sidebarWrapper" id="sidebarMenu">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/" className="link">
            <li className="sidebarListItem">
              <LineStyle className="sidebarIcon" />
              Home
            </li>
            </Link>
            <li className="sidebarListItem">
              <Timeline className="sidebarIcon" />
              Analytics
            </li>
            <li className="sidebarListItem">
              <TrendingUp className="sidebarIcon" />
              Sales
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <Link to="/users" className="link">
              <li className="sidebarListItem">
                <PermIdentity className="sidebarIcon" />
                Users
              </li>
            </Link>
            <Link to="/products" className="link">
              <li className="sidebarListItem">
                <Storefront className="sidebarIcon" />
                Products
              </li>
            </Link>
            <li className="sidebarListItem">
              <AttachMoney className="sidebarIcon" />
              Transactions
            </li>
            <li className="sidebarListItem">
              <BarChart className="sidebarIcon" />
              Reports
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Notifications</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <MailOutline className="sidebarIcon" />
              Mail
            </li>
            <li className="sidebarListItem">
              <DynamicFeed className="sidebarIcon" />
              Feedback
            </li>
            <li className="sidebarListItem">
              <ChatBubbleOutline className="sidebarIcon" />
              Messages
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Staff</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <WorkOutline className="sidebarIcon" />
              Manage
            </li>
            <li className="sidebarListItem">
              <Timeline className="sidebarIcon" />
              Analytics
            </li>
            <li className="sidebarListItem">
              <Report className="sidebarIcon" />
              Reports
            </li>
          </ul>
        </div>
      </div>
      </div>
    </div>
  );
}
