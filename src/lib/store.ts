/**
 * SCMS In-Memory & Persistent Data Store
 * Fully normalized, multi-tenant, auditable data store with mock seed data
 */

import {
  Club,
  ClubBranch,
  Member,
  Volunteer,
  VolunteerAssignment,
  TrainingGroup,
  TrainingClassSession,
  AttendanceRecord,
  MembershipPlan,
  Invoice,
  PaymentReceipt,
  ClubEvent,
  SystemDocument,
  SystemTask,
  ApprovalRequest,
  AutomationRule,
  AutomationLog,
  ActivityFeedItem,
  KarateTechClubMapping,
  TournamentRegistrationDraft,
  User,
} from '@/types';
import { generateImmutableId, generateIdempotencyKey } from './idGenerator';

// ==========================================
// SEED DATA
// ==========================================

export const INITIAL_CLUBS: Club[] = [
  {
    id: 'SCMS-CLUB-000001',
    name: 'Senshi Goju-Ryu Karate-Do Academy',
    shortName: 'Senshi Karate',
    sport: 'Karate',
    registrationNo: 'C SGR-13884',
    establishedYear: 2008,
    address: 'No. 23, Jalan SP8/14, Saujana Puchong',
    city: 'Puchong',
    state: 'Selangor',
    postcode: '47100',
    country: 'Malaysia',
    phone: '+6012-3456789',
    email: 'admin@senshikarate.org',
    website: 'https://senshikarate.org',
    logoUrl: '/logos/senshi.png',
    description: 'Premier Traditional & Sport Karate Academy focusing on WKF Kata & Kumite excellence.',
    status: 'Active',
    primaryAdminName: 'Shihan Kannan',
    primaryAdminEmail: 'kannan@senshikarate.org',
    onboardingStep: 10,
    onboardingCompleted: true,
    branchCount: 3,
    memberCount: 142,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'SCMS-CLUB-000002',
    name: 'Harimau United Football Club',
    shortName: 'Harimau FC',
    sport: 'Football',
    registrationNo: 'FAM-SEL-2024',
    establishedYear: 2015,
    address: 'Stadium Mini Kompleks Belia',
    city: 'Shah Alam',
    state: 'Selangor',
    postcode: '40000',
    country: 'Malaysia',
    phone: '+6019-8765432',
    email: 'info@harimaufc.my',
    website: 'https://harimaufc.my',
    description: 'Youth grassroots football development academy competing in state junior leagues.',
    status: 'Active',
    primaryAdminName: 'Coach Razak',
    primaryAdminEmail: 'razak@harimaufc.my',
    onboardingStep: 10,
    onboardingCompleted: true,
    branchCount: 2,
    memberCount: 88,
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-02-28T14:30:00Z',
  },
  {
    id: 'SCMS-CLUB-000003',
    name: 'Dolphin Aquatic Swimming Club',
    shortName: 'Dolphin Aquatics',
    sport: 'Swimming',
    registrationNo: 'MAS-SWIM-098',
    establishedYear: 2019,
    address: 'Pusat Akuatik Hang Jebat',
    city: 'Melaka',
    state: 'Melaka',
    postcode: '75450',
    country: 'Malaysia',
    phone: '+6013-4455667',
    email: 'swim@dolphinaquatics.com',
    description: 'Competitive and developmental swimming club with stroke analysis programs.',
    status: 'Active',
    primaryAdminName: 'Coach David Lee',
    primaryAdminEmail: 'david@dolphinaquatics.com',
    onboardingStep: 10,
    onboardingCompleted: true,
    branchCount: 1,
    memberCount: 65,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-25T11:00:00Z',
  },
  {
    id: 'SCMS-CLUB-000004',
    name: 'Wira Kabaddi Association',
    shortName: 'Wira Kabaddi',
    sport: 'Kabaddi',
    registrationNo: 'KAB-KL-2022',
    establishedYear: 2021,
    address: 'Gelanggang Komuniti Brickfields',
    city: 'Kuala Lumpur',
    state: 'W.P. Kuala Lumpur',
    postcode: '50470',
    country: 'Malaysia',
    phone: '+6017-9988776',
    email: 'contact@wirakabaddi.com',
    description: 'Dynamic Kabaddi club fostering team discipline and national tournament representation.',
    status: 'Pending Approval',
    primaryAdminName: 'Ravi Chandran',
    primaryAdminEmail: 'ravi@wirakabaddi.com',
    onboardingStep: 2,
    onboardingCompleted: false,
    branchCount: 1,
    memberCount: 24,
    createdAt: '2026-03-01T12:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
];

export const INITIAL_BRANCHES: ClubBranch[] = [
  // Branches for Senshi Karate
  {
    id: 'SCMS-CLUB-000001-B001',
    clubId: 'SCMS-CLUB-000001',
    name: 'Dojo Saujana Puchong (HQ)',
    address: 'No. 23, Jalan SP8/14, Saujana Puchong',
    city: 'Puchong',
    state: 'Selangor',
    postcode: '47100',
    country: 'Malaysia',
    phone: '+6012-3456789',
    email: 'puchong@senshikarate.org',
    managerName: 'Shihan Kannan',
    venueName: 'Honbu Dojo Tatami Arena',
    operatingHours: 'Mon-Fri: 17:00-22:00, Sat: 08:00-13:00',
    status: 'Active',
    memberCount: 75,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'SCMS-CLUB-000001-B002',
    clubId: 'SCMS-CLUB-000001',
    name: 'Dojo USJ Subang Jaya',
    address: 'Kompleks Sukan USJ 7',
    city: 'Subang Jaya',
    state: 'Selangor',
    postcode: '47610',
    country: 'Malaysia',
    phone: '+6012-9988112',
    email: 'usj@senshikarate.org',
    managerName: 'Sensei Mohan',
    venueName: 'USJ Multipurpose Martial Hall',
    operatingHours: 'Tue & Thu: 19:30-21:30, Sun: 09:00-12:00',
    status: 'Active',
    memberCount: 42,
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-01-12T08:00:00Z',
  },
  {
    id: 'SCMS-CLUB-000001-B003',
    clubId: 'SCMS-CLUB-000001',
    name: 'Dojo Cyberjaya Tech',
    address: 'Cyberjaya Community Clubhouse',
    city: 'Cyberjaya',
    state: 'Selangor',
    postcode: '63000',
    country: 'Malaysia',
    phone: '+6013-1122334',
    email: 'cyber@senshikarate.org',
    managerName: 'Sensei Bala',
    venueName: 'Cyberjaya Tatami Studio',
    operatingHours: 'Sat: 15:00-18:00',
    status: 'Active',
    memberCount: 25,
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-01-20T08:00:00Z',
  },
  // Branches for Harimau FC
  {
    id: 'SCMS-CLUB-000002-B001',
    clubId: 'SCMS-CLUB-000002',
    name: 'Shah Alam Football Field A',
    address: 'Seksyen 13 Sports Park',
    city: 'Shah Alam',
    state: 'Selangor',
    postcode: '40100',
    country: 'Malaysia',
    phone: '+6019-8765432',
    email: 'sa@harimaufc.my',
    managerName: 'Coach Razak',
    venueName: 'Padang Sintetik Seksyen 13',
    operatingHours: 'Sat & Sun: 07:30-11:30',
    status: 'Active',
    memberCount: 50,
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-superadmin-01',
    email: 'superadmin@spsportdata.org',
    fullName: 'Dato’ Sri Shanker',
    roles: [{ role: 'SUPERADMIN', grantedAt: '2026-01-01T00:00:00Z' }],
    activeRole: 'SUPERADMIN',
    status: 'Active',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-clubadmin-senshi',
    email: 'kannan@senshikarate.org',
    fullName: 'Shihan Kannan',
    roles: [
      { role: 'CLUB_ADMIN', clubId: 'SCMS-CLUB-000001', grantedAt: '2026-01-10T08:00:00Z' },
      { role: 'COACH', clubId: 'SCMS-CLUB-000001', branchId: 'SCMS-CLUB-000001-B001', grantedAt: '2026-01-10T08:00:00Z' },
    ],
    activeRole: 'CLUB_ADMIN',
    activeClubId: 'SCMS-CLUB-000001',
    activeBranchId: 'SCMS-CLUB-000001-B001',
    status: 'Active',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'usr-branchmgr-usj',
    email: 'mohan@senshikarate.org',
    fullName: 'Sensei Mohan',
    roles: [
      { role: 'BRANCH_MANAGER', clubId: 'SCMS-CLUB-000001', branchId: 'SCMS-CLUB-000001-B002', grantedAt: '2026-01-12T08:00:00Z' },
      { role: 'COACH', clubId: 'SCMS-CLUB-000001', branchId: 'SCMS-CLUB-000001-B002', grantedAt: '2026-01-12T08:00:00Z' },
    ],
    activeRole: 'BRANCH_MANAGER',
    activeClubId: 'SCMS-CLUB-000001',
    activeBranchId: 'SCMS-CLUB-000001-B002',
    status: 'Active',
    createdAt: '2026-01-12T08:00:00Z',
  },
  {
    id: 'usr-volunteer-ahmad',
    email: 'ahmad.daniel@example.com',
    fullName: 'Ahmad Daniel',
    roles: [
      { role: 'MEMBER', clubId: 'SCMS-CLUB-000001', branchId: 'SCMS-CLUB-000001-B001', grantedAt: '2026-01-15T00:00:00Z' },
      { role: 'ATHLETE', clubId: 'SCMS-CLUB-000001', branchId: 'SCMS-CLUB-000001-B001', grantedAt: '2026-01-15T00:00:00Z' },
      { role: 'VOLUNTEER', clubId: 'SCMS-CLUB-000001', branchId: 'SCMS-CLUB-000001-B001', grantedAt: '2026-01-15T00:00:00Z' },
    ],
    activeRole: 'VOLUNTEER',
    activeClubId: 'SCMS-CLUB-000001',
    activeBranchId: 'SCMS-CLUB-000001-B001',
    status: 'Active',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'usr-parent-fatimah',
    email: 'fatimah.ali@example.com',
    fullName: 'Puan Fatimah Ali',
    roles: [
      { role: 'PARENT', clubId: 'SCMS-CLUB-000001', branchId: 'SCMS-CLUB-000001-B001', grantedAt: '2026-01-15T00:00:00Z' },
    ],
    activeRole: 'PARENT',
    activeClubId: 'SCMS-CLUB-000001',
    activeBranchId: 'SCMS-CLUB-000001-B001',
    status: 'Active',
    createdAt: '2026-01-15T00:00:00Z',
  },
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'SCMS-MEM-000001',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    userId: 'usr-volunteer-ahmad',
    fullName: 'Ahmad Daniel bin Razak',
    preferredName: 'Daniel',
    gender: 'Male',
    dob: '2005-04-12',
    icPassport: '050412-14-1235',
    nationality: 'Malaysian',
    email: 'ahmad.daniel@example.com',
    phone: '+6017-1234567',
    emergencyContactName: 'Fatimah Ali (Mother)',
    emergencyContactPhone: '+6017-9999999',
    emergencyContactRelation: 'Mother',
    status: 'Active',
    isAthlete: true,
    isVolunteer: true,
    assignedCoachName: 'Shihan Kannan',
    trainingGroupId: 'tg-01',
    sportData: {
      beltRank: 'Black Belt (1st Dan+)',
      preferredDiscipline: 'Kumite Only',
      weightKg: 64.5,
      heightCm: 172,
      lastGradingDate: '2025-11-20',
    },
    medicalNotes: 'Fully cleared for combat contact sport. No known allergies.',
    bloodType: 'O+',
    joinedDate: '2022-03-01',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-02-10T00:00:00Z',
  },
  {
    id: 'SCMS-MEM-000002',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    fullName: 'Chloe Tan Jia Xin',
    preferredName: 'Chloe',
    gender: 'Female',
    dob: '2004-09-22',
    icPassport: '040922-10-8888',
    nationality: 'Malaysian',
    email: 'chloe.tan@example.com',
    phone: '+6012-9876543',
    emergencyContactName: 'Tan Kok Wai',
    emergencyContactPhone: '+6012-1112222',
    emergencyContactRelation: 'Father',
    status: 'Active',
    isAthlete: true,
    isVolunteer: false,
    assignedCoachName: 'Shihan Kannan',
    trainingGroupId: 'tg-01',
    sportData: {
      beltRank: 'Brown Belt (4th-1st Kyu)',
      preferredDiscipline: 'Both (Kata & Kumite)',
      weightKg: 52.0,
      heightCm: 161,
      lastGradingDate: '2025-10-15',
    },
    medicalNotes: 'Mild exercise-induced asthma. Inhaler kept on sidelines.',
    bloodType: 'A+',
    joinedDate: '2023-01-15',
    createdAt: '2026-01-16T00:00:00Z',
    updatedAt: '2026-02-12T00:00:00Z',
  },
  {
    id: 'SCMS-MEM-000003',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    fullName: 'Muhammad Ryan bin Abdullah',
    preferredName: 'Ryan',
    gender: 'Male',
    dob: '2012-08-30',
    icPassport: '120830-14-1111',
    nationality: 'Malaysian',
    emergencyContactName: 'Puan Fatimah Ali',
    emergencyContactPhone: '+6017-9999999',
    emergencyContactRelation: 'Mother',
    status: 'Active',
    isAthlete: true,
    isVolunteer: false,
    guardianId: 'usr-parent-fatimah',
    guardianName: 'Puan Fatimah Ali',
    assignedCoachName: 'Sensei Mohan',
    trainingGroupId: 'tg-02',
    sportData: {
      beltRank: 'Green Belt (7th Kyu)',
      preferredDiscipline: 'Kata Only',
      weightKg: 42.0,
      heightCm: 148,
    },
    joinedDate: '2024-06-01',
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'SCMS-MEM-000004',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B002',
    fullName: 'Subramaniam Krishnan',
    preferredName: 'Subra',
    gender: 'Male',
    dob: '2000-01-15',
    icPassport: '000115-08-5431',
    nationality: 'Malaysian',
    email: 'subra@example.com',
    phone: '+6011-2223334',
    emergencyContactName: 'Krishnan Murugan',
    emergencyContactPhone: '+6011-8889999',
    emergencyContactRelation: 'Father',
    status: 'Active',
    isAthlete: true,
    isVolunteer: true,
    assignedCoachName: 'Sensei Mohan',
    trainingGroupId: 'tg-03',
    sportData: {
      beltRank: 'Black Belt (1st Dan+)',
      preferredDiscipline: 'Kumite Only',
      weightKg: 78.2,
      heightCm: 178,
    },
    joinedDate: '2021-05-10',
    createdAt: '2026-01-25T00:00:00Z',
    updatedAt: '2026-02-20T00:00:00Z',
  },
];

