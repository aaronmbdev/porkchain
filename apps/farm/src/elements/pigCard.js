import React from "react";
import pigImage from "../images/elements/pig.png";

export default class PigCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            breed: this.props.breed,
            birthDate: this.props.birthdate,
            status: this.props.status,
        }
    }
    render() {
        const { id, birthDate, breed } = this.state;
        return (
            <div className="col-md-6 col-xl-3">
                <div className="card">
                    <img className="card-img-top img-fluid" src={pigImage} alt={"A pig"}/>
                    <div className="card-body">
                        <div className={"row"}>
                            <div className={"col-md-12"}>
                                <h4 className="card-title">{id}</h4>
                                <p>Birthdate: {birthDate}</p>
                                <p>Breed: {breed}</p>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"col-md-6"}>
                                <button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => {
                                    window.location.href = "/pigs/" + id;
                                }}>See more</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}