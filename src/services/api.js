const API_BASE = 'http://187.77.189.31:7000/api/v1';
//const API_BASE = "http://localhost:8000/api/v1";

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'API request failed');
  }
  return data;
};

export const api = {
  // Authentication & Users
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  getProfile: async (token) => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  getUsersByRole: async (token, role, allUsers = false) => {
    const res = await fetch(`${API_BASE}/auth/users?role=${role || ''}${allUsers ? '&all_users=true' : ''}`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  // Notification Logs
  getNotificationLogs: async (token) => {
    const res = await fetch(`${API_BASE}/notifications/logs`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  // Seed Helper
  quickSeed: async () => {
    const res = await fetch(`${API_BASE}/seed`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  // Super Admin
  createDepartment: async (token, name) => {
    const res = await fetch(`${API_BASE}/superadmin/departments`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ name }),
    });
    return handleResponse(res);
  },

  getDepartments: async (token) => {
    const res = await fetch(`${API_BASE}/departments`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  // Department Admin
  createFederation: async (token, deptId, name, adminId) => {
    const res = await fetch(`${API_BASE}/departments/${deptId}/federations`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ name, admin_id: adminId }),
    });
    return handleResponse(res);
  },

  getFederations: async (token) => {
    const res = await fetch(`${API_BASE}/federations`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  getPendingRegistrations: async (token) => {
    const res = await fetch(`${API_BASE}/department/pending-registrations`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  approveUserRegistration: async (token, userId) => {
    const res = await fetch(`${API_BASE}/department/approve-registration/${userId}`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  getPendingTournaments: async (token) => {
    const res = await fetch(`${API_BASE}/department/pending-tournaments`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  approveTournament: async (token, tournamentId) => {
    const res = await fetch(`${API_BASE}/department/approve-tournament/${tournamentId}`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  // Federation Admin
  createTournament: async (token, tournamentData) => {
    const res = await fetch(`${API_BASE}/tournaments`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(tournamentData),
    });
    return handleResponse(res);
  },

  getTournaments: async (token) => {
    const res = await fetch(`${API_BASE}/tournaments/all`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  scheduleMatch: async (token, tournamentId, matchData) => {
    const res = await fetch(`${API_BASE}/tournaments/${tournamentId}/matches`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(matchData),
    });
    return handleResponse(res);
  },

  // Player Dashboard / Registrations
  registerTeam: async (token, tournamentId, teamData) => {
    const res = await fetch(`${API_BASE}/tournaments/${tournamentId}/register-team`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(teamData),
    });
    return handleResponse(res);
  },

  // Sponsor
  sponsorTournament: async (token, tournamentId, amount) => {
    const res = await fetch(`${API_BASE}/tournaments/${tournamentId}/sponsor`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ amount }),
    });
    return handleResponse(res);
  },

  // Matches & Scoring (Scorer)
  getMatches: async (token) => {
    const res = await fetch(`${API_BASE}/matches`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  updateLiveScore: async (token, matchId, scoreData) => {
    const res = await fetch(`${API_BASE}/matches/${matchId}/score`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(scoreData),
    });
    return handleResponse(res);
  },

  completeMatch: async (token, matchId, completeData) => {
    const res = await fetch(`${API_BASE}/matches/${matchId}/complete`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(completeData),
    });
    return handleResponse(res);
  },

  // Dashboards
  getPlayerDashboard: async (token) => {
    const res = await fetch(`${API_BASE}/dashboard/player`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  getCoachDashboard: async (token) => {
    const res = await fetch(`${API_BASE}/dashboard/coach`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  getSponsorDashboard: async (token) => {
    const res = await fetch(`${API_BASE}/dashboard/sponsor`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  getScorerDashboard: async (token) => {
    const res = await fetch(`${API_BASE}/dashboard/scorer`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  // Admin and Federation extensions
  deleteUser: async (token, userId) => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  blockUser: async (token, userId) => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/block`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  unblockUser: async (token, userId) => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/unblock`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  deleteMatch: async (token, matchId) => {
    const res = await fetch(`${API_BASE}/admin/matches/${matchId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  deleteFederation: async (token, fedId) => {
    const res = await fetch(`${API_BASE}/admin/federations/${fedId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  deleteTournament: async (token, tourneyId) => {
    const res = await fetch(`${API_BASE}/admin/tournaments/${tourneyId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  getPendingTeams: async (token) => {
    const res = await fetch(`${API_BASE}/federation/pending-teams`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  getPendingSponsorships: async (token) => {
    const res = await fetch(`${API_BASE}/federation/pending-sponsorships`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  getPendingScorers: async (token) => {
    const res = await fetch(`${API_BASE}/federation/pending-scorers`, {
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  approveTeam: async (token, teamId) => {
    const res = await fetch(`${API_BASE}/federation/teams/${teamId}/approve`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  approveSponsorship: async (token, sponsorshipId) => {
    const res = await fetch(`${API_BASE}/federation/sponsorships/${sponsorshipId}/approve`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  approveScorer: async (token, applicationId) => {
    const res = await fetch(`${API_BASE}/federation/scorers/${applicationId}/approve`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },

  applyScorer: async (token, tournamentId) => {
    const res = await fetch(`${API_BASE}/tournaments/${tournamentId}/apply-scorer`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    return handleResponse(res);
  },
};
