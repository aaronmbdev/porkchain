
import axios from "axios";
import Utils from "../utils/utils";

export default class MeatchainService {
    constructor() {
        this._url = Utils.getAPIEndpoint();
    }

    async createAdditive(name, lot, expiry, type) {
        return axios.post(`${this._url}/additive`, {
            name: name,
            lot: lot,
            expiry: expiry,
            type: type
        });
    }

    async readPig(id) {
        return axios.get(`${this._url}/pig/${id}`);
    }

    async getAdditiveList(type, pageSize, bookmark) {
        bookmark = bookmark || "";
        pageSize = pageSize || 10;
        type = type || "seasoning";
        return axios.get(`${this._url}/additive/?type=${type}&pageSize=${pageSize}&bookmark=${bookmark}`);
    }

    async getPigList(pageSize, bookmark, slaughter) {
        bookmark = bookmark || "";
        pageSize = pageSize || 10;
        return axios.get(`${this._url}/pig/?pageSize=${pageSize}&bookmark=${bookmark}&slaughter=${slaughter}`);
    }

    async readAdditive(id) {
        return axios.get(`${this._url}/additive/${id}`);
    }

    async createMeatCut(pigId, cut, pieces) {
        return axios.post(`${this._url}/meat`, {
            pigId: pigId,
            cut: cut,
            pieces: pieces
        });
    }

    async queryMeat(pageSize, bookmark, cut, minAmount) {
        return axios.get(`${this._url}/meat/?pageSize=${pageSize}&bookmark=${bookmark}&cut=${cut}&minAmount=${minAmount}`);
    }

    async createTray(meatIds, additives) {
        return axios.post(`${this._url}/tray`, {
            meatIds: meatIds,
            additives: additives
        });
    }

}