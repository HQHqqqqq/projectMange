<template>
	<el-form-item :label="widget_copy.isShow == 'true' ? widget_copy.name : ''" :prop="widget_copy.model" :rules="widget_copy.rules">
		<!-- {{widget_copy}} -->
		<template v-if="widget_copy.type == 'input'">
			<el-input v-if="
          widget_copy.options.dataType == 'number' ||
            widget_copy.options.dataType == 'integer' ||
            widget_copy.options.dataType == 'float'
        "
			 :type="widget_copy.options.dataType" v-model.number="dataModel" :placeholder="widget_copy.options.placeholder"
			 :value="widget_copy.options.defaultValue" :readonly="widget_copy.options.readonly" :disabled="widget_copy.options.disabled"
			 :clearable="widget_copy.options.clearable" :style="{ width: widget_copy.options.width }" />
			<el-input v-else :type="widget_copy.options.dataType" v-model="dataModel" :placeholder="widget_copy.options.placeholder"
			 :readonly="widget_copy.options.readonly" :disabled="widget_copy.options.disabled" :clearable="widget_copy.options.clearable"
			 :value="widget_copy.options.defaultValue" :style="{ width: widget_copy.options.width }" />
		</template>

		<template v-if="widget_copy.type == 'input2'">
			<el-input :type="widget_copy.options.dataType" v-model="widget_copy.options.defaultValue" :placeholder="widget_copy.options.placeholder"
			 :url="widget_copy.options.url" :style="{ width: widget_copy.options.width }" :disabled="widget_copy.options.disabled"></el-input>
		</template>

		<template v-if="widget_copy.type == 'inputguotu'">
			<el-input type="number" v-model="dataModel" @blur="UpdateTaskName($event)" :placeholder="widget_copy.options.placeholder"
			 :url="widget_copy.options.url" :style="{ width: widget_copy.options.width }" :disabled="widget_copy.options.disabled"></el-input>
		</template>

		<template v-if="widget_copy.type == 'inputguotulevel'">
			<el-input :type="widget_copy.options.dataType" v-model="dataModel" :placeholder="widget_copy.options.placeholder"
			 :url="widget_copy.options.url" :style="{ width: widget_copy.options.width }" :disabled="widget_copy.options.disabled"></el-input>
		</template>

		<!--<template v-if="widget_copy.type == 'input'">-->
		<!--<el-input-->
		<!--v-if="widget_copy.options.dataType == 'number' || widget_copy.options.dataType == 'integer' || widget_copy.options.dataType == 'float'"-->
		<!--:type="widget_copy.options.dataType"-->
		<!--v-model.number="dataModel"-->
		<!--:placeholder="widget_copy.options.placeholder"-->
		<!--:value="widget_copy.options.defaultValue"-->
		<!--:readonly="widget_copy.options.readonly"-->
		<!--:disabled="widget_copy.options.disabled"-->
		<!--:clearable="widget_copy.options.clearable"-->
		<!--:style="{width: widget_copy.options.width}"-->
		<!--/>-->
		<!--<el-input-->
		<!--v-else-->
		<!--:type="widget_copy.options.dataType"-->
		<!--v-model="dataModel"-->
		<!--:placeholder="widget_copy.options.placeholder"-->
		<!--:readonly="widget_copy.options.readonly"-->
		<!--:disabled="widget_copy.options.disabled"-->
		<!--:clearable="widget_copy.options.clearable"-->
		<!--:value="widget_copy.options.defaultValue"-->
		<!--:style="{width: widget_copy.options.width}"-->
		<!--/>-->
		<!--</template>-->
		<!-- hq -->
		<template v-if="widget_copy.type == 'divider'">
			<!-- <Divider class="ivider" ></Divider> -->
			<el-collapse></el-collapse>
		</template>

		<template v-if="widget_copy.type == 'row'">
			<el-row>
				<el-col>
					<div class="grid-content bg-purple wordTitle">{{ widget_copy.options.placeholder }}</div>
				</el-col>
			</el-row>
		</template>
		<template v-if="widget_copy.type == 'row2'">
			<el-row>
				<el-col>
					<div class="grid-content bg-purple word">{{ widget_copy.options.placeholder }}</div>
				</el-col>
			</el-row>
		</template>
		<template v-if="widget.type == 'row3'">
			<el-row>
				<el-col>
					<div class="grid-content bg-purple wordLeft">{{ widget.options.placeholder }}</div>
				</el-col>
			</el-row>
		</template>

		<template v-if="widget_copy.type == 'button'">
			<el-button type="primary" v-model="dataModel" :placeholder="widget_copy.options.placeholder" :style="{ width: widget_copy.options.width }"
			 :url="widget_copy.options.url">
				{{ widget_copy.options.placeholder }}</el-button>
		</template>
		<!-- <template v-if="widget.type == 'button2'">
			<el-button type="primary" class="button2" v-model="dataModel" :placeholder="widget.options.placeholder" :style="{width: widget.options.width}"
			 :url="widget.options.url" @click="hetong(widget.options.placeholder)" :disabled="disabled">{{widget.options.placeholder}}</el-button>
    </template>-->

		<template v-if="widget_copy.type == 'table'">
			<el-table :style="{ width: widget_copy.options.width }" v-model="dataModel">
				<el-table-column prop="date" label="日期" width="180"></el-table-column>
				<el-table-column prop="name" label="姓名" width="180"></el-table-column>
				<el-table-column prop="address" label="地址"></el-table-column>
			</el-table>
		</template>
		<!-- hq -->

		<template v-if="widget_copy.type == 'textarea'">
			<el-input :rows="5" :type="widget_copy.options.dataType" v-model="dataModel" :placeholder="widget_copy.options.placeholder"
			 :style="{ width: widget_copy.options.width }" type="textarea" />
		</template>

		<template v-if="widget_copy.type == 'textarea2'">
			<el-input :rows="5" v-model="widget_copy.options.defaultValue" :placeholder="widget_copy.options.placeholder" :style="{ width: widget_copy.options.width }"
			 type="textarea" />
		</template>

		<template v-if="widget_copy.type == 'number'">
			<el-input-number v-model="widget_copy.options.defaultValue" :style="{ width: widget_copy.options.width }" :step="widget_copy.options.step"
			 controls-position="right" />
		</template>

		<template v-if="widget_copy.type == 'radio'">
			<el-radio-group v-model="dataModel" :style="{ width: widget_copy.options.width }">
				<el-radio v-for="(item, index) in widget_copy.options.remote
            ? widget_copy.options.remoteOptions
            : widget_copy.options.options"
				 :style="{
            display: widget_copy.options.inline ? 'inline-block' : 'block'
          }" :label="item.value"
				 :key="index" @change="changehandleradio(item)">
					<template v-if="widget_copy.options.remote">
						{{
            item.label
            }}
					</template>
					<template v-else>
						{{
            widget_copy.options.showLabel ? item.label : item.value
            }}
					</template>
				</el-radio>
			</el-radio-group>
		</template>

		<template v-if="widget_copy.type == 'checkbox'">
			<el-checkbox-group v-model="dataModel" :style="{ width: widget_copy.options.width }">
				<el-checkbox v-for="(item, index) in widget_copy.options.remote
            ? widget_copy.options.remoteOptions
            : widget_copy.options.options"
				 :style="{
            display: widget_copy.options.inline ? 'inline-block' : 'block'
          }" :label="item.value"
				 :key="index">
					<template v-if="widget_copy.options.remote">
						{{
            item.label
            }}
					</template>
					<template v-else>
						{{
            widget_copy.options.showLabel ? item.label : item.value
            }}
					</template>
				</el-checkbox>
			</el-checkbox-group>
		</template>

		<template v-if="widget_copy.type == 'checkboxSingle'">
			<el-checkbox @change="childProject" v-model="ckeckVal">是否是子项目</el-checkbox>
		</template>

		<template v-if="widget_copy.type == 'time'">
			<el-time-picker v-model="dataModel" :is-range="widget_copy.options.isRange" :placeholder="widget_copy.options.placeholder"
			 :start-placeholder="widget_copy.options.startPlaceholder" :end-placeholder="widget_copy.options.endPlaceholder"
			 :readonly="widget_copy.options.readonly" :disabled="widget_copy.options.disabled" :editable="widget_copy.options.editable"
			 :clearable="widget_copy.options.clearable" :arrow-control="widget_copy.options.arrowControl" :value-format="
          widget_copy.options.timestamp
            ? 'timestamp'
            : widget_copy.options.format
        "
			 :style="{ width: widget_copy.options.width }" />
		</template>

		<template v-if="widget_copy.type == 'date'">
			<el-date-picker v-model="dataModel" :type="widget_copy.options.type" :placeholder="widget_copy.options.placeholder"
			 :start-placeholder="widget_copy.options.startPlaceholder" :end-placeholder="widget_copy.options.endPlaceholder"
			 :readonly="widget_copy.options.readonly" :disabled="widget_copy.options.disabled" :editable="widget_copy.options.editable"
			 :clearable="widget_copy.options.clearable" :value-format="
          widget_copy.options.timestamp
            ? 'timestamp'
            : widget_copy.options.format
        "
			 :format="widget_copy.options.format" :style="{ width: widget_copy.options.width }" />
		</template>

		<template v-if="widget_copy.type == 'rate'">
			<el-rate v-model="dataModel" :max="widget_copy.options.max" :disabled="widget_copy.options.disabled" :allow-half="widget_copy.options.allowHalf" />
		</template>

		<template v-if="widget_copy.type == 'color'">
			<el-color-picker v-model="dataModel" :disabled="widget_copy.options.disabled" :show-alpha="widget_copy.options.showAlpha" />
		</template>

		<!-- 项目团队 hq-->
		<template v-if="widget_copy.type == 'team'">
			<Myteam :datas="widget_copy"></Myteam>
		</template>

		<!-- 经验教训 hq-->
		<template v-if="widget_copy.type == 'conclusion'">
			<conclusion :datas="widget_copy"></conclusion>
		</template>

		<!-- 项目拆分 hq-->
		<template v-if="widget_copy.type == 'projectsplit'">
			<projectsplit :datas="widget_copy"></projectsplit>
		</template>

		<!-- 合同关联 hq-->
		<template v-if="widget_copy.type == 'contractassociated'">
			<contractassociated :datas="widget_copy"></contractassociated>
		</template>

		<!-- 协同信息 hq-->
		<template v-if="widget_copy.type == 'synergyInformation'">
			<synergyInformation :datas="widget_copy"></synergyInformation>
		</template>

		<!-- 客户联系人 hq-->
		<template v-if="widget_copy.type == 'customer'">
			<customercontact :datas="widget_copy"></customercontact>
		</template>

		<!-- 关键字 hq-->
		<template v-if="widget_copy.type == 'tag'">
			<key-tag :datas="widget_copy"></key-tag>
		</template>

		<!-- 异常结项 hq-->
		<template v-if="widget_copy.type == 'abnormal'">
			<abnormal :datas="widget_copy"></abnormal>
		</template>

		<template v-if="widget_copy.type == 'myTable'">
			<myTable :datas="widget_copy"></myTable>
		</template>

		<!--项目列表 hubo-->
		<template v-if="widget_copy.type == 'projectList'">
			<project-list :datas="widget_copy"></project-list>
		</template>

		<!--合同列表 hubo-->
		<template v-if="widget_copy.type == 'contractList'">
			<contract-list :datas="widget_copy"></contract-list>
		</template>

		<!--非合同列表 hubo-->
		<template v-if="widget_copy.type == 'notContractList'">
			<not-contract-list :datas="widget_copy"></not-contract-list>
		</template>

		<!--销售下拉选框组件 hubo-->
		<template v-if="widget_copy.type == 'marketSelect'">
			<market-select :datas="widget_copy"></market-select>
		</template>
		
		<!-- 工程代码 hq -->
		<template v-if="widget_copy.type == 'ProjectCode'">
		  <ProjectCode :datas="widget_copy"></ProjectCode>
		</template>

		<!--项目信息变更列表 hubo-->
		<template v-if="widget_copy.type == 'projectChange'">
			<project-change-list :datas="widget_copy"></project-change-list>
		</template>

		<!--应用列表 CFF-->
		<template v-if="widget_copy.type == 'application'">
			<application :datas="widget_copy"></application>
		</template>

		<!--项目看板 hb-->
		<template v-if="widget_copy.type == 'managementHome'">
			<management-home :datas="widget_copy"></management-home>
		</template>

		<!--核算详情 CFF-->
		<template v-if="widget_copy.type == 'adjust'">
			<adjust :datas="widget_copy"></adjust>
		</template>

		<!--任务目标盘点 CFF-->
		<template v-if="widget_copy.type == 'taskobjectory'">
			<task-object :datas="widget_copy"></task-object>
		</template>

		<!--菜单树 hubo-->
		<template v-if="widget_copy.type == 'tree'">
			<my-tree :datas="widget_copy"></my-tree>
		</template>


		<!--分包项目列表 hubo-->
		<template v-if="widget_copy.type == 'subPackageList'">
			<sub-package-list :datas="widget_copy"></sub-package-list>
		</template>

		<!--tab hubo-->
		<template v-if="widget_copy.type == 'tabs'">
			<my-tabs :datas="widget_copy"></my-tabs>
		</template>

		<!--里程碑组件 lmg-->
		<template v-if="widget_copy.type == 'milestone'">
			<project-milestone :datas="widget_copy"></project-milestone>
		</template>

		<!--里程碑 单独组件 lmg-->
		<template v-if="widget_copy.type == 'milepost'">
			<milepost :datas="widget_copy"></milepost>
		</template>

		<!--项目风险组件 lmg-->
		<template v-if="widget_copy.type == 'projectrisk'">
			<project-risk :datas="widget_copy"></project-risk>
		</template>

		<!--保证金综合查询 lmg-->
		<template v-if="widget_copy.type == 'cashDeposit'">
			<cash-deposit :datas="widget_copy"></cash-deposit>
		</template>

		<!--项目核算组件 lmg-->
		<template v-if="widget_copy.type == 'projectaccount'">
			<project-account :datas="widget_copy"></project-account>
		</template>

		<!--里程碑模板配置 lmg-->
		<template v-if="widget_copy.type == 'milestonetemplate'">
			<milestone-template :datas="widget_copy"></milestone-template>
		</template>

		<!-- 预警组件 -->
		<template v-if="widget.type == 'warningCard'">
			<warning-card :datas="widget"></warning-card>
		</template>

		<!-- 预算分配组件 -->
		<template v-if="widget.type == 'budgetAllocation'">
			<budget-allocation :datas="widget"></budget-allocation>
		</template>

		<!-- 月度产值组件 -->
		<template v-if="widget.type == 'mounthOutput'">
			<mounth-output :datas="widget"></mounth-output>
		</template>
		<!-- 月度产值组件国图 -->
		<template v-if="widget.type == 'mounthOutputNew'">
			<mounth-outputNew :datas="widget"></mounth-outputNew>
		</template>

		<!-- 在建项目剩余合同产值组件 -->
		<template v-if="widget.type == 'residueOutput'">
			<residue-output :datas="widget"></residue-output>
		</template>

		<!-- 已关联已分配 剩余合同产值组件 -->
		<template v-if="widget.type == 'associatedOutput'">
			<associated-output :datas="widget"></associated-output>
		</template>

		<!-- 未关联剩余合同产值组件 -->
		<template v-if="widget.type == 'notAssociatedOutput'">
			<not-associated-output :datas="widget"></not-associated-output>
		</template>

		<!-- 财务组件 -->
		<template v-if="widget.type == 'financialCard'">
			<financial-card :datas="widget"></financial-card>
		</template>

		<!-- 项目信息基本组件 -->
		<template v-if="widget.type == 'homeBaseMsg'">
			<home-base-msg :datas="widget"></home-base-msg>
		</template>

		<!-- 待审文档 -->
		<template v-if="widget.type == 'pendingDocument'">
			<pending-document :datas="widget"></pending-document>
		</template>
		<!-- 分包合同付款信息 -->
		<template v-if="widget.type == 'paymentInformation'">
			<payment-Information :datas="widget"></payment-Information>
		</template>
		<!-- 分包合同信息 -->
		<template v-if="widget.type == 'contractInformation'">
			<contract-Information :datas="widget"></contract-Information>
		</template>

		<template v-if="widget_copy.type == 'select'">
			<!-- {{widget_copy.options.remoteOptions}} -->
			<!-- {{widget}} -->
			<div style="display: none;">{{ widget_copy.options }}</div>
			<!-- {{widget_copy.options.remoteOptions}} -->
			<el-select v-model="dataModel" :disabled="widget_copy.options.disabled" :multiple="widget_copy.options.multiple"
			 :clearable="widget_copy.options.clearable" filterable :placeholder="widget_copy.options.placeholder" :style="{ width: widget_copy.options.width }"
			 :url="widget_copy.options.url" :listen="widget_copy.listen">
				<el-option v-for="item in widget_copy.options.remote
            ? widget_copy.options.remoteOptions
            : widget_copy.options.options"
				 :key="item.parent_id" :id="item.id" :label="
            Object.keys(widget_copy.options).indexOf('listen') >= 0
              ? item.label
              : item.value
          "
				 :value="item.parent_id || item.items == 'yes' ? item : item.value">
					<!-- {{item}} -->
				</el-option>
				<!-- <el-option v-for="item in widget_copy.options.remoteOptions" :key="item.value" :id="item.id" :value="item.value" :mystr=[item.parent_id,item.value]
        :label="widget_copy.options.remoteOptions ? item.label:item.value"/>-->

				<!-- <el-option v-for="item in widget_copy.options.levels" :key="item.value" :id="item.id" :value="item.value" :label="widget_copy.options.levels ? item.label:item.value"/> -->
				<!-- 		<el-option v-for="item in widget_copy.options.levels" :key="item.value" :id="item.id" :value="item.value" :label="widget_copy.options.showLabel || widget_copy.options.remote?item.label:item.value" v-if="widget_copy.name == '项目级别'"/>

        <el-option v-for="item in (widget_copy.options.remote ? widget_copy.options.remoteOptions : widget_copy.options.options)" :key="item.value" :value="item.value" :label="widget_copy.options.showLabel || widget_copy.options.remote?item.label:item.value" v-else/>-->
			</el-select>
		</template>

		<template v-if="widget_copy.type == 'selectguotu'">
			<div style="display: none;">{{ widget_copy.options }}</div>
			<el-select v-model="dataModel" :disabled="widget_copy.options.disabled" :multiple="widget_copy.options.multiple"
			 :clearable="widget_copy.options.clearable" filterable :placeholder="widget_copy.options.placeholder" :style="{ width: widget_copy.options.width }"
			 :url="widget_copy.options.url" :listen="widget_copy.listen">
				<el-option v-for="(item, index) in professionalWorkTypes" :key="index" :label="item.value" :value="item.value">
				</el-option>
			</el-select>
		</template>

		<template v-if="widget_copy.type == 'cascader'">
			<el-cascader v-model="dataModel" :options="
          widget_copy.options.remote
            ? widget_copy.options.remoteOptions
            : widget_copy.options.options
        "
			 :disabled="widget_copy.options.disabled" :clearable="widget_copy.options.clearable" :placeholder="widget_copy.options.placeholder"
			 :style="{ width: widget_copy.options.width }" />
		</template>

		<template v-if="widget_copy.type == 'switch'">
			<el-switch v-model="dataModel" :disabled="widget_copy.options.disabled" />
		</template>

		<template v-if="widget_copy.type == 'slider'">
			<el-slider v-model="dataModel" :min="widget_copy.options.min" :max="widget_copy.options.max" :disabled="widget_copy.options.disabled"
			 :step="widget_copy.options.step" :show-input="widget_copy.options.showInput" :range="widget_copy.options.range"
			 :style="{ width: widget_copy.options.width }" />
		</template>
		<template v-if="widget_copy.type == 'upload'">
			<el-upload :file-list="dataModel" :disabled="widget_copy.options.disabled" :style="{ width: widget_copy.options.width }"
			 :action="widget_copy.options.action" :limit="widget_copy.options.limit" :multiple="widget_copy.options.multiple"
			 :on-change="handleChange" :drag="widget_copy.options.drag" class="upload-demo">
				<i v-if="widget_copy.options.drag" class="el-icon-upload" />

				<div v-if="widget_copy.options.drag" class="el-upload__text">
					将文件拖到此处，或
					<em>点击上传</em>
				</div>

				<el-button v-if="!widget_copy.options.drag" size="small" type="primary">点击上传</el-button>
			</el-upload>
		</template>

		<template v-if="widget_copy.type == 'imgupload'">
			<fm-upload v-model="dataModel" :disabled="widget_copy.options.disabled" :style="{ width: widget_copy.options.width }"
			 :width="widget_copy.options.size.width" :height="widget_copy.options.size.height" :token="widget_copy.options.token"
			 :domain="widget_copy.options.domain" />
		</template>

		<template v-if="widget_copy.type == 'button2'">
			<el-button type="primary" class="button2" @click="hetong(widget.options.placeholder)" :disabled="disabled">关联合同
			</el-button>
		</template>

		<template>
			<div class="bg" v-if="!show"></div>

			<el-row v-if="!show" class="el-message-box">
				<el-col :span="24">
					<div class="el-message-box__header">
						<div class="el-message-box__title">
							<span>关联合同</span>
						</div>

						<button type="button" aria-label="Close" class="el-message-box__headerbtn" @click="close()">
							<i class="el-message-box__close el-icon-close"></i>
						</button>
					</div>
				</el-col>
				<el-col :span="24" style="padding: 15px 15px 15px 15px;">
					<el-select v-model="value" filterable placeholder="请选择" style="width: 100%;" @change="indexSelect">
						<el-option v-for="item in options" :key="item.contractNumber" :label="item.contractName" :value="item.contractNumber"></el-option>
					</el-select>
				</el-col>
				<el-col :span="24">
					<el-button type="primary" class="contractMain" @click="contractMain()">确定</el-button>
				</el-col>
			</el-row>
		</template>
	</el-form-item>
