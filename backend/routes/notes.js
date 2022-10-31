const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//Route:1 fetch all notes get /api/notes/fetchallnotes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//Route:2 add a new notes post /api/notes/fetchallnotes
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),
    body("description", "description must be 5 character").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savenote = await note.save();
      res.json(savenote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
//Route:3 update  notes post /api/notes/fetchallnotes
router.put("/updatenotes/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    //create a new note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //find a note to be updated
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(401).send("Not Found!");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed!");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//Route:4 delete  notes post /api/notes/fetchallnotes
router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
  try {
    //find a note to be deleted
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(401).send("Not Found!");
    }
    //allow delettion only if user owns this
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed!");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: "Notes has been deleted!", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
module.exports = router;
