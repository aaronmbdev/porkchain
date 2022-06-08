
import axios from "axios";
import Utils from "../utils/utils";

export default class MeatchainService {
    constructor() {
        this._url = Utils.getAPIEndpoint();
    }

    async readTrayTraceability(trayId) {
        return axios.get(`${this._url}/trace/tray/${trayId}`);
    }

    async readPigHistory(id, pageSize, bookmark) {
        return axios.get(`${this._url}/pig/${id}/records/?pageSize=${pageSize}&bookmark=${bookmark}`);
    }

}