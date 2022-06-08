import React from "react";
import logo from "../images/logo.png";
import Toast from "../utils/toast";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
        }
    }
    updateId(e) {
        this.setState({id: e.target.value});
    }
    enableCamera() {
        Toast.info("Disabled for demo purposes");
    }
    seeTray() {
        let {id} = this.state;
        if(id !== "") {
            window.location.replace("/" + id);
        }
    }
    render() {
        let text = "See tray information";
        let disabled = false;
        if(this.state.id === "") {
            text = "Enter or scan a tray ID";
            disabled = true;
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
                                    <div className="p-2">
                                        <h5 className="mb-5 text-center">Insert or scan a tray to continue</h5>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="username">Manual input</label>
                                                            <input type="text" className="form-control" id="tray"
                                                                   placeholder="TRAY_XXXXXXXXX" value={this.state.id} onChange={(e) => this.updateId(e)}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="username">Scan a tray</label>
                                                            <div className="mt-2">
                                                                <div className="btn-group btn-group-toggle"
                                                                     data-toggle="buttons">
                                                                    <label className="btn btn-primary active">
                                                                        <input type="checkbox" onClick={() => this.enableCamera()}/> <i
                                                                            className="mdi mdi-camera" /> Open camera
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <button
                                                        className="btn btn-primary btn-block waves-effect waves-light"
                                                        type="button" onClick={() => this.seeTray()} disabled={disabled}>{text}
                                                    </button>
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