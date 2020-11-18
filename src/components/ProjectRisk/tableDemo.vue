<template>
  <div style="margin-top:100px;margin-left: 200px">
    <h2>select默认值联系</h2>
    <el-select v-model="value" placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <hr />

    <el-button @click="addLine">添加行数bbbbbbddddddd333333</el-button>
    <el-button @click="save('formDom')">保存</el-button>
    <el-form :rules="formData.rules" :model="formData" ref="formDom" class="demo-ruleForm">
      <el-table :data="formData.tableData" style="width: 100%">
        <el-table-column prop="bookname" label="书名">
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.bookname'"
              :rules="formData.rules.name"
            >
              <el-input v-model="scope.row.bookname" placeholder="书名"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="bookvolume" label="册数" width="150">
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.bookvolume'"
              :rules="formData.rules.volume1"
            >
              <el-input v-model.number="scope.row.bookvolume" placeholder="册数"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="bookbuyer" label="购买者">
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.bookbuyer'"
              :rules="formData.rules.name"
            >
              <el-input v-model="scope.row.bookbuyer" placeholder="购买者"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="bookborrower" label="借阅者">
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.bookborrower'"
              :rules="formData.rules.name"
            >
              <el-input v-model="scope.row.bookborrower" placeholder="借阅者"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="bookbuytime" label="购买日期" width="250">
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.bookbuytime'"
              :rules="formData.rules.data1"
            >
              <el-date-picker v-model="scope.row.bookbuytime" type="date" placeholder="购买日期"></el-date-picker>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              v-if="!scope.row.editing"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "TestWorld",
  data() {
    return {
      options: [
        {
          value: "1",
          label: "黄金糕"
        },
        {
          value: "2",
          label: "双皮奶"
        },
        {
          value: "3",
          label: "蚵仔煎"
        },
        {
          value: "4",
          label: "龙须面"
        },
        {
          value: "5",
          label: "北京烤鸭"
        }
      ],
      value: "1",
      formData: {
        rules: {
          name: {
            type: "string",
            required: true,
            message: "必填字段",
            trigger: "blur"
          },
          volume1: {
            type: "number",
            required: true,
            message: "必须为数字值",
            trigger: "change"
          },
          data1: {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        },
        tableData: [
          {
            bookname: "",
            bookbuytime: "",
            bookbuyer: "",
            bookborrower: "",
            bookvolume: ""
          }
        ]
      }
    };
  },
  methods: {
    addLine() {
      //添加行数
      var newValue = {
        bookname: "",
        bookbuytime: "",
        bookbuyer: "",
        bookborrower: "",
        bookvolume: ""
      };
      //添加新的行数
      this.formData.tableData.push(newValue);
    },
    handleDelete(index) {
      //删除行数
      this.formData.tableData.splice(index, 1);
    },
    save(formName) {
      //保存
      this.$refs[formName].validate((valid, model) => {
        console.log(valid);
        console.log(JSON.stringify(model));
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleDelete(index) {
      //删除行数
      console.log(index);
      this.formData.tableData.splice(index, 1);
    }
  }
};
</script>

<style scoped>
</style>
