<template>
  <el-container>
    <el-aside style="wdith: 250px;">
      <div class="components-list">
        <div class="widget-cate">基础字段</div>
        <draggable
          :list="basicComponents"
          :options="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
          :move="handleMove"
          element="ul"
          @end="handleMoveEnd"
          @start="handleMoveStart"
        >
          <li v-for="(item, index) in basicComponents" :key="index" class="form-edit-widget-label">
            <a>
              <icon :name="item.icon" class="icon" />
              <span>{{ item.name }}</span>
            </a>
          </li>
        </draggable>

        <div class="widget-cate">高级字段</div>
        <draggable
          :list="advanceComponents"
          :options="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
          :move="handleMove"
          element="ul"
          @end="handleMoveEnd"
          @start="handleMoveStart"
        >
          <li
            v-for="(item, index) in advanceComponents"
            :key="index"
            class="form-edit-widget-label"
          >
            <a>
              <icon :name="item.icon" class="icon" />
              <span>{{ item.name }}</span>
            </a>
          </li>
        </draggable>

        <div class="widget-cate">布局字段</div>
        <draggable
          :list="layoutComponents"
          :options="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
          :move="handleMove"
          element="ul"
          @end="handleMoveEnd"
          @start="handleMoveStart"
        >
          <li
            v-for="(item, index) in layoutComponents"
            :key="index"
            class="form-edit-widget-label data-grid"
          >
            <a>
              <icon :name="item.icon" class="icon" />
              <span>{{ item.name }}</span>
            </a>
          </li>
        </draggable>
      </div>
    </el-aside>
    <el-container class="center-container" direction="vertical">
      <el-header class="btn-bar" style="height: 45px;">
        <!-- <el-button type="text" size="medium" @click="handleGoGithub">GitHub</el-button> -->
        <el-button type="text" size="medium" icon="el-icon-view" @click="handlePreview">预览</el-button>
        <el-button
          type="text"
          size="medium"
          icon="el-icon-tickets"
          @click="handleGenerateJson"
        >生成JSON</el-button>
        <el-button
          type="text"
          size="medium"
          icon="el-icon-document"
          @click="handleGenerateCode"
        >生成代码</el-button>
      </el-header>
      <el-main
        :class="{'widget-empty': widgetForm.list.length == 0}"
        style="overflow:scroll;height:500px !important;"
      >
        <widget-form ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect" />
      </el-main>
    </el-container>

    <el-aside class="widget-config-container">
      <el-container>
        <el-header height="45px">
          <div
            :class="{active: configTab=='widget'}"
            class="config-tab"
            @click="handleConfigSelect('widget')"
          >字段属性</div>
          <div
            :class="{active: configTab=='form'}"
            class="config-tab"
            @click="handleConfigSelect('form')"
          >表单属性</div>
          <div
            :class="{active: configTab=='table'}"
            class="config-tab"
            @click="handleConfigSelect('table')"
          >表格属性</div>
        </el-header>
        <el-main class="config-content">
          <widget-config v-show="configTab=='widget'" :data="widgetFormSelect" />
          <form-config v-show="configTab=='form'" :data="widgetForm.config" />
          <table-config v-show="configTab=='table'" :data="widgetForm.table" />
        </el-main>
      </el-container>
    </el-aside>

    <cus-dialog
      ref="widgetPreview"
      :visible="previewVisible"
      width="1000px"
      form
      @on-close="previewVisible = false"
      @on-submit="handleTest"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="From" name="first">
          <generate-form
            v-if="previewVisible"
            ref="generateForm"
            :data="widgetForm"
            :remote="remoteFuncs"
            :value="widgetModels"
          >
            <template slot="blank" slot-scope="scope">
              宽度：
              <el-input v-model="scope.model.blank.width" style="width: 100px" />高度：
              <el-input v-model="scope.model.blank.height" style="width: 100px" />
            </template>
          </generate-form>
        </el-tab-pane>
        <el-tab-pane label="Table" name="second">
          <generate-table
            ref="generateTable"
            :data="widgetForm"
            :remote="remoteFuncs"
            :value="widgetModels"
          />
        </el-tab-pane>
      </el-tabs>
    </cus-dialog>

    <cus-dialog
      ref="jsonPreview"
      :visible="jsonVisible"
      width="800px"
      form
      @on-close="jsonVisible = false"
    >
      <div id="jsoneditor" style="height: 400px;width: 100%;">{{ jsonTemplate }}</div>

      <template slot="action">
        <el-button id="copybtn" data-clipboard-target=".ace_text-input">双击复制</el-button>
        <el-button
          id="codetobtn"
          icon="el-icon-upload2"
          style="float: left"
          @click="handlecodetoS"
        >导入JSON</el-button>
      </template>
    </cus-dialog>

    <cus-dialog
      ref="codePreview"
      :visible="codeVisible"
      :action="false"
      width="800px"
      form
      @on-close="codeVisible = false"
    >
      <div id="codeeditor" style="height: 500px; width: 100%;">{{ htmlTemplate }}</div>
    </cus-dialog>
  </el-container>
</template>

