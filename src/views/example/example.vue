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
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      content: '',
      editorOptions: {
        theme: 'snow', // 默认主题
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
            ['blockquote', 'code-block'], // 引用，代码块
            [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
            [{ list: 'ordered' }, { list: 'bullet' }], // 列表
            [{ script: 'sub' }, { script: 'super' }], // 上下标
            [{ indent: '-1' }, { indent: '+1' }], // 缩进
            [{ direction: 'rtl' }], // 文本方向
            [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题
            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
            [{ font: [] }], // 字体
            [{ align: [] }], // 对齐方式
            ['clean'], // 清除字体样式
            ['image', 'video'] // 上传图片、上传视频
          ]
        },
        placeholder: '请输入'
      }
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
      console.log('editor change!', quill, html, text)
      this.content = html
    }
  }
}
</script>
<style lang='less'>
.quill-editor {
  width: 800px;
}
.ql-editor {
  min-height: 300px;
}
.editor {
  line-height: normal !important;
  height: 800px;
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

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
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
</style>
