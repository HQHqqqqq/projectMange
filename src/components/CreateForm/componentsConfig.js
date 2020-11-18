export const basicComponents = [{
    type: 'input',
    name: '单行文本',
    icon: 'icon-input',
    isShow: 'true',
    url: '',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      dataType: 'string',
      pattern: '',
      placeholder: '',
      disabled: false
    }
  },
  {
    type: 'input2',
    name: '单行文本222',
    icon: 'icon-input',
    isShow: 'true',
    url: '',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      dataType: 'string',
      pattern: '',
      placeholder: '',
      disabled: false
    }
  },
  {
    type: 'inputguotu',
    name: '单行文本国图金额',
    icon: 'icon-input',
    isShow: 'true',
    url: '',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      dataType: 'string',
      pattern: '',
      placeholder: '',
      disabled: false
    }
  },
  {
    type: 'inputguotulevel',
    name: '单行文本国图级别',
    icon: 'icon-input',
    isShow: 'true',
    url: '',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      dataType: 'string',
      pattern: '',
      placeholder: '',
      disabled: false
    }
  },
  // hq
  {
    type: 'button',
    name: '按钮',
    icon: 'icon-diy-com-textarea',
    isShow: 'false',
    url: '',
    options: {
      width: '',
      defaultValue: '',
      required: false,
      pattern: '',
      placeholder: ''
    }
  },
  {
    type: 'button2',
    name: '按钮',
    icon: 'icon-diy-com-textarea',
    isShow: 'false',
    url: '',
    options: {
      width: '',
      defaultValue: '',
      required: false,
      pattern: '',
      placeholder: ''
    }
  },
  {
    type: 'divider',
    name: '分割线',
    icon: 'icon-divider',
    isShow: 'false',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      pattern: '',
      placeholder: '',
      disabled: false,
    }
  },
  {
    type: 'row',
    name: '自定义文字',
    icon: 'icon-row',
    isShow: 'false',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      pattern: '',
      placeholder: '',
      disabled: false,
    }
  },
  {
    type: 'row2',
    name: '自定义文字',
    icon: 'icon-row',
    isShow: 'false',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      pattern: '',
      placeholder: '',
      disabled: false,
    }
  },
  {
    type: 'row3',
    name: '自定义文字',
    icon: 'icon-row',
    isShow: 'false',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      pattern: '',
      placeholder: '',
      disabled: false
    }
  },
  {
    type: 'table',
    name: '表格',
    isShow: 'false',
    options: {
      width: '',
      defaultValue: [{
        "COLUMN_CNNAME": "列名1",
        "COLUMN_ENNAME": "columns1",
        "sClass": "text-center"
      }, {
        "COLUMN_CNNAME": "列名2",
        "COLUMN_ENNAME": "columns2",
        "sClass": "text-center"
      }, {
        "COLUMN_CNNAME": "列名3",
        "COLUMN_ENNAME": "columns3",
        "sClass": "text-center"
      }, {
        "COLUMN_CNNAME": "列名4",
        "COLUMN_ENNAME": "columns4",
        "sClass": "text-center"
      }, {
        "COLUMN_CNNAME": "列名5",
        "COLUMN_ENNAME": "columns5",
        "sClass": "text-center"
      }],
      required: false,
      pattern: ''
    }
  },
  // hq
  {
    type: 'textarea',
    name: '多行文本',
    icon: 'icon-diy-com-textarea',
    isShow: 'true',
    url: '',
    options: {
      width: '100%',
      defaultValue: '',
      // required: false,
      // disabled: false,
      pattern: '',
      placeholder: '',
      url: ''
    }
  },
  {
    type: 'textarea2',
    name: '多行文本2',
    icon: 'icon-diy-com-textarea',
    isShow: 'true',
    url: '',
    options: {
      width: '100%',
      defaultValue: '',
      // required: false,
      // disabled: false,
      pattern: '',
      placeholder: '',
      url: ''
    }
  },
  {
    type: 'number',
    name: '计数器',
    icon: 'icon-number',
    isShow: 'true',
    options: {
      width: '',
      required: false,
      defaultValue: 0,
      min: '',
      max: '',
      step: 1,
      disabled: false,
      controlsPosition: ''
    }
  },
  {
    type: 'radio',
    name: '单选框组',
    icon: 'icon-radio-active',
    isShow: 'true',
    options: {
      inline: false,
      defaultValue: '',
      showLabel: false,
      options: [{
          value: '选项1',
          label: '选项1'
        },
        {
          value: '选项2',
          label: '选项2'
        },
        {
          value: '选项3',
          label: '选项3'
        }
      ],
      required: false,
      width: '',
      remote: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'checkbox',
    name: '多选框组',
    icon: 'icon-check-box',
    isShow: 'true',
    options: {
      inline: false,
      defaultValue: [],
      showLabel: false,
      options: [{
          value: '选项1'
        },
        {
          value: '选项2'
        },
        {
          value: '选项3'
        }
      ],
      required: false,
      width: '',
      remote: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'checkboxSingle',
    name: '复选框',
    icon: 'icon-check-box',
    isShow: 'false',
    url: '',
    options: {
      defaultValue: '',
      width: ''
    },
    props: {
      value: 'value',
      label: 'label'
    },
    remoteFunc: ''
  },
  {
    type: 'time',
    name: '时间选择器',
    icon: 'icon-time',
    url: '',
    isShow: 'true',
    options: {
      defaultValue: '21:19:56',
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      isRange: false,
      arrowControl: true,
      format: 'HH:mm:ss',
      required: false,
      width: '',
    }
  },
  {
    type: 'date',
    name: '日期选择器',
    icon: 'icon-date',
    isShow: 'true',
    options: {
      defaultValue: '',
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      type: 'date',
      format: 'yyyy-MM-dd',
      timestamp: false,
      required: false,
      width: '',
    }
  },
  {
    type: 'rate',
    name: '评分',
    icon: 'icon-icon-test',
    isShow: 'true',
    options: {
      defaultValue: null,
      max: 5,
      disabled: false,
      allowHalf: false,
      required: false
    }
  },
  {
    type: 'color',
    name: '颜色选择器',
    isShow: 'true',
    icon: 'icon-color',
    options: {
      defaultValue: '',
      disabled: false,
      showAlpha: false,
      required: false
    }
  },
  {
    type: 'select',
    name: '下拉选择框',
    icon: 'icon-select',
    isShow: 'true',
    url: '',
    options: {
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      showLabel: false,
      width: '',
      options: [{
          value: '下拉框1'
        },
        {
          value: '下拉框2'
        }, {
          value: '下拉框3'
        }
      ],
      remote: false,
      filterable: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: ''
    },
    config: {
      labelPosition: ""
    }
  },
  {
    type: 'selectguotu',
    name: '下拉框国图类型',
    icon: 'icon-select',
    isShow: 'true',
    url: '',
    options: {
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      showLabel: false,
      width: '',
      options: [{
          value: '下拉框1'
        },
        {
          value: '下拉框2'
        }, {
          value: '下拉框3'
        }
      ],
      remote: true,
      filterable: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
        url: ''
      },
      remoteFunc: '',
      listened: false,
      listen: []
    },
    config: {
      labelPosition: ""
    }
  },
  {
    type: 'select',
    name: '下拉选择框1',
    icon: 'icon-select',
    isShow: 'true',
    url: '',
    options: {
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      showLabel: false,
      width: '',
      options: [{
          value: '下拉框1'
        },
        {
          value: '下拉框2'
        }, {
          value: '下拉框3'
        }
      ],
      remote: true,
      filterable: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
        url: ''
      },
      remoteFunc: '',
      listened: false,
      listen: []
    },
    config: {
      labelPosition: ""
    }
  },
  {
    type: 'select',
    name: '下拉选择框',
    icon: 'icon-select',
    isShow: 'false',
    url: '',
    options: {
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      showLabel: false,
      width: '',
      options: [{
          value: '下拉框1'
        },
        {
          value: '下拉框2'
        }, {
          value: '下拉框3'
        }
      ],
      remote: false,
      filterable: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: ''
    },
    config: {
      labelPosition: "left"
    }
  },
  {
    type: 'switch',
    name: '开关',
    icon: 'icon-switch',
    isShow: 'true',
    options: {
      defaultValue: false,
      required: false,
      disabled: false,
    }
  },
  {
    type: 'slider',
    name: '滑块',
    icon: 'icon-slider',
    isShow: 'true',
    options: {
      defaultValue: 0,
      disabled: false,
      required: false,
      min: 0,
      max: 100,
      step: 1,
      showInput: false,
      range: false,
      width: ''
    }
  }
]

