import React from "react";
import PigSelector from "../elements/pigSelector";
import PigSearch from "../elements/pigSearch";
import Utils from "../utils/utils";
import Select from "react-select";
import Toast from "../utils/toast";
import MeatchainService from "../services/meatchain";

export default class CutMeat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: "",
            cut: {value: "", label:"Select a cut"},
            pieces: 0,
            isCutting: false
        }
        this.pigUpdate = this.pigUpdate.bind(this);
    }
    pigUpdate = (value) => {
        this.setState({
           selected: value
        });
    }
    quantityUpdate = (e) => {
        this.setState({
            pieces: e.target.value
        });
    }
    cutUpdate = (e) => {
        this.setState({
           cut: e
        });
    }
    cutMeat = () => {
        this.setState({
           isCutting: true
        });
        let {selected, cut, pieces} = this.state;
        if(selected !== "" && cut.value !== "" && pieces > 0) {
            let meatchain = new MeatchainService();
            meatchain.createMeatCut(selected, cut.value, pieces).then((res) => {
                window.location.reload();
            }).catch((err) => {
               Toast.error(err.response.data);
            });
        } else {
            Toast.error("One or more fields are empty or invalid");
        }
    }
    render() {
        let selected = this.state.selected;
        let text = "Cut meat";
        let disabled = false;
        if(selected === "" || this.state.isCutting) {
            disabled = true;
        }
        if(selected === "") {
            text = "Select a pig to continue...";
        }
        if(this.state.isCutting) {
            text = "Cutting...";
        }
        let {pieces, cut} = this.state;
        return (
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-0 font-size-18">Meat cutting station</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Step 1: Select pig</h4>
                                    <p></p>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <PigSearch parentCallback={this.pigUpdate}/>
                                        </div>
                                        <div className="col-md-6">
                                            <PigSelector parentCallback={this.pigUpdate} slaughterOnly={true}/>
                                        </div>
                                    </div>
                                    <p></p>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <strong>Current selection: {selected}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Step 2: Set cuts and quantity</h4>
                                    <div className="row">
                                        <div className="col-lg-6 form-group">
                                            <label htmlFor="data">Cut</label>
                                            <Select options={Utils.getPorkCuts()} value={cut} onChange={(e) => this.cutUpdate(e)} />
                                        </div>
                                        <div className="col-lg-6 form-group">
                                            <label htmlFor="data">Quantity</label>
                                            <input type="number" className="form-control" id="data" value={pieces} onChange={(e) => this.quantityUpdate(e)} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disabled} onClick={() => this.cutMeat()}>{text}</button>
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