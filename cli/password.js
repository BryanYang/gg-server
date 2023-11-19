const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);

bcrypt.hash('123123', salt).then((res) => {
  console.log(res);
});
