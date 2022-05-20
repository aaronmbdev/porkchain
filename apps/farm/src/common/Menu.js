import React from 'react';

export default class Menu extends React.Component {
    render() {
        const no_link = "#";
        return (
            <div className="vertical-menu">

                <div className="h-100">

                    <div id="sidebar-menu">
                        <ul className="metismenu list-unstyled" id="side-menu">
                            <li className="menu-title">Menu</li>
                            <li>
                                <a href={no_link} className="waves-effect">
                                    <i className="mdi mdi-view-dashboard"></i><span className="badge badge-pill badge-success float-right">3</span>
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            <li>
                                <a href={no_link} className=" waves-effect">
                                    <i className="mdi mdi-calendar-month"></i>
                                    <span>Calendar</span>
                                </a>
                            </li>
                            <li className="menu-title">Components</li>
                        </ul>

                    </div>

                </div>
            </div>
        );
    }
}