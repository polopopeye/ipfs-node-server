import { create } from 'ipfs-core';
import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';

const app = express();
app.use(fileUpload());
app.use(cors());
process.setMaxListeners(0);
//

const port = 3005;

const ipfs = await create({
  repo: 'ipfs-repo3',
  //   config: ipfsConfig,
});

// get the api link of ipfs
const api = await ipfs.config.get('Addresses.API');
console.log(`fastlog => ipfs api`, api);
// const ipfs = await create();

// set cors headers ipfs
// ipfs.config.set('API.HTTPHeaders.Access-Control-Allow-Origin', [
//   'http://localhost:3000',
//   'http://localhost:3005',
//   'http://localhost:4003',
//   'http://localhost:5001',
//   'https://webui.ipfs.io/',
// ]);
ipfs.config.set('API.HTTPHeaders.Access-Control-Allow-Origin', [
  'webui://-',
  'http://localhost:3000',
  'http://127.0.0.1:5001',
  'https://webui.ipfs.io',
]);
ipfs.config.set('API.HTTPHeaders.Access-Control-Allow-Methods', [
  'PUT',
  'GET',
  'POST',
  'OPTIONS',
]);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/ipfs', async (req, res) => {
  // show basic informations about the node
  const id = await ipfs.id();
  console.info(id);

  //   get the api link of ipfs
  const api = await ipfs.config.get('Addresses.API');
  console.log(`fastlog => api`, api);

  res.send(api);
});

app.post('/upload', async (req, res) => {
  req.on('aborted', () => {
    console.log(`fastlog => aborted`);
  });
  req.on('error', (err) => {
    console.log(`fastlog => error`, err);
  });
  // we get the buffer of the file
  // const buffer = req.data;
  // console.log(`fastlog => buffer:`, buffer);

  const buffer = [];
  req.on('data', (chunk) => {
    console.log(`fastlog => chunk:`, chunk);
    buffer.push(chunk);
  });

  req.on('end', async () => {
    // get data uint8array

    const file = Buffer.concat(buffer);
    console.log(`fastlog => file:`, file);

    const fileUint8Array = new Uint8Array(file);
    console.log(`fastlog => fileUint8Array:`, fileUint8Array);

    // we add the file to the IPFS network
    const result = await ipfs.add(fileUint8Array);
    console.log(`fastlog => result:`, result);

    // we send the CID back to the user
    res.send(result.cid.toString());
  });
});

app.get('/download/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const file = await ipfs.cat(cid, {
      timeout: 10000,
    });
    console.log(`fastlog => file`, file);

    res.send(file);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching file from IPFS');
  }

  console.log(' - file downloaded');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
