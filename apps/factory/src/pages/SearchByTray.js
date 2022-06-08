import React from "react";
import TraySelector from "../elements/traySelector";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import InfiniteScroll from "react-infinite-scroll-component";

export default class SearchByTray extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            tray: null,
            isQuerying: false,
            meats: [],
            additives: [],
            pigs: [],
            history: [],
            hasMore: true,
            bookmark: "",
            selectedPig: null
        }
    }
    updateTray(e) {
        this.setState({
            tray: e
        })
    }
    doFilter() {
        this.resetHistory();
        this.setState({
            isQuerying: true
        });
        let tray = this.state.tray;
        let meatchain = new MeatchainService();
        meatchain.readTrayTraceability(tray).then((response) => {
            this.setState({
                additives: response.data.additives,
                meats: response.data.meats,
                pigs: response.data.pigs,
            })
        }).catch((error) => {
            Toast.error(error.response.data);
        }).finally(() => {
            this.setState({
                isQuerying: false
            });
        });
    }
    resetHistory() {
        this.setState({
            history: [],
            hasMore: true,
            bookmark: ""
        })
    }
    seeHistory(e) {
        this.resetHistory();
        this.setState({
            selectedPig: e
        })
        this.fetchMoreRecords();
    }
    renderRecordType(type) {
        if(type === "update") {
            return <span className="badge badge-info">Update record</span>;
        }
        if(type === "health"){
            return <span className="badge badge-info">Health review</span>;
        }
        if(type === "food") {
            return <span className="badge badge-info">Feeding record</span>;
        }
    }
    additivesData() {
        const columns = [
            {
                name: "ID",
                selector: "additive_id",
                sortable: true,
            },
            {
                name: "Name",
                selector: "name",
                sortable: true,
            },
            {
                name: "Lot",
                selector: "lot_id",
                sortable: true,
            },
            {
                name: "Expiration",
                selector: "expiry_date",
                sortable: true
            },
            {
                name: "Type",
                selector: "additiveType",
                sortable: true
            }
        ];
        const data = this.state.additives;
        return {
            columns,data
        }
    }
    meatData() {
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
                name: "Production Date",
                selector: "production",
                sortable: true
            },
            {
                name: "Pig",
                selector: "pig_id",
                sortable: true
            }
        ];
        const data = this.state.meats;
        return {
            columns,data
        }
    }
    pigData() {
        const columns = [
            {
                name: "ID",
                selector: "pig_id",
                sortable: true,
            },
            {
                name: "Breed",
                selector: "breed",
                sortable: true,
            },
            {
                name: "Birth Date",
                selector: "birthdate",
                sortable: true
            },
            {
                name: "Actions",
                cell: (row, index) => {
                    return <button type="button" key={index} className="btn btn-primary waves-effect waves-light" onClick={() => this.seeHistory(row.pig_id)}>See history</button>;
                },
            },
        ];
        const data = this.state.pigs;
        return {
            columns,data
        }
    }

    fetchMoreRecords = () => {
        let {selectedPig, history, bookmark} = this.state;
        if(selectedPig != null) {
            let pageSize = 5;
            let meatchain = new MeatchainService();
            meatchain.readPigHistory(selectedPig, pageSize, bookmark).then(processed => {
                if(processed.data.fetchedRecordsCount !== 0 && processed.data.fetchedRecordsCount !== pageSize) {
                    this.setState({
                        hasMore: false,
                        history: history.concat(processed.data.records),
                    });
                } else if(processed.data.fetchedRecordsCount === 0) {
                    this.setState({
                        hasMore: false,
                        history: []
                    });
                } else {
                    this.setState({
                        hasMore: true,
                        history: history.concat(processed.data.records),
                        bookmark: processed.data.bookmark
                    });
                }
            }).catch(err => {
                Toast.error(err.toString());
            });
        }
    }
    render() {
        let additiveData = this.additivesData();
        let meatData = this.meatData();
        let pigData = this.pigData();
        let text = "Filter";
        let disabled = false;
        if(this.state.isQuerying) {
            disabled = true;
            text = "Querying...";
        }
        return (
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-0 font-size-18">Trace assets by tray</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h4 className="card-title">Select a tray</h4>
                                            <p>Enter the tray id or select a tray from the dropdown in order to query all the information related to it.</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <TraySelector parentCallback={(e) => this.updateTray(e)}/>
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
                        <div className="col-6">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Additives</h4>
                                    <DataTableExtensions
                                        {...additiveData}
                                    >
                                        <DataTable
                                            noHeader={true}
                                            defaultSortAsc={false}
                                            defaultSortFieldId="id"
                                            highlightOnHover={true}
                                            pagination={true}
                                        />
                                    </DataTableExtensions>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Meat</h4>
                                    <DataTableExtensions
                                        {...meatData}
                                    >
                                        <DataTable
                                            noHeader={true}
                                            defaultSortAsc={false}
                                            defaultSortFieldId="id"
                                            highlightOnHover={true}
                                            pagination={true}
                                        />
                                    </DataTableExtensions>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Pigs</h4>
                                    <DataTableExtensions
                                        {...pigData}
                                    >
                                        <DataTable
                                            noHeader={true}
                                            defaultSortAsc={false}
                                            defaultSortFieldId="id"
                                            highlightOnHover={true}
                                            pagination={true}
                                        />
                                    </DataTableExtensions>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">History</h4>
                                    <ul className="verti-timeline list-unstyled">
                                        <InfiniteScroll
                                            next={this.fetchMoreRecords}
                                            hasMore={this.state.hasMore}
                                            loader={<h4>Loading...</h4>}
                                            dataLength={this.state.history.length}
                                        >
                                            {this.state.history.map((item, index) => {
                                                let recordType = this.renderRecordType(item.recordType);
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
                                        </InfiniteScroll>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}