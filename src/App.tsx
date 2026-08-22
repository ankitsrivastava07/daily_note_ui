import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import Home from './Components/Home';
import About from './Components/About'
import Contact from './Components/Contact';
import DailyNoteForm from './Components/DailyNoteForm';

function App() {
  return (
    <>
      <BrowserRouter>
        <nav>
          <Link to="/">Daily Note</Link> |{" "}
          <Link to="/about">About</Link> |{" "}
          <Link to="/contact">Contact</Link> |{" "}
          <Link to="/create-note">Create Note</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path = "/create-note" element = {<DailyNoteForm/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
