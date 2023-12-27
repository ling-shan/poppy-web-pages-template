import { CommonFormViewProps, registerFormComponent, useCommonProFormProps } from "@/utils/viewModle";
import { BetaSchemaForm, ProFormInstance } from "@ant-design/pro-components";
import { useColums } from "./useColums";
import { useMemo, useRef } from "react";
import toastMessage from "@x-poppy/web-sdk/dist/utils/toastMessage";
import errorHandling from "@x-poppy/web-sdk/dist/utils/errorHandling";
import appAPI from '@x-poppy/web-sdk/dist/apis/app';

export function AppForm(props: CommonFormViewProps) {
  const { id, onSubmit, trigger } = props;
  const columns = useColums({create: !id, edit: !!id});
  const formRef = useRef<ProFormInstance>();
  const commonProFormProps = useCommonProFormProps();

  return useMemo(() => {
    return <BetaSchemaForm
      {...(commonProFormProps as any)}
      columns={columns}
      formRef={formRef}
      trigger={trigger}
      request={async () => {
        if (id) {
          const result = await appAPI.get(id);
          formRef.current?.setFieldsValue(result);
          return result;
        }
        return {};
      }}
      onFinish={async (record: Record<string, any>) => {
        try {
          if (id) {
            await appAPI.update(id, record);
          } else {
            await appAPI.create(record as any);
          }
          toastMessage.success({key: "ui.common.processing-succeeded.text"});
          onSubmit?.();
          return true;
        } catch (err) {
          errorHandling.handleError(err);
          return false;
        }
      }}
    />
  }, [columns, commonProFormProps, id, onSubmit, trigger])
}

registerFormComponent("AppForm", AppForm);
