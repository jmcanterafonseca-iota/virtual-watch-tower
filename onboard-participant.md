# Participant onboarding instructions

## Generate a new IOTA Identity linked to a public certificate

### Create and register a new IOTA Identity

First

```sh
git clone -b stardust https://github.com/iotaledger/tangle.js
cd tangle.js/examples-stardust
npm install
npm run dist
```

then a `.env` file has to be prepared similar to (and written to the `examples-stardust` folder)

```sh
NODE_ENDPOINT="https://api.stable.iota-ec.net"
PLUGIN_ENDPOINT="${NODE_ENDPOINT}/api/ext/v1"
TOKEN="eyJ…"
```

To generate a new IOTA Identity the following instruction has to be executed:

```sh
node --loader=extensionless ./es/identity/createDIDWithJWKFundedByPluginEd25519Subtle.js "https://jmcanterafonseca-iota.github.io/virtual-watch-tower/public/certs/vwt-1.crt"
```

The URL specified must be the URL that will host the certificate associated with the Verification method added to the DID document. The certificate will be signed by a CA (for instance Let's Encrypt) or a testing CA, like the ones that can be created with [mkcert](https://github.com/FiloSottile/mkcert).

With that instruction a new IOTA Identity will be generated together with a Verification Method (bound to the corresponding DID document) that will be used to sign documents, etc. 

It is recommended to resolve the DID through the INX Identity plugin so that it is checked the confirmation of the transaction in the IOTA Ledger:

```sh
curl --location 'https://api.stable.iota-ec.net/api/ext/v1/identities/did:iota:ebsi:0x74e4ac1abc064b3fea1feb08dde20220418c4abdb478738075b869100143e408' \
--header 'Authorization: Bearer eyJ...' \
```

### Prepare the different assets

The JSON snippet at the end of the command line result, above ex. 

```json
{
  "did": "did:iota:ebsi:0x74e4ac1abc064b3fea1feb08dde20220418c4abdb478738075b869100143e408",
  "privateKeyDidControl": "0x5e239050f0d5129a245e731703f9dc397d8ee2716152a79741989fb68152b68244b32f5745c7b00a4bbf03acb73eca726e01bdf7f8ba43c31c711e32af0dfd98",
  "privateKeyJwk": {
    "key_ops": [
      "sign"
    ],
    "ext": true,
    "crv": "Ed25519",
    "d": "0d548fuZdis11a4zW_YTQfBtlmlLQEZARkBWhIajkKM",
    "x": "LS5i7_UP11u-Hx6V6IMMesMXhwcM1XfhQ56LlwCovXM",
    "kty": "OKP",
    "kid": "lYAEPQGdcH9crG0jqB_NcoYUYTnxU-BX1OI5PH3bHjw",
    "alg": "EdDSA",
    "use": "sig"
  },
  "privateKeyVerificationMethodRaw": "0xd1de78f1fb99762b35d5ae335bf61341f06d96694b4046404640568486a390a3",
  "publicKeyVerificationMethodRaw": "0x2d2e62eff50fd75bbe1f1e95e8830c7ac31787070cd577e1439e8b9700a8bd73"
}
```

has to be saved as this will be a file containing identity details that will be used later. During this tutorial guide we will name this file `identity.json`. An example can be found [here](./identities/vwt-1.json).

Additionally the output of the script above will contain the public key and the private key of the Verification method in PEM format. This is needed for OpenSSL in order to generate the corresponding certificate. For instance,

```text
-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEINHeePH7mXYrNdWuM1v2E0HwbZZpS0BGQEZAVoSGo5Cj
-----END PRIVATE KEY-----
```

```text
-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEALS5i7/UP11u+Hx6V6IMMesMXhwcM1XfhQ56LlwCovXM=
-----END PUBLIC KEY-----
```

### Generate a new certificate for the Identity's Verification Method

First of all a new CSR has to be generated using:

```sh
openssl req -new -key ./identity-dataset/pem-keys/vwt-1.example.org-key.pem -out req.pem
```

After executing this instruction, and filling all the CSR fields required, a new CSR `req.pem` will be created. Now the certificate has to be generated, signed by our CA. In this example we are going to use the mkcert CA, so the certificate is finally generated as follows:

```sh
mkcert -csr req.pem
```

Now a new certificate (in PEM format) has been generated and must be hosted at `https://jmcanterafonseca-iota.github.io/virtual-watch-tower/public/certs/vwt-1.crt` (or at the hosting site you own).

## Generate the credentials needed for compliance

In order to generate the Credentials needed for Compliance the `onboarding` tool is going to be used.

### Terms and Conditions (Self-signed)

The first credential to be generated is self-signed and it corresponds to the terms and conditions. For doing so a command line like the one below has to be executed:

Assuming the current working directory is `virtual-watch-tower`: 

```sh 
docker run -it -v ./identity-dataset:/ext --rm onboardingcli/onboardingcli vc create --claims-file /ext/claims/vwt-1-terms-conditions.json --template-file /ext/templates/template.json --subject-did-file /ext/identities/participants/vwt-1.json --trusted-issuer-file /ext/identities/participants/vwt-1.json --vc-version 2 --issuers-dir /ext/identities --templates-dir /ext/templates --vc-dir /ext/credentials
```

In essence, in order to generate a credential the Identity of the issuer, the Identity of the Subject (in this case are the same), the Credential template and the Credential's claims file have to be provided. You can observe that it is needed to map a volume of the Docker container into a local folder (`identity-dataset`) so that the Docker container can find the corresponding files.

After running the above command our first Credential will be available. You can observe that the Credential has been also encoded as JWT.

You can observe the claims of this credential [here](./identity-dataset/claims/vwt-1-terms-conditions.json).

### Legal Entity (Signed by TradeID)

This credential will contain the legal entity details of the participant. The issuer of this Credential is TradeID (a future onboarding platform under development by the TWIN Foundation). You can observe the claims of this credential [here](./identity-dataset/claims/vwt-1-legal-participant.json)

```sh 
docker run -it -v ./identity-dataset:/ext --rm onboardingcli/onboardingcli vc create --claims-file /ext/claims/vwt-1-legal-participant.json --template-file /ext/templates/template.json --subject-did-file /ext/identities/participants/vwt-1.json --trusted-issuer-file /ext/identities/tradeid.json --vc-version 2 --issuers-dir /ext/identities --templates-dir /ext/templates --vc-dir /ext/credentials
```

### Legal Registration Number (Signed by TWIN Notary)

Finally, the legal registration number credential attests what is the Legal Registration Number of the participant. This can be EORI number, Vat ID, LEI, etc. In this case it has been used as example the LEI Code of the RISE Institute. This Credential is signed by the TWIN Notary, a trusted service that bridges non-VC trust service providers, such as GLEIF to the VC data model and conventions. 

```sh
docker run -it -v ./identity-dataset:/ext --rm onboardingcli/onboardingcli vc create --claims-file /ext/claims/vwt-1-legal-registration-number.json --template-file /ext/templates/template.json --subject-did-file /ext/identities/participants/vwt-1.json --trusted-issuer-file /ext/identities/twin-notary.json --vc-version 2 --issuers-dir /ext/identities --templates-dir /ext/templates --vc-dir /ext/credentials
```

## Presenting the Credentials to the Clearing House for Checking Compliance

