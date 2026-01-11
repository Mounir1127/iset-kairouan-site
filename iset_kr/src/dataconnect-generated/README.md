# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `Angular README`, you can find it at [`dataconnect-generated/angular/README.md`](./angular/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListProjects*](#listprojects)
  - [*GetPattern*](#getpattern)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*AddLike*](#addlike)

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

## ListProjects
You can execute the `ListProjects` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listProjects(): QueryPromise<ListProjectsData, undefined>;

interface ListProjectsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProjectsData, undefined>;
}
export const listProjectsRef: ListProjectsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProjects(dc: DataConnect): QueryPromise<ListProjectsData, undefined>;

interface ListProjectsRef {
  ...
  (dc: DataConnect): QueryRef<ListProjectsData, undefined>;
}
export const listProjectsRef: ListProjectsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProjectsRef:
```typescript
const name = listProjectsRef.operationName;
console.log(name);
```

### Variables
The `ListProjects` query has no variables.
### Return Type
Recall that executing the `ListProjects` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProjectsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListProjectsData {
  projects: ({
    id: UUIDString;
    title: string;
    description: string;
  } & Project_Key)[];
}
```
### Using `ListProjects`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProjects } from '@dataconnect/generated';


// Call the `listProjects()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProjects();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProjects(dataConnect);

console.log(data.projects);

// Or, you can use the `Promise` API.
listProjects().then((response) => {
  const data = response.data;
  console.log(data.projects);
});
```

### Using `ListProjects`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProjectsRef } from '@dataconnect/generated';


// Call the `listProjectsRef()` function to get a reference to the query.
const ref = listProjectsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProjectsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.projects);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.projects);
});
```

## GetPattern
You can execute the `GetPattern` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPattern(): QueryPromise<GetPatternData, undefined>;

interface GetPatternRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPatternData, undefined>;
}
export const getPatternRef: GetPatternRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPattern(dc: DataConnect): QueryPromise<GetPatternData, undefined>;

interface GetPatternRef {
  ...
  (dc: DataConnect): QueryRef<GetPatternData, undefined>;
}
export const getPatternRef: GetPatternRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPatternRef:
```typescript
const name = getPatternRef.operationName;
console.log(name);
```

### Variables
The `GetPattern` query has no variables.
### Return Type
Recall that executing the `GetPattern` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPatternData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPatternData {
  patterns: ({
    id: UUIDString;
    name: string;
    designer?: string | null;
    url: string;
    difficulty?: string | null;
  } & Pattern_Key)[];
}
```
### Using `GetPattern`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPattern } from '@dataconnect/generated';


// Call the `getPattern()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPattern();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPattern(dataConnect);

console.log(data.patterns);

// Or, you can use the `Promise` API.
getPattern().then((response) => {
  const data = response.data;
  console.log(data.patterns);
});
```

### Using `GetPattern`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPatternRef } from '@dataconnect/generated';


// Call the `getPatternRef()` function to get a reference to the query.
const ref = getPatternRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPatternRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.patterns);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.patterns);
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

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation has no variables.
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser } from '@dataconnect/generated';


// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser().then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef } from '@dataconnect/generated';


// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect);

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

## AddLike
You can execute the `AddLike` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addLike(vars: AddLikeVariables): MutationPromise<AddLikeData, AddLikeVariables>;

interface AddLikeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddLikeVariables): MutationRef<AddLikeData, AddLikeVariables>;
}
export const addLikeRef: AddLikeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addLike(dc: DataConnect, vars: AddLikeVariables): MutationPromise<AddLikeData, AddLikeVariables>;

interface AddLikeRef {
  ...
  (dc: DataConnect, vars: AddLikeVariables): MutationRef<AddLikeData, AddLikeVariables>;
}
export const addLikeRef: AddLikeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addLikeRef:
```typescript
const name = addLikeRef.operationName;
console.log(name);
```

### Variables
The `AddLike` mutation requires an argument of type `AddLikeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddLikeVariables {
  projectId: UUIDString;
}
```
### Return Type
Recall that executing the `AddLike` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddLikeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddLikeData {
  like_insert: Like_Key;
}
```
### Using `AddLike`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addLike, AddLikeVariables } from '@dataconnect/generated';

// The `AddLike` mutation requires an argument of type `AddLikeVariables`:
const addLikeVars: AddLikeVariables = {
  projectId: ..., 
};

// Call the `addLike()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addLike(addLikeVars);
// Variables can be defined inline as well.
const { data } = await addLike({ projectId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addLike(dataConnect, addLikeVars);

console.log(data.like_insert);

// Or, you can use the `Promise` API.
addLike(addLikeVars).then((response) => {
  const data = response.data;
  console.log(data.like_insert);
});
```

### Using `AddLike`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addLikeRef, AddLikeVariables } from '@dataconnect/generated';

// The `AddLike` mutation requires an argument of type `AddLikeVariables`:
const addLikeVars: AddLikeVariables = {
  projectId: ..., 
};

// Call the `addLikeRef()` function to get a reference to the mutation.
const ref = addLikeRef(addLikeVars);
// Variables can be defined inline as well.
const ref = addLikeRef({ projectId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addLikeRef(dataConnect, addLikeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.like_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.like_insert);
});
```

