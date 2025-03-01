/* curl -H "X-api-key: xxx" .../api/qrcode_svg?endpoint=read&key=abc123

returns:
  an SVG with the QR-code for "https://<this_hostname>/<path_to_api>/endpoint
*/
export default function(req, res) {
  let key = (req && req.query && req.query.key ? req.query.key : "unknown_key");
  let endpoint = (req && req.query && req.query.endpoint ? req.query.endpoint : "unknown_endpoint");
  let hostname = (req && req.hostname ? req.hostname : "unknown-hostname");
  let path = (req && req.query && req.path ? req.path : "unknown_path");

  var QRCode = require("qrcode-svg");
  var qrcode = new QRCode({
    content: 
      "https://" + hostname +
      path.replace(/[^\/]*$/,"") +
      endpoint + "?key=" + encodeURIComponent(key),
    join: true,
    container: "svg-viewbox" //Useful but not required
  }).svg();

  return (qrcode);
}
