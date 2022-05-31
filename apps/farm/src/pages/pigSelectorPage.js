import React from "react";
import PigSelector from "../elements/pigSelector";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";
import * as PropTypes from "prop-types";

function Navigate(props) {
    return null;
}

Navigate.propTypes = {
    replace: PropTypes.bool,
    to: PropTypes.string
};
export default class PigSelectorPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: "",
            searchVal: "",
        };
        this.updateSelection = this.updateSelection.bind(this);
    }
    updateSearchVal(e) {
        this.setState({
            searchVal: e.target.value,
        });
    }
    updateSelection(value) {
        this.setState({
            selected: value
        });
    }
    searchPig() {
        let {searchVal} = this.state;
        let meatchain = new MeatchainService();
        if(searchVal !== "") {
            meatchain.readPig(searchVal).then((response) => {
                this.setState({
                    selected: searchVal
                });
                Toast.success("Pig found");
            }).catch(err => {
                Toast.error("Pig not found, check the value");
            });
        }
    }

    navigate() {
        let {selected} = this.state;
        if(selected !== "") {
            let url = "/pigs/" + selected;
            window.location.replace(url);
        } else {
            Toast.error("Please select a pig");
        }
    }

    render() {
        let text = "Access pig profile";
        let disabled = false;
        if(this.state.selected === "") {
            text = "Select a pig first";
            disabled= true;
        }
        return (
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-0 font-size-18">Pig selector</h4>

                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="page-title-box d-flex align-items-center justify-content-between">
                                        <h4 className="mb-0 font-size-18">Select a pig</h4>
                                        <p>You can either use the dropdown or read the QR code.</p>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="input-group mt-3 mt-sm-0 mr-sm-3">
                                                <div className="input-group-prepend">
                                                    <div className="input-group-text"><i
                                                        className="mdi mdi-qrcode-scan"/></div>
                                                </div>
                                                <input type="text" className="form-control"
                                                       id="inlineFormInputGroupUsername2" placeholder="Read pig id" value={this.state.searchVal}
                                                       onChange={(e) => this.updateSearchVal(e)}/>
                                            </div>
                                            <p> </p>
                                            <div className="input-group mt-3 mt-sm-0 mr-sm-3">
                                                <button type="button"
                                                        className="btn btn-primary waves-effect waves-light" onClick={() => this.searchPig()}>Search pig
                                                </button>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <PigSelector parentCallback={this.updateSelection}/>
                                        </div>
                                    </div>
                                    <p> </p>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <p>Current selection: {this.state.selected}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="page-title-box d-flex align-items-center justify-content-between">
                                        <h4 className="mb-0 font-size-18">Access pig profile</h4>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="input-group mt-3 mt-sm-0 mr-sm-3">
                                                <button type="button"
                                                        className="btn btn-success waves-effect waves-light" disabled={disabled} onClick={() => this.navigate()}>{text}
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
        );
    }
}