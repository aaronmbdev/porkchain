import React from "react";
import {Link, useParams} from "react-router-dom";
import MeatchainService from "../services/meatchain";
import Utils from "../utils/utils";
import Toast from "../utils/toast";
import PigUpdater from "../elements/pigUpdater";
import PigInformation from "../elements/pigInformation";
import PigSlauther from "../elements/pigSlauther";
import HealthcheckForm from "../elements/healthcheckForm";
import FeedPigForm from "../elements/feedPigForm";
import PigRecords from "../elements/pigRecords";

class PigProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmark: "",
            pageSize: 5,
            records: [],
            id: this.props.params.id,
            birthdate: "...",
            breed: "...",
            location: "",
            parentId: "",
            status: "",
        }
    }
    componentDidMount() {
        let {id} = this.state;
        let meatchain = new MeatchainService();
        meatchain.readPig(id).then(response => {
            let processed = Utils.processResponseFromAPI(response);
            this.setState({
                birthdate: processed.data.birthdate,
                breed: processed.data.breed,
                location: processed.data.location,
                parentId: processed.data.parentId,
                status: processed.data.status,
            });
        }).catch((err) => {
            Toast.error(err.toString());
        });
    }

    buildStatusElem(status) {
        if(status === "Alive") {
            return <span className="badge badge-success">{status}</span>
        }
        return <span className="badge badge-danger">{status}</span>
    }

    buildIdTagElem(block, location) {
        const locationRef = "/" + block + "/" + location;
        if(location !== "") {
            return <a href={locationRef} className="badge badge-primary" target="_blank" rel="noreferrer">{location}</a>;
        }
        return "...";
    }

    render() {
        const {id, birthdate, breed, status, location, parentId} = this.state;
        const statusElem = this.buildStatusElem(status);
        const locationElem = this.buildIdTagElem("cages", location);
        const parentElem = this.buildIdTagElem("pigs", parentId);
        const no_link = "#";
        if(breed === "...") {
            return(
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <p>Content loading...</p>
                        </div>
                    </div>
                </div>
                );
        }
        return (
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-0 font-size-18">Pig profile</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><a href={no_link}>Home</a></li>
                                        <li className="breadcrumb-item"><Link to={{pathname: "/pigs"}} >Pigs</Link>
                                        </li>
                                        <li className="breadcrumb-item active">Pig view</li>
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
                                        <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                            <a href={"/pigs"}><label className="btn btn-secondary">
                                                <i className="mdi mdi-backspace"/> Go back
                                            </label></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <PigInformation id={id} birthdate={birthdate} breed={breed} status={statusElem} location={locationElem} parent={parentElem}/>
                        </div>
                        <PigUpdater parent={parentId} breed={breed} birthdate={birthdate} location={location} id={id}/>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <PigSlauther id={id} status={status}/>
                        </div>
                        <div className="col-4">
                            <HealthcheckForm id={id} status={status}/>
                        </div>
                        <div className="col-4">
                            <FeedPigForm id={id} status={status} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <PigRecords id={id}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => (
    <PigProfile {...props} params={useParams()} />
);