import React from 'react';
import logo_sm_dark from '../images/logo-sm-dark.png';
import logo_dark from '../images/logo-dark.png';
import logo_sm_light from '../images/logo-sm-light.png';
import logo_light from '../images/logo-light.png';
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
                                    <img src={logo_sm_dark} alt="" height="22"/>
                                </span>
                                <span className="logo-lg">
                                    <img src={logo_dark} alt="" height="20"/>
                                </span>
                            </a>

                            <a href={no_link}  className="logo logo-light">
                                <span className="logo-sm">
                                    <img src={logo_sm_light} alt="" height="22"/>
                                </span>
                                <span className="logo-lg">
                                    <img src={logo_light} alt="" height="20"/>
                                </span>
                            </a>
                        </div>

                    </div>

                    <div className="d-flex">

                        <div className="dropdown d-inline-block">
                            <button type="button" className="btn header-item waves-effect" id="page-header-user-dropdown"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img className="rounded-circle header-profile-user" src={user} alt="Header Avatar"/>
                                <span className="d-none d-sm-inline-block ml-1">Shane</span>
                                <i className="mdi mdi-chevron-down d-none d-sm-inline-block"></i>
                            </button>
                            <div className="dropdown-menu dropdown-menu-right">
                                <a href={no_link}  className="dropdown-item" ><i className="mdi mdi-face-profile font-size-16 align-middle mr-1"></i> Profile</a>
                                <a href={no_link} className="dropdown-item" ><i className="mdi mdi-credit-card-outline font-size-16 align-middle mr-1"></i> Billing</a>
                                <a className="dropdown-item" href={no_link}><i className="mdi mdi-account-settings font-size-16 align-middle mr-1"></i> Settings</a>
                                <a className="dropdown-item" href={no_link}><i className="mdi mdi-lock font-size-16 align-middle mr-1"></i> Lock screen</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href={no_link}><i className="mdi mdi-logout font-size-16 align-middle mr-1"></i> Logout</a>
                            </div>
                        </div>

                    </div>
                </div>
            </header>
        );
    }
}