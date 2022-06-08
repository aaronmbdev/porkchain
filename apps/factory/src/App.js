import Footer from "./common/Footer";
import Menu from "./common/Menu";
import Header from "./common/Header";
import {Routes, Route} from "react-router-dom";
import React from "react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Template from "./pages/template";
import SauceOverview from "./pages/SauceOverview";
import SeasoningOverview from "./pages/SeasoningOverview";
import CutMeat from "./pages/CutMeat";
import MeatOverview from "./pages/MeatOverview";
import PackMeat from "./pages/PackMeat";
import TrayOverview from "./pages/TrayOverview";


export default class App extends React.Component {

    render() {
        return (
            <div id="layout-wrapper">
                <Header />
                <Menu />
                <div className="main-content" style={{overflow: "visible"}}>
                    <ToastContainer />
                    <Routes>
                        <Route path="/" element={<Template />} />
                        <Route path="/sauces" element={<SauceOverview />} />
                        <Route path="/seasoning" element={<SeasoningOverview />} />

                        <Route path="/meat/cut" element={<CutMeat />} />
                        <Route path={"/meat"} element={<MeatOverview />} />

                        <Route path="/tray/create" element={<PackMeat />} />
                        <Route path="/tray" element={<TrayOverview />} />
                    </Routes>
                    <Footer />
                </div>
            </div>
        );
    }
}
