import React from "react";
import Utils from "../utils/utils";
import Select from "react-select";
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
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
            } else {
                this.setState({
                    pending: false
                })
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
                selector: "meat_id",
                sortable: true,
            },
            {
                name: "Cut",
                selector: "cut",
                sortable: true,
            },
            {
                name: "Pieces",
                selector: "pieces",
                sortable: true,
            },
            {
                name:"Production date",
                selector: "production",
                sortable: true,
            },
            {
                name:"Pig",
                selector: "pig_id",
                sortable: true,
            }
        ];
        const data = this.state.data;
        const tableData = {
            columns, data
        }
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
                                            <DataTableExtensions
                                                {...tableData}
                                            >
                                                <DataTable
                                                    title={"Meat available"}
                                                    noHeader={true}
                                                    defaultSortAsc={false}
                                                    defaultSortFieldId="ID"
                                                    highlightOnHover={true}
                                                    pagination={true}
                                                    progressPending={this.state.pending}
                                                />
                                            </DataTableExtensions>
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