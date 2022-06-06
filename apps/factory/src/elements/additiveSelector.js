import React from "react";
import MeatchainService from "../services/meatchain";
import {AsyncPaginate} from "react-select-async-paginate";

export default class AdditiveSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.selected,
            type: this.props.type || "seasoning",
            multiple: this.props.multiple || false,
        }
    }

    handleCallback = (event) => {
        this.setState({
            selected: event.value
        });
        if(this.state.multiple) {
            this.props.parentCallback(event);
        } else {
            this.props.parentCallback(event.value);
        }
    }

    getSauceOptions = async (search, loadedOptions, {page}) => {
        let type = this.state.type;
        let meatchain = new MeatchainService();
        let pageSize = 5;
        const response = await meatchain.getAdditiveList(type, pageSize, page);
        let info = response.data;
        if(info.fetchedRecordsCount !== 0) {
            let options = info.records.map(sauce => {
                let name = sauce.name + " - " + sauce.lot_id;
                return {
                    value: sauce.additive_id,
                    label: name
                }
            });
            let hasMore = info.fetchedRecordsCount === pageSize;
            return {
                options: options,
                hasMore: hasMore,
                additional: {
                    page: info.bookmark
                }
            };
        } else {
            return {
                options: [],
                hasMore: false
            };
        }
    }

    render() {
        return (
            <div className="col-md-12">
                <AsyncPaginate
                    loadOptions={this.getSauceOptions}
                    onChange={this.handleCallback}
                    isSearchable={true}
                    isMulti={this.state.multiple}
                    additional={{
                        page: ""
                    }}
                />
            </div>
        );
    }
}