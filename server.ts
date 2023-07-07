const express = require('express');
const app = express();

const port = 3001; // Specify the port you want your server to listen on

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});