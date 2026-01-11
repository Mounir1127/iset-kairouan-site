import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface AddLikeData {
  like_insert: Like_Key;
}

export interface AddLikeVariables {
  projectId: UUIDString;
}

export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface Favorite_Key {
  id: UUIDString;
  __typename?: 'Favorite_Key';
}

export interface GetPatternData {
  patterns: ({
    id: UUIDString;
    name: string;
    designer?: string | null;
    url: string;
    difficulty?: string | null;
  } & Pattern_Key)[];
}

export interface Like_Key {
  userId: UUIDString;
  projectId: UUIDString;
  __typename?: 'Like_Key';
}

export interface ListProjectsData {
  projects: ({
    id: UUIDString;
    title: string;
    description: string;
  } & Project_Key)[];
}

export interface Pattern_Key {
  id: UUIDString;
  __typename?: 'Pattern_Key';
}

export interface Project_Key {
  id: UUIDString;
  __typename?: 'Project_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface Yarn_Key {
  id: UUIDString;
  __typename?: 'Yarn_Key';
}

/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to execute without passing in DataConnect. */
export function createUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;
/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function createUser(options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;

/** Generated Node Admin SDK operation action function for the 'ListProjects' Query. Allow users to execute without passing in DataConnect. */
export function listProjects(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListProjectsData>>;
/** Generated Node Admin SDK operation action function for the 'ListProjects' Query. Allow users to pass in custom DataConnect instances. */
export function listProjects(options?: OperationOptions): Promise<ExecuteOperationResponse<ListProjectsData>>;

/** Generated Node Admin SDK operation action function for the 'AddLike' Mutation. Allow users to execute without passing in DataConnect. */
export function addLike(dc: DataConnect, vars: AddLikeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddLikeData>>;
/** Generated Node Admin SDK operation action function for the 'AddLike' Mutation. Allow users to pass in custom DataConnect instances. */
export function addLike(vars: AddLikeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddLikeData>>;

/** Generated Node Admin SDK operation action function for the 'GetPattern' Query. Allow users to execute without passing in DataConnect. */
export function getPattern(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPatternData>>;
/** Generated Node Admin SDK operation action function for the 'GetPattern' Query. Allow users to pass in custom DataConnect instances. */
export function getPattern(options?: OperationOptions): Promise<ExecuteOperationResponse<GetPatternData>>;

