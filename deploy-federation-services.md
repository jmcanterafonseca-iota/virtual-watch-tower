# Deployment

## Federation Services

### Gaia-X Compliance Service

Use the [Docker Compose](/docker/gx-compliance/docker-compose-vwt-gx-compliance.yml).

It is also needed :

* `.env` similar to the one provided [here](./docker/gx-compliance/.env.docker)
* `rootCA` so that Participants Certificates are accepted. The example [rootCA](./docker/gx-compliance/certs/rootCA.pem) used during Workshops is also provided.
* A Token to get access to the IOTA-EBSI sandbox.

### Federated Catalogue

Use the [Docker Compose](/docker/fed-catalogue/docker-compose-vwt-fed-catalogue.yml).

It is also needed :

* `.env` similar to the one provided [here](./docker/fed-catalogue/.env.docker)
* A Token to get access to the IOTA-EBSI sandbox.

## Other tools needed

### Signing tool

The signing tool can be used from Docker as follows. 

* First of all due to docker `.env` processing limitations the `.env` has to be exported to the current shell using:

```sh
. .env
```

Afterwards a Credential can be signed as follows:

```sh
docker run -it -v .:/ext --rm --env PRIVATE_KEY="$PRIVATE_KEY" --env VER_METHOD="$VER_METHOD" --env KEY_TYPE="$KEY_TYPE"  iotazebra/jws-signer /ext/identity-dataset/credentials/vwt-1/vwt-1-terms-conditions-credential.json
```
