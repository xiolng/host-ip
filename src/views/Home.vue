<template>
  <div class="home">
    <Row>
      <Col>
        <Header>
          <Row type="flex" justify="end">
            <Col>
              <Upload action="#" :before-upload="uploadData">
                <Button icon="ios-cloud-upload-outline">Excel上传</Button>
              </Upload>
            </Col>
          </Row>
        </Header>
        <div class="search_box">
          <Input search enter-button v-model="searchVal" placeholder="请输入完整域名 ： www.baidu.com"
                 @on-enter="searchFun" @on-search="searchFun" />
        </div>
      </Col>
    </Row>
      <!--列表-->
    <div class="list_box">
      <Table :columns="columns1" :data="data1"></Table>
    </div>
  </div>
</template>

<script>
    // @ is an alias to /src
    import XLSX from 'xlsx'

    export default {
        name: 'home',
        data() {
            return {
                searchVal: '',
                columns1: [ //列表title
                    {
                        title: '域名',
                        key: 'host'
                    },
                    {
                        title: 'IP',
                        key: 'ip'
                    }
                ],
                data1: [],
                modal1: false,
                index: 1,
            }
        },
        created() {
            // 初始化缓存数据
            let getData = JSON.parse(localStorage.getItem('datas')) || []
            if (!getData || getData.length <= 0) {
                localStorage.setItem('datas', JSON.stringify([{id: 1}]))
            }
        },
        methods: {
            // 搜索
            searchFun() {
                let datas = JSON.parse(localStorage.getItem('datas'))
                datas.map(v => {
                    if (v.host === this.searchVal) {
                        this.data1 = [v]
                    }
                })
            },
            // 上传Excel
            uploadData(file) {
                const vm = this
                let reader = new FileReader();
                reader.readAsBinaryString(file);
                reader.onloadend = function (evt) {
                    let workbook = {}
                    if (evt.target.readyState == FileReader.DONE) {
                        let data = reader.result;
                        workbook = XLSX.read(data, {type: 'binary'});
                    }
                    let sheet_name_list = workbook.SheetNames;
                    let result = vm.sheet2arr(workbook.Sheets[sheet_name_list[0]]);
                    result.map(v => {
                        if (v[0] !== 'host') {
                            let getData = JSON.parse(localStorage.getItem('datas'))
                            let ids = Math.max(...getData.map(v => v.id))
                            let datas = getData
                            let list = {
                                host: v[0],
                                ip: v[1]
                            }
                            console.log('ids', ids);
                            datas.push({
                                id: ids + 1,
                                ...list
                            })
                            localStorage.setItem('datas', JSON.stringify(datas))
                        }
                    })
                    return false
                }
                return false
            },
            // Excel 改为数组形式
            sheet2arr(sheet) {
                let result = [];
                let row;
                let rowNum;
                let colNum;
                let range = XLSX.utils.decode_range(sheet['!ref']);
                for (rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
                    row = [];
                    for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
                        let nextCell = sheet[
                            XLSX.utils.encode_cell({r: rowNum, c: colNum})
                            ];
                        if (typeof nextCell === 'undefined') {
                            row.push('');
                        } else row.push(nextCell.w);
                    }
                    result.push(row);
                }
                return result;
            }
        },
        components: {}
    }
</script>
<style scoped lang="stylus">
  .search_box {
    max-width 500px
    margin 10vh auto 0
  }

  .list_box {
    max-width 500px
    margin 10vh auto 0
  }
</style>