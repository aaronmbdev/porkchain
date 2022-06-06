'use-strict';

const yaml = require('js-yaml');
const {Wallets, Gateway} = require("fabric-network");
const fs = require("fs");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const Utils = require("../utils/AppUtils");

const FarmMSP =  "FarmMSP";
const FactoryMSP = "FactoryMSP";
const FarmWalletPath = path.join(process.cwd(), 'farm_wallet');
const FactoryWalletPath = path.join(process.cwd(), 'factory_wallet');
const FarmUser = "farmUser";
const FactoryUser = "factoryUser"
const Channel = "meatchannel";
const Chaincode = "pigManagement";

class MeatchainValue {
    constructor(path, msp, username, discovery) {
        let seed = Math.random().toString(36).substr(2, 9);
        this.walletPath = path;
        this.msp = msp;
        this.username = username + "_" + seed;
        this.gateway = null;
        this.connection_profile = null;
        this.wallet = null;
        this.contract = null;
        this.discovery = discovery;
    }
}

class MeatchainService {
    constructor(discoveryConf) {
        console.log("Building meatchain service class");
        this.farmValues = new MeatchainValue(FarmWalletPath, FarmMSP, FarmUser, discoveryConf);
        this.factoryValues = new MeatchainValue(FactoryWalletPath, FactoryMSP, FactoryUser, discoveryConf);
    }

    createMeatchainConnection = async(farmProfile, factoryProfile) => {
        console.log("Creating meatchain connection");

        console.log("Verifying or creating farm wallet...");
        this.farmValues.wallet = await this._buildWallet(Wallets, this.farmValues.walletPath);
        console.log("Verifying or creating factory wallet...");
        this.factoryValues.wallet = await this._buildWallet(Wallets, this.factoryValues.walletPath);

        console.log("Reading Farm connection profile...")
        this.farmValues.connection_profile = yaml.load(fs.readFileSync(process.cwd() + "/" + farmProfile, "utf-8"));

        const ca = this._buildFarmCAClient(FabricCAServices, this.farmValues.connection_profile);
        await this._enrollAdmin(ca, this.farmValues.wallet, this.farmValues.msp, "admin","adminpw");
        await this._registerAndEnrollUser(ca, this.farmValues.wallet, this.farmValues.msp, this.farmValues.username, 'farm.department1', "admin");
        this.farmValues.gateway = new Gateway();

        console.log("Reading Factory connection profile...")
        this.factoryValues.connection_profile = yaml.load(fs.readFileSync(process.cwd() + "/" + factoryProfile, "utf-8"));

        const factoryCa = this._buildFactoryCAClient(FabricCAServices, this.factoryValues.connection_profile);
        await this._enrollAdmin(factoryCa, this.factoryValues.wallet, this.factoryValues.msp, "admin","adminpw");
        await this._registerAndEnrollUser(factoryCa, this.factoryValues.wallet, this.factoryValues.msp, this.factoryValues.username, 'factory.department1', "admin");
        this.factoryValues.gateway = new Gateway();

        console.log("Connection performed successfully");

    }

    getFarmContract = async () => {
        if(this.farmValues.contract == null) {
            console.log("Creating contract instance for Farm");
            this.farmValues.contract = await this._produceAndSaveContract(this.farmValues);
        }
        return this.farmValues.contract;
    }

    getFactoryContract = async() => {
        if(this.factoryValues.contract == null) {
            console.log("Creating contract instance for Factory");
            this.factoryValues.contract = await this._produceAndSaveContract(this.factoryValues);
        }
        return this.factoryValues.contract;
    }

    _produceAndSaveContract = async(values) => {
        let connectionOptions =  {
            identity: values.username,
            wallet: values.wallet,
            discovery: values.discovery,
        };

        if(values.gateway != null) {
            await values.gateway.connect(values.connection_profile, connectionOptions);
            const network = await values.gateway.getNetwork(Channel);
            console.log("Contract found, success");
            return network.getContract(Chaincode);
        }
        console.log("Could not obtain the contract, gateway is null");
    }


    _buildWallet = async (Wallets, walletPath) => {
        let wallet;
        if (walletPath) {
            wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Built a file system wallet at ${walletPath}`);
        } else {
            wallet = await Wallets.newInMemoryWallet();
            console.log('Built an in memory wallet');
        }

        return wallet;
    };

    _buildFarmCAClient = (FabricCAServices, ccp) => {
        const caInfo = ccp.certificateAuthorities['ca.Farm.meatchain.cloud'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, "ca-farm");

        console.log(`Built a CA Client named "ca-farm"`);
        return ca;
    };

    _buildFactoryCAClient = (FabricCAServices, ccp) => {
        const caInfo = ccp.certificateAuthorities['ca.Factory.meatchain.cloud'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, "ca-factory");

        console.log(`Built a CA Client named "ca-factory"`);
        return ca;
    };

    _enrollAdmin = async (caClient, wallet, orgMspId, adminUserId, adminUserPasswd) => {
        try {
            const identity = await wallet.get(adminUserId);
            if (identity) {
                console.log('An identity for the admin user already exists in the wallet');
                return;
            }

            const enrollment = await caClient.enroll({ enrollmentID: adminUserId, enrollmentSecret: adminUserPasswd });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: orgMspId,
                type: 'X.509',
            };
            await wallet.put(adminUserId, x509Identity);
            console.log('Successfully enrolled admin user and imported it into the wallet');
        } catch (error) {
            console.error(`Failed to enroll admin user : ${error}`);
        }
    };

    _registerAndEnrollUser = async (caClient, wallet, orgMspId, userId, affiliation, adminUserId) => {
        try {
            const userIdentity = await wallet.get(userId);
            if (userIdentity) {
                console.log(`An identity for the user ${userId} already exists in the wallet`);
                return;
            }

            const adminIdentity = await wallet.get(adminUserId);
            if (!adminIdentity) {
                console.log('An identity for the admin user does not exist in the wallet');
                console.log('Enroll the admin user before retrying');
                return;
            }

            const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, adminUserId);
            const secret = await caClient.register({
                affiliation: affiliation,
                enrollmentID: userId,
                role: 'client'
            }, adminUser);

            const enrollment = await caClient.enroll({
                enrollmentID: userId,
                enrollmentSecret: secret
            });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: orgMspId,
                type: 'X.509',
            };
            await wallet.put(userId, x509Identity);
            console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
        } catch (error) {
            console.error(`Failed to register user : ${error}`);
        }
    };

}

const service = new MeatchainService(Utils.getDiscovery());
module.exports = service;