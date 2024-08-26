const Auth = require("../models/Auth.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Kullanıcı Kaydı
const register = async (req, res) => {
  try {
    //from front-end side
    const { username, email, password } = req.body;
    const user = await Auth.findOne({ email });
    //Email check
    if (user) {
      //409(Conflict) status code: Veritabanında zaten var olan bir kayıtla çakışma olduğunu belirtir.
      return res.status(409).json({
        message: "Bu email başka bir kullanıcı tarafından kullanılmaktadır.",
      });
    }
    //400(Bad Request) status code: Kullanıcıdan gelen verilerin geçersiz olduğunu belirtir.
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Geçersiz email adresi." });
    }

    //password check
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Parola en az 6 karakter uzunluğunda olmalı." });
    }
    //salt rounds:12  =>  Hashleme işleminin karmaşıklığını ve dolayısıyla güvenliğini artırır.
    //bcrypt kütüphanesi ise salt rounds kadar tekrar eden bir hashleme işlemi için gerçekleştirir.
    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await Auth.create({ ...req.body, password: passwordHash });
    //jwt.sign => creates a JSON Web Token(JWT)
    //SECRET_KEY => verifying the token
    const userToken = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      "SECRET_KEY",
      {
        expiresIn: "1h",
      }
    );
    //userToken adında bir çerez oluşturulur ve bu çerez client tarafına gönderilir.
    /*{ httpOnly: true } => Çerez sadece HTTP istekleri aracılığıyla erişilebilir olur. 
    Yani, çerez istemci tarafındaki JavaScript kodu tarafından erişilemez. 
    Bu, çerezin XSS (Cross-Site Scripting) saldırılarına karşı korunmasına yardımcı olur.*/
    //JWT çerez olarak saklanır.
    res
      .cookie("userToken", userToken, { httpOnly: true, maxAge: 3600000 })
      .status(201)
      .json({
        status: "OK",
        newUser: { email: newUser.email, username: newUser.username },
        userToken,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//email validation
function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //returns a boolean
  return re.test(String(email).toLowerCase());
}

//Kullanıcı girişi
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Auth.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Böyle bir kullanıcı bulunamadı." });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      //401(Unauthorized) status code
      return res.status(401).json({ message: "Parola hatalı!" });
    }
    const userToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res
      .cookie("userToken", userToken, { httpOnly: true, maxAge: 3600000 })
      .status(200)
      .json({
        status: "OK",
        user: { email: user.email, username: user.username },
        userToken,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
