import { MutableRefObject, ReactElement, useRef } from 'react'
import { useAuth } from '../../hooks/auth'

import './styles.scss'

type Props = {
    customToggle?: () => ReactElement<any, any>;
    renderFooter?: () => ReactElement<any, any>;
    renderItems: (item: Object, index: number) => ReactElement<any, any>;
    contentData: Object[];
    icon?: string;
    badge?: string;
    logOut?: boolean;
}

const clickOutsideRef = (content_ref: MutableRefObject<any>, toggle_ref: MutableRefObject<any>) => {
    document.addEventListener('mousedown', (e) => {
        // user click toggle
        if (toggle_ref.current && toggle_ref.current.contains(e.target)) {
            content_ref.current.classList.toggle('active')
        } else {
            // user click outside toggle and content
            if (content_ref.current && !content_ref.current.contains(e.target)) {
                content_ref.current.classList.remove('active')
            }
        }
    })
}

export function Dropdown(props: Props) {
    const { signOut } = useAuth();

    const dropdown_toggle_el = useRef(null)
    const dropdown_content_el = useRef(null)

    clickOutsideRef(dropdown_content_el, dropdown_toggle_el)

    return (
        <div className='dropdown'>
            <button ref={dropdown_toggle_el} className="dropdown__toggle">
                {
                    props.icon ? <i className={props.icon}></i> : ''
                }
                {
                    props.badge ? <span className='dropdown__toggle-badge'>{props.badge}</span> : ''
                }
                {
                    props.customToggle ? props.customToggle() : ''
                }
            </button>
            <div ref={dropdown_content_el} className="dropdown__content">
                {
                    props.contentData && props.renderItems ? props.contentData.map((item, index) => props.renderItems(item, index)) : ''
                }
                {props.logOut &&
                    <a href="#logout">
                        <div className="notification-item" onClick={signOut}>
                            <i className={'bx bx-log-out-circle bx-rotate-180'}></i>
                            <span>{'Logout'}</span>
                        </div>
                    </a>
                }
                {
                    props.renderFooter ? (
                        <div className="dropdown__footer">
                            {props.renderFooter()}
                        </div>
                    ) : ''
                }
            </div>

        </div>
    )
}