# Service onboarding instructions

Through this procedure a new Service and accompanying Data Resource can be onboarded. The current assumption / limitation is that a TLIP Node offers one Service and one Data Resource through an endpoint.

## Prerequisites

A Participant (the Service Provider) has already been registered following the [Participant Onboarding](./onboard-participant.md) steps. Thus, Participant's Identity is known. 

## Generate the credentials needed for Service compliance

In order to generate the Credentials needed for Compliance the `onboarding` tool is going to be used.

### Service Description Credential (Self-signed)

The first credential to be generated is self-signed and it corresponds to the Service Credential. This Credential describes a Service provided by the Participant and its Policies that determine which other Participants can consume the service. 

Assuming the current working directory is `virtual-watch-tower`: 

```sh 
docker run -it -v ./identity-dataset:/ext --rm onboardingcli/onboardingcli vc create --claims-file /ext/claims/services/vwt-1-item-service.json --template-file /ext/templates/template.json --subject-did-file /ext/identities/participants/vwt-1.json --trusted-issuer-file /ext/identities/participants/vwt-1.json --vc-version 2 --issuers-dir /ext/identities --templates-dir /ext/templates --vc-dir /ext/credentials
```

In essence, in order to generate a credential the Identity of the issuer, the Identity of the Subject (in this case are the same), the Credential template and the Credential's claims file have to be provided. You can observe that it is needed to map a volume of the Docker container into a local folder (`identity-dataset`) so that the Docker container can find the corresponding files.

After running the above command our first Credential will be available. You can observe that the Credential has been also encoded as JWT.

You can observe the claims of this credential [here](./identity-dataset/claims/services/vwt-1-item-service.json).

### Data Resource Credential (Self-Signed)

This credential will contain details about a Data Resource associated with and aggregated by the Service Offering above. This data resource will contain the endpoint of the TLIP Node offered to the outside world (see `gx:exposedThrough` property). This Data Resource Credential can be reused by other Service Offering that could be incarnated by the same TLIP Node.

You can observe the claims of this credential [here](./identity-dataset/claims/services/vwt-1-tlip-node-resource.json).

```sh 
docker run -it -v ./identity-dataset:/ext --rm onboardingcli/onboardingcli vc create --claims-file /ext/claims/services/vwt-1-tlip-node-resource.json --template-file /ext/templates/template.json --subject-did-file /ext/identities/participants/vwt-1.json --trusted-issuer-file /ext/identities/participants/vwt-1.json --vc-version 2 --issuers-dir /ext/identities --templates-dir /ext/templates --vc-dir /ext/credentials
```

## Presenting the Credentials to the Clearing House for Checking Compliance

Now that the thwo needed Credentials are available they need to be presented to the Clearing House. The Clearing House (based on Gaia-X open source components) needs those credentials wrapped into a Verifiable Presentation signed by the holder (by our Participant). In order to generate such a VP is is needed to execute the following instruction:

```sh
docker run -it -v ./identity-dataset:/ext --rm onboardingcli/onboardingcli vp create --holder-identity-file /ext/identities/participants/vwt-1.json --vc-version 2 --vc-file /ext/credentials/services/vwt-1/vwt-1-service-offering-credential.json --vc-file /ext/credentials/services/vwt-1/vwt-1-tlip-node-resource-credential.json 
```

Once the VP is available (as JWT) it has to be presented to the Clearing House through the following API call:

```sh
curl --location 'http://localhost:3005/api/credential-offers?vcid=https%3A%2F%2Fvwt-1.example.org%2Fcredentials%2Fservice-compliance-credential.json' \
--header 'Content-Type: application/jwt' \
--data 'eyJhbGciOiJFZERT...'
```

