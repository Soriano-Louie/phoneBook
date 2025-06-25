const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

// ✅ GET all
app.get("/api/persons", (req, res) => res.json(persons));

// ✅ GET one
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);
  person ? res.json(person) : res.status(404).end();
});

// ✅ DELETE
app.delete("/api/persons/:id", (req, res) => {
  persons = persons.filter((p) => p.id !== req.params.id);
  res.status(204).end();
});

// ✅ POST (add new)
app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: "name or number missing" });
  }

  const newPerson = {
    id: String(Math.max(...persons.map((p) => Number(p.id))) + 1),
    name,
    number,
  };

  persons = persons.concat(newPerson);
  res.json(newPerson);
});

// ✅ PUT (update)
app.put("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);
  if (!person) return res.status(404).json({ error: "person not found" });

  const updatedPerson = {
    ...person,
    name: req.body.name || person.name,
    number: req.body.number || person.number,
  };

  persons = persons.map((p) => (p.id === id ? updatedPerson : p));
  res.json(updatedPerson);
});

// ✅ Fallback to index.html for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ✅ React Router fallback (for SPA routing)
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// ✅ Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
