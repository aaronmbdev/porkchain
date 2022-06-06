import React from "react";
import Utils from "../utils/utils";
import Select from "react-select";
import DataTable from "react-data-table-component";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";

export default class MeatOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cut: "",
            minAmount: 0,
            data: [],
            pending: true
        }
    }
    componentDidMount() {
        this.getDataForTable();
    }

    updateMinAmount(e) {
        this.setState({
            minAmount: e.target.value,
        });
    }
    updateCut(e) {
        this.setState({
            cut: e.value,
        });
    }

    getDataForTable() {
        let {cut, minAmount} = this.state;
        let meatchain = new MeatchainService();
        meatchain.queryMeat(1000, "", cut, minAmount).then(data => {
            let info = data.data;
            if(info.fetchedRecordsCount !== 0) {
                this.setState({
                    data: info.records,
                    pending: false
                });
            }
        }).catch(err => {
            Toast.error(err.response.data);
        });
    }
    doFilter() {
        this.setState({
           data: []
        });
        this.getDataForTable();
    }

    render() {
        const columns = [
            {
                name: "ID",
                selector: row => row.meat_id,
                sortable: true,
            },
            {
                name: "Cut",
                selector: row => row.cut,
                sortable: true,
            },
            {
                name: "Pieces",
                selector: row => row.pieces,
                sortable: true,
            },
            {
                name:"Production date",
                selector: row => row.production,
                sortable: true,
            },
            {
                name:"Pig",
                selector: row => row.pig_id,
                sortable: true,
            }
        ];
        return (
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-0 font-size-18">Meat overview</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Meat filter</h4>
                                    <p></p>
                                    <div className="row">
                                        <div className="col-lg-6 form-group">
                                            <label htmlFor="data">Cut</label>
                                            <Select options={Utils.getPorkCuts()} onChange={(e) => this.updateCut(e)} />
                                        </div>
                                        <div className="col-lg-6 form-group">
                                            <label htmlFor="data">Min. Amount</label>
                                            <input type="number" className="form-control" id="data" value={this.state.minAmount} onChange={(e) => this.updateMinAmount(e)} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <button type="button"
                                                    className="btn btn-primary waves-effect waves-light" onClick={() => this.doFilter()}>Filter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Results</h4>
                                    <p></p>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <DataTable
                                                title={"Meat available"}
                                                columns={columns}
                                                data={this.state.data}
                                                pagination={true}
                                                progressPending={this.state.pending}
                                            />
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