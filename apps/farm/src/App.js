import Footer from "./common/Footer";
import Menu from "./common/Menu";
import Header from "./common/Header";
import Template from "./pages/template";
import {Routes, Route} from "react-router-dom";

export default function App() {
    return (
        <div id="layout-wrapper">
            <Header />
            <Menu />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Template />} />
                </Routes>
                <Footer />
            </div>
        </div>
  );
}

