import { Outlet } from "react-router";
import { Sidebar } from "../Sidebar";
import { TopNav } from "../TopNav";


import './styles.scss'

export function Layout() {

    return (
        <div className={'layout'}>
            <Sidebar />
            <div className="layout__content">
                <TopNav />
                <div className="layout__content-main">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}