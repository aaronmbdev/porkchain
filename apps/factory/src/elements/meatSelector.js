import React from 'react';
import {AsyncPaginate} from "react-select-async-paginate";
import MeatchainService from "../services/meatchain";

export default class MeatSelector extends React.Component {

    handleCallback = (event) => {
        this.props.parentCallback(event);
    }
    getMeatOptions = async (search, loadedOptions, {page}) => {
        let meatchain = new MeatchainService();
        let pageSize = 5;
        const response = await meatchain.queryMeat(pageSize, page, "", 0);
        let info = response.data;
        if(info.fetchedRecordsCount !== 0) {
            let options = info.records.map(meat => {
                let name = meat.cut + " - " + meat.pieces + " - " + meat.production;
                return {
                    value: meat.meat_id,
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
                    loadOptions={this.getMeatOptions}
                    onChange={this.handleCallback}
                    isSearchable={true}
                    isMulti={true}
                    additional={{
                        page: ""
                    }}
                />
            </div>
        );
    }
}