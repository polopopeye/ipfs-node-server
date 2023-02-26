import { File } from '../schema/file.schema.js';
import asyncIteratorToStream from 'async-iterator-to-stream';
import { Multiaddr } from 'multiaddr/src/index.js';

export const uploadFileToIPFS = async (req, res, { ipfs }) => {
  req.on('aborted', () => {
    console.log(`fastlog => aborted fileUpload`);
  });
  req.on('error', (err) => {
    console.log(`fastlog => error fileUpload`, err);
  });

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
    res.send({
      cid: result.cid.toString(),
      size: result.size,
    });
  });
};

export const downloadFileFromIpfs = async (req, res, { ipfs }) => {
  const { cid } = req.params;
  const { address } = req.body;

  if (address && address.length > 0) {
    await address.forEach(async (addr) => {
      console.log(`fastlog => addr:`, addr);
      const multiAddr = new Multiaddr(addr);
      console.log(`fastlog => multiAddr:`, multiAddr);

      const peer = await ipfs.swarm.connect(multiAddr);

      console.log(`fastlog => peer:`, peer);
    });
  }

  console.log(`fastlog => cid:`, cid);
  const stream = ipfs.cat(cid);

  const ipfsStream = asyncIteratorToStream(stream);
  // res.send(ipfsStream);

  req.on('aborted', () => {
    console.log(`fastlog => aborted fileDownload`);
    res.end();
  });
  req.on('error', (err) => {
    console.log(`fastlog => error fileDownload`, err);
  });

  ipfsStream
    .on('data', (chunk) => {
      console.log(`fastlog => chunk:`, chunk);
      res.write(chunk);
    })
    .on('error', (err) => {
      console.log(`fastlog => err:`, err);
    })
    .on('abort', () => {
      console.log(`fastlog => abort`);
    })
    .on('close', () => {
      console.log(`fastlog => close`);
    })
    .on('end', (data) => {
      res.end();
      console.log(`fastlog => end`);
    });

  // stream.on('data', (chunk) => {
  //   console.log(`fastlog => chunk:`, chunk);
  //   res.send(chunk);
  // });

  // const data = await stream.next();

  // console.log(`fastlog => data:`, data);

  // res.on('data', (chunk) => {
  //   console.log(`fastlog => chunk:`, chunk);
  //   res.send(chunk);
  // });

  // const decoder = new TextDecoder('utf-8');
  // let data = '';

  // for await (const chunk of stream) {
  //   data += decoder.decode(chunk);
  // }

  // res.send(data);
};

export const uploadFileInfoToDB = async (req, res) => {
  const { cid } = req.params;

  if (!req.body) res.status(400).send('Missing file info');

  const { name, size, type, description, tags, cover, owner } = req.body;

  const file = {
    cid,
    name,
    description,
    tags,
    size,
    type,
    cover,
    owner,
  };

  if (!name || !size || !type || !description || !tags || !cover) {
    res.status(400).send('Missing file info');
  }
  if (!cid) {
    res.status(400).send('Missing file CID');
  }

  new File(file).save((err, file) => {
    if (err) {
      console.log(`fastlog => err`, err);
      res.status(500).send('Error saving file to DB');
    }
    console.log(`fastlog => file`, file);
    res.send(file);
  });
};

export const getFilesFromDB = async (req, res) => {
  const files = await File.find();
  res.send(files);
};

export const getFileFromDB = async (req, res) => {
  const { cid } = req.params;
  const file = await File.findOne({ cid });

  if (!file) {
    const newFile = {
      cid,
    };

    new File(newFile).save((err, file) => {
      if (err) {
        console.log(`fastlog => err`, err);
        res.status(500).send('Error saving file to DB');
      }
      console.log(`fastlog => file`, file);
      res.send(file);
    });
    return;
  }

  res.send(file);
};
