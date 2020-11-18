<template>
  <div class="list-container-doc">
    <div class="header">
      <el-form ref="form" :model="form" :inline="true" label-width="60px" class="list-form">
        <el-row :gutter="5" type="flex" justify="space-between" class="one-row"></el-row>
        <el-row :gutter="5" type="flex" justify="space-between" class="headertit">
          <el-col :md="10" :xl="9" :sm="10" :lg="8">
            <el-form-item label="查看范围">
              <el-select v-model="form.dicName" size="mini" @change="selectChange">
                <el-option :label="item.dicName" :value="item.dicCode" v-for="item in selectAry" :key="item.dicCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="14" :xl="9" :sm="14" :lg="14">
            <div class="header-search">
              <el-form-item>
                <el-input v-model="form.keyWord" placeholder="合同编号/项目编号/项目名称/上传文档名称/上传人/" size="mini">
                  <el-button slot="append" icon="el-icon-search" @click="keyWordSearch">
                    <!-- <i class="icon-search"></i> -->
                  </el-button>
                </el-input>
              </el-form-item>
              <el-button type="primary" :disabled="isDownload" @click="download" class="download" size="mini">
                <i class="el-icon-download">下载</i>
              </el-button>
              <el-button type="primary" size="mini" circle class="circle-btn" @click="clearFilter" :disabled="isCheck">
                审批</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="mini" circle class="circle-btn"
                @click="clearRefresh"></el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%;margin-bottom: 10px;" class="father-pro-table" highlight-current-row
      border :max-height="asideHeight" ref="refTable" v-loading="tableLoading" :header-cell-style="{
        fontSize: '14px',
        color: '#303133',
        height: '51px',
        padding: 0,
        backgroundColor: '#ccd1d5'
      }" :row-style="{ height: '50px' }" :cell-style="{ padding: 0 }" @cell-click="handleCell" @select="selectHandle"
      @select-all="selectAllHandle">
      <el-table-column type="selection" align="center" width="40"></el-table-column>
      <el-table-column prop="index" type="index" width="40" label="序号"></el-table-column>
      <el-table-column width="40" label="优秀" align="center">
        <template slot-scope="scope">
          <i class="iconfont iconzan" :class="{
              'el-icon-star-on': isGoods ? isGoods : scope.row.goods,
              startGreen: isGoods ? isGoods : scope.row.goods
            }"></i>
        </template>
      </el-table-column>
      <el-table-column width="140" prop="projectNumber" label="项目编号" align="center">
        <template slot-scope="scope">
          <p>
            {{ scope.row.projectNumber == "" ? "--" : scope.row.projectNumber }}
          </p>
        </template>
      </el-table-column>
      <el-table-column width="190" prop="contractNumber" label="合同编号" align="center">
        <template slot-scope="scope">
          <p>
            {{ scope.row.contractNumber == "" ? "--" : scope.row.contractNumber }}
          </p>
        </template>
      </el-table-column>
      <el-table-column width="90" label="项目名称" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <a href="javascript:void(0);">{{ scope.row.projectName == "" ? "--" : scope.row.projectName }}</a>
        </template>
      </el-table-column>
      <el-table-column width="130" prop="projectMilestoneName" label="里程碑名称" align="center">
        <template slot-scope="scope">
          <p>
            {{
              scope.row.projectMilestoneName == ""
                ? "--"
                : scope.row.projectMilestoneName
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column width="120" label="上传文档名称" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- scope.row.companyId scope.row.companyName -->
          <!-- :href="`${downloadhttp}?id=${scope.row.companyId}&company=${scope.row.companyName}`" -->
          <!-- href="http://192.168.102.101:11104/sgpm/rest/api/server/pm/project/deliverable/download?id=176647&company=南京国图信息产业有限公司" -->

          <a style="cursor: pointer;color:#409EFF" :href="
              `${downloadhttp}?id=${scope.row.id}&company=${scope.row.companyName}`
            " download title="下载">{{ scope.row.fileName == "" ? "--" : scope.row.fileName }}</a>
        </template>
      </el-table-column>
      <el-table-column width="130" prop="deliverableName" align="center" label="对应里程碑文档">
        <template slot-scope="scope">
          <p>
            {{
              scope.row.deliverableName == "" ? "--" : scope.row.deliverableName
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column width="80" prop="deliverableStatus" label="审核状态" align="center">
        <template slot-scope="scope">
          <p>
            {{
              scope.row.deliverableStatus == ""
                ? "--"
                : scope.row.deliverableStatus
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column width="260" prop="auditName" label="审核人" align="center" >
        <template slot-scope="scope" >
          <span >{{scope.row.auditName==''?'--':scope.row.auditName}}</span> 
          <!-- <el-tooltip placement="top" v-if="scope.row.isPmo"  :content="scope.row.auditName"> 
            <i class="el-icon-view"></i>
          </el-tooltip>
          <span v-else>{{scope.row.auditName==''?'--':scope.row.auditName}}</span> -->
        </template>

      </el-table-column>
      <el-table-column width="70" prop="uploadPeopleName" label="上传人" align="center">
        <template slot-scope="scope">
          <p>
            {{
              scope.row.uploadPeopleName == ""
                ? "--"
                : scope.row.uploadPeopleName
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column width="170" prop="implDepartmentBName" label="实施B级单位" align="center">
        <template slot-scope="scope">
          <p>
            {{
              scope.row.implDepartmentBName == ""
                ? "--"
                : scope.row.implDepartmentBName
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column width="100" prop="uploadDate" label="上传时间" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.uploadDate == "" ? "--" : scope.row.uploadDate }}</p>
        </template>
      </el-table-column>
      <el-table-column width="80" prop="fileSize" label="大小" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.fileSize == "" ? "--" : scope.row.fileSize }}</p>
        </template>
      </el-table-column>
      <el-table-column width="90" align="center" prop="auditDeliverable" label="审计所需" :filters="[
          { text: '是', value: '1' },
          { text: '否', value: '0' }
        ]" :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope">
          <p>
            {{
              scope.row.auditDeliverable == "0"
                ? "否"
                : scope.row.auditDeliverable == "1"
                ? "是"
                : ""
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column width="80" align="center" label="审核意见">
        <template slot-scope="scope">
          <i @click="opinionyj(scope.row.id)" class="el-icon-document pendings"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="page right">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="1"
        :page-sizes="[20]" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount">
      </el-pagination>
    </div>
    <el-dialog title="审批" @close="closeExamine" v-dialogDrag :visible.sync="examineDialog" style="text-algin:left;"
      class="dialog" width="55%">
      <div class="dialoglef">
        <el-table :data="tableData1" :row-style="{ height: '50px' }" :cell-style="{ padding: 0 }" style="width: 70%"
          border>
          <el-table-column prop="role" label width="150">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.role }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label width="220">
            <template slot-scope="scope">
              <div style="display:inline-block" v-for="(item, index) in scope.row.content" :key="index">
                <span style="margin:2px 0;">{{ item.msgText }}</span>
                <div>
                  <!-- <span style="margin-right:10px">{{item.ensure}}:</span> -->
                  <span style="margin-right:10px">是否完成:</span>
                  <el-radio v-model="item.model" label="1" :disabled="item.disabled">是</el-radio>
                  <el-radio v-model="item.model" label="0" :disabled="item.disabled">否</el-radio>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label>
            <template slot-scope="scope">
              <span style="display:block">审批人：{{ scope.row.user.userName }}</span>
              <span style="display:block">日期：{{ scope.row.user.date }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="final">
          <el-radio v-model="agree" label="1">同意</el-radio>
          <el-radio v-model="agree" label="0">不同意</el-radio>
          <textarea autocomplete="off" rows="6" placeholder v-model="opinion" class="el-textarea__inner"></textarea>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()" size="small">取消</el-button>
        <el-button type="primary" @click="present()" size="small">提交</el-button>
      </span>
    </el-dialog>

    <!-- 点击按钮获取审核意见 -->
    <el-dialog title="审核意见" v-dialogDrag :visible.sync="opinionDialog" style="text-algin:left" class="dialog"
      width="45%">
      <el-table :data="opinionData" style="width: 100%" class="father-pro-table" highlight-current-row border
        :header-cell-style="{
          fontSize: '14px',
          color: '#303133',
          height: '34px',
          padding: 0,
          backgroundColor: '#ccd1d5'
        }" :row-style="{ height: '34px' }" :cell-style="{ padding: 0 }" ref="refTable" v-loading="tableLoading">
        <el-table-column prop="auditRole" label="审核角色" align="center"></el-table-column>
        <el-table-column prop="auditName" label="审核人" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.auditName == "" ? "--" : scope.row.auditName }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="auditComment" label="审核意见" align="center"></el-table-column>
        <el-table-column prop="auditTime" label="审核时间" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// 循环下载文档
export const downloadFile = url => {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none"; // 防止影响页面
  iframe.style.height = 0; // 防止影响页面
  iframe.src = url;
  document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
  // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
  setTimeout(() => {
    iframe.remove();
  }, 5 * 60 * 1000);
};
import { mapState, mapActions } from "vuex";
import {
  documentationItem,
  examine,
  examinetj,
  examinationReport,
  excellent
} from "../../api/api.js";
import api from "../../api/index";
import axios from "axios";
import { FormatTime } from "../../util/index.js";

export default {
  name: "pendingDocument",
  props: ["widget", "models", "rules", "remote", "datas"],
  data() {
    return {
      tableData: [],
      currentPage: 1,
      isGoods: null,
      isDownload: true, //下载
      isCheck: true, //审核按钮
      tableLoading: false, //表格弹框
      form: {
        dicName: "waitMe", //查看范围数据
        keyWord: "" //搜索
      },
      // company:this.tableData.companyName,
      downloadhttp:
        api.urlPort04 + "/sgpm/rest/api/server/pm/project/deliverable/download", //链接地址
      selectAry: [
        { dicName: "待我审核的文档", dicCode: "waitMe" },
        { dicName: "我上传的文档", dicCode: "uploadPeople" },
        { dicName: "我管理项目的文档", dicCode: "user" },
        { dicName: "我管理部门的文档", dicCode: "supervise" }
        // { dicName: "审计所需文档", dicCode: "audit" }
      ], //查看范围
      examineDialog: false, //审批弹框
      opinionDialog: false, //审核弹框
      opinionData: [], //审核意见
      tableData1: [
        {
          role: "项目经理意见",
          content: [
            {
              msgText: "审核文档已按要求完成",
              model: "1",
              disabled: true
            }
          ],
          user: { date: "2010-2-3", userName: "张三" }
        },
        {
          role: "部门经理意见",
          content: [
            {
              msgText: "审核文档已按要求完成",
              model: "1",
              ensure: "是否完成"
            }
          ],
          user: { date: "2010-2-3", userName: "张三" },
          auditComment: ""
        },
        {
          role: "公司PMO专员意见",
          content: [
            {
              msgText: "审核文档是否规范、完成",
              model: "1",
              ensure: "是否通过"
            }
          ],
          user: { date: "2010-2-3", userName: "张三" },
          auditComment: ""
        },
        {
          role: "集团PMO专员意见",
          content: [
            {
              msgText: "审核文档是否规范、完成",
              model: "1",
              ensure: "是否通过"
            }
          ],
          user: { date: "2010-2-3", userName: "张三" },
          auditComment: ""
        }
      ], //审核显示字段
      agree: "1", //是否同意
      opinion: "", //审核建议输入框
      page: {
        //当前页
        pageNo: 1,
        //每页显示条数
        pageSize: 20,
        totalCount: 0
      },
      selectionLen: [], //判断是否选中
      approve: {
        deliveraId: "", //交付物id
        companyName: "" //文档名称
      },
      downloadListIds: [], //定义选择的id集合
      orderAttachment: []
    };
  },
  watch: {
    datas: {
      deep: true,
      handler: function(val) {}
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化列表
    init() {
      this.tableLoading = true;
      let params = {
        memberId: this.userinfo.memberid,
        pageNum: 1,
        pageSize: 20,
        code: "waitMe" //默认待我审核文档
      };
      this.defaultTable(params);
      // documentationItem("/sgpm/rest/api/server/pm/project/deliverable", params)
      //   .then(res => {
      //     if (res.data.code == 200) {
      //       this.tableLoading = false;
      //       this.tableData = res.data.data;
      //       this.page = res.data.meta;
      //     }
      //   })
      //   .catch(err => {});
    },
    onSubmit() {
      // console.log("submit!");
    },
    formatter(row, column) {
      return row.address;
    },
    // 审计所需
    filterTag(value, row, column) {
      // console.log(column.filteredValue.length)
      if (column.filteredValue.length != 0) {
        // console.log(value);
        let params = {
          memberId: this.userinfo.memberid,
          pageNum: 1,
          pageSize: 20,
          code: this.form.dicName,
          keyWord: this.form.keyWord.trim(),
          auditDeliverable: value
        };
        this.defaultTable(params);
        this.$refs.refTable.clearFilter();
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.tableLoading = true;
      if (this.form.keyWord == "") {
        var params = {
          memberId: this.userinfo.memberid,
          code: this.form.dicName,
          pageNum: val,
          pageSize: this.page.pageSize
        };
      } else {
        var params = {
          memberId: this.userinfo.memberid,
          pageNum: val,
          pageSize: this.page.pageSize,
          code: this.form.dicName,
          keyWord: this.form.keyWord
        };
      }
      this.defaultTable(params);
    },
    handleCell(row, column, cell, event) {
      if(row.goods==0){
        row.goods = 1
      }else{
        row.goods = 0
      }
      if (cell.cellIndex === 2) {
        if (row.goods==0) {
          // this.$notify({
          //   title: "取消优秀文档",
          //   duration: 8000
          // });
          cell.firstChild.firstChild.className = "el-icon-star-on startGrey";
        } else {
          // this.$notify({
          //   title: "优秀文档",
          //   duration: 8000
          // });
          cell.firstChild.firstChild.className = "el-icon-star-on startGreen";
        }
      }
      excellent(`/sgpm/rest/api/server/pm/project/deliverable/${row.id}?fileType=${row.fileType}&goods=${row.goods}`, null)
          .then(res => {
            if (res.data.code == 200) {

              let params = {
                memberId: this.userinfo.memberid,
                pageNum: 1,
                pageSize: 20,
                code: this.form.dicName,
                keyWord: this.form.keyWord.trim()
              };
              this.defaultTable(params);
            }
          })
          .catch(err => {
            console.log(err);
          });
    },
    //勾选列表的多选框触发方法
    selectHandle(selection, row) {
      if (
        selection.length != 0 &&
        row.processId != "" &&
        row.deliverableStatus != "审核通过" &&
        row.deliverableStatus != "驳回" &&
        row.auditName.indexOf(this.userinfo.emp_name) != -1
      ) {
        this.isCheck = false;
      } else {
        this.isCheck = true;
      }
      // console.log(this.isDownload)
      if (selection.length != 0) {
        this.isDownload = false;
      } else {
        // this.isCheck = true;
      }

      this.selectionLen = selection; //是否选中
      this.approve.deliveraId = row.id; //交付物id
      this.approve.processId = row.processId; //流程id
      this.approve.companyName = row.companyName; //文档名称
      // var downloadListIdsTy = this.downloadListIds;
      this.downloadListIds = selection;

      // console.log(this.downloadListIds)
    },
    //勾选全选触发方法
    selectAllHandle(selection) {
      this.selectionLen = selection; //是否选中
      if (selection.length != 0) {
        this.isDownload = false;
      } else {
        // this.isCheck = true;
      }
      this.downloadListIds = selection;
    },

    //条件搜索
    keyWordSearch() {
      this.tableLoading = true;
      let params = {
        memberId: this.userinfo.memberid,
        pageNum: 1,
        pageSize: 20,
        code: this.form.dicName,
        keyWord: this.form.keyWord.trim()
      };
      this.defaultTable(params);
    },
    // 调用列表接口
    defaultTable(params) {
      documentationItem("/sgpm/rest/api/server/pm/project/deliverable", params)
        .then(res => {
          if (res.data.code == 200) {
            this.tableLoading = false;
            this.page = res.data.meta;
            let result = res.data.data
            // let tableList = result.map((item)=>{
            //   if(item.auditName.indexOf(',')>-1){
            //      item["isPmo"] = true
            //      return item
            //   }else{
            //     item["isPmo"] = false
            //     return item
            //   }
            // })
            this.tableData = result
          }
        })
        .catch(err => {});
    },
    //刷新
    clearRefresh() {
      this.form.dicName = "waitMe";
      this.form.keyWord = "";
      this.$refs.refTable.clearSelection(); //置空选项
      this.tableLoading = true;
      let params = {
        memberId: this.userinfo.memberid,
        pageNum: 1,
        pageSize: 20,
        code: "waitMe" //默认待我审核文档
      };
      this.defaultTable(params);
    },
    // 查看范围
    selectChange() {
      this.tableLoading = true;
      if (this.form.dicName == "waitMe") {
        this.isCheck = false;
      } else {
        this.isCheck = true;
      }
      let params = {
        memberId: this.userinfo.memberid,
        code: this.form.dicName,
        pageNum: 1,
        pageSize: 20
      };
     this.defaultTable(params);
    },
    // 审批
    clearFilter() {
      if (this.selectionLen.length == 0) {
        this.$notify({
          title: "请选择审批文档",
          duration: 9000
        });
      } else if (this.selectionLen.length > 1) {
        this.$notify({
          title: "暂不支持批量审批",
          duration: 9000
        });
      } else if (this.selectionLen.length == 1) {
        // debugger;
        // console.log(this.approve.processId);
        this.examineDialog = true; //显示审核弹框
        let params = {
          //  accountId :"-1814768306395265967",
          accountId: this.userinfo.account_id,
          processId: this.approve.processId, //流程id
          type: 6
        };
        examine("/sgpm/rest/api/integration/audit/record", params)
          .then(res => {
            if (res.data.code == 200) {
              let resultData = res.data.data;
              let result = JSON.parse(JSON.stringify(resultData));
              let ary = result.forEach(item => {
                //如果是modify为0 不可编辑
                if (item.modify == 0) {
                  item.content.forEach(jtem => {
                    jtem["disabled"] = true;
                  });
                  item["isAuditComment"] = true;
                } else {
                  item.user.userName = this.userinfo.emp_name;
                }
              });
              this.tableData1 = result;
            }
          })
          .catch(err => {});
      }
    },
    closeExamine() {
      this.opinion = "";
      this.agree = "1"
    },
    // 审核取消
    cancel() {
      this.examineDialog = false; //隐藏审核弹框
    },
    // 审核提交
    present() {
      if (this.agree == 0 && this.opinion == "") {
        this.$notify.info({
          title: "请输入审核意见",
          duration: 8000
        });
      } else {
        let param = {};
        let list = JSON.parse(JSON.stringify(this.tableData1));
        // console.log(this.opinion)
        list.forEach(item => {
          if (item.modify == 1) {
            // isAudit
            param = item;
            if (this.agree == 1) {
              param.isAudit = 1;
            } else if (this.agree == 0) {
              param.isAudit = 0;
            }
            param.auditComment = this.opinion; //审批意见
            param["attitude"] = this.agree; //同意1 不同意2
            param["login_name"] = this.userinfo.login_name; //登录名
            (param["memberId"] = this.userinfo.memberid),
              (param["deliverableId"] = this.approve.deliveraId); //交付物文档id
            // debugger;
            // console.log(param);
            examinetj("/sgpm/rest/api/integration/audit/record", param).then(
              res => {
                if (res.data.code == 200) {
                  console.log(res.data);
                  this.$notify({
                    title: "审批提交成功",
                    duration: 9000,
                    offset: 100
                  });
                  this.examineDialog = false; //隐藏审核弹框
                  this.clearRefresh(); //审批列表
                  this.isCheck = true
                }
              }
            );
          }
        });
      }
    },
    // 获取审核意见
    opinionyj(val) {
      this.opinionDialog = true;
      let params = {
        deliverableId: val
      };
      examinationReport("/sgpm/rest/api/integration/audit/record/log", params)
        .then(res => {
          if (res.data.code == 200) {
            console.log(res.data);
            this.opinionData = res.data.data;
          }
        })
        .catch(err => {});
    },
    verifyDownLoad() {
      let s = new Set();
      this.selectionLen.forEach((item, index) => {
        s.add(item.contractNumber);
      });
      if (s.size == 1 && Array.from(s)[0] != "") {
        return Array.from(s)[0];
      } else if (s.size == 1 && Array.from(s)[0] == "") {
        //返回1代表是选择的都是没有合同编号的数据
        return 1;
      } else {
        //返回2代表选类型不一致，要么全是有合同编号数据，要么都么有合同编号数据
        return 2;
      }
    },

    // 文档下载
    download() {
      this.tableLoading = true;
      let str = this.verifyDownLoad();
      let docIds = [];
      this.selectionLen.forEach((item, index) => {
        docIds.push(item.id);
      });
      let params = {
        zipName: "downloadFile",
        ids: docIds,
        company: this.userinfo.account_name
      };

      axios({
        // 用axios发送post请求
        method: "post",
        url:
          api.urlPort04 +
          "/sgpm/rest/api/server/pm/project/deliverable/download/zip", // 请求地址
        data: params, // 参数
        responseType: "blob" // 表明返回服务器返回的数据类型
      }).then(res => {
        this.tableLoading = false;
        if (str == 2) {
          //返回2代表选类型不一致，要么全是有合同编号数据，要么都么有合同编号数据
          this.$message({
            message: "不好意思，您需要选择相同合同编号类型进行下载",
            type: "warning"
          });
          return;
        } else if (str == 1) {
          //返回1代表是选择的都是没有合同编号的数据
          let date = new Date();
          let fileName = "fileDown" + FormatTime("YYYY-mm-dd HH:MM", date);
          this.downloadFile(res.data, fileName);
        } else {
          this.downloadFile(res.data, str); //正常下载文件名师合同名称
        }
      });
    },
    downloadFile(data, fileName) {
      let blob = new Blob([data], { type: "application/zip" });
      let url = window.URL.createObjectURL(blob);
      const link = document.createElement("a"); // 创建a标签
      link.href = url;
      link.download = fileName; // 重命名文件
      link.click();
      URL.revokeObjectURL(url); // 释放内存
    }
  },

  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ]),
    asideHeight: function() {
      return document.documentElement.clientHeight - 205;
    }
  }
};
</script>

<style lang="scss">
.list-container-doc {
  padding: 0 15px 0 15px;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 9px;
  }
  .el-dialog {
    margin-top: 24vh !important;
  }
  .el-table--border::after,
  .el-table--group::after {
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
  }
  .el-dialog__header {
    text-align: center;
  }
  .header {
    .headertit {
      margin-right: -2.5px;
      height: 30px;
      margin-bottom: 15px;
    }
    .circle-btn {
      border-radius: 5px;
    }
    .one-row {
      margin: 10px 0;
    }
    .header-search {
      float: right;
      .el-form-item__content {
        width: 290px;
      }
    }
  }
  .el-table .warning-row {
    background: oldlace;
  }
  .startGrey {
    color: #c4c4c4;
    font-size: 16px;
    display: block;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }

  .startGreen {
    color: #00a65a;
    font-size: 16px;
  }
  .search {
    margin: 30px 0 0 0;
  }
  .progress {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: gray;
    border-radius: 50%;
    position: relative;
  }
  .progress-red {
    background: #f56954 !important;
  }
  .progress-yellow {
    background: #f39c12 !important;
  }
  .progress-green {
    background: #00a65a !important;
  }
  .el-table__expanded-cell {
    padding: 0;
  }
  .el-form-item__label {
    margin-right: 0;
    text-align: left;
    line-height: 29px;
  }
  .el-table-filter__checkbox-group label.el-checkbox {
    margin-left: 0px !important;
  }
  .list-header {
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
    .label {
      font-size: 12px;
      vertical-align: -webkit-baseline-middle;
    }
    .btn-item {
      display: flex;
      justify-content: flex-end;
      margin: 5px 0 0 0;
      .circle-menu {
        border-radius: 2px;
      }
      .btn-right {
        margin: 0 10px 0 0;
      }
      .btn-left {
        margin: 0 0 0 10px;
      }
    }

    .tittle {
      font-weight: bold;
      font-size: 16px !important;
    }
    .title-position {
      text-align: left;
    }
    .btn-drop {
      margin: 0 10px 0 0;
    }
    .popover {
      height: 200px;
    }
  }

  .right {
    float: right;
  }

  .download {
    padding: 7px;
  }
  .dialoglef {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .el-table {
      float: left;
      .has-gutter {
        display: none;
      }
    }
    .el-radio {
      margin-right: 10px;
    }
    .el-radio__label {
      font-size: 12px;
      padding-left: 5px;
    }
    .el-radio__inner {
      width: 12px;
      height: 12px;
    }
    .el-textarea__inner {
      min-height: 33px;
      margin-top: 5px;
    }

    .final {
      float: left;
      padding-left: 20px;
      position: relative;
      width: calc(30% - 20px);
      border-left: 1px solid #ebeef5;
      margin-left: 20px;
    }
  }
  .el-dialog__footer {
    clear: both;
    display: flex;
    // padding: 25px;
    .dialog-footer {
      margin: 0 auto;
    }
  }
  .pendings {
    font-size: 16px;
    color: #409eff;
  }
  .pendings:hover {
    cursor: pointer;
  }
}
</style>
