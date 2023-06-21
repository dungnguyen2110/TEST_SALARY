const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Create MySQL connection
const connection = mysql.createConnection({
  host: "34.126.131.0",
  user: "auto_lendingusr",
  password: "l1bPKjtfp9v0",
  database: "auto_lending",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL server");
});

// Create
app.post("/create", (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  const sql = "INSERT INTO my_table SET ?";

  connection.query(sql, data, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("User created");
  });
});

// Read
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM my_table";

  connection.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

// Update
app.put("/update/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  console.log(typeof id);
  const { name, email, phone } = req.body;

  const sql = "UPDATE my_table SET name=?, email=?, phone=? WHERE id=?";

  connection.query(sql, [name, email, phone, id], (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(`User with id ${id} updated`);
  });
});

// Delete
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM my_table WHERE id=?";

  connection.query(sql, id, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(`User with id ${id} deleted`);
  });
});
// Đóng kết nối đến cơ sở dữ liệu khi không cần nữa
//connection.end();

// Start server
app.listen(3001, () => {
  console.log("Server running on port 3001");
});
