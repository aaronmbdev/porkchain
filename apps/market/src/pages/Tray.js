import React from "react";
import logo from "../images/logo.png";
import {useParams} from "react-router-dom";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";
import InformationTabs from "../elements/InformationTabs";

class Tray extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.params.id,
            info: null
        }
    }
    goBack() {
        window.location.replace("/")
    }
    componentDidMount() {
        let {id} = this.state;
        let meatchain = new MeatchainService();
        meatchain.readTrayTraceability(id).then(response => {
            this.setState({info: response.data});
        }).catch(error => {
            Toast.error(error.response.data);
        });
    }
    render() {
        let id = this.state.id;
        let info = this.state.info;
        if (info === null) {
            return(<div className="account-pages my-5 pt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center mb-5">
                                <img src={logo} height="128" alt="logo" />
                                <h5 className="font-size-16 text-white-50 mb-4">Supermarket app</h5>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-5">
                            <div className="card">
                                <div className="card-body p-4">
                                    <div className="p-2">
                                        <h5 className="mb-5 text-center">Loading information...</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
        }
        return (
            <div className="account-pages my-5 pt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center mb-5">
                                <img src={logo} height="128" alt="logo" />
                                <h5 className="font-size-16 text-white-50 mb-4">Supermarket app</h5>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-5">
                            <div className="card">
                                <div className="card-body p-4">
                                    <div className="row p-2">
                                        <div className="col-md-3">
                                            <button
                                                className="btn btn-primary btn-block waves-effect waves-light"
                                                type="button" onClick={() => this.goBack()}>Back
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <h5 className="mb-5 text-center">Tray information</h5>
                                        <p>Tray id: {id}</p>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="mt-4">
                                                    <InformationTabs data={this.state.info} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => (
    <Tray {...props} params={useParams()} />
);