import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'cozidos-app',
  location: 'southamerica-east1'
};

export const createNewUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewUser', inputVars);
}
createNewUserRef.operationName = 'CreateNewUser';

export function createNewUser(dcOrVars, vars) {
  return executeMutation(createNewUserRef(dcOrVars, vars));
}

export const getMatchesByTeamRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMatchesByTeam', inputVars);
}
getMatchesByTeamRef.operationName = 'GetMatchesByTeam';

export function getMatchesByTeam(dcOrVars, vars) {
  return executeQuery(getMatchesByTeamRef(dcOrVars, vars));
}

export const updateMatchScoreRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMatchScore', inputVars);
}
updateMatchScoreRef.operationName = 'UpdateMatchScore';

export function updateMatchScore(dcOrVars, vars) {
  return executeMutation(updateMatchScoreRef(dcOrVars, vars));
}

export const getCommentsForMatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCommentsForMatch', inputVars);
}
getCommentsForMatchRef.operationName = 'GetCommentsForMatch';

export function getCommentsForMatch(dcOrVars, vars) {
  return executeQuery(getCommentsForMatchRef(dcOrVars, vars));
}

