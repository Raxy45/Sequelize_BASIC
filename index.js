const Sequelize = require("sequelize");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

let sequelize = new Sequelize("CartDB", "root", "YashSalvi@1410", {
  host: "127.0.0.1",
  port: "3306",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    app.listen("3000", () => {
      console.log("App is running Successfully at localhost 3000");
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
sequelize.sync({
  force: true,
});
const Products = sequelize.define("products", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  category: {
    type: Sequelize.STRING,
  },
});

// C : Create = We can add new Phones to the exisitng stock
app.post("/", function (req, res) {
  Products.create({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
  })
    .then((user) => {
      // Send created user to client
      console.log("Data added successfully");
      return user.userId;
    })
    .catch(function (err) {
      console.log("create failed with error: " + err);
      return 0;
    });
});

// R: Read: 1. When "/" is hit-on we get all the phones in stock.
// R: Read  2. When "/{id}" is entered in url we get only the phone at that ID gets displayed.
// 1
app.get("/", function (req, res) {
  Products.findAll()
    .then((users) => {
      res.send(users);
      console.log(users);
    })
    .catch(function (err) {
      console.log("findAll failed with error: " + err);
      return null;
    });
});
// 2
app.get("/:specific", function (req, res) {
  Products.findByPk(req.params.specific)
    .then((user) => {
      console.log(user);
      res.send(user);
    })
    .catch(function (err) {
      console.log("Please enter the correct ID " + err);
      return null;
    });
});

// U: Update= This route is solely used to update the Phone Specifications.

app.patch("/:specific", function (req, res) {
  Products.update(
    {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
    },
    { where: { name: req.params.specific } }
  )
    .then(() => {
      console.log("Updated");
    })
    .catch(function (err) {
      console.log("update failed with error: " + err);
      return 0;
    });
});

// D : DELETE : The Phone with name entered in form gets deleted from the database.

app.post("/delete", function (req, res) {
  Products.destroy({
    where: { name: req.body.name },
  })
    .then(() => {
      console.log("deleted record");
    })
    .catch(function (err) {
      console.log("delete failed with error: " + err);
      return 0;
      // handle error;
    });
});
