export default function (req, res) {
  return (req);
}




///////    curl -H "X-api-key: $TOKEN_RO" .../api/test?x=abc
// {
//   "_events": {},
//   "_eventsCount": 0,
//   "hostname": "projectUniqueName.api.codehooks.io",
//   "headers": {
//     "host": "projectUniqueName.api.codehooks.io",
//     "x-request-id": "ea4d0a24dabcaa11f9aa979b872d162b",
//     "x-real-ip": "123.197.60.219",
//     "x-forwarded-for": "123.197.60.219",
//     "x-forwarded-host": "projectUniqueName.api.codehooks.io",
//     "x-forwarded-port": "443",
//     "x-forwarded-proto": "https",
//     "x-forwarded-scheme": "https",
//     "x-scheme": "https",
//     "user-agent": "curl/7.52.1",
//     "accept": "*/*",
//     "x-api-key": "013605c2-3e44-4752-92b7-6c2a0e6f1d21"
//   },
//   "query": {
//     "x": "abc"
//   },
//   "path": "/dev/api/hello",
//   "apiPath": "/api/hello",
//   "originalUrl": "/dev/api/hello?x=abc",
//   "params": null,
//   "body": {},
//   "method": "GET",
//   "referrer": null
// }


///////    curl -H "X-api-key: $TOKEN_RW" -H "Content-Type: application/json" \
///////        .../api/test?x=abc --data '{"y":2.1}'
/////// !!! no reply to application/x-www-form-urlencoded POSTs !!!
// {
//   "_events": {},
//   "_eventsCount": 0,
//   "hostname": "projectUniqueName.api.codehooks.io",
//   "headers": {
//     "host": "projectUniqueName.api.codehooks.io",
//     "x-request-id": "R9fefaea097420ff84738893d2cc11431",
//     "x-real-ip": "123.107.101.19",
//     "x-forwarded-for": "123.107.101.19",
//     "x-forwarded-host": "projectUniqueName.api.codehooks.io",
//     "x-forwarded-port": "443",
//     "x-forwarded-proto": "https",
//     "x-forwarded-scheme": "https",
//     "x-scheme": "https",
//     "content-length": "9",
//     "user-agent": "curl/7.52.1",
//     "accept": "*/*",
//     "x-api-key": "160efe6e-ccea-4253-a831-af7f42fa702d",
//     "content-type": "application/json"
//   },
//   "query": {
//     "x": "3"
//   },
//   "path": "/dev/api/test",
//   "apiPath": "/api/test",
//   "originalUrl": "/dev/api/test?x=3",
//   "params": null,
//   "body": {
//     "y": 2.1
//   },
//   "method": "POST",
//   "referrer": null
// }
