import { commonProTablePros } from "@/utils/viewModle";
import { FormatedApp, useColums } from "./useColums";
import { useMemo } from "react";

import appAPI from '@x-poppy/web-sdk/dist/apis/app';
import { DefaultPageSize } from "@x-poppy/web-sdk/dist/data/Paging";

import { ProTable } from "@ant-design/pro-components";
import { CreateFormActionButton } from "@/components/ActionButton";

import errorHandling from "@x-poppy/web-sdk/dist/utils/errorHandling";
import PermisionDefinitions from "@x-poppy/web-sdk/dist/utils/PermisionDefinitions";
import storageManager from "@x-poppy/web-sdk/dist/utils/storageManager";
import permissionManager from "@x-poppy/web-sdk/dist/utils/permissionManager";
export function AppList() {
  const columns = useColums({list: true});
  const currentAppId = useMemo(() => storageManager.getAppId(), []);

  return useMemo(() => {
    return <ProTable
      {...commonProTablePros}
      columns={columns as any}
      onRequestError={errorHandling.handleError}
      request={async (params) => {
        const { current, pageSize, ...queryParams } = params;
        const result = await appAPI.list({
          ...queryParams,
          pageNum: current ?? 1,
          pageSize: pageSize ?? DefaultPageSize,
        });

        const list: FormatedApp[] = (result.list ?? []).map((item) => {
          const isExpired = Date.parse(item.expireAt) - Date.now() <= 0
          return {
            ...item,
            isExpired,
          }
        })
        // console.log("-----", PermisionDefinitions.App.Read, permissionManager.hasPermission(PermisionDefinitions.App.Read));
        if (!permissionManager.hasPermission(PermisionDefinitions.App.Read)) {
          return {
            total: 1,
            pageSize: 1,
            current: 1,
            data: [],
            success: true
          };
        }

        return {
          total: result.totalCount,
          pageSize: result.pageSize ?? 1,
          current: result.pageNum ?? 1,
          data: list,
          success: true,
        }

      }}
      toolBarRender={(action) => {
        return [
          <CreateFormActionButton
            key="create"
            permissionKey={currentAppId === '0' && PermisionDefinitions.App.Create}
            onSubmit={action?.reload}
            formName={'AppForm'} />
        ];
      }}
      />
  }, [columns, currentAppId])
}




