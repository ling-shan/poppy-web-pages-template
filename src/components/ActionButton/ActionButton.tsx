import { Button, Popconfirm } from "antd";
import permissionManager from '@x-poppy/web-sdk/dist/utils/permissionManager';
import { useI18nMessage } from "@x-poppy/web-sdk/dist/react/hooks/useI18nMessage";
import { ReactNode, useMemo } from "react";
import { getRegisteredFormComponent } from "@/utils/viewModle";
import { PlusOutlined } from "@ant-design/icons";

import styles from "./ActionButton.module.css";

interface ActionButtonProps {
  permissionKey?: string | false
  primary?: boolean
  actionName: string
  actionIcon?: ReactNode
  visible?: boolean
  onSubmit?: () => void
  onCancle?: () => void
}

interface FormActionButtonProps extends ActionButtonProps {
  formName: string
  formProps?: any;
}

export function FormActionButton(props: FormActionButtonProps) {
  const i18nMessage = useI18nMessage();

  return useMemo(() => {
    // console.log("------", props.permissionKey, permissionManager.hasPermission(props.permissionKey as string))
    if (props.visible === false ||
        !props.permissionKey ||
        !permissionManager.hasPermission(props.permissionKey)) {
      return <></>;
    }

    const actionBtn = (
      <Button
        type={props.primary ? "primary" : "link"}
        icon={props.actionIcon}
        className={props.primary ? undefined : styles.actionBtn}
        >
        {i18nMessage.formatMessage(props.actionName)}
      </Button>
    );

  const FormComponent = getRegisteredFormComponent(props.formName);
  if (!FormComponent) {
    return actionBtn;
  }

  return (
    <FormComponent
      {...props.formProps}
      onSubmit={props.onSubmit}
      trigger={actionBtn}
    />
  );
  }, [i18nMessage, props.actionIcon, props.actionName, props.formName, props.formProps, props.onSubmit, props.permissionKey, props.primary, props.visible]);
}

export function CreateFormActionButton(props: Omit<FormActionButtonProps, "actionName">) {
  return <FormActionButton actionName="ui.common.create.text" actionIcon={<PlusOutlined />} primary {...props}/>
}

export function EditFormActionButton(props: Omit<FormActionButtonProps, "actionName">) {
  return <FormActionButton actionName="ui.common.edit.text" {...props}/>
}

export function AddFormActionButton(props: Omit<FormActionButtonProps, "actionName">) {
  return <FormActionButton actionName="ui.common.add.text" {...props}/>
}

export function ActionButton(props: ActionButtonProps) {
  const i18nMessage = useI18nMessage();
  if (props.visible === false ||
    (!props.permissionKey || !permissionManager.hasPermission(props.permissionKey))) {
    return <></>;
  }

  const actionBtn = (
    <Button
      type={props.primary ? "primary" : "link"}
      icon={props.actionIcon}
      className={styles.actionBtn}
      onClick={props.onSubmit}
      >
      {i18nMessage.formatMessage(props.actionName)}
    </Button>
  );

  return actionBtn;
}

export function DeleteActionButton(props: Omit<ActionButtonProps, "actionName">) {
  const i18nMessage = useI18nMessage();
  // console.log("------", props.permissionKey, permissionManager.hasPermission(props.permissionKey as string))
  if (props.visible === false ||
    (!props.permissionKey || !permissionManager.hasPermission(props.permissionKey))) {
    return <></>;
  }

  return (
    <Popconfirm
      onConfirm={props.onSubmit}
      onCancel={props.onCancle}
      title={i18nMessage.formatMessage("ui.common.delete.text")}
      description={i18nMessage.formatMessage("ui.common.confirm-delete-record-warning.text")}
      okText={i18nMessage.formatMessage("ui.common.confirm.text")}
      cancelText={i18nMessage.formatMessage("ui.common.cancel.text")}>
        <Button className={styles.actionBtn} danger type="link">{i18nMessage.formatMessage('ui.common.delete.text')}</Button>
    </Popconfirm>
  );
}
