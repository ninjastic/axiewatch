import { AxieClass } from '../recoil/scholars';

// battles

export type APIBattlesResponseItemFighter = {
  team_id: string;
  fighter_id: number;
  fighter_class: AxieClass;
  fighter_level: number;
};

export type APIBattlesResponseItem = {
  first_client_id: string;
  second_client_id: string;
  winner: number;
  created_at: string;
  battle_uuid: string;
  battle_type: number;
  fighters: APIBattlesResponseItemFighter[];
};

export interface APIBattlesResponse {
  items: APIBattlesResponseItem[];
}

// scholar

export type APIScholarResponseScholar = {
  client_id: string;
  total: number;
  blockchain_related: {
    balance: number;
    checkpoint: number;
  };
  claimable_total: number;
  last_claimed_item_at: number;
};

export type APIScholarResponsePvp = {
  client_id: string;
  draw_total: number;
  elo: number;
  lose_total: number;
  name: string;
  rank: number;
} | null;

export type APIScholarResponseSlpDate = {
  day: string;
  totalSlp: number;
};

export type APIScholarResponseSlp = {
  dates: APIScholarResponseSlpDate[];
  yesterday: APIScholarResponseSlpDate | null;
  today: APIScholarResponseSlpDate | null;
} | null;

export interface APIScholarResponse {
  scholar: APIScholarResponseScholar;
  pvp: APIScholarResponsePvp;
  slp: APIScholarResponseSlp;
}
