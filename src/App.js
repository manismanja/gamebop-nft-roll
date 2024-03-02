import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/home';
import NavBar from './components/navBar';
import Gallery from './pages/gallery';
import MyNFT from './pages/mynft';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route exact strict path="/" element={<Home />} />
        <Route exact strict path="/gallery" element={<Gallery />} />
        <Route exact strict path="/mynft" element={<MyNFT />} />
        <Route path="*" element={<Navigate to="/" />}/>
      </Routes>
    </div>
  );
}

export default App;
