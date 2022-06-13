import {Routes, Route} from "react-router-dom";
import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import Home from "./pages/Home";
import Tray from "./pages/Tray";

export default class App extends React.Component {
    render() {
        return (
            <div id="app">
                <ToastContainer />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/:id" element={<Tray />} />
                </Routes>
            </div>
        );
    }
}