export const advanceComponents = [{
    type: 'blank',
    name: '自定义',
    icon: 'icon-ic',
    options: {
      defaultType: 'String'
    }
  },
  {
    type: 'imgupload',
    name: '图片',
    icon: 'icon-tupian',
    isShow: 'true',
    url: '',
    options: {
      defaultValue: [],
      size: {
        width: 100,
        height: 100,
      },
      width: '',
      tokenFunc: 'funcGetToken',
      token: '',
      domain: 'http://pfp81ptt6.bkt.clouddn.com/',
      disabled: false,
      length: 8,
      multiple: true
    }
  },
  {
    type: 'editor',
    name: '编辑器',
    icon: 'icon-fuwenbenkuang',
    isShow: 'true',
    options: {
      defaultValue: '',
      width: ''
    }
  },
  {
    type: 'cascader',
    name: '级联选择器',
    icon: 'icon-jilianxuanze',
    isShow: 'true',
    options: {
      defaultValue: [],
      width: '',
      placeholder: '',
      disabled: false,
      clearable: false,
      remote: true,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'team',
    name: '团队管理组件',
    icon: 'icon-jilianxuanze',
    options: {
      defaultValue: [],
      width: '',
      placeholder: '',
      disabled: false,
      clearable: false,
      remote: true,
      remoteOptions: [],
      url_a: '',
      url_b: '',
      url_c: '',
      url_d: '',
      url_e: '',
      url_f: '',
      url_g: '',
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'conclusion',
    name: '经验教训组件',
    icon: 'icon-jilianxuanze',
    options: {
      defaultValue: [],
      width: '',
      placeholder: '',
      disabled: false,
      clearable: false,
      remote: true,
      remoteOptions: [],
      url_a: '',
      url_b: '',
      url_c: '',
      url_d: '',
      url_e: '',
      url_f: '',
      url_g: '',
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'projectsplit',
    name: '项目拆分',
    icon: 'icon-jilianxuanze',
    options: {
      defaultValue: [],
      width: '',
      placeholder: '',
      disabled: false,
      clearable: false,
      remote: true,
      remoteOptions: [],
      url_a: '',
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'synergyInformation',
    name: '项目拆分',
    icon: 'icon-jilianxuanze',
    options: {
      defaultValue: [],
      width: '',
      placeholder: '',
      disabled: false,
      clearable: false,
      remote: true,
      remoteOptions: [],
      url_a: '',
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: ''
    }
  }, {
    type: 'contractassociated',
    name: '合同关联',
    icon: 'icon-jilianxuanze',
    options: {
      defaultValue: [],
      width: '',
      placeholder: '',
      disabled: false,
      clearable: false,
      remote: true,
      remoteOptions: [],
      url_a: '',
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'myTable',
    name: '子项目列表',
    icon: 'icon-jilianxuanze',
    isShow: 'true',
    url: '',
    options: {
      defaultValue: [],
      width: '',
      placeholder: '',
      disabled: false,
      clearable: false,
      remote: true,
      remoteOptions: [],
      url_a: '',
      url_b: '',
      url_c: '',
      url_d: '',
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'customer',
    name: '客户联系人组件',
    icon: 'icon-jilianxuanze',
    options: {
      defaultValue: [],
      width: '',
      placeholder: '',
      disabled: false,
      clearable: false,
      remote: true,
      remoteOptions: [],
      url_a: '',
      url_b: '',
      url_c: '',
      url_d: '',
      url_e: '',
      url_f: '',
      url_g: '',
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'tag',
    name: 'Tag标签',
    icon: 'icon-jilianxuanze',
    isShow: 'true',
    url: '',
    options: {
      width: '',
      defaultValue: [],
      required: false,
      pattern: '',
      placeholder: ''
    }
  }
]

export const layoutComponents = [{
  type: 'grid',
  name: '栅格布局',
  icon: 'icon-grid-',
  columns: [{
      span: 12,
      list: []
    },
    {
      span: 12,
      list: []
    }
  ],
  options: {
    gutter: 0,
    justify: 'start',
    align: 'top'
  }
}]
