import Footer from "./common/Footer";
import Menu from "./common/Menu";
import Header from "./common/Header";
import {Routes, Route} from "react-router-dom";
import Overview from "./pages/overview";
import CageOverview from "./pages/cages_overview";
import React from "react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PigsInCage from "./pages/pigsInCage";
import PigProfile from "./pages/pigProfile";

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
                        <Route path="/cages/:id" element={<PigsInCage />} />
                        <Route path="/pigs/:id" element={<PigProfile />} />
                    </Routes>
                    <Footer />
                </div>
            </div>
        );
    }
}
