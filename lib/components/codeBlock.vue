<template>
<div ref="rootRef">
  <div ref="codeRef" class="raw-code">
    <slot />
  </div>

  <div class="bottom-bar">
    <div class="bottom-bar-item">
      <svg @click="showExecutionResult" v-show="isShowRunButton" 
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" 
        class="run-button" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M19 19H5V5h14m0-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-9 5v8l5-4l-5-4Z"></path></svg>
    </div>
  </div>
  
  <div v-show="isShowResultBlock">
    <div class="language-bash resultdiv">
      <pre class="language-bash resultpre"><code ref="result" lass="resultcode"></code></pre>
    </div>
  </div>

</div>

</template>

<script>
import Prism from 'prismjs'
import hash from "hash-sum";
import 'prismjs/components/prism-bash.js'

import {getExecutionResult, getStandardLanguageName} from "../utils";
import './css/codeBlock.css'

export default {
  props: {
    code: {
      type: String,
    },
    language: {
      type: String,
      default: 'bash'
    },
    result: {
      type: String,
      default: ''
    },
    codeBlockInfo: {}
  },
  data() {
    return {
      isShowResultBlock: false,
      isShowRunButton: true,
      realLanguage: '',
    }
  },
  computed: {
    blockCode: function () {
      const {code} = JSON.parse(decodeURIComponent(this.$props.codeBlockInfo));
      return code || this.$props.code;
    },
    blockLanguage: function () {
      if(this.realLanguage != '') return this.realLanguage;
      const {language} = JSON.parse(decodeURIComponent(this.$props.codeBlockInfo));
      return language || this.$props.language;
    },
    blockName: function () {
      const {name} = JSON.parse(decodeURIComponent(this.$props.codeBlockInfo));
      if(name) {
        return '"' + (name || this.blockLanguage) + '"';
      } else {
        return ""
      }
    }
  },
  mounted: function () {
    const element = this.getBlockCodeElement();
    this.realLanguage = this.getRealLanguage(element);
    this.setCodeBlockName(element);
    this.setIsShowRunButton();
  },
  methods: {
    getBlockCodeElement() {
      const element = this.$refs.codeRef.querySelector('div.raw-code > div[class*="language-"]');
      return element;
    },
    setCodeBlockName(element) {
      if(this.blockName) {
        element.style.setProperty('--content', this.blockName);
      } else {
        let _value = '"' + this.blockLanguage + '"';
        element.style.setProperty('--content', _value)
      }
    },
    getRealLanguage(element) {
      const language = [...element.classList].find((x) => x.includes('language-')).split('-')[1];
      return language;
    },
    setIsShowRunButton() {
      if(getStandardLanguageName(this.blockLanguage) == "") {
        this.isShowRunButton = false;
      }
    },
    async runCode() {
      const result = await getExecutionResult(this.blockLanguage, this.blockCode);
      const {compiler_message, program_message} = result;
      const message = (compiler_message || program_message) || "no output";
      const codeResultBlockHTML = Prism.highlight(message, Prism.languages['bash'], 'bash');
      return codeResultBlockHTML;
    },
    showExecutionResult() {
      const _local = window.sessionStorage.getItem(hash([this.blockLanguage, this.blockCode]));
      if(_local) {
        this.fillResultBlockHTML(_local);
      } else {
        this.runCode().then((codeResultBlockHTML) => {
          window.sessionStorage.setItem(hash([this.blockLanguage, this.blockCode]), codeResultBlockHTML);
          this.fillResultBlockHTML(codeResultBlockHTML);
        })        
      }
    },
    fillResultBlockHTML(HTMLBlock) {
      const codeResultBlock = this.$refs.result;
      codeResultBlock.innerHTML = HTMLBlock;
      this.isShowResultBlock = true;
      this.isShowRunButton = false;
    }
  }
}
</script>

<style scoped>

</style>
