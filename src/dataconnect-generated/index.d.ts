import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateNewUserData {
  user_insert: User_Key;
}

export interface CreateNewUserVariables {
  username: string;
  email: string;
}

export interface GetCommentsForMatchData {
  comments: ({
    id: UUIDString;
    text: string;
    user: {
      username: string;
    };
      createdAt: TimestampString;
  } & Comment_Key)[];
}

export interface GetCommentsForMatchVariables {
  matchId: UUIDString;
}

export interface GetMatchesByTeamData {
  matches: ({
    id: UUIDString;
    homeTeam: {
      name: string;
    };
      awayTeam: {
        name: string;
      };
        homeTeamScore: number;
        awayTeamScore: number;
        matchDate: TimestampString;
  } & Match_Key)[];
}

export interface GetMatchesByTeamVariables {
  teamId: UUIDString;
}

export interface Match_Key {
  id: UUIDString;
  __typename?: 'Match_Key';
}

export interface PlayerStatistic_Key {
  playerId: UUIDString;
  matchId: UUIDString;
  __typename?: 'PlayerStatistic_Key';
}

export interface Player_Key {
  id: UUIDString;
  __typename?: 'Player_Key';
}

export interface Team_Key {
  id: UUIDString;
  __typename?: 'Team_Key';
}

export interface UpdateMatchScoreData {
  match_update?: Match_Key | null;
}

export interface UpdateMatchScoreVariables {
  matchId: UUIDString;
  homeTeamScore: number;
  awayTeamScore: number;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateNewUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
  operationName: string;
}
export const createNewUserRef: CreateNewUserRef;

export function createNewUser(vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;
export function createNewUser(dc: DataConnect, vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;

interface GetMatchesByTeamRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMatchesByTeamVariables): QueryRef<GetMatchesByTeamData, GetMatchesByTeamVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMatchesByTeamVariables): QueryRef<GetMatchesByTeamData, GetMatchesByTeamVariables>;
  operationName: string;
}
export const getMatchesByTeamRef: GetMatchesByTeamRef;

export function getMatchesByTeam(vars: GetMatchesByTeamVariables): QueryPromise<GetMatchesByTeamData, GetMatchesByTeamVariables>;
export function getMatchesByTeam(dc: DataConnect, vars: GetMatchesByTeamVariables): QueryPromise<GetMatchesByTeamData, GetMatchesByTeamVariables>;

interface UpdateMatchScoreRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMatchScoreVariables): MutationRef<UpdateMatchScoreData, UpdateMatchScoreVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateMatchScoreVariables): MutationRef<UpdateMatchScoreData, UpdateMatchScoreVariables>;
  operationName: string;
}
export const updateMatchScoreRef: UpdateMatchScoreRef;

export function updateMatchScore(vars: UpdateMatchScoreVariables): MutationPromise<UpdateMatchScoreData, UpdateMatchScoreVariables>;
export function updateMatchScore(dc: DataConnect, vars: UpdateMatchScoreVariables): MutationPromise<UpdateMatchScoreData, UpdateMatchScoreVariables>;

interface GetCommentsForMatchRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCommentsForMatchVariables): QueryRef<GetCommentsForMatchData, GetCommentsForMatchVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCommentsForMatchVariables): QueryRef<GetCommentsForMatchData, GetCommentsForMatchVariables>;
  operationName: string;
}
export const getCommentsForMatchRef: GetCommentsForMatchRef;

export function getCommentsForMatch(vars: GetCommentsForMatchVariables): QueryPromise<GetCommentsForMatchData, GetCommentsForMatchVariables>;
export function getCommentsForMatch(dc: DataConnect, vars: GetCommentsForMatchVariables): QueryPromise<GetCommentsForMatchData, GetCommentsForMatchVariables>;

