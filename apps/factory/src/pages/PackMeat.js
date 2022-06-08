import React from "react";
import AdditiveSelector from "../elements/additiveSelector";
import MeatSelector from "../elements/meatSelector";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";

export default class PackMeat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sauces: [],
            seasoning: [],
            meats: [],
            isCreating: false
        }
        this.updateSauce = this.updateSauce.bind(this);
        this.updateSeasoning = this.updateSeasoning.bind(this);
    }
    updateSauce(e) {
        this.setState({
            sauces: e.map(sauce => sauce.value)
        });
    }
    updateSeasoning(e) {
        this.setState({
           seasoning: e.map(seasoning => seasoning.value)
        });
    }
    meatSelector(e) {
        this.setState({
           meats: e.map(meat => meat.value)
        });
    }
    createTray() {
        let {sauces, seasoning, meats} = this.state;
        this.setState({isCreating: true});
        if(meats.length !== 0){
            let meatchain = new MeatchainService();
            let additives = sauces;
            additives = additives.concat(seasoning);
            meatchain.createTray(meats,additives).then((response) => {
                window.location.reload();
            }).catch(err => {
                Toast.error(err.response.data);
            });
        } else {
            Toast.error("You must select at least one meat");
        }
    }
    render() {
        let text = "Create Tray";
        let disabled = false;
        if(this.state.isCreating) {
            text = "Creating Tray...";
            disabled = true;
        }
        return (
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-0 font-size-18">Meat packing station</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Create a new tray</h4>
                                    <p></p>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="col-lg-12 form-group">
                                                <label htmlFor="data">Meat selection</label>

                                            </div>
                                            <div className="col-lg-12 form-group">
                                                <label htmlFor="data">Sauce selection</label>
                                                <AdditiveSelector multiple={true} type={"sauce"} parentCallback={(e) => this.updateSauce(e)}/>
                                            </div>
                                            <div className="col-lg-12 form-group">
                                                <label htmlFor="data">Seasoning selection</label>
                                                <AdditiveSelector multiple={true} type={"seasoning"} parentCallback={(e) => this.updateSeasoning(e)}/>
                                            </div>
                                            <div className="col-lg-12 form-group">
                                                <label htmlFor="data">Meats selection</label>
                                                <MeatSelector  parentCallback={(e) => this.meatSelector(e)} minAmount={1}/>
                                            </div>
                                            <div className="col-lg-12 form-group">
                                                <button className="btn btn-primary" onClick={() => this.createTray()} disabled={disabled}>{text}</button>
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