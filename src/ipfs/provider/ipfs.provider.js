import { ipfsConfigBootstrap } from '../config/ipfsConfig.js';
import { create } from 'ipfs-core';

export const ipfsProvider = async () => {
  const ipfs = await create({
    repo: 'ipfs-repo3',
  });

  ipfsConfigBootstrap(ipfs);
  // get the api link of ipfs
  const api = await ipfs.config.get('Addresses.API');
  console.log(`fastlog => ipfs api`, api);
  return ipfs;
};
