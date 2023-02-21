import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';
import appModule from './src/app.module.js';

const bootstrap = async () => {
  const app = express();
  app.use(fileUpload());
  app.use(express.json());
  app.use(cors());
  process.setMaxListeners(0);
  dotenv.config();
  const port = process.env.PORT; //IPFS_PORT;

  await appModule(app);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

bootstrap();

// app.get('/download/:cid', async (req, res) => {
//   try {
//     const { cid } = req.params;
//     const file = await ipfs.cat(cid, {
//       timeout: 10000,
//     });
//     console.log(`fastlog => file`, file);

//     res.send(file);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error fetching file from IPFS');
//   }

//   console.log(' - file downloaded');
// });
