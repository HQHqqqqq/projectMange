<template>
  <div class="Layout app-container">
    <div style="float: right;">
      <el-button type="primary" size="mini" @click="handleAdd" class="addRow">添加</el-button>
      <!--<el-button type="primary" @click="handleSave">保存</el-button>-->
    </div>
    <div style="clear: right"></div>
    <div style="margin: 5px"></div>
    <!--<hr style="width: 98%;height: 1px;border:none;border-top:1px solid  #dcdfe6;">-->

    <div style="overflow-y: auto;max-height: 400px">
      <el-form :model="formData" ref="formDom" :rules="formData.rules">
        <el-table
          border
          @row-click="rowClick"
          :data="formData.tableData"
          :header-cell-style="{fontSize:'12px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
          :row-style="{height:'50px'}"
          :cell-style="{padding:0,}"
          style="width: 100%"
        >
          <!-- v-if=false 隐藏该列 -->
          <el-table-column
            label="id"
            v-if=false
            width="50"
            prop="id">
          </el-table-column>

          <el-table-column type="index" label="序号" width="38">
          </el-table-column>

          <el-table-column
            prop="riskType"
            align="center"
            label="风险类型"
            width="180">
            <template slot-scope="scope">
              <div v-if=scope.row.rowStatus>
                <span>{{scope.row.riskType}}</span>
              </div>
              <div v-if=!scope.row.rowStatus>

                <el-select size="mini" v-model="scope.row.riskType" placeholder="请选择" @change="selectChange">
                  <el-option
                    v-for="item in riskData.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            prop="riskDescription"
            label="风险描述">
            <template slot-scope="scope">
              <div v-if=scope.row.rowStatus>
                <span>{{scope.row.riskDescription}}</span>
              </div>

              <!--<div v-if=!scope.row.rowStatus>-->
                <!--<el-form-item :prop="'tableData.'+scope.$index+'.riskDescription'"-->
                              <!--:rules="formData.rules.riskDescription">-->
                  <!--<el-input size="mini" v-model="scope.row.riskDescription" @change="selectChange"-->
                            <!--@blur="blurChange(scope.row)"></el-input>-->
                <!--</el-form-item>-->
              <!--</div>-->

              <div v-if=!scope.row.rowStatus>
                  <el-input size="mini"
                            v-model="scope.row.riskDescription"
                            @change="selectChange"
                            @blur="blurChange(scope.row)">
                  </el-input>
              </div>
              <!--<el-input v-model="scope.row.riskDescription" @change="selectChange"></el-input>-->
            </template>
          </el-table-column>

          <el-table-column
            prop="possibilityGrade"
            align="center"
            width="90px"
            label="可能性等级">
            <template slot-scope="scope">
              <div v-if=scope.row.rowStatus>
                <span>{{scope.row.possibilityGrade}}</span>
              </div>
              <div v-if=!scope.row.rowStatus>
                <el-select size="mini" v-model="scope.row.possibilityGrade" placeholder="请选择" @change="selectChange">
                  <el-option
                    v-for="item in selectData.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="severityProbability"
            align="center"
            width="90px"
            label="严重性">
            <template slot-scope="scope">
              <div v-if=scope.row.rowStatus>
                <span>{{scope.row.severityProbability}}</span>
              </div>

              <div v-if=!scope.row.rowStatus>
                <el-select size="mini" v-model="scope.row.severityProbability" placeholder="请选择" @change="selectChange">
                  <el-option
                    v-for="item in selectData.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="urgency"
            align="center"
            width="90px"
            label="紧迫性">
            <template slot-scope="scope">
              <div v-if=scope.row.rowStatus>
                <span>{{scope.row.urgency}}</span>
              </div>

              <div v-if=!scope.row.rowStatus>
                <el-select size="mini" v-model="scope.row.urgency" placeholder="请选择" @change="selectChange">
                  <el-option
                    v-for="item in selectData.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>

          <!--新增字段 应对措施-->
          <el-table-column
            prop="solutions"
            align="center"
            width="150px"
            label="应对措施">
            <template slot-scope="scope">
              <div v-if="scope.row.rowStatus">
                <span>{{scope.row.solutions}}</span>
              </div>
              <div v-if="!scope.row.rowStatus">
                <el-input size="mini" v-model="scope.row.solutions" @blur="blurChange2(scope.row)"
                          @change="selectChange"></el-input>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            width="50"
            label="操作">
            <template slot-scope="scope">
              <!--<el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>-->
              <el-button
                type="text"
                @click="handleDelete(scope.row)">
                <i class="el-icon-delete-solid" style="font-size: 20px;color: #409EFF"></i>
              </el-button>

            </template>
          </el-table-column>
        </el-table>

      </el-form>
    </div>
    <!--{{this.projectNumber}}-->
    <!--{{this.selectTable}}-->
    <!--{{this.formData.tableData}}-->
  </div>

