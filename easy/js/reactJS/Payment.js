var Payment = React.createClass({
	getInitialState: function () {
            return {
                BankList:'',
                PDNumber:'',
                payment:{
                    RenewalPayStyle:1,
                    payStyle:'转账支付'
                }
            }
        },
        componentDidMount: function () {

            let that = this
            const myDate = new Date()

        	this.setState({
        		...JSON.parse(localStorage.productData)
        	},()=>{
                //银行列表传参
                let indexdata2 = {"index":"bankquery","keySale":"86110000","header":{"token":"1a2997ab-9743-440d-bcd0-a426ba395308","usercode":"2111010008"},"body":{"companyid":"03"}}
                //PD号查询传参
                let indexdata3 = {"index":"policyquery","keySale":"20180613103124PC8","header":{"token":"71b75985-10f4-4bc0-956c-d670a1724ca3","usercode":"2111010008"},"body":{"companyid":"03"}}
                $.ajax({
                    // 银行列表
                    type: 'POST',
                    //url:'http://rbet.mypicc.com.cn:8111/base/distribution.do',
                    url: 'http://rbet.mypicc.com.cn:8111/base/distribution.do',
                    data: JSON.stringify(indexdata2),
                    success: function (data) { //成功回调
                        console.log(data)
                        let BankList = [["0501","北京银行"],["1601","邮政储蓄银行"],["0601","招商银行"],["0301","建设银行"],["1401","广发银行"],["0401","农业银行"],["0201340","中国测试银行"],["0101","工商银行"],["0201","中国银行"],["1101","光大银行"]]
                        that.setState({
                            payment:{
                                ...that.state.payment,
                               BankName: BankList[0][1],
                               BackCode:BankList[0][0],
                            },
                            BankList:BankList
                        })
                    },
                    error: function (code, msg) { //失败回调
                        alert('代理请求失败,错误代码2：' + code + ' ,错误信息: ' + msg)
                    }
                });
                $.ajax({
                    //PD号查询
                    type: 'POST',
                    //url:'http://rbet.mypicc.com.cn:8111/base/distribution.do',
                    url: 'http://rbet.mypicc.com.cn:8111/base/distribution.do',
                    data: JSON.stringify(indexdata3),
                    success: function (data) { //成功回调
                        console.log(data)
                        let PDNumber = 'PD10000018636'
                        that.setState({
                            payment:{
                                ...that.state.payment,
                                PDNumber:PDNumber
                            }
                        },()=>{
                            console.log(that.state)
                        })
                    },
                    error: function (code, msg) { //失败回调
                        alert('代理请求失败,错误代码2：' + code + ' ,错误信息: ' + msg)
                    }
                });
                // $.ajax({
                    //限额表查询 
                //     type: 'POST',
                //     //url:'http://rbet.mypicc.com.cn:8111/base/distribution.do',
                //     url: 'http://rbet.mypicc.com.cn:8111/base/distribution.do',
                //     data: JSON.stringify(indexdata2),
                //     success: function (data) { //成功回调
                //         console.log(data)
                //         let BankList = [["0501","北京银行"],["1601","邮政储蓄银行"],["0601","招商银行"],["0301","建设银行"],["1401","广发银行"],["0401","农业银行"],["0201340","中国测试银行"],["0101","工商银行"],["0201","中国银行"],["1101","光大银行"]]
                //         that.setState({
                //             BankList:BankList
                //         })
                //     },
                //     error: function (code, msg) { //失败回调
                //         alert('代理请求失败,错误代码2：' + code + ' ,错误信息: ' + msg)
                //     }
                // });
        	})
        },
        NextBth(id){
        	if(id==1){
        		localStorage.productData = JSON.stringify(this.state)
                location.href = 'photocollection.html'
        	}else{
        		localStorage.productData = JSON.stringify(this.state)
                location.href = 'warrant.html'
        	}
    	},
        alertSure() {
            //alert框确定
            this.setState({
                Prompt: {
                    state: false,
                    text: ''
                }
            }, () => {
            })
        },
        informInformation(value){
            let e = window.event || arguments[0];
            //监听变化储存数据
            this.setState({
                payment: {
                    ...this.state.payment,
                        [value]: e.target.value
                }
            },()=>{
                console.log(this.state.payment,'payment')
            })
        },
        insurStyle(value,prod){
            let e = window.event || arguments[0];
            //监听变化储存数据
            this.setState({
                payment: {
                    ...this.state.payment,
                        [value]: prod
                }
            },()=>{
                console.log(this.state)
            })
        },
        ValueData(value){
            if(this.state.payment){
                return this.state.payment[value]
            }else if(value == 'PDNumber'){
                console.log(this.state.payment,'payment')
                 // return this.state.payment[value].contNo
            }else{
                return null
            }
        },
	render: function () {
		let productData = this.state.productData?this.state.productData.productData:''
		return(
            <section>
                    <div className="paymentInfo"><div className="payment" payid="">
                        <ul>
                            <li className="clearfix">
                                <p className="fl">投保单号：</p>
                                <div className="fl"><input type="text" className="policyAuto" value={this.ValueData("PDNumber")} readonly="readonly"/></div>
                            </li>
                            <li className="clearfix">
                                <p className="fl">首期缴费方式：</p>
                                <div className="fl">
                                    <select className="paytype">
                                        <option value="0">转账支付</option>
                                    </select>
                                </div>
                            </li>
                            <li className="clearfix">
                                <p className="fl">银行账号：</p>
                                <div className="fl"><input type="number" className="bankaccount" onChange={this.informInformation.bind(this, 'BackNumber')} value={this.ValueData("BackNumber")}/></div>
                            </li>
                            <li className="clearfix">
                                <p className="fl">开户名：</p>
                                <div className="fl"><input type="text" className="accountname"  onChange={this.informInformation.bind(this, 'AccountName')} value={this.ValueData("AccountName")}/></div>
                            </li>
                            <li className="clearfix">
                                <p className="fl" style={{position:'relative',top:'9px'}}>开户银行：</p>
                                <span className="bankNorm" style={{height:'20px',width:'40px',background:'#ccc'}}>银行限额表</span>
                                <div className="fl">
                                    <select className="bank_name" onChange={this.informInformation.bind(this, 'BankName')} value={this.ValueData("BankName")}>
                                        {
                                            this.state.BankList && this.state.BankList.map((prod)=>{
                                                return(
                                                    <option value={prod[0]}>{prod[1]}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </li>
                            <li className="clearfix">
                                <p className="fl">续期缴费方式：</p>
                                <div className="fl">
                                    <select className="roll_pay">
                                        <option value="0">转账支付</option>
                                    </select>
                                </div>
                            </li>
                            <li className="clearfix sign_con">
                                <p className="fl">投保方式：</p>
                                <div className="autograph_con fl">
                                    <input type="radio" name="autograph" className="autograph_d" onClick={this.insurStyle.bind(this, 'insurStyle',1)}/><label className="sign_list" for="autograph1">电子签名</label>
                                    <input type="radio" name="autograph" className="autograph_z" onClick={this.insurStyle.bind(this, 'insurStyle',2)}/><label className="sign_list" for="autograph2">纸质签名</label>
                                </div>
                            </li>
                            <li className="clearfix sign_con">
                                <p className="fl">保单打印方式：</p>
                                <div className="policy_con fl">
                                    <input type="radio" name="policy" className="policy_d" onClick={this.insurStyle.bind(this, 'PrintStyle',1)}/><label className="sign_list" for="policy1">电子保单</label>
                                    <input type="radio" name="policy" className="policy_z" onClick={this.insurStyle.bind(this, 'PrintStyle',2)}/><label className="sign_list" for="policy2">纸质保单</label>
                                </div>
                            </li>
                            <li>
                                <div className="remind">
                                    <p>转账授权声明、您是否需要续期缴费提醒：</p>
                                    <p className="renew_con">
                                        <input type="radio" name="yes" id="renew1" className="renew_y"  onClick={this.insurStyle.bind(this, 'remind',1)}/><label for="renew1" className="mr">是</label>
                                        <input type="radio" name="yes" id="renew2" className="renew_n" onClick={this.insurStyle.bind(this, 'remind',2)}/><label for="renew2">否</label>
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div></div>
                    <p className="beneficiary_btn mb15 clearfix"><a href="javascript:;" onClick={this.NextBth.bind(this,0)}>上一步</a><a href="javascript:;" onClick={this.NextBth.bind(this,1)}>下一步</a></p>

            </section>
        )
	}
})
ReactDOM.render(
    <Payment/>,
    document.getElementById('Payment')
);