import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import Home from './Components/Home';
import About from './Components/About'
import Contact from './Components/Contact';
import DailyNoteForm from './Components/DailyNoteForm';
import CreateWorkspace from './Components/CreateWorkspace';
import GetAllNote from './Components/GetAllNote';
import PageNotFound from './Components/PageNotFound';
import GetAllShortNotes from './Components/GetAllShortNotes';
import CreateShortNote from './Components/CreateShortNote';

function App() {
  return (
    <>
      <BrowserRouter>
        <nav>
          <Link to="/">Daily Note</Link> |{" "}
          <Link to="/about">About</Link> |{" "}
          <Link to="/contact">Contact</Link> |{" "}
          <Link to="/create-note">Create Note | {" "}</Link>
          <Link to="/all-note">All Notes</Link>| {" "}
          <Link to="/short-note">Short Note</Link> | {" "}
          <Link to="/workspace">Create Work Space</Link> | {" "}
          <Link to="/get-all-short-notes">Get All Short Notes</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workspace" element={<CreateWorkspace onWorkspaceCreated={undefined}></CreateWorkspace>}></Route>
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/all-note" element={<GetAllNote></GetAllNote>}></Route>
          <Route path="/create-note" element={<DailyNoteForm />}></Route>
          <Route path="/short-note" element={<CreateShortNote></CreateShortNote>}></Route>
          <Route path="/get-all-short-notes" element={<GetAllShortNotes></GetAllShortNotes>}></Route>
          <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