export const INITIAL_VOLUNTEERS: Volunteer[] = [
  {
    id: 'SCMS-VOL-000001',
    memberId: 'SCMS-MEM-000001',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    skills: ['First Aid Certified', 'Weigh-in Marshalling', 'Tatami Runner', 'Photography'],
    experienceYears: 3,
    availability: ['Saturday Morning', 'Sunday Full Day', 'Tournament Weekends'],
    preferredDuties: ['Tournament Support', 'Equipment & Logistics', 'Media & Photography'],
    trainingCertifications: ['St John First Aid CPR 2025', 'SCMS Volunteer Orientation'],
    startDate: '2025-01-01',
    status: 'Active',
    totalHours: 42.5,
    notes: 'Very dependable senior youth volunteer. Excellent tournament marshal.',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-02-28T00:00:00Z',
  },
  {
    id: 'SCMS-VOL-000002',
    memberId: 'SCMS-MEM-000004',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B002',
    skills: ['Logistics', 'Audio/Visual Setup', 'Scoreboard Operator'],
    experienceYears: 2,
    availability: ['Friday Evening', 'Saturday Afternoon'],
    preferredDuties: ['Equipment & Logistics', 'Administration', 'Tournament Support'],
    startDate: '2025-06-01',
    status: 'Active',
    totalHours: 28.0,
    createdAt: '2026-01-26T00:00:00Z',
    updatedAt: '2026-02-20T00:00:00Z',
  },
];

