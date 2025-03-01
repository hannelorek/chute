/*
Set key/value (with a TTL of a few days):
  curl -X POST -H "X-api-key: x" .../write?key=abc123 \
    -H 'content-type: application/json' --data '{"value":"abcd"}'
returns: {"ivHex":"8293ef4e5ecf7af47b7c60443b0a2d1f"}
         (this is the IV used to encrypt the stored data)


Get key/value:
  curl -X GET  -H "X-api-key: x" .../read?key=abc123
returns:
{
  "created_at": "ISO date string",
  "created_at_localtime": "�������, 6 ����������� 2010 18:31 +0200",
  "message": "abcd"
}


Delete key/value:
  curl -X DELETE -H "X-api-key: x" .../delete?key=abc123
returns: "abc123 deleted"  or  "could not delete abc123"
*/

const N_DAYS = 3;
const TTL_MILLISECONDS = N_DAYS * 24 * 60 * 60 * 1000;

import { Datastore } from 'codehooks-js';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
const keyspace = "kv_items";
const encryption_cipher = 'aes-256-cbc';

export async function api_read_item(req, res) {
  // get key from URL parameters
  let key = (req && req.query && req.query.key ? req.query.key : "unknown_key");
  let hostname = (req && req.hostname ? req.hostname : "unknown-hostname");
  let path = (req && req.query && req.path ? req.path : "unknown_path");
  const url_delete =
    "https://" + hostname +
    path.replace(/[^\/]*$/,"") +
    'delete' + "?key=" + encodeURIComponent(key);


  const opt = { "keyspace": keyspace };

  const conn = await Datastore.open();
  const kval = await conn.get(key, opt);
  let kvObj = {};
  try { kvObj = JSON.parse(kval) } catch (e) { /* ignore error */ }
  let plaintext_value = "";
  if (kvObj && kvObj.ivHex && kvObj.enc_dataHex) {
    const decipher = createDecipheriv(
      encryption_cipher,
      Buffer.from(process.env.STORED_KEYVALUE_ENC_KEY, 'hex'),
      Buffer.from(kvObj.ivHex, 'hex')
    );
    plaintext_value = decipher.update(kvObj.enc_dataHex, 'hex', 'utf8');
    plaintext_value += decipher.final('utf8');
  }

  return (plaintext_value);  // a JSON string
}




export async function api_write_item(req, res) {
  // get key from URL parameters
  let key = (req && req.query && req.query.key ? req.query.key : "unknown_key");

  const opt = { "ttl": TTL_MILLISECONDS, "keyspace": keyspace };

  const tz = require("timezone/loaded");
  const now = new Date().toISOString();
  const now_string = tz(now, 
    '%A, %e %B %Y %H:%M %z', // Δευτέρα,  3 Φεβρουάριος 2010 14:31 +0200
    'el_GR', 'Europe/Athens')
    .replace(",  ", ", ")                // Δευτέρα, 3 Φεβρουάριος 2010 14:31 +0200
    .replace('Ιανουάριος', 'Ιανουαρίου')
    .replace('Φεβρουάριος', 'Φεβρουαρίου')
    .replace('Μάρτιος', 'Μαρτίου')
    .replace('Απρίλιος', 'Απριλίου')
    .replace('Μάιος', 'Μαΐου')
    .replace('Ιούνιος', 'Ιουνίου')
    .replace('Ιούλιος', 'Ιουλίου')
    .replace('Αύγουστος', 'Αυγούστου')
    .replace('Σεπτέμβριος', 'Σεπτεμβρίου')
    .replace('Οκτώβριος', 'Οκτωβρίου')
    .replace('Νοέμβριος', 'Νοεμβρίου')
    .replace('ΞΞ΅ΞΊΞ­ΞΌΞ²ΟΞΉΞΏΟ', 'ΞΞ΅ΞΊΞ΅ΞΌΞ²ΟΞ―ΞΏΟ');

  const conn = await Datastore.open();
  const ivHex = randomBytes(16).toString('hex');
  const cipher = createCipheriv(
    encryption_cipher,
    Buffer.from(process.env.STORED_KEYVALUE_ENC_KEY, 'hex'),
    Buffer.from(ivHex, 'hex')
  );
  let enc_dataHex = cipher.update(JSON.stringify({
      "created_at": now,
      "created_at_localtime": now_string,
      "message": (req && req.body && req.body.value ? req.body.value : '')
    }),
    'utf8', 'hex');
  enc_dataHex += cipher.final('hex');

  await conn.set(
    key,
    JSON.stringify( { "ivHex": ivHex, "enc_dataHex": enc_dataHex } ),
    opt
  );

  return ({
    ivHex,
  //enc_dataHex  // don't return the stored (encrypted) data; it may be too big
  });
}




export async function api_delete_item(req, res) {
  // get key from URL parameters
  let key = (req && req.query && req.query.key ? req.query.key : "unknown_key");

  const opt = { "keyspace": keyspace };

  const conn = await Datastore.open();
  const result = await conn.del(key, opt);

  return (result ? `${result} deleted\n` : `could not delete ${result}\n`);
}
