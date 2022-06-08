import React from "react";
import Icon from "@mdi/react";
import {mdiFoodDrumstick} from "@mdi/js";
import AdditiveGenerator from "./AdditiveGenerator";
import MeatGenerator from "./MeatGenerator";
import PigGenerator from "./PigGenerator";

MeatGenerator.propTypes = {};
export default class InformationTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        }
    }
    render() {
        return (
            <div className="row">
                <div className="col-sm-3">
                    <div className="nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
                        <a className="nav-link mb-2 active" id="v-pills-left-home-tab" data-toggle="pill"
                           href="#v-pills-left-home" role="tab" aria-controls="v-pills-left-home"
                           aria-selected="true">
                            <i className="mdi mdi-food-variant"></i> Additives
                        </a>
                        <a className="nav-link mb-2" id="v-pills-left-profile-tab" data-toggle="pill"
                           href="#v-pills-left-profile" role="tab" aria-controls="v-pills-left-profile"
                           aria-selected="false">
                            <Icon path={mdiFoodDrumstick} size={0.7} style={{minWidth: "1.75rem"}} />Meat cuts
                        </a>
                        <a className="nav-link mb-2" id="v-pills-left-messages-tab" data-toggle="pill"
                           href="#v-pills-left-messages" role="tab" aria-controls="v-pills-left-messages"
                           aria-selected="false">
                            <i className="mdi mdi-pig"></i> Pigs
                        </a>
                    </div>
                </div>
                <div className="col-sm-9">
                    <div className="tab-content mt-4 mt-sm-0">
                        <div className="tab-pane fade active show" id="v-pills-left-home" role="tabpanel"
                             aria-labelledby="v-pills-left-home-tab">
                            <AdditiveGenerator additive={this.state.data.additives}/>
                        </div>
                        <div className="tab-pane fade" id="v-pills-left-profile" role="tabpanel"
                             aria-labelledby="v-pills-left-profile-tab">
                            <MeatGenerator meat={this.state.data.meats}/>
                        </div>
                        <div className="tab-pane fade" id="v-pills-left-messages" role="tabpanel"
                             aria-labelledby="v-pills-left-messages-tab">
                            <PigGenerator pig={this.state.data.pigs}/>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}