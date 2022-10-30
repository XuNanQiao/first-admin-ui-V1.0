<template>
  <div class='app-container'>
    <div class="name">当前题库名称：{{bankForm.name}}
      <span  class="el-icon-back back" @click="goback">返回题库列表</span>
    </div>

    <div class="flex-between">
      <div class="flex-align-center">
        <span class="title">试题类型：</span>
        <el-select v-model="form.Type" clearable filterable placeholder="请选择试题类型">
          <el-option v-for="item in bankType" :label="item.label" :value="item.value" :key="item.value">
          </el-option>
        </el-select>
        <span class="title">知识点：</span>
        <el-select v-model="form.KnowledgepointId" clearable filterable placeholder="请选择知识点">
          <el-option v-for="item in KnowledgepointList" :label="item.name" :value="item.id" :key="item.id">
          </el-option>
        </el-select>
        <el-button class="filter-item btn_table_primary" type="primary" icon="search" @click="getlist">查询</el-button>
      </div>
      <el-button class="btn_table_primary" type="primary" v-if="bankForm.bankType == '0'" @click="getAddQuestion">添加试题</el-button>
    </div>
    <el-table border :data="listData" highlight-current-row fit>
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>
      <el-table-column align="left" label="内容" width="300">
        <template slot-scope="scope">
          <div>【题干】</div>
          <div v-html="scope.row.question"></div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" width="300">
        <template slot-scope="scope">
          <span>
            {{scope.row.type | getType}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="知识点" width="300">
        <template slot-scope="scope">
          <span>
            {{scope.row.knowledgepointId | getKnowledgepointName(that)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上传时间">
        <template slot-scope="scope">
          <span>
            {{scope.row.insertTime}}
          </span>
        </template>
      </el-table-column>
      <el-table-column type="expand" label="操作">
        <template slot-scope="props">
          <div class="font16  fontBlod">【题干】</div>
          <div class="font14  " v-html="props.row.question">
          </div>
          <div v-if="props.row.type == 2 || props.row.type == 3">
            <div class="font16  fontBlod">【选项】</div>
            <div class="font14   flex-wrap" v-if="props.row.ansA">A：
              <span v-html="props.row.ansA"></span>
            </div>
            <div class="font14   flex-wrap" v-if="props.row.ansB">B：
              <span  v-html="props.row.ansB"></span>
            </div>
            <div class="font14   flex-wrap" v-if="props.row.ansC">C：
              <span v-html="props.row.ansC"></span>
            </div>
            <div class="font14   flex-wrap" v-if="props.row.ansD">D：
              <span v-html="props.row.ansD"></span>
            </div>
            <div class="font14   flex-wrap" v-if="props.row.ansE">E：
              <span v-html="props.row.ansE"></span>
            </div>
            <div class="font14   flex-wrap" v-if="props.row.ansF">F：
              <span v-html="props.row.ansF"></span>
            </div>
            <div class="font14   flex-wrap" v-if="props.row.ansG">G：
              <span v-html="props.row.ansG"></span>
            </div>
          </div>
          <div>
            <div class="font16  fontBlod" v-if="props.row.type == 4">
              【答案】：<span class="font16 ">{{props.row.answer.substr(-1) == 'A' ? '正确' : '错误'}}</span>
            </div>
            <div class="font16  fontBlod" v-else-if="props.row.type == 2 || props.row.type == 3">
              【答案】：<span class="font16 checkanswer" v-for="item in props.row.answer.split(',')" :key="item">
                {{item.substr(-1)}}
              </span>
            </div>
            <div class="font16  fontBlod flex-wrap" v-else-if="props.row.type == 1">
              【答案】：<span class="font16 checkanswer" v-html="props.row.answer"></span>
            </div>
            <div class="font16  fontBlod flex-wrap" v-else>
              【答案】：<span class="font16 checkanswer" v-html="props.row.answer"></span>
            </div>
          </div>
          <div class="font16  fontBlod flex-wrap">【答案解析】<span class="font16 checkanswer" v-html="props.row.analysis"></span></div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container" v-if="total > 0">
      <Pagination 
        @toHandleSizeChange="handleSizeChange"
        @toHandleCurrentChange="handleCurrentChange"
        @toJumpFirstPage="jumpFirstPage"
        @toJumpLastPage="jumpLastPage"
        :fTotal="total"
        :fBtnStartDisabled="btnStartDisabled"
        :fBtnEndDisabled="btnEndDisabled"
        :fPageIndex="pageIndex"
        :fZys="zys"
      >
      </Pagination>
    </div>
    <!-- 添加试题弹窗 -->
    <template>
      <el-drawer
        title="添加试题"
        :show-close='false'
        :visible.sync="addDialog"
        :before-close="handleClose"
        direction="rtl"
        custom-class="demo-drawer"
        ref="drawer"
        >
        <div class="demo-drawer__content">
          <el-form :model="addForm" ref="addForm" :rules="rules">
            <el-form-item label="题型" prop="type">
              <el-radio-group v-model="addForm.type" size="medium">
                <el-radio-button border v-for="item in bankType" :label="item.value" :key="item.value">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="question">
              <QuillEditor @input="getQuestion" :addDialog="isChangeType"></QuillEditor>
            </el-form-item>
            <!-- 填空 -->
            <el-form-item prop="answer" v-if="addForm.type == 1">
              <div class="flex-align-center radiowrap">
                <span class="font14">第一空</span>
                <div class="editorwrap">
                  <el-input @focus="isShowQuillEditorfullone = true" v-if="!isShowQuillEditorfullone"></el-input>
                  <QuillEditor v-if="isShowQuillEditorfullone" @input="getAns($event,'A')" :addDialog="isShowQuillEditorfullone"></QuillEditor>
                </div>
              </div>
              <div class="flex-align-center radiowrap">
                <span class="font14">第二空</span>
                <div class="editorwrap">
                  <el-input @focus="isShowQuillEditorfulltwo = true" v-if="!isShowQuillEditorfulltwo"></el-input>
                  <QuillEditor v-if="isShowQuillEditorfulltwo" @input="getAns($event,'B')" :addDialog="isShowQuillEditorfulltwo"></QuillEditor>
                </div>
              </div>
              <div class="flex-align-center radiowrap">
                <span class="font14">第三空</span>
                <div class="editorwrap">
                  <el-input @focus="isShowQuillEditorfullthree = true" v-if="!isShowQuillEditorfullthree"></el-input>
                  <QuillEditor v-if="isShowQuillEditorfullthree" @input="getAns($event,'C')" :addDialog="isShowQuillEditorfullthree"></QuillEditor>
                </div>
              </div>
            </el-form-item>
            <!-- 单选 -->
            <el-form-item prop="answer" v-else-if="addForm.type == 2">
              <el-radio-group v-model="addForm.answer" class="checkwrap">
                <div class="flex-align-center radiowrap">
                  <el-radio-button label="ansA">A</el-radio-button>
                  <div class="editorwrap">
                    <el-input @focus="isShowQuillEditorA = true" v-if="!isShowQuillEditorA"></el-input>
                    <QuillEditor v-if="isShowQuillEditorA" @input="getAns($event,'A')" :addDialog="addDialog"></QuillEditor>
                  </div>
                </div>
                <div class="flex-align-center radiowrap">
                  <el-radio-button label="ansB">B</el-radio-button>
                  <div class="editorwrap">
                    <el-input @focus="isShowQuillEditorB = true" v-if="!isShowQuillEditorB"></el-input>
                    <QuillEditor v-if="isShowQuillEditorB" @input="getAns($event,'B')" :addDialog="addDialog"></QuillEditor>
                  </div>
                </div>
                <div class="flex-align-center radiowrap">
                  <el-radio-button label="ansC">C</el-radio-button>
                  <div class="editorwrap">
                    <el-input @focus="isShowQuillEditorC = true" v-if="!isShowQuillEditorC"></el-input>
                    <QuillEditor v-if="isShowQuillEditorC" @input="getAns($event,'C')" :addDialog="addDialog"></QuillEditor>
                  </div>
                </div>
                <div class="flex-align-center radiowrap">
                  <el-radio-button label="ansD">D</el-radio-button>
                  <div class="editorwrap">
                    <el-input @focus="isShowQuillEditorD = true" v-if="!isShowQuillEditorD"></el-input>
                    <QuillEditor v-if="isShowQuillEditorD" @input="getAns($event,'D')" :addDialog="addDialog"></QuillEditor>
                  </div>
                </div>
                <div class="flex-align-center radiowrap">
                  <el-radio-button label="ansE">E</el-radio-button>
                  <div class="editorwrap">
                    <el-input @focus="isShowQuillEditorE = true" v-if="!isShowQuillEditorE"></el-input>
                    <QuillEditor v-if="isShowQuillEditorE" @input="getAns($event,'E')" :addDialog="addDialog"></QuillEditor>
                  </div>
                </div>
                <div class="flex-align-center radiowrap">
                  <el-radio-button label="ansF">F</el-radio-button>
                  <div class="editorwrap">
                    <el-input @focus="isShowQuillEditorF = true" v-if="!isShowQuillEditorF"></el-input>
                    <QuillEditor v-if="isShowQuillEditorF" @input="getAns($event,'F')" :addDialog="addDialog"></QuillEditor>
                  </div>
                </div>
                <div class="flex-align-center radiowrap">
                  <el-radio-button label="ansG">G</el-radio-button>
                  <div class="editorwrap">
                    <el-input @focus="isShowQuillEditorG = true" v-if="!isShowQuillEditorG"></el-input>
                    <QuillEditor v-if="isShowQuillEditorG" @input="getAns($event,'G')" :addDialog="addDialog"></QuillEditor>
                  </div>
                </div>
              </el-radio-group>
            </el-form-item>
            <!-- 多选 -->
            <el-form-item prop="answer" v-else-if="addForm.type == 3">
              <el-checkbox-group v-model="checkboxAnswer" class="checkwrap">
                <div class="flex-align-center radiowrap">
                  <el-checkbox-button label="ansA">A</el-checkbox-button>
                  <div class="editorwrap">
                    <el-input @focus="isShowQuillEditorA = true" v-if="!isShowQuillEditorA"></el-input>
                    <QuillEditor v-if="isShowQuillEditorA" @input="getAns($event,'A')" :addDialog="addDialog"></QuillEditor>
                  </div>
                </div>
                <div class="flex-align-center radiowrap">
                  <el-checkbox-button label="ansB">B</el-checkbox-button>
                  <div class="editorwrap">
                    <el-input @focus="isShowQuillEditorB = true" v-if="!isShowQuillEditorB"></el-input>
                    <QuillEditor v-if="isShowQuillEditorB" @input="getAns($event,'B')" :addDialog="addDialog"></QuillEditor>
                  </div>
                </div>
                <div class="flex-align-center radiowrap">
                  <el-checkbox-button label="ansC">C</el-checkbox-button>
                  <div class="editorwrap">
                    <el-input @focus="isShowQuillEditorC = true" v-if="!isShowQuillEditorC"></el-input>
                    <QuillEditor v-if="isShowQuillEditorC" @input="getAns($event,'C')" :addDialog="addDialog"></QuillEditor>
                  </div>
                </div>
                <div class="flex-align-center radiowrap">
                  <el-checkbox-button label="ansD">D</el-checkbox-button>
                  <div class="editorwrap">
                    <el-input @focus="isShowQuillEditorD = true" v-if="!isShowQuillEditorD"></el-input>
                    <QuillEditor v-if="isShowQuillEditorD" @input="getAns($event,'D')" :addDialog="addDialog"></QuillEditor>
                  </div>
                </div>
                <div class="flex-align-center radiowrap">
                  <el-checkbox-button label="ansE">E</el-checkbox-button>
                  <div class="editorwrap">
                    <el-input @focus="isShowQuillEditorE = true" v-if="!isShowQuillEditorE"></el-input>
                    <QuillEditor v-if="isShowQuillEditorE" @input="getAns($event,'E')" :addDialog="addDialog"></QuillEditor>
                  </div>
                </div>
                <div class="flex-align-center radiowrap">
                  <el-checkbox-button label="ansF">F</el-checkbox-button>
                  <div class="editorwrap">
                    <el-input @focus="isShowQuillEditorF = true" v-if="!isShowQuillEditorF"></el-input>
                    <QuillEditor v-if="isShowQuillEditorF" @input="getAns($event,'F')" :addDialog="addDialog"></QuillEditor>
                  </div>
                </div>
                <div class="flex-align-center radiowrap">
                  <el-checkbox-button label="ansG">G</el-checkbox-button>
                  <div class="editorwrap">
                    <el-input @focus="isShowQuillEditorG = true" v-if="!isShowQuillEditorG"></el-input>
                    <QuillEditor v-if="isShowQuillEditorG" @input="getAns($event,'G')" :addDialog="addDialog"></QuillEditor>
                  </div>
                </div>
              </el-checkbox-group>
            </el-form-item>
            <!-- 判断 -->
            <el-form-item prop="answer" v-else-if="addForm.type == 4">
              <el-radio-group v-model="addForm.answer" class="checkwrap">
                <div class="flex-align-center radiowrap">
                  <el-radio-button label="ansA">A</el-radio-button>
                  <div class="">
                    正确
                  </div>
                </div>
                <div class="flex-align-center radiowrap">
                  <el-radio-button label="ansB">B</el-radio-button>
                  <div class="">
                    错误
                  </div>
                </div>
              </el-radio-group>
            </el-form-item>
            <!-- 非填空 判断 选择 -->
            <el-form-item prop="answer" v-else>
              <div class="editorwrap">
                <el-input @focus="isShowQuillEditorAnswer = true" v-if="!isShowQuillEditorAnswer" placeholder="输入答案"></el-input>
                <QuillEditor v-if="isShowQuillEditorAnswer" @input="getAnswer" :addDialog="isShowQuillEditorAnswer"></QuillEditor>
              </div>
            </el-form-item>
            <el-form-item prop="analysis">
              <div class="editorwrap">
                <el-input @focus="isShowQuillEditorAnalysis = true" v-if="!isShowQuillEditorAnalysis" placeholder="输入答案解析"></el-input>
                <QuillEditor v-if="isShowQuillEditorAnalysis" @input="getAnalysis" :addDialog="isShowQuillEditorAnalysis"></QuillEditor>
              </div>
            </el-form-item>
            <el-form-item prop="knowledgepointId">
              <div class="editorwrap">
                <span>知识点</span>
                <el-button type="primary" class="relarionbtn" icon="el-icon-plus"  @click="showKnowledgepoint">关联知识点</el-button>
                <span class="text">{{addForm.knowledgepointId | getKnowledgepointName(that)}}</span>
              </div>
            </el-form-item>
          </el-form>
          <div class="demo-drawer__footer flex-end">
            <el-button @click="cancelForm">取消</el-button>
            <el-button type="primary" class="btn_table_primary" @click="submitQuestions" :loading="loading">{{ loading ? '提交中 ...' : '确定' }}</el-button>
          </div>
        </div>
      </el-drawer>
    </template>
    <template>
      <el-dialog title="关联知识点" :visible.sync="isShowKnowledgepoint" @close="closeAddKnow">
        <div class="knowledgepointwrap">
          <div class="left">
            <div class="header">
              <span class="addKomwLed" @click="isShowAddledgepointName = true">添加知识点</span>
              <el-input v-model="ledgepointName" v-if="isShowAddledgepointName">
                <el-button slot="append" @click="isShowAddledgepointName = false">取消</el-button>
                <el-button slot="append" type="primary" class="btn_table_primary" @click="addledgepointName">确定</el-button>
              </el-input>
            </div>
            <div class="content">
              <div class="textwrap">
                <el-radio-group v-model="lgCheckedKnowledgepointId">
                  <el-radio v-for="item in KnowledgepointList" :label="item.id" :key="item.id">{{item.name}}</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeAddKnow">取消</el-button>
            <el-button type="primary" class="btn_table_primary" @click="suerAddKnowList">确定</el-button>
          </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import {getExamBQuestions,getKnowledgepoint,InsertQuestions,InsertKnowledgepoint} from '@/api/questionBank'
import QuillEditor from '@/components//QuillEditor'
import Pagination from '@/components/Pagination/index'
import forbidden from "@/utils/comMixin"
export default {
  components: {
    Pagination,
    QuillEditor
  },
  mixins:[forbidden],
  data() {
    return {
      that:this,
      list: [],
      listData: [],
      btnStartDisabled: true, //用来判断首页按钮是否禁用
      btnEndDisabled: false, //用来判断尾页按钮是否禁用
      zys: 0, //判断总页数
      total: 0, // 页数
      pageIndex:1,
      pageSize:10,
      bankForm:{},
      bankType:[
        {
          label:'实操',
          value:0
        },
        {
          label:'填空',
          value:1
        },
        {
          label:'单选',
          value:2
        },
        {
          label:'多选',
          value:3
        },
        {
          label:'判断',
          value:4
        },
        {
          label:'简答',
          value:5
        },
        {
          label:'论述',
          value:6
        },
      ],
      KnowledgepointList:[],
      form:{
        BankId:'',
        Type:'',
        KnowledgepointId:'',
      },
      addDialog:false,
      loading:false,
      addForm:{
        bankId:'',
        courseId:'',//课程id
        knowledgepointId:'',//知识点id
        type:"0",//类型
        question:"",//题干
        ansA:"",
        ansB:"",
        ansC:"",
        ansD:"",
        ansE:"",
        ansF:"",
        ansG:"",
        answer:"",
        analysis:"",//答案解析
      },
      rules:{
        type:[{ required: true, message:'请选择题型'}],
      },
      isChangeType:true,
      isShowQuillEditorA:false,
      isShowQuillEditorB:false,
      isShowQuillEditorC:false,
      isShowQuillEditorD:false,
      isShowQuillEditorE:false,
      isShowQuillEditorF:false,
      isShowQuillEditorG:false,
      isShowQuillEditorfullone:false,
      isShowQuillEditorfulltwo:false,
      isShowQuillEditorfullthree:false,
      isShowQuillEditorAnswer:false,
      isShowQuillEditorAnalysis:false,
      isShowKnowledgepoint:false,
      ledgepointName:'', //添加知识点
      isShowAddledgepointName:false,
      addKnowledgepointList:[],
     // glKnowLedgepointList:[],
      lgCheckedKnowledgepointId:'',
      checkboxAnswer:[],//多选数组
      str:'',
    }
  },
  watch:{
    Type:{
      handler(newValue,oldValue){
        if(newValue == 4 || newValue == 2) {
          this.addForm.answer = 'ansA'
        }
        if(newValue != oldValue) {
          this.addForm.knowledgepointId = ''
        //  this.glKnowLedgepointList = []
          this.isChangeType = !this.isChangeType
          this.isShowQuillEditorfullone = this.isShowQuillEditorfulltwo = this.isShowQuillEditorfullthree = false
          this.isShowQuillEditorA = this.isShowQuillEditorB = this.isShowQuillEditorC = this.isShowQuillEditorD = this.isShowQuillEditorE = this.isShowQuillEditorF = this.isShowQuillEditorG = false
          this.isShowQuillEditorAnalysis = this.isShowQuillEditorAnswer = false
        }
      },
      deep:true,
    }
  },
  computed: {
    Type() {
      return this.addForm.type
    }
  },
  mounted() {
    this.bankForm = JSON.parse(sessionStorage.getItem('bankForm'))
    this.form.BankId = this.bankForm.id
    this.getlist()
    this.getKnowledgepointList()
  },
  methods: {
    getAddQuestion() {
      this.isChangeType = !this.isChangeType
      this.addDialog = true
    },
    //确定关联知识点
    suerAddKnowList() {
      // this.glKnowLedgepointList = this.addKnowledgepointList.map(item =>{
      //   let obj = {
      //     id:item.split(',')[0],
      //     name:item.split(',')[1],
      //   }
      //   return obj
      // })
      this.addForm.knowledgepointId = this.lgCheckedKnowledgepointId
      this.isShowKnowledgepoint = false
    },
    //打开知识点弹窗
    showKnowledgepoint() {
      this.addKnowledgepointList = []
      this.isShowKnowledgepoint = true
    },
    closeAddKnow() {
      this.lgCheckedKnowledgepointId = ''
      this.addKnowledgepointList = []
      this.isShowKnowledgepoint = false
    },
    //添加知识点
    addledgepointName() {
      if(this.ledgepointName) {
        var data = {
          courseId : this.bankForm.courseId,
          name:this.ledgepointName
        }
        InsertKnowledgepoint(data).then(res =>{
          if(res.status == 200) {
            this.isShowAddledgepointName = false
            this.getKnowledgepointList()
          }
        })
      }
    },
    getQuestion(value) {
      this.addForm.question = value
    },
    getAns(value,type) {
      switch (type) {
        case 'A' :
        this.addForm.ansA = value
        break;
        case 'B' :
        this.addForm.ansB = value
        break;
        case 'C' :
        this.addForm.ansC = value
        break;
        case 'D' :
        this.addForm.ansD = value
        break;
        case 'E' :
        this.addForm.ansE = value
        break;
        case 'F' :
        this.addForm.ansF = value
        break;
        case 'G' :
        this.addForm.ansG = value
        break;
      }
    },
    getAnswer(value) {
      this.addForm.answer = value
    },
    getAnalysis(value) {
      this.addForm.analysis = value
    },
    submitQuestions() {
      // this.glKnowLedgepointList.forEach(item => {
      //   this.addForm.knowledgepointId += item.id + ','
      // })
      // this.addForm.knowledgepointId = this.addForm.knowledgepointId.substr(0,this.addForm.knowledgepointId.length-1)
      if(this.addForm.type == 3) {
        this.addForm.answer = this.checkboxAnswer.join(',')
      }
      if(this.addForm.type == 1) {
        this.addForm.answer = this.addForm.ansA + ' ' + this.addForm.ansB + ' ' + this.addForm.ansC
      }
      this.addForm.courseId = this.bankForm.courseId
      this.addForm.bankId = this.bankForm.id
      this.$refs.addForm.validate((valid) =>{
        if(valid) {
          var data = this.addForm
          InsertQuestions(data).then(res =>{
            if(res.status == 200) {
              this.addForm = {
                bankId:'',
                courseId:'',//课程id
                knowledgepointId:'',//知识点id
                type:"0",//类型
                question:"",//题干
                ansA:"",
                ansB:"",
                ansC:"",
                ansD:"",
                ansE:"",
                ansF:"",
                ansG:"",
                answer:"",
                analysis:"",
              },
              this.getlist()
              this.cancelForm()
            }
          })
        }
      })
    },
    handleClose(done) {
      return;
    },
    cancelForm() {
      this.loading = false
      this.addDialog = false
      //this.glKnowLedgepointList = []
      this.addForm.knowledgepointId = ''
      this.isChangeType = !this.isChangeType
      this.isShowQuillEditorfullone = this.isShowQuillEditorfulltwo = this.isShowQuillEditorfullthree = false
      this.isShowQuillEditorA = this.isShowQuillEditorB = this.isShowQuillEditorC = this.isShowQuillEditorD = this.isShowQuillEditorE = this.isShowQuillEditorF = this.isShowQuillEditorG = this.isShowQuillEditorAnalysis = this.isShowQuillEditorAnswer = false
      this.$refs.addForm.resetFields()
    },
    goback() {
      this.$router.go(-1)
    },
    getKnowledgepointList() {
      var params = {
        CourseId:this.bankForm.courseId
      }
      getKnowledgepoint(params).then(res =>{
        if(res.status == 200) {
          this.KnowledgepointList = res.data
        }
      })
    },
    getlist() {
      getExamBQuestions(this.form).then(res => {
        if(res.status == 200) {
          this.list = res.data
          this.total = this.list.length
          this.getTableList()
        }
        
      })
    },
    getTableList() {
      this.zys = Math.ceil(this.total / this.pageSize) // 获取总页数
      // 调用混入方法判断首页尾页按钮禁用的方法
      this.forbidden(this.zys, this.pageIndex)
      this.listData = this.list.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageSize * this.pageIndex
      )
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
    },
    // 首页按钮
    jumpFirstPage(val) {
      this.handleCurrentChange(val);
    },
    // 尾页按钮
    jumpLastPage(val) {
      this.handleCurrentChange(val);
    },
  },
  filters: {
    getKnowledgepointName(id,that) {
      let name = ''
      that.KnowledgepointList.forEach(item => {
        if(item.id == id) {
        name = item.name
       }
      })
      return name
    },
    getType(type) {
      if (type == 0) {
        return '实操'
      }
      if (type == 1) {
        return '填空'
      }
      if (type == 2) {
        return '单选'
      }
      if (type == 3) {
        return '多选'
      }
      if (type == 4) {
        return '判断'
      }
      if (type == 5) {
        return '简答'
      }
      if (type == 6) {
        return '论述'
      }
    }
  }
}
</script>
<style lang='less' scoped>
.back {
  cursor: pointer;
  margin-left: 10px;
  color: #5c7fff;
}
.name {
  font-size: 18px;
  margin-bottom: 40px;
}
.title {
  margin:0 20px;
  &:nth-child(1) {
    margin-left:0 ;
  }
}
.el-input,.el-select {
  width: 300px !important;
  margin-right: 10px;
}
.el-table{
  margin-top: 40px !important;
}
/deep/ .demo-drawer {
  width: 70% !important;
  overflow-y: auto;
}
/deep/.el-drawer__header span{
  font-size: 20PX;
  color: #000;
} 
.demo-drawer__content {
  padding: 0 20px;
  /deep/ .el-form-item__label {
    margin-top: 0 !important;
    font-size: 18PX;
  }
  /deep/ .el-radio-button{
    margin: 0 10px;
    .el-radio-button__inner {
      padding: 10px 30px;
      border: 1PX solid #DCDFE6;
      border-radius: 24px;
      font-size: 14PX;
      color: #000;
    }
  }
  /deep/ .el-checkbox-button{
    margin: 0 10px;
    .el-checkbox-button__inner {
      padding: 10px 30px;
      border: 1PX solid #DCDFE6;
      border-radius: 24px;
      font-size: 14PX;
      color: #000;
    }
  }
  /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    border: 1PX solid #5c7fff;
    background-color: #5c7fff;
    color: #fff;
  }
  /deep/ .el-checkbox-button.is-checked .el-checkbox-button__inner {
    border: 1PX solid #5c7fff;
    background-color: #5c7fff;
    color: #fff;
  }
}
.demo-drawer__footer {
  padding: 20px 0;
}
.checkanswer {
  margin-right: 20px;
}
/deep/ .el-table td div {
  margin: 14px 0;
}
.radiowrap {
  margin-bottom: 24px;
}
/deep/ .checkwrap.el-radio-group {
  width: 100% !important;
}
.editorwrap {
  flex: 1;
  width: 100%;
  /deep/ .el-input {
    width: 100% !important;
  }
  .text {
    margin: 0 10px;
  }
}
.relarionbtn {
  border: 1px dashed #5c7fff;
  color: #5c7fff;
  padding: 4px;
  background-color: #fff;
  margin: 0 30px;
  &:hover,&:active,&:focus {
    border: 1px dashed #5c7fff;
    color: #5c7fff;
    padding: 4px;
    background-color: #fff;
  }
}
.addKomwLed {
  font-size: 14PX;
  color: #5c7fff;
  cursor: pointer;
}
/deep/ .el-dialog__body {
  min-height: 300px;
}
.knowledgepointwrap {
  .content {
    margin-top: 30px;
    border-top: 1px solid #eee;
    /deep/.el-radio-group {
      margin-top: 20px;
      // display: block;
    }
    /deep/ .el-radio__label {
      font-size: 14PX;
      vertical-align: middle;
    }
    /deep/.el-radio__inner {
        width: 22px;
        height: 22px;
        vertical-align: bottom;
    }
  }
}
</style>
