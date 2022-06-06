import React from 'react';
import Icon from '@mdi/react'
import { mdiFoodDrumstick } from '@mdi/js';

export default class Menu extends React.Component {
    render() {
        return (
            <div className="vertical-menu">

                <div className="h-100">

                    <div id="sidebar-menu">
                        <ul className="metismenu list-unstyled" id="side-menu">
                            <li className="menu-title">Menu</li>
                            <li>
                                <a href={"/"} className="waves-effect">
                                    <span>Factory overview</span>
                                </a>
                            </li>
                            <li className="menu-title">Additive Management</li>
                            <li>
                                <a href={"/sauces"} className=" waves-effect">
                                    <i className="mdi mdi-soy-sauce"></i>
                                    <span>Sauce overview</span>
                                </a>
                            </li>
                            <li>
                                <a href={"/seasoning"} className=" waves-effect">
                                    <i className="mdi mdi-food-variant"></i>
                                    <span>Seasoning overview</span>
                                </a>
                            </li>
                            <li className="menu-title">Meat cutting station</li>
                            <li>
                                <a href={"/meat"} className=" waves-effect">
                                    <Icon path={mdiFoodDrumstick} size={0.7} style={{minWidth: "1.75rem"}} />
                                    <span>Meat overview</span>
                                </a>
                            </li>
                            <li>
                                <a href={"/meat/cut"} className=" waves-effect">
                                    <i className="mdi mdi-knife"></i>
                                    <span>Cut meat</span>
                                </a>
                            </li>
                            <li className="menu-title">Meat packing station</li>
                            <li>
                                <a href={"/tray"} className=" waves-effect">
                                    <i className="mdi mdi-storefront"></i>
                                    <span>Tray overview</span>
                                </a>
                            </li>
                            <li>
                                <a href={"/tray/create"} className=" waves-effect">
                                    <i className="mdi mdi-package-variant"></i>
                                    <span>Pack meat</span>
                                </a>
                            </li>
                            <li className="menu-title">Reverse Tracing</li>
                            <li>
                                <a href={"#"} className=" waves-effect">
                                    <i className="mdi mdi-card-search-outline"></i>
                                    <span>Search by Additive</span>
                                </a>
                            </li>
                            <li>
                                <a href={"#"} className=" waves-effect">
                                    <i className="mdi mdi-card-search-outline"></i>
                                    <span>Search by Tray</span>
                                </a>
                            </li>
                            <li>
                                <a href={"#"} className=" waves-effect">
                                    <i className="mdi mdi-card-search-outline"></i>
                                    <span>Search by Meat</span>
                                </a>
                            </li>
                            <li>
                                <a href={"#"} className=" waves-effect">
                                    <i className="mdi mdi-card-search-outline"></i>
                                    <span>Search by Pig</span>
                                </a>
                            </li>

                        </ul>

                    </div>

                </div>
            </div>
        );
    }
}