/*
Get key/value:
curl -X GET  -H "X-api-key: x" .../api/read_write_item?action=read&key=abc123
returns: HTML page

Set key/value (with a TTL of a few days):
curl -X POST -H "X-api-key: x" .../api/read_write_item?action=read&key=abc123 \
  -H 'content-type: application/json' --data '{"value":"abcd"}'

returns: the value stored
  
*/
const keyspace = "kv_items";
import { Datastore } from 'codehooks-js';

export async function api_read_item(req, res) {
  let key = (req && req.query && req.query.key ? req.query.key : "unknown_key");

  const opt = {
    "keyspace": keyspace
  };

  const conn = await Datastore.open();
  const kval = await conn.get(key, opt);

  const HTML1 = '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-us"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Μήνυμα</title><style>body{font-family:Monospace,Mono;}</style></head><body><pre>';
  const HTML2 = '</pre></body></html>';
  return (HTML1 + escapeHtml(kval ? kval : '') + HTML2);


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




const ONE_DAY    = 86400000;     // 1000 * 60 * 60 * 24
const THREE_DAYS = 86400000 * 3; // 1000 * 60 * 60 * 24 * 3
export async function api_write_item(req, res) {
  let key = (req && req.query && req.query.key ? req.query.key : "unknown_key");

  const opt = {
    "ttl": THREE_DAYS, 
    "keyspace": keyspace
  };

  const conn = await Datastore.open();
  const result = await conn.set(
    key,
    (req && req.body && req.body.value ? req.body.value : ''),
   opt
  );

  return (result);

}
