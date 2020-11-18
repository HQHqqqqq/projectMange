<template>
	<div class="key">
		<div v-if="datas.name == '项目关键字' || datas.name == '工程代码'">
			<el-tag :key="tag.index" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">{{ tag }}</el-tag>
		</div>
		<div v-else>
			<el-tag :key="tag.index" v-for="tag in dynamicTagsKey" closable :disable-transitions="false" @close="handleCloseKey(tag)">{{ tag }}</el-tag>
		</div>

		<el-input
			class="input-new-tag"
			v-if="inputVisible"
			v-model="inputValue"
			ref="saveTagInput"
			size="small"
			@keyup.enter.native="handleInputConfirm"
			@blur="handleInputConfirm"
		></el-input>

		<el-button v-else class="button-new-tag" size="small" @click="showInput(datas.name)">+</el-button>
	</div>
</template>

<script>
// import FmUpload from "../components/Upload";
// import FmEditor from "../components/Editor/tinymce";
// import WidgetFormItem from "../components/WidgetFormItem";
// import WidgetConfig from "../components/WidgetConfig";
import Bus from '../../bus';
import { setInterval } from 'timers';
import { mapState, mapActions } from "vuex";
import $ from 'jquery';
var keytechnologyList = '';
var keywordList = '';
export default {
	name: 'key-tag',
	props: ['datas'],
	components: {
		// FmUpload,
		// FmEditor,
		// WidgetFormItem,
		// WidgetConfig
	},
	data() {
		return {
			dynamicTags: [],
			dynamicTagsKey: [],
			inputVisible: false,
			inputValue: '',
			keyLabel: '',
			keyWords: [],
			keytechnology: [],
			projectCode: []
		};
	},
	computed: {
		...mapState([
		  "userinfo" //oa跳转过来的用户信息值
		]),
	},
	created() {
		// console.log(this.datas)
		// if (this.$route.params.id != null && this.$route.params.id != undefined) {
		setTimeout(() => {
			if(this.userinfo.account_id == "8416498716893399290"){
				var item = localStorage.getItem('projectCode');
			}else{
				var item = localStorage.getItem('keyWords');
			}
			if (item) {
				item = item.split(',');
				this.dynamicTags = item;
			}

			var keytechnologys = localStorage.getItem('keytechnologys');
			if (keytechnologys) {
				keytechnologys = keytechnologys.split(',');
				this.dynamicTagsKey = keytechnologys;
			}
		}, 2000);
		if(this.userinfo.account_id == "8416498716893399290"){
			Bus.$on('projectCodes', item => {
				if (item) {
					var item = item.split(',');
					this.dynamicTags = item;
				}
			});
		}else{
			Bus.$on('keyWords', item => {
				if (item) {
					var item = item.split(',');
					this.dynamicTags = item;
				}
			});
		}
		Bus.$on('keytechnologys', item => {
			if (item) {
				var item = item.split(',');
				this.dynamicTagsKey = item;
			}
		});
		setTimeout(() => {
			this.getKey();
		}, 500);
		// }
	},
	methods: {
		handleClose(tag) {
			this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);

			console.log(this.dynamicTags);
			if(this.userinfo.account_id == "8416498716893399290"){
				Bus.$emit('projectCode', this.dynamicTags);
				localStorage.setItem('projectCode', this.dynamicTags);
			}else{
				Bus.$emit('keyword', this.dynamicTags);
				localStorage.setItem('keyword', this.dynamicTags);
			}
			
		},
		handleCloseKey(tag) {
			this.dynamicTagsKey.splice(this.dynamicTagsKey.indexOf(tag), 1);
			Bus.$emit('keytechnology', this.dynamicTagsKey);
			localStorage.setItem('keytechnology', this.dynamicTagsKey);
			console.log(this.dynamicTagsKey);
		},

		showInput(e) {
			// console.log(e)
			this.keyLabel = e;
			this.inputVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},

		handleInputConfirm() {
			let inputValue = this.inputValue;
			console.log(inputValue);
			// console.log(inputValue)//关键字
			// console.log(this.keyLabel)
			if (this.keyLabel == '项目关键字' || this.keyLabel == '工程代码') {
				if (inputValue.length <= 0 || /^\s+$/.test(inputValue)) {
					this.inputVisible = false;
					return false;
				}
				keywordList += ',' + inputValue;
				this.dynamicTags.push(inputValue);
				if (this.keyLabel == '项目关键字') {
					Bus.$emit('keyword', this.dynamicTags);
					localStorage.setItem('keyWords', this.dynamicTags);
				} else {
					Bus.$emit('projectCode', this.dynamicTags);
					localStorage.setItem('projectCode', this.dynamicTags);
				}
			} else if (this.keyLabel == '拟使用的关键技术') {
				if (inputValue.length <= 0 || /^\s+$/.test(inputValue)) {
					this.inputVisible = false;
					return false;
				}
				if (inputValue.length == '') {
					this.inputVisible = false;
					return false;
				}
				keytechnologyList += ',' + inputValue;
				this.dynamicTagsKey.push(inputValue);
				Bus.$emit('keytechnology', this.dynamicTagsKey);
				localStorage.setItem('keytechnologys', this.dynamicTagsKey);
			}
			this.inputVisible = false;
			this.inputValue = '';
		},
		getKey() {
			$('.key')
				.parent()
				.parent()
				.addClass('is-required');
		}
	}
};
</script>

<style scoped>
.el-tag {
	float: left;
}

.el-tag + .el-tag {
	margin-left: 10px;
}

.button-new-tag {
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
	float: left;
}

.input-new-tag {
	width: 90px;
	vertical-align: bottom;
	float: left;
}
</style>
