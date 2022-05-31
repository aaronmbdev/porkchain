import React from "react";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";
import Swal from "sweetalert2";

export default class PigSlauther extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            status: props.status
        }
    }

    killPig() {
        let {id} = this.state;
        let meatchain = new MeatchainService();
        Swal.fire({
            title: "You're about to slaughter the pig with id " + id + ". This action cannot be undone",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Proceed',
            denyButtonText: `Abort request`,
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
                meatchain.killPig(id).then(() => {
                    window.location.reload();
                }).catch(err => {
                    Toast.error(err.toString());
                });
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }

    render() {
        let {status} = this.state;
        let text = <strong>The selected pig cannot be killed since it's already dead.</strong>
        let button = "";
        if(status === "Alive") {
            text = "";
            button = <button type="button" className="btn btn-danger waves-effect waves-light" onClick={() => this.killPig()}>Slaughter pig</button>;
        }
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Pig Slaughter</h5>
                    <div className="col-md-10">
                        <p className="card-text">
                            {text}
                        </p>
                        {button}
                    </div>
                </div>
            </div>
        );
    }
}