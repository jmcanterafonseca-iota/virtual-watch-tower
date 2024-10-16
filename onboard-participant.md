# Participant onboarding instructions

## Generate a new IOTA Identity linked to a public certificate

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
node --loader=extensionless ./es/identity/createDIDWithJWKFundedByPluginEd25519Subtle.js "https://jmcanterafonseca-iota.github.io/virtual-watch-tower/public/certs/vwt-2.crt"
```

The URL specified must be the URL that will host the certificate associated with the Verification method added to the DID document. The certificate will be signed by a CA (for instance Let's Encrypt) or a testing CA, like the ones that can be created with [mkcert](https://github.com/FiloSottile/mkcert).

With that instruction a new IOTA Identity will be generated together with a Verification Method that will be used to sign documents, etc. 

The JSON snippet at the end of the command line result, ex. 

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

```

```