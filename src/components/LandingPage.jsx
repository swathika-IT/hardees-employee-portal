import React, { useState } from 'react';
import HardeesLogo from './HardeesLogo';
import {
  Flame,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Shield,
  Coffee,
  Heart,
  Briefcase,
  Star,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function LandingPage({ onOpenLogin }) {
  const [activeMenuCategory, setActiveMenuCategory] = useState('all');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: 'Feedback', message: '' });

  const menuItems = [
    {
      id: 1,
      category: 'burgers',
      name: 'Super Star® Double Thickburger®',
      desc: 'Two 100% black angus charbroiled beef patties, melted American cheese, lettuce, tomato, sliced onions, dill pickles, and special sauce on a soft seeded bun.',
      price: '$8.49',
      cal: '920 Cal',
      tag: 'Best Seller',
      img: '/images/hero-burger.jpg'
    },
    {
      id: 2,
      category: 'burgers',
      name: 'Mushroom & Swiss Thickburger®',
      desc: 'Charbroiled 100% Angus patty smothered in savory mushroom sauce and melted Swiss cheese on a toasted bakery bun.',
      price: '$7.89',
      cal: '680 Cal',
      tag: 'Customer Favorite',
      img: '/images/hero-burger.jpg'
    },
    {
      id: 3,
      category: 'biscuits',
      name: 'Made from Scratch™ Monster Biscuit®',
      desc: 'Crispy bacon, savory sausage patty, thinly sliced ham, folded egg, and melted American cheese piled high on a hot golden buttermilk biscuit.',
      price: '$5.49',
      cal: '850 Cal',
      tag: 'Breakfast Legend',
      img: '/images/biscuits-tenders.jpg'
    },
    {
      id: 4,
      category: 'biscuits',
      name: 'Bacon, Egg & Cheese Biscuit',
      desc: 'Thick cut applewood smoked bacon, fluffy fresh-cracked folded egg, and melted American cheese inside our signature biscuit baked fresh every 15 minutes.',
      price: '$4.29',
      cal: '590 Cal',
      tag: 'Made Fresh Daily',
      img: '/images/biscuits-tenders.jpg'
    },
    {
      id: 5,
      category: 'chicken',
      name: 'Hand-Breaded Chicken Tenders™ (5 Pc)',
      desc: 'Premium all-white meat chicken tenderloins, dipped in real buttermilk, hand-breaded in seasoned flour, and cooked golden brown. Served with honey mustard.',
      price: '$7.99',
      cal: '610 Cal',
      tag: 'Fresh Never Frozen',
      img: '/images/biscuits-tenders.jpg'
    },
    {
      id: 6,
      category: 'sides',
      name: 'Crispy Natural-Cut French Fries',
      desc: 'Skin-on premium potatoes, deep fried to a golden crunch and seasoned with sea salt. The perfect charbroiled burger companion.',
      price: '$3.49',
      cal: '430 Cal',
      tag: 'Hot & Crispy',
      img: '/images/biscuits-tenders.jpg'
    }
  ];

  const filteredMenu = activeMenuCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeMenuCategory);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
    setContactForm({ name: '', email: '', subject: 'Feedback', message: '' });
  };

  return (
    <div className="landing-page-wrap">
      {/* =====================================================
          HERO SECTION
          ====================================================== */}
      <section id="home" className="hero-section">
        <div className="hero-backdrop-pattern"></div>
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge-tag">
              <Flame size={15} color="#FFC928" />
              <span>Charbroiled Perfection Since 1960</span>
            </div>

            <h1 className="hero-headline">
              Real Food. Made from Scratch. <br />
              <span className="gold-text">Charbroiled</span> to Flavor.
            </h1>

            <p className="hero-subtitle">
              Welcome to Hardee’s of Rockingham, NC. Home of authentic charbroiled 100% Black Angus Thickburgers®,
              Made from Scratch™ buttermilk biscuits baked every 15 minutes, and hand-breaded tenders.
            </p>

            <div className="hero-cta-group">
              <a href="#menu" className="btn btn-gold btn-lg">
                Explore Our Menu <ArrowRight size={18} />
              </a>
              <button onClick={onOpenLogin} className="btn btn-outline-white btn-lg" id="heroPortalBtn">
                <Shield size={18} /> Staff Portal Login
              </button>
            </div>

            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <b>100%</b>
                <span>Charbroiled Black Angus</span>
              </div>
              <div className="hero-stat-item">
                <b>15 Min</b>
                <span>Biscuit Freshness Cycle</span>
              </div>
              <div className="hero-stat-item">
                <b>60+ Yrs</b>
                <span>Heritage & Quality</span>
              </div>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <img
              src="/images/hero-burger.jpg"
              alt="Hardee's Charbroiled Thickburger"
              className="hero-food-img"
            />
            <div className="hero-floating-card">
              <div className="floating-card-icon">⭐</div>
              <div className="floating-card-text">
                <strong>Rockingham Location</strong>
                <small>481 US Hwy 1 S · Open Now</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          OPERATIONAL EXCELLENCE & PILLARS (Inspired by Reference Architecture)
          ====================================================== */}
      <section className="section" id="pillars">
        <div className="section-container">
          <div className="section-header">
            <span className="section-kicker">The Hardee's Standard</span>
            <h2 className="section-title">Built on Quality, Speed & Southern Hospitality</h2>
            <p className="section-description">
              Every Hardee’s restaurant combines disciplined food preparation standards, modern kitchen operations,
              and genuine hospitality to deliver unmatched breakfast and charbroiled lunch experiences.
            </p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon-box"><Flame size={26} /></div>
              <h3>Charbroiled Beef</h3>
              <p>We grill our 100% Angus beef patties over an open flame, searing in smoky, savory juices without greasy frying.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box"><Award size={26} /></div>
              <h3>Scratch Biscuits</h3>
              <p>Our dedicated biscuit makers arrive at 4:00 AM every morning to roll and bake golden buttermilk biscuits from scratch.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box"><Sparkles size={26} /></div>
              <h3>Hand-Breaded Tenders</h3>
              <p>Fresh whole-muscle chicken tenderloins hand-dipped in buttermilk and tossed in seasoned breading per order.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box"><Clock size={26} /></div>
              <h3>Speed of Service</h3>
              <p>Fast and friendly drive-thru operations with real-time shift coordination and team performance tracking.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box"><Heart size={26} /></div>
              <h3>Community Heart</h3>
              <p>Proudly serving Rockingham and Richmond County families, local first responders, and morning commuters daily.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box"><Briefcase size={26} /></div>
              <h3>Crew Career Growth</h3>
              <p>Structured management training, competitive hourly wages, shift flexibility, and clear paths to store leadership.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MENU HIGHLIGHTS SECTION
          ====================================================== */}
      <section className="section menu-section" id="menu">
        <div className="section-container">
          <div className="section-header">
            <span className="section-kicker">Fresh Off The Grill</span>
            <h2 className="section-title">Signature Hardee's Favorites</h2>
            <p className="section-description">
              Prepared to order with quality ingredients, flame-broiled heat, and homemade Southern dedication.
            </p>
          </div>

          <div className="menu-filter-bar">
            <button
              className={`menu-tab-btn ${activeMenuCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveMenuCategory('all')}
            >
              All Favorites
            </button>
            <button
              className={`menu-tab-btn ${activeMenuCategory === 'burgers' ? 'active' : ''}`}
              onClick={() => setActiveMenuCategory('burgers')}
            >
              Charbroiled Thickburgers®
            </button>
            <button
              className={`menu-tab-btn ${activeMenuCategory === 'biscuits' ? 'active' : ''}`}
              onClick={() => setActiveMenuCategory('biscuits')}
            >
              Made from Scratch™ Biscuits
            </button>
            <button
              className={`menu-tab-btn ${activeMenuCategory === 'chicken' ? 'active' : ''}`}
              onClick={() => setActiveMenuCategory('chicken')}
            >
              Hand-Breaded Chicken
            </button>
            <button
              className={`menu-tab-btn ${activeMenuCategory === 'sides' ? 'active' : ''}`}
              onClick={() => setActiveMenuCategory('sides')}
            >
              Sides & Fries
            </button>
          </div>

          <div className="menu-items-grid">
            {filteredMenu.map(item => (
              <div key={item.id} className="menu-card">
                <div className="menu-card-img-wrap">
                  <img src={item.img} alt={item.name} className="menu-card-img" />
                  <span className="menu-badge">{item.tag}</span>
                </div>
                <div className="menu-card-body">
                  <div className="menu-card-title-row">
                    <h3 className="menu-card-title">{item.name}</h3>
                    <span className="menu-card-price">{item.price}</span>
                  </div>
                  <p className="menu-card-desc">{item.desc}</p>
                  <div className="menu-card-footer">
                    <span className="menu-calorie-info">{item.cal}</span>
                    <a
                      href="https://order.hardees.com/location/-nc-rockingham-481-us-highway-1-s/menu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      Order Online <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          HERITAGE / STORY SECTION
          ====================================================== */}
      <section className="section story-section" id="about">
        <div className="section-container">
          <div className="story-grid">
            <div className="story-img-wrap">
              <img
                src="/images/biscuits-tenders.jpg"
                alt="Hardee's scratch biscuits and hand-breaded tenders"
              />
            </div>
            <div className="story-content">
              <span className="section-kicker">Our Heritage</span>
              <h2>Over 60 Years of Uncompromised Taste</h2>
              <p>
                Founded in Greenville, North Carolina in 1960 by Wilber Hardee, Hardee’s has stood for big, delicious food
                cooked with care and pride. While competitors turned to microwaves and flat griddles, we preserved the
                authentic open-flame charbroiler.
              </p>
              <p>
                At our Rockingham store on US Highway 1, we continue this proud tradition every day. We don’t cut corners:
                every morning begins before dawn with our biscuit makers crafting small-batch buttermilk dough, and every
                burger patty is charbroiled to seal in real smokehouse flavor.
              </p>

              <div className="story-features">
                <div className="story-feature-item">
                  <Star size={18} /> 100% Angus Beef Cuts
                </div>
                <div className="story-feature-item">
                  <Award size={18} /> Real Buttermilk Biscuits
                </div>
                <div className="story-feature-item">
                  <Shield size={18} /> Rigorous Food Safety
                </div>
                <div className="story-feature-item">
                  <Coffee size={18} /> Freshly Brewed Arabica
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          LOCATION & CONTACT SECTION
          ====================================================== */}
      <section className="section location-section" id="locations">
        <div className="section-container">
          <div className="section-header">
            <span className="section-kicker">Visit Us in Richmond County</span>
            <h2 className="section-title">Rockingham Restaurant & Hours</h2>
            <p className="section-description">
              Stop by for breakfast on your morning commute or bring the family for charbroiled dinner.
            </p>
          </div>

          <div className="location-grid">
            <div className="location-info-card">
              <h3>Hardee’s #1502444 — Rockingham</h3>
              
              <div className="info-row">
                <MapPin size={22} />
                <div>
                  <strong>Street Address</strong>
                  <p>481 US Highway 1 S, Rockingham, NC 28379</p>
                  <span>Richmond County · Near Longwood & Broad Ave</span>
                </div>
              </div>

              <div className="info-row">
                <Clock size={22} />
                <div>
                  <strong>Operating Hours</strong>
                  <p>Monday – Saturday: 5:30 AM – 10:00 PM</p>
                  <p>Sunday: 6:00 AM – 9:00 PM</p>
                  <span>Breakfast served daily until 10:30 AM</span>
                </div>
              </div>

              <div className="info-row">
                <Phone size={22} />
                <div>
                  <strong>Store Telephone</strong>
                  <p>(910) 895-1020</p>
                </div>
              </div>

              <div className="info-row">
                <Award size={22} />
                <div>
                  <strong>Store Amenities</strong>
                  <p>Drive-Thru · Dine-In Lobby · Mobile Order Pickup · Free Guest Wi-Fi</p>
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <a
                  href="https://maps.google.com/?q=481+US+Highway+1+S,+Rockingham,+NC+28379"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <MapPin size={16} /> Get Driving Directions
                </a>
              </div>
            </div>

            <div className="contact-form-card" id="contact">
              <h3>Guest Contact & Inquiries</h3>
              <p>Have feedback or a catering request for our Rockingham management team? Send us a message.</p>

              {contactSubmitted && (
                <div style={{
                  background: 'var(--status-green-bg)',
                  border: '1px solid #C3E6CB',
                  color: 'var(--status-green)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '18px',
                  fontSize: '0.88rem'
                }}>
                  Thank you! Your feedback has been received by our store team.
                </div>
              )}

              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    required
                    placeholder="name@example.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Inquiry Subject</label>
                  <select
                    className="form-select"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  >
                    <option value="Feedback">Guest Experience & Feedback</option>
                    <option value="Catering">Morning Biscuit Catering Order</option>
                    <option value="Community">Community Sponsorship / Partnership</option>
                    <option value="General">General Inquiry</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    required
                    placeholder="How can our store team help you?"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CAREERS SECTION
          ====================================================== */}
      <section className="section" id="careers">
        <div className="section-container">
          <div className="careers-banner">
            <div>
              <h2>Join the Hardee’s Restaurant Family</h2>
              <p>
                We are always seeking passionate crew members, morning scratch biscuit bakers, and shift managers.
                Enjoy competitive pay starting at $14.50/hr, free employee meal discounts, flexible school schedules, and rapid advancement opportunities.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a
                  href="#contact"
                  className="btn btn-gold btn-lg"
                  onClick={() => setContactForm({ ...contactForm, subject: 'Careers' })}
                >
                  Apply in Rockingham <ArrowRight size={18} />
                </a>
                <button onClick={onOpenLogin} className="btn btn-outline-white btn-lg">
                  Employee Portal Login
                </button>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h4 style={{ color: 'var(--hardees-gold)', marginBottom: '14px', fontSize: '1.1rem' }}>Open Positions</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem' }}>
                <li>✓ <strong>Crew Member</strong> · Flexible AM/PM shifts</li>
                <li>✓ <strong>Morning Biscuit Maker</strong> · 4:00 AM – 12:00 PM</li>
                <li>✓ <strong>Shift Supervisor</strong> · Leadership pathway</li>
                <li>✓ <strong>Drive-Thru Lead</strong> · Customer hospitality</li>
              </ul>
            </div>
          </div>

          {/* Operational portal callout banner */}
          <div className="portal-callout">
            <div className="callout-content">
              <h4>Hardee’s Restaurant Employee & Attendance System</h4>
              <p>
                Registered staff members can sign in to clock in/out for active shifts, review weekly schedules, track hours,
                and managers can manage employee directories with persistent MySQL storage.
              </p>
            </div>
            <button onClick={onOpenLogin} className="btn btn-primary">
              <Shield size={16} /> Open Employee Portal
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
          ====================================================== */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-top-grid">
            <div className="footer-brand-col">
              <HardeesLogo height={42} />
              <p>
                Serving real charbroiled burgers and Made from Scratch™ biscuits with pride since 1960.
                Official portal for Hardee's #1502444, Rockingham, North Carolina.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span className="banner-badge">Store #1502444</span>
                <span className="banner-badge">MySQL Connected</span>
              </div>
            </div>

            <div className="footer-col">
              <h4>Navigation</h4>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#menu">Menu Favorites</a></li>
                <li><a href="#about">Our Heritage</a></li>
                <li><a href="#locations">Location & Hours</a></li>
                <li><a href="#careers">Careers</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Operations</h4>
              <ul className="footer-links">
                <li><a href="#home" onClick={onOpenLogin}>Employee Login</a></li>
                <li><a href="#home" onClick={onOpenLogin}>Manager Administration</a></li>
                <li><a href="#home" onClick={onOpenLogin}>Shift Punch Clock</a></li>
                <li><a href="#home" onClick={onOpenLogin}>Attendance Reports</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Rockingham Store</h4>
              <p style={{ fontSize: '0.86rem', color: '#9A9EA6', lineHeight: 1.6 }}>
                481 US Highway 1 S<br />
                Rockingham, NC 28379<br />
                Phone: (910) 895-1020<br />
                Hours: 5:30 AM – 10:00 PM Daily
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Hardee’s Restaurants LLC · Rockingham Store Operations System</span>
            <span>Secure Persistence via Relational MySQL & Spring Boot REST API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