<script>
import Draggable from "vuedraggable";
import WidgetConfig from "./WidgetConfig";
import FormConfig from "./FormConfig";
import TableConfig from "./TableConfig";
import WidgetForm from "./WidgetForm";
import CusDialog from "./CusDialog";
import GenerateForm from "./GenerateForm";
import GenerateTable from "../CreateTable/GenerateTable";
// import JSONEditor from 'jsoneditor'
// import 'jsoneditor/dist/jsoneditor.min.css'
import Clipboard from "clipboard";
import {
  basicComponents,
  layoutComponents,
  advanceComponents
} from "./componentsConfig.js";
import { loadJs } from "./util/index.js";
import generateCode from "./generateCode.js";
import Icon from "vue-awesome/components/Icon";
import "vue-awesome/icons/regular/keyboard";
import "vue-awesome/icons/regular/trash-alt";
import "vue-awesome/icons/regular/clone";
import "vue-awesome/icons/regular/dot-circle";
import "vue-awesome/icons/regular/check-square";
import "vue-awesome/icons/bars";
import "vue-awesome/icons/regular/calendar-alt";
import "vue-awesome/icons/regular/clock";
import "vue-awesome/icons/th";
import "vue-awesome/icons/sort-numeric-up";
import "vue-awesome/icons/regular/star";
import "vue-awesome/icons/palette";
import "vue-awesome/icons/regular/caret-square-down";
import "vue-awesome/icons/toggle-off";
import "vue-awesome/icons/sliders-h";
import "vue-awesome/icons/regular/image";
import "vue-awesome/icons/chalkboard";
export default {
  name: "FmMakingForm",
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    CusDialog,
    GenerateForm,
    Icon,
    GenerateTable,
    TableConfig
  },
  data() {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,
      widgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right"
        },
        table: {
          showRemove: false,
          showIndexCol: false,
          showEdit: false,
          showExport: false,
          showAdd: false,
          stripe: true,
          border: false
        }
      },
      configTab: "widget",
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      activeName: "first",
      remoteFuncs: {
        func_test(resolve) {
          setTimeout(() => {
            const options = [
              { id: "1", name: "1111" },
              { id: "2", name: "2222" },
              { id: "3", name: "3333" }
            ];

            resolve(options);
          }, 2000);
        }
        // funcGetToken(resolve) {
        //   request.get('http://tools-server.xiaoyaoji.cn/api/uptoken').then(res => {
        //     resolve(res.uptoken)
        //   })
        // }
      },
      widgetModels: {},
      blank: "",
      htmlTemplate: "",
      jsonTemplate: ""
    };
  },
  watch: {
    widgetForm: {
      deep: true,
      handler: function(val) {
        this.widgetForm.list.options = this.$refs.widgetForm.data.list[0].options;
        // console.log(this.$refs.widgetForm)
        console.log(this.$refs.widgetForm.data.list[0].options);
        // console.log(this.$refs.widgetForm)
      }
    }
  },
  mounted() {
    // loadCss('https://unpkg.com/jsoneditor/dist/jsoneditor.min.css')
    // loadJs('https://unpkg.com/jsoneditor/dist/jsoneditor.min.js')
    loadJs("https://cdnjs.cloudflare.com/ajax/libs/ace/1.3.0/ace.js");
  },
  methods: {
    handleGoGithub() {
      window.location.href = "https://";
    },
    handleConfigSelect(value) {
      this.configTab = value;
    },
    handleMoveEnd(evt) {
      console.log("end", evt);
    },
    handleMoveStart({ oldIndex }) {
      console.log("start", oldIndex, this.basicComponents);
    },
    handleMove() {
      return true;
    },
    handlePreview() {
      this.previewVisible = true;
    },
    handleTest() {
      this.$refs.generateForm
        .getData()
        .then(data => {
          this.$alert(data, "").catch(e => {});
          this.$refs.widgetPreview.end();
        })
        .catch(e => {
          this.$refs.widgetPreview.end();
        });
    },
    handleGenerateJson() {
      this.jsonVisible = true;
      // console.log(this.widgetForm)
      this.jsonTemplate = this.widgetForm;
      this.$nextTick(() => {
        // eslint-disable-next-line no-undef
        const editor = ace.edit("jsoneditor");
        editor.session.setMode("ace/mode/json");
        // eslint-disable-next-line no-unused-vars
        const btnCopy = new Clipboard("#copybtn");
      });
    },
    handlecodetoS() {
      // eslint-disable-next-line no-undef
      this.widgetForm = JSON.parse(
        ace
          .edit("jsoneditor")
          .getValue()
          .replace(/'/g, '"')
      );
      this.widgetForm.list.length > 0 &&
        (this.widgetFormSelect = this.widgetForm.list[0]);
      this.$message({
        message: "操作成功",
        type: "success"
      });
    },
    handleGenerateCode() {
      this.codeVisible = true;
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm));
      this.$nextTick(() => {
        // eslint-disable-next-line no-undef
        const editor = ace.edit("codeeditor");
        editor.session.setMode("ace/mode/html");
      });
    }
  }
};
</script>

<style lang="scss">
@import "./styles/cover.scss";
@import "./styles/index.scss";

.widget-empty {
  background: url("./assets/form_empty.png") no-repeat;
  background-position: 50%;
}
</style>
