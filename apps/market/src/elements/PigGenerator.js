import React from "react";

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
                                    <button
                                        className="btn btn-primary btn-sm waves-effect waves-light"
                                        type="button" >See records
                                    </button>
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