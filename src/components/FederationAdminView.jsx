// src/components/FederationAdminView.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Calendar, Users, Award, PlusCircle, Check, 
  Play, Ban, ShieldCheck, HeartHandshake, UserCheck, 
  MapPin, Coins, Sparkles, Plus, Info, Clock, AlertCircle, Trash2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import StaticCharts from './StaticCharts';

// Framer Motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  }
};

const tabVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } }
};

export default function FederationAdminView({
  activeTab,
  newTourney,
  setNewTourney,
  handleCreateTournament,
  newMatch,
  setNewMatch,
  handleScheduleMatch,
  tournaments,
  usersList = [],
  teamsListForSelectedMatchTourney,
  pendingTeams = [],
  pendingSponsorships = [],
  pendingScorers = [],
  handleApproveTeam,
  handleApproveSponsorship,
  handleApproveScorer,
  handleDeleteTeam,
  handleDeleteSponsorship,
  handleDeleteScorer,
  matches = [],
  onSelectMatch
}) {

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        variants={tabVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full"
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.05 }}
              >
                <Card className="flex flex-col justify-center relative overflow-hidden">
                  <span className="text-[var(--text-secondary)] text-[10px] font-extrabold uppercase tracking-widest">Approved Tournaments</span>
                  <h4 className="text-3xl font-black text-[var(--text-primary)] mt-1 font-display">
                    {tournaments.filter(t => t.is_approved).length}
                  </h4>
                  <span className="text-emerald-500 font-bold text-[10px] mt-1 flex items-center gap-1">
                    Active Leagues
                  </span>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.15 }}
              >
                <Card className="flex flex-col justify-center relative overflow-hidden">
                  <span className="text-[var(--text-secondary)] text-[10px] font-extrabold uppercase tracking-widest">Pending Approvals</span>
                  <h4 className="text-3xl font-black text-amber-500 mt-1 font-display">
                    {tournaments.filter(t => !t.is_approved).length}
                  </h4>
                  <span className="text-amber-500 font-bold text-[10px] mt-1 flex items-center gap-1">
                    Requires Admin Action
                  </span>
                </Card>
              </motion.div>
            </div>

            {/* List of Tournaments */}
            <Card>
              <CardHeader className="flex justify-between items-center mb-5">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[var(--accent)]" />
                  Active Tournaments
                </CardTitle>
                <Badge variant="neutral" className="font-mono">
                  Total: {tournaments.length}
                </Badge>
              </CardHeader>

              {tournaments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[var(--text-muted)] text-sm italic">No tournaments created yet.</p>
                </div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 gap-3.5"
                >
                  {tournaments.map(t => (
                    <motion.div key={t.id} variants={itemVariants}>
                      <div className="bg-[var(--bg-input)] hover:bg-[var(--bg-card-hover)] p-4 rounded-xl border border-[var(--border-default)] hover:border-[var(--border-card-hover)] flex justify-between items-center transition-all duration-200">
                        <div>
                          <div className="font-extrabold text-[var(--text-primary)] text-sm">{t.name}</div>
                          <div className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-3">
                            <span className="font-mono bg-[var(--bg-page)] px-2 py-0.5 rounded border border-[var(--border-default)]">
                              Fee: ${t.fee}
                            </span>
                            <span className="font-mono">
                              Entries: <span className="font-bold text-[var(--accent-text)]">{t.teams ? t.teams.length : 0}</span> / {t.number_of_entry} Teams
                            </span>
                          </div>
                        </div>
                        <Badge 
                          variant={t.is_approved ? "success" : "warning"}
                          glow={!t.is_approved}
                          oscillate={!t.is_approved}
                        >
                          {t.is_approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </Card>

            {/* Static Analytics Charts */}
            <StaticCharts />
          </div>
        )}

        {activeTab === 'create_tournament' && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="mb-6">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <PlusCircle className="w-6 h-6 text-[var(--accent)]" />
                  Create a Cricket Tournament
                </CardTitle>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Request approval from the Department Admin for a new cricket league tournament.
                </p>
              </div>
            </CardHeader>

            <form onSubmit={handleCreateTournament} autoComplete="off" className="space-y-6 text-xs">
              {/* Group 1: Basics */}
              <div className="bg-[var(--bg-input)] p-5 rounded-2xl border border-[var(--border-default)] space-y-4">
                <h4 className="font-bold text-[var(--accent-text)] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  1. Tournament Basics & Venue
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Tournament Title</label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      placeholder="e.g. Summer Premier League"
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newTourney.name}
                      onChange={(e) => setNewTourney({ ...newTourney, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">City</label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      placeholder="e.g. Chennai"
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newTourney.city}
                      onChange={(e) => setNewTourney({ ...newTourney, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Ground Name</label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      placeholder="e.g. M. A. Chidambaram Stadium"
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newTourney.ground_name}
                      onChange={(e) => setNewTourney({ ...newTourney, ground_name: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Rules & Capacity */}
              <div className="bg-[var(--bg-input)] p-5 rounded-2xl border border-[var(--border-default)] space-y-4">
                <h4 className="font-bold text-[var(--accent-text)] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  2. Match Rules & Team Capacity
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Ball Type</label>
                    <select
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newTourney.ball_type}
                      onChange={(e) => setNewTourney({ ...newTourney, ball_type: e.target.value })}
                    >
                      <option value="leather">Leather Ball</option>
                      <option value="tennis">Tennis Ball</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Overs</label>
                    <input
                      type="number"
                      required
                      autoComplete="off"
                      min="1"
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newTourney.overs}
                      onChange={(e) => setNewTourney({ ...newTourney, overs: parseInt(e.target.value) || 20 })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Max Teams</label>
                    <input
                      type="number"
                      required
                      autoComplete="off"
                      min="2"
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newTourney.number_of_entry}
                      onChange={(e) => setNewTourney({ ...newTourney, number_of_entry: parseInt(e.target.value) || 2 })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Players/Team</label>
                    <input
                      type="number"
                      required
                      autoComplete="off"
                      min="5"
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newTourney.maximum_player_count}
                      onChange={(e) => setNewTourney({ ...newTourney, maximum_player_count: parseInt(e.target.value) || 5 })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Squad Limit</label>
                    <input
                      type="number"
                      required
                      autoComplete="off"
                      min="5"
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newTourney.team_limits}
                      onChange={(e) => setNewTourney({ ...newTourney, team_limits: parseInt(e.target.value) || 5 })}
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Schedule Dates */}
              <div className="bg-[var(--bg-input)] p-5 rounded-2xl border border-[var(--border-default)] space-y-4">
                <h4 className="font-bold text-[var(--accent-text)] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  3. Dates & Timing Slots
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Tournament Start</label>
                    <input
                      type="date"
                      required
                      autoComplete="off"
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newTourney.start_date}
                      onChange={(e) => setNewTourney({ ...newTourney, start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Tournament End</label>
                    <input
                      type="date"
                      required
                      autoComplete="off"
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newTourney.end_date}
                      onChange={(e) => setNewTourney({ ...newTourney, end_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Timing Slot</label>
                    <select
                      required
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newTourney.timing_slots}
                      onChange={(e) => setNewTourney({ ...newTourney, timing_slots: e.target.value })}
                    >
                      <option value="Morning">Morning (7 AM - 11 AM)</option>
                      <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
                      <option value="Evening">Evening (5 PM - 9 PM)</option>
                      <option value="Full Day">Full Day Slots</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Registration Open</label>
                    <input
                      type="date"
                      required
                      autoComplete="off"
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newTourney.registration_start_date}
                      onChange={(e) => setNewTourney({ ...newTourney, registration_start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Registration Close</label>
                    <input
                      type="date"
                      required
                      autoComplete="off"
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newTourney.registration_end_date}
                      onChange={(e) => setNewTourney({ ...newTourney, registration_end_date: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Group 4: Financials */}
              <div className="bg-[var(--bg-input)] p-5 rounded-2xl border border-[var(--border-default)] space-y-4">
                <h4 className="font-bold text-[var(--accent-text)] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  4. Financials & Prizes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Registration Fee Model</label>
                    <select
                      required
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newTourney.free_or_paid}
                      onChange={(e) => {
                        const mode = e.target.value;
                        setNewTourney({ ...newTourney, free_or_paid: mode, fee: mode === 'free' ? 0 : newTourney.fee });
                      }}
                    >
                      <option value="free">Free Entry</option>
                      <option value="paid">Paid Entry</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Entry Fee ($)</label>
                    <input
                      type="number"
                      required
                      autoComplete="off"
                      disabled={newTourney.free_or_paid === 'free'}
                      placeholder={newTourney.free_or_paid === 'free' ? '0 (Free)' : 'e.g. 100'}
                      className="w-full rounded-xl px-3 py-2 text-xs disabled:opacity-50"
                      value={newTourney.fee}
                      onChange={(e) => setNewTourney({ ...newTourney, fee: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Prize Pool Value</label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      placeholder="e.g. 5000 Cash Prize"
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newTourney.prize_pools}
                      onChange={(e) => setNewTourney({ ...newTourney, prize_pools: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Submit Tournament Proposal
                </Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === 'schedule_matches' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="mb-6">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-[var(--accent)]" />
                  Schedule Tournament Matches
                </CardTitle>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Pair registered teams and nominate an official scorer to record live match metrics.
                </p>
              </div>
            </CardHeader>

            <form onSubmit={handleScheduleMatch} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Select Tournament</label>
                  <select
                    className="w-full rounded-xl px-3 py-2 text-xs"
                    value={newMatch.tournament_id}
                    onChange={(e) => setNewMatch({ ...newMatch, tournament_id: e.target.value, team_a_id: '', team_b_id: '' })}
                    required
                  >
                    <option value="">-- Choose Tournament --</option>
                    {tournaments.filter(t => t.is_approved && t.status !== 'completed').map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Assign Official Scorer</label>
                  <select
                    className="w-full rounded-xl px-3 py-2 text-xs"
                    value={newMatch.scorer_id}
                    onChange={(e) => setNewMatch({ ...newMatch, scorer_id: e.target.value })}
                    required
                  >
                    <option value="">-- Choose Scorer --</option>
                    {usersList.filter(u => u.role === 'scorer').map(scorer => (
                      <option key={scorer.id} value={scorer.id}>{scorer.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {newMatch.tournament_id && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)]">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Team A (Home)</label>
                    <select
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newMatch.team_a_id}
                      onChange={(e) => setNewMatch({ ...newMatch, team_a_id: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Team A --</option>
                      {teamsListForSelectedMatchTourney(newMatch.tournament_id).map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase">Team B (Away)</label>
                    <select
                      className="w-full rounded-xl px-3 py-2 text-xs"
                      value={newMatch.team_b_id}
                      onChange={(e) => setNewMatch({ ...newMatch, team_b_id: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Team B --</option>
                      {teamsListForSelectedMatchTourney(newMatch.tournament_id).map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Create Match Fixture
                </Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === 'approvals' && (
          <div className="space-y-6">
            {/* Team Registrations */}
            <Card>
              <CardHeader className="mb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="w-5 h-5 text-[var(--accent)]" />
                  Pending Team Registrations
                </CardTitle>
              </CardHeader>
              {pendingTeams.length === 0 ? (
                <p className="text-[var(--text-muted)] text-sm italic py-4">No team registrations pending approval.</p>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {pendingTeams.map(team => (
                    <motion.div key={team.id} variants={itemVariants}>
                      <div className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)] flex justify-between items-center hover:border-[var(--border-card-hover)] transition-all duration-200">
                        <div>
                          <span className="font-extrabold text-[var(--text-primary)] text-sm">{team.name}</span>
                          <span className="block text-xs text-[var(--text-secondary)] mt-1">Coach: {team.coach ? team.coach.full_name : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Check}
                            onClick={() => handleApproveTeam(team.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={Trash2}
                            onClick={() => handleDeleteTeam(team.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </Card>

            {/* Sponsor Pledges */}
            <Card>
              <CardHeader className="mb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Coins className="w-5 h-5 text-[var(--accent)]" />
                  Pending Sponsor Pledges
                </CardTitle>
              </CardHeader>
              {pendingSponsorships.length === 0 ? (
                <p className="text-[var(--text-muted)] text-sm italic py-4">No sponsor pledges pending approval.</p>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {pendingSponsorships.map(s => (
                    <motion.div key={s.id} variants={itemVariants}>
                      <div className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)] flex justify-between items-center hover:border-[var(--border-card-hover)] transition-all duration-200">
                        <div>
                          <span className="font-extrabold text-[var(--text-primary)] text-sm">Sponsor: {s.sponsor.full_name}</span>
                          <span className="block text-xs text-emerald-500 font-bold mt-1">Amount Pledged: ${s.amount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Check}
                            onClick={() => handleApproveSponsorship(s.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={Trash2}
                            onClick={() => handleDeleteSponsorship(s.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </Card>

            {/* Scorer Applications */}
            <Card>
              <CardHeader className="mb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <UserCheck className="w-5 h-5 text-[var(--accent)]" />
                  Pending Scorer Applications
                </CardTitle>
              </CardHeader>
              {pendingScorers.length === 0 ? (
                <p className="text-[var(--text-muted)] text-sm italic py-4">No scorer applications pending approval.</p>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {pendingScorers.map(app => (
                    <motion.div key={app.id} variants={itemVariants}>
                      <div className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)] flex justify-between items-center hover:border-[var(--border-card-hover)] transition-all duration-200">
                        <div>
                          <span className="font-extrabold text-[var(--text-primary)] text-sm">{app.scorer.full_name}</span>
                          <span className="block text-xs text-[var(--text-secondary)] mt-1">Tournament: {app.tournament.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Check}
                            onClick={() => handleApproveScorer(app.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={Trash2}
                            onClick={() => handleDeleteScorer(app.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="space-y-6">
            {/* Live Matches */}
            <Card>
              <CardHeader className="mb-5">
                <CardTitle className="text-red-500 text-sm flex items-center gap-2 uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  Live Matches ({matches.filter(m => m.status === 'live').length})
                </CardTitle>
              </CardHeader>
              {matches.filter(m => m.status === 'live').length === 0 ? (
                <p className="text-[var(--text-muted)] text-sm italic py-2">No matches currently live.</p>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {matches.filter(m => m.status === 'live').map(m => (
                    <motion.div key={m.id} variants={itemVariants}>
                      <div className="bg-[var(--bg-input)] p-4 rounded-xl border border-red-500/20 hover:border-red-500/40 space-y-3 shadow-md hover:shadow-lg transition-all duration-200">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-[var(--text-primary)] text-sm">{m.team_a.name} vs {m.team_b.name}</span>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onSelectMatch(m)}
                          >
                            View Live
                          </Button>
                        </div>
                        <div className="text-[11px] text-[var(--text-secondary)] font-mono bg-[var(--bg-page)] p-3 rounded-lg border border-[var(--border-default)] space-y-1.5">
                          <div className="flex justify-between">
                            <span className="font-semibold">{m.team_a.name}:</span>
                            <span className="text-[var(--text-primary)] font-bold">{m.team_a_runs}/{m.team_a_wickets} ({m.team_a_overs} ov)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">{m.team_b.name}:</span>
                            <span className="text-[var(--text-primary)] font-bold">{m.team_b_runs}/{m.team_b_wickets} ({m.team_b_overs} ov)</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
                          <Trophy className="w-3.5 h-3.5 text-[var(--accent)]" />
                          League: {m.tournament.name}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </Card>

            {/* Upcoming Matches */}
            <Card>
              <CardHeader className="mb-4">
                <CardTitle className="text-[var(--text-primary)] text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--accent)]" />
                  Upcoming Fixtures ({matches.filter(m => m.status === 'scheduled').length})
                </CardTitle>
              </CardHeader>
              {matches.filter(m => m.status === 'scheduled').length === 0 ? (
                <p className="text-[var(--text-muted)] text-sm italic py-2">No upcoming fixtures scheduled.</p>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {matches.filter(m => m.status === 'scheduled').map(m => (
                    <motion.div key={m.id} variants={itemVariants}>
                      <div className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)] flex justify-between items-center hover:border-[var(--border-card-hover)] transition-all duration-200">
                        <div>
                          <div className="font-extrabold text-[var(--text-primary)] text-xs">{m.team_a.name} vs {m.team_b.name}</div>
                          <div className="text-[10px] text-[var(--text-secondary)] font-mono mt-1">Tournament: {m.tournament.name}</div>
                          <div className="text-[10px] text-[var(--accent-text)] font-extrabold uppercase mt-1">Scheduled</div>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onSelectMatch(m)}
                        >
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </Card>

            {/* Finished Matches */}
            <Card>
              <CardHeader className="mb-4">
                <CardTitle className="text-[var(--text-primary)] text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  Finished Matches ({matches.filter(m => m.status === 'completed').length})
                </CardTitle>
              </CardHeader>
              {matches.filter(m => m.status === 'completed').length === 0 ? (
                <p className="text-[var(--text-muted)] text-sm italic py-2">No completed matches.</p>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {matches.filter(m => m.status === 'completed').map(m => {
                    const winnerName = m.winner_id === m.team_a_id ? m.team_a.name : (m.winner_id === m.team_b_id ? m.team_b.name : 'Draw / No Result');
                    return (
                      <motion.div key={m.id} variants={itemVariants}>
                        <div className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:border-[var(--border-card-hover)] transition-all duration-200">
                          <div className="space-y-1">
                            <div className="font-extrabold text-[var(--text-primary)] text-xs">{m.team_a.name} vs {m.team_b.name}</div>
                            <div className="text-[10px] text-[var(--text-secondary)] font-mono">Tournament: {m.tournament.name}</div>
                            <div className="text-[10px] text-[var(--text-secondary)] font-mono">
                              Scores: {m.team_a.name} ({m.team_a_runs}/{m.team_a_wickets}) | {m.team_b.name} ({m.team_b_runs}/{m.team_b_wickets})
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => onSelectMatch(m)}
                            >
                              Scorecard
                            </Button>
                            <Badge variant="success" glow className="font-semibold py-1">
                              🏆 Winner: {winnerName}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </Card>

            {/* Cancelled Matches */}
            <Card>
              <CardHeader className="mb-4">
                <CardTitle className="text-[var(--text-muted)] text-sm flex items-center gap-2">
                  <Ban className="w-4 h-4 text-red-500" />
                  Cancelled Matches ({matches.filter(m => m.status === 'cancelled').length})
                </CardTitle>
              </CardHeader>
              {matches.filter(m => m.status === 'cancelled').length === 0 ? (
                <p className="text-[var(--text-muted)] text-sm italic py-2">No cancelled matches.</p>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {matches.filter(m => m.status === 'cancelled').map(m => (
                    <motion.div key={m.id} variants={itemVariants}>
                      <div className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-default)] space-y-1 opacity-70">
                        <div className="font-semibold text-[var(--text-primary)] line-through">{m.team_a.name} vs {m.team_b.name}</div>
                        <div className="text-[10px] text-[var(--text-secondary)] font-mono">Tournament: {m.tournament.name}</div>
                        <Badge variant="danger" className="text-[9px] py-0">Cancelled</Badge>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </Card>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
