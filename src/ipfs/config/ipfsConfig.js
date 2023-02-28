import * as dotenv from 'dotenv';

export const ipfsConfigBootstrap = (ipfs) => {
  dotenv.config();

  const hostname = process.env.HOSTNAME;

  const whitelistedOrigins = process.env.WHITELISTED_ORIGINS;

  const ipfsPeerId = process.env.IPFS_PEER_ID;
  const ipfsIdPrivKey = process.env.IPFS_ID_PRIV_KEY;

  const ipfsApi = process.env.IPFS_API;
  const ipfsGateway = process.env.IPFS_GATEWAY;
  const ipfsRPC = process.env.IPFS_RPC;

  console.log(`fastlog => hostname:`, hostname);

  ipfs.config.set('API.HTTPHeaders.Access-Control-Allow-Origin', [
    'webui://-',
    'https://webui.ipfs.io',
    hostname,
    whitelistedOrigins,
  ]);
  ipfs.config.set('API.HTTPHeaders.Access-Control-Allow-Methods', [
    'PUT',
    'GET',
    'POST',
    'OPTIONS',
  ]);

  // Auto pin added objects to local storage
  ipfs.config.set('Pinning.EnableGC', true);
  // Enable auto relay
  ipfs.config.set('Relay.Enabled', true);
  // Enable pubsub
  ipfs.config.set('Pubsub.Enabled', true);
  // Filestore enable
  ipfs.config.set('Experimental.FilestoreEnabled', true);
  // Enable sharding
  ipfs.config.set('Experimental.ShardingEnabled', true);
  // Enable QUIC
  ipfs.config.set('Experimental.QUIC', true);
  // Enable urlstore
  ipfs.config.set('Experimental.UrlstoreEnabled', true);
  // Enable ipns over pubsub
  ipfs.config.set('Experimental.IPNSPubsub', true);
  // Enable dnsaddr
  ipfs.config.set('Discovery.MDNS.Enabled', true);
  // Enable libp2p relay
  ipfs.config.set('Swarm.EnableRelayHop', true);
  // swarm hogh water mark
  ipfs.config.set('Swarm.ConnMgr.HighWater', 500); // recommended 1000
  // swarm low water mark
  ipfs.config.set('Swarm.ConnMgr.LowWater', 400); // recommended 500
  // Enable autorelay
  ipfs.config.set('Swarm.EnableAutoRelay', true);
  //   disable nat port mapping
  ipfs.config.set('Swarm.DisableNatPortMap', false);

  // Identity peer id
  ipfs.config.set('Identity.PeerID', ipfsPeerId);
  ipfs.config.set('Identity.PrivKey', ipfsIdPrivKey);

  // dataStore config
  ipfs.config.set('Datastore.StorageMax', '10GB');
  ipfs.config.set('Datastore.StorageGCWatermark', 90);
  ipfs.config.set('Datastore.GCPeriod', '1h');
  ipfs.config.set('Datastore.HashOnRead', false);
  ipfs.config.set('Datastore.BloomFilterSize', 0);

  //   mounts config
  ipfs.config.set('Mounts.IPFS', '/ipfs');
  ipfs.config.set('Mounts.IPNS', '/ipns');
  ipfs.config.set('Mounts.FuseAllowOther', false);

  //   //   ipfs api, gateway, rpc
  ipfs.config.set('Addresses.API', ipfsApi);
  ipfs.config.set('Addresses.Gateway', ipfsGateway);
  ipfs.config.set('Addresses.RPC', ipfsRPC);

  // Enable dht
  ipfs.config.set('Routing.Type', 'dhtclient');
};
