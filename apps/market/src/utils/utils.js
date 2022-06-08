

export default class Utils {

    static getAPIEndpoint() {
        if(process.env.NODE_ENV === "development") {
            return "http://localhost:4000";
        }
        return "https://api.meatchain.cloud";
    }

}