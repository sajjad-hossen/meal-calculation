import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './LandingPage.css'; // We will create this

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="landing-container">
      <div className="landing-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <header className="landing-header">
        <div className="landing-logo">
          <span className="logo-icon">🍽️</span> BiteBoard
        </div>
        <nav className="landing-nav">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </nav>
      </header>

      <main className="landing-main">
        <div className="hero-content">
          <h1 className="hero-title">
            Smart Meal Management for <span className="highlight">Everyone</span>
          </h1>
          <p className="hero-subtitle">
            Track deposits, calculate meal costs, and manage your shared expenses with absolute ease and transparency.
          </p>
          <div className="hero-actions">
            {user ? (
               <Link to="/dashboard" className="btn btn-primary btn-lg pulse-btn">Go to Dashboard</Link>
            ) : (
              <Link to="/register" className="btn btn-primary btn-lg pulse-btn">Start Calculating Now</Link>
            )}
            <a href="#features" className="btn btn-outline btn-lg">Learn More</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glass-card mockup-card">
            <div className="mockup-header">
              <div className="dots">
                <span></span><span></span><span></span>
              </div>
            </div>
            <div className="mockup-body">
              <div className="mockup-stat">
                <span className="stat-label">Total Deposits</span>
                <span className="stat-value text-success">$1,250</span>
              </div>
              <div className="mockup-stat">
                <span className="stat-label">Meal Rate</span>
                <span className="stat-value text-primary">$4.50</span>
              </div>
              <div className="mockup-chart">
                <div className="bar" style={{height: '60%'}}></div>
                <div className="bar" style={{height: '80%'}}></div>
                <div className="bar" style={{height: '40%'}}></div>
                <div className="bar" style={{height: '100%'}}></div>
                <div className="bar" style={{height: '50%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section id="features" className="features-section">
        <h2 className="section-title">Why Choose BiteBoard?</h2>
        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon">📊</div>
            <h3>Accurate Calculations</h3>
            <p>Automated algorithms to divide costs transparently and fairly among all members.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon">💰</div>
            <h3>Deposit Tracking</h3>
            <p>Keep a clear record of who paid what and when, directly in one dashboard.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon">📱</div>
            <h3>Responsive Design</h3>
            <p>Manage your shared expenses on any device, anywhere, anytime.</p>
          </div>
        </div>
      </section>
      
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} BiteBoard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
