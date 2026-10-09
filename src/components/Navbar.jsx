import React, { useState } from 'react';
import HardeesLogo from './HardeesLogo';
import { Menu, X, User, ShoppingBag, ShieldCheck, Clock, MapPin } from 'lucide-react';

export default function Navbar({ onOpenLogin, user, onGoToDashboard, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="site-header">
      {/* Top operational announcement banner */}
      <div className="header-top-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="banner-badge">ROCKINGHAM, NC</span>
          <span>481 US Highway 1 S · Open Today: 5:30 AM – 10:00 PM</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> Breakfast served till 10:30 AM
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={13} /> Certified Safe & Clean
          </span>
        </div>
      </div>

      <div className="nav-container">
        <a href="#home" className="brand-link" onClick={() => setMobileOpen(false)}>
          <HardeesLogo height={44} />
        </a>

        <ul className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <li><a href="#home" className="nav-link active" onClick={() => setMobileOpen(false)}>Home</a></li>
          <li><a href="#menu" className="nav-link" onClick={() => setMobileOpen(false)}>Our Menu</a></li>
          <li><a href="#about" className="nav-link" onClick={() => setMobileOpen(false)}>About Hardee’s</a></li>
          <li><a href="#locations" className="nav-link" onClick={() => setMobileOpen(false)}>Locations</a></li>
          <li><a href="#careers" className="nav-link" onClick={() => setMobileOpen(false)}>Careers</a></li>
          <li><a href="#contact" className="nav-link" onClick={() => setMobileOpen(false)}>Contact</a></li>
        </ul>

        <div className="nav-actions">
          <a
            href="https://order.hardees.com/location/-nc-rockingham-481-us-highway-1-s/menu"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold btn-sm"
            style={{ textDecoration: 'none' }}
          >
            <ShoppingBag size={15} /> Order Now
          </a>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={onGoToDashboard}
                title="Go to Employee Dashboard"
              >
                <User size={15} /> {user.fullName ? user.fullName.split(' ')[0] : 'Portal'} ({user.role === 'STORE_MANAGER' ? 'Manager' : 'Crew'})
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={onLogout}
                title="Sign out of Employee Portal"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={onOpenLogin}
              id="employeeLoginNavBtn"
            >
              <User size={15} /> Employee Portal
            </button>
          )}

          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
