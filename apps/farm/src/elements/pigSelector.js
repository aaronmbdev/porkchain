import React from 'react';
import {AsyncPaginate} from "react-select-async-paginate";
import MeatchainService from "../services/meatchain";

export default class PigSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPig: props.selected || null
        };
    }
    handleCallback = (event) => {
        this.setState({
            selectedPig: event.value
        });
        this.props.parentCallback(event.value);
    }
    getPigOptions = async (search, loadedOptions, {page}) => {
        let meatchain = new MeatchainService();
        let pageSize = 5;
        const response = await meatchain.getPigList(pageSize, page);
        let info = response.data;
        if(info.fetchedRecordsCount !== 0) {
            let options = info.records.map(pig => {
                return {
                    value: pig.pig_id,
                    label: pig.pig_id
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
                    value={{value: this.state.selectedPig, label: this.state.selectedPig}}
                    loadOptions={this.getPigOptions}
                    onChange={this.handleCallback}
                    additional={{
                        page: ""
                    }}
                />
            </div>
        );
    }
}