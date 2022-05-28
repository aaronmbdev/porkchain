import React from 'react';

export default class Menu extends React.Component {
    render() {
        const no_link = "#";
        const overview = "/";
        const cage_overview = "/cages";
        return (
            <div className="vertical-menu">

                <div className="h-100">

                    <div id="sidebar-menu">
                        <ul className="metismenu list-unstyled" id="side-menu">
                            <li className="menu-title">Menu</li>
                            <li>
                                <a href={overview} className="waves-effect">
                                    <span>Farm overview</span>
                                </a>
                            </li>
                            <li className="menu-title">Cage Management</li>
                            <li>
                                <a href={cage_overview} className=" waves-effect">
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