'use strict';

exports.prettyJSONString = (inputString) => {
    if (inputString) {
        return JSON.stringify(JSON.parse(inputString), null, 2);
    }
    else {
        return inputString;
    }
}

exports.getFarmConnectionProfile = () => {
    if(process.env.NODE_ENV === "development") {
        return "farm-connection-profile-local.yaml";
    }
    return "farm-connection-profile.yaml";
}

exports.getFactoryConnectionProfile = () => {
    if(process.env.NODE_ENV === "development") {
        return "factory-connection-profile-local.yaml";
    }
    return "factory-connection-profile.yaml";
}

exports.getDiscovery = () => {
    let localhost = false;
    if(process.env.NODE_ENV === "development") {
        localhost = true;
    }
    return {
        enabled: true,
        asLocalhost: localhost
    };
}

exports.Logger = class {
    oldLogger = null;

    enableLogger = () => {
        window['console']['log'] = this.oldLogger;
    }
    disableLogger = () => {
        if(this.oldLogger == null) {
            this.oldLogger = console.log;
        }
        window['console']['log'] = function() {};
    }
}
