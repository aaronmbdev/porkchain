import React from "react";
import Swal from "sweetalert2";
import Toast from "../utils/toast";
import MeatchainService from "../services/meatchain";

export default class HealthcheckForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            status: props.status,
            vetId: "",
            data: ""
        }
    }

    updateVetId(event) {
        this.setState({vetId: event.target.value});
    }

    updateData(event) {
        this.setState({data: event.target.value});
    }

    submitHealthCheck() {
        let {id, vetId, data} = this.state;
        let meatchain = new MeatchainService();
        Swal.fire({
            title: 'Do you want to submit the health report?',
            text: "You won't be able to revert this",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Submit report',
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
                meatchain.healthCheck(id, vetId, data)
                    .then(ignore => {
                        window.location.reload();
                    })
                    .catch(err => Toast.error(err.toString()));
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        }).catch(err => Toast.error(err.toString()));
    }

    render() {
        let {status} = this.state;
        if(status !== "Alive") {
            return(
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Health check registry</h5>
                        <strong>A Health report cannot be submitted since the pig is not alive</strong>
                    </div>
                </div>
            );
        }
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Health check registry</h5>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group row">
                                <label htmlFor="example-text-input" className="col-md-4 col-form-label">Veterinary ID</label>
                                <div className="col-md-8">
                                    <input className="form-control" type="text" value={this.state.vetId}
                                           id="example-text-input" onChange={(e) => this.updateVetId(e)}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="example-text-input" className="col-md-12 col-form-label">Check information</label>
                                <div className="col-md-12">
                                    <textarea id="textarea" className="form-control" maxLength="225" rows="4"
                                              placeholder="This textarea has a limit of 225 chars." onChange={(e) => this.updateData(e)}></textarea>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-md-12">
                                    <button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => this.submitHealthCheck()}>Submit check
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}