const User = require("./model");
const bcrypt = require("bcryptjs");

module.exports = {
  viewSignup: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user === null || req.session.user === undefined) {
        res.render("admin/users/view_signup", {
          alert,
          title: "Halaman signup",
        });
      } else {
        res.redirect("/dashboard");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
  actionSignup: async (req, res) => {
    try {
      const { name, email, password, phoneNumber } = req.body;
      const checkUser = await User.findOne({ email: email });

      if (checkUser) {
        throw new Error("Mohon maaf akun sudah terdaftar");
      }
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      let user = await User({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        status: "N",
      });
      await user.save();

      req.flash("alertMessage", "Sign Up berhasil");
      req.flash("alertStatus", "success");

      res.redirect("/");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/signup");
    }
  },
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user === null || req.session.user === undefined) {
        res.render("admin/users/view_signin", {
          alert,
          title: "Halaman signin",
        });
      } else {
        res.redirect("/dashboard");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },

  actionSignin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkUser = await User.findOne({ email: email });

      if (checkUser) {
        if (checkUser.status === "Y") {
          const checkUserPassword = await bcrypt.compare(
            password,
            checkUser.password
          );
          if (checkUserPassword) {
            req.session.user = {
              id: checkUser._id,
              email: checkUser.email,
              status: checkUser.status,
              name: checkUser.name,
            };
            res.redirect("/dashboard");
          } else {
            req.flash("alertMessage", `Kata sandi yang anda inputkan salah`);
            req.flash("alertStatus", "danger");
            res.redirect("/");
          }
        } else {
          req.flash("alertMessage", `Mohon maaf status anda belum aktif`);
          req.flash("alertStatus", "danger");
          res.redirect("/");
        }
      } else {
        req.flash("alertMessage", `Email yang anda masukan salah`);
        req.flash("alertStatus", "danger");
        res.redirect("/");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
};