</template>

<script>
	import $ from "jquery";
	import Bus from "../../bus";
	import keyTag from "../CreateForm/keyTag"; //tag标签
	import FmUpload from "./Upload";
	import {
		getContract
	} from "../../api/api.js";
	import {
		getPersonInfor
	} from "../../api/api.js";
	import {
		getParentProject
	} from "../../api/api.js";
	import Myteam from "../CreateForm/myteam";
	import ProjectList from "../CreateForm/ProjectList";
	import ContractList from "../CreateForm/ContractList";
	import MarketSelect from "../CreateForm/MarketSelect";
	import abnormal from "../CreateForm/abnormal";
	import ProjectChangeList from "../CreateForm/ProjectChangeList";
	import MyTree from "../CreateForm/MyTree";
	import MyTabs from "../CreateForm/MyTabs";
	import ProjectMilestone from "./ProjectMilestone";
	import Milepost from "./Milepost";
	import ProjectRisk from "./ProjectRisk";
	import MilestoneTemplate from "./MilestoneTemplate"; //里程碑模板配置
	import ProjectAccount from "./ProjectAccount";
	import customercontact from "../CreateForm/CustomerContact";
	import myTable from "../CreateForm/myTable";
	import FinancialCard from "../CreateForm/FinancialCard";
	import WarningCard from "../CreateForm/WarningCard";
	import HomeBaseMsg from "../CreateForm/HomeBaseMsg";
	import Application from "../CreateForm/Application";
	import ManagementHome from "../CreateForm/ManagementHome";
	import Adjust from "../CreateForm/Adjust";
	import TaskObject from "../CreateForm/TaskObject";
	import {
		getProjectStart
	} from "../../api/api.js";
	import {
		mapState,
		mapActions
	} from "vuex";
	import conclusion from "../CreateForm/conclusion";
	import projectsplit from "../CreateForm/projectsplit";
	import contractassociated from "../CreateForm/contractassociated";
	import synergyInformation from "../CreateForm/synergyInformation";
	import notContractList from "../CreateForm/notContractList";
	import mounthOutput from "../CreateForm/MounthOutput";
	import mounthOutputNew from "../CreateForm/MounthOutputNew";
	import associatedOutput from "../CreateForm/associatedOutput";
	import notAssociatedOutput from "../CreateForm/notAssociatedOutput";
	import BudgetAllocation from "../CreateForm/BudgetAllocation"; //预算拆分组件
	import ResidueOutput from "../CreateForm/ResidueOutput"; //预算拆分组件
	import cashDeposit from "../CreateForm/cashDepositList"; //保证金综合查询组件

	import pendingDocument from "../CreateForm/pendingDocument"; //待审文档
	import ProjectCode from "../CreateForm/ProjectCode"
	import subPackageList from "../CreateForm/subPackageList"
	import paymentInformation from "../CreateForm/paymentInformation"
	import contractInformation from "../CreateForm/contractInformation"
	var datas = [];
	let widget_copy = [];
	var self = this;
	var str = window.location.href;
	export default {
		components: {
			ProjectMilestone,
			Milepost,
			ProjectRisk,
			MilestoneTemplate,
			ProjectAccount,
			Myteam,
			FmUpload,
			ProjectList,
			MyTree,
			MyTabs,
			keyTag,
			customercontact,
			myTable,
			FinancialCard,
			WarningCard,
			HomeBaseMsg,
			Application,
			Adjust,
			ManagementHome,
			TaskObject,
			conclusion,
			ProjectChangeList,
			projectsplit,
			MarketSelect,
			ContractList,
			contractassociated,
			synergyInformation,
			notContractList,
			mounthOutput,
			mounthOutputNew,
			BudgetAllocation,
			ResidueOutput,
			associatedOutput,
			notAssociatedOutput,
			pendingDocument,
			cashDeposit,
			abnormal,
			ProjectCode,
			subPackageList,
			paymentInformation,
			contractInformation
		},
		// eslint-disable-next-line vue/require-prop-types
		props: {
			widget: {},
			models: {},
			rules: {},
			remote: {},
			globalParams: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				dataModel: this.models[this.widget.model],
				show: true,
				datalist: [],
				options: [],
				value: "",
				member: {},
				widget_copy: [],
				widgets: [],
				ckeckVal: false,
				projectId: this.$route.params.id,
				judgelogo: this.$route.query.judgelogo,
				judgestart: this.$route.params.judgestart,
				businessDate: [],
				projectList: [],
				contractList: [],
				disabled: true,
				widgetA: this.widget, //cyh
				selectData: [], //cyh
				arg: this.globalParams, //柴跃华  URL配置参数
				projectlevelA: "",
				professionalWorkTypes: "",
				contractType: this.$route.query.type
			};
		},
		watch: {
			//柴跃华 改为调用handler方法
			arg: {
				handler(newValue, oldValue) {
					// console.log(this.arg);
					this.handler(newValue, oldValue);
				},
				deep: true
			},
			//柴跃华 将监听推送转移到pushListen方法
			dataModel: {
				deep: true,
				handler(val) {
					this.models[this.widget.model] = val;
					this.pushListen(val);
				}
			},
			models: {
				deep: true,
				handler(val) {
					this.dataModel = val[this.widget.model];
				}
			}
		},
		computed: {
			...mapState([
				"userinfo", //oa跳转过来的用户信息值
				"isDetail" //是否是详情页，如果跳转的是详情页需要所有文本框都不能编辑
			])
		},
		created() {
			Bus.$on("businesstype", item => {
				if (item) {
					this.professionalWorkTypes = JSON.parse(item);
				}
			});
			localStorage.removeItem('globalParams');
			if (this.widget.options.remote && this.widget.type == "select") {
				let toption = this.widget.options;
				let urlValue = eval(this.widget.options.props["url"]);
				let _this = this;
				$.ajax({
					url: urlValue, //url路径
					type: "GET", //GET
					async: false, //或false,是否异步
					timeout: 5000, //超时时间
					dataType: "json", //返回的数据格式：
					success: function(data) {
						let mdata = data.data;
						let mvalue = toption.props["value"];
						let mlabel = toption.props["label"];
						toption.showLabel = true;
						toption.remoteOptions.length = 0;
						let remoteOptionsa = [];

						for (let i = 0; i <= mdata.length - 1; i++) {
							// debugger;
							remoteOptionsa.push({
								value: mdata[i][mvalue],
								label: mdata[i][mlabel]
							});
						}

						_this.widgetA.options.remoteOptions = remoteOptionsa;
						_this.widgetA = [..._this.widget.options.remoteOptions];
						// debugger;
						setTimeout(() => {
							let aa = JSON.parse(localStorage.getItem("globalParams"));
							if(_this.contractType){
								if(aa.CONTRACTMONEY){
									
									if(aa.CONTRACTMONEY.indexOf(",") != -1){
										var CONTRACTMONEY = aa.CONTRACTMONEY.replace(/,/g, "");
										CONTRACTMONEY = parseFloat(CONTRACTMONEY);
									}else{
										var CONTRACTMONEY = parseFloat(aa.CONTRACTMONEY);
									}
								}
								if (CONTRACTMONEY >= 1000) {
									aa.projectLevel = "超大型";
								} else if (CONTRACTMONEY >= 500 && CONTRACTMONEY < 1000) {
									aa.projectLevel = "大型";
								} else if (CONTRACTMONEY >= 200 && CONTRACTMONEY < 500) {
									aa.projectLevel = "中型";
								} else if (CONTRACTMONEY < 200) {
									aa.projectLevel = "小型";
								}
							}
							// _this.models[_this.widget.model] = '2120-移动网络规划软件'
							let objResult = {};
							for (let item in aa) {
								let labelLower = item.toLowerCase();
								objResult[labelLower] = aa[item];
							}
							_this.models = objResult;
						}, 1500);
					}
				});
			}
			const that = this;
			datas = this.datalist;
			widget_copy.push(this.widget);
			this.widget_copy = this.widget;
			//个人信息
			let personInfor = JSON.parse(localStorage.getItem("personInfor"));
			//一级部门 二级部门 项目经理
			if (
				this.$route.name == "/Businessproject" ||
				this.$route.name == "/contractproject" ||
				this.$route.name == "/notContractProject"
			) {
				if (this.widget_copy.name == "实施B级单位") {
					this.widget_copy.options.placeholder = this.userinfo.subdept_name;
				} else if (
					(this.widget_copy.name == "实施C级单位" &&
						this.userinfo.account_id == "7638091599462351621") ||
					(this.widget_copy.name == "实施C级单位" &&
						this.userinfo.account_id == "-1814768306395265967") ||
					(this.widget_copy.name == "实施C级单位" &&
						this.userinfo.account_id == "8416498716893399290") ||
					(this.widget_copy.name == "实施C级单位" && this.userinfo.account_id == "-1360422574114386809" && this.$route.name ==
						"/notContractProject")
				) {
					this.widget_copy.options.placeholder = this.userinfo.dept_name;
				} else if (this.widget_copy.name == "项目经理") {
					this.widget_copy.options.placeholder = this.userinfo.emp_name;
				}
			}

		},
		beforeMount() {
			if (this.$route.name == "/projectInformation") {
				setTimeout(() => {
					var projectData = JSON.parse(localStorage.getItem("projectData"));
					if (projectData != null && projectData.CONTRACTNUMBER == null) {
						this.disabled = false;
					} else {
						this.disabled = true;
					}
				}, 900);
			}
		},
		// 		if (this.widget_copy.options.remote && this.remote[this.widget_copy.options.remoteFunc]) {
		// 		this.remote[this.widget_copy.options.remoteFunc]((data) => {
		// 		this.widget_copy.options.remoteOptions = data.map(item => {
		// 		return {
		// 		value: item[this.widget_copy.options.props.value],
		// 		label: item[this.widget_copy.options.props.label]
		// 		}
		// 		})
		// 		})
		// 		}
		//
		// 		if (this.widget_copy.type === 'imgupload') {
		// 		this.remote[this.widget_copy.options.tokenFunc]((data) => {
		// 		this.widget_copy.options.token = data
		// 		})
		// 		}
		// },
		methods: {
			UpdateTaskName(e) {
				var contractMoney = e.target.value;
				if (!isNaN(contractMoney)) {
					var projectlevel = "";
					contractMoney = parseFloat(e.target.value);
					if (contractMoney >= 1000) {
						projectlevel = "超大型";
					} else if (contractMoney >= 500 && contractMoney < 1000) {
						projectlevel = "大型";
					} else if (contractMoney >= 200 && contractMoney < 500) {
						projectlevel = "中型";
					} else if (contractMoney < 200) {
						projectlevel = "小型";
					}
					this.projectlevelA = projectlevel;
					for (var i = 0; i < widget_copy.length; i++) {
						if (
							widget_copy[i].name == "合同项目级别" ||
							widget_copy[i].name == "项目级别"
						) {
							widget_copy[i].options.placeholder = projectlevel;
						}
					}

					var aa = {
						expectcontractamount: e.target.value,
						contractprojectlevel: projectlevel
					};
					let objResult = {};
					for (let item in aa) {
						let labelLower = item.toLowerCase();
						objResult[labelLower] = aa[item];
					}
					this.models = Object.assign(this.models, aa);
				} else {
					alert("预计合同金额必须是数字!");
					return;
				}
			},
			//柴跃华 发布监听 强制初始化组件
			pushListen(val) {
				this.$emit("update:models", {
					...this.models,
					[this.widget.model]: val
				});
				//cyh 发布监听   只有当listened属性为true时才允许发送事件
				if (this.widget.options.listened) {
					Bus.$emit(this.widget.model, {
						model: this.widget,
						val: val
					});
				}
			},
			//柴跃华 监听事件 值处理
			handler(newValue, oldValue) {
				// console.log("---+++new+++----");
				if (this.widget.type == "input") {
					if (eval(this.widget.options.defaultValue) == "null") {
						this.models[this.widget.model] = "";
						this.pushListen(this.models[this.widget.model]);
					} else {
						this.models[this.widget.model] = eval(
							this.widget.options.defaultValue
						);
						this.pushListen(this.models[this.widget.model]);
					}
				}
			},
			//关闭
			close() {
				this.show = !this.show;
			},
			hetong() {
				//项目信息关联合同
				this.show = !this.show;
				// var url =
				//   "/sgpm/rest/api/integration/oa/contracts/" +
				//   this.userinfo.memberid +
				//   "/" +
				//   this.projectId;
				var url =
					`/sgpm/rest/api/integration/data/contracts/project/${this.userinfo.account_id}?memberId=${this.userinfo.memberid}&projectId=${this.projectId}`;
				getContract(url)
					.then(res => {
						this.options = res.data.data;
						debugger;
					})
					.catch(err => {
						console.log(err);
					});
			},
			indexSelect(event) {
				this.member = event;
				console.log(event);
			},
			contractMain() {
				this.show = !this.show;
				var member = this.member;
				// console.log(member);
				// var url = "/sgpm/rest/api/integration/oa/contract/" + member;
				var url = `/sgpm/rest/api/integration/data/contract/${this.userinfo.companyId}?contractNumber=${member}`;
				getContract(url)
					.then(res => {
						// console.log(res.data.data);
						var contractList = res.data.data;
						localStorage.setItem("contractList", JSON.stringify(contractList));
						Bus.$emit("contractList", contractList);
					})
					.catch(err => {
						console.log(err);
					});
			},

			handleChange(file, fileList) {
				this.dataModel = fileList.slice(-3);
			},
			toggleSelection(rows) {
				if (rows) {
					rows.forEach(row => {
						this.$refs.multipleTable.toggleRowSelection(row);
					});
				} else {
					this.$refs.multipleTable.clearSelection();
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			}
		}
	};
</script>

<style>
	.ivider {
		border-bottom: 1px solid #ccc !important;
		color: red;
		display: block;
	}
</style>
<style scoped>
	.wordTitle {
		font-size: 20px;
		text-align: center;
		font-weight: bold;
		color: #000;
	}

	.word {
		font-size: 15px;
		text-align: center;
		font-weight: bold;
		color: #000;
	}

	.el-col-24 {
		text-align: left;
	}

	.bg {
		position: fixed;
		opacity: 0.5;
		background: #000;
		height: 100%;
		width: 100%;
		z-index: 1000;
		top: 0;
		left: 0;
	}

	.el-message-box {
		width: 400px;
		height: 200px;
		position: fixed;
		left: 50%;
		top: 50%;
		z-index: 2000;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		background: #fff;
		transform: translate(-50%, -50%);
	}

	.contractMain {
		float: right;
		margin-right: 15px;
		margin-top: 15px;
	}

	.wordLeft {
		font-size: 20px;
		float: left;
		font-weight: bold;
		color: #606266;
	}

	.button2 {
		float: right;
		margin-right: 20px;
	}
</style>
