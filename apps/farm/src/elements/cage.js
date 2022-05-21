import React from "react";
import cageImage from "../images/elements/cages.png";


export default class Cage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
        }
        // Todo: Get cage information from the blockchain using the id
    }
    render() {
        return (
            <div className="col-md-6 col-xl-3">
                <div className="card">
                    <img className="card-img-top img-fluid" src={cageImage} alt={"A cage"}/>
                    <div className="card-body">
                        <h4 className="card-title font-size-16 mt-0">{this.state.name}</h4>
                        <p className="card-text">{this.state.id}</p>
                    </div>
                </div>
            </div>
        );
    }
}