import React from 'react';
import ErrorState from '@x-poppy/web-sdk/dist/react/components/ErrorState';
import { startWebModule } from '@x-poppy/web-sdk/dist/react/startWebModule';
import { WebModuleFactoryContext } from '@x-poppy/web-sdk/dist/utils/webModuleLoader';
import permissionManager from '@x-poppy/web-sdk/dist/utils/permissionManager';

import pkg from '../package.json';
import { ProConfigProvider, ProRenderFieldPropsType } from '@ant-design/pro-components';
import { setPageName } from './utils/pageName';

function init() {
  console.log('---------------------------------------------------');
  console.log (`${pkg.name}: ${pkg.version}`);
  console.log('---------------------------------------------------');
}

init();

const valueTypeMap: Record<string, ProRenderFieldPropsType> = {};

async function loadComponent(context?: WebModuleFactoryContext) {
  const NotFoundModule = () => <ErrorState stateType='notfound'/>;
  let TargetComponent: React.ComponentType = NotFoundModule;

  let moduleName = context?.params?.page ?? context?.params?.p ?? context?.params?.m ?? context?.params?.component;
  if (!moduleName) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    moduleName = urlSearchParams.get("page") ?? urlSearchParams.get("component") ?? undefined;
  }

  if (moduleName) {
    try {
      const DynamicModule = await import(`./pages/${moduleName}`);
      TargetComponent = React.lazy(() => Promise.resolve(DynamicModule));
    } catch (err) {
      TargetComponent = NotFoundModule;
    }
  }

  if (process.env.NODE_ENV === "development" && context?.params?.permissions === true) {
    permissionManager.setPermissions({});
    permissionManager.setDebug(true);
  } else {
    // console.log("permissions", JSON.stringify(context?.params?.permissions));
    permissionManager.setPermissions(context?.params?.permissions ?? {});
    permissionManager.setDebug(false);
  }

  // permissionManager.setDebug(true);
  setPageName(context?.params?.pageName);

  return (
    <ProConfigProvider valueTypeMap={valueTypeMap}>
      <TargetComponent />
    </ProConfigProvider>
  );
}

startWebModule({
  view: loadComponent,
});