export const INITIAL_VOLUNTEER_ASSIGNMENTS: VolunteerAssignment[] = [
  {
    id: 'vas-01',
    volunteerId: 'SCMS-VOL-000001',
    volunteerName: 'Ahmad Daniel',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    eventName: 'Annual Goju-Ryu Junior Kata Championship 2026',
    dutyType: 'Tournament Support',
    scheduledStartTime: '2026-04-18T08:00:00Z',
    scheduledEndTime: '2026-04-18T17:00:00Z',
    supervisorName: 'Shihan Kannan',
    instructions: 'Report to Tatami 1 score table for marshalling and competitor call-out.',
    status: 'Confirmed',
    createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'vas-02',
    volunteerId: 'SCMS-VOL-000001',
    volunteerName: 'Ahmad Daniel',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    eventName: 'Saturday Belt Grading Session',
    dutyType: 'Equipment & Logistics',
    scheduledStartTime: '2026-03-07T08:30:00Z',
    scheduledEndTime: '2026-03-07T12:30:00Z',
    actualCheckInTime: '2026-03-07T08:25:00Z',
    actualCheckOutTime: '2026-03-07T12:35:00Z',
    actualHours: 4.0,
    supervisorName: 'Sensei Mohan',
    instructions: 'Assist with tatami hygiene sanitization and certificate arrangement.',
    status: 'Completed',
    createdAt: '2026-03-01T09:00:00Z',
  },
];

