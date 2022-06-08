import React from "react";

export default class MeatGenerator extends React.Component {
    render() {
        let {meat} = this.props;
        return (
            <ul className="list-unstyled mb-0">
                {meat.map((item, index) => {
                    return (<li key={index}>{item.pieces + " pieces of " + item.cut}</li>);
                })
                }
            </ul>
        );
    }
}