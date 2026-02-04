import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Meals from './pages/Meals';
import Deposits from './pages/Deposits';
import Costs from './pages/Costs';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/deposits" element={<Deposits />} />
          <Route path="/costs" element={<Costs />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
