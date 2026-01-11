import { CreateUserData, ListProjectsData, AddLikeData, AddLikeVariables, GetPatternData } from '../';
import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise} from '@angular/fire/data-connect';
import { CreateQueryResult, CreateMutationResult} from '@tanstack/angular-query-experimental';
import { CreateDataConnectQueryResult, CreateDataConnectQueryOptions, CreateDataConnectMutationResult, DataConnectMutationOptionsUndefinedMutationFn } from '@tanstack-query-firebase/angular/data-connect';
import { FirebaseError } from 'firebase/app';
import { Injector } from '@angular/core';

type CreateUserOptions = DataConnectMutationOptionsUndefinedMutationFn<CreateUserData, FirebaseError, undefined>;
export function injectCreateUser(options?: CreateUserOptions, injector?: Injector): CreateDataConnectMutationResult<CreateUserData, undefined, >;

export type ListProjectsOptions = () => Omit<CreateDataConnectQueryOptions<ListProjectsData, undefined>, 'queryFn'>;
export function injectListProjects(options?: ListProjectsOptions, injector?: Injector): CreateDataConnectQueryResult<ListProjectsData, undefined>;

type AddLikeOptions = DataConnectMutationOptionsUndefinedMutationFn<AddLikeData, FirebaseError, AddLikeVariables>;
export function injectAddLike(options?: AddLikeOptions, injector?: Injector): CreateDataConnectMutationResult<AddLikeData, AddLikeVariables, AddLikeVariables>;

export type GetPatternOptions = () => Omit<CreateDataConnectQueryOptions<GetPatternData, undefined>, 'queryFn'>;
export function injectGetPattern(options?: GetPatternOptions, injector?: Injector): CreateDataConnectQueryResult<GetPatternData, undefined>;
