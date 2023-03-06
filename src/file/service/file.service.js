import asyncIteratorToStream from 'async-iterator-to-stream';
import fs from 'fs';
import { byteNormalize } from '../../utils/bytesSizeConvert.js';
import { isFileExist } from '../../utils/isExist.js';
import { File } from '../schema/file.schema.js';
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

export const downloadFileFromIpfs = async (socket, { ipfs, cid, type }) => {
  // const { address } = req.body;
  // la idea es que solo este de la db.
  // verify if cid is in the db

  const file = await isFileExist(cid);
  if (!file) return;

  let count = 0;

  socket.emit(`download/${type}/chunk/`, {
    status: 'start',
    file,
  });

  const stream = ipfs.cat(cid);

  const ipfsStream = asyncIteratorToStream(stream);

  ipfsStream
    .on('data', (chunk) => {
      count += chunk.length;
      const progress = (count * 100) / file.size / 100;

      socket.emit(`download/${type}/chunk/`, {
        status: 'downloading',
        chunk: Buffer.from(chunk),
        progress,
        sizeSent: count,
      });
    })
    .on('error', (err) => {
      console.log(`fastlog => err:`, err);
      socket.emit(`download/${type}/chunk/`, {
        status: 'error',
        cid,
      });
    })
    .on('abort', () => {
      console.log(`fastlog => abort`);
      socket.emit(`download/${type}/chunk/`, {
        status: 'abort',
        cid,
      });
    })
    .on('close', () => {
      console.log(`fastlog => close`);
      socket.emit(`download/${type}/chunk/`, {
        status: 'close',
        cid,
      });
    })
    .on('end', () => {
      socket.emit(`download/${type}/chunk/`, {
        status: 'end',
        cid,
      });
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

  const fileExist = await isFileExist(cid);
  if (fileExist) {
    res.send(fileExist);
    return;
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
  const { mode, period, type, tags, userId, sortMode, searchStr } = req.body;
  // currently only supports mode, and tags.

  // TODO: add more filters, period, type, etc.
  // TODO: add pagination and limit

  let filters = {
    tags: undefined,
    name: undefined,
    description: undefined,
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

  if (searchStr && searchStr !== '') {
    filters.name = {
      name: { $regex: searchStr, $options: 'i' },
    };
    // filters.description = {
    //   description: { $regex: searchStr, $options: 'i' },
    // };
  }

  if (modeOptions.includes(mode) && mode !== 'all') {
    if (!userId) return res.status(400).send('Missing user id');
    const files = await File.find({
      ...filters.tags,
      ...filters.name,
      [mode]: { $in: [userId] },
    });

    res.send(sortResponse(files));
    return;
  }

  const files = await File.find({
    ...filters.tags,
    ...filters.name,
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
