import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './server/db.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Get all students
app.get("/student_management", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM student_management"); // table name
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Database error", error: err });
  }
});


// Add new student
app.post("/student_management", async (req, res) => {
  const { name, email, is_active } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO student_management (name, email, is_active) VALUES (?, ?, ?)",
      [name, email, is_active]
    );
    res.json({ message: "Student added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
});

// Delete student
app.delete("/student_management/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM student_management WHERE id = ?", [id]);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
});

// Update student
app.put("/student_management/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, is_active } = req.body;
  try {
    await db.query(
      "UPDATE student_management SET name = ?, email = ?, is_active = ? WHERE id = ?",
      [name, email, is_active, id]
    );
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
