import React from "react";
import MeatchainService from "../services/meatchain";
import {AsyncPaginate} from "react-select-async-paginate";

export default class TraySelector extends React.Component {
    handleCallback = (event) => {
        this.props.parentCallback(event.value);
    }
    getTrayOptions = async (search, loadedOptions, {page}) => {
        let meatchain = new MeatchainService();
        let pageSize = 5;
        const response = await meatchain.getTrays(pageSize, page);
        let info = response.data;
        if(info.fetchedRecordsCount !== 0) {
            let options = info.records.map(tray => {
                return {
                    value: tray.tray_id,
                    label: tray.tray_id
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
                    loadOptions={this.getTrayOptions}
                    onChange={this.handleCallback}
                    isSearchable={true}
                    additional={{
                        page: ""
                    }}
                />
            </div>
        );
    }
}