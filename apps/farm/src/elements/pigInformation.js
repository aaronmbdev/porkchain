import React from "react";
import pig_image from "../images/elements/pig.png";

export default class PigInformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            birthdate: this.props.birthdate,
            breed: this.props.breed,
            location: this.props.location,
            parent: this.props.parent,
            status: this.props.status,
            id: this.props.id,
        }
    }

    render() {
        let {birthdate, breed, location, parent, status, id} = this.state;
        return (
            <div className="card">
                <div className="card-body">
                    <div className="page-title-box d-flex align-items-center justify-content-between">
                        <h4 className="mb-0 font-size-18">Pigs {id}</h4>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <img className="rounded-circle" alt="200x200"
                                 src={pig_image} data-holder-rendered="true" />
                        </div>
                        <div className="col-md-6">
                            <p>Birthdate: {birthdate}</p>
                            <p>Breed: {breed}</p>
                            <p>Location: {location}</p>
                            <p>Parent: {parent}</p>
                            <p>Status: {status}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}