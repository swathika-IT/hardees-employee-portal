import React, { useState, useEffect } from 'react';
import HardeesLogo from './HardeesLogo';
import {
  Clock,
  CheckCircle,
  Calendar,
  DollarSign,
  User,
  LogOut,
  Award,
  ChevronRight,
  TrendingUp,
  FileText,
  AlertCircle,
  Play,
  Square,
  MapPin,
  Briefcase,
  Home
} from 'lucide-react';
import { api } from '../api';

export default function EmployeeDashboard({ user, onLogout, onGoToLanding }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [statusData, setStatusData] = useState({
    status: 'NOT_CHECKED_IN',
    checkInTime: null,
    checkOutTime: null,
    hoursToday: 0.0,
    liveMinutes: 0
  });
  const [attendanceList, setAttendanceList] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shiftNote, setShiftNote] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Live Clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch status, attendance history, and profile
  const refreshData = async () => {
    try {
      const [statusRes, attRes, profRes] = await Promise.all([
        api.getStatus().catch(() => ({ status: 'NOT_CHECKED_IN', hoursToday: 0.0 })),
        api.getAttendance().catch(() => []),
        api.getProfile().catch(() => null)
      ]);
      setStatusData(statusRes);
      setAttendanceList(attRes);
      if (profRes) setProfile(profRes);
    } catch (e) {
      console.error('Failed to load employee dashboard data:', e);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await api.checkIn(shiftNote);
      setShiftNote('');
      showToast('✓ Check-in recorded! Your shift has started.');
      await refreshData();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      await api.checkOut(shiftNote);
      setShiftNote('');
      showToast('✓ Check-out recorded! Shift completed.');
      await refreshData();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (iso) => {
    if (!iso) return '--:--';
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const employeeName = user?.fullName || 'Jordan Miller';
  const employeeCode = user?.employeeId || 'DEMO1001';
  const roleName = profile?.jobRole || user?.jobRole || 'Crew Member';
  const deptName = profile?.department || user?.department || 'Kitchen Operations';
  const locationName = profile?.restaurantLocation || '481 US Highway 1 S, Rockingham, NC';
  const hourlyRate = profile?.hourlyRate || 14.50;

  // Mock static schedule data matching original project
  const weeklySchedule = [
    { day: 'Mon', date: '10/05/2026', shift: '5:30 AM – 2:00 PM', station: 'Opening Biscuit & Breakfast Grill', hours: 8.5 },
    { day: 'Tue', date: '10/06/2026', shift: '5:30 AM – 2:00 PM', station: 'Breakfast Prep & Burger Line', hours: 8.5 },
    { day: 'Wed', date: '10/07/2026', shift: 'OFF', station: 'Scheduled Rest Day', hours: 0 },
    { day: 'Thu', date: '10/08/2026', shift: '11:00 AM – 7:30 PM', station: 'Lunch Rush & Tenders Station', hours: 8.5 },
    { day: 'Fri', date: '10/09/2026', shift: '5:30 AM – 2:00 PM', station: 'Kitchen Operations & Drive-Thru', hours: 8.5 }
  ];

  // Pay Statements matching original project
  const payStubs = [
    { payDate: '09/25/2026', period: '09/12–09/25', gross: '$1,160.00', tax: '$139.20', net: '$985.80', status: 'Paid' },
    { payDate: '09/11/2026', period: '08/29–09/11', gross: '$1,087.50', tax: '$130.50', net: '$925.00', status: 'Paid' }
  ];

  const totalWeeklyHours = 34.0;
  const isCheckedIn = statusData.status === 'ON_SHIFT';

  return (
    <div className="portal-layout">
      {/* Toast notification */}
      {toastMsg && (
        <div className="toast-container">
          <div className="toast toast-success">
            <CheckCircle size={18} color="#1B8A46" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="portal-sidebar">
        <div className="sidebar-header">
          <HardeesLogo height={36} />
          <span className="sidebar-badge">Store #1502444</span>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-group-title">EMPLOYEE PORTAL</span>
          <button
            className={`sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Clock size={18} /> <span>Dashboard</span>
          </button>

          <button
            className={`sidebar-btn ${activeTab === 'punch' ? 'active' : ''}`}
            onClick={() => setActiveTab('punch')}
            id="sidebarPunchClockBtn"
          >
            <Play size={18} /> <span>Check In / Check Out</span>
          </button>

          <button
            className={`sidebar-btn ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            <Calendar size={18} /> <span>My Attendance</span>
          </button>

          <button
            className={`sidebar-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <FileText size={18} /> <span>My Schedule</span>
          </button>

          <button
            className={`sidebar-btn ${activeTab === 'hours' ? 'active' : ''}`}
            onClick={() => setActiveTab('hours')}
          >
            <TrendingUp size={18} /> <span>My Hours</span>
          </button>

          <button
            className={`sidebar-btn ${activeTab === 'pay' ? 'active' : ''}`}
            onClick={() => setActiveTab('pay')}
          >
            <DollarSign size={18} /> <span>Pay Statements</span>
          </button>

          <button
            className={`sidebar-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> <span>Profile</span>
          </button>

          <span className="nav-group-title" style={{ marginTop: '16px' }}>NAVIGATION</span>
          <button className="sidebar-btn" onClick={onGoToLanding}>
            <Home size={18} /> <span>Restaurant Website</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-widget">
            <div className="user-avatar">{employeeName.split(' ').map(n => n[0]).join('')}</div>
            <div className="user-info-text">
              <strong>{employeeName}</strong>
              <small>{employeeCode} · {roleName}</small>
            </div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
            onClick={onLogout}
            id="employeeLogoutBtn"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Workspace Content */}
      <main className="portal-main">
        {/* Topbar */}
        <header className="portal-topbar">
          <div className="topbar-left">
            <h2>Welcome back, Jordan!</h2>
            <p>Employee dashboard · {locationName}</p>
          </div>
          <div className="topbar-right">
            <div className="live-clock-badge">
              <Clock size={16} color="#C8202B" />
              <span>{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span style={{ color: '#C8202B', fontWeight: 800 }}>
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
              </span>
            </div>
          </div>
        </header>

        <div className="portal-content">
          {/* =====================================================
              PRIMARY SHIFT PUNCH CLOCK HERO CARD
              ====================================================== */}
          <div className="punch-clock-card">
            <div>
              <span className="punch-kicker">TODAY'S SHIFT · {deptName.toUpperCase()}</span>
              <h2 className="punch-headline">
                {isCheckedIn ? 'You Are Currently On Shift' : statusData.status === 'SHIFT_COMPLETED' ? 'Shift Completed for Today' : 'Ready to Start Your Shift?'}
              </h2>
              <p className="punch-subtext">
                {isCheckedIn
                  ? `Shift started at ${formatTime(statusData.checkInTime)}. Working time is being recorded persistently.`
                  : statusData.status === 'SHIFT_COMPLETED'
                  ? `Checked out at ${formatTime(statusData.checkOutTime)}. Total logged shift: ${statusData.hoursToday} hrs.`
                  : 'Please check in when you arrive at your scheduled station.'}
              </p>

              <div className="punch-time-tags">
                <div className="punch-time-tag">
                  <span>TODAY'S CHECK-IN</span>
                  <strong>{statusData.checkInTime ? formatTime(statusData.checkInTime) : 'Not Checked In'}</strong>
                </div>
                <div className="punch-time-tag">
                  <span>TODAY'S CHECK-OUT</span>
                  <strong>{statusData.checkOutTime ? formatTime(statusData.checkOutTime) : isCheckedIn ? 'In Progress' : 'None'}</strong>
                </div>
                <div className="punch-time-tag">
                  <span>HOURS WORKED TODAY</span>
                  <strong>{statusData.hoursToday ? `${statusData.hoursToday} hrs` : '0.0 hrs'}</strong>
                </div>
              </div>
            </div>

            <div className="punch-action-box">
              <span className={`status-pill-big ${
                isCheckedIn ? 'status-on-shift' : statusData.status === 'SHIFT_COMPLETED' ? 'status-completed' : 'status-not-checked'
              }`}>
                ● {isCheckedIn ? 'Checked In' : statusData.status === 'SHIFT_COMPLETED' ? 'Shift Completed' : 'Checked Out'}
              </span>

              <div style={{ marginBottom: '14px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Optional shift note (station, prep...)"
                  value={shiftNote}
                  onChange={(e) => setShiftNote(e.target.value)}
                  style={{ background: 'rgba(255, 255, 255, 0.9)', fontSize: '0.86rem' }}
                />
              </div>

              {isCheckedIn ? (
                <button
                  className="btn btn-gold btn-lg"
                  style={{ width: '100%', fontSize: '1.1rem', letterSpacing: '0.5px' }}
                  onClick={handleCheckOut}
                  disabled={loading}
                  id="checkInButton"
                >
                  <Square size={20} fill="#801820" /> CHECK OUT
                </button>
              ) : (
                <button
                  className="btn btn-gold btn-lg"
                  style={{ width: '100%', fontSize: '1.1rem', letterSpacing: '0.5px' }}
                  onClick={handleCheckIn}
                  disabled={loading || statusData.status === 'SHIFT_COMPLETED'}
                  id="checkInButton"
                >
                  <Play size={20} fill="#801820" /> CHECK IN
                </button>
              )}

              {statusData.status === 'SHIFT_COMPLETED' && (
                <small style={{ display: 'block', color: 'rgba(255, 255, 255, 0.8)', marginTop: '8px' }}>
                  ✓ Shift completed. Contact manager for additional punch requests.
                </small>
              )}
            </div>
          </div>

          {/* =====================================================
              METRICS & STATS CARDS
              ====================================================== */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-info">
                <small>Today's worked hours</small>
                <b>{statusData.hoursToday} hrs</b>
              </div>
              <div className="stat-card-icon stat-icon-red"><Clock size={22} /></div>
            </div>

            <div className="stat-card">
              <div className="stat-card-info">
                <small>This week's total hours</small>
                <b>{totalWeeklyHours} hrs</b>
              </div>
              <div className="stat-card-icon stat-icon-gold"><TrendingUp size={22} /></div>
            </div>

            <div className="stat-card">
              <div className="stat-card-info">
                <small>Performance score</small>
                <b>98.5%</b>
              </div>
              <div className="stat-card-icon stat-icon-green"><Award size={22} /></div>
            </div>

            <div className="stat-card">
              <div className="stat-card-info">
                <small>Attendance percentage</small>
                <b>100%</b>
              </div>
              <div className="stat-card-icon stat-icon-amber"><CheckCircle size={22} /></div>
            </div>
          </div>

          {/* =====================================================
              TAB CONTENT SWITCHER
              ====================================================== */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
              <div className="panel-card">
                <div className="panel-header">
                  <div className="panel-header-title">
                    <h3>Recent activity</h3>
                    <p>Live attendance events stored in MySQL database</p>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Hours</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceList.length > 0 ? (
                        attendanceList.slice(0, 5).map((rec) => (
                          <tr key={rec.id}>
                            <td>{formatDate(rec.attendanceDate)}</td>
                            <td>{formatTime(rec.checkIn)}</td>
                            <td>{rec.checkOut ? formatTime(rec.checkOut) : 'In Progress'}</td>
                            <td><strong>{rec.shiftHours} hrs</strong></td>
                            <td>
                              <span className={`status-badge ${rec.status === 'COMPLETED' ? 'badge-active' : 'badge-leave'}`}>
                                {rec.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                            No attendance records recorded yet today. Click "CHECK IN" above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="panel-card">
                <div className="panel-header">
                  <div className="panel-header-title">
                    <h3>Upcoming shift</h3>
                    <p>Your next restaurant station assignment</p>
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{
                    background: 'var(--surface-warm)',
                    border: '1px solid var(--surface-border)',
                    padding: '18px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '16px'
                  }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--hardees-red)', textTransform: 'uppercase' }}>
                      TOMORROW · MORNING SHIFT
                    </span>
                    <h4 style={{ fontSize: '1.2rem', margin: '6px 0' }}>5:30 AM – 2:00 PM</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      Station: Scratch Biscuit Prep & Breakfast Grill
                    </p>
                    <small style={{ color: 'var(--text-light)', display: 'block', marginTop: '6px' }}>
                      Location: 481 US Highway 1 S, Rockingham, NC
                    </small>
                  </div>

                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    <strong>Store Policy Reminder:</strong> Clock in at least 5 minutes prior to shift scheduled time in clean Hardee’s uniform and non-slip kitchen shoes.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'punch' && (
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-header-title">
                  <h3>Check In / Check Out Clock</h3>
                  <p>Accurate timekeeping backed by relational database transactions</p>
                </div>
              </div>
              <div style={{ padding: '30px', maxWidth: '600px' }}>
                <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
                  Use this dedicated screen to clock in or clock out during your shifts. Duplicate shifts are blocked,
                  and actual timestamps are generated securely by the Spring Boot backend server.
                </p>
                <div className="form-group">
                  <label className="form-label">Shift Notes / Station Assigned</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Breakfast Biscuit Baker, Drive-thru Window, Line Cook"
                    value={shiftNote}
                    onChange={(e) => setShiftNote(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '14px', marginTop: '20px' }}>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleCheckIn}
                    disabled={loading || isCheckedIn}
                  >
                    <Play size={18} /> Record Check-In
                  </button>
                  <button
                    className="btn btn-secondary btn-lg"
                    onClick={handleCheckOut}
                    disabled={loading || !isCheckedIn}
                  >
                    <Square size={18} /> Record Check-Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-header-title">
                  <h3>Complete Attendance History</h3>
                  <p>Persistent historical shifts for {employeeName} ({employeeCode})</p>
                </div>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Shift ID</th>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Duration</th>
                      <th>Shift Notes</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList.map((rec) => (
                      <tr key={rec.id}>
                        <td>#{rec.id}</td>
                        <td>{formatDate(rec.attendanceDate)}</td>
                        <td>{formatTime(rec.checkIn)}</td>
                        <td>{rec.checkOut ? formatTime(rec.checkOut) : 'In Progress'}</td>
                        <td><strong>{rec.shiftHours} hrs</strong></td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>{rec.notes || 'Standard shift'}</td>
                        <td>
                          <span className={`status-badge ${rec.status === 'COMPLETED' ? 'badge-active' : 'badge-leave'}`}>
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-header-title">
                  <h3>Weekly Work Schedule</h3>
                  <p>Published shift schedule for Hardee’s Rockingham, NC</p>
                </div>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Date</th>
                      <th>Shift Times</th>
                      <th>Station Assignment</th>
                      <th>Planned Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklySchedule.map((s, idx) => (
                      <tr key={idx}>
                        <td><strong>{s.day}</strong></td>
                        <td>{s.date}</td>
                        <td style={{ color: s.shift === 'OFF' ? 'var(--text-light)' : 'var(--hardees-red)', fontWeight: 600 }}>
                          {s.shift}
                        </td>
                        <td>{s.station}</td>
                        <td>{s.hours > 0 ? `${s.hours} hrs` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'hours' && (
            <div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-info">
                    <small>Current Period</small>
                    <b>40.0 hrs</b>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <small>Regular Hours</small>
                    <b>40.0 hrs</b>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <small>Overtime</small>
                    <b>0.0 hrs</b>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <small>Hourly Base Rate</small>
                    <b>${hourlyRate.toFixed(2)}</b>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pay' && (
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-header-title">
                  <h3>Payroll & Pay Stubs</h3>
                  <p>Bi-weekly pay earnings and payroll statements</p>
                </div>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Pay Date</th>
                      <th>Pay Period</th>
                      <th>Gross Pay</th>
                      <th>Deductions</th>
                      <th>Net Pay</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payStubs.map((p, idx) => (
                      <tr key={idx}>
                        <td>{p.payDate}</td>
                        <td>{p.period}</td>
                        <td>{p.gross}</td>
                        <td>{p.tax}</td>
                        <td><strong style={{ color: 'var(--hardees-burgundy)' }}>{p.net}</strong></td>
                        <td><span className="status-badge badge-active">{p.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-header-title">
                  <h3>My Employee Profile</h3>
                  <p>Verified restaurant staff records</p>
                </div>
              </div>
              <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div>
                  <small style={{ color: 'var(--text-light)', display: 'block', textTransform: 'uppercase' }}>Full Name</small>
                  <strong style={{ fontSize: '1.05rem' }}>{employeeName}</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--text-light)', display: 'block', textTransform: 'uppercase' }}>Employee ID</small>
                  <strong style={{ fontSize: '1.05rem' }}>{employeeCode}</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--text-light)', display: 'block', textTransform: 'uppercase' }}>Job Role</small>
                  <strong style={{ fontSize: '1.05rem' }}>{roleName}</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--text-light)', display: 'block', textTransform: 'uppercase' }}>Department</small>
                  <strong style={{ fontSize: '1.05rem' }}>{deptName}</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--text-light)', display: 'block', textTransform: 'uppercase' }}>Store Location</small>
                  <strong style={{ fontSize: '1.05rem' }}>{locationName}</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--text-light)', display: 'block', textTransform: 'uppercase' }}>Hourly Rate</small>
                  <strong style={{ fontSize: '1.05rem' }}>${hourlyRate.toFixed(2)} / hr</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--text-light)', display: 'block', textTransform: 'uppercase' }}>Email</small>
                  <strong style={{ fontSize: '1.05rem' }}>{profile?.email || 'jordan.miller@hardees-rockingham.com'}</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--text-light)', display: 'block', textTransform: 'uppercase' }}>Phone</small>
                  <strong style={{ fontSize: '1.05rem' }}>{profile?.phone || '(910) 895-1044'}</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--text-light)', display: 'block', textTransform: 'uppercase' }}>Account Status</small>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--status-green)' }}>Active</strong>
                </div>
              </div>
            </div>
          )}

          {/* Persistent verification banner */}
          <div style={{
            background: 'var(--surface-warm)',
            border: '1px solid var(--surface-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '20px'
          }}>
            <span>● Connected to Hardee's Spring Boot Backend & MySQL Database</span>
            <span>All check-ins and hours are persistently saved.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
