/*
curl -X GET  -H "X-api-key: x" .../api/read_write_item?action=read&key=abc123
curl -X POST -H "X-api-key: x" .../api/read_write_item?action=read&key=abc123 \
  -H 'content-type: application/json' --data '{"data":"abcd"}'

returns:
  
*/
import { Datastore } from 'codehooks-js';

export async function api_read_item(req, res) {
  let key = (req && req.query && req.query.key ? req.query.key : "unknown_key");

  const conn = await Datastore.open();
  const kval = await conn.get(key);

  const HTML1 = '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-us"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>������</title></head><body><pre>';
  const HTML2 = '</pre></body></html>';

  return (HTML1 + escapeHtml(kval) + HTML2);


  function escapeHtml(text) {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, (match) => entities[match]);
  }

}

export async function api_write_item(req, res) {
  let key = (req && req.query && req.query.key ? req.query.key : "unknown_key");

  const conn = await Datastore.open();
  const result = await conn.set(
    key,
    (req && req.body && req.body.data ? req.body.data : '')
  );

  return (result);

}
