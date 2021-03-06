#!/bin/bash

function createOrg1() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/farm.meatchain.cloud/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-farm --tls.certfiles "${PWD}/organizations/fabric-ca/farm/ca-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-farm.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-farm.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-farm.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-farm.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/msp/config.yaml"

  # Since the CA serves as both the organization CA and TLS CA, copy the org's root cert that was generated by CA startup into the org level ca and tlsca directories

  # Copy org1's CA cert to org1's /msp/tlscacerts directory (for use in the channel MSP definition)
  mkdir -p "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/msp/tlscacerts"
  cp "${PWD}/organizations/fabric-ca/farm/ca-cert.pem" "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/msp/tlscacerts/ca.crt"

  # Copy org1's CA cert to org1's /tlsca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/tlsca"
  cp "${PWD}/organizations/fabric-ca/farm/ca-cert.pem" "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/tlsca/tlsca.farm.meatchain.cloud-cert.pem"

  # Copy org1's CA cert to org1's /ca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/ca"
  cp "${PWD}/organizations/fabric-ca/farm/ca-cert.pem" "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/ca/ca.farm.meatchain.cloud-cert.pem"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-farm --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/farm/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-farm --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/farm/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-farm --id.name farmadmin --id.secret farmadminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/farm/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-farm -M "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/peers/peer0.farm.meatchain.cloud/msp" --csr.hosts peer0.farm.meatchain.cloud --tls.certfiles "${PWD}/organizations/fabric-ca/farm/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/msp/config.yaml" "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/peers/peer0.farm.meatchain.cloud/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-farm -M "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/peers/peer0.farm.meatchain.cloud/tls" --enrollment.profile tls --csr.hosts peer0.farm.meatchain.cloud --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/farm/ca-cert.pem"
  { set +x; } 2>/dev/null

  # Copy the tls CA cert, server cert, server keystore to well known file names in the peer's tls directory that are referenced by peer startup config
  cp "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/peers/peer0.farm.meatchain.cloud/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/peers/peer0.farm.meatchain.cloud/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/peers/peer0.farm.meatchain.cloud/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/peers/peer0.farm.meatchain.cloud/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/peers/peer0.farm.meatchain.cloud/tls/keystore/"* "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/peers/peer0.farm.meatchain.cloud/tls/server.key"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:7054 --caname ca-farm -M "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/users/User1@farm.meatchain.cloud/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/farm/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/msp/config.yaml" "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/users/User1@farm.meatchain.cloud/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://farmadmin:farmadminpw@localhost:7054 --caname ca-farm -M "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/users/Admin@farm.meatchain.cloud/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/farm/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/msp/config.yaml" "${PWD}/organizations/peerOrganizations/farm.meatchain.cloud/users/Admin@farm.meatchain.cloud/msp/config.yaml"
}

