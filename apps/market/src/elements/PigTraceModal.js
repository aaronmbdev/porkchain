import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Modal} from "react-bootstrap";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";

export default class PigTraceModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            history: [],
            isOpen: false,
        }
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    componentDidMount() {
        let meatchain = new MeatchainService();
        let pig = this.state.id;
        meatchain.readPigHistory(pig, 100, "").then(response => {
            this.setState({
                history: response.data.records.filter(item => item.recordType === "update")
            });
        }).catch(error => {
           Toast.error(error.response.data);
        });
    }

    closeModal() {
        this.setState({
            isOpen: false
        });
    }

    openModal() {
        this.setState({
            isOpen: true
        });
    }

    render() {
        return (
            <div>
                <button
                    className="btn btn-primary btn-sm waves-effect waves-light"
                    type="button" onClick={() => this.openModal()}>See records
                </button>
                <Modal
                    show={this.state.isOpen}
                    onHide={this.closeModal}
                    backdrop="static"
                    keyboard={false}

                >
                    <Modal.Header closeButton>
                        <Modal.Title>Pig traceability</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4 className="card-title">History</h4>
                        <ul className="verti-timeline list-unstyled">
                            {this.state.history.map((item, index) => {
                                let recordType = <span className="badge badge-info">Update record</span>;
                                return (
                                    <li className="event-list" key={index}>
                                        <div>
                                            <p className="text-primary">{item.date}</p>
                                            <h5>{recordType}</h5>
                                            <p className="text-muted">{item.data}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}