<template>
  <div class="example">
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOptions"
      @change="onEditorChange($event)"
      @ready="onEditorReady($event)"
    >
    </quill-editor>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import * as Quill from 'quill'
import ImageResize from 'quill-image-resize-module'
Quill.register('modules/imageResize', ImageResize)
import {ImageDrop} from 'quill-image-drop-module'
Quill.register('modules/imageDrop', ImageDrop)
const titleConfig = [
  { Choice: '.ql-insertMetric', title: '跳转配置' },
  { Choice: '.ql-bold', title: '加粗' },
  { Choice: '.ql-italic', title: '斜体' },
  { Choice: '.ql-underline', title: '下划线' },
  { Choice: '.ql-header', title: '段落格式' },
  { Choice: '.ql-strike', title: '删除线' },
  { Choice: '.ql-blockquote', title: '块引用' },
  { Choice: '.ql-code', title: '插入代码' },
  { Choice: '.ql-code-block', title: '插入代码段' },
  { Choice: '.ql-font', title: '字体' },
  { Choice: '.ql-size', title: '字体大小' },
  { Choice: '.ql-list[value="ordered"]', title: '编号列表' },
  { Choice: '.ql-list[value="bullet"]', title: '项目列表' },
  { Choice: '.ql-direction', title: '文本方向' },
  { Choice: '.ql-header[value="1"]', title: 'h1' },
  { Choice: '.ql-header[value="2"]', title: 'h2' },
  { Choice: '.ql-align', title: '对齐方式' },
  { Choice: '.ql-color', title: '字体颜色' },
  { Choice: '.ql-background', title: '背景颜色' },
  { Choice: '.ql-image', title: '图像' },
  { Choice: '.ql-video', title: '视频' },
  { Choice: '.ql-link', title: '添加链接' },
  { Choice: '.ql-formula', title: '插入公式' },
  { Choice: '.ql-clean', title: '清除字体格式' },
  { Choice: '.ql-emoji', title: '表情包' },
  { Choice: '.ql-script[value="sub"]', title: '下标' },
  { Choice: '.ql-script[value="super"]', title: '上标' },
  { Choice: '.ql-indent[value="-1"]', title: '向左缩进' },
  { Choice: '.ql-indent[value="+1"]', title: '向右缩进' },
  { Choice: '.ql-header .ql-picker-label', title: '标题大小' },
  { Choice: '.ql-header .ql-picker-item[data-value="1"]', title: '标题一' },
  { Choice: '.ql-header .ql-picker-item[data-value="2"]', title: '标题二' },
  { Choice: '.ql-header .ql-picker-item[data-value="3"]', title: '标题三' },
  { Choice: '.ql-header .ql-picker-item[data-value="4"]', title: '标题四' },
  { Choice: '.ql-header .ql-picker-item[data-value="5"]', title: '标题五' },
  { Choice: '.ql-header .ql-picker-item[data-value="6"]', title: '标题六' },
  { Choice: '.ql-header .ql-picker-item:last-child', title: '标准' },
  { Choice: '.ql-size .ql-picker-item[data-value="small"]', title: '小号' },
  { Choice: '.ql-size .ql-picker-item[data-value="large"]', title: '大号' },
  { Choice: '.ql-size .ql-picker-item[data-value="huge"]', title: '超大号' },
  { Choice: '.ql-size .ql-picker-item:nth-child(2)', title: '标准' },
  { Choice: '.ql-align .ql-picker-item:first-child', title: '居左对齐' },
  { Choice: '.ql-align .ql-picker-item[data-value="center"]', title: '居中对齐' },
  { Choice: '.ql-align .ql-picker-item[data-value="right"]', title: '居右对齐' },
  { Choice: '.ql-align .ql-picker-item[data-value="justify"]', title: '两端对齐' }
]

// 设置字体大小
const fontSizeStyle = Quill.import('attributors/style/size') // 引入这个后会把样式写在style上
fontSizeStyle.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px']
Quill.register(fontSizeStyle, true)

