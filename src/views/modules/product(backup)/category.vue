<template>
  <div>
    <div>
      <el-tree
        :data="menus"
        :props="defaultProps"
        :expand-on-click-node="false"
        node-key="catId"
        :default-expanded-keys="expandedKey"
        :draggable="true"
        :allow-drop="allowDrop"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              v-if="node.level<=2"
              type="text"
              size="mini"
              @click="() => append(data)">
              添加
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="edit(data)">
              更新
            </el-button>
            <el-button
              v-if="node.childNodes.length === 0"
              type="text"
              size="mini"
              @click="() => remove(node, data)">
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <div>
      <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        title="删除提示"
        :visible.sync="deleteDialogShow"
        width="400px">
        <span>你确定要删除【{{ name }}】这个分类吗？</span>
        <span slot="footer" class="dialog-footer">
                    <el-button size="mini" type="danger" @click="deleteDialogShow = false">取 消</el-button>
                    <el-button size="mini" type="primary" @click="doDeleteItem">确 定</el-button>
                </span>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :title="categoryEditorTitle"
        :visible.sync="categoryDialogShow"
        width="600px">
        <div>
          <el-form label-width="110px" size="medium">
            <el-form-item label="分类名称">
              <el-input v-model="categorys.name"></el-input>
            </el-form-item>
            <el-form-item label="分类图标">
              <el-input v-model="categorys.icon"></el-input>
            </el-form-item>
            <el-form-item label="计量单位">
              <el-input v-model="categorys.productUnit"></el-input>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input-number v-model="categorys.sort" :min="1" :max="100"></el-input-number>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button @click="categoryDialogShow=false" type="danger" size="medium">取 消</el-button>
                <el-button type="primary" @click="handleCategoryEditorCommit"
                           size="medium" v-text="categoryEditorDialogCommitText"></el-button>
              </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import * as api from '../../../api/api'

  export default {
    data () {
      return {
        categorys: {
          catId: '',
          name: '',
          parentCid: '',
          catLevel: '',
          showStatus: '1',
          productCount: 0,
          sort: '',
          icon: '',
          productUnit: ''
        },
        categoryDialogShow: false,
        categoryEditorTitle: '',
        categoryEditorDialogCommitText: '',
        deleteDialogShow: false,
        catId: '',
        name: '',
        expandedKey: [],
        menus: [{
          name: '',
          children: [{
            name: '',
            children: [{
              name: ''
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    methods: {
      allowDrop (draggingNode, dropNode, type) {
        console.log(draggingNode, dropNode, type)
        return false
      },
      handleCategoryEditorCommit () {
        if (this.categorys.name === '') {
          this.$message.error('名称不可以为空')
          return
        }
        if (this.categorys.icon === '') {
          this.$message.error('图标地址不可以为空')
          return
        }
        if (this.categorys.productUnit === '') {
          this.$message.error('计量单位不可以为空')
          return
        }
        if (this.categorys.sort === '') {
          this.$message.error('请指定该分类顺序')
          return
        }
        if (this.categorys.catId === '') {
          api.postCategory(this.categorys).then(result => {
            if (result.code === api.success_code) {
              this.categoryDialogShow = false
              this.$message.success('添加成功')
              this.categoryList()
              //重置内容
              this.resetCategory()
            } else {
              this.$message.error('添加失败')
            }
          })
        } else {
          api.upDateCategory(this.categorys).then(result => {
            if (result.code === api.success_code) {
              this.categoryDialogShow = false
              this.$message.success('更新成功')
              this.categoryList()
              //重置内容
              this.resetCategory()
            } else {
              this.$message.error('更新失败')
            }
          })
        }
      },
      resetCategory () {
        this.categorys.catId = ''
        this.categorys.name = ''
        this.categorys.parentCid = ''
        this.categorys.catLevel = ''
        this.categorys.sort = ''
        this.categorys.icon = ''
        this.categorys.productUnit = ''
      },
      categoryList () {
        api.categoryList().then(result => {
          this.menus = result.data
        })
      },
      append (data) {
        //console.log(data)
        this.resetCategory()
        this.categoryEditorTitle = '添加分类'
        this.categoryEditorDialogCommitText = '添加'
        this.categorys.parentCid = data.catId
        this.categorys.catLevel = data.catLevel + 1
        this.categoryDialogShow = true
        this.expandedKey = [data.catId]
      },
      edit (data) {
        //console.log(data)
        this.categoryEditorTitle = '更新分类'
        this.categoryEditorDialogCommitText = '更新'
        this.categorys.catId = data.catId
        this.categorys.name = data.name
        this.categorys.icon = data.icon
        this.categorys.productUnit = data.productUnit
        this.categoryDialogShow = true
        this.expandedKey = [data.catId]
      },
      remove (node, data) {
        // console.log(node)
        // console.log(data)
        this.deleteDialogShow = true
        this.catId = data.catId
        this.name = data.name
        this.expandedKey = [data.parentCid]
      },
      doDeleteItem () {
        api.deleteCategory(this.catId).then(result => {
          if (result.code === api.success_code) {
            this.deleteDialogShow = false
            this.$message.success('删除成功')
            this.categoryList()
          } else {
            this.$message.error('删除失败')
          }
        })
      }
    },
    mounted () {
      this.categoryList()
    }
  }
</script>

<style>

</style>
