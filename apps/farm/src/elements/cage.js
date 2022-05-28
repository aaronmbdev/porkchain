import React from "react";
import cageImage from "../images/elements/cages.png";
import MeatchainService from "../services/meatchain";
import Utils from "../utils/utils";
import Toast from "../utils/toast";


export default class Cage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            name: props.name,
            canErase: false,
            isDeleting: false
        }
    }
    componentDidMount() {
        let  {id} = this.state;
        let meatchain = new MeatchainService();
        meatchain.getPigsInCage(id).then(response => {
            let processed = Utils.processResponseFromAPI(response);
            if(processed.success) {
                let info = processed.data;
                let canErase = info.fetchedRecordsCount === 0;
                this.setState({
                    canErase: canErase
                });
            }
        }).catch((error) => {
            console.log(error);
            Toast.error(error.response.data);
        });
    }

    deleteCage() {
        let id = this.state.id;
        let meatchain = new MeatchainService();
        this.setState({isDeleting: true});
        meatchain.deleteCage(id).then((response) => {
            window.location.reload();
        }).catch((error) => {
            console.log(error);
            Toast.error(error.response.data);
        });
    }

    render() {
        let {id, name, canErase, isDeleting} = this.state;
        let disabled = false;
        if(!canErase || isDeleting) disabled = true;
        let DeleteText = "Delete";
        if(isDeleting) DeleteText = "Deleting...";
        return (
            <div className="col-md-6 col-xl-3">
                <div className="card">
                    <img className="card-img-top img-fluid" src={cageImage} alt={"A cage"}/>
                    <div className="card-body">
                        <div className={"row"}>
                            <div className={"col-md-12"}>
                                <h4 className="card-title">{name}</h4>
                                <p>ID: {id}</p>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"col-md-6"}>
                                <button type="button" className="btn btn-primary waves-effect waves-light">See pigs</button>
                            </div>
                            <div className={"col-md-6"}>
                                <button type="button" className="btn btn-danger waves-effect waves-light" disabled={disabled} onClick={() => this.deleteCage()}>{DeleteText}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}