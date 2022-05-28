
import axios from "axios";
import Utils from "../utils/utils";

export default class MeatchainService {
    constructor() {
        this._url = Utils.getAPIEndpoint();
    }

    async getCageList(pageSize, bookmark) {
        bookmark = bookmark || "";
        pageSize = pageSize || 10;
        return axios.get(`${this._url}/cage/?pageSize=${pageSize}&bookmark=${bookmark}`);
    }

    async getPigsInCage(id) {
        return axios.get(`${this._url}/cage/${id}/pigs`);
    }

    async createCage(name) {
        return axios.post(`${this._url}/cage`, { name });
    }

    async deleteCage(id) {
        return axios.delete(`${this._url}/cage/${id}`);
    }
}