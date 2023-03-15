const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const db = require("./db/db.json");
const uuid = require("./helpers/uuid");

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => res.json(db));

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note: ${req.body}`);
  //receive new note
  const { title, text } = req.body;
  console.log(title, text);

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    const noteString = JSON.stringify(newNote);

    fs.writeFile("./db/db.json", noteString, (err) => {
      err
        ? console.log(err)
        : console.log(`Note for ${title} written to database`);
    });
    const response = {
      status: "success",
      body: newNote,
    };
    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting note.");
  }

  // return new note to client
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
