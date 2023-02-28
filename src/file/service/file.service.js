import { File } from '../schema/file.schema.js';
import asyncIteratorToStream from 'async-iterator-to-stream';
import { Multiaddr } from 'multiaddr/src/index.js';
import { byteNormalize } from '../../utils/bytesSizeConvert.js';
import fs from 'fs';
import { isFileExist } from '../../utils/isExist.js';
export const uploadFileToIPFS = async (req, res, { ipfs }) => {
  req.on('aborted', () => {
    console.log(`fastlog => aborted fileUpload`);
  });
  req.on('error', (err) => {
    console.log(`fastlog => error fileUpload`, err);
  });
  const file = req.file;
  const path = file.path;
  // create stream from file
  const stream = fs.createReadStream(path);

  const result = await ipfs.add(stream, {
    progress: (prog) => console.log(`received: ${byteNormalize(prog)}`),
    chunker: 'size-6000000', // Best performance for large files
    onlyHash: false, // Don't store the file in the local repo
    pin: true, // Pin the file in the local repo
    wrapWithDirectory: false, // Don't wrap the file in a directory
  });
  console.log(`fastlog => result:`, result);

  res.on('finish', () => {
    console.log(`fastlog => finish`);
    fs.unlink(path, (err) => {
      if (err) {
        console.log(`fastlog => error:`, err);
      }
    });
  });

  res.send({
    cid: result.cid.toString(),
    size: result.size,
  });
};

export const downloadFileFromIpfs = async (req, res, { ipfs }) => {
  const { cid } = req.params;
  // const { address } = req.body;
  // la idea es que solo este de la db.
  // verify if cid is in the db

  const file = await isFileExist(cid, res);
  if (!file) return;

  // if (address && address.length > 0) {
  //   await address.forEach(async (addr) => {
  //     console.log(`fastlog => addr:`, addr);
  //     const multiAddr = new Multiaddr(addr);
  //     console.log(`fastlog => multiAddr:`, multiAddr);

  //     const peer = await ipfs.swarm.connect(multiAddr);

  //     console.log(`fastlog => peer:`, peer);
  //   });
  // }

  console.log(`fastlog => cid:`, cid);
  const stream = ipfs.cat(cid);
  console.log(`fastlog => stream:`, stream);

  const ipfsStream = asyncIteratorToStream(stream);
  console.log(`fastlog => ipfsStream:`, ipfsStream);

  // req.on('aborted', () => {
  //   console.log(`fastlog => aborted fileDownload`);
  //   res.end();
  // });
  req.on('error', (err) => {
    console.log(`fastlog => error fileDownload`, err);
  });

  ipfsStream
    .on('data', (chunk) => {
      console.log(`fastlog => chunk:`, chunk);
      // Export chunk in a nice way
      const converChunk = Buffer.from(chunk).toString('hex');
      res.write(converChunk);
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
    .on('end', () => {
      console.log(`fastlog => end`);
      res.end();
    });
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
  const { mode, period, type, tags, userId, sortMode } = req.body;
  // currently only supports mode, and tags.

  // TODO: add more filters, period, type, etc.
  // TODO: add pagination and limit

  let filters = {
    tags: undefined,
  };

  const sortResponse = (arr) => {
    // TODO: add more options, size, date, tipe, name, etc.
    const sortModeOptions = ['likes', 'reports', 'dislikes', 'favorites'];
    if (!sortMode || sortMode === '') return arr;
    if (!sortModeOptions.includes(sortMode)) return arr;
    return arr.sort((a, b) => {
      return b[sortMode].length - a[sortMode].length;
    });
  };

  const modeOptions = ['all', 'favorites', 'likes', 'reports', 'dislikes']; //TODO: add more options, trending, etc.
  if (!mode || !modeOptions.includes(mode)) filters.mode = 'all';
  if (tags && tags.length > 0)
    filters.tags = {
      tags: { $in: tags },
    };

  if (modeOptions.includes(mode) && mode !== 'all') {
    if (!userId) return res.status(400).send('Missing user id');
    const files = await File.find({
      ...filters.tags,
      [mode]: { $in: [userId] },
    });

    res.send(sortResponse(files));
    return;
  }

  const files = await File.find({
    ...filters.tags,
  });
  res.send(sortResponse(files));
  return;
};

export const getFileFromDB = async (req, res) => {
  const { cid } = req.params;
  const file = await isFileExist(cid, res);
  if (!file) return;
  res.send(file);
};
