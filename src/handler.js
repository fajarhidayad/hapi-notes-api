/* eslint-disable import/no-extraneous-dependencies */
const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (req, h) => {
  const { title, tags, body } = req.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id,
    createdAt,
    updatedAt,
    title,
    tags,
    body,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success;',
      message: 'Notes successfully added.',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Note failed to add.',
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  message: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (req, h) => {
  const { id } = req.params;
  const note = notes.filter((item) => item.id === id)[0];

  if (!note) {
    const response = h.response({
      status: 'fail',
      message: `Note with id ${id} doesn't exist`,
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      note,
    },
  });

  return response;
};

const editNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const { title, tags, body } = req.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Notes successfully updated',
    });

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: `Note with id ${id} not found`,
  });

  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const index = notes.findIndex((note) => note.id === id);

  if (id !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Notes successfully deleted',
    });

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: `Note with id ${id} not found`,
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
