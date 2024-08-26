/* Her HTTP isteğinde kullanıcının kimliğini doğrulamak için JWT kontrol edilir.
   Eğer token geçerli ise kimlik doğrulanır ve istek işleme devam eder.
   Eğer token geçersizse veya token yoksa hata yakalanır ve istek işlenmez. */

const jwt = require("jsonwebtoken");

// /* Her middleware req,res ve next olmak üzere 3 parametre alır. */
// const auth = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     let decodedData = {};
//     if (token) {
//       decodedData = jwt.verify(token, process.env.SECRET_KEY); //Token doğrulanır.
//       req.userId = decodedData;
//     } else {
//       decodedData = jwt.decode(token);
//       req.userId = decodedData?.sub;
//     }
//     /* next fonksiyonu Express.js'de kullanılan bir middleware fonksiyonudur ve middleware'ın işi
//        tamamlandığında bir sonraki middleware'a geçiş yapılmasını sağlar.
//        Yani middleware'ların zincirleme olarak çalışmasını sağlar.*/
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// module.exports = auth;

// verifyToken Middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Lütfen giriş yapınız!" });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Token doğrulama başarısız!" });
    }
    req.user = user;
    next();
  });
};

//verifyUser Middleware
const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id == req.params.id || req.user.isAdmin) {
      next();
    } else {
      // 403 Forbidden  =>  Kimlik doğrulaması yapılmış ancak yetkinin yetersiz olduğu durumlar için uygundur.
      return res.status(403).json({ message: "Yetkisiz erişim!" });
    }
  });
};

//verifyAdmin middleware
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Yetkisiz erişim!" });
    }
  });
};

module.exports = { verifyToken, verifyUser, verifyAdmin };
