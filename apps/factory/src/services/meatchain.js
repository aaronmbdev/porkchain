
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

    async readCage(cageId) {
        return axios.get(`${this._url}/cage/${cageId}`);
    }

    async getPigList(pageSize, bookmark) {
        bookmark = bookmark || "";
        pageSize = pageSize || 10;
        return axios.get(`${this._url}/pig/?pageSize=${pageSize}&bookmark=${bookmark}`);
    }

    async getPigsInCage(id, pageSize, bookmark) {
        return axios.get(`${this._url}/cage/${id}/pigs/?pageSize=${pageSize}&bookmark=${bookmark}`);
    }

    async createCage(name) {
        return axios.post(`${this._url}/cage`, { name });
    }

    async createPig(parentId, birthdate, breed, location) {
        let data = {
            birthdate: birthdate,
            breed: breed,
            location: location,
            parentId: parentId
        }
        return axios.post(`${this._url}/pig`, data);
    }

    async deleteCage(id) {
        return axios.delete(`${this._url}/cage/${id}`);
    }

    async readPig(id) {
        return axios.get(`${this._url}/pig/${id}`);
    }

    async readPigHistory(id, pageSize, bookmark) {
        return axios.get(`${this._url}/pig/${id}/records/?pageSize=${pageSize}&bookmark=${bookmark}`);
    }

    async updatePig(id, parent, birthdate, breed, location) {
        return axios.put(`${this._url}/pig/${id}`, {
            parentId: parent,
            birthdate: birthdate,
            breed: breed,
            location: location
        });
    }

    async killPig(id) {
        return axios.post(`${this._url}/pig/${id}/kill`);
    }

    async healthCheck(id, vetId, data) {
        return axios.post(`${this._url}/pig/${id}/healthcheck`, {
            vetId: vetId,
            data: data
        });
    }

    async feedPig(id, data) {
        return axios.post(`${this._url}/pig/${id}/feed`, {
            data: data
        });
    }
}