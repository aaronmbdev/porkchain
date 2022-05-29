import React from "react";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";

export default class CageCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            createValue: "",
            disabled: false,
        }
    }
    updateValue(e) {
        this.setState({
            createValue: e.target.value
        });
    }
    createCage() {
        let value = this.state.createValue;
        if(value !== "") {
            this.setState({
                disabled: true
            });
            let meatchain = new MeatchainService();
            meatchain.createCage(value).then(() => {
                Toast.success("Cage created", "Success");
                this.setState({
                   createValue: "",
                    disabled: false
                });
            }).catch((error) => {
                console.log(error);
                this.setState({
                    createValue: "",
                    disabled: false
                });
            });
        }
    }
    render() {
        let disabled = this.state.disabled;
        let text = "Create Cage";
        if(disabled) text = "Creating Cage...";
        return (
            <div className="card">
                <div className="card-body">
                    <h4 className="mt-0 header-title">Create a cage</h4>
                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <input type="text" placeholder={"Name of the cage"} className="form-control"
                                       id="cageName" required="" onChange={(e) => this.updateValue(e)}/>
                            </div>
                        </div>
                        <button className="btn btn-primary" type="button" onClick={() => this.createCage()} disabled={disabled}>{text}</button>
                </div>
            </div>
        );
    }
}