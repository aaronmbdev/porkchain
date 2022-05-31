import React from 'react';

export default class Menu extends React.Component {
    render() {
        const overview = "/";
        const cage_overview = "/cages";

        const feeding = "/cages/feeding";
        const pigs = "/pigs";
        const newPig = "/pigs/new";
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
                                    <i className="mdi mdi-home"></i>
                                    <span>Cages overview</span>
                                </a>
                            </li>
                            <li>
                                <a href={feeding} className=" waves-effect">
                                    <i className="mdi mdi-food-apple"></i>
                                    <span>Register feeding</span>
                                </a>
                            </li>
                            <li className="menu-title">Pig management</li>
                            <li>
                                <a href={pigs} className=" waves-effect">
                                    <i className="mdi mdi-pig"></i>
                                    <span>Pig selector</span>
                                </a>
                            </li>
                            <li>
                                <a href={newPig} className=" waves-effect">
                                    <i className="mdi mdi-file-document-box-plus"></i>
                                    <span>Register new pig</span>
                                </a>
                            </li>
                        </ul>

                    </div>

                </div>
            </div>
        );
    }
}