As a result a Service Compliance Credential, VC, will be issued, as follows.

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://w3id.org/gaia-x/development#"
  ],
  "type": [
    "VerifiableCredential",
    "gx:ComplianceCredential"
  ],
  "id": "https://vwt-1.example.org/credentials/service-compliance-credential.json",
  "issuer": "did:web:iotaledger.github.io:ebsi-stardust-components:public:gaia-x:web:twin:dch",
  "validFrom": "2024-10-24T08:20:42.155Z",
  "validUntil": "2025-01-22T09:20:42.147Z",
  "credentialSubject": {
    "id": "https://vwt-1.example.org/credentials/service-compliance-credential.json#cs",
    "gx:evidence": [
      {
        "id": "https://jmcanterafonseca-iota.github.io/virtual-watch-tower/public/credentials/vwt-1/serviceOfferingVC.json",
        "type": "gx:ComplianceEvidence",
        "gx:integrity": "sha256-f19e575c8a13d5ab071ef622d0275584adbcb655530cd91637eb1f7b8e43009e",
        "gx:integrityNormalization": "RFC8785:JCS",
        "gx:engineVersion": "2.2.0",
        "gx:rulesVersion": "PRLD-24.04_pre",
        "gx:originalType": "gx:ServiceOffering"
      },
      {
        "id": "https://jmcanterafonseca-iota.github.io/virtual-watch-tower/public/credentials/vwt-1/tlipNodeResourceVC.json",
        "type": "gx:ComplianceEvidence",
        "gx:integrity": "sha256-ea9a3dc7b381ae4796413a9bcbbc5171bf823601ed5f7907bbb6a753a35e3fcb",
        "gx:integrityNormalization": "RFC8785:JCS",
        "gx:engineVersion": "2.2.0",
        "gx:rulesVersion": "PRLD-24.04_pre",
        "gx:originalType": "gx:DataResource"
      }
    ]
  }
}
```

 Such a Compliance Credential contains references (points to) the original Credentials that were issued formerly. That's why in order to enable the verification of this Compliance Credential it is needed to publish those Credentials following the steps below.

## Publication of the original Credentials

It is mandatory before the publication of the original Credentials is to add a JWS Signature to them, as the JSON-LD credential originally was not signed by the onboarding tool (we only have a JWT Credential signed). For doing so the following steps are needed:

```sh
git clone https://github.com/jmcanterafonseca-iota/virtual-watch-tower
cd tools/jws-signer
npm install
npm run build
```

Afterwards it is needed to set up a `.env` file with the verification method of the signer and the private key. See example [here](./tools/jws-signer/env.example).

So for signing the terms and conditions credentials we will set a `.env` as follows:

```sh
VER_METHOD="did:iota:ebsi:0x74e4ac1abc064b3fea1feb08dde20220418c4abdb478738075b869100143e408#lYAEPQGdcH9crG0jqB_NcoYUYTnxU-BX1OI5PH3bHjw"
KEY_TYPE='EdDSA'
PRIVATE_KEY='-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEINHeePH7mXYrNdWuM1v2E0HwbZZpS0BGQEZAVoSGo5Cj
-----END PRIVATE KEY-----'
```

Then for signing we will execute

```sh
node ./dist/signCredential.js ../../identity-dataset/credentials/vwt-1/vwt-1-terms-conditions-credential.json
```

The result will be the same credential in JSON-LD format but adding the corresponding proof as a JsonWeb2020 proof. Afterwards, the result (JSON-LD content) shall be copied to the corresponding hosting site, so that the Credential is available to be dereferenced through the Web. 

The same process shall be repeated with the legal entity credential and with the legal registration number credentials. However in those cases the `VER_METHOD` will be different so the `PRIVATE_KEY`. 

For the legal Participant credential the verification method shall be the one from TradeID. i.e. `did:web:iotaledger.github.io:ebsi-stardust-components:public:gaia-x:web:twin:tradeid#3gsxoxHO5KgTlR2jPWJyk4HOWpzlzYsHnUqYOEeNQO0` and the `KEY_TYPE` must be `RS256`.

For the legal Registration Number credential the verification method shall be the one from the TWIN Notary i.e. `did:web:iotaledger.github.io:ebsi-stardust-components:public:gaia-x:web:twin:notary#iwoi2hSS6sBeI7eimkgqyXyB1wEUFQ4oESTa7crdz_s` and the `KEY_TYPE` must be `RS256`.

And their respective private keys the ones found under the [pem-keys](./identity-dataset/pem-keys/) folder.

At the end of this process there shall be three different credentials hosted as it happens in our example at [./docs/public/credentials/vwt-1/](./docs/public/credentials/vwt-1/).

## Presenting the Compliance Credential to the Federated Catalogue Registry

The last step is to present the Compliance Credential (already obtained, see for example [vwt-1-service-compliance-credential.json](./identity-dataset/credentials/compliance/vwt-1-service-compliance-credential.json)) to the Federated Catalogue Registry. This component is being developed by the IOTA Foundation. The API REST call is as follows:

```sh
curl --location 'http://localhost:3020/fed-catalogue/participant-credentials' \
--header 'Content-Type: application/jwt' \
--data 'eyJhbGciOiJSUzI1NiIsImlzcyI6ImRpZDp3ZWI6aW90YWxlZGdlci5naXRodWIuaW86ZWJzaS1zdGFyZHVzdC1jb21wb25lbnRzOnB1YmxpYzpnYWl...'
```

If the API call is successful then the new Service and Data Resource will be on boarded and will appear among the known Services and Data Resources in the Federated Catalogue Registry.

```sh
curl --location 'http://localhost:3020/fed-catalogue/services?providedBy=did%3Aiota%3Aebsi%3A0x74e4ac1abc064b3fea1feb08dde20220418c4abdb478738075b869100143e408'
```

will result in

```json

```

