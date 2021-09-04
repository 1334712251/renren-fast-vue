<template>
  <div>
    <el-tree
      :data="menus"
      :props="defaultProps"
      :expand-on-click-node="false"
      node-key="catId"
      @node-click="nodeClick"
    >
    </el-tree>
  </div>
</template>


<script>
  import * as api from '../../api/api'

  export default {
    data(){
      return{
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
      categoryList () {
        api.categoryList().then(result => {
          this.menus = result.data
        })
      },
      nodeClick(data,node,VueComponent) {
        // console.log(data)
        // console.log(node)
        // console.log(VueComponent)
        this.$emit("tree-node-click",data,node,VueComponent)
      },
    },
    mounted () {
      this.categoryList();
    }
  }
</script>

<style>

</style>
