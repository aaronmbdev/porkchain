import React from "react";
import PigTraceModal from "./PigTraceModal";

export default class PigGenerator extends React.Component {
render() {
        let {pig} = this.props;
        return (
            <div className="table-responsive">
                <table className="table mb-0">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Breed</th>
                        <th>Birthdate</th>
                        <th>Records</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pig.map((pig, index) => {
                        return (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{pig.breed}</td>
                                <td>{pig.birthdate}</td>
                                <td>
                                    <PigTraceModal id={pig.pig_id} />
                                </td>
                            </tr>
                        )})
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}