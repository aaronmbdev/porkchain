import React from "react";
import gravy from "../images/elements/gravy.png";
import seasoning from "../images/elements/seasoning.png";

export default class AdditiveProfile extends React.Component {
    render() {
        let {name, lotId, expiry} = this.props.selected;
        let type = this.props.type;
        let image = gravy;
        if(type === "seasoning") image = seasoning;
        return (
                <div>
                    <img src={image} alt={"Gravy"} style={{
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: "64"
                    }}/>
                    <div className="col-lg-12 form-group">
                        <label htmlFor="data">Name</label>
                        <input type="text" className="form-control" id="data" value={name} disabled={true}/>
                    </div>
                    <div className="col-lg-12 form-group">
                        <label htmlFor="data">Lot ID</label>
                        <input type="text" className="form-control" id="data" value={lotId} disabled={true}/>
                    </div>
                    <div className="col-lg-12 form-group">
                        <label htmlFor="data">Expiry</label>
                        <input type="text" className="form-control" id="data" value={expiry} disabled={true}/>
                    </div>
                </div>
        );
    }
}