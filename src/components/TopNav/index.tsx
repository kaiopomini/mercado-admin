import "./styles.scss";

import { Link } from "react-router-dom";

import notifications from "../../assets/JsonData/notification.json";

import user_image from "../../assets/img/logo-admin.png";

import { NotificationsNone } from "@material-ui/icons";

import user_menu from "../../assets/JsonData/user_menus.json";
import { Dropdown } from "../Dropdown";
import { useAuth, User } from "../../hooks/auth";

type renderItemProps = {
  icon: string;
  content: string;
};

const renderNotificationItem = (item: renderItemProps, index: number) => (
  <div className="notification-item" key={index}>
    <i className={item.icon}></i>
    <span>{item.content}</span>
  </div>
);

const renderUserToggle = (user: User | undefined) => (
  <div className="topnav__right-user">
    <div className="topnav__right-user__image">
      <img
        src={
          user && user.avatar && user.avatar !== "default"
            ? user?.avatar
            : user_image
        }
        alt="imagem avatar"
      />
    </div>
    <div className="topnav__right-user__name">{user && user.name}</div>
  </div>
);

const renderUserMenu = (item: renderItemProps, index: number) => (
  <Link to="/" key={index}>
    <div className="notification-item">
      <i className={item.icon}></i>
      <span>{item.content}</span>
    </div>
  </Link>
);

export function TopNav() {
  const { user } = useAuth();

  return (
    <div className="topnav">
      <div className="topnav__search">
        {/* <input type="text" placeholder='Search here...' />
                <i className='bx bx-search'></i> */}
      </div>
      <div className="topnav__right">
        <div className="topnav__right-item">
          <Dropdown
            icon={<NotificationsNone fontSize="large" />}
            badge="12"
            contentData={notifications}
            renderItems={(item, index) =>
              renderNotificationItem(item as renderItemProps, index)
            }
            renderFooter={() => <Link to="/">View All</Link>}
          />
          {/* dropdown here */}
        </div>
        <div className="topnav__right-item">
          {/* dropdown here */}
          <Dropdown
            customToggle={() => renderUserToggle(user)}
            contentData={user_menu}
            renderItems={(item, index) =>
              renderUserMenu(item as renderItemProps, index)
            }
            logOut
          />
        </div>

        {/* <div className="topnav__right-item">
                    <ThemeMenu/>
                </div> */}
      </div>
    </div>
  );
}
