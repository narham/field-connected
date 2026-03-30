// ============================================
// GrassRoots — Shared Mock Data (SSB ↔ EO)
// ============================================

export interface GlobalPlayer {
  id: string;
  globalId: string;
  uniqueHash: string;
  fullName: string;
  birthDate: string; // ISO
  position: string;
  group: string;
  status: "active" | "inactive";
  clubId: string;
  clubName: string;
  parentName: string;
  parentPhone: string;
  photoUrl?: string;
  verified: boolean;
}

export interface Team {
  id: string;
  name: string;
  clubId: string;
  category: string; // e.g. "U-12"
  players: string[]; // player IDs
}

export interface Club {
  id: string;
  name: string;
  city: string;
  organizationId: string;
}

export interface Competition {
  id: string;
  name: string;
  organizerId: string;
  organizerName: string;
  format: "league" | "knockout" | "group_knockout";
  categories: CompetitionCategory[];
  startDate: string;
  endDate: string;
  location: string;
  maxTeamsPerCategory: number;
  status: "open" | "ongoing" | "completed";
  description: string;
}

export interface CompetitionCategory {
  id: string;
  label: string; // "U-10", "U-12"
  ageLimit: number; // max age in years
}

export interface Registration {
  id: string;
  competitionId: string;
  competitionName: string;
  categoryId: string;
  categoryLabel: string;
  clubId: string;
  clubName: string;
  teamId: string;
  teamName: string;
  players: RegistrationPlayer[];
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  locked: boolean;
  rejectionReason?: string;
}

export interface RegistrationPlayer {
  playerId: string;
  playerName: string;
  birthDate: string;
  ageValid: boolean;
  ageAtCompetition: number;
  documentVerified: boolean;
}

export interface Match {
  id: string;
  competitionId: string;
  competitionName: string;
  categoryLabel: string;
  homeTeamId: string;
  homeTeamName: string;
  awayTeamId: string;
  awayTeamName: string;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  time: string;
  status: "upcoming" | "live" | "completed";
  lineups?: MatchLineup;
  events: MatchEvent[];
}

export interface MatchLineup {
  home: string[]; // player IDs
  away: string[];
}

export interface MatchEvent {
  id: string;
  matchId: string;
  playerId: string;
  playerName: string;
  teamId: string;
  type: "goal" | "assist" | "yellow_card" | "red_card";
  minute: number;
}

