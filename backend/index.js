require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const Contact = require("./models/contact");
const contact = require("./models/contact");
const app = express();

// let persons = [
//   { id: "1", name: "Arto Hellas", number: "040-123456" },
//   { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
//   { id: "3", name: "Dan Abramov", number: "12-43-234345" },
//   { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
// ];

app.use(express.json());

// 👉 Serve static files from React frontend build
// ✅ Serve Vite's build output (React app)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ✅ GET all
app.get("/api/persons", (req, res) => {
  Contact.find({}).then((persons) => {
    res.json(persons);
  });
});

// ✅ GET one
app.get("/api/persons/:id", async (req, res, next) => {
  try {
    const person = await Contact.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json(person);
  } catch (error) {
    next(error);
  }

  // const id = req.params.id;
  // const person = persons.find((p) => p.id === id);
  // person ? res.json(person) : res.status(404).end();
});

// DELETE
app.delete("/api/persons/:id", async (req, res, next) => {
  try {
    const deletedPerson = await Contact.findByIdAndDelete(req.params.id);

    if (deletedPerson) {
      console.log("Person deleted successfully:", deletedPerson);
      res.status(204).json({ message: "Person deleted successfully" });
    } else {
      console.log("Person not found");
      res.status(404).json({ error: "Person not found" });
    }
  } catch (error) {
    next(error);
  }
  // persons = persons.filter((p) => p.id !== req.params.id);
  // res.status(204).end();
});

// POST (add new)
app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "Name or number is missing" });
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact.save().then((savedContact) => {
    res.json(savedContact);
  });

  // const { name, number } = req.body;
  // if (!name || !number) {
  //   return res.status(400).json({ error: "name or number missing" });
  // }

  // const newPerson = {
  //   id: String(Math.max(...persons.map((p) => Number(p.id))) + 1),
  //   name,
  //   number,
  // };

  // persons = persons.concat(newPerson);
  // res.json(newPerson);
});

// PUT (update)
app.put("/api/persons/:id", (req, res) => {
  const { name, number } = req.body;
  Contact.findById(req.params.id).then((contact) => {
    if (!contact) {
      return res.status(404).end();
    }

    contact.name = name;
    contact.number = number;

    return contact.save().then((updatedPerson) => {
      res.json(updatedPerson);
    });
  });

  // const id = req.params.id;
  // const person = persons.find((p) => p.id === id);
  // if (!person) return res.status(404).json({ error: "person not found" });

  // const updatedPerson = {
  //   ...person,
  //   name: req.body.name || person.name,
  //   number: req.body.number || person.number,
  // };

  // persons = persons.map((p) => (p.id === id ? updatedPerson : p));
  // res.json(updatedPerson);
});

// Fallback to index.html for React Router (must be last)
app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "../frontend/dist", "index.html");

  // Check if the file exists
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Fallback response if build files don't exist
    res.status(404).json({
      error: "Frontend build not found. Please build the frontend first.",
    });
  }
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// Middleware for error handling, should be loaded after all routes
app.use(errorHandler);

// ✅ Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
