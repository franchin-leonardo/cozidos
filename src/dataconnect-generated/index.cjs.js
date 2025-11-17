const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'cozidos-app',
  location: 'southamerica-east1'
};
exports.connectorConfig = connectorConfig;

const createNewUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewUser', inputVars);
}
createNewUserRef.operationName = 'CreateNewUser';
exports.createNewUserRef = createNewUserRef;

exports.createNewUser = function createNewUser(dcOrVars, vars) {
  return executeMutation(createNewUserRef(dcOrVars, vars));
};

const getMatchesByTeamRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMatchesByTeam', inputVars);
}
getMatchesByTeamRef.operationName = 'GetMatchesByTeam';
exports.getMatchesByTeamRef = getMatchesByTeamRef;

exports.getMatchesByTeam = function getMatchesByTeam(dcOrVars, vars) {
  return executeQuery(getMatchesByTeamRef(dcOrVars, vars));
};

const updateMatchScoreRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMatchScore', inputVars);
}
updateMatchScoreRef.operationName = 'UpdateMatchScore';
exports.updateMatchScoreRef = updateMatchScoreRef;

exports.updateMatchScore = function updateMatchScore(dcOrVars, vars) {
  return executeMutation(updateMatchScoreRef(dcOrVars, vars));
};

const getCommentsForMatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCommentsForMatch', inputVars);
}
getCommentsForMatchRef.operationName = 'GetCommentsForMatch';
exports.getCommentsForMatchRef = getCommentsForMatchRef;

exports.getCommentsForMatch = function getCommentsForMatch(dcOrVars, vars) {
  return executeQuery(getCommentsForMatchRef(dcOrVars, vars));
};
