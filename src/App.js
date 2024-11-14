import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import About from './components/About'; 
import NoteState from './context/notes/NoteState';

function App() {
  return (
    <NoteState>
      <Router>
        {/* Navbar visible on all pages */}
        <Navbar />
        <div className='container'>
        {/* Defining routes for different components */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
        </div>
      </Router>
    </NoteState>
  );
}

export default App;
