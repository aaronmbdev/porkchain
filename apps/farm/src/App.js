import Footer from "./common/Footer";
import Menu from "./common/Menu";
import Header from "./common/Header";
import {Routes, Route} from "react-router-dom";
import Overview from "./pages/overview";
import CageOverview from "./pages/cages_overview";
import React from "react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default class App extends React.Component {

    render() {
        return (
            <div id="layout-wrapper">
                <Header />
                <Menu />
                <div className="main-content">
                    <ToastContainer />
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/cages" element={<CageOverview />} />
                    </Routes>
                    <Footer />
                </div>
            </div>
        );
    }
}