</template>

<script>
  import {serverPostHttpMethod} from '../../api/api.js'    //
  import {serverGetHttpMethod} from '../../api/api.js'    //
  import {serverDeleteHttpMethod} from '../../api/api.js'    //
  import Bus from "../../bus";

  export default {
    name: "project-risk",
    props: ["datas"],  //从父组件获取数据的参数 datas
    data() {
      return {
        selectTable: [], //选中的行 控制只保留一个
        projectNumber: '', //项目编号

        formData: {
          rules: {
            name: {
              type: "string",
              required: true,
              message: "必填字段",
              trigger: "blur"
            },
            // riskDescription: { type:"string",required:true,message:"必填字段",trigger:"blur"}
          },

          tableData: []

        },
        //风险等级数据
        selectData: {
          value: '',
          options: [
            {value: '高', label: '高'},
            {value: '中', label: '中'},
            {value: '低', label: '低'}
          ]
        },
        //风险类型数据
        riskData: {
          value: '',
          options: []
        },

        // tableData: [],
        // tableData: [
        //   {
        //     riskType: '项目人力资源风险',  //风险类型
        //     riskDescription: '风险描述',   //风险描述
        //     possibilityGrade: '高',   //可能性等级
        //     severityProbability: '高',  //严重性
        //     urgency: '高', //紧迫性
        //   }
        // ]
      }
    },

    //解决重复请求bug
    beforeDestroy() {
      Bus.$off('projectInfo');
      Bus.$off('ProjectriskSave')
    },


    created() {
      // 清除localStorage 中的ProjectriskParams参数
      if (localStorage.getItem("ProjectriskParams")) {
        var params = JSON.parse(localStorage.getItem("ProjectriskParams"));
        if (params) {
          localStorage.removeItem("ProjectriskParams")
        }
      }

      //从项目信息中获取项目编号
      if (localStorage.getItem("projectInfo")) {
        var params = JSON.parse(localStorage.getItem("projectInfo"));
       this.projectNumber = params.projectNum
      }

      //启动项目时，获取已保存的风险数据
      this.gettableData();

      // Bus.$on("projectInfo", item => {
      //   if (item) {
      //     this.projectNumber = item.PROJECTNUMBER
      //     this.gettableData(this.projectNumber);
      //   }
      // });

      //项目启动 保存后 更新项目风险数据
      Bus.$on("ProjectriskSave", item => {
        if (item) {
          this.gettableData(this.projectNumber);
        }
      });

      //刷新启动时
      // var data = JSON.parse(sessionStorage.getItem("data"));
      // if (data) {
      //   this.projectNumber = data.PROJECTNUMBER;
      //   this.gettableData(this.projectNumber);
      // }

      this.getRiskType();
    },

    methods: {
      //将tableData存到全局变量中
      sendData() {
        console.log("=====Projectrisk=====sendData========");
        var Params = JSON.stringify(this.formData.tableData);
        localStorage.setItem("ProjectriskParams", Params);
      },
      // 风险类型 下拉选变化时
      selectChange() {
        this.sendData();
      },

      //风险描述 失去焦点时
      blurChange(row) {
        console.log(row);
        // row.rowStatus = true;
        if (row.riskDescription == "") {
          this.warnMessage()
        }
      },
      //应对措施 失去焦点时
      blurChange2(row) {
        row.rowStatus = true;
      },
      //当前行被点中时
      rowClick(row, event, column) {
        // console.log(1111111111);
        // console.log(this.$refs);
        row.rowStatus = false;
        this.selectTable.push(row);
        //控制只保留一行数据
        if (this.selectTable.length > 1) {
          this.selectTable = [];
          this.selectTable.push(row)
        }
        //其他行都设置为不可编辑样式
        this.formData.tableData.forEach(item => {
          if (item != this.selectTable[0]) {
            item.rowStatus = true;
          }
        });
      },

      //提示信息
      warnMessage() {
        this.$message({
          showClose: true,
          message: '风险描述不能为空',
          type: 'warning'
        });
      },

      //获取表格数据
      gettableData() {
        // var params = {projectNumber: "RJ-H-2019-0009"};
        console.log('获取项目风险数据===项目编号：'+this.projectNumber);
        // var params = {projectNumber: this.projectNumber};
        var params = {projectNumber: this.projectNumber};
        var url = '/sgpm/rest/api/server/pm/project/risk';
        serverGetHttpMethod(url, params).then(res => {
          var jsonData = res.data.data;
          jsonData.forEach(item => {
            item["rowStatus"] = true; //true 显示不可编辑的样式
          });
          // this.formData.tableData = jsonData
          this.formData.tableData = jsonData;

          //将已保存的数据存在localstorage中，防止启动报错
          if(jsonData.length != 0){
            this.sendData();
          }
        }).catch(err => {
          console.log(err)
        })
      },

      //测试 保存操作
      handleSave() {
        var url = '/sgpm/rest/api/server/pm/project/risk';
        // var params = this.tableData;
        // var data = [
        //   {
        //     "projectNumber": "RJ-H-2019-0009",
        //     "riskType": "项目人力资源风险1",
        //     "riskDescription": "阿克苏和对啊是大家卡省的",
        //     "possibilityGrade": "中",
        //     "severityProbability": "低",
        //     "urgency": "高"
        //   },
        //   {
        //     "projectNumber": "RJ-H-2019-0009",
        //     "riskType": "项目人力资源风险2",
        //     "riskDescription": "阿克苏和对啊是大家卡省的",
        //     "possibilityGrade": "中",
        //     "severityProbability": "低",
        //     "urgency": "高"
        //   }
        // ];
        var data = this.formData.tableData;
        serverPostHttpMethod(url, data).then(res => {
          console.log(res.data)
          if (res.data.code == 200) {
            alert('保存成功');
            this.gettableData();//更新表格数据
          } else {
            alert('保存失败');
          }
        }).catch(err => {
          console.log(err)
        })
      },

      //获取风险类型枚举数据
      getRiskType() {
        var url = '/sgpm/rest/api/server/pm/project/RiskType';
        serverGetHttpMethod(url).then(res => {
          var jsonData = res.data.data;
          for (var i = 0; i < jsonData.length; i++) {
            var item = jsonData[i];
            this.riskData.options.push({
              value: item.value,
              label: item.value
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },

      //添加操作
      handleAdd() {
        var item = {
          id: '',
          // projectNumber: 'RJ-H-2019-0009',    //项目编号 ----需求后期修改的
          projectNumber: this.projectNumber,
          riskType: this.riskData.options[0].label,  //风险类型
          riskDescription: '',   //风险描述
          possibilityGrade: '中',   //可能性等级
          severityProbability: '中',  //严重性
          urgency: '中', //紧迫性
          rowStatus: false, //控制显示不同的样式，false 显示编辑样式
        };
        var size = this.formData.tableData.length;
        if (size > 0 && this.formData.tableData[size - 1].riskDescription == '') {
          this.warnMessage()
        } else {
          this.formData.tableData.push(item);
        }
        this.sendData();
      },

      //移除操作
      handleDelete(row) {
        if (row.id) {
          //删除数据库中的数据
          var params = {id: row.id};
          var url = '/sgpm/rest/api/server/pm/project/risk';
          serverDeleteHttpMethod(url, params).then(res => {
            if (res.data.code == 200) {
              alert('删除成功');
              this.gettableData(this.projectNumber); //更新表格数据
            } else {
              alert('删除失败')
            }
          }).catch(err => {
            console.log(err)
          })

        } else {
          //删除页面中的数据
          var index = this.formData.tableData.indexOf(row);
          this.formData.tableData.splice(index, 1) //去掉当前数据 index删除的开始下标 1 删除的个数
        }

        this.sendData();
      },
    }
  }
</script>

<style scoped>
  .Layout {
    margin-top: 20px;
    /* margin-left: 200px; */
    z-index: 10;
    padding-left: 10px;
  }
	.addRow{
		padding: 9px 15px;
		font-size: 12px;
	}
</style>
