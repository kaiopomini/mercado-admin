import { useEffect } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "../Sidebar";
import { TopNav } from "../TopNav";

import { useAuth } from '../../hooks/auth'


import './styles.scss'

export function Layout() {
    const { validadeLogin } = useAuth()

    useEffect(() => {
        validadeLogin();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={'layout'}>
            <Sidebar />
            <div className="layout__content">
                <div className="layout__navbar">
                    <TopNav />
                </div>

                <div className="layout__content-main">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}