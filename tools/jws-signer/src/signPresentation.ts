import { JsonWebSignature2020Signer } from "@gaia-x/json-web-signature-2020";
import { Signer } from "@gaia-x/json-web-signature-2020/dist/src/signer/signer";
import { importPKCS8 } from 'jose';
import * as dotenv from "dotenv";
import { readFile } from "node:fs/promises";


async function main() {
  dotenv.config();

  const credential: {[key: string]: unknown} = JSON.parse((await readFile(process.argv[2])).toString());

  const presentation = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1"
    ],
    "id": "urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5",
    "type": ["VerifiablePresentation"],
    "verifiableCredential": [credential],
    "holder": credential["issuer"]
  };

  const privateKeyPem = process.env.PRIVATE_KEY ?? "";
  const verificationMethod = process.env.VER_METHOD ?? "";

  const signer: Signer = new JsonWebSignature2020Signer({
    privateKey: await importPKCS8(privateKeyPem, 'RS256'),
    privateKeyAlg: 'RS256',
    verificationMethod
  })

  const doc = await signer.sign(presentation);

  console.log(JSON.stringify(doc));
}

main().then(() => console.log("done")).catch((err) => console.error(err));
