import React from "react";
import AdditiveSelector from "../elements/additiveSelector";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

export default class SearchByAdditive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sauces: [],
            seasoning: [],
            data: [],
            queryMode: "and",
            isQuerying: false
        }
    }

    updateSeasoning(e) {
        this.setState({
            seasoning: e.map(seasoning => seasoning.value)
        });
    }
    updateSauce(e) {
        this.setState({
            sauces: e.map(sauce => sauce.value)
        });
    }
    updateMode(e) {
        this.setState({
            queryMode: e
        })
    }
    doFilter() {
        this.setState({isQuerying: true});
        let {seasoning, sauces, queryMode} = this.state;
        seasoning = seasoning.concat(sauces);
        let meatchain = new MeatchainService();
        meatchain.readTraysByAdditive(seasoning, queryMode).then((response) => {
            if(response.data.fetchedRecordsCount !== 0) {
                this.setState({
                    data: response.data.records
                });
            } else {
                this.setState({
                    data: []
                })
                Toast.info("No records were found");
            }
        }).catch((err) => {
            Toast.error(err.response.data);
        }).finally(() => {
            this.setState({isQuerying: false});
        })
    }
    render() {
        const columns = [
            {
                name: "ID",
                selector: "tray_id",
                sortable: true,
            },
        ];
        const data = this.state.data;
        const tableData = {
            columns, data
        }
        let disabled = false;
        let text = "Filter";
        if(this.state.isQuerying) {
            disabled = true;
            text = "Processing request";
        }
        return (
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-0 font-size-18">Trace assets by additive</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h4 className="card-title">Select the additive</h4>
                                            <p>Given an additive id, we can trace which trays contain that additive.</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <label htmlFor="data">Seasoning selection</label>
                                            <AdditiveSelector type={"seasoning"} multiple={true} parentCallback={(e) => this.updateSeasoning(e)}/>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="data">Sauce selection</label>
                                            <AdditiveSelector  type={"sauce"} multiple={true} parentCallback={(e) => this.updateSauce(e)}/>
                                        </div>
                                        <div className="col-md-4">
                                            <h5 className="font-size-14 mb-3">Query mode</h5>
                                            <p>Select if you want to match any of the additives or all of them</p>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="inlineRadios"
                                                       id="inlineRadios1" value="all" onChange={() => this.updateMode("all")}/>
                                                    <label className="form-check-label" htmlFor="inlineRadios1">
                                                        AND
                                                    </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="inlineRadios"
                                                       id="inlineRadios2" value="or" onChange={() => this.updateMode("or")}/>
                                                    <label className="form-check-label" htmlFor="inlineRadios2">
                                                        OR
                                                    </label>
                                            </div>
                                        </div>
                                    </div>
                                    <p></p>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <button className="btn btn-primary" onClick={() => this.doFilter()} disabled={disabled}>{text}</button>
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
                                    <DataTableExtensions
                                        {...tableData}
                                    >
                                    <DataTable
                                        noHeader={true}
                                        defaultSortAsc={false}
                                        defaultSortFieldId="id"
                                        highlightOnHover={true}
                                        title={"Trays found"}
                                        pagination={true}
                                    />
                                    </DataTableExtensions>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}