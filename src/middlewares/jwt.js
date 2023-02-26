app.post('/auth/', (req, res) => {
  const id = req.body.id;

  const secretWord = req.body.hash;
  const saltRounds = 10;

  bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    // Store hash in your password DB.
  });
});
