import Footer from "./common/Footer";
import Menu from "./common/Menu";
import Header from "./common/Header";
import {Routes, Route} from "react-router-dom";
import Overview from "./pages/overview";
import CageOverview from "./pages/cages_overview";
import React from "react";
import {isLoggedIn} from "./services/localStorageService";

export default class App extends React.Component {

    async componentDidMount() {
        if(!isLoggedIn()) {
            /*let connection = new MeatchainService();
            await connection.createMeatchainConnection();
            let contract = await connection.getContract();
            this.setState({
                contract: contract
            });*/
        }
    }

    render() {
        return (
            <div id="layout-wrapper">
                <Header />
                <Menu />
                <div className="main-content">
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
