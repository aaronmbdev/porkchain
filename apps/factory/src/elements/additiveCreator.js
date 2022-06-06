import React from "react";
import Toast from "../utils/toast";
import MeatchainService from "../services/meatchain";

export default class AdditiveCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            lot: "",
            expiry: "",
            isCreating: false,
            type: this.props.type || "seasoning",
        }
    }

    updateName = (e) => {
        this.setState({
            name: e.target.value,
        })
    }

    updateLot = (e) => {
        this.setState({
           lot: e.target.value
        });
    }

    updateExpiry = (e) => {
        this.setState({
            expiry: e.target.value
        });
    }

    today = () => {
        let today = new Date();
        return today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    }

    submit = () => {
        let {name, expiry, lot, type} = this.state;
        if(name === "" || expiry === "" || lot === "") {
            Toast.error("All fields must have a valid value.");
            return;
        }
        let date = Date.parse(expiry);
        let today = new Date();
        if(date <= today) {
            Toast.error("The sauce seems to be already expired, review the date");
            return;
        }
        let meatchain = new MeatchainService();
        this.setState({isCreating: true});
        meatchain.createAdditive(name, lot, expiry, type).then(() => {
            window.location.reload();
        }).catch(error => {
            this.setState({isCreating: false});
            Toast.error(error.response.data);
        });
    }

    render() {
        let {type} = this.state;
        let disabled = false;
        let text = "Create "+type;
        if(this.state.isCreating) {
            disabled = true;
            text = "Creating "+type+"...";
        }
        let today = this.today();
        let {name, expiry, lot} = this.state;
        return (
            <div className="card">
                <div className="card-body">
                    <h4 className="header-title">Create {type}</h4>
                    <p></p>
                    <div className="row">
                        <div className="col-lg-4 form-group">
                            <label htmlFor="data">Name</label>
                            <input type="text" className="form-control" id="data" value={name} onChange={(e) => this.updateName(e)}/>
                        </div>
                        <div className="col-lg-4 form-group">
                            <label htmlFor="data">Lot ID</label>
                            <input type="text" className="form-control" id="data" placeholder="ES1234ABC" value={lot} onChange={(e) => this.updateLot(e)}/>
                        </div>
                        <div className="col-lg-4 form-group">
                            <label htmlFor="data">Expiry date</label>
                            <input className="form-control" type="date" min={today} value={expiry} onChange={(e) => this.updateExpiry(e)}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 form-group">
                            <button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => this.submit()} disabled={disabled}>{text}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}