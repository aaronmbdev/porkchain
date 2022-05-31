import React from 'react';
import logo from "../images/logo.png";
import user from '../images/users/avatar-1.jpg';

export default class Header extends React.Component {
    render() {
        const no_link = "#";
        return (
            <header id="page-topbar">
                <div className="navbar-header">
                    <div className="d-flex">
                        <div className="navbar-brand-box">
                            <a href={no_link} className="logo logo-dark">
                                <span className="logo-sm">
                                    <img src={logo} alt="" height="50"/>
                                </span>
                                <span className="logo-lg">
                                    <img src={logo} alt="" height="50"/>
                                </span>
                            </a>

                            <a href={no_link}  className="logo logo-light">
                                <span className="logo-sm">
                                    <img src={logo} alt="" height="50"/>
                                </span>
                                <span className="logo-lg">
                                    <img src={logo} alt="" height="50"/>
                                </span>
                            </a>
                        </div>

                    </div>

                    <div className="d-flex">

                        <div className="dropdown d-inline-block">
                            <button type="button" className="btn header-item waves-effect" id="page-header-user-dropdown"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img className="rounded-circle header-profile-user" src={user} alt="Header Avatar"/>
                                <span className="d-none d-sm-inline-block ml-1">User</span>
                                <i className="mdi mdi-chevron-down d-none d-sm-inline-block"></i>
                            </button>
                        </div>

                    </div>
                </div>
            </header>
        );
    }
}