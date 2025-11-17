import { CreateNewUserData, CreateNewUserVariables, GetMatchesByTeamData, GetMatchesByTeamVariables, UpdateMatchScoreData, UpdateMatchScoreVariables, GetCommentsForMatchData, GetCommentsForMatchVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateNewUser(options?: useDataConnectMutationOptions<CreateNewUserData, FirebaseError, CreateNewUserVariables>): UseDataConnectMutationResult<CreateNewUserData, CreateNewUserVariables>;
export function useCreateNewUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewUserData, FirebaseError, CreateNewUserVariables>): UseDataConnectMutationResult<CreateNewUserData, CreateNewUserVariables>;

export function useGetMatchesByTeam(vars: GetMatchesByTeamVariables, options?: useDataConnectQueryOptions<GetMatchesByTeamData>): UseDataConnectQueryResult<GetMatchesByTeamData, GetMatchesByTeamVariables>;
export function useGetMatchesByTeam(dc: DataConnect, vars: GetMatchesByTeamVariables, options?: useDataConnectQueryOptions<GetMatchesByTeamData>): UseDataConnectQueryResult<GetMatchesByTeamData, GetMatchesByTeamVariables>;

export function useUpdateMatchScore(options?: useDataConnectMutationOptions<UpdateMatchScoreData, FirebaseError, UpdateMatchScoreVariables>): UseDataConnectMutationResult<UpdateMatchScoreData, UpdateMatchScoreVariables>;
export function useUpdateMatchScore(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateMatchScoreData, FirebaseError, UpdateMatchScoreVariables>): UseDataConnectMutationResult<UpdateMatchScoreData, UpdateMatchScoreVariables>;

export function useGetCommentsForMatch(vars: GetCommentsForMatchVariables, options?: useDataConnectQueryOptions<GetCommentsForMatchData>): UseDataConnectQueryResult<GetCommentsForMatchData, GetCommentsForMatchVariables>;
export function useGetCommentsForMatch(dc: DataConnect, vars: GetCommentsForMatchVariables, options?: useDataConnectQueryOptions<GetCommentsForMatchData>): UseDataConnectQueryResult<GetCommentsForMatchData, GetCommentsForMatchVariables>;
