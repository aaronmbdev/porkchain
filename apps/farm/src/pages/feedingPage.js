import React from "react";
import CageSelector from "../elements/cageSelector";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";

export default class FeedingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: "",
            searchVal: "",
            queryStatus: "Not started",
            queryBadge: "alert alert-info",
            isSending: false,
            foodData: ""
        };
        this.updateSelection = this.updateSelection.bind(this);
    }
    updateSelection(value) {
        this.setState({
            selected: value,
        });
    }
    updateSearchVal(e) {
        this.setState({
            searchVal: e.target.value,
        });
    }
    updateFoodData(e) {
        this.setState({
            foodData: e.target.value,
        });
    }
    buildAlert() {
        let { queryStatus, queryBadge, isSending } = this.state;
        if(isSending) {
            return <div className={queryBadge} role="alert">
                {queryStatus}
            </div>
        }
        return <div className={queryBadge} role="alert">
            {queryStatus}
        </div>
    }
    searchCage() {
        let { searchVal } = this.state;
        let meatchain = new MeatchainService();
        meatchain.readCage(searchVal).then((cage) => {
            let name = cage.data.name;
            Toast.success("Cage "+name+" found");
            this.setState({
                selected: searchVal,
            });
        }).catch(() => {
            Toast.error("The provided cage was not found, check the value");
        });
    }

    getAllPigsInCage = async(meatchain, cageId) => {
        this.setState({
            queryStatus: "Querying pigs in the cage...",
        });
        console.log("Querying pigs in the cage...");
        return meatchain.getPigsInCage(cageId, 100, "");
    }

    startProcess = async() => {
        let { selected, foodData } = this.state;
        let meatchain = new MeatchainService();
        this.setState({
            isSending: true,
            queryStatus: "Starting feed process...",
            queryBadge: "alert alert-warning",
        });
        console.log("Starting feed process...");
        let pigsInCage = await this.getAllPigsInCage(meatchain, selected);
        let pigAmount = pigsInCage.data.fetchedRecordsCount;
        if(pigAmount !== 0) {
            this.setState({
                queryStatus: pigAmount + " pigs found: Feeding process started",
            });
            console.log(pigAmount + " pigs found: Feeding process started");
            let records = pigsInCage.data.records;
            let i = 0;
            records.forEach(async (element) => {
               i++;
               await meatchain.feedPig(element.pig_id, foodData).then(res => {
                   console.log(res);
               });
               if(i === pigAmount) {
                   this.setState({
                       queryStatus: "Feeding process finished",
                       queryBadge: "alert alert-success",
                       isSending: false,
                   });
                   console.log("Feeding process finished");
               }
            });
        } else {
            this.setState({
                isSending: false,
                queryStatus: "There are no pigs in the cage",
                queryBadge: "alert alert-info",
            });
        }
    }

    render() {
        let alert = this.buildAlert();
        let submitText = "Submit information";
        let disabled = false;
        let spinner = "";
        if(this.state.selected === "") {
            submitText = "Select a cage first";
            disabled = true;
        }
        if(this.state.isSending) {
            submitText = "Sending...";
            spinner = <span className="spinner-border spinner-border-sm mr-1"
                            role="status" aria-hidden="true"></span>;
            disabled = true;
        }
        return (
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-0 font-size-18">Feed pigs</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="page-title-box d-flex align-items-center justify-content-between">
                                        <h4 className="mb-0 font-size-18">Step 1: Select the cage</h4>
                                        <p>You can either use the dropdown or read the QR code.</p>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="input-group mt-3 mt-sm-0 mr-sm-3">
                                                <div className="input-group-prepend">
                                                    <div className="input-group-text"><i
                                                        className="mdi mdi-qrcode-scan"/></div>
                                                </div>
                                                <input type="text" className="form-control"
                                                       id="inlineFormInputGroupUsername2" placeholder="Read cage id" value={this.state.searchVal}
                                                onChange={(e) => this.updateSearchVal(e)}/>
                                            </div>
                                            <p> </p>
                                            <div className="input-group mt-3 mt-sm-0 mr-sm-3">
                                                <button type="button"
                                                        className="btn btn-primary waves-effect waves-light" onClick={() => this.searchCage()}>Search cage
                                                </button>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <CageSelector parentCallback={this.updateSelection}/>
                                        </div>
                                    </div>
                                    <p> </p>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <p>Current selection: {this.state.selected}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="page-title-box d-flex align-items-center justify-content-between">
                                        <h4 className="mb-0 font-size-18">Step 2: Insert food data</h4>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="input-group mt-3 mt-sm-0 mr-sm-3">
                                                <textarea id="textarea" className="form-control" maxLength="225"
                                                          rows="3"
                                                          placeholder="This textarea has a limit of 225 chars." onChange={(e) => this.updateFoodData(e)}></textarea>
                                            </div>
                                            <p> </p>
                                            <div className="input-group mt-3 mt-sm-0 mr-sm-3">
                                                <button type="button"
                                                        className="btn btn-primary waves-effect waves-light" disabled={disabled}
                                                onClick={() => this.startProcess()}>
                                                    {spinner}
                                                    {submitText}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            {alert}
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