export const INITIAL_TRAINING_GROUPS: TrainingGroup[] = [
  {
    id: 'tg-01',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    name: 'Elite Kumite Squad (16+)',
    ageGroup: '16 Years & Above',
    skillLevel: 'Advanced / Dan Grade',
    coachId: 'usr-clubadmin-senshi',
    coachName: 'Shihan Kannan',
    assistantCoachName: 'Sensei Tan',
    venueName: 'Honbu Tatami Hall A',
    capacity: 25,
    scheduleDescription: 'Monday & Wednesday 19:30 - 21:30',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'tg-02',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    name: 'Junior Kata Development (U-14)',
    ageGroup: '8 - 14 Years Old',
    skillLevel: 'Beginner to Intermediate',
    coachId: 'usr-branchmgr-usj',
    coachName: 'Sensei Mohan',
    venueName: 'Honbu Tatami Hall B',
    capacity: 30,
    scheduleDescription: 'Tuesday & Thursday 17:00 - 18:30',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'tg-03',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B002',
    name: 'USJ Adult General Karate',
    ageGroup: 'All Ages',
    skillLevel: 'All Ranks',
    coachId: 'usr-branchmgr-usj',
    coachName: 'Sensei Mohan',
    venueName: 'USJ Sports Hall',
    capacity: 20,
    scheduleDescription: 'Sunday Morning 09:00 - 11:00',
    createdAt: '2026-01-12T08:00:00Z',
  },
];

export const INITIAL_SESSIONS: TrainingClassSession[] = [
  {
    id: 'sess-01',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    trainingGroupId: 'tg-01',
    groupName: 'Elite Kumite Squad (16+)',
    coachId: 'usr-clubadmin-senshi',
    coachName: 'Shihan Kannan',
    sessionDate: '2026-03-02',
    startTime: '19:30',
    endTime: '21:30',
    venue: 'Honbu Tatami Hall A',
    topic: 'Senshu & Counter-attack Strategy drills',
    status: 'Completed',
    totalAttendees: 18,
  },
  {
    id: 'sess-02',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    trainingGroupId: 'tg-02',
    groupName: 'Junior Kata Development (U-14)',
    coachId: 'usr-branchmgr-usj',
    coachName: 'Sensei Mohan',
    sessionDate: '2026-03-03',
    startTime: '17:00',
    endTime: '18:30',
    venue: 'Honbu Tatami Hall B',
    topic: 'Gekisai Dai Ichi rhythm and stance stability',
    status: 'Scheduled',
    totalAttendees: 15,
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-01',
    sessionId: 'sess-01',
    memberId: 'SCMS-MEM-000001',
    memberName: 'Ahmad Daniel',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    status: 'Present',
    checkInTime: '19:25',
    remarks: 'Good physical form and sparring focus',
    recordedBy: 'Shihan Kannan',
    updatedAt: '2026-03-02T21:35:00Z',
  },
  {
    id: 'att-02',
    sessionId: 'sess-01',
    memberId: 'SCMS-MEM-000002',
    memberName: 'Chloe Tan',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    status: 'Present',
    checkInTime: '19:30',
    recordedBy: 'Shihan Kannan',
    updatedAt: '2026-03-02T21:35:00Z',
  },
  {
    id: 'att-03',
    sessionId: 'sess-01',
    memberId: 'SCMS-MEM-000004',
    memberName: 'Subramaniam Krishnan',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    status: 'Late',
    checkInTime: '19:45',
    remarks: 'Traffic congestion at Puchong toll',
    recordedBy: 'Shihan Kannan',
    updatedAt: '2026-03-02T21:35:00Z',
  },
];

export const INITIAL_PLANS: MembershipPlan[] = [
  {
    id: 'plan-01',
    clubId: 'SCMS-CLUB-000001',
    name: 'Standard Monthly Training (Adult)',
    description: 'Access to 3 training sessions per week at all authorized branches.',
    frequency: 'Monthly',
    fee: 150.0,
    currency: 'MYR',
    status: 'Active',
  },
  {
    id: 'plan-02',
    clubId: 'SCMS-CLUB-000001',
    name: 'Junior Cadet Academy (U-16)',
    description: 'Weekly 2 sessions including development belt progression modules.',
    frequency: 'Monthly',
    fee: 120.0,
    currency: 'MYR',
    status: 'Active',
  },
  {
    id: 'plan-03',
    clubId: 'SCMS-CLUB-000001',
    name: 'Annual National Competitor Pass',
    description: 'Full year unlimited squad training + tournament coaching coverage.',
    frequency: 'Annual',
    fee: 1500.0,
    currency: 'MYR',
    status: 'Active',
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'SCMS-INV-000001',
    invoiceNumber: 'INV-2026-0001',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    memberId: 'SCMS-MEM-000001',
    memberName: 'Ahmad Daniel',
    items: [
      { id: 'i1', description: 'Monthly Training Fee - March 2026', quantity: 1, unitPrice: 150.0, amount: 150.0 },
      { id: 'i2', description: 'Annual Club Re-affiliation 2026', quantity: 1, unitPrice: 50.0, amount: 50.0 },
    ],
    subtotal: 200.0,
    discount: 0,
    total: 200.0,
    amountPaid: 200.0,
    balanceDue: 0,
    dueDate: '2026-03-07',
    issueDate: '2026-03-01',
    status: 'Paid',
    createdAt: '2026-03-01T08:00:00Z',
  },
  {
    id: 'SCMS-INV-000002',
    invoiceNumber: 'INV-2026-0002',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    memberId: 'SCMS-MEM-000003',
    memberName: 'Muhammad Ryan',
    items: [
      { id: 'i3', description: 'Junior Cadet Academy Fee - March 2026', quantity: 1, unitPrice: 120.0, amount: 120.0 },
    ],
    subtotal: 120.0,
    discount: 0,
    total: 120.0,
    amountPaid: 0,
    balanceDue: 120.0,
    dueDate: '2026-03-10',
    issueDate: '2026-03-01',
    status: 'Pending',
    createdAt: '2026-03-01T08:00:00Z',
  },
];

export const INITIAL_RECEIPTS: PaymentReceipt[] = [
  {
    id: 'SCMS-REC-000001',
    receiptNumber: 'REC-2026-0001',
    invoiceId: 'SCMS-INV-000001',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    memberId: 'SCMS-MEM-000001',
    memberName: 'Ahmad Daniel',
    amount: 200.0,
    paymentMethod: 'DuitNow QR',
    referenceNo: 'DN-99882211',
    paymentDate: '2026-03-01 14:22:10',
    receivedBy: 'Shihan Kannan',
  },
];

