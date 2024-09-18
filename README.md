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

## IOTA node

Please use the IOTA-EBSI sandbox endpoint (Stardust)

## Configuration

The needed `.env` and the configuration (JSON) are provided in this repository. 

An additional token is needed to get access to the IOTA Node and plugins. 


## Open APIs

There are different APIs. There are the supply chain specific APIs, see 

https://editor.swagger.io/?url=https://iotaledger.github.io/ebsi-stardust-components/public/openapi/open-api-aig-connector.json 

There are Node extensions APIs, for instance for Identity, see 

https://editor.swagger.io/?url=https://iotaledger.github.io/ebsi-stardust-components/public/openapi/inx-identity-spec-full.json

And there are the core IOTA Node APIs

https://editor.swagger.io/?url=https://raw.githubusercontent.com/iotaledger/tips/main/tips/TIP-0025/core-rest-api.yaml 

Bottom line, Yes you can use the testnet, but for convenience reasons the node version I am going to deliver to you is going to use the EBSI-IOTA sandbox 
(it is just an IOTA Stardust network but ready to be used by the VWT use case). 

For creating identities and verifiable credentials please check the examples, for instance:

https://github.com/iotaledger/tangle.js/blob/stardust/examples-stardust-inx/src/identity/createDIDFundedByPlugin.ts 

https://github.com/iotaledger/tangle.js/blob/stardust/examples-stardust-inx/src/credential/createVCWithIOTAIdentity.ts


## Other examples


