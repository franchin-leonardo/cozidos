# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateNewUser, useGetMatchesByTeam, useUpdateMatchScore, useGetCommentsForMatch } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateNewUser(createNewUserVars);

const { data, isPending, isSuccess, isError, error } = useGetMatchesByTeam(getMatchesByTeamVars);

const { data, isPending, isSuccess, isError, error } = useUpdateMatchScore(updateMatchScoreVars);

const { data, isPending, isSuccess, isError, error } = useGetCommentsForMatch(getCommentsForMatchVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createNewUser, getMatchesByTeam, updateMatchScore, getCommentsForMatch } from '@dataconnect/generated';


// Operation CreateNewUser:  For variables, look at type CreateNewUserVars in ../index.d.ts
const { data } = await CreateNewUser(dataConnect, createNewUserVars);

// Operation GetMatchesByTeam:  For variables, look at type GetMatchesByTeamVars in ../index.d.ts
const { data } = await GetMatchesByTeam(dataConnect, getMatchesByTeamVars);

// Operation UpdateMatchScore:  For variables, look at type UpdateMatchScoreVars in ../index.d.ts
const { data } = await UpdateMatchScore(dataConnect, updateMatchScoreVars);

// Operation GetCommentsForMatch:  For variables, look at type GetCommentsForMatchVars in ../index.d.ts
const { data } = await GetCommentsForMatch(dataConnect, getCommentsForMatchVars);


```