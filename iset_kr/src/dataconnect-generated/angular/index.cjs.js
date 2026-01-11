const { createUserRef, listProjectsRef, addLikeRef, getPatternRef } = require('../');
const { DataConnect, CallerSdkTypeEnum } = require('@angular/fire/data-connect');
const { injectDataConnectQuery, injectDataConnectMutation } = require('@tanstack-query-firebase/angular/data-connect');
const { inject, EnvironmentInjector } = require('@angular/core');

exports.injectCreateUser = function injectCreateUser(args, injector) {
  return injectDataConnectMutation(createUserRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.injectListProjects = function injectListProjects(options, injector) {
  const finalInjector = injector || inject(EnvironmentInjector);
  const dc = finalInjector.get(DataConnect);
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  listProjectsRef(dc),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.injectAddLike = function injectAddLike(args, injector) {
  return injectDataConnectMutation(addLikeRef, args, injector, CallerSdkTypeEnum.GeneratedAngular);
}

exports.injectGetPattern = function injectGetPattern(options, injector) {
  const finalInjector = injector || inject(EnvironmentInjector);
  const dc = finalInjector.get(DataConnect);
  return injectDataConnectQuery(() => {
    const addOpn = options && options();
    return {
      queryFn: () =>  getPatternRef(dc),
      ...addOpn
    };
  }, finalInjector, CallerSdkTypeEnum.GeneratedAngular);
}

