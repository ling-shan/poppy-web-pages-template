import { DrawerFormProps, ParamsType, ProColumns, ProTableProps } from "@ant-design/pro-components";
import { DefaultPageSize } from "@x-poppy/web-sdk/dist/data/Paging";
import { useI18nMessage } from "@x-poppy/web-sdk/dist/react/hooks/useI18nMessage";
import I18nMessageKeys from "@x-poppy/web-sdk/dist/utils/I18nMessageKeys";
import { Avatar, Tag } from "antd";
import dayjs from "dayjs";
import { ComponentType, ReactNode, useMemo } from "react";
import { getPageName } from "./pageName";
import i18n from "@x-poppy/web-sdk/dist/utils/i18n";


/**
 * form width
 * @type auto 使用组件默认的宽度
 * @type xs=104px 适用于短数字、短文本或选项。
 * @type sm=216px 适用于较短字段录入、如姓名、电话、ID 等。
 * @type md=328px 标准宽度，适用于大部分字段长度。
 * @type lg=440px 适用于较长字段录入，如长网址、标签组、文件路径等。
 * @type xl=552px 适用于长文本录入，如长链接、描述、备注等，通常搭配自适应多行输入框或定高文本域使用。
 */

function defaultDateFormatter(value: dayjs.Dayjs, valueType: string) {
  // eslint-disable-next-line no-debugger
  return value.toISOString();
}

export const commonProTablePros: ProTableProps<Record<string, any>, ParamsType> = {
  rowKey: "id",
  options: {
    setting: {
      listsHeight: 400,
    },
  },
  scroll: {x: true},
  // headerTitle: i18n.formatMessage(getPageName()),
  pagination: {
    pageSize: DefaultPageSize,
  },
  dateFormatter: defaultDateFormatter
}

export function useCommonProFormProps() {
  const i18nMessage = useI18nMessage();
  return {
    layoutType: "DrawerForm",
    autoFocusFirstInput: true,
    dateFormatter: defaultDateFormatter,
    drawerProps:{
      maskClosable: false,
      keyboard: false,
      destroyOnClose: true
    },
    submitter: {
      searchConfig: {
        resetText: i18nMessage.formatMessage('ui.common.cancel.text'),
        submitText: i18nMessage.formatMessage('ui.common.confirm.text'),
      }
    }
  }
}

export interface CommonColumnsProps {
  create?: boolean
  list?: boolean
  edit?: boolean
}

