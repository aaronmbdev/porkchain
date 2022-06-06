import React from "react";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";

export default class PigSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchVal: ""
        }
    }

    handleCallback = () => {
        let {searchVal} = this.state;
        if(searchVal !== "") {
            let meatchain = new MeatchainService();
            meatchain.readPig(searchVal).then(() => {
                Toast.success("Pig found");
                this.setState({
                   searchVal: ""
                });
                this.props.parentCallback(searchVal);
            }).catch((err) => {
                Toast.error(err.response.data);
            });
        }
    }

    updateSearchVal = (e) => {
        this.setState({
            searchVal: e.target.value
        });
    }

    render() {
        let {searchVal} = this.state;
        return (
            <div className="col-md-12">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <div className="input-group-text"><i
                            className="mdi mdi-qrcode-scan"/></div>
                    </div>
                    <input type="text" className="form-control" placeholder="Read pig id" value={searchVal}  onChange={(e) => this.updateSearchVal(e)}/>
                </div>
                <p></p>
                <div className="input-group">
                    <button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => this.handleCallback()}>Search</button>
                </div>
            </div>
        );
    }
}