// 设置字体样式
const Font = Quill.import('attributors/style/font') // 引入这个后会把样式写在style上
const fonts = [
    'Microsoft-YaHei',
    'SimSun',
    'SimHei',
    'KaiTi',
    'FangSong'
]
Font.whitelist = fonts // 将字体加入到白名单
Quill.register(Font, true)
export default {
  components: {
    quillEditor
  },
  props: {
    value: {
      type: String,
    },
    addDialog: {
      type:Boolean,
      default:true,
    }
  },
  data() {
    return {
      content: this.value,
      editorOptions: {
        theme: 'snow', // 默认主题
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
            [{ align: [] }], // 对齐方式-----[{ align: [] }]
            [{ size: fontSizeStyle.whitelist }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
            [{ font: fonts }], // 字体种类-----[{ font: [] }]
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
            // [{ direction: 'ltl' }], // 文本方向-----[{'direction': 'rtl'}]
            // [{ direction: 'rtl' }], // 文本方向-----[{'direction': 'rtl'}]
            [{ indent: '-1' }, { indent: '+1' }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
            [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
          //  [{ script: 'sub' }, { script: 'super' }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
            ['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
            ['clean'], // 清除文本格式-----['clean']
            ['image'] // 链接、图片、视频-----['link', 'image', 'video']
          ],
          imageResize:{
            displayStyle:{
              backgroundColor:'black',
              border:'none',
              color:'white'
            },
          } 
        },
        placeholder: '请输入'
      }
    }
  },
  watch:{
    addDialog:{
      handler(newValue,oldValue) {
        if(newValue != oldValue) {
          this.content = ''
          this.$emit('input','')
        }
      },
      deep:true
    }
  },
  mounted() {},
  methods: {
    onEditorReady(quill) {
      for (const item of titleConfig) {
        const tip = document.querySelector('.quill-editor ' + item.Choice)
        if (!tip) continue
        tip.setAttribute('title', item.title)
      }
    },
    // 内容改变事件
    onEditorChange({ quill, html, text }) {
      this.$emit('input',html)
    }
  }
}
</script>
<style lang='less'>
.ql-editor {
  min-height: 0;
  height: 100px !important;
}
.quill-editor{
  line-height: normal;
  width: 100%;
  .ql-container.ql-snow{
      line-height: normal !important;
      height: 100px !important;
      font-size:14px;
  }
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
.ql-picker.ql-size {
    .ql-picker-label[data-value="12px"]::before,
    .ql-picker-item[data-value="12px"]::before {
        content: '12px';
    }
    .ql-picker-label[data-value="14px"]::before,
    .ql-picker-item[data-value="14px"]::before {
        content: '14px';
    }
    .ql-picker-label[data-value="16px"]::before,
    .ql-picker-item[data-value="16px"]::before {
        content: '16px';
    }
    .ql-picker-label[data-value="18px"]::before,
    .ql-picker-item[data-value="18px"]::before {
        content: '18px';
    }
    .ql-picker-label[data-value="20px"]::before,
    .ql-picker-item[data-value="20px"]::before {
        content: '20px';
    }
    .ql-picker-label[data-value="24px"]::before,
    .ql-picker-item[data-value="24px"]::before {
        content: '24px';
    }
    .ql-picker-label[data-value="28px"]::before,
    .ql-picker-item[data-value="28px"]::before {
        content: '28px';
    }
    .ql-picker-label[data-value="32px"]::before,
    .ql-picker-item[data-value="32px"]::before {
        content: '32px';
    }
    .ql-picker-label[data-value="36px"]::before,
    .ql-picker-item[data-value="36px"]::before {
        content: '36px';
    }
}
.ql-picker.ql-font{
  .ql-picker-label[data-value="SimSun"]::before,
  .ql-picker-item[data-value="SimSun"]::before {
      content: "宋体";
      font-family: "SimSun" !important;
  }
  .ql-picker-label[data-value="SimHei"]::before,
  .ql-picker-item[data-value="SimHei"]::before {
      content: "黑体";
      font-family: "SimHei";
  }
  .ql-picker-label[data-value="Microsoft-YaHei"]::before,
  .ql-picker-item[data-value="Microsoft-YaHei"]::before {
      content: "微软雅黑";
      font-family: "Microsoft YaHei";
  }
  .ql-picker-label[data-value="KaiTi"]::before,
  .ql-picker-item[data-value="KaiTi"]::before {
      content: "楷体";
      font-family: "KaiTi" !important;
  }
  .ql-picker-label[data-value="FangSong"]::before,
  .ql-picker-item[data-value="FangSong"]::before {
      content: "仿宋";
      font-family: "FangSong";
  }
}
</style>