export const commonColumns = {
  useIdColumn() {
    return useMemo<ProColumns>(() => {
      return {
        title: "ID",
        hideInForm: true,
        dataIndex: 'id',
        copyable: true,
        ellipsis: true,
        width: 200,
        fieldProps: {
          maxLength: 30,
        },
      };
    }, [])
  },

  useNameColumn(props?: CommonColumnsProps) {
    const i18nMessage = useI18nMessage();
    return useMemo<ProColumns>(() => {
      return {
        title: i18nMessage.formatMessage('ui.common.name.text'),
        dataIndex: 'name',
        copyable: true,
        ellipsis: true,
        width: 216,
        fieldProps: {
          showCount: !props?.list,
          maxLength: 30,
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: i18nMessage.formatMessage('ui.common.field-required-error.text'),
            },
          ],
        },
      };
    }, [i18nMessage, props?.list])
  },

  // https://procomponents.ant.design/components/schema#valueenum
  useStatusColumn(props?: CommonColumnsProps) {
    const i18nMessage = useI18nMessage();
    return useMemo<ProColumns>(() => {
      return {
        title: i18nMessage.formatMessage('ui.common.status.text'),
        dataIndex: 'status',
        valueType: 'select',
        width: 100,
        initialValue: props?.list ? undefined : 1,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        valueEnum: new Map<number, any>([
          [1, {
            text: i18nMessage.formatMessage('ui.common.status-normal.text'),
            status: 'Success'
          }],
          [0, {
            text: i18nMessage.formatMessage('ui.common.status-disabled.text'),
            status: 'Default'
          }],
        ]),
        formItemProps: {
          rules: [
            {
              required: true,
              message: i18nMessage.formatMessage('ui.common.field-required-error.text'),
            },
          ],
        },
      };
    }, [i18nMessage, props?.list])
  },


  useCreateAtColumn() {
    const i18nMessage = useI18nMessage();
    return useMemo<ProColumns>(() => {
      return {
        title: i18nMessage.formatMessage('ui.common.createat-time.text'),
        dataIndex: 'createAt',
        valueType: 'dateTime',
        hideInForm: true,
        search: false,
        width: 180,
      }
    }, [i18nMessage])
  },

  useUpdateAtColumn() {
    const i18nMessage = useI18nMessage();
    return useMemo<ProColumns>(() => {
      return {
        title: i18nMessage.formatMessage('ui.common.update-time.text'),
        dataIndex: 'updateAt',
        valueType: 'dateTime',
        hideInForm: true,
        search: false,
        width: 180,
      }
    }, [i18nMessage])
  },

  useLogoImgColumn(props: {dataIndex: string}) {
    const i18nMessage = useI18nMessage();
    return useMemo<ProColumns>(() => {
      return {
        title: i18nMessage.formatMessage('ui.common.logo-img.text'),
        dataIndex: props.dataIndex,
        valueType: (_, type) => {
          if (type === "table") {
            return 'avatar';
          }
          return 'uploadImage' as any;
        },
        width: 80,

        render(dom: ReactNode, record: Record<string, any>) {
          if (record[props.dataIndex]) {
            return (
              <Avatar size={80} shape="square" src={record[props.dataIndex]}/>
            );
          }
          return dom;
        },
        search: false,
      }
    }, [i18nMessage, props.dataIndex]);
  },

  useUserAvatarColumn(props: {dataIndex: string}) {
    const i18nMessage = useI18nMessage();
    return useMemo<ProColumns>(() => {
      return {
        title: i18nMessage.formatMessage('ui.common.head-img.text'),
        dataIndex: props.dataIndex,
        valueType: (_, type) => {
          if (type === "table") {
            return 'avatar';
          }

          return 'uploadAvatar' as any;
        },
        width: 80,

        // fieldProps: {
        //   size: 'large',
        // },

        render(dom: ReactNode, record: Record<string, any>) {
          if (record[props.dataIndex]) {
            return (
              <Avatar size={'large'} src={record[props.dataIndex]}/>
            );
          }
          return dom;
        },
        search: false,
      }
    }, [i18nMessage, props.dataIndex]);
  },

  useRemarkColumn() {
    const i18nMessage = useI18nMessage();
    return useMemo<ProColumns>(() => {
      return {
        title: i18nMessage.formatMessage('ui.common.remark.text'),
        dataIndex: 'remark',
        fieldProps: {
          showCount: true,
          maxLength: 100,
        },
        hideInSearch: true,
        hideInTable: true,
      };
    }, [i18nMessage])
  },

  useYourColumn() {
    const i18nMessage = useI18nMessage();
    return useMemo(() => {
      return {
        title: i18nMessage.formatMessage(''),
        hideInForm: true,
        hideInSearch: true,
        dataIndex: 'isSelf',
        width: 48,
        render: (text: ReactNode, record: Record<string, any>) => [
          record.isSelf && <Tag key={'isSelf'} color="processing">{i18nMessage.formatMessage(I18nMessageKeys.CommonYouText)}</Tag>
        ],
      }
    }, [i18nMessage])
  },

  // useEmptyColumn() {
  //   return useMemo(() => {
  //     return {
  //       hideInForm: true,
  //       search: false,
  //     }
  //   }, [])
  // },

  useConfidentialPowerLevelColumn() {
    const i18nMessage = useI18nMessage();
    return useMemo<ProColumns>(() => {
      return {
        disable: true,
        title: i18nMessage.formatMessage('ui.common.power-grade.text'),
        valueType: "select",
        dataIndex: 'confidentialLevel',
        search: false,
        hideInTable: true,
        initialValue: 0,
        width: 160,
        // hideInForm: true,
        valueEnum: new Map<number, any>([
          [0, {
            text: i18nMessage.formatMessage('ui.common.power-grade-public.text'),
            status: 'Success'
          }],
          [1, {
            text: i18nMessage.formatMessage('ui.common.power-grade-internal.text'),
            status: 'Warning'
          }],
          [3, {
            text: i18nMessage.formatMessage('ui.common.power-grade-confidential.text'),
            status: 'Warning'
          }],
          [5, {
            text: i18nMessage.formatMessage('ui.common.power-grade-secret.text'),
            status: 'Error'
          }],
          [7, {
            text: i18nMessage.formatMessage('ui.common.power-grade-top-Secret.text'),
            status: 'Error'
          }],
        ]),
        formItemProps: {
          rules: [
            {
              required: true,
              message: i18nMessage.formatMessage('ui.common.field-required-error.text'),
            },
          ],
        },
        // render: (text: ReactNode, record, index, action) => {
        //   const element = text as ReactElement;
        //   return [
        //     <Tag key={'confidentialLevel'} color={(element.props.valueEnum as Map<number, any>).get(record.confidentialLevel).status}>{(element.props.valueEnum as Map<number, any>).get(record.confidentialLevel).text}</Tag>
        //   ]
        // }
      }
    }, [i18nMessage]);
  }
}

const components: Record<string, ComponentType<CommonFormViewProps>> = {};

export function registerFormComponent(name: string, component: ComponentType<CommonFormViewProps>) {
  components[name] = component;
}

export function getRegisteredFormComponent(name: string) {
  return components[name]
}

export interface CommonFormViewProps extends Pick<DrawerFormProps, 'trigger'> {
  id?: string
  parentId?: string
  onSubmit?: (result?: any) => void
  onCancel?: () => void
}
