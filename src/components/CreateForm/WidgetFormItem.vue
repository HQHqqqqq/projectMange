<template>
  <el-form-item class="widget-view" v-if="element && element.key"
    :class="{active: selectWidget.key == element.key, 'is_req': element.options.required }"
    :label="element.isShow == 'true' ? element.name : ''" @click.native.stop="handleSelectWidget(index)">
    <!--  <el-form-item
    v-if="element && element.key"
    :class="{active: selectWidget.key == element.key, 'is_req': element.options.required}"
    :label="element.name"
    :label-width="element.name === '' ? '0px' : '' "
    class="widget-view "
    @click.native="handleSelectWidget(index)"
    >-->
    <template v-if="element.type == 'input'">
      <el-input v-model="element.options.defaultValue" :style="{width: element.options.width}"
        :placeholder="element.options.placeholder" :readonly="element.options.readonly"
        :disabled="element.options.disabled" :clearable="element.options.clearable" />
    </template>

    <!-- hq -->
    <template v-if="element.type == 'button'">
      <el-button type="primary" v-model="element.options.defaultValue" :style="{width: element.options.width}"
        :placeholder="element.options.placeholder" :url="element.options.url">{{element.options.placeholder}}
      </el-button>
    </template>
    <template v-if="element.type == 'button2'">
      <el-button type="primary" class="button2" v-model="element.options.defaultValue"
        :style="{width: element.options.width}" :placeholder="element.options.placeholder" :url="element.options.url">
        {{element.options.placeholder}}</el-button>
    </template>
    <!--分割线-->
    <template v-if="element.type == 'divider'">
      <el-collapse></el-collapse>
    </template>

    <!--单独的字-->
    <template v-if="element.type == 'row'">
      <el-row :gutter="0">
        <el-col>
          <div class="grid-content bg-purple wordTitle">{{element.options.placeholder}}</div>
        </el-col>
      </el-row>
    </template>
    <template v-if="widget_copy.type == 'row2'">
      <el-row>
        <el-col>
          <div class="grid-content bg-purple word">{{widget_copy.options.placeholder}}</div>
        </el-col>
      </el-row>
    </template>
    <template v-if="element.type == 'row3'">
      <el-row :gutter="0">
        <el-col>
          <div class="grid-content bg-purple wordLeft">{{element.options.placeholder}}</div>
        </el-col>
      </el-row>
    </template>

    <template v-if="element.type == 'table'">
      <el-table border style="width: 100%">
        <tr v-for="col in element.options.defaultValue">
          <el-table-column :label="col.COLUMN_CNNAME"></el-table-column>
          <!-- <el-table-column v-if="col.type==='sort'" :prop="col.prop" sortable :label="col.COLUMN_CNNAME">
							<template scope="scope">
							<el-tag type="primary">{{ scope.row.type }}</el-tag>
							</template>
          </el-table-column>-->
        </tr>
      </el-table>
    </template>
    <!-- hq -->

    <template v-if="element.type == 'textarea'">
      <el-input :rows="5" v-model="element.options.defaultValue" :style="{width: element.options.width}"
        :placeholder="element.options.placeholder" type="textarea" />
    </template>

    <template v-if="element.type == 'number'">
      <el-input-number v-model="element.options.defaultValue" :disabled="element.options.disabled"
        :controls-position="element.options.controlsPosition" :style="{width: element.options.width}" />
    </template>

    <template v-if="element.type == 'radio'">
      <el-radio-group v-model="element.options.defaultValue" :style="{width: element.options.width}">
        <el-radio v-for="(item, index) in element.options.options"
          :style="{display: element.options.inline ? 'inline-block' : 'block'}" :label="item.value"
          :key="item.value + index">{{ element.options.showLabel ? item.label : item.value }}</el-radio>
      </el-radio-group>
    </template>

    <template v-if="element.type == 'checkbox'">
      <el-checkbox-group v-model="element.options.defaultValue" :style="{width: element.options.width}">
        <el-checkbox v-for="(item, index) in element.options.options"
          :style="{display: element.options.inline ? 'inline-block' : 'block'}" :label="item.value"
          :key="item.value + index">{{ element.options.showLabel ? item.label : item.value }}</el-checkbox>
      </el-checkbox-group>
    </template>
    <template v-if="element.type == 'checkboxSingle'">
      <el-checkbox>是否是子项目</el-checkbox>
    </template>

    <template v-if="element.type == 'team'">
      <Myteam :datas="element"></Myteam>
    </template>

    <template v-if="element.type == 'conclusion'">
      <conclusion :datas="element"></conclusion>
    </template>

    <template v-if="element.type == 'projectsplit'">
      <projectsplit :datas="element"></projectsplit>
    </template>

    <template v-if="element.type == 'customer'">
      <customercontact :datas="element"></customercontact>
    </template>

    <template v-if="element.type == 'tag'">
      <key-tag :datas="element"></key-tag>
    </template>

    <template v-if="element.type == 'myTable'">
      <myTable :datas="element"></myTable>
    </template>

    <template v-if="element.type == 'time'">
      <el-time-picker v-model="element.options.defaultValue" :is-range="element.options.isRange"
        :placeholder="element.options.placeholder" :start-placeholder="element.options.startPlaceholder"
        :end-placeholder="element.options.endPlaceholder" :readonly="element.options.readonly"
        :disabled="element.options.disabled" :editable="element.options.editable" :clearable="element.options.clearable"
        :arrow-control="element.options.arrowControl" :style="{width: element.options.width}" />
    </template>

    <template v-if="element.type == 'date'">
      <el-date-picker v-model="element.options.defaultValue" :type="element.options.type"
        :is-range="element.options.isRange" :placeholder="element.options.placeholder"
        :start-placeholder="element.options.startPlaceholder" :end-placeholder="element.options.endPlaceholder"
        :readonly="element.options.readonly" :disabled="element.options.disabled" :editable="element.options.editable"
        :clearable="element.options.clearable" :style="{width: element.options.width}" />
    </template>

    <template v-if="element.type == 'rate'">
      <el-rate v-model="element.options.defaultValue" :max="element.options.max" :disabled="element.options.disabled"
        :allow-half="element.options.allowHalf" />
    </template>

    <template v-if="element.type == 'color'">
      <el-color-picker v-model="element.options.defaultValue" :disabled="element.options.disabled"
        :show-alpha="element.options.showAlpha" />
    </template>

    <template v-if="element.type == 'select'">
      <el-select v-model="element.options.defaultValue" :disabled="element.options.disabled"
        :multiple="element.options.multiple" :clearable="element.options.clearable"
        :placeholder="element.options.placeholder" :style="{width: element.options.width}">
        <el-option v-for="item in element.options.options" :key="item.value" :value="item.value"
          :label="element.options.showLabel?item.label:item.value" />
      </el-select>
    </template>
    <template v-if="element.type == 'cascader'">
      <el-cascader v-model="element.options.defaultValue" :disabled="element.options.disabled"
        :clearable="element.options.clearable" :placeholder="element.options.placeholder"
        :style="{width: element.options.width}" :options="element.options.options" />
    </template>

    <template v-if="element.type=='switch'">
      <el-switch v-model="element.options.defaultValue" :disabled="element.options.disabled" />
    </template>

    <template v-if="element.type=='slider'">
      <el-slider v-model="element.options.defaultValue" :min="element.options.min" :max="element.options.max"
        :disabled="element.options.disabled" :step="element.options.step" :show-input="element.options.showInput"
        :range="element.options.range" :style="{width: element.options.width}" />
    </template>
    <template v-if="element.type=='upload'">
      <el-upload :disabled="element.options.disabled" :style="{'width': element.options.width}"
        :action="element.options.action" :limit="element.options.limit" :multiple="element.options.multiple"
        :file-list="element.options.defaultValue" :drag="element.options.drag" class="upload-demo">
        <i v-if="element.options.drag" class="el-icon-upload" />
        <div v-if="element.options.drag" class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <el-button v-if="!element.options.drag" size="small" type="primary">点击上传</el-button>
      </el-upload>
    </template>

    <template v-if="element.type=='imgupload'">
      <fm-upload v-model="element.options.defaultValue" :disabled="element.options.disabled"
        :style="{'width': element.options.width}" :width="element.options.size.width"
        :height="element.options.size.height" token="xxx" domain="xxx" />
    </template>

    <template v-if="element.type=='blank'">
      <div style="height: 50px;color: #999;background: #eee;line-height:50px;text-align:center;">自定义区域</div>
    </template>

    <el-button v-if="selectWidget.key == element.key" title="删除" class="widget-action-delete" circle plain type="danger"
      @click.stop="handleWidgetDelete(index)">
      <icon name="regular/trash-alt" style="width: 12px;height: 12px;" />
    </el-button>
    <el-button v-if="selectWidget.key == element.key" title="复制" class="widget-action-clone" circle plain type="primary"
      @click.stop="handleWidgetClone(index)">
      <icon name="regular/clone" style="width: 12px;height: 12px;" />
    </el-button>
  </el-form-item>
