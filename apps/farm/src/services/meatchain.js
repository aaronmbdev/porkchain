
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

    async getPigsInCage(id, pageSize, bookmark) {
        return axios.get(`${this._url}/cage/${id}/pigs/?pageSize=${pageSize}&bookmark=${bookmark}`);
    }

    async createCage(name) {
        return axios.post(`${this._url}/cage`, { name });
    }

    async deleteCage(id) {
        return axios.delete(`${this._url}/cage/${id}`);
    }

    async readPig(id) {
        return axios.get(`${this._url}/pig/${id}`);
    }

    async readPigHistory(id) {
        return axios.get(`${this._url}/pig/${id}/records`);
    }
}