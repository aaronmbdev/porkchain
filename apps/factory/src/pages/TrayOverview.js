import React from "react";
import DataTable from "react-data-table-component";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";
import image from "../images/elements/package.png";

export default class TrayOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            updateRequest: true,
            pending: true,
            selected: null,
            id: "Loading...",
            meat: "",
            sauces: "Loading...",
            seasoning: "Loading...",
        }
        this.seeTray = this.seeTray.bind(this);
    }
    getDataForTable() {
        if(this.state.updateRequest) {
            let meatchain = new MeatchainService();
            meatchain.getTrays().then(response => {
                let info = response.data;
                if(info.fetchedRecordsCount !== 0) {
                    this.setState({
                        data: info.records,
                        pending: false,
                    });
                } else {
                    this.setState({
                        data: [],
                        pending: false,
                    });
                }
            }).catch(err => {
                Toast.error(err.response.data);
            });
            this.setState({updateRequest: false});
        }
    }
    triggerUpdate() {
        this.setState({updateRequest: true, pending: true});
    }
    seeTray(row) {
        let meatchain = new MeatchainService();
        this.setState({
           id: row.tray_id,
            meat: "",
            sauces: "",
            seasoning: ""
        });
        row.meats.forEach((meat, index) => {
            let last = row.meats.length - 1;
            let isLast = index === last;
           meatchain.readMeat(meat).then(res => {
               let data = res.data;
               let message = data.pieces + " pieces of " + data.cut;
                if(!isLast) message = message + ", ";
               this.setState({
                  meat: this.state.meat + " " + message
               });
           })
        });

        row.additives.forEach((add,index) => {
            let last = row.additives.length - 1;
            let isLast = index === last;
            meatchain.readAdditive(add).then(res => {
                let data = res.data;
                if(data.additiveType === "seasoning") {
                    this.setState({
                        seasoning: this.state.seasoning + " " + data.name + " "
                    });
                } else {
                    this.setState({
                        sauces: this.state.sauces + " " + data.name + " "
                    });
                }
            });
        })
    }
    render() {
        this.getDataForTable();
        let {id, meat, sauces, seasoning, loadedFor} = this.state;
        const columns = [
            {
                name: "ID",
                selector: row => row.tray_id,
                sortable: true,
            },
            {
                name: "Actions",
                cell: (row, index) => {
                    return <button type="button" key={index} className="btn btn-primary waves-effect waves-light" onClick={() => this.seeTray(row)}>See tray info</button>;
                },
            },
        ];
        return (
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-0 font-size-18">Tray overview</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <button type="button"
                                                    className="btn btn-primary waves-effect waves-light" onClick={() => this.triggerUpdate()}>Reload
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <DataTable
                                                title={"Trays available"}
                                                columns={columns}
                                                data={this.state.data}
                                                pagination={true}
                                                progressPending={this.state.pending}
                                            />
                                        </div>
                                        <div className="col-lg-6">
                                            <center>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <img src={image} alt="Meat tray" />
                                                        <p></p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <p>Tray id: {id}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <p>Meat: {meat}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <p>Sauces: {sauces}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <p>Seasoning: {seasoning}</p>
                                                    </div>
                                                </div>
                                            </center>
                                        </div>
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