export const INITIAL_EVENTS: ClubEvent[] = [
  {
    id: 'SCMS-EVT-000001',
    clubId: 'SCMS-CLUB-000001',
    title: 'Goju-Ryu Sanchin & Tensho Kata Masterclass',
    eventType: 'Seminar',
    startDate: '2026-03-28T09:00:00Z',
    endDate: '2026-03-28T16:00:00Z',
    venue: 'Honbu Dojo Main Arena',
    description: 'Deep breathing kinetics and IBUSUKI principles led by visiting 8th Dan Grandmaster.',
    capacity: 60,
    participantCount: 45,
    volunteerCount: 6,
    status: 'Upcoming',
    createdAt: '2026-02-15T09:00:00Z',
  },
  {
    id: 'SCMS-EVT-000002',
    clubId: 'SCMS-CLUB-000001',
    title: 'State Junior Selection Camp 2026',
    eventType: 'Camp',
    startDate: '2026-04-10T08:00:00Z',
    endDate: '2026-04-12T17:00:00Z',
    venue: 'Kompleks Sukan MSN Saujana',
    description: 'Three-day intensive conditioning, tactical sparring, and video replay analysis.',
    capacity: 40,
    participantCount: 32,
    volunteerCount: 8,
    status: 'Upcoming',
    createdAt: '2026-02-20T10:00:00Z',
  },
];

export const INITIAL_TASKS: SystemTask[] = [
  {
    id: 'SCMS-TSK-000001',
    title: 'Review and approve new club registration for Wira Kabaddi',
    description: 'Verify registration documents and primary administrator identity credentials.',
    assignedToName: 'Dato’ Sri Shanker',
    priority: 'High',
    dueDate: '2026-03-08',
    status: 'Open',
    createdBy: 'System Engine',
    createdAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'SCMS-TSK-000002',
    title: 'Finalize KarateTech 3.0 draft entry for Senshi Open Championship',
    description: 'Check participant weigh-in compliance and submit final club roster.',
    assignedToName: 'Shihan Kannan',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    priority: 'Urgent',
    dueDate: '2026-03-15',
    status: 'In Progress',
    createdBy: 'Shihan Kannan',
    createdAt: '2026-03-02T10:00:00Z',
  },
];

export const INITIAL_APPROVALS: ApprovalRequest[] = [
  {
    id: 'SCMS-APP-000001',
    type: 'Club Registration',
    title: 'New Club Registration: Wira Kabaddi Association',
    clubId: 'SCMS-CLUB-000004',
    clubName: 'Wira Kabaddi Association',
    submittedByUserId: 'usr-wira-ravi',
    submittedByName: 'Ravi Chandran',
    submittedAt: '2026-03-01T12:00:00Z',
    status: 'Pending',
    payload: {
      sport: 'Kabaddi',
      city: 'Kuala Lumpur',
      registrationNo: 'KAB-KL-2022',
    },
  },
  {
    id: 'SCMS-APP-000002',
    type: 'Branch Creation',
    title: 'New Branch Application: Dojo Cyberjaya Tech',
    clubId: 'SCMS-CLUB-000001',
    clubName: 'Senshi Karate',
    branchName: 'Dojo Cyberjaya Tech',
    submittedByUserId: 'usr-clubadmin-senshi',
    submittedByName: 'Shihan Kannan',
    submittedAt: '2026-01-20T08:00:00Z',
    status: 'Approved',
    reviewedByName: 'Dato’ Sri Shanker',
    reviewedAt: '2026-01-21T10:00:00Z',
    decisionNotes: 'Approved. Complies with safety regulations and coach qualifications.',
    payload: {},
  },
];

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'rule-01',
    clubId: 'SCMS-CLUB-000001',
    name: '14-Day Membership Expiry Warning',
    triggerEvent: 'MEMBERSHIP_EXPIRING_DAYS',
    triggerConditionValue: 14,
    actionType: 'NOTIFY_MEMBER',
    actionTemplate: 'Dear {member_name}, your membership at {club_name} expires in 14 days. Please renew to keep your training spot active.',
    enabled: true,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'rule-02',
    clubId: 'SCMS-CLUB-000001',
    name: 'Consecutive Absenteeism Coach Alert',
    triggerEvent: 'ATTENDANCE_MISSED_CONSECUTIVE',
    triggerConditionValue: 3,
    actionType: 'NOTIFY_COACH',
    actionTemplate: 'Notice: {member_name} has missed 3 consecutive training sessions in {training_group}. Please follow up.',
    enabled: true,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'rule-03',
    clubId: 'SCMS-CLUB-000001',
    name: 'Tournament Registration Deadline Reminder',
    triggerEvent: 'TOURNAMENT_DEADLINE_APPROACHING',
    triggerConditionValue: 7,
    actionType: 'NOTIFY_ADMIN',
    actionTemplate: 'Urgent: Registration for tournament {tournament_name} closes in 7 days. {draft_count} athletes still in draft.',
    enabled: true,
    createdAt: '2026-01-10T08:00:00Z',
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityFeedItem[] = [
  {
    id: 'act-01',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    userName: 'Shihan Kannan',
    action: 'Payment Logged',
    details: 'Received MYR 200.00 from Ahmad Daniel (INV-2026-0001) via DuitNow QR.',
    module: 'FINANCE',
    timestamp: '2026-03-01T14:22:10Z',
  },
  {
    id: 'act-02',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    userName: 'Shihan Kannan',
    action: 'Attendance Recorded',
    details: 'Completed attendance roll for Elite Kumite Squad (18 athletes present).',
    module: 'ATTENDANCE',
    timestamp: '2026-03-02T21:35:00Z',
  },
  {
    id: 'act-03',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    userName: 'Ahmad Daniel',
    action: 'Volunteer Check-In',
    details: 'Checked in for Saturday Belt Grading Session at Honbu Dojo.',
    module: 'VOLUNTEER',
    timestamp: '2026-03-07T08:25:00Z',
  },
];

