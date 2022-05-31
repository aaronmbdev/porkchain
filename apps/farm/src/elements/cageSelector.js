import React from "react";
import {AsyncPaginate} from "react-select-async-paginate";
import MeatchainService from "../services/meatchain";

export default class CageSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.selected
        }
    }

    handleCallback = (event) => {
        this.setState({
            selected: event.value
        });
        this.props.parentCallback(event.value);
    }
    getCageOptions = async (search, loadedOptions, {page}) => {
        let meatchain = new MeatchainService();
        let pageSize = 5;
        const response = await meatchain.getCageList(pageSize, page);
        let info = response.data;
        if(info.fetchedRecordsCount !== 0) {
            let options = info.records.map(cage => {
                return {
                    value: cage.cage_id,
                    label: cage.name
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
                    value={{value: this.state.selected, label: this.state.selected}}
                    loadOptions={this.getCageOptions}
                    onChange={this.handleCallback}
                    additional={{
                        page: ""
                    }}
                />
            </div>
        );
    }
}