import React from 'react';
import AdditiveCreator from "../elements/additiveCreator";
import AdditiveProfile from "../elements/additiveProfile";
import AdditiveSelector from "../elements/additiveSelector";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";

export default class SauceOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: {
                name: "",
                lotId: "",
                expiry: ""
            }
        }
        this.updateSelection = this.updateSelection.bind(this);
    }
    updateSelection = (value) => {
        let meatchain = new MeatchainService();
        meatchain.readAdditive(value).then(response => {
            let info = response.data;
            this.setState({
                selected: {
                    name: info.name,
                    lotId: info.lot_id,
                    expiry: info.expiry_date
                }
            });
        }).catch(err => {
            Toast.error(err.response.data);
        });
    }
    render() {
        let { selected } = this.state;
        return (
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-0 font-size-18">Sauce overview</h4>

                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <AdditiveCreator type={"sauce"} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="header-title">Query existing sauces</h4>
                                    <p></p>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <AdditiveSelector parentCallback={this.updateSelection} type={"sauce"}/>
                                        </div>
                                        <div className="col-md-6">
                                            <AdditiveProfile selected={selected} type={"sauce"}/>
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