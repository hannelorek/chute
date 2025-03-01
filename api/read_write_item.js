/*
Get key/value:
curl -X GET  -H "X-api-key: x" .../api/read_write_item?action=read&key=abc123
returns: HTML page

Set key/value (with a TTL of a few days):
curl -X POST -H "X-api-key: x" .../api/read_write_item?action=read&key=abc123 \
  -H 'content-type: application/json' --data '{"value":"abcd"}'

returns: the value stored
*/

import { Datastore } from 'codehooks-js';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
const keyspace = "kv_items";
const encryption_cipher = 'aes-256-cbc';

export async function api_read_item(req, res) {
  let key = (req && req.query && req.query.key ? req.query.key : "unknown_key");

  const opt = {
    "keyspace": keyspace
  };

  const conn = await Datastore.open();
  const kval = await conn.get(key, opt);
  let kvObj = {};
  try { kvObj = JSON.parse(kval) } catch (e) { /* ignore error */ }
console.log("kvObj", JSON.stringify(kvObj));
  let plaintext_value = "";
console.log("key length", process.env.STORED_KEYVALUE_ENC_KEY.length);
  if (kvObj.ivHex && kvObj.enc_dataHex) {
    const decipher = createDecipheriv(
      encryption_cipher,
      Buffer.from(process.env.STORED_KEYVALUE_ENC_KEY, 'hex'),
      Buffer.from(kvObj.ivHex, 'hex')
    );
    let plaintext_value = decipher.update(kvObj.enc_dataHex, 'hex', 'utf8');
console.log("in 10", plaintext_value.length);
    plaintext_value += decipher.final('utf8');
console.log("in 20", plaintext_value.length);
  }

  return (
   '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-us"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Μήνυμα</title><style>body{font-family:Monospace,Mono;}</style></head><body><pre>' +
   escapeHtml(plaintext_value ? plaintext_value : '') +
   '</pre></body></html>' + '\n'
  );


  function escapeHtml(text) {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return (text.replace(/[&<>"']/g, (match) => entities[match]));
  }

}




const THREE_DAYS = 86400000 * 3; // 1000 * 60 * 60 * 24 * 3   milliseconds
export async function api_write_item(req, res) {
  let key = (req && req.query && req.query.key ? req.query.key : "unknown_key");

  const opt = {
    "ttl": THREE_DAYS, 
    "keyspace": keyspace
  };

  const conn = await Datastore.open();
  const ivHex = randomBytes(16).toString('hex');
  const cipher = createCipheriv(
    encryption_cipher,
    Buffer.from(process.env.STORED_KEYVALUE_ENC_KEY, 'hex'),
    Buffer.from(ivHex, 'hex')
  );
  let enc_dataHex = cipher.update(
    (req && req.body && req.body.value ? req.body.value : ''),
    'utf8', 'hex');
  enc_dataHex += cipher.final('hex');

  const result = await conn.set(
    key,
    JSON.stringify( { "ivHex": ivHex, "enc_dataHex": enc_dataHex } ),
   opt
  );

  return (result);
}