export const INITIAL_KARATETECH_MAPPINGS: KarateTechClubMapping[] = [
  {
    scmsClubId: 'SCMS-CLUB-000001',
    karateTechClubId: '9a5e8b4e-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
    karateTechClubName: 'Senshi Karate Academy',
    connectionStatus: 'Connected',
    lastSyncedAt: '2026-03-03T11:15:00Z',
  },
];

export const INITIAL_TOURNAMENT_DRAFTS: TournamentRegistrationDraft[] = [
  {
    id: 'SCMS-TREG-000001',
    tournamentId: 'aa5e8b4e-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
    tournamentName: 'Kelab Senshi Goju-Ryu Open Karate Championship 2026',
    tournamentDate: '15–16 August 2026',
    clubId: 'SCMS-CLUB-000001',
    branchId: 'SCMS-CLUB-000001-B001',
    idempotencyKey: 'idem-senshi-2026-0001-reg',
    status: 'READY',
    participants: [
      {
        scmsMemberId: 'SCMS-MEM-000001',
        memberName: 'Ahmad Daniel bin Razak',
        discipline: 'Kumite',
        targetCategoryId: 'e25e8b4e-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
        targetCategoryName: 'Male Kumite -67kg (18+)',
        ageAtTournament: 21,
        weightKg: 64.5,
        gender: 'Male',
        eligibilityPassed: true,
      },
      {
        scmsMemberId: 'SCMS-MEM-000002',
        memberName: 'Chloe Tan Jia Xin',
        discipline: 'Kumite',
        targetCategoryId: 'e65e8b4e-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
        targetCategoryName: 'Female Kumite -55kg (18+)',
        ageAtTournament: 21,
        weightKg: 52.0,
        gender: 'Female',
        eligibilityPassed: true,
      },
    ],
    createdAt: '2026-02-28T10:00:00Z',
    updatedAt: '2026-03-02T16:00:00Z',
  },
];

// ==========================================
// SCMS MASTER STORE CLASS
// ==========================================

class ScmsStore {
  clubs: Club[] = [...INITIAL_CLUBS];
  branches: ClubBranch[] = [...INITIAL_BRANCHES];
  users: User[] = [...INITIAL_USERS];
  members: Member[] = [...INITIAL_MEMBERS];
  volunteers: Volunteer[] = [...INITIAL_VOLUNTEERS];
  volunteerAssignments: VolunteerAssignment[] = [...INITIAL_VOLUNTEER_ASSIGNMENTS];
  trainingGroups: TrainingGroup[] = [...INITIAL_TRAINING_GROUPS];
  sessions: TrainingClassSession[] = [...INITIAL_SESSIONS];
  attendance: AttendanceRecord[] = [...INITIAL_ATTENDANCE];
  plans: MembershipPlan[] = [...INITIAL_PLANS];
  invoices: Invoice[] = [...INITIAL_INVOICES];
  receipts: PaymentReceipt[] = [...INITIAL_RECEIPTS];
  events: ClubEvent[] = [...INITIAL_EVENTS];
  documents: SystemDocument[] = [];
  tasks: SystemTask[] = [...INITIAL_TASKS];
  approvals: ApprovalRequest[] = [...INITIAL_APPROVALS];
  automationRules: AutomationRule[] = [...INITIAL_AUTOMATION_RULES];
  automationLogs: AutomationLog[] = [];
  activityLogs: ActivityFeedItem[] = [...INITIAL_ACTIVITY_LOGS];
  karateTechMappings: KarateTechClubMapping[] = [...INITIAL_KARATETECH_MAPPINGS];
  tournamentDrafts: TournamentRegistrationDraft[] = [...INITIAL_TOURNAMENT_DRAFTS];

  // Audit Logger
  logActivity(
    userName: string,
    action: string,
    details: string,
    module: ActivityFeedItem['module'],
    clubId?: string,
    branchId?: string
  ) {
    const item: ActivityFeedItem = {
      id: 'act-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      userName,
      action,
      details,
      module,
      clubId,
      branchId,
      timestamp: new Date().toISOString(),
    };
    this.activityLogs.unshift(item);
    if (this.activityLogs.length > 200) {
      this.activityLogs.pop();
    }
  }

  // Club Operations
  getClubs(filterStatus?: string): Club[] {
    if (!filterStatus || filterStatus === 'All') return this.clubs;
    return this.clubs.filter(c => c.status === filterStatus);
  }

  getClubById(clubId: string): Club | undefined {
    return this.clubs.find(c => c.id === clubId);
  }

