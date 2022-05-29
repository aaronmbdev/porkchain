import React from 'react';
import CageCard from "../elements/cageCard";
import MeatchainService from "../services/meatchain";
import Utils from "../utils/utils";
import Toast from "../utils/toast";
import {forEach} from "axios/lib/utils";
import CageCreator from "../elements/cageCreator";

export default class CageOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmark: "",
            pageSize: 10,
            cages: [],
        }
    }
    componentDidMount() {
        let bookmark = this.state.bookmark;
        if(bookmark === "") {
            this.loadMoreCages();
        }
    }

    loadMoreCages() {
        let {bookmark, pageSize, cages} = this.state;
        let service = new MeatchainService();
        service.getCageList(pageSize, bookmark).then(response => {
            let processed = Utils.processResponseFromAPI(response);
            if(processed.success) {
                let information = processed.data;
                bookmark = information.bookmark;
                if(information.fetchedRecordsCount !== 0) {
                    cages = cages.concat(information.records);
                    this.setState({
                        bookmark:bookmark,
                        pageSize:pageSize,
                        cages:cages
                    });
                } else {
                    Toast.info("No more cages to load");
                }
            } else {
                Toast.error(processed.data);
            }
        }).catch(error => {
            console.log(error);
            Toast.error(error.response.data);
        });
    }
    render() {
        let {cages} = this.state;
        let cagesRender = [];
        let i = 0;
        forEach(cages, (cage) => {
            i = i + 1;
            cagesRender.push(<CageCard key={i} id={cage.cage_id} name={cage.name}/>);
        });
        let moreRender = (<button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => this.loadMoreCages()}>Load more</button>);

        return (
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <CageCreator />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="page-title-box d-flex align-items-center justify-content-between">
                                        <h4 className="mb-0 font-size-18">Farm cages</h4>
                                    </div>
                                    <div className="row">
                                        {cagesRender}
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