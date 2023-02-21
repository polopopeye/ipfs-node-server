const ipfsController = (app, { ipfs }) => {
  const controllerName = '/ipfs';
  app.get(controllerName + '/', async (req, res) => {
    // show basic informations about the node
    const id = await ipfs.id();
    console.info(id);

    //   get the api link of ipfs
    const api = await ipfs.config.get('Addresses.API');
    console.log(`fastlog => api`, api);

    res.send(api);
  });
};

export default ipfsController;
