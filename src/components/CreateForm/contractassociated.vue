<template>
  <div class="wrap">
    <div class="projectList">
      <div class="project">
        <el-row :gutter="10" style="height: 35px;line-height: 35px;">
          <el-col :span="12" style="font-weight: bold;">项目列表</el-col>
          <el-col :span="12">
            <div class="header-search">
              <el-input v-model="keyWords" style="vertical-align: baseline;" size="mini" placeholder="项目名称/项目">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
              <el-checkbox v-model="checkedChoose" @change="checkedChooseProject">仅显示未关联项目</el-checkbox>
            </div>
          </el-col>
        </el-row>
        <el-table :data="tableData" style="width:100%;" row-key="id" max-height="200" border
          v-loading="loading"
         :header-cell-style="{
            fontSize: '14px',
            color: '#303133',
            height: '34px',
            padding: 0,
            backgroundColor: '#ccd1d5'
          }" :row-style="{ height: '34px' }" :cell-style="{ padding: 0 }" highlight-current-row
          @current-change="handleCurrentChangeProject">
          <el-table-column label="" width="35" align="center">
            <template slot-scope="scope">
              <el-radio v-model="checked" :label="scope.row.id" v-if="scope.row.show" style="color: #fff;">
                &nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column  type="index" label="序号" width="50"  align="center">
          </el-table-column>

          <el-table-column prop="projectName" label="项目名称" width="200" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="projectNumber" label="项目编号" width="160">
          </el-table-column>
          <el-table-column prop="classUnitBName" label="实施B级单位">
          </el-table-column>
          <el-table-column prop="classUnitCName" label="实施C级单位">
          </el-table-column>
          <el-table-column prop="projectManagerName" label="项目经理">
          </el-table-column>
          <!-- <el-table-column prop="contractProjectType" label="项目类型">
				</el-table-column>
				<el-table-column prop="contractProjectLevel" label="项目级别">
				</el-table-column>
				<el-table-column prop="contractContent" label="项目建设内容">
				</el-table-column>
				<el-table-column prop="professionalWorkTypes" label="业务类型">
				</el-table-column> -->
          <el-table-column prop="relationStatus" label="关联状态">
          </el-table-column>
          <!-- <el-table-column prop="contractNumber" label="合同编号">
				</el-table-column> -->
          <!-- <el-table-column prop="contractName" label="合同名称">
				</el-table-column> -->
        </el-table>
        <div class="pagination">
          <div class="page right">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="1"
              :page-sizes="[5]" layout="total, sizes, prev, pager, next, jumper" :total="page.total"></el-pagination>
          </div>
        </div>
      </div>

      <el-row :gutter="20">
        <el-col :span="15">
          <div class="list-container">
            <el-row :gutter="10" style="height: 40px;line-height: 35px;">
              <el-col :span="12" style="font-weight: bold;">合同列表</el-col>
              <el-col :span="12">
                <div class="header-search">
                  <el-input placeholder="合同编号/合同名称" size="small" style="display: none;">
                    <el-button slot="append">
                      <i class="icon-search"></i>
                    </el-button>
                  </el-input>
                  <el-checkbox v-model="checkedChooseContract" @change="checkedChooseWay">仅显示未关联合同</el-checkbox>
                </div>
              </el-col>
            </el-row>
            <el-table  v-loading="htLoading" :data="tableDataContract" ref="contractSelect" :height="asideHeightA" border style="width: 100%"
              :header-cell-style="{
                fontSize: '14px',
                color: '#303133',
                height: '34px',
                padding: 0,
                backgroundColor: '#ccd1d5'
              }" :row-style="{ height: '34px' }" :cell-style="{ padding: 0 }" @row-click="handleCurrentChangeRow">
              <!-- <el-table-column type="selection" width="50" align="center">
					</el-table-column> -->
              <el-table-column type="index" width="50" label="序号" align="center">
              </el-table-column>
              <el-table-column prop="contractName" label="合同名称" width="170" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column prop="contractNumber" label="合同编号(简)" width="170">
              </el-table-column>
              <el-table-column prop="contractProgress" label="审核进度" width="110">
              </el-table-column>
              <el-table-column prop="implementLevelTwoName" label="实施B级单位" width="180">
              </el-table-column>
              <el-table-column prop="projectManagerName" label="项目经理">
              </el-table-column>
            </el-table>
            <div class="pagination">
              <div class="page right">
                <el-pagination @current-change="handleCurrentChange1" :current-page.sync="currentPageContract"
                  :page-size="1" :page-sizes="[20]" layout="total, sizes, prev, pager, next, jumper"
                  :total="pageContract.total"></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="">
            <el-row :gutter="10" style="height: 40px;line-height: 35px;margin:3px 0 0 0 ;">
              <el-col :md="12" :xl="9" :sm="12" :lg="12" style="font-weight: bold;">关联合同列表</el-col>
            </el-row>

            <el-table :data="associatedListData" :height="asideHeightA" border style="width: 100%"
              @current-change="handleCurrentChangeAssociated" :header-cell-style="{
                fontSize: '14px',
                color: '#303133',
                height: '34px',
                padding: 0,
                backgroundColor: '#ccd1d5'
              }" :row-style="{ height: '34px' }" :cell-style="{ padding: 0 }">
              <el-table-column type="index" width="50" label="序号" align="center">
              </el-table-column>
              <el-table-column prop="contractName" label="合同名称" width="160" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column prop="contractNumber" label="合同编号(简)" width="160">
              </el-table-column>
              <el-table-column label="操作" fixed="right" align="center">
                <template slot-scope="scope">
                  <!-- <el-button size="small" type="danger" @click.native.prevent="deleteRow(scope.$index, associatedListData)">删除</el-button> -->
                  <span @click="deleteRow(scope.$index, associatedListData)">
                    <i class="el-icon-delete-solid" style="font-size: 20px;color:#409eff"></i>
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination"></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="btn-item">
      <el-button type="primary" @click="handleSubmit" size="mini">确定</el-button>
      <el-button type="primary" @click="back" size="mini">返回</el-button>
    </div>
  </div>
