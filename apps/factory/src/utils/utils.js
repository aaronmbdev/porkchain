

export default class Utils {

    static getAPIEndpoint() {
        if(process.env.NODE_ENV === "development") {
            return "http://localhost:4000";
        }
        return "https://api.meatchain.cloud";
    }

    static getPorkCuts() {
        return [
            { value: 'Leg', label: 'Leg' },
            { value: 'Loin', label: 'Loin' },
            { value: 'Belly', label: 'Belly' },
            { value: 'Blade', label: 'Blade' },
            { value: 'Hand', label: 'Hand' },
            { value: 'Head', label: 'Head' },
            { value: 'Trotters', label: 'Trotters' },
        ];
    }
}