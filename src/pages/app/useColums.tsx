/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useMemo } from 'react';
import { useI18nMessage } from '@x-poppy/web-sdk/dist/react/hooks/useI18nMessage';
import { CommonColumnsProps, commonColumns } from '@/utils/viewModle';
import dayjs from 'dayjs';
import { ActionType, ProColumns, ProFormColumnsType } from '@ant-design/pro-components';
import { EditFormActionButton, FormActionButton } from "@/components/ActionButton";
import { AppInfo } from '@x-poppy/web-sdk/dist/data/AppInfo';
import PermisionDefinitions from '@x-poppy/web-sdk/dist/utils/PermisionDefinitions';
import permissionManager from '@x-poppy/web-sdk/dist/utils/permissionManager';
import { Avatar, Space } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

export type FormatedApp = AppInfo & {
  isExpired: boolean
}

export function useColums(props?: CommonColumnsProps) {
  const i18nMessage = useI18nMessage();
  const idColumn = commonColumns.useIdColumn();
  const statusColumn = commonColumns.useStatusColumn(props);
  const createAtColumn = commonColumns.useCreateAtColumn();
  const updateAtColum = commonColumns.useUpdateAtColumn();
  const logoImgColumn = commonColumns.useLogoImgColumn({dataIndex: 'logoImg'});
  const remarkColum = commonColumns.useRemarkColumn();

  return useMemo<(ProColumns<FormatedApp> | ProFormColumnsType<FormatedApp>)[]>(() => {
    // https://procomponents.ant.design/components/schema
    // https://procomponents.ant.design/components/table#columns-%E5%88%97%E5%AE%9A%E4%B9%89
    return [
      idColumn,
      {
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
        render(dom: any, record: any) {
          if (record.url) {
            return (
              <Space direction="horizontal" align="center">
              <LinkOutlined />
                <a href={record.url} target="_blank">{dom}</a>
              </Space>
            );
          }
          return dom;
        },
      },
      logoImgColumn,
      {
        title: 'Favicon',
        dataIndex: "favicon",
        hideInTable: true,
        // with: 32,
        valueType: (_: any, type: any) => {
          if (type === "table") {
            return 'avatar';
          }

          return 'uploadAvatar' as any;
        },

        render(dom: ReactNode, record: Record<string, any>) {
          if (record.favicon) {
            return (
              <Avatar size={30} src={record.favicon}/>
            );
          }
          return dom;
        },
        search: false,
      },
      {
        title: i18nMessage.formatMessage('ui.common.intro.text'),
        dataIndex: 'intro',
        ellipsis: true,
        width: 'xl',
        hideInSearch: true,
        fieldProps: {
          showCount: true,
          maxLength: 100,
        },
      },

      // only in create mode
      props?.create && {
        title: i18nMessage.formatMessage('ui.common.email.text'),
        dataIndex: 'email',
        hideInTable: true,
        hideInSearch: true,
        width: 'md',
        formItemProps: {
          rules: [
            {
              required: true,
              type: 'email',
              message: i18nMessage.formatMessage('ui.common.field-required-error.text'),
            },
          ],
        },
      },

      createAtColumn,
      updateAtColum,

      {
        title: i18nMessage.formatMessage('ui.common.page-footer.text'),
        tooltip: i18nMessage.formatMessage('ui.common.page-footer.tooltip'),
        dataIndex: 'footer',
        hideInSearch: true,
        hideInTable: true,
        fieldProps: {
          showCount: true,
          maxLength: 300,
        }
      },

      {
        title: i18nMessage.formatMessage('ui.common.page-footer-link.text'),
        tooltip: i18nMessage.formatMessage('ui.common.page-footer-link.tooltip'),
        dataIndex: 'footerExt',
        valueType: 'formList',
        hideInTable: true,
        hideInSearch: true,
        fieldProps: {
          max: 15
        },
        columns: [
          {
            valueType: 'group',
            columns: [
              {
                title: i18nMessage.formatMessage('ui.common.link-name.text'),
                dataIndex: 'title',
                maxLength: 30,
                formItemProps: {
                  rules: [
                    {
                      required: true,
                      message: i18nMessage.formatMessage('ui.common.field-required-error.text'),
                    },
                  ],
                },
              },
              {
                title: '链接地址',
                dataIndex: 'href',
                maxLength: 512,
                formItemProps: {
                  rules: [
                    {
                      type: 'url',
                      message: i18nMessage.formatMessage('ui.common.field-required-valid-url-error.text'),
                    },
                  ],
                },
              }
            ]
          }
        ]
      },

      {
        title: i18nMessage.formatMessage('ui.common.water-mark.text'),
        tooltip: i18nMessage.formatMessage('ui.common.water-mark.tooltip'),
        dataIndex: 'waterPrint',
        width: 'sm',
        hideInSearch: true,
        hideInTable: true,
        fieldProps: {
          showCount: true,
          maxLength: 30,
        }
      },

      !props?.list && permissionManager.hasPermission(PermisionDefinitions.App.custom('expire')) && {
        title: i18nMessage.formatMessage('ui.common.expire-time.text'),
        tooltip: i18nMessage.formatMessage('ui.common.app-expire-time.tooltip'),
        dataIndex: 'expireAt',
        valueType: 'dateTime',
        width: 180,
        search: false,
        initialValue: props?.create ? dayjs().add(1, 'd') : undefined,
        render(dom: any, record: any) {
          if (record.isExpired) {
            return (
              <span style={{color: "#ff4d4f"}}>{ dom }</span>
            );
          }
          return dom;
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: i18nMessage.formatMessage('ui.common.field-required-error.text'),
            },
          ],
        },
      },

      remarkColum,

      statusColumn,

      {
        title: i18nMessage.formatMessage('ui.common.action.text'),
        hideInForm: false,
        valueType: 'option',
        width: 120,
        render: (_: ReactNode, record: Record<string, any>, idx:number, action?: ActionType) => {
          return [
            <EditFormActionButton
              key={'edit'}
              onSubmit={action?.reload}
              permissionKey={PermisionDefinitions.App.Write}
              formName="AppForm"
              formProps={{id: record.id}}
            />,

            <FormActionButton
              actionName="ui.common.look-feel.text"
              primary={false}
              key={'lookAndFeel'}
              onSubmit={action?.reload}
              permissionKey={PermisionDefinitions.App.custom('look-feel')}
              formName="LookAdnFeelPicker"
              formProps={{id: record.id}}
            />
          ]
        },
      }
    ].filter(Boolean) as any;
  }, [idColumn, logoImgColumn, i18nMessage, props?.create, props?.list, createAtColumn, updateAtColum, remarkColum, statusColumn])
}
