import React from "react";
import MeatchainService from "../services/meatchain";
import Swal from "sweetalert2";
import Toast from "../utils/toast";

export default class FeedPigForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            status: props.status,
            data: "",
        }
    }
    updateData(e) {
        this.setState({
            data: e.target.value
        });
    }

    submitData() {
        let {id, data } = this.state;
        let meatchain = new MeatchainService();
        Swal.fire({
            title: 'Do you want to submit the feeding report?',
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
                meatchain.feedPig(id, data).then(ignore => {
                    window.location.reload();
                }).catch(err => Toast.error(err.toString()));
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }

    render() {
        let {status} = this.state;
        if(status !== "Alive") {
            return (
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Feed pig</h5>
                        <strong>Cannot feed this pig because is not alive.</strong>
                    </div>
                </div>
            );
        }
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Feed pig</h5>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="data">Data</label>
                                <input type="text" className="form-control" id="data" placeholder="Food information" onChange={(e) => this.updateData(e)}/>
                            </div>
                            <div className="form-group row">
                                <div className="col-md-12">
                                    <button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => this.submitData()}>Submit feeding record
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