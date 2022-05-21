import React from 'react';
import Cage from "../elements/cage";

export default class CageOverview extends React.Component {
    render() {
        return (
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-0 font-size-18">Farm cages</h4>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <Cage id={"CAGE_123"}/>
                    </div>
                </div>
            </div>
        );
    }
}