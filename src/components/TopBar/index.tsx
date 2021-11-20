import './styles.scss';

import { Link } from 'react-router-dom'

import { useAuth, User } from '../../hooks/auth';
 
import adminLongo from '../../assets/img/logo-admin.png'

import { NotificationsNone, Language, Settings } from "@material-ui/icons";

export function TopBar() {

    return (
        <div className="topbar">
          <div className="topbarWrapper">
            <div className="topLeft">
              
            </div>
            <div className="topRight">
              <div className="topbarIconContainer">
                <NotificationsNone />
                <span className="topIconBadge">2</span>
              </div>
              <div className="topbarIconContainer">
                <Language />
                <span className="topIconBadge">2</span>
              </div>
              <div className="topbarIconContainer">
                <Settings />
              </div>
              <img src={adminLongo} alt="" className="topAvatar" />
            </div>
          </div>
        </div>
      );
    }