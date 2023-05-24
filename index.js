const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
const port = 3001;

const notes = [];

/**
 * C(reate), R(ead), U(pdate) and D(elete)
 * GET, POST, PUT, DELETE
 *
 * ENDPOINTS
 *
 * POST    /songs      CREATE
 * GET     /songs      READ (ALL)
 * GET     /songs/:id  READ (ONE)
 * PUT     /songs/:id  UPDATE
 * DELETE  /songs/:id  DELETE
 */

app.use(cors());

app.use(express.json());

// CREATE
app.post("/notes", (req, res, next) => {
  // body
  const { body = {} } = req;

  const note = {
    ...body,
    id: uuidv4(),
    // title: body.title,
    // author: body.author,
  };

  notes.push(note);

  res.status(201);
  res.json(note);
});

// READ ALL
app.get("/notes", (req, res, next) => {
  res.json(notes);
});

// READ ONE
app.get("/notes/:id", (req, res, next) => {
  // params
  const { params = {} } = req;
  const { id = "" } = params;

  const note = notes.find(function (element) {
    return id === element.id;
  });

  if (note) {
    res.json(note);
  } else {
    next({
      statusCode: 404,
      message: `Song with ${id}, Not Found`,
    });
  }
});

// UPDATE
app.put("/notes/:id", (req, res, next) => {
  // params
  const { params = {}, body = {} } = req;
  const { id = "" } = params;

  const index = notes.findIndex(function (element) {
    return id === element.id;
  });

  if (index !== -1) {
    const note = {
      ...notes[index],
      ...body,
    };

    notes[index] = note;

    res.json(note);
  } else {
    next({
      statusCode: 404,
      message: `Song with ${id}, Not Found`,
    });
  }
});

// DELETE
app.delete("/notes/:id", (req, res, next) => {
  const { params = {} } = req;
  const { id = "" } = params;

  const index = notes.findIndex(function (element) {
    return id === element.id;
  });

  if (index !== -1) {
    notes.splice(index, 1);
    res.status(204);
    res.end();
  } else {
    next({
      statusCode: 404,
      message: `Song with ${id}, Not Found`,
    });
  }
});

app.use((req, res, next) => {
  next({
    statusCode: 404,
    message: "Route Not Found",
  });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Error" } = err;

  console.log(message);

  res.status(statusCode);
  res.json({
    message,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
