import {
  app,
} from 'codehooks-js'

import { build_date } from './api/build_version_lib';

import api_test from './api/test'
import api_build_version from './api/build_version'
import api_qrcode_svg from './api/qrcode_svg'
import { api_read_item, api_write_item, api_delete_item } from './api/read_write_item'

// serve API routes ("X-api-key: xxxx" header required)
//   https://projectUniqueName.api.codehooks.io/dev/api/hello
app.get('/api/hello', async (req, res) => {
  let msg = 'hello from my CRUD server';
  res.send(msg + '\n')
})

app.get ('/api/build_version', async (req, res) => {
  res.set('x-version', `${build_date}`);
  res.json(api_build_version(req, res)); 
});

app.get ('/api/test', async (req, res) => { res.json(api_test(req, res)); });
app.post('/api/test', async (req, res) => { res.json(api_test(req, res)); });

// Use Crudlify to create a REST API for any collection
//app.crudlify({}, {prefix: "/crudapi"});


app.get ('/api/qrcode_svg', async (req, res) => {
  res.set('x-version', `${build_date}`);
  res.send(api_qrcode_svg(req, res)); 
});
app.get ('/read', async (req, res) => {
  res.set('x-version', `${build_date}`);
  res.set('content-type', 'text/html; charset=utf-8');
  const funres = await api_read_item(req, res); 
  res.send(funres);  // HTML code
});
app.post('/write', async (req, res) => {
  res.set('x-version', `${build_date}`);
  res.set('content-type', 'text/plain; charset=utf-8');
  const funres = await api_write_item(req, res); 
  res.send(funres);  // stored value (JSON)
});
app.post('/delete', async (req, res) => {
  res.set('x-version', `${build_date}`);
  res.set('content-type', 'text/plain; charset=utf-8');
  const funres = await api_delete_item(req, res); 
  res.send(funres);  // stored value (JSON)
});


// serve static assets/images, and cache for 1 hour
//   https://projectUniqueName.api.codehooks.io/dev      -> public/index.html
//   https://projectUniqueName.api.codehooks.io/dev/abc  -> public/abc
app.static({ route: '/', directory: '/public' }, (req, res, next) => {
 //  console.log('If you see this, the client cache is invalidated or called for the first time');
 //  const ONE_HOUR =  1000*60*60;
 //  res.set('Cache-Control', `public, max-age=${ONE_HOUR}, s-maxage=${ONE_HOUR}`);
 //  res.setHeader("Expires", new Date(Date.now() + ONE_HOUR).toUTCString());
 //  res.removeHeader('Pragma');
  next();
})


// bind to serverless runtime
export default app.init();
