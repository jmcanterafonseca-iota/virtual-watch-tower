import { JsonWebSignature2020Signer } from "@gaia-x/json-web-signature-2020";
import { Signer } from "@gaia-x/json-web-signature-2020/dist/src/signer/signer";
import { importPKCS8 } from 'jose';
import * as dotenv from "dotenv";
import { readFile } from "node:fs/promises";


async function main() {
  dotenv.config();

  const credentialWrapper: {[key: string]: unknown} = JSON.parse((await readFile(process.argv[2])).toString());

  const privateKeyPem = process.env.PRIVATE_KEY ?? "";
  const verificationMethod = process.env.VER_METHOD ?? "";
  const keyType = process.env.KEY_TYPE ?? 'RS256';

  const signer: Signer = new JsonWebSignature2020Signer({
    privateKey: await importPKCS8(privateKeyPem, keyType),
    privateKeyAlg: keyType,
    verificationMethod
  });

  const doc = await signer.sign(credentialWrapper.credential ?? credentialWrapper);

  console.log(JSON.stringify(doc));
}

main().then(() => console.log("done")).catch((err) => console.error(err));
