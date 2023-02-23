import { File } from '../schema/file.schema.js';

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

export const uploadFileInfoToDB = async (req, res) => {
  const { cid } = req.params;

  if (!req.body) res.status(400).send('Missing file info');

  const { name, size, type, description, tags, cover } = req.body;

  const file = {
    cid,
    name,
    description,
    tags,
    size,
    type,
    cover,
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
