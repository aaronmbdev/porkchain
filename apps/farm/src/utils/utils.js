import localProfile from "../connection-profile-local.yaml";
import devProfile from "../connection-profile.yaml";

export default class Utils {

    static getConnectionProfile() {
        if(process.env.NODE_ENV === "development") {
            return localProfile;
        }
        return devProfile;
    }
}