class Benficiary extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            baseUrl: 'http://jkejt.picchealth.com:7087',
            editBenState:false,
            beneficiary:{
                choice:0,
                tableBeneficiary:false,
                "1":{
                    
                }
            }
        }
    }
    componentWillMount() {
        this.setState({
            TIME_OPT: this.initTime()
        })
        let url = this.state.baseUrl
        let that = this
        this.setState({
            ...JSON.parse(localStorage.productData)
        }, () => {
            this.setState({
                loading: false,
            })
        })
    }

    componentDidMount() {
        console.log(this.state)
        this.setState({
            choiceNum:1
        })
        $('#loading').hide()
        let TIME_OPT = this.state.TIME_OPT
        $('.dataTime').mobiscroll($.extend(TIME_OPT['date'], TIME_OPT['default'])).end();
    }
    componentDidUpdate(prevProps, prevState) {

    }
    genderCode(value) {
        if (value == 'M') {
            return '0'
        } else {
            return '1'
        }
    }
    initTime() {
        var currYear = (new Date()).getFullYear();
        var opt = {};
        opt.date = {
            preset: 'date'
        };
        opt.datetime = {
            preset: 'datetime'
        };
        opt.time = {
            preset: 'time'
        };
        opt.default = {
            theme: 'android-ics light', //皮肤样式
            display: 'modal', //显示方式
            mode: 'scroller', //日期选择模式
            dateFormat: 'yyyy-mm-dd',
            lang: 'zh',
            showNow: true,
            nowText: "今天",
            startYear: currYear - 65, //开始年份
            endYear: currYear + 65 //结束年份
        };
        return opt;
    }
   
    
    //客户列表
    CustomerClick() {
        let that = this
        piccAjax(this.state.baseUrl + '/queryCustomer', {
            "login_Account": localStorage.usercode,
            "customer_id": '',
            "pageNum": this.state.CustomerPage,
            "pageSize": this.state.CustomerPageSize
        }, data => {
            if (data.status) {
                that.setState({
                    CustomerList: data.data,
                    CustomerState: true
                })
            } else {
                alert('查询客户列表失败！')
            }
        })
    }
    //客户列表按钮
    CustomerBth(value) {
        if (value == 1) {
            this.setState({
                CustomerState: false
            })
        } else {

        }
    }
    //查看单条客户信息
    CustomerLookBth(prod) {
        let e = window.event || arguments[0];
        let that = this
        piccAjax(this.state.baseUrl + '/queryCustomer', {
            "login_Account": localStorage.usercode,
            "customer_id": prod.customer_id,
            "pageNum": 1,
            "pageSize": 2
        }, data => {
            if (data.status) {
                that.setState({
                    CustomerLook: true,
                    CustomerData: data.data[0]
                })

            } else {
                alert('查看客户信息失败！')
            }

        })
    }
    //获取属性值
    valueOf(id,prod,value){
        if (this.state.testBeneficiary[value]) {
            return this.state.testBeneficiary[value]
        }else{
            return ''
        }
    }
    seeCustData(value){
        if(this.state.beneficiary.seeCustData[value]){
            return this.state.beneficiary.seeCustData[value]
        }else{
            return ''
        }
    }
    informInformation(id,prod,value) {
        let e = window.event || arguments[0];
        let relation = this.state.productData.relation
        let relationName = ''
        
        //监听变化储存数据
        if(value == 'relationship'){
            relation.map(key=>{
                if(key.code == e.target.value){
                    relationName = key.dict_name
                }
            })
            this.setState({
                testBeneficiary: {
                    ...this.state.testBeneficiary,
                    relationName:relationName,
                    [value]: e.target.value
                }
            }, () => {
            })
        }else if(value == 'Proportion'){
            if(e.target.value <=100){
                this.setState({
                    testBeneficiary: {
                        ...this.state.testBeneficiary,
                        [value]: e.target.value,
                    }
                }, () => {
                })
            }
        }else{
            this.setState({
                testBeneficiary: {
                    ...this.state.testBeneficiary,
                    [value]: e.target.value,
                }
            }, () => {
            })
        }
        
    }
   //选择受益人方式
    ChoiceB(value){
        
        if(value == 0){
            this.setState({
                
                beneficiary:{
                    ...this.state.beneficiary,
                    choice:0
                }
            })
        }else{
            this.setState({
                
                beneficiary: {
                    ...this.state.beneficiary,
                    choice: 1
                }
            })
        }
    }
    //新建受益人方式
    addType(value){
        let that = this
        let lengthNum = ''
        let BenLengthNum = ''
        this.setState({
            editBenState: false
        })
        Object.keys(this.state.beneficiary).map(prod => {
            lengthNum = this.state.beneficiary[prod].length
        })
        if (lengthNum == '' || lengthNum == undefined || lengthNum == 'undefined') {
            lengthNum = 0
        }
        if(value == 0){
            this.setState({
                
                testBeneficiary: '',
                beneficiary: {
                    ...this.state.beneficiary,
                    addBeneficiary: true,
                    choiceNum:1
                }
            },()=>{
            })
        }else{
            piccAjax(this.state.baseUrl + '/queryCustomer', {
                "login_Account": localStorage.usercode,
                "customer_id": '',
                "pageNum": 1,
                "pageSize": 10000
            }, data => {
                if (data.status) {
                    that.setState({
                        testBeneficiary: '',
                        CustomerList: data.data,
                        beneficiary: {
                        ...this.state.beneficiary,
                        choiceBeneficiary: true,
                        choiceNum:1
                    }
                    })
                } else {
                    alert('查询客户列表失败！')
                }
            })
        }
    }
    //选择被保人
    choiceNum(value){
        let productDataLength = Object.keys(this.state.productData.productData).length - 1
        if(value == 1){
            this.setState({
                beneficiary:{
                    ...this.state.beneficiary,
                    choiceNum:1
                }
            })
        }else if(value == 2){
            if(productDataLength >= 2){
                this.setState({
                    beneficiary: {
                        ...this.state.beneficiary,
                        choiceNum: 2
                    }
                })
            }
        }else if(value == 3){
            if (productDataLength >= 3) {
                this.setState({
                    beneficiary: {
                        ...this.state.beneficiary,
                        choiceNum: 3
                    }
                })
            }
        }
    }
    //新建受益人按钮
    addBtn(id,prod,value){
        let beneficiarys = this.state.testBeneficiary
        let num = ''
        
        if(value == 2){
            this.setState({
                beneficiary:{
                    ...this.state.beneficiary,
                    addBeneficiary:false
                }
            })
        }else{
            if (!this.state.editBenState) {
                if (this.state.beneficiary[this.state.beneficiary.choiceNum]) {
                    num = Object.keys(this.state.beneficiary[this.state.beneficiary.choiceNum]).length
                } else {
                    num = 0
                }
                if (beneficiarys.beneficiaryName && beneficiarys.relationName && beneficiarys.cardYType && beneficiarys.cardNum && beneficiarys.order && beneficiarys.Proportion) {
                    this.setState({
                        editBenState: false,
                        beneficiary: {
                            ...this.state.beneficiary,
                            [this.state.beneficiary.choiceNum]: {
                                ...this.state.beneficiary[this.state.beneficiary.choiceNum],

                                [num + 1]: {
                                    choiceNum: this.state.beneficiary.choiceNum,
                                    benName: this.state.productData.productData[this.state.beneficiary.choiceNum].name,
                                    ...this.state.testBeneficiary
                                }
                            },
                            addBeneficiary: false,
                            tableBeneficiary: true
                        }
                    }, () => {
                    })
                }
            }else{
                if (beneficiarys.beneficiaryName && beneficiarys.relationName && beneficiarys.cardYType && beneficiarys.cardNum && beneficiarys.order && beneficiarys.Proportion) {
                    this.setState({
                        editBenState: false,
                        beneficiary: {
                            ...this.state.beneficiary,
                            [this.state.editProd]: {
                                ...this.state.beneficiary[this.state.editProd],

                                [this.state.editKey]: {
                                    choiceNum: this.state.editProd,
                                    benName: this.state.productData.productData[this.state.editProd].name,
                                    ...this.state.testBeneficiary
                                }
                            },
                            addBeneficiary: false,
                            tableBeneficiary: true
                        }
                    }, () => {
                    })
                }
            }
            
            
        }
    }
    //编辑受益人
    editBen(prod,key){
        prod = Number(prod)
        key = Number(key)
        this.setState({
            editBenState:true,
            testBeneficiary:this.state.beneficiary[prod][key],
            editProd:prod,
            editKey:key,
            beneficiary:{
                ...this.state.beneficiary,
                addBeneficiary: true,
                choiceNum: this.state.beneficiary[prod][key].choiceNum
            }
        })
    }
    //下一步
    nextBth(index){
        let db = WebSql().openDB()
        let that = this
        if(index != 1){
            db.exeSql('DELETE FROM benefit WHERE policyUUID = ?', [localStorage.proposalId], function (res) {
                if(res){
                    if (that.state.beneficiary.choice != 0) {
                        let nextState = false
                        let beneficiary = that.state.beneficiary
                        
                        let TotalState = true
                        let ContrastArr = []
                        let Contrast = 0;
                        Object.keys(beneficiary).map(prod => {
                            console.log(prod,'prod')
                            if (prod != 'choice' && prod != 'tableBeneficiary' && prod != 'choiceBeneficiary' && prod != 'choiceNum' && prod != 'addBeneficiary' && prod != 'seeCust' && prod != 'seeCustData') {
                                Object.keys(beneficiary[prod]).map(key => {
                                   Contrast = Contrast + Number(beneficiary[prod][key].Proportion)
                                })
                            }
                            ContrastArr.push(1)
                        })
                        
                        let productDataLength = Object.keys(that.state.productData.productData).length - 1
                        if (Contrast % 100 == 0){
                            TotalState = true
                        }else{
                            TotalState = false
                        }
                        if (productDataLength > ContrastArr.length || !TotalState) {
                            alert('请正确填写受益人信息！')
                        } else {
                            let productData = that.state.productData.productData
                                Object.keys(productData).map(prod => {
                                    if (typeof (productData[prod]) != 'number') {
                                        Object.keys(that.state.beneficiary).map(i => {
                                            Object.keys(that.state.beneficiary[i]).map(v => {
                                                db.exeSql('INSERT INTO benefit (benefitUUID, policyUUID, isByLaw, insuredId, name, relation, relationword, cardType, cardNum, benefitOrder, benefitScale) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [that.state.productData.planID[prod - 1] + v, localStorage.proposalId, i, that.state.productData.planID[prod - 1] + v, that.state.beneficiary[i][v].beneficiaryName, that.state.beneficiary[i][v].relationship, '', that.state.beneficiary[i][v].cardYType, that.state.beneficiary[i][v].cardNum, that.state.beneficiary[i][v].order, that.state.beneficiary[i][v].Proportion], function (result) {
                                                    if (result) {
                                                        nextState = true
                                                        
                                                    } else {
                                                        nextState = false
                                                    }
                                                });
                                            })
                                        })
                                    }
                                })
                                setTimeout(() => {
                                   if (nextState == true) {
                                       localStorage.productData = JSON.stringify(that.state)
                                       location.href = 'warrant.html'
                                   }
                                }, 500);
                        }
                    } else {
                        db.exeSql('INSERT INTO benefit (benefitUUID, policyUUID, isByLaw) VALUES(?, ?, ?)', [that.state.productData.planID[0], localStorage.proposalId, '0'], function (result) {
                                localStorage.productData = JSON.stringify(that.state)
                                location.href = 'warrant.html'
                        });
                    }
                }
            })
        }else{
            localStorage.productData = JSON.stringify(that.state)
            location.href = 'completeinformation.html'
        }
    }
    //删除受益人
    delBen(prod,key){
        let data = this.state.beneficiary
        delete data[prod][key]
        this.setState({
            beneficiary:{
                ...data
            }
        },()=>{
        })
    }
    //关系下拉
    relation(relation) {
        if (relation) {
            if(localStorage.type == '00'){
                return relation.map(prod => {
                    if(prod.code != '00'){
                        return (
                            <option value={prod.code}>{prod.dict_name}</option>
                        )
                    }
                })
            }else if(localStorage.type == '10'){
                return relation.map(prod => {
                    if (prod.code == '00' || prod.code == '01' || prod.code == '02' || prod.code == '03' || prod.code == '04' || prod.code == '05') {
                        return (
                            <option value={prod.code}>{prod.dict_name}</option>
                        )
                    }
                })
            } else if (localStorage.type == '20') {
                return relation.map(prod => {
                    if (prod.code == '00') {
                        return (
                            <option value={prod.code}>{prod.dict_name}</option>
                        )
                    }
                })
            }
            
        }
    }
    choiceBenBth(){
        this.setState({
            beneficiary:{
                ...this.state.beneficiary,
                choiceBeneficiary:false
            }
        })
    }
    choiceBenIng(prod){
        let beneficiary = this.state.beneficiary
        let benLength = Object.keys(this.state.beneficiary[beneficiary.choiceNum]).length + 1
        this.setState({
            testBeneficiary: {
                ...this.state.testBeneficiary,
                    beneficiaryName: prod.name,
                    cardYType: prod.id_Type2,
                    cardNum: prod.card_num
            },
            beneficiary:{
                ...this.state.beneficiary,
                choiceBeneficiary:false,
                addBeneficiary:true,
                
            }
        })
    }
    //查看客户
    seeCust(prod){
        this.setState({
            beneficiary:{
                ...this.state.beneficiary,
                seeCust:true,
                seeCustData:prod
            }
        })
        
    }
    //查看客户信息特殊值处
    seeCustSpecial(prod,value){
        let cityArr = Varcity.data
        let occupCode = this.state.occupCode
        let returnValue = ''
        let returnArr = ''
        if(prod == 1){
            Object.keys(occupCode).map(key=>{
                if(key == this.seeCustData(value)){
                    returnValue = occupCode[key].des
                }
            })
            return returnValue
        }else if(prod == 2){
            Object.keys(occupCode).map(key=>{
                if(key == this.seeCustData('occup_BigCode')){
                    returnArr = occupCode[key].sub
                }
            })
           Object.keys(returnArr).map(key =>{
               if(key == this.seeCustData(value)){
                   returnValue = returnArr[key].des
               }
           })
           return returnValue
        }else{
            let cityValue = ''
            cityArr.map(key=>{
                if (key.addressCode == this.seeCustData(value)) {
                    cityValue = key.addressName
                }
            })
            return cityValue
        }
        
    }
    //查看客户信息确定
    seeCustBth(){
        this.setState({
            beneficiary:{
                ...this.state.beneficiary,
                seeCust:false
            }
        })
    }
    render() {
        let beneficiary = this.state.beneficiary
        let productData = this.state.productData.productData
        return (
            <div>
                <ul className="beneficiary_list">
                    <li className="index">
                        <p>
                            <input type="checkbox" name="aa" onClick={this.ChoiceB.bind(this, 0)} checked={beneficiary.choice == 0?true:false}/>
                            <label for="a" style={{ background: 'none' }}>法定受益人</label>
                        </p>
                    </li>
                    <li className="beneficiary_list_appoint index clearfix">
                        <div className="clearfix pl15">
                            <p className="fl">
                                <input type="checkbox" name='aa' onClick={this.ChoiceB.bind(this, 1)} checked={beneficiary.choice == 1 ? true : false}/>
                                <label for="b" style={{background:'none'}}>指定受益人</label>
                            </p>
                            {
                                beneficiary.choice == 1 && <div className="sublist fl" style={{ display: 'block' }}>
                                    <p className="clearfix"><a href="javascript:;" onClick={this.addType.bind(this, '0')}>新增客户</a> <a href="javascript:;" onClick={this.addType.bind(this, '1')}>客户列表</a></p>
                                    <div className="addclient_prsseview" style={{ display: 'block' }}>
                                        <table className="addclient_preview_table">
                                            <tbody>
                                                <tr>
                                                    <th>
                                                        <p>顺序</p>
                                                    </th>
                                                    <th>
                                                        <p>被保险人</p>
                                                    </th>
                                                    <th>
                                                        <p>受益人</p>
                                                    </th>
                                                    <th>
                                                        <p>与被保险人关系</p>
                                                    </th>
                                                    <th>
                                                        <p>顺位</p>
                                                    </th>
                                                    <th>
                                                        <p>操作</p>
                                                    </th>
                                                </tr>
                                                {
                                                    beneficiary.tableBeneficiary && Object.keys(beneficiary).map((prod)=>{
                                                        if(prod == '1' || prod == '2' ||prod == '3' ){
                                                            return Object.keys(beneficiary[prod]).map((key)=>{
                                                                if (beneficiary[prod][key]){
                                                                    return (
                                                                        <tr>
                                                                            <td>
                                                                                <p>{prod}</p>
                                                                            </td>
                                                                            <td>
                                                                                <p>{beneficiary[prod][key].benName}</p>
                                                                            </td>
                                                                            <td>
                                                                                <p>{beneficiary[prod][key].beneficiaryName}</p>
                                                                            </td>
                                                                            <td>
                                                                                <p>{beneficiary[prod][key].relationName}</p>
                                                                            </td>
                                                                            <td>
                                                                                <p><span>{beneficiary[prod][key].order}</span></p>
                                                                            </td>
                                                                            <td><a href="javascript:;" onClick={this.editBen.bind(this,prod,key)}><img src="images/icon_modify.png" /></a><a href="javascript:;" style={{ paddingLeft: '10%' }} onClick={this.delBen.bind(this, prod, key)}><img src="images/icon_delete.png" /></a></td>
                                                                        </tr>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                        
                                                    })
                                                    
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            }
                            
                        </div>
                    </li>
                </ul>
                {
                    beneficiary.addBeneficiary && Object.keys(this.state.productData.productData).map(prod => {
                        if(typeof(this.state.productData.productData[prod]) != 'number'){
                            return(
                                <div className={prod == beneficiary.choiceNum?'insure_built blockClass':'insure_built'}>
                                    <div className="mask">
                                        <div className="mask_con">
                                            <p className="mask_con_title">新建受益人</p>
                                            <div className="mask_con_main" style={{ overflow: 'auto'}}>
                                                <div className="addclient_new">
                                                    <div className="addclient_new_num mb10 clearfix">
                                                        <p><a href="javascript:;" className={beneficiary.choiceNum == 1 && 'active_1'} onClick={this.choiceNum.bind(this,1)}></a><span>1</span></p>
                                                        <p><a href="javascript:;" className={beneficiary.choiceNum == 2 && 'active_1'} onClick={this.choiceNum.bind(this, 2)}></a><span>2</span></p>
                                                        <p><a href="javascript:;" className={beneficiary.choiceNum == 3 && 'active_1'} onClick={this.choiceNum.bind(this, 3)}></a><span>3</span></p>
                                                    </div>
                                                    <div className="addclient_new_info">
                                                        <div className="new_from_con">
                                                            <ul>
                                                                <li id="cust" className="clearfix" style={{ display: 'list-item'}}>
                                                                    <p className="from_con_msg fl">被保险人：</p>
                                                                    <input type="text" disabled="disabled" value={productData[prod].name} className="from_con_input bxr_name fl"/>
                                                                </li>
                                                                <li className="clearfix">
                                                                    <p className="from_con_msg fl">受益人：</p>
                                                                    <input type="text" className="from_con_input syr_name fl" value={this.valueOf(beneficiary.choiceNum,prod,'beneficiaryName')} onChange={this.informInformation.bind(this,beneficiary.choiceNum,prod,'beneficiaryName')}/>
                                                                </li>
                                                                <li className="clearfix">
                                                                    <p className="from_con_msg fl">与被保险人关系：</p>
                                                                    <select name="relation" className="from_con_input from_con_select s_relation new_relation fl" value={this.valueOf(beneficiary.choiceNum,prod,'relationship')} onChange={this.informInformation.bind(this,beneficiary.choiceNum,prod,'relationship')}>
                                                                        <option>请选择</option>
                                                                        {this.relation(this.state.productData.relation)}
                                                                    </select>
                                                                </li>
                                                                <li className="clearfix">
                                                                    <p className="from_con_msg fl">证件类型：</p>
                                                                    <select name="idtype" className="from_con_input from_con_select select_id fl" value={this.valueOf(beneficiary.choiceNum,prod,'cardYType')} onChange={this.informInformation.bind(this,beneficiary.choiceNum,prod,'cardYType')}>
                                                                        <option value="-1">请选择</option>
                                                                        <option value="0">身份证</option>
                                                                        <option value="1">护照</option>
                                                                        <option value="2">军官证</option>
                                                                        <option value="3">驾照</option>
                                                                        <option value="4">出生证明</option>
                                                                        <option value="5">户口簿</option>
                                                                        <option value="6">港澳台胞证</option>
                                                                        <option value="7">其他</option>
                                                                    </select>
                                                                </li>
                                                                <li className="clearfix">
                                                                    <p className="from_con_msg fl">证件号码：</p>
                                                                    <input type="text" name="idcode" className="from_con_input idcode fl" value={this.valueOf(beneficiary.choiceNum,prod,'cardNum')} onChange={this.informInformation.bind(this,beneficiary.choiceNum,prod,'cardNum')}/>
                                                                    <div className="error"></div>
                                                                </li>
                                                                <li className="clearfix">
                                                                    <p className="from_con_msg fl">受益顺位：</p>
                                                                    <select name="position" className="from_con_input s_order fl" value={this.valueOf(beneficiary.choiceNum,prod,'order')} onChange={this.informInformation.bind(this,beneficiary.choiceNum,prod,'order')}>
                                                                        <option value="0">请选择</option>
                                                                        <option value="1">1</option>
                                                                        <option value="2">2</option>
                                                                        <option value="3">3</option>
                                                                    </select>
                                                                </li>
                                                                <li className="clearfix">
                                                                    <p className="from_con_msg fl">受益比例：</p>
                                                                    <input type = "number" className = "from_con_input s_scale new_scale fl" value = {this.valueOf(beneficiary.choiceNum,prod,'Proportion')} onChange = {this.informInformation.bind(this,beneficiary.choiceNum,prod, 'Proportion')}/>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mask_con_btn">
                                                <p className="clearfix"><a href="javascript:;" className="fl" onClick={this.addBtn.bind(this,beneficiary.choiceNum,prod,1)}>确定</a><a href="javascript:;" className="fl" onClick={this.addBtn.bind(this,beneficiary.choiceNum,prod,2)}>取消</a></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    })
                }
                {
                    beneficiary.choiceBeneficiary && <div className="insure_built insure_built_bid index_mask" style={{display:'block'}}>
                        <div className="mask">
                            <div className="mask_con">
                                <div className="mask_con_main" style={{overflowY: 'auto'}}>
                                    <p className="index_prompt">客户列表</p>
                                    <div className="client_title">
                                        <p><span>姓名</span><span>出生日期</span><span>性别</span><span>操作</span></p>
                                        <ul className="client_msg">
                                            {
                                                this.state.CustomerList && this.state.CustomerList.map(prod=>{
                                                    return(
                                                        <li><span onClick={this.choiceBenIng.bind(this,prod)}>{prod.name}</span><span onClick={this.choiceBenIng.bind(this,prod)}>{prod.birthday}</span><span onClick={this.choiceBenIng.bind(this,prod)}>{prod.genderCode == 0 ?'男':'女'}</span><span onClick={this.seeCust.bind(this,prod)}>查看</span></li>
                                                    )
                                                })
                                            }
                                            
                                        </ul>
                                    </div>
                                </div>
                                <div className="mask_con_btn index_btn" style={{borderTop: '0px'}}>
                                    <p className="clearfix"><a href="javascript:;" style={{width: '100%', textAlign: 'center'}} onClick={this.choiceBenBth.bind(this)}>确定</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    beneficiary.seeCust && <div id="new_mask_con" className="insure_built details_layer customer_layer">
                        <div className="mask">
                            <div className="mask_con">
                                <div className="mask_con_main insuredinfo">
                                    <ul className="insuredinfo_con_list clearfix">
                                        <li className="clearfix">
                                            <p>姓名：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name pname fl" value={this.seeCustData('name')} disabled="disabled"/> <i className="fl">*</i></div>
                                        </li>
                                        <li className="clearfix">
                                            <p>性别：</p>
                                            <div className="sex">
                                                &nbsp;
                                                <input type="checkbox" name="sex" value="1" checked={this.seeCustData('genderCode')==0?true:false} disabled=""/>&nbsp;
                                                <label style={{background:'none'}}>男</label>&nbsp;&nbsp;&nbsp;
                                                <input  type="checkbox" name="sex" checked={this.seeCustData('genderCode')==1?true:false} value="2" disabled=""/>&nbsp;
                                                <label style={{background:'none'}}>女</label>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>国籍：</p>
                                            <div className="clearfix nationality">
                                                <select className="nationality_list" disabled="" value={this.seeCustData('nationality_ID')}>
                                                    <option value="ML">中国大陆</option>
                                                    <option value="HK">港澳台</option>
                                                    <option value="OS">海外</option>
                                                </select>
                                                {
                                                    this.seeCustData('nationality_ID') == 'ML' && <select disabled="">
                                                        <option value="CHN">中国</option>
                                                    </select>
                                                }
                                                 <i className="fl">*</i></div>
                                        </li>
                                        <li className="clearfix">
                                            <p>出生日期：</p>
                                            <div className="clearfix datatime">
                                                <input type="text" className="name ptime from_time fl" disabled=""  value={this.seeCustData('birthday')} readonly=""/> <i className="fl">*</i></div>
                                        </li>
                                        <li className="clearfix">
                                            <p>婚姻状况：</p>
                                            <div className="clearfix marriage">
                                                <select className="fl marriage_list" disabled="" value={this.seeCustData('marriage')}>
                                                    <option value="0">未婚</option>
                                                    <option value="1">已婚</option>
                                                    <option value="7">其他</option>
                                                </select>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>证件类型：</p>
                                            <div className="clearfix marriage">
                                                <select className="fl paper_list" disabled="" value={this.seeCustData('id_Type2')}>
                                                    <option value="0">身份证</option>
                                                    <option value="1">护照</option>
                                                    <option value="2">军官证</option>
                                                    <option value="3">驾照</option>
                                                    <option value="4">出生证明</option>
                                                    <option value="5">户口簿</option>
                                                    <option value="6">港澳台胞证</option>
                                                    <option value="7">其他</option>
                                                </select>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>证件号码：</p>
                                            <div>
                                                <input type="text" className="name paper_code fl" disabled="" value={this.seeCustData('card_num')}/> <i>*</i></div>
                                        </li>
                                        <li className="clearfix">
                                            <p>证件有效期：</p>
                                            <div className="datatime clearfix">
                                                <input type="text" className="name from_time from_time_id fl" disabled="" value={this.seeCustData('id_End_Date')} readonly=""/> <i className="fl">*</i></div>
                                        </li>
                                        <li className="clearfix">
                                            <p>工作单位：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name work_unit fl" disabled="" value={this.seeCustData('enterprise')}/> <i className="fl">*</i></div>
                                        </li>
                                        <li className="clearfix">
                                            <p>职务：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name duty fl" disabled="" value={this.seeCustData('duty')}/> <i className="fl">*</i></div>
                                        </li>
                                        <li className="clearfix">
                                            <p>职业大类：</p>
                                            <div className="clearfix occupation">
                                                <input type="text" className="name duty fl" disabled="" value={this.seeCustSpecial(1,'occup_BigCode')}/>
                                                 <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>职业小类：</p>
                                            <div className="clearfix occupation">
                                                <input type="text" className="name duty fl" disabled="" value={this.seeCustSpecial(2,'occup_SmallCode')}/>
                                                 <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>职业代码：</p>
                                            <div className="clearfix">
                                                <input type="text" disabled="" value={this.seeCustData('occup_LevelCode')} className="name occupation_code ccc fl" style={{background: 'rgb(245, 245, 245)'}}/> <i className="fl">*</i></div>
                                        </li>
                                        <li className="clearfix">
                                            <p>类别：</p>
                                            <div className="clearfix">
                                                <input type="text" disabled="" value={this.seeCustData('occup_Code')} className="name occupation_level ccc fl" style={{background: 'rgb(245, 245, 245)'}}/> <i className="fl">*</i></div>
                                        </li>
                                        <li className="clearfix">
                                            <p>年收入(万元)：</p>
                                            <div className="clearfix">
                                                <input type="number" value={this.seeCustData('salary')} className="name income fl" disabled=""/> <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix occupation">
                                            <p>联系地址：</p>
                                            <div id="address1" className="clearfix ">
                                                <p>
                                                    <span>{this.seeCustSpecial(3, 'provinceCode')}</span>
                                                </p>
                                                <p>
                                                    <span>{this.seeCustSpecial(3, 'cityCode')}</span>
                                                </p>
                                                <p>
                                                    <span>{this.seeCustSpecial(3, 'areaCode')}</span>
                                                </p>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>乡镇（街道）：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name street fl" value={this.seeCustData('street')} disabled=""/> <i className="fl">*</i></div>
                                        </li>
                                        <li className="clearfix">
                                            <p>村(社区)：</p>
                                            <div className="clearfix">
                                                <input type="text" value={this.seeCustData('community')} className="name community fl" disabled=""/> <i className="fl">*</i></div>
                                        </li>
                                        <li className="clearfix">
                                            <p>邮政编码：</p>
                                            <div className="clearfix">
                                                <input type="number" value={this.seeCustData('zipcode')} className="name postalcode fl" disabled=""/> <i className="fl">*</i></div>
                                        </li>
                                        <li className="clearfix">
                                            <p>电话：</p>
                                            <div className="clearfix">
                                                <input type="number" value={this.seeCustData('mobile')} className="name phone fl" disabled=""/> <i className="fl">*</i></div>
                                        </li>
                                        <li className="clearfix">
                                            <p>手机：</p>
                                            <div className="clearfix">
                                                <input type="number" value={this.seeCustData('phone')} className="name mobile fl" disabled=""/> <i className="fl">*</i></div>
                                        </li>
                                        <li className="clearfix">
                                            <p>邮箱：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name email fl" value={this.seeCustData('email')} disabled=""/> <i className="fl">*</i></div>
                                        </li>
                                    </ul>
                                    <div className="mask_con_btn">
                                        <p className="clearfix"><a href="javascript:;" className="fl con_btn_yes" style={{border: '0px', width: '100%', textAlign: 'center'}} onClick={this.seeCustBth.bind(this)}>确定</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <p className="beneficiary_btn clearfix">
                    <a href="javascript:;" onClick={this.nextBth.bind(this, 1)}>上一步</a><a href="javascript:;" onClick={this.nextBth.bind(this, 2)}>下一步</a>
                </p >
            </div>
        )
    }
}
ReactDOM.render(
    <Benficiary/>,
    document.getElementById('Benficiary')
);