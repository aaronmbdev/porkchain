import React from "react";
import MeatSelector from "../elements/meatSelector";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";

export default class SearchByMeat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meats: [],
            data: []
        }
    }
    updateMeat(e) {
        this.setState({
            meats: e.map(meat => meat.value)
        })
    }
    doFilter() {
        let {meats} = this.state;
        let meatchain = new MeatchainService();
        meatchain.readTraysByMeat(meats).then((response) => {
            if(response.data.fetchedRecordsCount !== 0) {
                this.setState({
                    data: response.data.records
                })
            } else {
                this.setState({
                    data: []
                });
                Toast.info("No records were found");
            }
        }).catch(err => {
            Toast.error(err.response.data);
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
        return (
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-0 font-size-18">Trace assets by meat</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title">Select the meat cuts</h4>
                                    <p>Select the cuts that you want to query, the system will search all the trays that contains any of the selected cuts.</p>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <MeatSelector parentCallback={(e) => this.updateMeat(e)} />
                                        </div>
                                    </div>
                                    <p>
                                    </p>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <button className="btn btn-primary" onClick={() => this.doFilter()}>Filter</button>
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