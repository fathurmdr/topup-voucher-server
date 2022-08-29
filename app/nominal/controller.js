const Nominal = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const nominal = await Nominal.find();

      res.render("admin/nominal/view_nominal", {
        nominal,
        alert,
        name: req.session.user.name,
        title: "Nominal",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/nominal/create");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal", {
        name: req.session.user.name,
        title: "Nominal",
      });
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { coinName, coinQuantity, price } = req.body;

      if (coinName === "Pilih koin") {
        throw new Error("Silahkan pilih koin");
      }

      let nominal = await Nominal({ coinName, coinQuantity, price });
      await nominal.save();

      req.flash("alertMessage", "Berhasil menambahkan nominal");
      req.flash("alertStatus", "success");

      res.redirect("/nominal");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      if (err.message === "Silahkan pilih koin") {
        res.redirect("/nominal/create");
      } else {
        res.redirect("/nominal");
      }
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const nominal = await Nominal.findOne({ _id: id });
      res.render("admin/nominal/edit", {
        nominal,
        name: req.session.user.name,
        title: "Nominal",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { coinName, coinQuantity, price } = req.body;

      if (coinName === "Pilih koin") {
        throw new Error("Silahkan pilih koin");
      }

      console.log("Silahkan pilih koin");
      const nominal = await Nominal.findOneAndUpdate(
        {
          _id: id,
        },
        { coinName, coinQuantity, price }
      );

      req.flash("alertMessage", "Berhasil mengubah kategori");
      req.flash("alertStatus", "success");

      res.redirect("/nominal");
    } catch (err) {
      const { id } = req.params;

      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      if (err.message === "Silahkan pilih koin") {
        res.redirect(`/nominal/edit/${id}`);
      } else {
        res.redirect("/nominal");
      }
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      const nominal = await Nominal.findOneAndRemove({
        _id: id,
      });

      req.flash("alertMessage", "Berhasil menghapus nominal");
      req.flash("alertStatus", "success");

      res.redirect("/nominal");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
};
