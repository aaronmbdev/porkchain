import React from "react";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";
import Utils from "../utils/utils";
import InfiniteScroll from "react-infinite-scroll-component";

export default class PigRecords extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            items: [],
            hasMore: true,
            bookmark: ""
        }
    }

    fetchMoreRecords = () => {
        let {id, items, bookmark} = this.state;
        let pageSize = 5;
        let meatchain = new MeatchainService();
        meatchain.readPigHistory(id, pageSize, bookmark).then(res => {
            let processed = Utils.processResponseFromAPI(res);
            if(processed.data.fetchedRecordsCount !== 0 && processed.data.fetchedRecordsCount !== pageSize) {
                this.setState({
                    hasMore: false,
                    items: items.concat(processed.data.records),
                });
            } else if(processed.data.fetchedRecordsCount === 0) {
                this.setState({
                    hasMore: false,
                    items: []
                });
            } else {
                this.setState({
                    hasMore: true,
                    items: items.concat(processed.data.records),
                    bookmark: processed.data.bookmark
                });
            }
        }).catch(err => {
            Toast.error(err.toString());
        });
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

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="page-title-box d-flex align-items-center justify-content-between">
                        <h4 className="mb-0 font-size-18">Pig history</h4>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <ul className="verti-timeline list-unstyled">
                                <InfiniteScroll
                                    next={this.fetchMoreRecords}
                                    hasMore={this.state.hasMore}
                                    loader={<h4>Loading...</h4>}
                                    dataLength={this.state.items.length}
                                >
                                    {this.state.items.map((item, index) => {
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
        );
    }
}