function createOrg2() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/factory.meatchain.cloud/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:8054 --caname ca-factory --tls.certfiles "${PWD}/organizations/fabric-ca/factory/ca-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-factory.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-factory.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-factory.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-factory.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/msp/config.yaml"

  # Since the CA serves as both the organization CA and TLS CA, copy the org's root cert that was generated by CA startup into the org level ca and tlsca directories

  # Copy org2's CA cert to org2's /msp/tlscacerts directory (for use in the channel MSP definition)
  mkdir -p "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/msp/tlscacerts"
  cp "${PWD}/organizations/fabric-ca/factory/ca-cert.pem" "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/msp/tlscacerts/ca.crt"

  # Copy org2's CA cert to org2's /tlsca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/tlsca"
  cp "${PWD}/organizations/fabric-ca/factory/ca-cert.pem" "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/tlsca/tlsca.factory.meatchain.cloud-cert.pem"

  # Copy org2's CA cert to org2's /ca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/ca"
  cp "${PWD}/organizations/fabric-ca/factory/ca-cert.pem" "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/ca/ca.factory.meatchain.cloud-cert.pem"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-factory --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/factory/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-factory --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/factory/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-factory --id.name factoryadmin --id.secret factoryadminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/factory/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-factory -M "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/peers/peer0.factory.meatchain.cloud/msp" --csr.hosts peer0.factory.meatchain.cloud --tls.certfiles "${PWD}/organizations/fabric-ca/factory/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/msp/config.yaml" "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/peers/peer0.factory.meatchain.cloud/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-factory -M "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/peers/peer0.factory.meatchain.cloud/tls" --enrollment.profile tls --csr.hosts peer0.factory.meatchain.cloud --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/factory/ca-cert.pem"
  { set +x; } 2>/dev/null

  # Copy the tls CA cert, server cert, server keystore to well known file names in the peer's tls directory that are referenced by peer startup config
  cp "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/peers/peer0.factory.meatchain.cloud/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/peers/peer0.factory.meatchain.cloud/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/peers/peer0.factory.meatchain.cloud/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/peers/peer0.factory.meatchain.cloud/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/peers/peer0.factory.meatchain.cloud/tls/keystore/"* "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/peers/peer0.factory.meatchain.cloud/tls/server.key"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:8054 --caname ca-factory -M "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/users/User1@factory.meatchain.cloud/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/factory/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/msp/config.yaml" "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/users/User1@factory.meatchain.cloud/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://factoryadmin:factoryadminpw@localhost:8054 --caname ca-factory -M "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/users/Admin@factory.meatchain.cloud/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/factory/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/msp/config.yaml" "${PWD}/organizations/peerOrganizations/factory.meatchain.cloud/users/Admin@factory.meatchain.cloud/msp/config.yaml"
}

function createOrg3() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/market.meatchain.cloud/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/market.meatchain.cloud/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca-market --tls.certfiles "${PWD}/organizations/fabric-ca/market/ca-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-market.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-market.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-market.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-market.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/msp/config.yaml"

  mkdir -p "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/msp/tlscacerts"
  cp "${PWD}/organizations/fabric-ca/market/ca-cert.pem" "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/msp/tlscacerts/ca.crt"

  # Copy org2's CA cert to org2's /tlsca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/tlsca"
  cp "${PWD}/organizations/fabric-ca/market/ca-cert.pem" "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/tlsca/tlsca.market.meatchain.cloud-cert.pem"

  # Copy org2's CA cert to org2's /ca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/ca"
  cp "${PWD}/organizations/fabric-ca/market/ca-cert.pem" "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/ca/ca.market.meatchain.cloud-cert.pem"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-market --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/market/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-market --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/market/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-market --id.name marketadmin --id.secret marketadminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/market/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:9054 --caname ca-market -M "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/peers/peer0.market.meatchain.cloud/msp" --csr.hosts peer0.market.meatchain.cloud --tls.certfiles "${PWD}/organizations/fabric-ca/market/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/msp/config.yaml" "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/peers/peer0.market.meatchain.cloud/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:9054 --caname ca-market -M "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/peers/peer0.market.meatchain.cloud/tls" --enrollment.profile tls --csr.hosts peer0.market.meatchain.cloud --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/market/ca-cert.pem"
  { set +x; } 2>/dev/null

  # Copy the tls CA cert, server cert, server keystore to well known file names in the peer's tls directory that are referenced by peer startup config
  cp "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/peers/peer0.market.meatchain.cloud/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/peers/peer0.market.meatchain.cloud/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/peers/peer0.market.meatchain.cloud/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/peers/peer0.market.meatchain.cloud/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/peers/peer0.market.meatchain.cloud/tls/keystore/"* "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/peers/peer0.market.meatchain.cloud/tls/server.key"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:9054 --caname ca-market -M "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/users/User1@market.meatchain.cloud/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/market/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/msp/config.yaml" "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/users/User1@market.meatchain.cloud/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://marketadmin:marketadminpw@localhost:9054 --caname ca-market -M "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/users/Admin@market.meatchain.cloud/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/market/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/msp/config.yaml" "${PWD}/organizations/peerOrganizations/market.meatchain.cloud/users/Admin@market.meatchain.cloud/msp/config.yaml"
}

