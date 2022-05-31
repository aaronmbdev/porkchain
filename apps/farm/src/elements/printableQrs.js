import React from "react";
import QRCode from "react-qr-code";

export default class PrintableQrs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: props.items,
            creating: props.isCreating,
        }
    }

    render() {
        let { items, creating } = this.state;
        if(!creating) {
            return (
                <div>
                    {items.map((el, i) => {
                        return (
                            <div key={i}>
                                <div className="qr-container">
                                    <QRCode value={el.pig_id} size={200}/>
                                </div>
                                <div className="qr-text">
                                    <p>{el.pig_id}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            );
        }
        return <p>Creating content...</p>
    }
}