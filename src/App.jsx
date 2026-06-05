import { useState, useEffect } from 'react'

// Import modular components
import Auth from './components/Auth'
import SuperAdminView from './components/SuperAdminView'
import DepartmentAdminView from './components/DepartmentAdminView'
import FederationAdminView from './components/FederationAdminView'
import PlayerView from './components/PlayerView'
import CoachView from './components/CoachView'
import SponsorView from './components/SponsorView'
import ScorerView from './components/ScorerView'
import LiveMatches from './components/LiveMatches'
import Mailbox from './components/Mailbox'

// Import API services
import { api } from './services/api'

function App() {
  // Authentication & Session
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)
  
  // Forms & UI States
  const [authMode, setAuthMode] = useState('login') // login, register
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm] = useState({
    email: '', password: '', full_name: '', role: 'player', department_id: '', federation_id: ''
  })
  
  // Global Data lists
  const [departments, setDepartments] = useState([])
  const [federations, setFederations] = useState([])
  const [usersList, setUsersList] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [matches, setMatches] = useState([])
  const [notificationLogs, setNotificationLogs] = useState([])
  
  // Dashboard Specific States
  const [dashboardData, setDashboardData] = useState(null)
  const [pendingUsers, setPendingUsers] = useState([])
  const [pendingTournaments, setPendingTournaments] = useState([])
  
  // Creation Form States
  const [newDeptName, setNewDeptName] = useState('')
  const [newFed, setNewFed] = useState({ name: '', admin_id: '' })
  const [newTourney, setNewTourney] = useState({
    name: '', fee: 0, number_of_entry: 4, maximum_player_count: 5, team_limits: 5
  })
  const [newMatch, setNewMatch] = useState({ tournament_id: '', team_a_id: '', team_b_id: '', scorer_id: '' })
  const [newTeam, setNewTeam] = useState({ name: '', coach_id: '', player_ids: [] })
  const [selectedTournament, setSelectedTournament] = useState(null)
  const [sponsorAmount, setSponsorAmount] = useState(100)
  
  // Scorer States
  const [activeScoringMatch, setActiveScoringMatch] = useState(null)
  const [scoringForm, setScoringForm] = useState({ team: 'team_a', runs: 0, wickets: 0, overs: 0.0 })
  const [completeMatchModal, setCompleteMatchModal] = useState(null)
  const [playerPerformances, setPlayerPerformances] = useState([]) // list of { player_id, name, runs_scored, balls_faced, wickets_taken, runs_conceded }
  
  // Global Feedback States
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // Clear messages after a delay
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMsg])

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMsg])

  // Fetch current user details if token exists
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      fetchUserProfile()
    } else {
      localStorage.removeItem('token')
      setUser(null)
      setDashboardData(null)
    }
  }, [token])

  // Periodic poll for notification logs (simulating emails in real-time)
  useEffect(() => {
    if (token && user) {
      fetchNotificationLogs()
      const interval = setInterval(fetchNotificationLogs, 8000)
      return () => clearInterval(interval)
    }
  }, [token, user])

  // Fetch data based on role
  useEffect(() => {
    if (user) {
      fetchRoleDashboard()
      fetchAllCommonData()
    }
  }, [user])

  const fetchUserProfile = async () => {
    try {
      const data = await api.getProfile(token)
      setUser(data)
    } catch (e) {
      console.error(e)
      setToken('')
    }
  }

  const fetchNotificationLogs = async () => {
    try {
      const data = await api.getNotificationLogs(token)
      setNotificationLogs(data)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchAllCommonData = async () => {
    try {
      const deptData = await api.getDepartments(token)
      setDepartments(deptData)
      
      const fedData = await api.getFederations(token)
      setFederations(fedData)
      
      const tourneyData = await api.getTournaments(token)
      setTournaments(tourneyData)
      
      const matchData = await api.getMatches(token)
      setMatches(matchData)
      
      const coaches = await api.getUsersByRole(token, 'coach')
      const players = await api.getUsersByRole(token, 'player')
      const scorers = await api.getUsersByRole(token, 'scorer')
      
      setUsersList([...coaches, ...players, ...scorers])
    } catch (e) {
      console.error(e)
    }
  }

  const fetchRoleDashboard = async () => {
    if (!user) return
    try {
      if (user.role === 'player') {
        const data = await api.getPlayerDashboard(token)
        setDashboardData(data)
      } else if (user.role === 'coach') {
        const data = await api.getCoachDashboard(token)
        setDashboardData(data)
      } else if (user.role === 'sponsor') {
        const data = await api.getSponsorDashboard(token)
        setDashboardData(data)
      } else if (user.role === 'scorer') {
        const data = await api.getScorerDashboard(token)
        setDashboardData(data)
      } else if (user.role === 'department_admin') {
        const pendingRegs = await api.getPendingRegistrations(token)
        setPendingUsers(pendingRegs)
        const pendingTourneys = await api.getPendingTournaments(token)
        setPendingTournaments(pendingTourneys)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const data = await api.login(loginForm.email, loginForm.password)
      setToken(data.access_token)
      setSuccessMsg('Successfully logged in!')
    } catch (err) {
      setErrorMsg(err.message || 'Cannot connect to backend server.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const body = {
        email: regForm.email,
        password: regForm.password,
        full_name: regForm.full_name,
        role: regForm.role,
        department_id: regForm.department_id ? parseInt(regForm.department_id) : null,
        federation_id: regForm.federation_id ? parseInt(regForm.federation_id) : null
      }
      await api.register(body)
      setSuccessMsg('Registration request sent successfully! Wait for Department Admin to approve.')
      setAuthMode('login')
      setLoginForm({ email: regForm.email, password: regForm.password })
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickSeed = async () => {
    setLoading(true)
    try {
      await api.quickSeed()
      setSuccessMsg('Database seeded! Log in using superadmin@sports.com (password123).')
      try {
        const deptData = await api.getDepartments(token)
        setDepartments(deptData)
        const fedData = await api.getFederations(token)
        setFederations(fedData)
      } catch (innerErr) {
        // Ignored if not authorized
      }
    } catch (e) {
      setErrorMsg(e.message || 'Error triggering seed on backend.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDept = async (e) => {
    e.preventDefault()
    if (!newDeptName) return
    try {
      await api.createDepartment(token, newDeptName)
      setSuccessMsg(`Department '${newDeptName}' created successfully!`)
      setNewDeptName('')
      fetchAllCommonData()
    } catch (e) {
      setErrorMsg(e.message || 'Failed to create department.')
    }
  }

  const handleCreateFederation = async (e) => {
    e.preventDefault()
    if (!newFed.name) return
    try {
      const deptId = user.department_id
      if (!deptId) {
        setErrorMsg('You must be assigned to a department to create a federation.')
        return
      }

      await api.createFederation(
        token,
        deptId,
        newFed.name,
        newFed.admin_id ? parseInt(newFed.admin_id) : null
      )
      setSuccessMsg(`Federation '${newFed.name}' created successfully!`)
      setNewFed({ name: '', admin_id: '' })
      fetchAllCommonData()
    } catch (e) {
      setErrorMsg(e.message || 'Failed to create federation.')
    }
  }

  const handleApproveUser = async (userId) => {
    try {
      await api.approveUserRegistration(token, userId)
      setSuccessMsg('User approved successfully!')
      fetchRoleDashboard()
      fetchAllCommonData()
    } catch (e) {
      setErrorMsg(e.message || 'Failed to approve user.')
    }
  }

  const handleApproveTournament = async (tourneyId) => {
    try {
      await api.approveTournament(token, tourneyId)
      setSuccessMsg('Tournament approved! Teams can now register.')
      fetchRoleDashboard()
      fetchAllCommonData()
    } catch (e) {
      setErrorMsg(e.message || 'Failed to approve tournament.')
    }
  }

  const handleCreateTournament = async (e) => {
    e.preventDefault()
    try {
      await api.createTournament(token, newTourney)
      setSuccessMsg(`Tournament '${newTourney.name}' submitted to Department Admin for approval!`)
      setNewTourney({ name: '', fee: 0, number_of_entry: 4, maximum_player_count: 5, team_limits: 5 })
      fetchAllCommonData()
    } catch (e) {
      setErrorMsg(e.message || 'Failed to create tournament.')
    }
  }

  const handleScheduleMatch = async (e) => {
    e.preventDefault()
    if (!newMatch.tournament_id || !newMatch.team_a_id || !newMatch.team_b_id || !newMatch.scorer_id) {
      setErrorMsg('Please select all match fields.')
      return
    }
    if (newMatch.team_a_id === newMatch.team_b_id) {
      setErrorMsg('Team A and Team B must be different.')
      return
    }
    try {
      await api.scheduleMatch(token, newMatch.tournament_id, {
        team_a_id: parseInt(newMatch.team_a_id),
        team_b_id: parseInt(newMatch.team_b_id),
        scorer_id: parseInt(newMatch.scorer_id)
      })
      setSuccessMsg('Match scheduled successfully!')
      setNewMatch({ tournament_id: '', team_a_id: '', team_b_id: '', scorer_id: '' })
      fetchAllCommonData()
    } catch (e) {
      setErrorMsg(e.message || 'Failed to schedule match.')
    }
  }

  const handleRegisterTeam = async (e) => {
    e.preventDefault()
    if (!selectedTournament) return
    if (!newTeam.name || !newTeam.coach_id || newTeam.player_ids.length === 0) {
      setErrorMsg('Please fill name, select a coach, and select players.')
      return
    }
    try {
      await api.registerTeam(token, selectedTournament.id, {
        name: newTeam.name,
        coach_id: parseInt(newTeam.coach_id),
        player_ids: newTeam.player_ids.map(id => parseInt(id))
      })
      setSuccessMsg(`Team '${newTeam.name}' registered for '${selectedTournament.name}'! Invite emails dispatched.`)
      setNewTeam({ name: '', coach_id: '', player_ids: [] })
      setSelectedTournament(null)
      fetchAllCommonData()
      fetchRoleDashboard()
    } catch (e) {
      setErrorMsg(e.message || 'Failed to register team.')
    }
  }

  const handleSponsorTournament = async (tourneyId) => {
    try {
      await api.sponsorTournament(token, tourneyId, parseFloat(sponsorAmount))
      setSuccessMsg(`Pledged $${sponsorAmount} in sponsorship! Thank you.`)
      fetchAllCommonData()
      fetchRoleDashboard()
    } catch (e) {
      setErrorMsg(e.message || 'Failed to submit sponsorship.')
    }
  }

  const handleStartScoring = (match) => {
    setActiveScoringMatch(match)
    setScoringForm({ team: 'team_a', runs: match.team_a_runs, wickets: match.team_a_wickets, overs: match.team_a_overs })
  }

  const handleUpdateLiveScore = async (e) => {
    e.preventDefault()
    try {
      const updated = await api.updateLiveScore(token, activeScoringMatch.id, {
        team: scoringForm.team,
        runs: parseInt(scoringForm.runs),
        wickets: parseInt(scoringForm.wickets),
        overs: parseFloat(scoringForm.overs)
      })
      setActiveScoringMatch(updated)
      setSuccessMsg('Live score broadcasted!')
      fetchAllCommonData()
      fetchRoleDashboard()
    } catch (e) {
      setErrorMsg(e.message || 'Failed to update score.')
    }
  }

  const openCompletionModal = (match) => {
    setCompleteMatchModal(match)
    const playersA = match.team_a.players.map(p => ({ player_id: p.player_id, name: p.player.full_name }))
    const playersB = match.team_b.players.map(p => ({ player_id: p.player_id, name: p.player.full_name }))
    const combined = [...playersA, ...playersB].map(p => ({
      player_id: p.player_id,
      name: p.name,
      runs_scored: 0,
      balls_faced: 0,
      wickets_taken: 0,
      runs_conceded: 0
    }))
    setPlayerPerformances(combined)
  }

  const handleCompleteMatchSubmit = async (e) => {
    e.preventDefault()
    const winnerId = e.target.winner.value ? parseInt(e.target.winner.value) : null
    try {
      await api.completeMatch(token, completeMatchModal.id, {
        winner_id: winnerId,
        performances: playerPerformances
      })
      setSuccessMsg('Match marked completed! Performances analyzed and shared.')
      setCompleteMatchModal(null)
      setActiveScoringMatch(null)
      fetchAllCommonData()
      fetchRoleDashboard()
    } catch (e) {
      setErrorMsg(e.message || 'Failed to complete match.')
    }
  }

  const updatePerformanceField = (index, field, value) => {
    const copy = [...playerPerformances]
    copy[index][field] = parseInt(value) || 0
    setPlayerPerformances(copy)
  }

  const logout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('token')
  }

  function teamsListForSelectedMatchTourney(tourneyId) {
    if (!tourneyId) return []
    const t = tournaments.find(x => x.id === parseInt(tourneyId))
    if (!t || !t.teams) return []
    return t.teams
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-sports-cyan text-sports-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-xl font-bold tracking-wider text-slate-100 uppercase">
              Sports<span className="text-sports-cyan">Cricket</span>
            </span>
            <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded border border-slate-700">POC Model</span>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-200">{user.full_name}</div>
                <div className="text-xs text-sports-cyan font-mono uppercase">{user.role.replace('_', ' ')}</div>
              </div>
              <button onClick={logout} className="bg-red-950/40 hover:bg-red-900/40 border border-red-900/50 hover:border-red-600 text-red-400 text-xs px-3 py-1.5 rounded transition duration-200 cursor-pointer">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Toast Alerts */}
      <div className="max-w-7xl w-full mx-auto px-4 mt-4">
        {errorMsg && (
          <div className="bg-red-950/40 border-l-4 border-red-500 text-red-200 p-4 rounded-r glass-panel mb-4 flex items-center justify-between">
            <div>
              <span className="font-semibold">Error:</span> {errorMsg}
            </div>
            <button onClick={() => setErrorMsg('')} className="text-red-400 hover:text-red-200 text-lg">&times;</button>
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-950/40 border-l-4 border-emerald-500 text-emerald-200 p-4 rounded-r glass-panel mb-4 flex items-center justify-between">
            <div>
              <span className="font-semibold">Success:</span> {successMsg}
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-400 hover:text-emerald-200 text-lg">&times;</button>
          </div>
        )}
      </div>

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Forms and Dashboards */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {!token ? (
            <Auth
              loginForm={loginForm}
              setLoginForm={setLoginForm}
              regForm={regForm}
              setRegForm={setRegForm}
              authMode={authMode}
              setAuthMode={setAuthMode}
              handleLogin={handleLogin}
              handleRegister={handleRegister}
              handleQuickSeed={handleQuickSeed}
              loading={loading}
              departments={departments}
              federations={federations}
            />
          ) : (
            user && (
              <div className="space-y-6">
                {/* Dashboard Header Banner */}
                <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-xl flex items-center justify-between glass-panel">
                  <div>
                    <div className="text-xs text-sports-cyan font-mono tracking-widest uppercase">Logged-in Portal</div>
                    <h2 className="text-2xl font-bold text-slate-100 capitalize">
                      {user.role.replace('_', ' ')} Dashboard
                    </h2>
                  </div>
                  <div className="bg-sports-cyan/5 text-sports-cyan border border-sports-cyan/20 px-4 py-2 rounded-lg font-mono text-xs text-center">
                    Account Approved: <span className="font-bold text-emerald-400">TRUE</span>
                  </div>
                </div>

                {/* Dashboard Views */}
                {user.role === 'super_admin' && (
                  <SuperAdminView
                    newDeptName={newDeptName}
                    setNewDeptName={setNewDeptName}
                    handleCreateDept={handleCreateDept}
                    departments={departments}
                    federations={federations}
                  />
                )}

                {user.role === 'department_admin' && (
                  <DepartmentAdminView
                    newFed={newFed}
                    setNewFed={setNewFed}
                    handleCreateFederation={handleCreateFederation}
                    usersList={usersList}
                    pendingUsers={pendingUsers}
                    handleApproveUser={handleApproveUser}
                    pendingTournaments={pendingTournaments}
                    handleApproveTournament={handleApproveTournament}
                  />
                )}

                {user.role === 'federation_admin' && (
                  <FederationAdminView
                    newTourney={newTourney}
                    setNewTourney={setNewTourney}
                    handleCreateTournament={handleCreateTournament}
                    newMatch={newMatch}
                    setNewMatch={setNewMatch}
                    handleScheduleMatch={handleScheduleMatch}
                    tournaments={tournaments}
                    usersList={usersList}
                    teamsListForSelectedMatchTourney={teamsListForSelectedMatchTourney}
                  />
                )}

                {user.role === 'player' && dashboardData && (
                  <PlayerView
                    dashboardData={dashboardData}
                    tournaments={tournaments}
                    selectedTournament={selectedTournament}
                    setSelectedTournament={setSelectedTournament}
                    newTeam={newTeam}
                    setNewTeam={setNewTeam}
                    usersList={usersList}
                    handleRegisterTeam={handleRegisterTeam}
                    currentUser={user}
                  />
                )}

                {user.role === 'coach' && dashboardData && (
                  <CoachView dashboardData={dashboardData} />
                )}

                {user.role === 'sponsor' && dashboardData && (
                  <SponsorView
                    dashboardData={dashboardData}
                    tournaments={tournaments}
                    sponsorAmount={sponsorAmount}
                    setSponsorAmount={setSponsorAmount}
                    handleSponsorTournament={handleSponsorTournament}
                  />
                )}

                {user.role === 'scorer' && dashboardData && (
                  <ScorerView
                    dashboardData={dashboardData}
                    activeScoringMatch={activeScoringMatch}
                    setActiveScoringMatch={setActiveScoringMatch}
                    scoringForm={scoringForm}
                    setScoringForm={setScoringForm}
                    handleUpdateLiveScore={handleUpdateLiveScore}
                    openCompletionModal={openCompletionModal}
                    matches={matches}
                    handleStartScoring={handleStartScoring}
                  />
                )}
              </div>
            )
          )}
        </div>

        {/* Right Column: Live Feed & Mailbox */}
        <div className="space-y-6 col-span-1">
          <LiveMatches matches={matches} />
          {token && <Mailbox notificationLogs={notificationLogs} />}
        </div>
      </main>

      {/* Declare Match Ended Modal */}
      {completeMatchModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 max-w-2xl w-full p-6 rounded-xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-200">Declare Match Complete & Record Stats</h3>
              <p className="text-xs text-slate-400">Match: {completeMatchModal.team_a.name} vs {completeMatchModal.team_b.name}</p>
            </div>

            <form onSubmit={handleCompleteMatchSubmit} className="space-y-6">
              
              <div className="bg-slate-900/60 p-4 rounded border border-slate-800">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Declare Winner</label>
                <select name="winner" required className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none">
                  <option value="">-- Choose Winner --</option>
                  <option value={completeMatchModal.team_a_id}>{completeMatchModal.team_a.name}</option>
                  <option value={completeMatchModal.team_b_id}>{completeMatchModal.team_b.name}</option>
                  <option value="">No Winner (Draw / Abandoned)</option>
                </select>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-sports-cyan uppercase">Input Individual Player Stats</h4>
                <div className="max-h-60 overflow-y-auto border border-slate-900 rounded pr-1">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-850 text-slate-500 font-bold bg-slate-950 sticky top-0 animate-none">
                        <th className="py-2">Player</th>
                        <th className="py-2">Runs</th>
                        <th className="py-2">Balls</th>
                        <th className="py-2">Wickets</th>
                        <th className="py-2">Conceded</th>
                      </tr>
                    </thead>
                    <tbody>
                      {playerPerformances.map((perf, index) => (
                        <tr key={perf.player_id} className="border-b border-slate-900 hover:bg-slate-900/10">
                          <td className="py-2 font-semibold text-slate-300">{perf.name}</td>
                          <td className="py-2">
                            <input
                              type="number"
                              required
                              min="0"
                              className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-100 font-mono text-center"
                              value={perf.runs_scored}
                              onChange={(e) => updatePerformanceField(index, 'runs_scored', e.target.value)}
                            />
                          </td>
                          <td className="py-2">
                            <input
                              type="number"
                              required
                              min="0"
                              className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-100 font-mono text-center"
                              value={perf.balls_faced}
                              onChange={(e) => updatePerformanceField(index, 'balls_faced', e.target.value)}
                            />
                          </td>
                          <td className="py-2">
                            <input
                              type="number"
                              required
                              min="0"
                              max="10"
                              className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-emerald-400 font-mono text-center"
                              value={perf.wickets_taken}
                              onChange={(e) => updatePerformanceField(index, 'wickets_taken', e.target.value)}
                            />
                          </td>
                          <td className="py-2">
                            <input
                              type="number"
                              required
                              min="0"
                              className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-rose-400 font-mono text-center"
                              value={perf.runs_conceded}
                              onChange={(e) => updatePerformanceField(index, 'runs_conceded', e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-3 justify-end text-xs pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setCompleteMatchModal(null)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 rounded hover:bg-slate-900 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-sports-cyan text-slate-950 font-bold uppercase rounded hover:shadow-lg cursor-pointer"
                >
                  Submit Stats & Complete Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 text-center py-6 text-xs text-slate-600 mt-12">
        <div className="max-w-7xl mx-auto">
          Sports Cricket Tournament Management Portal &copy; {new Date().getFullYear()}. Crafted for POC validation.
        </div>
      </footer>

    </div>
  )
}

export default App
