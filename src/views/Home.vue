<template>
    <div class="home">
        <Row>
            <Col>
                <Header>
                    <Row type="flex" justify="end">
                        <Col>
                            <Button type="primary" @click="modal1 = true">ADD</Button>
                        </Col>
                    </Row>
                </Header>
                <div class="search_box">
                    <Input search enter-button v-model="searchVal" placeholder="请输入完整域名 ： www.baidu.com"
                           @on-enter="searchFun" @on-search="searchFun"/>
                </div>
            </Col>
        </Row>
        <div class="list_box">
            <Table :columns="columns1" :data="data1"></Table>
        </div>
        <Modal
                v-model="modal1"
                title="Common Modal dialog box title"
                @on-ok="handleSubmit('formDynamic')"
                @on-cancel="cancel">
            <Form ref="formDynamic" :model="formDynamic" :label-width="80" style="width: 100%" :rules="ruleCustom">

                <Row>
                    <Col span="18">
                        <FormItem
                                label="域名"
                                prop="host"
                        >
                            <Input type="text" v-model="formDynamic.host" placeholder="请输入域名"></Input>
                        </FormItem>
                        <FormItem label="IP" prop="ip" >
                            <Input type="text" v-model="formDynamic.ip" placeholder="请输入IP"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Modal>
    </div>
</template>

<script>
    // @ is an alias to /src

    export default {
        name: 'home',
        data() {
            const validateHosts = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入域名'));
                    return
                }
                callback();
            };
            const validateIp = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入IP'));
                    return
                }
                callback();
            };
            return {
                searchVal: '',
                columns1: [
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
                formDynamic: {
                    host: '',
                    ip: ''
                },
                ruleCustom: {
                    host: [
                        {validator: validateHosts, trigger: 'blur'}
                    ],
                    ip: [
                        {validator: validateIp, trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            let data = localStorage.getItem('datas')
            if (!data || data.length <= 0) {
                let list = [
                    {
                        host: 'www.baidu.com',
                        ip: '127.0.0.1',
                        id: 1
                    },
                    {
                        host: 'www.qq.com',
                        ip: '127.0.0.1',
                        id: 2
                    },
                    {
                        host: 'www.aliyun.com',
                        ip: '127.0.0.1',
                        id: 3
                    }
                ]
                localStorage.setItem('datas', JSON.stringify(list))
            }
        },
        methods: {
            searchFun() {
                let datas = JSON.parse(localStorage.getItem('datas'))
                datas.map(v => {
                    if (v.host === this.searchVal) {
                        this.data1 = [v]
                    }
                })
            },
            cancel() {
                this.$refs['formDynamic'].resetFields();
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let ids = Math.max(...this.data1.map(v => v.id))
                        let datas = JSON.parse(localStorage.getItem('datas'))
                        console.log('ids', ids);
                        datas.push({
                            id: ids,
                            ...this.formDynamic
                        })
                        localStorage.setItem('datas', JSON.stringify(datas))
                        this.modal1 = false
                        this.$refs[name].resetFields();
                        this.$Message.success('Success!');
                    } else {
                        this.$refs[name].resetFields();
                        this.$Message.error('请输入域名和IP');
                    }
                })
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