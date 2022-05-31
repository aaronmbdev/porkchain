import React from "react";
import PigSelector from "./pigSelector";
import Swal from 'sweetalert2'
import CageSelector from "./cageSelector";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";

export default class PigUpdater extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parentId: props.parent,
            birthdate: props.birthdate,
            breed: props.breed,
            location: props.location,
            id: props.id,
        }
        this.updateCage = this.updateCage.bind(this);
        this.updateParent = this.updateParent.bind(this);
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
    updateParent(value) {
        this.setState({
            parentId: value
        });
    }
    updateCage(value) {
        this.setState({
            location: value
        });
    }
    updateInformation() {
        let {breed, birthdate, parentId, location, id} = this.state;
        let meatchain = new MeatchainService();
        Swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
            confirmButtonColor: '#3d8ef8',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Saving...',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showConfirmButton: false,
                    onOpen: () => {
                        Swal.showLoading();
                    }
                });
                meatchain.updatePig(id, parentId, birthdate, breed, location).then(() => {
                    window.location.reload();
                }).catch(err => {
                    Toast.error(err.toString()
                    );
                    Swal.hideLoading();
                });
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        })
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
                                    <PigSelector selected={this.state.parentId} parentCallback={this.updateParent} />
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="parent" className="col-md-2 col-form-label">Location</label>
                                    <CageSelector selected={this.state.location} parentCallback={this.updateCage} />
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => this.updateInformation()}>Update information
                                        </button>
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