function createOrderer() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/ordererOrganizations/meatchain.cloud

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/meatchain.cloud

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:6054 --caname ca-orderer --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-6054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-6054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-6054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-6054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/ordererOrganizations/meatchain.cloud/msp/config.yaml"

  # Since the CA serves as both the organization CA and TLS CA, copy the org's root cert that was generated by CA startup into the org level ca and tlsca directories

  # Copy orderer org's CA cert to orderer org's /msp/tlscacerts directory (for use in the channel MSP definition)
  mkdir -p "${PWD}/organizations/ordererOrganizations/meatchain.cloud/msp/tlscacerts"
  cp "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem" "${PWD}/organizations/ordererOrganizations/meatchain.cloud/msp/tlscacerts/tlsca.meatchain.cloud-cert.pem"

  # Copy orderer org's CA cert to orderer org's /tlsca directory (for use by clients)
  mkdir -p "${PWD}/organizations/ordererOrganizations/meatchain.cloud/tlsca"
  cp "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem" "${PWD}/organizations/ordererOrganizations/meatchain.cloud/tlsca/tlsca.meatchain.cloud-cert.pem"

  infoln "Registering orderer"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the orderer admin"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:6054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer.meatchain.cloud/msp" --csr.hosts orderer.meatchain.cloud --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the orderer2 msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:6054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer2.meatchain.cloud/msp" --csr.hosts orderer2.meatchain.cloud --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/meatchain.cloud/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer.meatchain.cloud/msp/config.yaml"

  cp "${PWD}/organizations/ordererOrganizations/meatchain.cloud/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer2.meatchain.cloud/msp/config.yaml"

  infoln "Generating the orderer-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:6054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer.meatchain.cloud/tls" --enrollment.profile tls --csr.hosts orderer.meatchain.cloud --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the orderer2-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:6054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer2.meatchain.cloud/tls" --enrollment.profile tls --csr.hosts orderer2.meatchain.cloud --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  # Copy the tls CA cert, server cert, server keystore to well known file names in the orderer's tls directory that are referenced by orderer startup config
  cp "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer.meatchain.cloud/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer.meatchain.cloud/tls/ca.crt"
  cp "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer.meatchain.cloud/tls/signcerts/"* "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer.meatchain.cloud/tls/server.crt"
  cp "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer.meatchain.cloud/tls/keystore/"* "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer.meatchain.cloud/tls/server.key"

  # Copy the tls CA cert, server cert, server keystore to well known file names in the orderer's tls directory that are referenced by orderer startup config
  cp "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer2.meatchain.cloud/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer2.meatchain.cloud/tls/ca.crt"
  cp "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer2.meatchain.cloud/tls/signcerts/"* "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer2.meatchain.cloud/tls/server.crt"
  cp "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer2.meatchain.cloud/tls/keystore/"* "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer2.meatchain.cloud/tls/server.key"


  # Copy orderer org's CA cert to orderer's /msp/tlscacerts directory (for use in the orderer MSP definition)
  mkdir -p "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer.meatchain.cloud/msp/tlscacerts"
  cp "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer.meatchain.cloud/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer.meatchain.cloud/msp/tlscacerts/tlsca.meatchain.cloud-cert.pem"


# Copy orderer org's CA cert to orderer's /msp/tlscacerts directory (for use in the orderer MSP definition)
  mkdir -p "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer2.meatchain.cloud/msp/tlscacerts"
  cp "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer2.meatchain.cloud/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/meatchain.cloud/orderers/orderer2.meatchain.cloud/msp/tlscacerts/tlsca.meatchain.cloud-cert.pem"

  infoln "Generating the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:6054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/meatchain.cloud/users/Admin@meatchain.cloud/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/meatchain.cloud/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/meatchain.cloud/users/Admin@meatchain.cloud/msp/config.yaml"
}
