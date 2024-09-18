# Launching a TLIP Node

## Supply chain node

```sh
docker compose -f docker-compose-vwt.yml up -d
```

Afterwards the node has to be bootstrapped as follows:

```sh
curl --location 'http://localhost:4000/bootstrap' \
--header 'x-api-key: 3213833fdcf9842e07d3a6584769c380'
```

### Configuration

The needed `.env` and the configuration (JSON) are provided in this repository. 

An additional token is needed to get access to the IOTA Node and plugins. 

## IOTA node

Please use the IOTA-EBSI sandbox endpoint (Stardust)

## Open APIs

There are different APIs. There are the supply chain specific APIs, see 

https://editor.swagger.io/?url=https://iotaledger.github.io/ebsi-stardust-components/public/openapi/open-api-aig-connector.json 

There are Node extensions APIs, for instance for Identity, see 

https://editor.swagger.io/?url=https://iotaledger.github.io/ebsi-stardust-components/public/openapi/inx-identity-spec-full.json

And there are the core IOTA Node APIs

https://editor.swagger.io/?url=https://raw.githubusercontent.com/iotaledger/tips/main/tips/TIP-0025/core-rest-api.yaml 

Bottom line, Yes you can use the testnet, but for convenience reasons the node version I am going to deliver to you is going to use the EBSI-IOTA sandbox 
(it is just an IOTA Stardust network but ready to be used by the VWT use case). 

## Examples

### Identity

For creating identities and verifiable credentials please check the examples, for instance:

https://github.com/iotaledger/tangle.js/blob/stardust/examples-stardust-inx/src/identity/createDIDFundedByPlugin.ts 

https://github.com/iotaledger/tangle.js/blob/stardust/examples-stardust-inx/src/credential/createVCWithIOTAIdentity.ts

### Consignment Creation through TLIP Connector

```sh
curl --location 'http://localhost:4000/tlip-connector/notify' \
--header 'Content-Type: application/json' \
--header 'x-api-key: 3213833fdcf9842e07d3a6584769c380' \
--data-raw '{
    "@context": [
        "https://www.w3.org/ns/activitystreams",
        "https://w3id.org/opengtsc",
        "https://vocabulary.uncefact.org/unece-context.jsonld"
    ],
    "generator": "did:iota:ebsi:0xb62afcd0150d048ea0679af61d28d0eb1ad1b969f411b03997194df232b27383",
    "id": "https://tlip.example.org/act7",
    "type": "Create",
    "actor": {
        "type": "Organization",
        "id": "did:iota:ebsi:0xb62afcd0150d048ea0679af61d28d0eb1ad1b969f411b03997194df232b27383"
    },
    "object": {
        "type": "Consignment",
        "globalId": "UCR2022KE45678999027",
        "exporterParty": {
            "identificationId": "P051219453I",
            "identificationType": "KRA_PIN_Number"
        },
        "exportTypeCode": "09011100",
        "destinationCountry": {
            "type": "Country",
            "countryId": "unece:CountryId#GB"
        }
    },
    "updated": "2021-12-12T12:12:12Z"
}'
```

### List consignments in the system

```sh
curl --location 'http://localhost:4000/tlip/consignments' \
--header 'x-api-key: 3213833fdcf9842e07d3a6584769c380'
```

