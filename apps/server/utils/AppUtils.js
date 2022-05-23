'use strict';

exports.prettyJSONString = (inputString) => {
    if (inputString) {
        return JSON.stringify(JSON.parse(inputString), null, 2);
    }
    else {
        return inputString;
    }
}

exports.getConnectionProfile = () => {
    if(process.env.NODE_ENV === "development") {
        return "connection-profile-local.yaml";
    }
    return "connection-profile.yaml";
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