</template>

<script>
import Bus from "../../bus";
import { mapState, mapActions } from "vuex";
import { saveDate } from "../../api/api.js";
import { integrationGetMethod } from "../../api/api.js";
import { getProject } from "../../api/api.js";
import GenerateForm from "@/components/CreateForm/GenerateForm";
import GenetateFormItem from "@/components/CreateForm/GenerateFormItem";
export default {
  name: "contractassociated",
  props: ["widget", "models", "rules", "remote", "datas"],
  components: {
    GenerateForm,
    GenetateFormItem
  },
  data() {
    return {
      loading:false,
      htLoading:false,
      currentPageContract: 1,
      currentPage: 1,
      checked: null,
      tableData: [],
      keyWords: "",
      checkedChoose: true,
      checkedChooseContract: false,
      page: {
        //当前页
        pageNum: 1,
        //每页显示条数
        pageSize: 5,
        total: 0
      },
      pageContract: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      tableDataContract: [],
      associatedListData: [],
      listContractNumber: "",
      projectId: "",
      spanArr: [],
      pos: 0,
      arr: [],
      contractNumber:'',//合同编号
      projectNumber:'',//子项目编号
    };
  },
  computed: {
    ...mapState([
      "userinfo", //oa跳转过来的用户信息值
      "isDetail" //是否是详情页面，详情页面操作按钮不显示，只显示返回按钮
    ]),
    isRevoke: function() {
      return sessionStorage.getItem("isRevoke");
    },
    asideHeight: function() {
      return document.documentElement.clientHeight - 546;
    },
    asideHeightA: function() {
      return document.documentElement.clientHeight - 530;
    }
  },
  mounted() {},
  created() {
    var pageNum = 1;
    var checkedChoose = this.checkedChoose;
    if (checkedChoose == true) {
      checkedChoose = 0;
    } else {
      checkedChoose = 1;
    }
    this.getTable(pageNum, checkedChoose);
    if(this.userinfo.account_id=="8416498716893399290"){//南康默认选中未关联项目
      this.checkedChooseContract=true
    }else{
      this.checkedChooseContract=false
    }
    var relation = this.checkedChooseContract;
    if (relation == true) {
      relation = 0;
    } else {
      relation = 1;
    }
    this.getCotractTable(pageNum, relation);
  },
  methods: {
    search(val) {
      var checkedChoose = this.checkedChoose;
      if (checkedChoose == true) {
        checkedChoose = 0;
      } else {
        checkedChoose = 1;
      }
      this.getTable(1, checkedChoose);
    },
    //项目列表 仅显示
    checkedChooseProject(val) {
      this.checked = null;
      this.associatedListData = [];
      var pageNum = 1;
      var checkedChoose = val;
      if (checkedChoose == true) {
        checkedChoose = 0;
      } else {
        checkedChoose = 1;
      }
      this.getTable(pageNum, checkedChoose);
    },
    checkedChooseWay(val) {
      var pageNum = 1;
      var relation = val;
      if (relation == true) {
        relation = 0;
      } else {
        relation = 1;
      }
      this.getCotractTable(pageNum, relation);
    },
    //确定
    handleSubmit() {
      if (!this.projectId) {
        alert("请选择项目!");
        return;
      }
      // if (this.associatedListData.length == 0) {
      //   alert('请选择合同!');
      //   return;
      // }
      var contract_datas = this.associatedListData;
      let relation = contract_datas.length===0?0:1//0代表取消关联  1代表进行关联
      contract_datas = JSON.parse(
        JSON.stringify(contract_datas).replace(/contractName/g, "contract_name")
      );
      contract_datas = JSON.parse(
        JSON.stringify(contract_datas).replace(
          /contractNumber/g,
          "contract_num"
        )
      );
      var url = "/sgpm/rest/api/server/pm/gt/project/contracts";
      var data = {
        id: this.projectId,
        child_id: this.checked,//项目列表的id
        projectNumber:this.projectNumber,//子项目编号
        contractNumber:this.contractNumber,//合同编号
        relation:relation,
        company_id:this.userinfo.account_id=="-1814768306395265967"?this.userinfo.account_id:undefined,
        contract_datas: contract_datas
      };
      saveDate(url, data)
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            alert("合同关联成功!");
            var pageNum = 1;
            var relation = this.checkedChooseContract;
            if (relation == true) {
              relation = 0;
            } else {
              relation = 1;
            }
            this.getCotractTable(pageNum, relation);
            var checkedChoose = this.checkedChoose;
            if (checkedChoose == true) {
              checkedChoose = 0;
            } else {
              checkedChoose = 1;
            }
            this.getTable(pageNum, checkedChoose);
          } else {
            alert("合同关联失败，关联合同重复,请选择未关联合同");

          }
        })
        .catch(err => {
          console.log(err);
          alert("合同关联失败!");
        });
    },
    //返回
    back() {
      this.$router.go(-1); //返回上一层
    },
    //移除
    deleteRow(index, rows) {
      console.log(index, rows);
      rows.splice(index, 1);
    },
    //获取移除的数据
    handleCurrentChangeAssociated(val) {
      console.log(val);
      if (val) {
        this.listContractNumber = val.contractNumber;
      } else {
        return;
      }
    },
    //选中合同列表
    handleCurrentChangeRow(val) {
      this.contractNumber = val.contractNumber
      console.log(val);
      if (val) {
        // if (val.relationStatus == "0") {
        //   alert("请选择未关联的合同");
        //   this.$refs.contractSelect.clearSelection();
          // return;
        // } else {
          var valArr = this.arr;
          if (valArr.length == 0) {
            valArr.push(val);
          }else if(this.userinfo.account_id=="8416498716893399290"){//如果是南康可以关联多个合同
            valArr.push(val);
          } else {
            alert('只能关联一个合同')
            return 
            // for (var i = 0; i < valArr.length; i++) {
            //   if (val.contractNumber == valArr[i].contractNumber) {
            //     return;
            //   }
            // }
            // valArr.push(val);
          }
          this.associatedListData = valArr;
        // }
      }
    },
    //选中项目列表
    handleCurrentChangeProject(val) {
      if (val) {
        this.projectNumber = val.projectNumber
        this.checked = val.id;
        console.log(val);
        this.projectId = val.conId;
        var url = "/sgpm/rest/api/integration/project/contracts/" + val.conId;
        integrationGetMethod(url)
          .then(res => {
            console.log(res);
            var result = res.data.data;
            this.arr = result;
            console.log(this.arr);
            this.associatedListData = result;
            if(result.length>0){
              this.contractNumber = result[0].contractNumber
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //合同列表
    getCotractTable(pageNum, relationCotract) {
      this.htLoading = true
      var relation = "";
      if (relationCotract) {
        relation = relationCotract;
      } else {
        if (this.checkedChooseContract == true) {
          relation = 0;
        } else {
          relation = 1;
        }
      }

      // var url =
      //   '/sgpm/rest/api/integration/contracts/relation?relation=' + relation + '&memberId=' + this.userinfo.memberid + '&pageNum=' +
      //   pageNum + '&pageSize=20';
      var url = `/sgpm/rest/api/integration/contracts/relation?memberId=${this.userinfo.memberid}&relation=${relation}&companyId=${this.userinfo.account_id}&pageNum=${pageNum}&pageSize=20`;
      integrationGetMethod(url)
        .then(res => {
          this.htLoading = false
          // console.log(res)
          this.pageContract.total = res.data.meta.totalCount;
          this.tableDataContract = res.data.data;
          this.currentPageContract = res.data.meta.pageNo;
        })
        .catch(err => {
          this.htLoading = false
          console.log(err);
        });
    },
    formatxuhao(row) {
      return (row.index =
        row.show == false ? (row.index = "") : (row.index = row.index));
    },
    //项目列表
    getTable(pageNum, checkedChoose) {
      this.loading = true
      var relation = "";
      if (checkedChoose) {
        relation = checkedChoose;
      } else {
        if (this.checkedChoose == true) {
          relation = 0;
        } else {
          relation = 1;
        }
      }
      // var url = '/sgpm/rest/api/server/pm/gt/project?relation=' + relation + '&memberId=' + this.userinfo.memberid + '&pageNum=' +
      //   pageNum + '&pageSize=5&keyWord=' + this.keyWords;
      var url = `/sgpm/rest/api/server/pm/gt/project?memberId=${this.userinfo.memberid}&pageNum=${pageNum}&pageSize=5&relation=${relation}&keyword=${this.keyWords}&companyId=${this.userinfo.account_id}`;
      getProject(url)
        .then(res => {
          this.loading = false
          var result = res.data.data;
          // this.getSpanArr(result);
          if (result) {
            for (var i = 0; i < result.length; i++) {
              if (result[i].relationStatus == 0) {
                result[i].relationStatus = "已关联";
              } else if (result[i].relationStatus == 2) {
                result[i].relationStatus = "未关联";
              }
            }
          }
          this.tableData = res.data.data;
          this.page.total = res.data.meta.totalCount;
          this.currentPage = res.data.meta.pageNo;
          
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].show = true;
            // var arr = [];
            // for (var i = 0; i < this.tableData.length; i++) {
            //   if (i === 0) {
            //     arr.push(1);
            //   } else {
            //     if (this.tableData[i].index === this.tableData[i - 1].index) {
            //       this.tableData[i].show = false;
            //     } else {
            //       this.tableData[i].show = true;
            //     }
            //   }
            // }
          }
        })
        .catch(err => {
          this.loading = false
          console.log(err);
        });
    },
    //合并列
    getSpanArr(data) {
      console.log(data); //从后台获取的数据
      this.spanArr = [];
      if (data) {
        for (var i = 0; i < data.length; i++) {
          if (i === 0) {
            // 如果是第一条记录（即索引是0的时候），向数组中加入１
            this.spanArr.push(1);
            this.pos = 0;
          } else {
            if (data[i].conId === data[i - 1].conId) {
              //
              this.spanArr[this.pos] += 1;
              this.spanArr.push(0);
            } else {
              // 不相等push 1
              this.spanArr.push(1);
              this.pos = i;
            }
          }
        }
        console.log(this.spanArr);
      }
    },
    //合并列
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    cellClass(row) {
      if (row.columnIndex == 0) {
        return "disabledSelect";
      }
    },
    //合同列表分页
    handleCurrentChange1(val) {
      console.log(val);
      this.getCotractTable(val);
    },
    //项目列表分页
    handleCurrentChange(val) {
      console.log(val);
      this.getTable(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-table__header {
  width: 100% !important;
}
.el-table--scrollable-y .el-table__body-wrapper {
  height: auto !important;
}
.footer {
  text-align: center;
  button {
    margin-top: 10px;
  }
}
.associatedList {
  width: 38%;
  float: right;
  i {
    margin-left: 8px;
    margin-top: 2px;
    float: left;
  }
}

.list-content {
  width: 100%;
  // height: 315px;
}

.header-search {
  float: right;
  padding: 0px 0 10px 0;

  .el-input {
    width: 55%;
  }

  .el-checkbox {
    margin-left: 10px;
  }
}

.el-radio__label {
  display: none !important;
}

.projectList {
  width: 100%;
}
.pagination {
  width: 100%;
  height: 45px;
}

.project {
  max-height: 288px;
  .pagination {
    width: 100%;
    height: 45px;
  }
  .right {
    float: right;
  }
  .page {
    float: right;
    margin: 8px 0 0 0;
  }

  .el-radio__input.is-checked + .el-radio__label {
    color: #fff;
  }
  .search {
    padding: 0 20px;
  }
}

.list-container {
  .page {
    margin: 10px 0 0 0;
  }

  .right {
    float: right;
  }
}

tr:hover .aaa {
  color: #fff;
}

.el-icon-arrow-right {
  display: none;
}
.wrap {
  .footer {
    position: relative;
    top: 10px;
  }
  .btn-item {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
