<template>
    <el-form label-width="80px">
        <!-- <el-form-item label="主管">
			<el-select v-model="leaders" multiple filterable remote placeholder="请输入关键词" :remote-method="remoteLeaderMethod" :loading="loading">
				<el-option v-for="item in lItems" :key="item.id" :label="item.name" :value="item.id"> </el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="下属">
			<el-select v-model="members" multiple filterable remote placeholder="请输入关键词" :remote-method="remoteMemberMethod" :loading="loading">
				<el-option v-for="item in mItems" :key="item.id" :label="item.name" :value="item.id"> </el-option>
			</el-select>
		</el-form-item> -->
		<el-form-item abel="  ">
			<el-transfer
				v-model="leaders"
				:data="lItems"
				filterable
				filter-placeholder="请输入"
				:titles="['待选用户','已选用户']"
				:props="{
					key: 'id',
					label: 'name'
				}"
			>
			</el-transfer>
		</el-form-item>
        <el-form-item>
            <el-button type="primary" v-if="groupManager_btn_userManager" @click="onSubmit">保存</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import {
  page
} from '@/api/admin/user/index'
import {
  getUsers,
  modifyUsers
} from '@/api/admin/group/index'
import { mapGetters } from 'vuex'
export default {
  props: {
    groupId: {
      default: '1'
    }
  },
  data() {
    return {
      lItems: [],
      mItems: [],
      leaders: [],
      members: [],
      list: [],
      loading: false,
      groupManager_btn_userManager: false
    }
  },
  created() {
    this.initUsers()
    this.remoteLeaderMethod()
    this.groupManager_btn_userManager = this.elements['groupManager:btn_userManager']
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    // remoteMemberMethod(query) {
    //     if (query !== '') {
    //         this.loading = true
    //         this.loading = false
    //         page({
    //             name: query
    //         }).then(response => {
    //             this.mItems = response.data.rows
    //             this.total = response.data.total
    //             this.loading = false
    //         })
    //     } else {
    //         this.mItems = []
    //     }
    // },
    remoteLeaderMethod() {
      this.loading = true
      page({
        limit: 100000
      }).then(response => {
        this.lItems = response.data.rows
        this.loading = false
      })// 取所有用户的列表
    },
    onSubmit() {
      const vals = {}
      if (this.members.length > 0) vals.members = this.members.join()
      if (this.leaders.length > 0) vals.leaders = this.leaders.join()
      modifyUsers(this.groupId, vals).then(() => {
        this.$emit('closeUserDialog')
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    initUsers() {
      getUsers(this.groupId).then(response => {
        // this.lItems = response.data.leaders
        // this.mItems = response.data.members
        // const mems = []
        // const leas = []
        // for (let i = 0; i < response.data.members.length; i++) {
        //     mems.push(response.data.members[i].id)
        // }
        this.leaders = []
        for (let i = 0; i < response.data.leaders.length; i++) {
          this.leaders.push(response.data.leaders[i].id)
        }
        // this.members = mems
        // this.leaders = leas
      })
    }
  }
}
</script>
