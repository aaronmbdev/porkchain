'use-strict';

const { v4: uuidv4 } = require('uuid');

exports.generateID = () => {
    return uuidv4();
}