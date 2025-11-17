# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetMatchesByTeam*](#getmatchesbyteam)
  - [*GetCommentsForMatch*](#getcommentsformatch)
- [**Mutations**](#mutations)
  - [*CreateNewUser*](#createnewuser)
  - [*UpdateMatchScore*](#updatematchscore)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetMatchesByTeam
You can execute the `GetMatchesByTeam` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMatchesByTeam(vars: GetMatchesByTeamVariables): QueryPromise<GetMatchesByTeamData, GetMatchesByTeamVariables>;

interface GetMatchesByTeamRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMatchesByTeamVariables): QueryRef<GetMatchesByTeamData, GetMatchesByTeamVariables>;
}
export const getMatchesByTeamRef: GetMatchesByTeamRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMatchesByTeam(dc: DataConnect, vars: GetMatchesByTeamVariables): QueryPromise<GetMatchesByTeamData, GetMatchesByTeamVariables>;

interface GetMatchesByTeamRef {
  ...
  (dc: DataConnect, vars: GetMatchesByTeamVariables): QueryRef<GetMatchesByTeamData, GetMatchesByTeamVariables>;
}
export const getMatchesByTeamRef: GetMatchesByTeamRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMatchesByTeamRef:
```typescript
const name = getMatchesByTeamRef.operationName;
console.log(name);
```

### Variables
The `GetMatchesByTeam` query requires an argument of type `GetMatchesByTeamVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMatchesByTeamVariables {
  teamId: UUIDString;
}
```
### Return Type
Recall that executing the `GetMatchesByTeam` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMatchesByTeamData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMatchesByTeam`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMatchesByTeam, GetMatchesByTeamVariables } from '@dataconnect/generated';

// The `GetMatchesByTeam` query requires an argument of type `GetMatchesByTeamVariables`:
const getMatchesByTeamVars: GetMatchesByTeamVariables = {
  teamId: ..., 
};

// Call the `getMatchesByTeam()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMatchesByTeam(getMatchesByTeamVars);
// Variables can be defined inline as well.
const { data } = await getMatchesByTeam({ teamId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMatchesByTeam(dataConnect, getMatchesByTeamVars);

console.log(data.matches);

// Or, you can use the `Promise` API.
getMatchesByTeam(getMatchesByTeamVars).then((response) => {
  const data = response.data;
  console.log(data.matches);
});
```

### Using `GetMatchesByTeam`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMatchesByTeamRef, GetMatchesByTeamVariables } from '@dataconnect/generated';

// The `GetMatchesByTeam` query requires an argument of type `GetMatchesByTeamVariables`:
const getMatchesByTeamVars: GetMatchesByTeamVariables = {
  teamId: ..., 
};

// Call the `getMatchesByTeamRef()` function to get a reference to the query.
const ref = getMatchesByTeamRef(getMatchesByTeamVars);
// Variables can be defined inline as well.
const ref = getMatchesByTeamRef({ teamId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMatchesByTeamRef(dataConnect, getMatchesByTeamVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.matches);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.matches);
});
```

## GetCommentsForMatch
You can execute the `GetCommentsForMatch` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCommentsForMatch(vars: GetCommentsForMatchVariables): QueryPromise<GetCommentsForMatchData, GetCommentsForMatchVariables>;

interface GetCommentsForMatchRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCommentsForMatchVariables): QueryRef<GetCommentsForMatchData, GetCommentsForMatchVariables>;
}
export const getCommentsForMatchRef: GetCommentsForMatchRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCommentsForMatch(dc: DataConnect, vars: GetCommentsForMatchVariables): QueryPromise<GetCommentsForMatchData, GetCommentsForMatchVariables>;

interface GetCommentsForMatchRef {
  ...
  (dc: DataConnect, vars: GetCommentsForMatchVariables): QueryRef<GetCommentsForMatchData, GetCommentsForMatchVariables>;
}
export const getCommentsForMatchRef: GetCommentsForMatchRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCommentsForMatchRef:
```typescript
const name = getCommentsForMatchRef.operationName;
console.log(name);
```

### Variables
The `GetCommentsForMatch` query requires an argument of type `GetCommentsForMatchVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCommentsForMatchVariables {
  matchId: UUIDString;
}
```
### Return Type
Recall that executing the `GetCommentsForMatch` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCommentsForMatchData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetCommentsForMatch`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCommentsForMatch, GetCommentsForMatchVariables } from '@dataconnect/generated';

// The `GetCommentsForMatch` query requires an argument of type `GetCommentsForMatchVariables`:
const getCommentsForMatchVars: GetCommentsForMatchVariables = {
  matchId: ..., 
};

// Call the `getCommentsForMatch()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCommentsForMatch(getCommentsForMatchVars);
// Variables can be defined inline as well.
const { data } = await getCommentsForMatch({ matchId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCommentsForMatch(dataConnect, getCommentsForMatchVars);

console.log(data.comments);

// Or, you can use the `Promise` API.
getCommentsForMatch(getCommentsForMatchVars).then((response) => {
  const data = response.data;
  console.log(data.comments);
});
```

### Using `GetCommentsForMatch`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCommentsForMatchRef, GetCommentsForMatchVariables } from '@dataconnect/generated';

// The `GetCommentsForMatch` query requires an argument of type `GetCommentsForMatchVariables`:
const getCommentsForMatchVars: GetCommentsForMatchVariables = {
  matchId: ..., 
};

// Call the `getCommentsForMatchRef()` function to get a reference to the query.
const ref = getCommentsForMatchRef(getCommentsForMatchVars);
// Variables can be defined inline as well.
const ref = getCommentsForMatchRef({ matchId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCommentsForMatchRef(dataConnect, getCommentsForMatchVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comments);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewUser
You can execute the `CreateNewUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewUser(vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;

interface CreateNewUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
}
export const createNewUserRef: CreateNewUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewUser(dc: DataConnect, vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;

interface CreateNewUserRef {
  ...
  (dc: DataConnect, vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
}
export const createNewUserRef: CreateNewUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewUserRef:
```typescript
const name = createNewUserRef.operationName;
console.log(name);
```

### Variables
The `CreateNewUser` mutation requires an argument of type `CreateNewUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewUserVariables {
  username: string;
  email: string;
}
```
### Return Type
Recall that executing the `CreateNewUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewUserData {
  user_insert: User_Key;
}
```
### Using `CreateNewUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewUser, CreateNewUserVariables } from '@dataconnect/generated';

// The `CreateNewUser` mutation requires an argument of type `CreateNewUserVariables`:
const createNewUserVars: CreateNewUserVariables = {
  username: ..., 
  email: ..., 
};

// Call the `createNewUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewUser(createNewUserVars);
// Variables can be defined inline as well.
const { data } = await createNewUser({ username: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewUser(dataConnect, createNewUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createNewUser(createNewUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateNewUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewUserRef, CreateNewUserVariables } from '@dataconnect/generated';

// The `CreateNewUser` mutation requires an argument of type `CreateNewUserVariables`:
const createNewUserVars: CreateNewUserVariables = {
  username: ..., 
  email: ..., 
};

// Call the `createNewUserRef()` function to get a reference to the mutation.
const ref = createNewUserRef(createNewUserVars);
// Variables can be defined inline as well.
const ref = createNewUserRef({ username: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewUserRef(dataConnect, createNewUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateMatchScore
You can execute the `UpdateMatchScore` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateMatchScore(vars: UpdateMatchScoreVariables): MutationPromise<UpdateMatchScoreData, UpdateMatchScoreVariables>;

interface UpdateMatchScoreRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMatchScoreVariables): MutationRef<UpdateMatchScoreData, UpdateMatchScoreVariables>;
}
export const updateMatchScoreRef: UpdateMatchScoreRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMatchScore(dc: DataConnect, vars: UpdateMatchScoreVariables): MutationPromise<UpdateMatchScoreData, UpdateMatchScoreVariables>;

interface UpdateMatchScoreRef {
  ...
  (dc: DataConnect, vars: UpdateMatchScoreVariables): MutationRef<UpdateMatchScoreData, UpdateMatchScoreVariables>;
}
export const updateMatchScoreRef: UpdateMatchScoreRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMatchScoreRef:
```typescript
const name = updateMatchScoreRef.operationName;
console.log(name);
```

### Variables
The `UpdateMatchScore` mutation requires an argument of type `UpdateMatchScoreVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateMatchScoreVariables {
  matchId: UUIDString;
  homeTeamScore: number;
  awayTeamScore: number;
}
```
### Return Type
Recall that executing the `UpdateMatchScore` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMatchScoreData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMatchScoreData {
  match_update?: Match_Key | null;
}
```
### Using `UpdateMatchScore`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMatchScore, UpdateMatchScoreVariables } from '@dataconnect/generated';

// The `UpdateMatchScore` mutation requires an argument of type `UpdateMatchScoreVariables`:
const updateMatchScoreVars: UpdateMatchScoreVariables = {
  matchId: ..., 
  homeTeamScore: ..., 
  awayTeamScore: ..., 
};

// Call the `updateMatchScore()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMatchScore(updateMatchScoreVars);
// Variables can be defined inline as well.
const { data } = await updateMatchScore({ matchId: ..., homeTeamScore: ..., awayTeamScore: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMatchScore(dataConnect, updateMatchScoreVars);

console.log(data.match_update);

// Or, you can use the `Promise` API.
updateMatchScore(updateMatchScoreVars).then((response) => {
  const data = response.data;
  console.log(data.match_update);
});
```

### Using `UpdateMatchScore`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMatchScoreRef, UpdateMatchScoreVariables } from '@dataconnect/generated';

// The `UpdateMatchScore` mutation requires an argument of type `UpdateMatchScoreVariables`:
const updateMatchScoreVars: UpdateMatchScoreVariables = {
  matchId: ..., 
  homeTeamScore: ..., 
  awayTeamScore: ..., 
};

// Call the `updateMatchScoreRef()` function to get a reference to the mutation.
const ref = updateMatchScoreRef(updateMatchScoreVars);
// Variables can be defined inline as well.
const ref = updateMatchScoreRef({ matchId: ..., homeTeamScore: ..., awayTeamScore: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMatchScoreRef(dataConnect, updateMatchScoreVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.match_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.match_update);
});
```

