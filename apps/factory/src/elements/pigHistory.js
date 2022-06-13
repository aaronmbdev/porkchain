import React from "react";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";

export default class PigHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPig: this.props.id,
            hasMore: true,
            history: [],
            bookmark: ""
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.id !== this.props.id) {
            this.setState({
                selectedPig: this.props.id,
                hasMore: true,
                history: [],
                bookmark: ""
            });
            this.fetchMoreRecords(this.props.id);
        }
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
    fetchMoreRecords = (selectedPig) => {
        console.log("fetching more records " + selectedPig);
        let {history, bookmark} = this.state;
        if(selectedPig != null) {
            let pageSize = 1000;
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
        if(this.state.history.length === 0) {
            return <div className="text-center">No records found</div>;
        } else {
            return (
                <div>
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
                </div>
            );
        }
    }

}