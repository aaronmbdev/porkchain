

export default class Utils {

    static getAPIEndpoint() {
        if(process.env.NODE_ENV === "development") {
            return "http://localhost:4000";
        }
        return "https://api.meatchain.cloud";
    }

    static getPorkCuts() {
        return [
            { value: 'leg', label: 'Leg' },
            { value: 'loin', label: 'Loin' },
            { value: 'belly', label: 'Belly' },
            { value: 'blade', label: 'Blade' },
            { value: 'hand', label: 'Hand' },
            { value: 'trotters', label: 'Trotters' },
        ];
    }
}