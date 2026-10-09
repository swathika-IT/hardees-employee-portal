const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('hardees_token') || sessionStorage.getItem('hardees_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Authentication
  async login(employeeId, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(err.message || 'Invalid credentials');
    }
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('hardees_token', data.token);
      localStorage.setItem('hardees_user', JSON.stringify(data));
      sessionStorage.setItem('portal', '1');
      sessionStorage.setItem('employeeSession', data.employeeId);
    }
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getHeaders()
      });
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('hardees_token');
    localStorage.removeItem('hardees_user');
    sessionStorage.removeItem('portal');
    sessionStorage.removeItem('employeeSession');
  },

  // Employee Portal
  async getProfile() {
    const res = await fetch(`${API_BASE}/me/profile`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async getStatus() {
    const res = await fetch(`${API_BASE}/me/status`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch attendance status');
    return res.json();
  },

  async getAttendance() {
    const res = await fetch(`${API_BASE}/me/attendance`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch attendance records');
    return res.json();
  },

  async checkIn(notes = '') {
    const res = await fetch(`${API_BASE}/attendance/check-in`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ notes })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Check-in failed' }));
      throw new Error(err.message || 'Check-in failed');
    }
    return res.json();
  },

  async checkOut(notes = '') {
    const res = await fetch(`${API_BASE}/attendance/check-out`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ notes })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Check-out failed' }));
      throw new Error(err.message || 'Check-out failed');
    }
    return res.json();
  },

  // Manager Portal
  async getManagerStats() {
    const res = await fetch(`${API_BASE}/manager/stats`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch manager metrics');
    return res.json();
  },

  async getEmployees({ q = '', dept = '', status = '' } = {}) {
    const query = new URLSearchParams();
    if (q) query.append('q', q);
    if (dept) query.append('dept', dept);
    if (status) query.append('status', status);

    const res = await fetch(`${API_BASE}/manager/employees?${query.toString()}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },

  async getEmployeeById(id) {
    const res = await fetch(`${API_BASE}/manager/employees/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch employee details');
    return res.json();
  },

  async createEmployee(employee, defaultPassword = '') {
    const url = defaultPassword
      ? `${API_BASE}/manager/employees?defaultPassword=${encodeURIComponent(defaultPassword)}`
      : `${API_BASE}/manager/employees`;

    const res = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(employee)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to create employee' }));
      throw new Error(err.message || 'Failed to create employee');
    }
    return res.json();
  },

  async updateEmployee(id, employee) {
    const res = await fetch(`${API_BASE}/manager/employees/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(employee)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to update employee' }));
      throw new Error(err.message || 'Failed to update employee');
    }
    return res.json();
  },

  async toggleEmployeeStatus(id, status) {
    const res = await fetch(`${API_BASE}/manager/employees/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to change status');
    return res.json();
  },

  async deleteEmployee(id) {
    const res = await fetch(`${API_BASE}/manager/employees/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete employee');
    return res.json();
  },

  async getManagerAttendance({ employeeId = '', startDate = '', endDate = '' } = {}) {
    const query = new URLSearchParams();
    if (employeeId) query.append('employeeId', employeeId);
    if (startDate) query.append('startDate', startDate);
    if (endDate) query.append('endDate', endDate);

    const res = await fetch(`${API_BASE}/manager/attendance?${query.toString()}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch attendance');
    return res.json();
  },

  async downloadAttendanceCsv({ employeeId = '', startDate = '', endDate = '' } = {}) {
    const query = new URLSearchParams();
    if (employeeId) query.append('employeeId', employeeId);
    if (startDate) query.append('startDate', startDate);
    if (endDate) query.append('endDate', endDate);

    const res = await fetch(`${API_BASE}/manager/attendance/export-csv?${query.toString()}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to export CSV');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hardees_attendance_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  async downloadEmployeesCsv({ q = '', dept = '', status = '' } = {}) {
    const query = new URLSearchParams();
    if (q) query.append('q', q);
    if (dept) query.append('dept', dept);
    if (status) query.append('status', status);

    const res = await fetch(`${API_BASE}/manager/employees/export-csv?${query.toString()}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to export CSV');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hardees_employee_directory_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
};
