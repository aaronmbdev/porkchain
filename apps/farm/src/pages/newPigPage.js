import React from "react";
import NewPigForm from "../elements/newPigForm";
import BornPigForm from "../elements/bornPigForm";

export default class NewPigPage extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          name: "",
          weight: "",
          birthDate: "",
          breed: "",
      }
  }

    render() {
        return (
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-0 font-size-18">Register new pigs</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="page-title-box d-flex align-items-center justify-content-between">
                                        <h4 className="mb-0 font-size-18">Register a pig purchase</h4>
                                    </div>
                                    <p>Use this option to add a new pig purchase</p>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <NewPigForm />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="page-title-box d-flex align-items-center justify-content-between">
                                        <h4 className="mb-0 font-size-18">Register pig birth</h4>
                                    </div>
                                    <p>Use this tool to give a digital identity to the new born piglets.</p>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <BornPigForm />
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