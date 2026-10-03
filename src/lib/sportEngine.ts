/**
 * SCMS Sport Configuration Engine
 * Core SCMS remains sport-neutral; sport-specific attributes are dynamically configured.
 */

import { SportConfiguration } from '@/types';

export const BUILT_IN_SPORTS: Record<string, SportConfiguration> = {
  KARATE: {
    id: 'sport-karate',
    sportCode: 'KARATE',
    sportName: 'Karate',
    icon: '🥋',
    categoryHierarchy: ['Discipline', 'Age Division', 'Weight Category'],
    gradeScale: [
      { rank: 10, name: '10th Kyu (White Belt)', beltColor: '#FFFFFF' },
      { rank: 9, name: '9th Kyu (Yellow Belt)', beltColor: '#FACC15' },
      { rank: 8, name: '8th Kyu (Orange Belt)', beltColor: '#FB923C' },
      { rank: 7, name: '7th Kyu (Green Belt)', beltColor: '#22C55E' },
      { rank: 6, name: '6th Kyu (Blue Belt)', beltColor: '#3B82F6' },
      { rank: 5, name: '5th Kyu (Purple Belt)', beltColor: '#A855F7' },
      { rank: 4, name: '4th Kyu (Brown Belt)', beltColor: '#78350F' },
      { rank: 3, name: '3rd Kyu (Brown Belt 2nd)', beltColor: '#78350F' },
      { rank: 2, name: '2nd Kyu (Brown Belt 1st)', beltColor: '#78350F' },
      { rank: 1, name: '1st Dan (Black Belt Shodan)', beltColor: '#000000' },
      { rank: 2, name: '2nd Dan (Black Belt Nidan)', beltColor: '#000000' },
      { rank: 3, name: '3rd Dan (Black Belt Sandan)', beltColor: '#000000' },
      { rank: 4, name: '4th Dan (Black Belt Yondan)', beltColor: '#000000' },
      { rank: 5, name: '5th Dan (Black Belt Godan)', beltColor: '#000000' },
    ],
    customFields: [
      {
        id: 'f-karate-belt',
        key: 'beltRank',
        label: 'Current Belt / Rank',
        type: 'select',
        required: true,
        options: [
          'White Belt (10th Kyu)',
          'Yellow Belt (9th Kyu)',
          'Orange Belt (8th Kyu)',
          'Green Belt (7th Kyu)',
          'Blue Belt (6th Kyu)',
          'Purple Belt (5th Kyu)',
          'Brown Belt (4th-1st Kyu)',
          'Black Belt (1st Dan+)',
        ],
      },
      {
        id: 'f-karate-discipline',
        key: 'preferredDiscipline',
        label: 'Discipline',
        type: 'select',
        required: true,
        options: ['Kata Only', 'Kumite Only', 'Both (Kata & Kumite)'],
      },
      {
        id: 'f-karate-weight',
        key: 'weightKg',
        label: 'Weigh-in Weight',
        type: 'number',
        required: true,
        unit: 'kg',
      },
      {
        id: 'f-karate-height',
        key: 'heightCm',
        label: 'Height',
        type: 'number',
        required: false,
        unit: 'cm',
      },
      {
        id: 'f-karate-dojo-grad',
        key: 'lastGradingDate',
        label: 'Last Grading Date',
        type: 'date',
        required: false,
      },
    ],
    karateTechIntegrationSupported: true,
  },

  FOOTBALL: {
    id: 'sport-football',
    sportCode: 'FOOTBALL',
    sportName: 'Football / Soccer',
    icon: '⚽',
    categoryHierarchy: ['Age Group (e.g. U-12, U-15)', 'Team Roster'],
    customFields: [
      {
        id: 'f-fb-position',
        key: 'position',
        label: 'Playing Position',
        type: 'select',
        required: true,
        options: ['Goalkeeper (GK)', 'Defender (DF)', 'Midfielder (MF)', 'Forward (FW)'],
      },
      {
        id: 'f-fb-jersey',
        key: 'jerseyNumber',
        label: 'Jersey Number',
        type: 'number',
        required: false,
      },
      {
        id: 'f-fb-dominant-foot',
        key: 'dominantFoot',
        label: 'Dominant Foot',
        type: 'select',
        required: false,
        options: ['Right', 'Left', 'Both (Ambidextrous)'],
      },
    ],
    karateTechIntegrationSupported: false,
  },

  SWIMMING: {
    id: 'sport-swimming',
    sportCode: 'SWIMMING',
    sportName: 'Swimming',
    icon: '🏊',
    categoryHierarchy: ['Age Division', 'Stroke Category', 'Distance'],
    customFields: [
      {
        id: 'f-sw-stroke',
        key: 'primaryStroke',
        label: 'Primary Stroke',
        type: 'select',
        required: true,
        options: ['Freestyle', 'Breaststroke', 'Backstroke', 'Butterfly', 'Individual Medley'],
      },
      {
        id: 'f-sw-pb',
        key: 'personalBest50m',
        label: '50m Personal Best (sec)',
        type: 'number',
        required: false,
        unit: 'sec',
      },
    ],
    karateTechIntegrationSupported: false,
  },

  KABADDI: {
    id: 'sport-kabaddi',
    sportCode: 'KABADDI',
    sportName: 'Kabaddi',
    icon: '🤼',
    categoryHierarchy: ['Weight Division', 'Age Group'],
    customFields: [
      {
        id: 'f-kb-position',
        key: 'position',
        label: 'Specialty Position',
        type: 'select',
        required: true,
        options: ['Raider', 'Left Corner Defender', 'Right Corner Defender', 'Cover Defender', 'All Rounder'],
      },
      {
        id: 'f-kb-weight',
        key: 'weightKg',
        label: 'Official Weight',
        type: 'number',
        required: true,
        unit: 'kg',
      },
    ],
    karateTechIntegrationSupported: false,
  },
};

export function getSportConfiguration(sportNameOrCode: string): SportConfiguration {
  const normalized = (sportNameOrCode || 'Karate').toUpperCase();
  if (BUILT_IN_SPORTS[normalized]) {
    return BUILT_IN_SPORTS[normalized];
  }
  // Search by name
  const found = Object.values(BUILT_IN_SPORTS).find(
    s => s.sportName.toLowerCase() === sportNameOrCode?.toLowerCase()
  );
  if (found) return found;

  // Fallback to Karate default
  return BUILT_IN_SPORTS.KARATE;
}
