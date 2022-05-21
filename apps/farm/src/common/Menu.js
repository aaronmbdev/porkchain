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
                                    <span>Farm overview</span>
                                </a>
                            </li>
                            <li className="menu-title">Cage Management</li>
                            <li>
                                <a href={no_link} className=" waves-effect">
                                    <i className="mdi mdi-calendar-month"></i>
                                    <span>Cages overview</span>
                                </a>
                            </li>
                            <li>
                                <a href={no_link} className=" waves-effect">
                                    <i className="mdi mdi-calendar-month"></i>
                                    <span>Register feeding</span>
                                </a>
                            </li>
                            <li className="menu-title">Pig management</li>
                            <li>
                                <a href={no_link} className=" waves-effect">
                                    <i className="mdi mdi-calendar-month"></i>
                                    <span>Pig selector</span>
                                </a>
                            </li>
                            <li>
                                <a href={no_link} className=" waves-effect">
                                    <i className="mdi mdi-calendar-month"></i>
                                    <span>Register new pig</span>
                                </a>
                            </li>
                            <li>
                                <a href={no_link} className=" waves-effect">
                                    <i className="mdi mdi-calendar-month"></i>
                                    <span>Register born piglets</span>
                                </a>
                            </li>
                        </ul>

                    </div>

                </div>
            </div>
        );
    }
}