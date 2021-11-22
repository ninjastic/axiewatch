// battles

export type AxieClass = 'Aquatic' | 'Reptile' | 'Plant' | 'Bird' | 'Beast' | 'Bug' | 'Dusk' | 'Mech' | 'Dawn';

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
