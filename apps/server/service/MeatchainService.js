'use-strict';

const yaml = require('js-yaml');
const {Wallets, Gateway} = require("fabric-network");
const fs = require("fs");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");

class MeatchainService {
    _walletPath = path.join(process.cwd(), 'wallet');
    _mspOrg1 = 'FarmMSP';
    _Username = 'farmUser3';
    _channelName = 'meatchannel';
    _chaincodeName = 'pigManagement';
    _gateway = null;
    _connectionProfile = null;
    _wallet = null;
    _contractInstance = null;


    constructor() {
        console.log("Building meatchain service class");
    }

    createMeatchainConnection = async(profile) => {
        console.log("Creating meatchain connection");
        const wallet = await this._buildWallet(Wallets, this._walletPath);
        let connectionProfile = yaml.load(fs.readFileSync(process.cwd() + "/" + profile, "utf-8"));

        const ca = this._buildFarmCAClient(FabricCAServices, connectionProfile);
        await this._enrollAdmin(ca, wallet, this._mspOrg1, "admin","adminpw");
        await this._registerAndEnrollUser(ca, wallet, this._mspOrg1, this._Username, 'farm.department1', "admin");

        this._gateway = new Gateway();
        this._connectionProfile = connectionProfile;
        this._wallet = wallet;
        return this._gateway;
    }

    getContract = async () => {
        if(this._contractInstance == null) {
            console.log("Creating contract instance");
            this._contractInstance = await this._produceAndSaveContract();
        }
        return this._contractInstance;
    }

    _produceAndSaveContract = async() => {
        let connectionOptions =  {
            identity: this._Username,
            wallet: this._wallet,
            discovery: {
                enabled: true,
                asLocalhost: true
            }
        };

        if(this._gateway != null) {
            await this._gateway.connect(this._connectionProfile, connectionOptions);
            const network = await this._gateway.getNetwork(this._channelName);
            console.log("Contract found, success");
            return network.getContract(this._chaincodeName);
        }
        console.log("Could not obtain the contract, gateway is null")
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

const service = new MeatchainService();
module.exports = service;