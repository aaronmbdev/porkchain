import React from "react";
import {Link, useParams} from "react-router-dom";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";
import Utils from "../utils/utils";
import {forEach} from "axios/lib/utils";
import PigCard from "../elements/pigCard";

class PigsInCage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmark: "",
            pageSize: 5,
            pigs: [],
            id: this.props.params.id
        }
    }

    componentDidMount() {
        let bookmark = this.state.bookmark;
        if(bookmark === "") {
            this.loadMorePigs();
        }
    }

    loadMorePigs() {
        let {bookmark, pageSize, pigs, id} = this.state;
        let service = new MeatchainService();
        service.getPigsInCage(id, pageSize, bookmark).then((response) => {
            let processed = Utils.processResponseFromAPI(response);
            let information = processed.data;
            bookmark = information.bookmark;
            if(information.fetchedRecordsCount !== 0) {
                pigs = pigs.concat(information.records);
                this.setState({
                    bookmark:bookmark,
                    pageSize:pageSize,
                    pigs:pigs
                });
            } else {
                Toast.info("No more pigs to load");
            }
        }).catch((error) => {
           Toast.error(error.toString());
        });
    }

    render() {
        const no_link = "#";
        const {id} = this.props.params;
        let {pigs} = this.state;
        let pigsRender = [];
        let i = 0;
        forEach(pigs, (pig) => {
            i = i + 1;
            pigsRender.push(<PigCard key={i}
                                     id={pig.pig_id}
                                     birthdate={pig.birthdate}
                                     breed={pig.breed}
                                     status={pig.status}
            />);
        });
        if(pigsRender.length === 0) {
            pigsRender.push(<h5 key={0}>No pigs in cage</h5>);
        }
        let moreRender = (<button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => this.loadMorePigs()}>Load more</button>);
        return (
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-0 font-size-18">Cage view</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><a href={no_link}>Home</a></li>
                                        <li className="breadcrumb-item"><Link to={{pathname: "/cages"}} >Cages</Link>
                                        </li>
                                        <li className="breadcrumb-item active">Cage view</li>
                                    </ol>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="page-title-box d-flex align-items-center justify-content-between">
                                        <h4 className="mb-0 font-size-18">Pigs in cage {id}</h4>
                                    </div>
                                    <div className="row">
                                        {pigsRender}
                                    </div>
                                    <div className={"row"}>
                                        {moreRender}
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

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => (
    <PigsInCage {...props}
        params={useParams()}
    />
);