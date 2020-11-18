<template>
  <!--里程碑模板 配置-->
  <div class="milestoneTemplate">
    <!--模板表格数据-->
    <div>
      <div style="float: right;margin-right: 20px;margin-bottom: 5px">
        <el-button type="primary" size="mini" @click="handleAdd1" :disabled="addStatus">新建</el-button>
        <el-button type="primary" size="mini" @click="handleSave1(multipleSelection1)">保存</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="dialogVisible = true"
          :disabled="!table1status"
        >授权</el-button>
      </div>
      <div style="clear: left"></div>

      <div>
        <el-dialog title="公司授权" :visible.sync="dialogVisible" width="30%">
          <div>
            <el-checkbox v-model="roleAllStatus">集团</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox
              v-for="(role, index) in roleData"
              :checked="role.status == 1 ? true : false"
              :key="index"
              v-model="role.checkedStatus"
            >{{ role.account_name }}</el-checkbox>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
          </span>
        </el-dialog>
      </div>

      <h4 style="margin-bottom: 0px;margin-top: 7px">里程碑模板列表</h4>
      <el-table
        :data="tableData1"
        border
        row-key="id"
        :expand-row-keys="rowExpands"
        v-loading="loading"
        highlight-current-row
        @current-change="rowClick1"
        @header-dragend="headerDragend"
        :header-cell-style="{
          fontSize: '12px',
          color: '#303133',
          height: '34px',
          padding: 0,
          backgroundColor: '#ccd1d5'
        }"
        :row-style="{ height: '34px' }"
        :cell-style="{ padding: 0 }"
        style="width: 100%"
      >
        <!--重写选择框，实现单选操作-->
        <el-table-column width="35" label="编辑">
          <template slot-scope="scope">
            <el-checkbox @change="selectChange1(scope.row)" v-model="scope.row.checkedStatus"></el-checkbox>
          </template>
        </el-table-column>

        <!-- 授权公司折叠显示 -->
        <el-table-column type="expand" width="35">
          <template slot-scope="scope">
            <h4 style="margin-bottom: 0px;margin-top: -10px">授权公司名称</h4>
            <div v-if="scope.row.checkedStatus">
              <el-tag
                v-for="tag in scope.row.companys"
                :key="tag.accountId"
                @close="handleClose(tag)"
                closable
              >{{ tag.account_name }}</el-tag>
            </div>
            <div v-else>
              <el-tag v-for="tag in scope.row.companys" :key="tag.accountId">
                {{
                tag.account_name
                }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>

        <el-table-column
          :width="btnMaxWidth"
          prop="milestoneTemplateName"
          align="center"
          label="模板名称"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.checkedStatus">
              <el-input
                type="text"
                size="mini"
                v-model="scope.row.milestoneTemplateName"
                @change="contentChange(scope.row)"
                placeholder="请输入模板名称"
              ></el-input>
            </div>
            <div v-else>
              <span>
                <!-- {{scope.row.milestoneTemplateName}} -->
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.milestoneTemplateName"
                  placement="right"
                >
                  <el-button
                    :class="{ pname: isPname }"
                    :style="{ maxWidth: btnMaxWidth - 30 + 'px' }"
                    type="text"
                    style="color:#606266"
                  >{{ scope.row.milestoneTemplateName }}</el-button>
                </el-tooltip>
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="type"
          align="center"
          :show-overflow-tooltip="true"
          width="130"
          label="类型"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.checkedStatus">
              <el-select
                size="mini"
                v-model="scope.row.type"
                @change="contentChange(scope.row)"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in typeData.options"
                  :key="item.id"
                  :label="item.dicName"
                  :value="item.dicName"
                ></el-option>
              </el-select>
            </div>
            <div v-else>
              <span>
                {{ scope.row.type }}
                <!-- <el-tooltip class="item" effect="dark" :content="scope.row.type" placement="right">
                  <el-button class="pname" type="text">{{scope.row.type}}</el-button>
                </el-tooltip>-->
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="description"
          :show-overflow-tooltip="true"
          align="center"
          label="模板描述"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.checkedStatus">
              <el-input
                type="text"
                size="mini"
                @change="contentChange(scope.row)"
                v-model="scope.row.description"
                placeholder="请输入模板描述"
              ></el-input>
            </div>
            <div v-else>
              {{ scope.row.description }}
              <!-- <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.description"
                placement="right"
              >
                <el-button class="pname" type="text">{{scope.row.description}}</el-button>
              </el-tooltip>-->
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="createName" align="center" width="60" label="创建者"></el-table-column>

        <el-table-column
          prop="company_id"
          align="center"
          width="70"
          :formatter="formatter_company_id"
          label="所属公司"
        ></el-table-column>

        <el-table-column prop="createDate" width="100" align="center" label="创建时间"></el-table-column>

        <!-- <el-table-column prop="address5" width="250" align="center" label="公司名称">
          <template slot-scope="scope">
            <div v-if="scope.row.checkedStatus">
              <el-tag v-for="tag in scope.row.companys" :key="tag.accountId" @close="handleClose(tag)" closable>
                {{tag.account_name}}
              </el-tag>
            </div>
            <div v-else>
              <el-tag v-for="tag in scope.row.companys" :key="tag.accountId">{{tag.account_name}}</el-tag>
            </div>
          </template>
        </el-table-column>-->

        <el-table-column prop="status" align="center" width="70" label="启用">
          <template slot-scope="scope">
            <el-switch
              @change="switchChange1(scope.row)"
              v-model="scope.row.status"
              active-value="1"
              inactive-value="0"
              active-text
              :disabled="scope.row.editStatus"
              inactive-text
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column prop align="center" width="50" label="删除">
          <template slot-scope="scope">
            <el-button
              type="text"
              :disabled="scope.row.editStatus"
              @click="handleDelete1(scope.row)"
            >
              <i
                class="el-icon-delete-solid"
                :class="scope.row.editStatus ? '' : 'isEdit'"
                style="font-size: 20px"
              ></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加分页-->
      <div class="page" style="margin-bottom: 5px">
        <el-pagination
          style="text-align: right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="1"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
        ></el-pagination>
      </div>
    </div>

    <!--<div style="margin-top: 40px"></div>-->

    <!--里程碑数据-->
    <div id="tableData2" style="width: 50%;float: left;">
      <div style="float: right;margin-right: 20px;">
        <!--<el-button type="text" @click="handleAdd2" :disabled="!table2status">新建</el-button>-->
        <!--<el-button type="text" @click="handleSave2" :disabled="!table2status">保存</el-button>-->
        <el-button type="primary" size="mini" @click="handleAdd2">新建</el-button>
        <el-button type="primary" size="mini" @click="handleSave2">保存</el-button>
        <!--<el-button-->
        <!--type="text"-->
        <!--@click="handleDelete2(multipleSelection2[0])"-->
        <!--&gt;删除</el-button>-->
      </div>
      <div style="clear: left"></div>
      <h4 style="margin-bottom: 0px;margin-top: 7px">里程碑</h4>
      <el-table
        :data="tableData2"
        border
        row-key="id"
        highlight-current-row
        @row-click="rowDrop"
        @current-change="table2handleCurrentChange"
        :header-cell-style="{
          fontSize: '12px',
          color: '#303133',
          height: '34px',
          padding: 0,
          backgroundColor: '#ccd1d5'
        }"
        :row-style="{ height: '34px' }"
        :cell-style="{ padding: 0 }"
        style="width: 100%;font-size: 10px"
      >
        <!--重写选择框，实现单选操作-->
        <el-table-column width="35" label="编辑">
          <template slot-scope="scope">
            <el-checkbox @change="selectChange2(scope.row)" v-model="scope.row.checkedStatus"></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column align="center" type="index" width="40" label="序号"></el-table-column>
        <el-table-column prop="stageName" align="center" width="100" label="阶段名称">
          <template slot-scope="scope">
            <div v-if="scope.row.checkedStatus">
              <el-select size="mini" v-model="scope.row.stageName" placeholder="请选择">
                <el-option
                  v-for="item in stageData.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div v-else>{{ scope.row.stageName }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="milestoneName" align="center" width="150" label="里程碑名称">
          <template slot-scope="scope">
            <div v-if="scope.row.checkedStatus">
              <el-input size="mini" v-model="scope.row.milestoneName" placeholder="请输入里程碑名称"></el-input>
            </div>
            <div v-else>{{ scope.row.milestoneName }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="progressPercentage" align="center" width="110" label="对应权重">
          <template slot-scope="scope">
            <div v-if="scope.row.checkedStatus">
              <el-input-number
                v-model="scope.row.progressPercentage"
                style="width: 90px"
                controls-position="right"
                :min="5"
                :max="100"
                :step="5"
              ></el-input-number>
            </div>
            <div v-else>{{ scope.row.progressPercentage }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="isCut" align="center" width="65" label="是否可裁剪">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isCut"
              @change="switchChange2(scope.row)"
              active-value="1"
              inactive-value="0"
              active-text
              :disabled="scope.row.editStatus"
              inactive-text
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column
          prop="description"
          :show-overflow-tooltip="true"
          align="center"
          width="150"
          label="里程碑描述"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.checkedStatus">
              <el-input
                size="mini"
                type="textarea"
                :rows="1"
                v-model="scope.row.description"
                placeholder="请输入里程碑描述"
              ></el-input>
            </div>
            <div v-else>
              {{ scope.row.description }}
              <!-- <el-tooltip
                class="item"
                effect="light"
                :content="scope.row.description"
                placement="right"
              >
                <el-button class="pname" type="text">{{scope.row.description}}</el-button>
              </el-tooltip>-->
            </div>
          </template>
        </el-table-column>

        <el-table-column prop align="center" width="50" label="删除">
          <template slot-scope="scope">
            <el-button
              type="text"
              :disabled="scope.row.editStatus"
              @click="handleDelete2(scope.row)"
            >
              <i
                class="el-icon-delete-solid"
                :class="scope.row.editStatus ? '' : 'isEdit'"
                style="font-size: 20px"
              ></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--交付物数据-->
    <div style="width: 49%;float: left;margin-left: 5px">
      <div style="float: right;margin-right: 20px;">
        <el-button type="primary" size="mini" @click="handleAdd3">新建</el-button>
        <el-button type="primary" size="mini" @click="handleSave3">保存</el-button>
      </div>
      <div style="clear: left"></div>
      <h4 style="margin-bottom: 0px;margin-top: 7px">交付物</h4>
      <el-table
        :data="tableData3"
        border
        :header-cell-style="{
          fontSize: '12px',
          color: '#303133',
          height: '34px',
          padding: 0,
          backgroundColor: '#ccd1d5'
        }"
        :row-style="{ height: '34px' }"
        :cell-style="{ padding: 0 }"
        style="width: 100%"
      >
        <!--重写选择框，实现单选操作-->
        <el-table-column width="35" label="编辑">
          <template slot-scope="scope">
            <el-checkbox @change="selectChange3(scope.row)" v-model="scope.row.checkedStatus"></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column align="center" type="index" width="40" label="序号"></el-table-column>

        <el-table-column prop="deliverableName" align="center" width="150" label="文档名称">
          <template slot-scope="scope">
            <div v-if="scope.row.checkedStatus">
              <el-input
                type="textarea"
                :rows="1"
                v-model="scope.row.deliverableName"
                placeholder="请输入文档名称"
              ></el-input>
            </div>
            <div v-else>{{ scope.row.deliverableName }}</div>
          </template>
        </el-table-column>

        <el-table-column
          prop="description"
          :show-overflow-tooltip="true"
          align="center"
          width="150"
          label="文档描述"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.checkedStatus">
              <el-input
                v-model="scope.row.description"
                type="textarea"
                :rows="1"
                placeholder="请输入文档描述"
              ></el-input>
            </div>
            <div v-else>
              {{ scope.row.description }}
              <!-- <el-tooltip
                class="item"
                effect="light"
                :content="scope.row.description"
                placement="right"
              >
                <el-button class="pname" type="text">{{scope.row.description}}</el-button>
              </el-tooltip>-->
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="isCut" align="center" width="65" label="是否为审计">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.auditDeliverable"
              @change="switchChange4(scope.row)"
              active-value="1"
              inactive-value="0"
              active-text
              :disabled="scope.row.editStatus"
              inactive-text
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column prop="isCut" align="center" width="65" label="是否可裁剪">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isCut"
              @change="switchChange3(scope.row)"
              active-value="1"
              inactive-value="0"
              active-text
              :disabled="scope.row.editStatus"
              inactive-text
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="上传模板" width="150" align="center" fixed-width>
          <template slot-scope="{ row }">
            <div v-if="row.id != '' && !row.editStatus">
              <el-upload
                class="upload-demo"
                :ref="row.id"
                :file-list="row.fileList"
                action="#"
                :on-change="handleChange"
                :on-remove="handleRemove"
                :on-success="handleAvatarSuccess"
                :auto-upload="false"
              >
                <el-button
                  slot="trigger"
                  size="small"
                  type="text"
                  @click="handleSelectFile(row)"
                >选文件</el-button>
                <el-button
                  style="margin-left: 10px;"
                  size="small"
                  type="text"
                  @click="submitUpload(row)"
                  :disabled="row.upload_status"
                >上传</el-button>
              </el-upload>
            </div>

            <div v-else>
              <el-button slot="trigger" size="small" type="text" @click="handleSelectFile2(row)">选文件</el-button>
              <el-button
                style="margin-left: 10px;"
                size="small"
                type="text"
                :disabled="row.upload_status"
              >上传</el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          prop="file_name"
          width="150"
          align="center"
          label="文件名"
        >
          <template slot-scope="{ row }">
            <!--<span>{{row.file_name}}</span>-->
            <!--添加模板下载url-->
            <span v-if="row.fileName">
              <u>
                <a
                  :href="row.template_file_url"
                  target="_blank"
                  style="color: dodgerblue"
                >{{ row.file_name }}</a>
              </u>
            </span>
            <span v-else>{{ row.file_name }}</span>
          </template>
        </el-table-column>

        <el-table-column prop align="center" width="50" label="删除">
          <template slot-scope="scope">
            <!--<el-button-->
            <!--type="danger"-->
            <!--size="small"-->
            <!--icon="el-icon-delete"-->
            <!--circle-->
            <!--:disabled="scope.row.editStatus"-->
            <!--@click="handleDelete3(scope.row)"-->
            <!--&gt;</el-button>-->

            <el-button
              type="text"
              :disabled="scope.row.editStatus"
              @click="handleDelete3(scope.row)"
            >
              <i
                class="el-icon-delete-solid"
                :class="scope.row.editStatus ? '' : 'isEdit'"
                style="font-size: 20px"
              ></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import { mapState, mapActions } from "vuex";
import { systemGetHttpMethod } from "../../api/api.js";
import { systemPostHttpMethod } from "../../api/api.js";
import { systemDeleteHttpMethod } from "../../api/api.js";
import { fileUpload } from "../../api/api.js"; //
import { getDownLoadUrl } from "../../api/api.js"; //

export default {
  name: "milestone-template",
  data() {
    return {
      rowExpands: [], //默认展开的行
      loading: false,
      //添加分页
      currentPage: 1,
      page: {
        //当前页
        pageNum: 1,
        //默认每页显示条数
        pageSize: 5,
        total: 0
      },
      btnMaxWidth: 150,
      isPname: true,
      addStatus: false, //模板新增按钮
      // 上传的文件
      file: {},
      roleAllStatus: false, //授权 页面 集团按钮
      templateCompanyId: "", //模板的公司id

      roleId: [], //已保存的公司ID
      roleData: [], //角色数据
      dialogVisible: false,
      table1status: false, //控制授权按钮
      table2status: false, //控制里程碑 添加 保存按钮
      table3status: false, //控制交付物 添加 保存按钮
      templateId: "", //模板id
      milestoneId: "", //里程碑id
      multipleSelection1: [], //模板 选中数据
      multipleSelection2: [], //里程碑 选中数据
      multipleSelection3: [], //交付物 选中数据
      table1select: "", //模板   选中行数据
      table2select: "", //里程碑 选中行数据
      // 模板数据
      tableData1: [],
      //模板类型 枚举
      typeData: {
        value: "",
        options: []
      },
      // 里程碑数据
      tableData2: [],
      //阶段 枚举
      stageData: {
        value: "",
        options: [
          { value: "启动", label: "启动" },
          { value: "规划", label: "规划" },
          { value: "实施", label: "实施" },
          { value: "收尾", label: "收尾" }
        ]
      },

      //交付物数据
      tableData3: []
    };
  },

  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ])
  },
  created() {
    this.getRoleData([]);
    this.getTypeData(); //获取模板 类型 枚举数据
    this.getTableData1(); //获取模板 表格数据
  },

  methods: {
    //添加分页
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getTableData1();
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.getTableData1();
    },
    headerDragend(newWidth, oldWidth, column, event) {
      this.btnMaxWidth = newWidth;
      if (newWidth > 150) {
        this.isPname = false;
      } else {
        this.isPname = true;
        this.btnMaxWidth = 150;
      }
    },
    //建立者公司 转换数据
    formatter_company_id(row) {
      switch (row.company_id) {
        case "5326994013938795629":
          return "超图信息";
          break;
        case "-1360422574114386809":
          return "超图软件";
          break;
        case "-8234401961992436364":
          return "超图国际";
          break;
        case "8416498716893399290":
          return "上海南康";
          break;
        case "-1814768306395265967":
          return "国图信息";
          break;
        case "7638091599462351621":
          return "世纪安图";
          break;
        case "-5099447302419035828":
          return "上海数慧";
          break;
        case "2257482669678084552":
          return "超图数据";
          break;
        case "-7975978055853456035":
          return "地图慧";
          break;
        default:
          return "";
      }
    },

    //模板 行切换变化时
    rowClick1(row) {
      //新需求：当前登录人只能编辑自己公司的模板
      this.templateCompanyId = row.company_id;
      this.tableData3 = []; //清空 交付物数据
      //获取里程碑数据
      if (row) {
        this.table1select = row;
        this.templateId = row.id; //模板id
        this.milestoneId = null; //里程碑id
        this.getTableData2(row.id); //获取里程碑数据
        this.table2status = true; //选中 才能添加里程碑
      }
    },

    //模板 行数据变化时
    contentChange(row) {
      row.contentChange = true; //记录改行被修改过
    },
    //提示信息
    warnMessage(message) {
      this.$message({
        showClose: true,
        message: message,
        type: "success"
      });
    },

    //里程碑模板列表 操作
    switchChange1(row) {
      row.contentChange = true; //记录改行被修改过
      if (row.status == 1) {
        this.warnMessage("模板 启用");
      } else {
        this.warnMessage("模板 停用");
      }
      //对已保存的数据 才实时更新到数据库
      if (row.id != "") {
        //更新到数据库
        var url = "/sgpm/rest/api/system/milestone/template";
        var data = [row];
        systemPostHttpMethod(url, data)
          .then(res => {
            if (res.data.code == 200) {
              // alert("更新成功")
            } else {
              alert("保存失败");
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //里程碑 是否可裁剪 开关
    switchChange2(row) {
      console.log(row);
      if (row.isCut == 1) {
        this.warnMessage("里程碑 可裁剪");
      } else {
        this.warnMessage("里程碑 不可裁剪");
      }
      //已保存的数据再更新数据库
      if (row.id == "") {
        return false;
      }
      //更新到数据库
      var url = "/sgpm/rest/api/system/milestone";
      //添加索引字段
      row["sortIndex"] = this.tableData2.indexOf(row) + 1;
      var data = [row];
      systemPostHttpMethod(url, data)
        .then(res => {
          if (res.data.code == 200) {
            // alert("保存成功");
          } else {
            alert("保存失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //交付物 是否可裁剪 开关
    switchChange3(row) {
      if (row.isCut == 1) {
        this.warnMessage("交付物 可裁剪");
      } else {
        this.warnMessage("交付物 不可裁剪");
      }
      //已保存的数据才更新到数据库
      if (row.id == "") {
        return false;
      }
      //更新到数据库
      var url = "/sgpm/rest/api/system/deliverable/add/or/update";
      var data = [row];
      systemPostHttpMethod(url, data)
        .then(res => {
          if (res.data.code == 200) {
            // alert("保存成功");
          } else {
            alert("保存失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //交付物 是否为审计 开关
    switchChange4(row) {
      if (row.auditDeliverable == 1) {
        this.warnMessage("是审计文档");
      } else {
        this.warnMessage("不是审计文档");
      }
      //已保存的数据才更新到数据库
      if (row.id == "") {
        return false;
      }
      //更新到数据库
      var url = "/sgpm/rest/api/system/deliverable/add/or/update";
      var data = [row];
      systemPostHttpMethod(url, data)
        .then(res => {
          if (res.data.code == 200) {
            // alert("保存成功");
          } else {
            alert("保存失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //里程碑数据 选中行变化时触发
    table2handleCurrentChange(row) {
      console.log(row);
      //获取交付物数据
      //解决重复请求--选中checkbox时
      if (row) {
        this.getTableData3(row.id);
        this.milestoneId = row.id;
      }
    },

    //里程碑 行拖拽,单行选中
    rowDrop(row) {
      console.log(row);
      this.table2select = row;
      //获取交付物数据
      //解决重复请求--选中checkbox时
      // this.getTableData3(row.id);
      // this.milestoneId = row.id;

      const tbody = document.querySelector(
        "#tableData2 .el-table__body-wrapper tbody "
      );
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData2.splice(oldIndex, 1)[0];
          _this.tableData2.splice(newIndex, 0, currRow);
        }
      });
    },

    //授权 保存
    handleSubmit() {
      var roleParams = {};
      var companyIds = ""; //公司id
      roleParams["milestoneTemplateId"] = this.templateId;
      //选集团时
      if (this.roleAllStatus) {
        this.roleData.forEach(role => {
          companyIds += role.accountId + ",";
        });
      }
      //不选集团时
      if (!this.roleAllStatus) {
        this.roleData.forEach(role => {
          if (role.checkedStatus) {
            companyIds += role.accountId + ",";
          }
        });
      }
      //去除最后一个","
      companyIds = companyIds.substr(0, companyIds.length - 1);
      roleParams["companyIds"] = companyIds;
      console.log(roleParams);

      this.dialogVisible = false;
      var url =
        "/sgpm/rest/api/system/milestone/template/authorization/add/update";
      systemPostHttpMethod(url, roleParams)
        .then(res => {
          if (res.data.code == 200) {
            // alert("保存成功");
            // this.getTableData1();//更新数据 更新后选中按钮 显示有bug
            //局部更新 角色数据
            this.multipleSelection1[0].companys = [];
            //选集团时
            if (this.roleAllStatus) {
              this.roleData.forEach(item => {
                var d = {
                  accountId: item.accountId,
                  account_name: item.account_name
                };
                this.multipleSelection1[0].companys.push(d);
              });
            }
            //不选集团时
            if (!this.roleAllStatus) {
              this.roleData.forEach(item => {
                if (item.checkedStatus) {
                  var d = {
                    accountId: item.accountId,
                    account_name: item.account_name
                  };
                  this.multipleSelection1[0].companys.push(d);
                }
              });
            }
          } else {
            alert("保存失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //获取 授权 公司数据
    getRoleData(roleId) {
      this.roleData = [];
      var url = "/sgpm/rest/api/system/milestone/template/accounts";
      systemGetHttpMethod(url)
        .then(res => {
          var data = res.data.data;
          //将已保存的角色 设置为选中状态
          data.forEach(item => {
            item["account_name"] = this.companyNameStr(item); //转换公司名称
            if (roleId.includes(item.accountId)) {
              item["status"] = 1;
            } else {
              item["status"] = 0;
            }
            this.roleData.push(item);
          });
          console.log(this.roleData);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 公司名称转为简写
    companyNameStr(row) {
      switch (row.accountId) {
        case "5326994013938795629":
          return "超图信息";
        case "-1360422574114386809":
          return "超图软件";
        case "-8234401961992436364":
          return "超图国际";
        case "8416498716893399290":
          return "上海南康";
        case "-1814768306395265967":
          return "国图信息";
        case "7638091599462351621":
          return "世纪安图";
        case "-5099447302419035828":
          return "上海数慧";
        case "2257482669678084552":
          return "超图数据";
        case "-7975978055853456035":
          return "地图慧";
        default:
          return "";
      }
    },

    //上传 操作
    // 上传文件变化值，获取文件流
    handleChange(file, fileList) {
      this.file = file.raw;
    },
    handleRemove(file, fileList) {
      // console.log(file);
    },
    //选文件时
    handleSelectFile(row) {
      if (row.id != "") {
        row.upload_status = false;
      } else {
        this.warnMessage("未保存不能上传");
      }
    },
    handleSelectFile2() {
      this.warnMessage("未保存不能上传");
    },

    handleAvatarSuccess(res, file) {},
    // 手动点击上传文件
    submitUpload(row) {
      console.log(row);

      // 实现多个文件一块上传
      if (this.$refs[row.id].uploadFiles.length == 0) {
        this.warnMessage("请选择文件");
        return false;
      }
      var file = this.$refs[row.id].uploadFiles[0].raw; //要上传的文件（获取单行的数据）

      var fileSize = file.size / 1024 / 1024;
      if (fileSize > 50) {
        this.warnMessage("文件太大，请选择50M以下的文件");
      } else {
        //清空文件列表
        this.$refs[row.id].clearFiles();
        // 点击上传按钮后，控制不可再点击
        row.upload_status = true;
        row.file_status = true;
        row.file_name = "上传中....";

        let param = new FormData();
        param.append("file", file);
        param.append("id", row.id);
        // 从localStoage获取登录人员公司信息
        var userinfo = JSON.parse(localStorage.getItem("userinfo"));
        if (userinfo) {
          var company = userinfo.account_name;
        }
        param.append("company", company);
        fileUpload(
          "/sgpm/rest/api/server/pm/project/deliverable/upload/template",
          param
        ).then(response => {
          console.log(response);
          if (response.data.code == 200) {
            // alert("上传成功");
            this.warnMessage("上传成功");
            //局部更新数据
            row.file_name = file.name;
            row.fileName = file.name; //解决 上传图片后 提交 文件名称没保存
            row.template_file_url = this.get_download_file_url(row);
          } else {
            alert("上传失败");
          }
          //上传操作后
          row.upload_status = true; //上传按钮不可点击
          row.file_status = false; //恢复选文件按钮可点击
        });
      }
    },

    //获取模板下载的url
    get_download_file_url(item) {
      //添加 模板下载url
      var userinfo = JSON.parse(localStorage.getItem("userinfo"));
      if (userinfo) {
        var company = userinfo.account_name;
      }
      var template_file_url = getDownLoadUrl(
        "/sgpm/rest/api/server/pm/project/deliverable/download/template?id=" +
          item.id +
          "&company=" +
          company
      );
      return template_file_url;
    },

    //选择框操作
    // 模板表格 设置单行选择
    selectChange1(row) {
      console.log(row);
      console.log(this.userinfo.account_id);
      //新需求：当前登录人只能编辑自己公司的模板
      this.templateCompanyId = row.company_id;
      if (this.userinfo.account_id != row.company_id) {
        this.warnMessage("请编辑自己公司的模板");
        row.checkedStatus = false;
        return false;
      }

      // 选中时只展开当前选中行数据
      this.rowExpands = [];
      if (row.checkedStatus) {
        this.rowExpands.push(row.id);
      } else {
        this.rowExpands = [];
      }

      this.tableData3 = []; //清空 交付物数据
      this.table3status = false;
      this.roleAllStatus = false;
      if (row.checkedStatus) {
        this.multipleSelection1.push(row);
        if (this.multipleSelection1.length == 2) {
          //新需求 上一行数据 修改时添加提示，是否保存上一条修改的记录
          var pre_data = this.multipleSelection1[0];
          console.log(pre_data);
          if (pre_data.contentChange) {
            this.$confirm("上次选择的模板未保存，确定保存吗？")
              .then(_ => {
                this.handleSave1([pre_data]); //保存上次未保存的数据
              })
              .catch(_ => {
                //恢复原数据
                pre_data.milestoneTemplateName = pre_data.field1; //恢复字段内容
                pre_data.type = pre_data.field2;
                pre_data.description = pre_data.field3;
                pre_data.status = pre_data.field4;
                pre_data.contentChange = false; // 恢复未修改状态
              });
          }
          this.multipleSelection1[0].checkedStatus = false;
          this.multipleSelection1.splice(0, 1);
        }
      } else {
        this.multipleSelection1.splice(this.multipleSelection1.indexOf(row), 1);
        //当前行取消选中状态时 如果改行修改了 添加判断
        console.log(row);
        if (row.contentChange) {
          this.$confirm("选择的模板未保存，确定保存吗？")
            .then(_ => {
              this.handleSave1([row]); //保存未保存的数据
            })
            .catch(_ => {
              //恢复原数据
              row.milestoneTemplateName = row.field1; //恢复字段内容
              row.type = row.field2;
              row.description = row.field3;
              row.status = row.field4;
              row.contentChange = false; // 恢复未修改状态
            });
        }
      }
      //选中一行 且改行数据已保存时 才能点 授权
      if (
        this.multipleSelection1.length > 0 &&
        this.multipleSelection1[0].id != ""
      ) {
        this.table1status = true;
        this.addStatus = true; //不能新建
      } else {
        this.table1status = false;
        this.addStatus = false;
      }

      //获取里程碑数据
      if (
        this.multipleSelection1.length > 0 &&
        this.multipleSelection1[0].id != ""
      ) {
        // this.templateId = this.multipleSelection1[0].id;
        // this.getTableData2(this.multipleSelection1[0].id);
        // this.table2status = true; //选中一条记录 才能添加里程碑

        //根据选中的数据，修改roleData数据
        // 先获取已保存的role数据
        var savedRole = this.multipleSelection1[0].companys;
        console.log(savedRole);
        if (savedRole.length > 0) {
          this.roleId = []; //先清空原公司已保存的id数据
          savedRole.forEach(item => {
            this.roleId.push(item.accountId);
          });
        } else {
          this.roleId = [];
        }
      } else {
        // this.tableData2 = []; //清空数据
        // this.roleId = [];
        // this.templateId = "";
        // this.table2status = false;
      }

      //重新获取授权公司数据
      this.getRoleData(this.roleId);
    },

    //里程碑数据 设置单行选择
    selectChange2(row) {
      //新需求：当前登录人只能编辑自己公司的模板
      if (this.userinfo.account_id != this.templateCompanyId) {
        this.warnMessage("请编辑自己公司的里程碑");
        row.checkedStatus = false;
        return false;
      }

      if (row.checkedStatus) {
        this.multipleSelection2.push(row);
        if (this.multipleSelection2.length == 2) {
          this.multipleSelection2[0].checkedStatus = false;
          this.multipleSelection2.splice(0, 1);
        }
      } else {
        this.multipleSelection2.splice(this.multipleSelection2.indexOf(row), 1);
      }
      //获取交付物数据
      if (this.multipleSelection2.length > 0) {
        this.milestoneId = this.multipleSelection2[0].id;
        // this.getTableData3(this.multipleSelection2[0].id); //选中选择框时 获取交付物数据 请求重复
        this.table3status = true; //选中一条记录 才能添加里程碑
      } else {
        // this.tableData3 = []; //清空数据
        // this.milestoneId = "";
        // this.table3status = false;
      }
    },

    //交付物数据 设置单行选择
    selectChange3(row) {
      //新需求：当前登录人只能编辑自己公司的数据
      if (this.userinfo.account_id != this.templateCompanyId) {
        this.warnMessage("请编辑自己公司的交付物");
        row.checkedStatus = false;
        return false;
      }

      if (row.checkedStatus) {
        this.multipleSelection3.push(row);
        if (this.multipleSelection3.length == 2) {
          this.multipleSelection3[0].checkedStatus = false;
          this.multipleSelection3.splice(0, 1);
        }
      } else {
        this.multipleSelection3.splice(this.multipleSelection3.indexOf(row), 1);
      }
    },

    //获取模板 类型枚举数据
    getTypeData() {
      var url = "/sgpm/rest/api/system/milestone/template/type";
      systemGetHttpMethod(url)
        .then(res => {
          console.log(res.data.data);
          this.typeData.options = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取模板 表格数据
    getTableData1() {
      this.loading = true;
      this.tableData1 = [];
      this.tableData = [];
      this.multipleSelection1 = [];
      this.table1status = false; //授权不可点
      var memberId = this.userinfo.memberid; //建立者id
      // var url = "/sgpm/rest/api/system/milestone/template/list?memberId=" + memberId;

      //添加分页
      var url =
        "/sgpm/rest/api/system/milestone/template/list/" +
        this.page.pageNum +
        "/" +
        this.page.pageSize;
      systemGetHttpMethod(url)
        .then(res => {
          console.log(res.data.data);
          if (res.data.code == 200) {
            this.loading = false;
            res.data.data.forEach(item => {
              item["contentStatus"] = false; //添加字段 记录改行是否修改过
              item["field1"] = item.milestoneTemplateName; //备份字段
              item["field2"] = item.type;
              item["field3"] = item.description;
              item["field4"] = item.status;
              item["company_id"] = item.createrCompanyId; //公司id 新增字段 判断
              if (item.createrCompanyId == this.userinfo.account_id) {
                item["editStatus"] = false; //可编辑
              } else {
                item["editStatus"] = true; //不可编辑
              }
              //转换公司名称
              item.companys.forEach(com => {
                com["account_name"] = this.companyNameStr(com);
              });
              // if(this.multipleSelection1[0] && this.multipleSelection1[0].id == item.id){
              //   item["checkedStatus"]=true;
              // }
            });
            this.tableData1 = res.data.data;
            this.page.total = res.data.meta.totalCount; //添加分页
            this.table1select = res.data.data[0]; //将第一个数据作为行选中数据
            // this.table2status=true;
          } else {
            alert("请求失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //根据模板id  获取里程碑数据
    getTableData2(id) {
      this.tableData2 = [];
      this.multipleSelection2 = [];
      if (!id) {
        return false;
      }
      //新增 角色判断
      if (this.templateCompanyId == this.userinfo.account_id) {
        var editStatus = false; //可编辑
      } else {
        var editStatus = true; //不可编辑
      }
      // console.log("=====获取里程碑数据=====");
      var url = "/sgpm/rest/api/system/milestone/list/" + id;
      systemGetHttpMethod(url)
        .then(res => {
          res.data.data.forEach(item => {
            item["isCut"] = item.isCut + "";
            item["editStatus"] = editStatus;
          });
          this.tableData2 = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //根据里程碑id  获取交付物数据
    getTableData3(id) {
      this.tableData3 = [];
      if (!id) {
        return false;
      }
      //新增 角色判断
      if (this.templateCompanyId == this.userinfo.account_id) {
        var editStatus = false;
      } else {
        var editStatus = true;
      }

      var url = "/sgpm/rest/api/system/deliverable/list/" + id;
      systemGetHttpMethod(url)
        .then(res => {
          res.data.data.forEach(item => {
            item["milestoneId"] = this.milestoneId;
            item["file_status"] = false; //选文件按钮，默认可点
            item["upload_status"] = true; //上传按钮，默认不可点
            item["fileList"] = []; //上传文件列表 新增字段
            item["isCut"] = item.isCut + ""; //修改为字符串类型
            item["editStatus"] = editStatus; //新增字段 角色判断

            //修改文件名
            if (item.fileName) {
              // var arrNmaes = item.fileName.split(".");
              // var b3 = arrNmaes[0].slice(0, -32);
              // var fileName = b3 + "." + arrNmaes[1];
              item["file_name"] = item.fileName;
              //添加 模板下载url
              var userinfo = JSON.parse(localStorage.getItem("userinfo"));
              if (userinfo) {
                var company = userinfo.account_name;
              }
              var template_file_url = getDownLoadUrl(
                "/sgpm/rest/api/server/pm/project/deliverable/download/template?id=" +
                  item.id +
                  "&company=" +
                  company
              );
              item["template_file_url"] = template_file_url; //模板下载地址
            } else {
              item["file_name"] = "";
            }
            this.tableData3.push(item);
            console.log(this.tableData3);
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    //删除操作 模板删除
    handleDelete1(row) {
      if (row.id) {
        //删除数据库中的数据
        this.$confirm("确定要删除里程碑模板吗？")
          .then(_ => {
            var url = "/sgpm/rest/api/system/milestone/template/" + row.id;
            systemDeleteHttpMethod(url)
              .then(res => {
                if (res.data.code == 200) {
                  // alert('删除成功');
                  this.getTableData1(); //更新表格数据
                } else {
                  alert("删除失败");
                }
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(_ => {});
      } else {
        //删除页面中的数据
        var index = this.tableData1.indexOf(row);
        this.tableData1.splice(index, 1); //去掉当前数据 index删除的开始下标 1 删除的个数
        this.multipleSelection1 = []; //清空选择的数据
        this.table2status = false; //里程碑不能新建
        this.addStatus = false; //模板可以新建
      }
    },
    //里程碑 删除
    handleDelete2(row) {
      if (!row) {
        this.warnMessage("请先选择一个里程碑");
        return false;
      }

      if (row.id) {
        //删除数据库中的数据
        this.$confirm("确定要删除里程碑吗？")
          .then(_ => {
            var url = "/sgpm/rest/api/system/milestone/" + row.id;
            systemDeleteHttpMethod(url)
              .then(res => {
                if (res.data.code == 200) {
                  // alert('删除成功');
                  this.getTableData2(this.templateId); //更新表格数据
                  this.milestoneId = null; //清除里程碑id
                } else {
                  alert("删除失败");
                }
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(_ => {});
      } else {
        //删除页面中的数据
        var index = this.tableData2.indexOf(row);
        this.tableData2.splice(index, 1); //去掉当前数据 index删除的开始下标 1 删除的个数
        this.multipleSelection2.splice(index, 1);
      }
    },
    handleDelete3(row) {
      if (!row) {
        this.warnMessage("请先选择一个交付物");
        return false;
      }
      if (row.id) {
        //删除数据库中的数据
        this.$confirm("确定要删除交付物吗？")
          .then(_ => {
            var url = "/sgpm/rest/api/system/deliverable/" + row.id;
            systemDeleteHttpMethod(url)
              .then(res => {
                if (res.data.code == 200) {
                  // alert('删除成功');
                  this.getTableData3(this.milestoneId); //更新表格数据
                } else {
                  alert("删除失败");
                }
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(_ => {});
      } else {
        //删除页面中的数据
        var index = this.tableData3.indexOf(row);
        this.tableData3.splice(index, 1); //去掉当前数据 index删除的开始下标 1 删除的个数
      }
    },

    //获取当前日期
    getNowDate() {
      var date = new Date();
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      var dateTime = year + "-" + month + "-" + day;
      return dateTime;
    },

    //判断字符串是否为空
    isEmpty(obj) {
      if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
      } else {
        return false;
      }
    },

    //检查表格 数据是否为空
    checkTable1Params(tableData) {
      var flag = true;
      tableData.forEach(item => {
        if (this.isEmpty(item.milestoneTemplateName)) {
          flag = false;
        }
        if (this.isEmpty(item.type)) {
          flag = false;
        }
      });
      return flag;
    },
    checkTable2Params(tableData) {
      var flag = true;
      tableData.forEach(item => {
        //里程碑字段
        if (this.isEmpty(item.stageName)) {
          flag = false;
        }
        if (this.isEmpty(item.milestoneName)) {
          flag = false;
        }
      });
      return flag;
    },
    checkTable3Params(tableData) {
      var flag = true;
      tableData.forEach(item => {
        //交付物字段
        if (this.isEmpty(item.deliverableName)) {
          flag = false;
        }
        if (this.isEmpty(item.description)) {
          flag = false;
        }
      });
      return flag;
    },

    //保存操作,只保存当前选中的数据
    handleSave1(arr1) {
      if (arr1.length == 0) {
        this.warnMessage("请先编辑一个模板");
        return false;
      }
      var url = "/sgpm/rest/api/system/milestone/template";
      //对数据添加非空验证
      // var flag = this.checkTable1Params(this.tableData1);
      var flag = this.checkTable1Params(arr1);
      if (!flag) {
        this.warnMessage("模板名称、类型 不能为空");
        return false;
      }
      // var data = this.tableData1;
      var data = arr1;
      systemPostHttpMethod(url, data)
        .then(res => {
          if (res.data.code == 200) {
            // alert("保存成功");
            this.getTableData1();
            this.tableData2 = [];
            this.tableData3 = [];
            this.addStatus = false; //保存后可以新建
            this.table2status = false;
            this.templateId = null; //保存后重新选择模板
          } else {
            alert("保存失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //里程碑 保存更新
    handleSave2() {
      //新增 角色判断
      if (this.templateCompanyId != this.userinfo.account_id) {
        this.$message.warning("请编辑自己公司的里程碑");
        return false;
      }

      if (this.tableData2.length == 0) {
        this.$message.warning("请先编辑里程碑");
        return false;
      }
      var url = "/sgpm/rest/api/system/milestone";
      //对数据添加非空验证
      var flag = this.checkTable2Params(this.tableData2);
      if (!flag) {
        this.$message.warning("阶段名称、里程碑名称 不能为空");
        return false;
      }
      //添加排序索引
      for (var i = 0; i < this.tableData2.length; i++) {
        var item = this.tableData2[i];
        item["sortIndex"] = i + 1;
      }
      var data = this.tableData2;
      systemPostHttpMethod(url, data)
        .then(res => {
          if (res.data.code == 200) {
            // alert("保存成功");
            this.getTableData2(this.templateId); //更新表格数据
            this.tableData3 = [];
          } else {
            alert("保存失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //交付物 保存更新
    handleSave3() {
      if (this.tableData3.length == 0) {
        this.warnMessage("请先新建或编辑交付物");
        return false;
      }

      var url = "/sgpm/rest/api/system/deliverable/add/or/update";
      //对数据添加非空验证
      var flag = this.checkTable3Params(this.tableData3);
      if (!flag) {
        // alert("文档名称、文档描述 不能为空");
        this.warnMessage("文档名称、文档描述 不能为空");
        return false;
      }
      var data = this.tableData3;
      systemPostHttpMethod(url, data)
        .then(res => {
          if (res.data.code == 200) {
            // alert("保存成功");
            this.getTableData3(this.milestoneId); //更新表格数据
          } else {
            alert("保存失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //添加操作 模板添加
    handleAdd1() {
      console.log(this.tableData1[0]);
      //bug 没数据时会报错
      if (this.tableData1[0] && this.tableData1[0].id == "") {
        this.warnMessage("请先编辑保存第一条记录");
        return false;
      }
      var item = {
        milestoneTemplateName: "",
        description: "",
        id: "",
        createName: this.userinfo.emp_name, //建立者名称
        createId: this.userinfo.memberid, //建立者id
        createDate: this.getNowDate(), //建立时间
        createrCompanyId: this.userinfo.account_id, //建立者所在公司id 新增字段
        company_id: this.userinfo.account_id, //建立者所在公司id 新增字段
        type: "",
        checkedStatus: true
      };
      // this.tableData1.push(item);
      this.tableData1.unshift(item); //从头部添加元素
      this.multipleSelection1.push(item);
      this.addStatus = true;
    },

    //里程碑添加
    handleAdd2() {
      //新增 角色判断
      if (this.templateCompanyId != this.userinfo.account_id) {
        this.warnMessage("请选择自己公司的里程碑模板");
        return false;
      }

      if (!this.templateId) {
        this.warnMessage("请选择一个已保存的模板");
        return false;
      }
      var item = {
        id: "",
        stageName: "",
        milestoneName: "",
        progressPercentage: "5",
        isCut: "0",
        description: "",
        milestoneTemplateId: this.templateId, //模板id
        checkedStatus: true //默认新建 编辑状态
      };
      this.tableData2.push(item);
      this.multipleSelection2.push(item);
    },

    //交付物添加
    handleAdd3() {
      //新增 角色判断
      if (this.templateCompanyId != this.userinfo.account_id) {
        this.warnMessage("请选择自己公司的里程碑");
        return false;
      }

      // console.log("里程碑id：" + this.milestoneId);
      if (!this.milestoneId) {
        this.warnMessage("请先选择一个已保存的里程碑");
        return false;
      }
      var item = {
        id: "",
        deliverableName: "",
        isCut: "0",
        auditDeliverable: "0", //是否审计文档 新增字段
        description: "",
        milestoneId: this.milestoneId,
        file_status: true, //新增的数据 不能上传
        upload_status: true,
        checkedStatus: true //默认新建 编辑状态
      };
      this.tableData3.push(item);
    },

    //移除角色标签
    handleClose(tag) {
      console.log(tag);
      if (!this.table1status) {
        // alert("请先选择一个模板");
        this.warnMessage("请先选择一个模板");
        return false;
      }
      var current_row = this.multipleSelection1[0];
      //只有一个角色时添加提示不让删除
      // if (current_row.roles.length == 1) {
      //   this.warnMessage("请至少保留一个角色");
      //   return false;
      // }
      current_row.companys.splice(current_row.companys.indexOf(tag), 1); //移除选择的公司
      // console.log(this.multipleSelection1);
      var companyIds = "";
      if (current_row.companys.length > 0) {
        current_row.companys.forEach(item => {
          companyIds += item.accountId + ",";
        });
        companyIds = companyIds.substr(0, companyIds.length - 1);
      }
      var roleParams = {
        milestoneTemplateId: current_row.id,
        companyIds: companyIds
      };
      console.log(roleParams);
      var url =
        "/sgpm/rest/api/system/milestone/template/authorization/add/update";
      systemPostHttpMethod(url, roleParams)
        .then(res => {
          if (res.data.code !== 200) {
            return alert("更新失败");
          }
          //更新授权公司数据
          this.getRoleData(companyIds.split(","));
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style>
/*输入框文本内容居中*/
.milestoneTemplate .el-input__inner {
  text-align: center;
}

/*选中行背景色*/
.milestoneTemplate .el-table__body tr.current-row > td {
  background: #dee5ed !important;
}
</style>

<style scoped>
.el-tag + .el-tag {
  /*margin-left: 5px;*/
  margin-top: 5px;
}
.el-tag {
  margin-right: 10px;
}
.pname {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.page {
  margin: 20px 0 0 0;
}

.right {
  float: right;
}

.isEdit {
  /*color: #f56c6c;*/
  color: #409eff;
}
</style>
