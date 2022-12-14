const jwt = require("jsonwebtoken");
// token = req.headers.authorization.split(" ")[1];
// const authentication = async (req, res, next) => {
//     try {
//       let token = req.headers.authorization;
//       if (!token)
//         return res
//           .status(400)
//           .send({ status: false, msg: "token must be present" });
//       token = req.headers.authorization.split(" ")[1];
//       jwt.verify(token, "this is a secret key", (err, decodedToken) => {
//         if (err) {
//           let message =
//             err.message === "jwt expired"
//               ? "token is expired"
//               : "token is invalid";
//           return res.status(401).send({ status: false, message: message });
//         }
//         req.decodedToken = decodedToken;
//         next();
//       });
//     } catch (err) {
//       return res.status(500).send({ status: false, message: err.message });
//     }
//   };
  

const authentication = async (req, res, next) => {
  try {
      let token = req.headers['x-api-key']
      if (!token) return res.status(402).send({ status: false, msg: "token must be present" })

      let validateToken = jwt.verify(token, "this is a secret key")
      if (!validateToken) return res.status(402).send({ status: false, msg: "invalid token" })

      req.validateToken = validateToken

      next()
  } catch (err) {
      res.status(500).send({ status: "error", error: err.message });
  }
}



module.exports = authentication