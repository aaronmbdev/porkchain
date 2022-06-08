import React from "react";

export default class AdditiveGenerator extends React.Component {
    render() {
        let {additive} = this.props;
        return (
            <ul className="list-unstyled mb-0">
                {additive.map((additive, index) => {
                    return (<li key={index}>{additive.name}</li>);
                })
                }
            </ul>
        );
    }
}