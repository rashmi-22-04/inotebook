import React,{useContext} from "react";
import noteContext from "../context/notes/notecontext"

const Noteitem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context

  const { note, updateNotes,showAlert } = props;
  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h5 className="card-title">{note.title}</h5>
            <i className="fa-solid fa-trash-can mx-2" onClick={()=>{deleteNote(note._id);showAlert("Deleted successfully!","success");}}></i>
            <i className="fa-solid fa-pen-to-square mx-2" onClick={()=>{updateNotes(note)}}></i>
          </div>

          <p className="card-text">{note.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Noteitem;
