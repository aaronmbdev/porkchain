'use-strict';

const yaml = require('js-yaml');
const {buildWallet} = require("./utils/AppUtils");
const {Wallets, Gateway} = require("fabric-network");
const fs = require("fs");
const {buildFarmCAClient, enrollAdmin, registerAndEnrollUser} = require("./utils/CAUtils");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");

exports.MeatchainConnection = class {
    _walletPath = path.join(__dirname, 'wallet');
    _mspOrg1 = 'FarmMSP';
    _Username = 'farmUser';
    _channelName = 'meatchannel';
    _chaincodeName = 'pigManagement';
    _gateway = null;
    _connectionProfile = null;
    _wallet = null;

    createMeatchainConnection = async () => {
        const wallet = await buildWallet(Wallets, this._walletPath);
        let connectionProfile = yaml.safeLoad(fs.readFileSync("./connection-profile.yaml", "utf-8"));

        const ca = buildFarmCAClient(FabricCAServices, connectionProfile);
        await enrollAdmin(ca, wallet, this._mspOrg1);
        await registerAndEnrollUser(ca, wallet, this._mspOrg1, this._Username, 'farm.department1');

        this._gateway = new Gateway();
        this._connectionProfile = connectionProfile;
        this._wallet = wallet;
        return this._gateway;
    }

    getContract = async () => {
        let connectionOptions =  {
            identity: this._Username,
            wallet: this._wallet,
            discovery: {
                enabled: true,
                asLocalhost: true
            }
        };

        console.log("Trying to connect to the Meatchain");
        await this._gateway.connect(this._connectionProfile, connectionOptions);
        const network = await this._gateway.getNetwork(this._channelName);
        return network.getContract(this._chaincodeName);
    }
}
