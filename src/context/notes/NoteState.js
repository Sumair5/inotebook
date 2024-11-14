import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const notesinitial = [
    {
      _id: "672bb667ea9d2373e3971ecf",
      user: "672a6aa09d273f9222b886d3",
      title: "my test title",
      description: "Always do your work on time",
      tag: "personal",
      date: "2024-11-06T18:33:11.935Z",
      __v: 0
    },
    {
      _id: "672bb668ea9d2373e3971ed1",
      user: "672a6aa09d273f9222b886d3",
      title: "my test title",
      description: "Always do your work on time",
      tag: "personal",
      date: "2024-11-06T18:33:12.324Z",
      __v: 0
    }
  ];

  const [notes, setnotes] = useState(notesinitial);

  return (
    <NoteContext.Provider value={{ notes, setnotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
