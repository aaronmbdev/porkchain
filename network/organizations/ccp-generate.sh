#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=Farm
P0PORT=7051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/farm.meatchain.cloud/tlsca/tlsca.farm.meatchain.cloud-cert.pem
CAPEM=organizations/peerOrganizations/farm.meatchain.cloud/ca/ca.farm.meatchain.cloud-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/farm.meatchain.cloud/connection-farm.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/farm.meatchain.cloud/connection-farm.yaml

ORG=Factory
P0PORT=9051
CAPORT=8054
PEERPEM=organizations/peerOrganizations/factory.meatchain.cloud/tlsca/tlsca.factory.meatchain.cloud-cert.pem
CAPEM=organizations/peerOrganizations/factory.meatchain.cloud/ca/ca.factory.meatchain.cloud-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/factory.meatchain.cloud/connection-factory.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/factory.meatchain.cloud/connection-factory.yaml
