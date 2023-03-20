const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const db = require("./db/db.json");
const uuid = require("./helpers/uuid");

const PORT = process.env.PORT || 3001;
const app = express();
const readFromFile = util.promisify(fs.readFile);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note: ${req.body}`);

  //destructure new note
  const { title, text } = req.body;
  console.log(title, text);

  // Create new note object
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    // Read the db
    const notesArr = JSON.parse(fs.readFileSync("./db/db.json"));
    // Push new note object to db arr
    notesArr.push(newNote);

    // Translate notesArr back to string
    const noteString = JSON.stringify(notesArr);

    // Write the notes string to db
    fs.writeFileSync("./db/db.json", noteString, (err) => {
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
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
