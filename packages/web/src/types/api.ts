// battles

export type AxieClass = 'Aquatic' | 'Reptile' | 'Plant' | 'Bird' | 'Beast' | 'Bug' | 'Dusk' | 'Mech' | 'Dawn';

export type APIBattlesResponseItem = {
  battle_uuid: string;
  game_started: string;
  game_ended: string;
  winner: string;
  client_id: string;
  team_id: string;
  fighters: Array<{
    id: number;
    level: number;
  }>;
  stage_index: number;
  total_scenes: number;
  last_scene_index: number;
  exp: number;
  _items: Array<{
    item_id: number;
    amount: number;
    flag: number;
  }>;
  first_client_id: string;
  first_team_fighters: Array<number>;
  second_client_id: string;
  second_team_fighters: Array<number>;
  eloAndItem: Array<{
    player_id: string;
    new_elo: number;
    old_elo: number;
    result_type: string;
    _items: Array<{
      item_id: number;
      amount: number;
      flag: number;
    }>;
  }>;
};

export interface APIBattlesResponse {
  battles: APIBattlesResponseItem[];
}

// scholar

export interface ScholarData {
  slp: number;
  roninSlp: number;
  totalSlp: number;
  lastClaim: number;
}

export interface ScholarPvpData {
  name: string;
  elo: number;
  rank: number;
}

export interface ScholarAdventureData {
  slp: number;
  maxSlp: number;
}

export interface ScholarHistoricalDate {
  day: string;
  totalSlp: number;
}

export interface ScholarHistoricalSlpData {
  dates: ScholarHistoricalDate[];
  yesterday: ScholarHistoricalDate | undefined;
  today: ScholarHistoricalDate | undefined;
}

export interface APIScholarResponseSuccess {
  address: string;
  scholar: ScholarData;
  pvp: ScholarPvpData;
  pve: ScholarAdventureData;
  historical: ScholarHistoricalSlpData;
}

export interface APIScholarResponseError {
  address: string;
  error: boolean;
}

export type APIScholarResponse = APIScholarResponseSuccess;
export interface APIGameStatusResponse {
  from: number;
  to: number;
  message: string;
}

// txs

export interface ExplorerTransaction {
  hash: string;
  block_hash: string;
  block_number: number;
  from: string;
  to: string;
  input: string;
  value: number;
  timestamp: number;
  gas_used: string;
  cumulative_gas_used: string;
  contract_address: string;
  status: 0 | 1;
  logs: Array<{
    address: string;
    block_hash: string;
    block_number: number;
    data: string;
    topics: string[];
    transaction_hash: string;
    transaction_index: string;
    transaction_log_index: string;
  }>;
}

export interface APIBatchExplorerResponseSuccess {
  address: string;
  total: number;
  results: ExplorerTransaction[];
}

export type APIBatchExplorerResponse = APIBatchExplorerResponseSuccess;
