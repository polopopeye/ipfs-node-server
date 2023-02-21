const fileController = (app, { ipfs, db }) => {
  const controllerName = '/file';
  app.post(controllerName + '/upload', async (req, res) => {
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
};

export default fileController;