export interface PlayerCompetitionHistory {
  competitionId: string;
  competitionName: string;
  teamName: string;
  categoryLabel: string;
  season: string;
  matchesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

// ============================================
// MOCK DATA
// ============================================

export const mockClubs: Club[] = [
  { id: "club-1", name: "SSB Garuda Muda", city: "Jakarta Selatan", organizationId: "org-1" },
  { id: "club-2", name: "SSB Rajawali", city: "Jakarta Timur", organizationId: "org-2" },
  { id: "club-3", name: "SSB Elang Jaya", city: "Depok", organizationId: "org-3" },
  { id: "club-4", name: "SSB Bintang Timur", city: "Tangerang", organizationId: "org-4" },
  { id: "club-5", name: "SSB Mitra Bola", city: "Bekasi", organizationId: "org-5" },
];

export const mockPlayers: GlobalPlayer[] = [
  { id: "p-1", globalId: "GID-001", uniqueHash: "NIK-001", fullName: "Ahmad Fauzi", birthDate: "2013-03-15", position: "Forward", group: "U-12", status: "active", clubId: "club-1", clubName: "SSB Garuda Muda", parentName: "Hasan Fauzi", parentPhone: "081234567890", verified: true },
  { id: "p-2", globalId: "GID-002", uniqueHash: "NIK-002", fullName: "Budi Santoso", birthDate: "2015-07-22", position: "Midfielder", group: "U-10", status: "active", clubId: "club-1", clubName: "SSB Garuda Muda", parentName: "Santoso", parentPhone: "081234567891", verified: true },
  { id: "p-3", globalId: "GID-003", uniqueHash: "NIK-003", fullName: "Cahyo Prasetyo", birthDate: "2011-01-10", position: "Defender", group: "U-14", status: "active", clubId: "club-1", clubName: "SSB Garuda Muda", parentName: "Prasetyo", parentPhone: "081234567892", verified: true },
  { id: "p-4", globalId: "GID-004", uniqueHash: "NIK-004", fullName: "Dimas Ramadhan", birthDate: "2013-11-05", position: "Goalkeeper", group: "U-12", status: "active", clubId: "club-1", clubName: "SSB Garuda Muda", parentName: "Ramadhan", parentPhone: "081234567893", verified: true },
  { id: "p-5", globalId: "GID-005", uniqueHash: "NIK-005", fullName: "Eko Wijaya", birthDate: "2015-09-18", position: "Forward", group: "U-10", status: "active", clubId: "club-1", clubName: "SSB Garuda Muda", parentName: "Wijaya", parentPhone: "081234567894", verified: true },
  { id: "p-6", globalId: "GID-006", uniqueHash: "NIK-006", fullName: "Farhan Hidayat", birthDate: "2011-06-30", position: "Midfielder", group: "U-14", status: "active", clubId: "club-1", clubName: "SSB Garuda Muda", parentName: "Hidayat", parentPhone: "081234567895", verified: false },
  { id: "p-7", globalId: "GID-007", uniqueHash: "NIK-007", fullName: "Gilang Pratama", birthDate: "2013-05-20", position: "Defender", group: "U-12", status: "active", clubId: "club-1", clubName: "SSB Garuda Muda", parentName: "Pratama", parentPhone: "081234567896", verified: true },
  { id: "p-8", globalId: "GID-008", uniqueHash: "NIK-008", fullName: "Hadi Kurniawan", birthDate: "2013-08-12", position: "Midfielder", group: "U-12", status: "active", clubId: "club-1", clubName: "SSB Garuda Muda", parentName: "Kurniawan", parentPhone: "081234567897", verified: true },
  { id: "p-9", globalId: "GID-009", uniqueHash: "NIK-009", fullName: "Irfan Maulana", birthDate: "2015-02-28", position: "Defender", group: "U-10", status: "active", clubId: "club-1", clubName: "SSB Garuda Muda", parentName: "Maulana", parentPhone: "081234567898", verified: true },
  { id: "p-10", globalId: "GID-010", uniqueHash: "NIK-010", fullName: "Joko Susilo", birthDate: "2013-12-01", position: "Forward", group: "U-12", status: "inactive", clubId: "club-1", clubName: "SSB Garuda Muda", parentName: "Susilo", parentPhone: "081234567899", verified: true },
  // Rajawali players
  { id: "p-11", globalId: "GID-011", uniqueHash: "NIK-011", fullName: "Kevin Aditya", birthDate: "2013-04-10", position: "Forward", group: "U-12", status: "active", clubId: "club-2", clubName: "SSB Rajawali", parentName: "Aditya", parentPhone: "081234568001", verified: true },
  { id: "p-12", globalId: "GID-012", uniqueHash: "NIK-012", fullName: "Lukman Hakim", birthDate: "2013-07-15", position: "Midfielder", group: "U-12", status: "active", clubId: "club-2", clubName: "SSB Rajawali", parentName: "Hakim", parentPhone: "081234568002", verified: true },
  { id: "p-13", globalId: "GID-013", uniqueHash: "NIK-013", fullName: "Muhammad Rizki", birthDate: "2013-09-20", position: "Defender", group: "U-12", status: "active", clubId: "club-2", clubName: "SSB Rajawali", parentName: "Rizki", parentPhone: "081234568003", verified: true },
  { id: "p-14", globalId: "GID-014", uniqueHash: "NIK-014", fullName: "Naufal Aziz", birthDate: "2013-01-05", position: "Goalkeeper", group: "U-12", status: "active", clubId: "club-2", clubName: "SSB Rajawali", parentName: "Aziz", parentPhone: "081234568004", verified: true },
];

export const mockTeams: Team[] = [
  { id: "team-1", name: "Garuda Muda U-12", clubId: "club-1", category: "U-12", players: ["p-1", "p-4", "p-7", "p-8", "p-10"] },
  { id: "team-2", name: "Garuda Muda U-10", clubId: "club-1", category: "U-10", players: ["p-2", "p-5", "p-9"] },
  { id: "team-3", name: "Garuda Muda U-14", clubId: "club-1", category: "U-14", players: ["p-3", "p-6"] },
  { id: "team-4", name: "Rajawali U-12", clubId: "club-2", category: "U-12", players: ["p-11", "p-12", "p-13", "p-14"] },
];

export const mockCompetitions: Competition[] = [
  {
    id: "comp-1",
    name: "Liga Grassroots Jakarta U-12",
    organizerId: "eo-1",
    organizerName: "Jakarta Football Association",
    format: "league",
    categories: [{ id: "cat-1", label: "U-12", ageLimit: 12 }],
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    location: "Stadion Menteng, Jakarta Pusat",
    maxTeamsPerCategory: 8,
    status: "open",
    description: "Liga kompetisi resmi untuk kelompok umur U-12 di wilayah DKI Jakarta. Format liga penuh dengan sistem home & away.",
  },
  {
    id: "comp-2",
    name: "Piala Garuda U-14",
    organizerId: "eo-1",
    organizerName: "Jakarta Football Association",
    format: "group_knockout",
    categories: [{ id: "cat-2", label: "U-14", ageLimit: 14 }],
    startDate: "2025-05-15",
    endDate: "2025-07-15",
    location: "GBK Training Ground, Jakarta",
    maxTeamsPerCategory: 16,
    status: "open",
    description: "Turnamen U-14 dengan format fase grup dilanjutkan knockout. Terbuka untuk semua SSB di Jabodetabek.",
  },
  {
    id: "comp-3",
    name: "Tournament Mini Soccer U-10",
    organizerId: "eo-2",
    organizerName: "Bogor Sports Events",
    format: "knockout",
    categories: [{ id: "cat-3", label: "U-10", ageLimit: 10 }],
    startDate: "2025-03-20",
    endDate: "2025-03-22",
    location: "Lapangan Sempur, Bogor",
    maxTeamsPerCategory: 12,
    status: "ongoing",
    description: "Turnamen mini soccer 3 hari untuk U-10. Format knockout langsung.",
  },
  {
    id: "comp-4",
    name: "Festival Sepakbola Anak 2024",
    organizerId: "eo-1",
    organizerName: "Jakarta Football Association",
    format: "league",
    categories: [
      { id: "cat-4", label: "U-10", ageLimit: 10 },
      { id: "cat-5", label: "U-12", ageLimit: 12 },
    ],
    startDate: "2024-09-01",
    endDate: "2024-11-30",
    location: "Stadion Menteng, Jakarta Pusat",
    maxTeamsPerCategory: 10,
    status: "completed",
    description: "Festival sepakbola tahunan untuk anak-anak usia 10-12 tahun.",
  },
];

export const mockRegistrations: Registration[] = [
  {
    id: "reg-1",
    competitionId: "comp-1",
    competitionName: "Liga Grassroots Jakarta U-12",
    categoryId: "cat-1",
    categoryLabel: "U-12",
    clubId: "club-1",
    clubName: "SSB Garuda Muda",
    teamId: "team-1",
    teamName: "Garuda Muda U-12",
    players: [
      { playerId: "p-1", playerName: "Ahmad Fauzi", birthDate: "2013-03-15", ageValid: true, ageAtCompetition: 12, documentVerified: true },
      { playerId: "p-4", playerName: "Dimas Ramadhan", birthDate: "2013-11-05", ageValid: true, ageAtCompetition: 11, documentVerified: true },
      { playerId: "p-7", playerName: "Gilang Pratama", birthDate: "2013-05-20", ageValid: true, ageAtCompetition: 11, documentVerified: true },
      { playerId: "p-8", playerName: "Hadi Kurniawan", birthDate: "2013-08-12", ageValid: true, ageAtCompetition: 11, documentVerified: true },
    ],
    status: "approved",
    submittedAt: "2025-02-15T10:00:00Z",
    locked: true,
  },
  {
    id: "reg-2",
    competitionId: "comp-1",
    competitionName: "Liga Grassroots Jakarta U-12",
    categoryId: "cat-1",
    categoryLabel: "U-12",
    clubId: "club-2",
    clubName: "SSB Rajawali",
    teamId: "team-4",
    teamName: "Rajawali U-12",
    players: [
      { playerId: "p-11", playerName: "Kevin Aditya", birthDate: "2013-04-10", ageValid: true, ageAtCompetition: 12, documentVerified: true },
      { playerId: "p-12", playerName: "Lukman Hakim", birthDate: "2013-07-15", ageValid: true, ageAtCompetition: 11, documentVerified: true },
      { playerId: "p-13", playerName: "Muhammad Rizki", birthDate: "2013-09-20", ageValid: true, ageAtCompetition: 11, documentVerified: true },
      { playerId: "p-14", playerName: "Naufal Aziz", birthDate: "2013-01-05", ageValid: true, ageAtCompetition: 12, documentVerified: true },
    ],
    status: "approved",
    submittedAt: "2025-02-18T14:30:00Z",
    locked: true,
  },
  {
    id: "reg-3",
    competitionId: "comp-2",
    competitionName: "Piala Garuda U-14",
    categoryId: "cat-2",
    categoryLabel: "U-14",
    clubId: "club-1",
    clubName: "SSB Garuda Muda",
    teamId: "team-3",
    teamName: "Garuda Muda U-14",
    players: [
      { playerId: "p-3", playerName: "Cahyo Prasetyo", birthDate: "2011-01-10", ageValid: true, ageAtCompetition: 14, documentVerified: true },
      { playerId: "p-6", playerName: "Farhan Hidayat", birthDate: "2011-06-30", ageValid: true, ageAtCompetition: 13, documentVerified: false },
    ],
    status: "pending",
    submittedAt: "2025-03-10T09:00:00Z",
    locked: false,
  },
];

export const mockMatches: Match[] = [
  {
    id: "match-1",
    competitionId: "comp-1",
    competitionName: "Liga Grassroots Jakarta U-12",
    categoryLabel: "U-12",
    homeTeamId: "team-1",
    homeTeamName: "Garuda Muda U-12",
    awayTeamId: "team-4",
    awayTeamName: "Rajawali U-12",
    homeScore: 2,
    awayScore: 1,
    date: "2025-04-05",
    time: "09:00",
    status: "completed",
    lineups: {
      home: ["p-1", "p-4", "p-7", "p-8"],
      away: ["p-11", "p-12", "p-13", "p-14"],
    },
    events: [
      { id: "evt-1", matchId: "match-1", playerId: "p-1", playerName: "Ahmad Fauzi", teamId: "team-1", type: "goal", minute: 23 },
      { id: "evt-2", matchId: "match-1", playerId: "p-8", playerName: "Hadi Kurniawan", teamId: "team-1", type: "assist", minute: 23 },
      { id: "evt-3", matchId: "match-1", playerId: "p-11", playerName: "Kevin Aditya", teamId: "team-4", type: "goal", minute: 45 },
      { id: "evt-4", matchId: "match-1", playerId: "p-1", playerName: "Ahmad Fauzi", teamId: "team-1", type: "goal", minute: 67 },
      { id: "evt-5", matchId: "match-1", playerId: "p-7", playerName: "Gilang Pratama", teamId: "team-1", type: "assist", minute: 67 },
      { id: "evt-6", matchId: "match-1", playerId: "p-13", playerName: "Muhammad Rizki", teamId: "team-4", type: "yellow_card", minute: 55 },
    ],
  },
  {
    id: "match-2",
    competitionId: "comp-1",
    competitionName: "Liga Grassroots Jakarta U-12",
    categoryLabel: "U-12",
    homeTeamId: "team-4",
    homeTeamName: "Rajawali U-12",
    awayTeamId: "team-1",
    awayTeamName: "Garuda Muda U-12",
    homeScore: null,
    awayScore: null,
    date: "2025-04-12",
    time: "10:00",
    status: "upcoming",
    events: [],
  },
  {
    id: "match-3",
    competitionId: "comp-1",
    competitionName: "Liga Grassroots Jakarta U-12",
    categoryLabel: "U-12",
    homeTeamId: "team-1",
    homeTeamName: "Garuda Muda U-12",
    awayTeamId: "team-4",
    awayTeamName: "Rajawali U-12",
    homeScore: null,
    awayScore: null,
    date: "2025-04-19",
    time: "09:00",
    status: "upcoming",
    events: [],
  },
];

export const mockPlayerHistory: Record<string, PlayerCompetitionHistory[]> = {
  "p-1": [
    { competitionId: "comp-4", competitionName: "Festival Sepakbola Anak 2024", teamName: "Garuda Muda U-12", categoryLabel: "U-12", season: "2024", matchesPlayed: 6, goals: 4, assists: 2, yellowCards: 0, redCards: 0 },
    { competitionId: "comp-1", competitionName: "Liga Grassroots Jakarta U-12", teamName: "Garuda Muda U-12", categoryLabel: "U-12", season: "2025", matchesPlayed: 1, goals: 2, assists: 0, yellowCards: 0, redCards: 0 },
  ],
  "p-3": [
    { competitionId: "comp-4", competitionName: "Festival Sepakbola Anak 2024", teamName: "Garuda Muda U-12", categoryLabel: "U-12", season: "2024", matchesPlayed: 5, goals: 0, assists: 1, yellowCards: 1, redCards: 0 },
  ],
  "p-7": [
    { competitionId: "comp-1", competitionName: "Liga Grassroots Jakarta U-12", teamName: "Garuda Muda U-12", categoryLabel: "U-12", season: "2025", matchesPlayed: 1, goals: 0, assists: 1, yellowCards: 0, redCards: 0 },
  ],
  "p-8": [
    { competitionId: "comp-1", competitionName: "Liga Grassroots Jakarta U-12", teamName: "Garuda Muda U-12", categoryLabel: "U-12", season: "2025", matchesPlayed: 1, goals: 0, assists: 1, yellowCards: 0, redCards: 0 },
  ],
  "p-11": [
    { competitionId: "comp-1", competitionName: "Liga Grassroots Jakarta U-12", teamName: "Rajawali U-12", categoryLabel: "U-12", season: "2025", matchesPlayed: 1, goals: 1, assists: 0, yellowCards: 0, redCards: 0 },
  ],
  "p-13": [
    { competitionId: "comp-1", competitionName: "Liga Grassroots Jakarta U-12", teamName: "Rajawali U-12", categoryLabel: "U-12", season: "2025", matchesPlayed: 1, goals: 0, assists: 0, yellowCards: 1, redCards: 0 },
  ],
};

// Helper to get player by ID
export const getPlayer = (id: string) => mockPlayers.find((p) => p.id === id);
export const getTeam = (id: string) => mockTeams.find((t) => t.id === id);
export const getCompetition = (id: string) => mockCompetitions.find((c) => c.id === id);
export const getClubPlayers = (clubId: string) => mockPlayers.filter((p) => p.clubId === clubId);
export const getClubTeams = (clubId: string) => mockTeams.filter((t) => t.clubId === clubId);
export const getRegistrationsByClub = (clubId: string) => mockRegistrations.filter((r) => r.clubId === clubId);
export const getRegistrationsByCompetition = (compId: string) => mockRegistrations.filter((r) => r.competitionId === compId);
export const getMatchesByCompetition = (compId: string) => mockMatches.filter((m) => m.competitionId === compId);
export const getPlayerHistory = (playerId: string) => mockPlayerHistory[playerId] || [];