  registerClub(clubData: Partial<Club>, primaryAdmin: { name: string; email: string; phone: string }): Club {
    const clubId = generateImmutableId('CLUB');
    const newClub: Club = {
      id: clubId,
      name: clubData.name || 'Unnamed Club',
      shortName: clubData.shortName || clubData.name || 'Club',
      sport: clubData.sport || 'Karate',
      registrationNo: clubData.registrationNo || 'PENDING',
      establishedYear: clubData.establishedYear || new Date().getFullYear(),
      address: clubData.address || '',
      city: clubData.city || '',
      state: clubData.state || '',
      postcode: clubData.postcode || '',
      country: clubData.country || 'Malaysia',
      phone: clubData.phone || primaryAdmin.phone,
      email: clubData.email || primaryAdmin.email,
      website: clubData.website,
      logoUrl: clubData.logoUrl,
      description: clubData.description,
      status: 'Submitted',
      primaryAdminName: primaryAdmin.name,
      primaryAdminEmail: primaryAdmin.email,
      primaryAdminPhone: primaryAdmin.phone,
      onboardingStep: 1,
      onboardingCompleted: false,
      branchCount: 0,
      memberCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.clubs.unshift(newClub);

    // Create approval request for SuperAdmin
    const approvalId = generateImmutableId('APP');
    this.approvals.unshift({
      id: approvalId,
      type: 'Club Registration',
      title: `New Club Registration: ${newClub.name}`,
      clubId: newClub.id,
      clubName: newClub.name,
      submittedByUserId: 'guest-reg',
      submittedByName: primaryAdmin.name,
      submittedAt: new Date().toISOString(),
      status: 'Pending',
      payload: newClub,
    });

    this.logActivity(
      primaryAdmin.name,
      'Club Registration Submitted',
      `Club ${newClub.name} (${newClub.id}) registered and awaiting SuperAdmin approval.`,
      'CLUB',
      newClub.id
    );

    return newClub;
  }

  approveClub(approvalId: string, reviewedByName: string, decisionNotes?: string): boolean {
    const app = this.approvals.find(a => a.id === approvalId);
    if (!app || !app.clubId) return false;

    app.status = 'Approved';
    app.reviewedByName = reviewedByName;
    app.reviewedAt = new Date().toISOString();
    app.decisionNotes = decisionNotes || 'Approved by Platform Administrator';

    const club = this.clubs.find(c => c.id === app.clubId);
    if (club) {
      club.status = 'Active';
      club.updatedAt = new Date().toISOString();

      // Automatically create HQ branch
      const branchId = generateImmutableId('BRANCH', club.id, 1);
      const hqBranch: ClubBranch = {
        id: branchId,
        clubId: club.id,
        name: `${club.shortName} Main Branch (HQ)`,
        address: club.address,
        city: club.city,
        state: club.state,
        postcode: club.postcode,
        country: club.country,
        phone: club.phone,
        email: club.email,
        managerName: club.primaryAdminName,
        venueName: `${club.shortName} Main Hall`,
        status: 'Active',
        memberCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.branches.push(hqBranch);
      club.branchCount = 1;

      this.logActivity(
        reviewedByName,
        'Club Approved',
        `Club ${club.name} (${club.id}) approved and activated with HQ branch ${branchId}.`,
        'APPROVAL',
        club.id
      );
      return true;
    }
    return false;
  }

  // Branch Operations
  getBranches(clubId?: string): ClubBranch[] {
    if (!clubId) return this.branches;
    return this.branches.filter(b => b.clubId === clubId);
  }

  addBranch(clubId: string, branchData: Partial<ClubBranch>, operatorName: string): ClubBranch {
    const existing = this.branches.filter(b => b.clubId === clubId);
    const branchNumber = existing.length + 1;
    const branchId = generateImmutableId('BRANCH', clubId, branchNumber);

    const newBranch: ClubBranch = {
      id: branchId,
      clubId,
      name: branchData.name || `Branch ${branchNumber}`,
      address: branchData.address || '',
      city: branchData.city || '',
      state: branchData.state || '',
      postcode: branchData.postcode || '',
      country: branchData.country || 'Malaysia',
      phone: branchData.phone || '',
      email: branchData.email || '',
      managerName: branchData.managerName,
      venueName: branchData.venueName || 'Branch Sports Facility',
      operatingHours: branchData.operatingHours,
      status: 'Active',
      memberCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.branches.push(newBranch);

    const club = this.getClubById(clubId);
    if (club) {
      club.branchCount = (club.branchCount || 0) + 1;
    }

    this.logActivity(
      operatorName,
      'Branch Created',
      `New branch ${newBranch.name} (${newBranch.id}) established for ${club?.name}.`,
      'CLUB',
      clubId,
      branchId
    );

    return newBranch;
  }

  // Member Operations
  getMembers(clubId?: string, branchId?: string): Member[] {
    let result = this.members;
    if (clubId) result = result.filter(m => m.clubId === clubId);
    if (branchId) result = result.filter(m => m.branchId === branchId);
    return result;
  }

  getMemberById(memberId: string): Member | undefined {
    return this.members.find(m => m.id === memberId);
  }

  addMember(memberData: Partial<Member>, operatorName: string): Member {
    const memberId = generateImmutableId('MEM');
    const newMember: Member = {
      id: memberId,
      clubId: memberData.clubId || 'SCMS-CLUB-000001',
      branchId: memberData.branchId || 'SCMS-CLUB-000001-B001',
      fullName: memberData.fullName || 'New Member',
      preferredName: memberData.preferredName,
      gender: memberData.gender || 'Male',
      dob: memberData.dob || '2000-01-01',
      icPassport: memberData.icPassport || 'PENDING',
      nationality: memberData.nationality || 'Malaysian',
      email: memberData.email,
      phone: memberData.phone,
      emergencyContactName: memberData.emergencyContactName || 'None',
      emergencyContactPhone: memberData.emergencyContactPhone || 'None',
      emergencyContactRelation: memberData.emergencyContactRelation || 'Guardian',
      status: 'Active',
      isAthlete: !!memberData.isAthlete,
      isVolunteer: !!memberData.isVolunteer,
      assignedCoachName: memberData.assignedCoachName,
      trainingGroupId: memberData.trainingGroupId,
      sportData: memberData.sportData || {},
      joinedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.members.unshift(newMember);

    // If volunteer checked, register volunteer record
    if (newMember.isVolunteer) {
      const volId = generateImmutableId('VOL');
      this.volunteers.push({
        id: volId,
        memberId: newMember.id,
        clubId: newMember.clubId,
        branchId: newMember.branchId,
        skills: ['General Event Assistance'],
        availability: ['Weekend'],
        preferredDuties: ['Club Activities'],
        startDate: newMember.joinedDate,
        status: 'Active',
        totalHours: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    const club = this.getClubById(newMember.clubId);
    if (club) club.memberCount = (club.memberCount || 0) + 1;

    this.logActivity(
      operatorName,
      'Member Registered',
      `Registered member ${newMember.fullName} (${newMember.id}) into ${club?.name}.`,
      'MEMBER',
      newMember.clubId,
      newMember.branchId
    );

    return newMember;
  }

  updateMember(memberId: string, updates: Partial<Member>, operatorName: string): Member | undefined {
    const idx = this.members.findIndex(m => m.id === memberId);
    if (idx === -1) return undefined;

    this.members[idx] = {
      ...this.members[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.logActivity(
      operatorName,
      'Member Updated',
      `Updated member profile for ${this.members[idx].fullName} (${memberId}).`,
      'MEMBER',
      this.members[idx].clubId,
      this.members[idx].branchId
    );

    return this.members[idx];
  }

  // Volunteer Operations
  getVolunteers(clubId?: string): (Volunteer & { member: Member | undefined })[] {
    let list = this.volunteers;
    if (clubId) list = list.filter(v => v.clubId === clubId);
    return list.map(v => ({
      ...v,
      member: this.getMemberById(v.memberId),
    }));
  }

  volunteerCheckIn(assignmentId: string, volunteerName: string): boolean {
    const a = this.volunteerAssignments.find(x => x.id === assignmentId);
    if (!a) return false;
    a.actualCheckInTime = new Date().toISOString();
    a.status = 'Checked In';

    this.logActivity(
      volunteerName,
      'Volunteer Check-In',
      `Volunteer ${volunteerName} checked in for ${a.eventName || a.dutyType}.`,
      'VOLUNTEER',
      a.clubId,
      a.branchId
    );
    return true;
  }

  volunteerCheckOut(assignmentId: string, volunteerName: string): boolean {
    const a = this.volunteerAssignments.find(x => x.id === assignmentId);
    if (!a || !a.actualCheckInTime) return false;

    const checkOut = new Date();
    a.actualCheckOutTime = checkOut.toISOString();
    a.status = 'Completed';

    // Calculate actual hours
    const checkIn = new Date(a.actualCheckInTime);
    const diffHours = Math.max(0.5, Math.round(((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)) * 10) / 10);
    a.actualHours = diffHours;

    // Credit volunteer hours
    const v = this.volunteers.find(vol => vol.id === a.volunteerId);
    if (v) {
      v.totalHours = (v.totalHours || 0) + diffHours;
      v.updatedAt = new Date().toISOString();
    }

    this.logActivity(
      volunteerName,
      'Volunteer Check-Out',
      `Volunteer ${volunteerName} checked out (${diffHours} hours completed).`,
      'VOLUNTEER',
      a.clubId,
      a.branchId
    );
    return true;
  }

  // Attendance Operations
  recordAttendance(sessionId: string, records: { memberId: string; status: AttendanceRecord['status']; remarks?: string }[], operatorName: string): void {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) return;

    for (const r of records) {
      const member = this.getMemberById(r.memberId);
      const existingIdx = this.attendance.findIndex(a => a.sessionId === sessionId && a.memberId === r.memberId);
      if (existingIdx >= 0) {
        this.attendance[existingIdx].status = r.status;
        this.attendance[existingIdx].remarks = r.remarks;
        this.attendance[existingIdx].updatedAt = new Date().toISOString();
      } else {
        this.attendance.push({
          id: 'att-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          sessionId,
          memberId: r.memberId,
          memberName: member?.fullName || 'Athlete',
          clubId: session.clubId,
          branchId: session.branchId,
          status: r.status,
          checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          remarks: r.remarks,
          recordedBy: operatorName,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    session.status = 'Completed';
    session.totalAttendees = records.filter(r => r.status === 'Present' || r.status === 'Late').length;

    this.logActivity(
      operatorName,
      'Attendance Recorded',
      `Recorded attendance for session ${session.groupName} (${records.length} records processed).`,
      'ATTENDANCE',
      session.clubId,
      session.branchId
    );
  }

  // Invoicing & Finance
  createInvoice(inv: Partial<Invoice>, operatorName: string): Invoice {
    const invId = generateImmutableId('INV');
    const member = this.getMemberById(inv.memberId || '');
    const items = inv.items || [];
    const subtotal = items.reduce((acc, i) => acc + i.amount, 0);
    const discount = inv.discount || 0;
    const total = Math.max(0, subtotal - discount);

    const newInvoice: Invoice = {
      id: invId,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(this.invoices.length + 1).padStart(4, '0')}`,
      clubId: inv.clubId || 'SCMS-CLUB-000001',
      branchId: inv.branchId || 'SCMS-CLUB-000001-B001',
      memberId: inv.memberId || '',
      memberName: member?.fullName || inv.memberName || 'Member',
      items,
      subtotal,
      discount,
      total,
      amountPaid: 0,
      balanceDue: total,
      dueDate: inv.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      issueDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      notes: inv.notes,
      createdAt: new Date().toISOString(),
    };

    this.invoices.unshift(newInvoice);

    this.logActivity(
      operatorName,
      'Invoice Generated',
      `Issued ${newInvoice.invoiceNumber} for ${newInvoice.memberName} (MYR ${newInvoice.total.toFixed(2)}).`,
      'FINANCE',
      newInvoice.clubId,
      newInvoice.branchId
    );

    return newInvoice;
  }

  recordPayment(invoiceId: string, amount: number, paymentMethod: PaymentReceipt['paymentMethod'], operatorName: string, refNo?: string): PaymentReceipt | undefined {
    const inv = this.invoices.find(i => i.id === invoiceId);
    if (!inv) return undefined;

    inv.amountPaid += amount;
    inv.balanceDue = Math.max(0, inv.total - inv.amountPaid);
    if (inv.balanceDue <= 0) {
      inv.status = 'Paid';
    } else {
      inv.status = 'Partially Paid';
    }

    const recId = generateImmutableId('REC');
    const receipt: PaymentReceipt = {
      id: recId,
      receiptNumber: `REC-${new Date().getFullYear()}-${String(this.receipts.length + 1).padStart(4, '0')}`,
      invoiceId: inv.id,
      clubId: inv.clubId,
      branchId: inv.branchId,
      memberId: inv.memberId,
      memberName: inv.memberName,
      amount,
      paymentMethod,
      referenceNo: refNo,
      paymentDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      receivedBy: operatorName,
    };

    this.receipts.unshift(receipt);

    this.logActivity(
      operatorName,
      'Payment Recorded',
      `Recorded payment of MYR ${amount.toFixed(2)} for ${inv.invoiceNumber} (Receipt: ${receipt.receiptNumber}).`,
      'FINANCE',
      inv.clubId,
      inv.branchId
    );

    return receipt;
  }
}

// Global Singleton Store Instance
export const store = new ScmsStore();
