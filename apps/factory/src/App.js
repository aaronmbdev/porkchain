import Footer from "./common/Footer";
import Menu from "./common/Menu";
import Header from "./common/Header";
import {Routes, Route} from "react-router-dom";
import React from "react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Template from "./pages/template";


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
                    </Routes>
                    <Footer />
                </div>
            </div>
        );
    }
}
