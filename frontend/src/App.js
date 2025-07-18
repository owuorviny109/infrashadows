import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import MapPage from './pages/MapPage';
import ReportPage from './pages/ReportPage';
import WaterDemandPage from './pages/WaterDemandPage';
import PowerLoadPage from './pages/PowerLoadPage';
import DrainageImpactPage from './pages/DrainageImpactPage';
import GreenCoverPage from './pages/GreenCoverPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/analysis" element={<Layout><AnalysisPage /></Layout>} />
            <Route path="/map" element={<Layout><MapPage /></Layout>} />
            <Route path="/report/:id" element={<Layout><ReportPage /></Layout>} />
            <Route path="/water-demand/:id" element={<Layout><WaterDemandPage /></Layout>} />
            <Route path="/power-load/:id" element={<Layout><PowerLoadPage /></Layout>} />
            <Route path="/drainage-impact/:id" element={<Layout><DrainageImpactPage /></Layout>} />
            <Route path="/green-cover/:id" element={<Layout><GreenCoverPage /></Layout>} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;