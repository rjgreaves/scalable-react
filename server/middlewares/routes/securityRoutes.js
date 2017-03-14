var UserItem = require("../../Models/UserItem").UserItem;
var bcrypt = require("bcrypt");
var tokenService = require("../../tokenService");

module.exports = {

  registerRoutes(app) {

    app.post('/api/login', (req, res) => {

      UserItem.findOne({ email: req.body.email },
        function (err, user) {

          if (err)
            return res.status(500)

          if (!user)
            return res.status(401).send({ errorMessage: 'Credentials not found' });

          bcrypt.compare(req.body.password, user.passwordHash, function (err, doesMatch) {
            if (doesMatch) {
              var claims = {
                sub: 'user9876',
                iss: 'https://mytrustyapp.com',
                permissions: 'upload-photos'
              };
              var token = tokenService.createToken(claims);
              return res.send({ token: token });
            } else {
              return res.status(401).send({ errorMessage: 'Credentials are not valid' });
            }
          });
        }
      );
    });

  }


}
