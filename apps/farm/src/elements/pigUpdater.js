import React from "react";

export default class PigUpdater extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parentId: props.parentId,
            birthdate: props.birthdate,
            breed: props.breed,
            location: props.location,
            parentPigs: [{ value: props.parentId, label: props.parentId }],
        }
    }
    updateBreed(event) {
        this.setState({
            breed: event.target.value
        });
    }
    updateBirthdate(event) {
        this.setState({
            birthdate: event.target.value
        });
    }
    updateParent(event) {
        this.setState({
            parentId: event.target.value
        });
    }
    render() {
        return (
            <div className="col-6">
                <div className="card">
                    <div className="card-body">
                        <div className="page-title-box d-flex align-items-center justify-content-between">
                            <h4 className="mb-0 font-size-18">Update pig</h4>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group row">
                                    <label htmlFor="example-text-input" className="col-md-2 col-form-label">Breed</label>
                                    <div className="col-md-10">
                                        <input className="form-control" type="text" value={this.state.breed}
                                               id="example-text-input" onChange={(e) => this.updateBreed(e)}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="example-date-input" className="col-md-2 col-form-label">Birthdate</label>
                                    <div className="col-md-10">
                                        <input className="form-control" type="date" value={this.state.birthdate}
                                               id="example-date-input" onChange={(e) => this.updateBirthdate(e)} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="parent" className="col-md-2 col-form-label">Parent Pig</label>
                                    <div className="col-md-10">

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