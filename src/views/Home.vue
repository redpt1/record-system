<template>
  <div id="building">
        <div class="login_title">
          <h1>Medical Records System</h1>
        </div>

    <el-tabs type="border-card" style="width: 90%;margin: auto">

      <el-tab-pane label="All Records">

        <el-button type="primary" icon="el-icon-search" @click="searchAll">search</el-button>

        <el-table
          :data="tableData1"
          height="400"
          border
          stripe
          style="width: 100%">
          <el-table-column
            prop="recordId"
            label="Record ID">
          </el-table-column>
          <el-table-column
            prop="name"
            label="Patient Name"
          >
          </el-table-column>
          <el-table-column
            prop="in_time"
            label="Admission time"
          >
          </el-table-column>
          <el-table-column
            prop="out_time"
            label="Discharge time">
          </el-table-column>
          <el-table-column
            prop="fee"
            label="Fee">
          </el-table-column>

        </el-table>

      </el-tab-pane>

      <el-tab-pane label="Create Records">

        <el-form  :model="form" label-width="80px" style="width: 95%;margin: auto" :rules="formRules" ref="formRules" prop="form">
          <el-form-item label="Name" prop="PatientName">
            <el-input v-model="form.PatientName" ></el-input>
          </el-form-item>
          <el-form-item label="Time" >
            <el-col :span="11">
              <el-form-item label="" prop="In_time" >
              <el-date-picker type="date" placeholder="choose the time" v-model="form.In_time" style="width: 100%;" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item label="" prop="Out_time" >
              <el-date-picker type="date" placeholder="choose the time" v-model="form.Out_time" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="Fee" prop="Fee">
            <el-input v-model="form.Fee" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="el-icon-upload el-icon--right" @click="onSubmit" >Upload</el-button>
          </el-form-item>
        </el-form>


      </el-tab-pane>

      <el-tab-pane label="Search record">


          <el-form style="width: 95%;margin: auto">
            <el-form-item lable="搜索" >
            <el-col :span="15">
              <el-form-item label="">
                <el-input v-model="searchForm.recordId" placeholder="please input"></el-input>
              </el-form-item>
            </el-col>

              <el-col :span="5">
          <el-form-item label="">
          <el-select v-model="value" placeholder="please choose the search method">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
                </el-col>

              <el-col :span="3">
                <el-button type="primary" icon="el-icon-search" @click="searchARecord">search</el-button>
              </el-col>

            </el-form-item>


          </el-form>

        <el-table
          :data="tableData"
          height="400"
          border
          style="width: 100%">
          <el-table-column
            prop="name"
            label="Patient Name"
           >
          </el-table-column>
          <el-table-column
            prop="in_time"
            label="Admission time"
            >
          </el-table-column>
          <el-table-column
            prop="out_time"
            label="Discharge time">
          </el-table-column>
          <el-table-column
            prop="fee"
            label="Fee">
          </el-table-column>
          <el-table-column
            prop="createdBy"
            label="Created by">
          </el-table-column>
        </el-table>





      </el-tab-pane>




    </el-tabs>

  </div>

</template>

<script>
export default {
  data() {
    return {
      tableData1: [],
      form: {
        PatientName: '',
        In_time: '',
        Out_time: '',
        Fee: ''
      },
      formRules: {
        PatientName: [{
          required: true,
          message: "please input the name",
          trigger: "blur"
        },
          {
            min: 3,
            max: 18,
            message: " 3 - 18 ",
            trigger: "blur",
          },
        ],
        In_time: [{
          required: true,
          message: "please input the time",
          trigger: "blur"
        },
        ],
        Out_time: [{
          required: true,
          message: "please input the time",
          trigger: "blur"
        },

        ],
        Fee: [{
          required: true,
          message: "please input the fee",
          trigger: "blur"
        },
        ]
      },
      options: [{
        value: '1',
        label: 'Ethereum'
      }, {
        value: '2',
        label: 'Hyperledger fabric'
      }, ],
      value: '',
      info:'',
      searchForm:{
        recordId:'',
      },
      tableData: [],

      recordInfo:{
        PatientName: '',
        In_time: '',
        Out_time: '',
        Fee: '',
        RecordId:''
      },





    }
  },
  methods: {
    searchARecord(){
      this.$axios.post("/api/search", this.qs.stringify(this.searchForm),{
        headers:{
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then((
        res) => {
        console.log(res)
        if (res.status === 200) {
          this.tableData = [];
            this.tableData.push(res.data);
            this.$message.success("success!")
        }
        else{
          this.tableData = [];
          this.$message.error("fail!");
        }
      })
    },
    onSubmit() {
      this.$refs.formRules.validate((valid) => {
        const startDate = this.form.In_time
        const endDate = this.form.Out_time
        const startTime = new Date(startDate).getTime()
        const endTime = new Date(endDate).getTime()

        if (!valid) return;
        if ( endTime < startTime) {
          this.$message.error('The end date must be greater than the start date, please reselect!')
          return;
        }
        this.$axios.post("/api/create", this.qs.stringify(this.form),{
          headers:{
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then((
          res) => {
          console.log(res)
          if (res.status === 200) {
            this.$message.success(res.data);
          }
          else{
            this.$message.error("创建失败，请重试");
          }
        })
      })
    },
    searchAll(){
      this.$axios.get("/api/query").then((
        res) => {
        console.log(res)
        if (res.status === 200) {
            this.tableData1 = [];
          for(let i=0;i<res.data.length;i++)
          {
            let temp = res.data[i];
            temp.Record.recordId = res.data[i].Key;
            this.tableData1.push(res.data[i].Record);
          }
          this.$message.success("success!")

        }
        else{
          this.$message.error("fail!");
        }
      })
    }
  }
}

</script>

<style scoped>
.login_title {
  /* 字体水平左右居中 */
  text-align:center;
}

.login_context {
  /* 宽度 */
  width: 450px;
  /* 高度 */
  height: 300px;
  /* 背景色 */
  background: #fff;
  /* 属性定位 */
  position: absolute;
  /* 属性定位，顶部占比 */
  top: 50%;
  /* 属性定位，左侧占比 */
  left: 50%;
  /* 水平垂直居中 */
  transform: translate(-50%, -50%);
  /* 四个角的圆角角度 */
  border-radius: 20px;
  /* 阴影 */
  box-shadow: 0 0 5px 2px #ddd;
}
#building{
  background:url("../assets/back.jpeg");
  width:100%;
  height:100%;
  position:fixed;
  background-size:100% 100%;
}
</style>