</template>

<script>
import FmUpload from "./Upload";
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
import "vue-awesome/icons/upload";
import Myteam from "../CreateForm/myteam";
import conclusion from "../CreateForm/conclusion";
import keyTag from "../CreateForm/keyTag"; //tag标签
import customercontact from "../CreateForm/CustomerContact";
import myTable from "../CreateForm/myTable";
import projectsplit from "../CreateForm/projectsplit";
export default {
  components: {
    FmUpload,
    Icon,
    Myteam,
    keyTag,
    customercontact,
    myTable,
    conclusion,
    projectsplit
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["element", "select", "index", "data"],
  data() {
    return {
      selectWidget: this.select
    };
  },
  watch: {
    select(val) {
      this.selectWidget = val;
    },
    selectWidget: {
      handler(val) {
        this.$emit("update:select", val);
      },
      deep: true
    }
  },
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data.list[index];
    },
    handleWidgetDelete(index) {
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {};
        } else {
          this.selectWidget = this.data.list[index - 1];
        }
      } else {
        this.selectWidget = this.data.list[index + 1];
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1);
      });
    },
    handleWidgetClone(index) {
      let cloneData = {
        ...this.data.list[index],
        options: { ...this.data.list[index].options },
        key: Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999)
      };

      if (
        this.data.list[index].type === "radio" ||
        this.data.list[index].type === "checkbox"
      ) {
        cloneData = {
          ...cloneData,
          options: {
            ...cloneData.options,
            options: cloneData.options.options.map(item => ({ ...item }))
          }
        };
      }

      this.data.list.splice(index, 0, cloneData);

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1];
      });
    }
  }
};
</script>
<style>
.tableRowClassName {
  background: rgb(148, 203, 235);
}

.el-collapse {
  border-top: none !important;
  border-bottom: 2px solid #ccc;
}

.grid-content {
  height: auto;
  border: none;
  width: auto;
}

.el-form-item__label {
  width: 170px !important;
}

.wordTitle {
  font-size: 20px;
  text-align: center;
  font-weight: bold;
  color: #000;
}

.word {
  font-size: 15px;
  text-align: center;
  font-weight: bold;
  color: #000;
}

.wordLeft {
  font-size: 20px;
  text-align: left;
  font-weight: bold;
  color: #606266;
}

.button2 {
  float: right;
  /* margin-right: 50px; */
}
</style>
