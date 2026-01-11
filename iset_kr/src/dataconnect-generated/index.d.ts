import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

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

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface ListProjectsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProjectsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListProjectsData, undefined>;
  operationName: string;
}
export const listProjectsRef: ListProjectsRef;

export function listProjects(): QueryPromise<ListProjectsData, undefined>;
export function listProjects(dc: DataConnect): QueryPromise<ListProjectsData, undefined>;

interface AddLikeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddLikeVariables): MutationRef<AddLikeData, AddLikeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddLikeVariables): MutationRef<AddLikeData, AddLikeVariables>;
  operationName: string;
}
export const addLikeRef: AddLikeRef;

export function addLike(vars: AddLikeVariables): MutationPromise<AddLikeData, AddLikeVariables>;
export function addLike(dc: DataConnect, vars: AddLikeVariables): MutationPromise<AddLikeData, AddLikeVariables>;

interface GetPatternRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPatternData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetPatternData, undefined>;
  operationName: string;
}
export const getPatternRef: GetPatternRef;

export function getPattern(): QueryPromise<GetPatternData, undefined>;
export function getPattern(dc: DataConnect): QueryPromise<GetPatternData, undefined>;

