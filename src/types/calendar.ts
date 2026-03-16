import type { RaidType, CharRole } from '../components/calendar/constants';

export type { RaidType, CharRole };

export interface UserCharacter {
  id: string;
  user_id: string;
  char_name: string;
  char_class: string;
  char_role: CharRole;
  char_spec?: string | null;
  avatar_url?: string | null;
}

export interface RaidGroup {
  id: string;
  raid_id: string;
  group_number: number;
  label: string | null;
}

export interface Signup {
  id: string;
  raid_id: string;
  user_id: string | null;
  name: string;
  class: string;
  role: CharRole;
  raid_group_id: string | null;
}

export interface LootEntry {
  id: string;
  raid_id: string;
  item_id: number;
  item_name: string;
  quality: string;
  slot: string;
  winner: string;
  boss: string;
  icon: string;
}

export interface Raid {
  id: string;
  title: string;
  date: string;
  created_at: string;
  status: 'active' | 'closed';
  raid_type: RaidType | null;
  warcraft_logs_url: string | null;
  signups: Signup[];
  loot: LootEntry[];
  raid_groups: RaidGroup[];
}
