var PolicyPreview = React.createClass({
    getInitialState: function () {
        return {
            premium:0
        }
    },
    componentDidUpdate: (prevProps, prevState) => {

    },

    componentWillMount: function () {

        let that = this
        const myDate = new Date()
        this.setState({
            ...JSON.parse(localStorage.productData)
        }, () => {
            console.log(that.state)
            console.log(this.state.applicant.sex)
        })
    },
    NextBth(id) {
        //  下一步
        if (id == 1) {
            localStorage.productData = JSON.stringify(this.state)
            location.href = 'policypreview.html'
        } else {
            localStorage.productData = JSON.stringify(this.state)
            location.href = 'payment.html'
        }
    },
    alertSure() {
        //alert框确定
        this.setState({
            Prompt: {
                state: false,
                text: ''
            }
        })
    },
    BankName() {
        let BankName = this.state.payment.BankName
        if(BankName == '0201'){
            return '中国银行'
        }else if(BankName == '0501'){
            return '北京银行'
        }else if(BankName == '1601'){
            return '邮政储蓄银行'
        }else if(BankName == '0601'){
            return '招商银行'
        }else if(BankName == '0301'){
            return '建设银行'
        }else if(BankName == '1401'){
            return '广发银行'
        }else if(BankName == '0401'){
            return '农业银行'
        }else if(BankName == '0201340'){
            return '中国测试银行'
        }else if(BankName == '0101'){
            return '工商银行'
        }else if(BankName == '1101'){
            return '光大银行'
        }

    },
    premium(){
        let premium = 0
        this.state.productData.productData && Object.keys(this.state.productData.productData).map((prod)=>{
            this.state.productData.productData[prod].productList.map((key)=>{
                premium = premium + key.premium
            })
        })
        return premium
    },
    Day() {
        var myDate = new Date();
        let getFullYear = myDate.getFullYear() +'-'
        let getMonth = myDate.getMonth() +'-'
        let getDate = myDate.getDate() +''
        return getFullYear + getMonth + getDate
    },
    render: function () {
        let productData = this.state.productData ? this.state.productData.productData : ''
        return (
            <section id="policy" className="policy" style={{width: '100%'}}>
                <p>投保单号:<span className="businessid"></span></p>
                <div className="policy_main">
                    <ul className="policy_main_list">
                        <li>
                            1.本电子投保单是保险合同的重要组成部分，请您认真阅读所投保产品的保险条款、产品说明书、人身保险投保提示书，并确认了解犹豫期、保险责任、免除保险公司责任（条款中凡是以黑体字加下划线标示的内容均为免除本公司责任的条款）、合同解除等条款内容后，再做出投保决定，一切超出产品条款和本电子投保书的解释均属无效。
                        </li>
                        <li>2.投保人、被保险人应对相关填写内容确认后亲自电子签名，未成年人或无民事行为能力者作为被保险人时，应由其法定监护人电子签名确认。</li>
                        <li>
                            3.请您确认在电子投保单中提供的投保人、被保险人和指定受益人的姓名、性别、出生日期、身份证件或身份证明文件的类型、号码，以及投保人的联系电话和联系地址等个人信息真实、完整。如您未能提供真实、完整的客明文件的类型、号码，以及投保人的联系电话和联系地址等个人信息真实、完整。如您未能提供真实、完整的客户信息，可能会影响您的保单承保，并不能享受我公司提供的保单服务。
                        </li>
                        <li>4.根据我国保险法规定，您应如实告知并详细填写投保书询问的相关个人信息，如因故意或者重大过失未履行如实告知义务，足以影响我司决定是否承保或者提高保险费率的，我司有权解除本合同。
                        </li>
                        <li style={{borderLeft: 'none'}}>
                            5.若您选择银行转账作为您的缴费方式，账户持有人必须为投保人本人。为了能使您享受的保障不受影响以及您的资金安全，对于续期或者续保的保费，本公司要求以银行转账形式进行支付。
                        </li>
                    </ul>
                    <div className="policy_info">

                        <div className="policyholder">
                            <h3 style={{
                                borderBottomWidth: '1px',
                                borderBottomStyle: 'solid',
                                borderBottomColor: '#333',
                                fontWeight: 'normal'
                            }}>投保人基本信息</h3>
                            <ul className="policy_main_msg">
                                <li style={{width: '5%', height: '48px'}}>姓名</li>
                                <li style={{width: '10%', height: '48px'}}>{this.state.applicant.applicantName}</li>
                                <li style={{width: '10%', height: '48px'}}>出生日期</li>
                                <li style={{width: '35%', height: '48px'}}>1989</li>
                                <li style={{width: '5%', height: '48px'}}>性别</li>
                                <li style={{width: '10%', height: '48px'}}>
                                    <span>
                                        <label
                                            className={this.state.applicant.sex == 'M' ? 'myicon active' : 'myicon'}></label><em>男</em></span>
                                    <span><label
                                        className={this.state.applicant.sex == 'F' ? 'myicon active' : 'myicon'}></label><em>女</em>
                                    </span>
                                </li>
                                <li style={{width: '5%', height: '48px'}}>婚姻</li>
                                <li style={{width: '20%', height: '48px'}}><span><label
                                    className={this.state.applicant.applicantMarriage == '未婚' ? 'myicon active' : 'myicon'}></label><em>未婚</em></span>
                                    <span><label
                                        className={this.state.applicant.applicantMarriage == '已婚' ? 'myicon active' : 'myicon'}></label><em>已婚</em></span>
                                    <span><label
                                        className={this.state.applicant.applicantMarriage == '其他' ? 'myicon active' : 'myicon'}></label><em>其他</em></span>
                                </li>
                            </ul>
                            <ul className="policy_main_msg" style={{height: '72px'}}>
                                <li style={{width: '10%', lineHeight: '72px', height: '72px'}}>工作单位</li>
                                <li style={{
                                    width: '18%',
                                    lineHeight: '72px',
                                    height: '72px'
                                }}>{this.state.applicant.applicantWorkUnit}</li>
                                <li style={{width: '10%', lineHeight: '72px', height: '72px'}}>岗位职务</li>
                                <li className="post_" style={{width: '15%', height: '72px'}}>
                                    {this.state.applicant.applicantJob}
                                </li>
                                <li style={{width: '10%', lineHeight: '72px', height: '72px'}}>职业代码</li>
                                <li style={{
                                    width: '12%',
                                    lineHeight: '72px',
                                    height: '72px'
                                }}>{this.state.applicantOccup.occupCodeData}</li>
                                <li style={{width: '5%', lineHeight: '72px', height: '72px'}}>类别</li>
                                <li style={{
                                    width: '3%',
                                    lineHeight: '72px',
                                    height: '72px'
                                }}>{this.state.applicantOccup.level}</li>
                                <li style={{width: '7%', lineHeight: '72px', height: '72px'}}>年收入</li>
                                <li style={{
                                    width: '9%',
                                    lineHeight: '72px',
                                    height: '72px'
                                }}>{this.state.applicant.applicantIncome}</li>
                            </ul>
                            <ul className="policy_main_msg">
                                <li style={{width: '10%', height: '24px'}}>联系地址</li>
                                <li style={{width: '65%', height: '24px'}}>
                                    {this.state.applicant.applicantProvinceValue + this.state.applicant.applicantCityName + this.state.applicant.applicantCountyName}
                                </li>
                                <li style={{width: '10%', height: '24px'}}>邮编</li>
                                <li style={{width: '14%', height: '24px'}}>{this.state.applicant.applicantPostal}</li>
                            </ul>
                            <ul className="policy_main_msg">
                                <li style={{width: '10%', height: '24px'}}>联系电话</li>
                                <li style={{
                                    width: '20%',
                                    height: '24px'
                                }}>{this.state.applicant.applicantTelephone ? '--' : this.state.applicant.applicantTelephone}</li>
                                <li style={{width: '10%', height: '24px'}}>手机</li>
                                <li style={{
                                    width: '20%',
                                    height: '24px'
                                }}>{this.state.applicant.applicantMobilePhone ? '--' : this.state.applicant.applicantMobilePhone}</li>
                                <li style={{width: '10%', height: '24px'}}>电子邮箱</li>
                                <li style={{
                                    width: '28%',
                                    height: '24px'
                                }}>{this.state.applicant.applicantMailbox ? '--' : this.state.applicant.applicantMailbox}</li>
                            </ul>
                        </div>

                        {
                            this.state.productData.productData && Object.keys(this.state.productData.productData).map((prod) => {
                                let productJson = this.state.productData.productData[prod]
                                return (
                                    <div className="recognizee">
                                        <h3 className="policy_main_notice" style={{fontWeight: 'normal'}}>&nbsp;第{prod}被保险人<span>是投保人的:{productJson.applicantRelationship}</span>
                                        </h3>
                                        <ul className="policy_main_msg">
                                            <li style={{width: '5%', height: '48px'}}>姓名</li>
                                            <li style={{width: '10%', height: '48px'}}>{productJson.insurName}</li>
                                            <li style={{width: '10%', height: '48px'}}>出生日期</li>
                                            <li style={{width: '25%', height: '48px'}}>{productJson.insurName}</li>
                                            <li style={{width: '5%', height: '48px'}}>性别</li>
                                            <li style={{width: '10%', height: '48px'}}><span><label
                                                className={productJson.gender == 'M' ? 'myicon active' : "myicon"}></label><em>男</em></span>
                                                <span><label
                                                    className={productJson.gender == 'F' ? 'myicon active' : "myicon"}></label><em>女</em></span>
                                            </li>
                                            <li style={{width: '5%', height: '48px'}}>婚姻</li>
                                            <li style={{width: '20%', height: '48px'}}><span><label
                                                className={productJson.Marriage == '未婚' ? 'myicon active' : 'myicon'}></label><em>未婚</em></span>
                                                <span><label
                                                    className={productJson.Marriage == '已婚' ? 'myicon active' : 'myicon'}></label><em>已婚</em></span>
                                                <span><label
                                                    className={productJson.Marriage == '其他' ? 'myicon active' : 'myicon'}></label><em>其他</em></span>
                                            </li>
                                        </ul>
                                        <ul className="policy_main_msg">
                                            <li style={{width: '10%', height: '48px'}}>证件类型</li>
                                            <li style={{
                                                width: '10%',
                                                height: '48px'
                                            }}>{productJson.Certificates ? productJson.Certificates : ''}</li>
                                            <li style={{width: '5%', height: '48px'}}>号码</li>
                                            <li style={{width: '20%', height: '48px'}}>{productJson.Identification}</li>
                                            <li style={{width: '10%', height: '48px'}}>证件有效期</li>
                                            <li style={{width: '20%', height: '48px'}}><span>2011-06-21</span>
                                                <span>至</span> <span>2026</span>-<span>06</span>-<span>21</span></li>
                                            <li style={{width: '5%', height: '48px'}}>国籍</li>
                                            <li style={{width: '15%', height: '48px'}}><span><label
                                                className={productJson.nationality == '中国' ? 'myicon active' : 'myicon'}></label><em>中国</em></span>
                                                <span><label
                                                    className={productJson.nationality == '中国' ? 'myicon' : 'myicon active'}></label><em>其他<em></em></em></span>
                                            </li>
                                        </ul>
                                        <ul className="policy_main_msg" style={{height: '72px'}}>
                                            <li style={{width: '10%', lineHeight: '72px', height: '72px'}}>工作单位</li>
                                            <li style={{
                                                width: '18%',
                                                lineHeight: '72px',
                                                height: '72px'
                                            }}>{productJson.WorkUnit}</li>
                                            <li style={{width: '10%', lineHeight: '72px', height: '72px'}}>岗位职务</li>
                                            <li className="post_" style={{width: '15%', height: '72px'}}>
                                                {productJson.Job}
                                            </li>
                                            <li style={{width: '10%', lineHeight: '72px', height: '72px'}}>职业代码</li>
                                            <li style={{
                                                width: '9%',
                                                lineHeight: '72px',
                                                height: '72px'
                                            }}>{productJson.occupationCode}</li>
                                            <li style={{width: '5%', lineHeight: '72px', height: '72px'}}>类别</li>
                                            <li style={{
                                                width: '3%',
                                                lineHeight: '72px',
                                                height: '72px'
                                            }}>{productJson.occup_LevelCode}</li>
                                            <li style={{width: '7%', lineHeight: '72px', height: '72px'}}>年收入</li>
                                            <li style={{
                                                width: '13%',
                                                lineHeight: '72px',
                                                height: '72px'
                                            }}>{productJson.income}</li>
                                        </ul>
                                        <ul className="policy_main_msg">
                                            <li style={{width: '10%', height: '24px'}}>联系地址</li>
                                            <li style={{width: '60%', height: '24px'}}>
                                                {productJson.provinceValue + productJson.cityName + productJson.countyName}
                                            </li>
                                            <li style={{width: '10%', height: '24px'}}>邮编</li>
                                            <li style={{width: '15%', height: '24px'}}>{productJson.Postal}</li>
                                        </ul>
                                        <ul className="policy_main_msg">
                                            <li style={{width: '10%', height: '24px'}}>联系电话</li>
                                            <li style={{
                                                width: '20%',
                                                height: '24px'
                                            }}>{productJson.Telephone ? productJson.Telephone : '--'}</li>
                                            <li style={{width: '10%', height: '24px'}}>手机</li>
                                            <li style={{
                                                width: '20%',
                                                height: '24px'
                                            }}>{productJson.MobilePhone ? productJson.MobilePhone : '--'}</li>
                                            <li style={{width: '10%', height: '24px'}}>电子邮箱</li>
                                            <li style={{
                                                width: '28%',
                                                height: '24px'
                                            }}>{productJson.mailbox ? productJson.mailbox : '--'}</li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                        <h3 className="policy_main_notice" style={{fontWeight: 'normal'}}>&nbsp;缴费信息</h3>
                        <ul className="policy_main_msg">
                            <li style={{width: '15%', height: '48px'}}>首期缴费方式</li>
                            <li style={{width: '28%', height: '48px'}}><span><label
                                className={this.state.payment.payStyle == '转账支付' || !this.state.payment.payStyle ? 'myicon active' : 'myicon'}></label><em>转账支付</em></span>
                                <span><label
                                    className={this.state.payment.payStyle == '自缴' ? 'myicon active' : 'myicon'}></label><em>自缴</em></span>
                                <span><label
                                    className={this.state.payment.payStyle == '其他' ? 'myicon active' : 'myicon'}></label><em>其他</em><i></i></span>
                            </li>
                            <li style={{width: '18%', height: '48px'}}>续期续保缴费方式</li>
                            <li style={{height: '48px'}}><span><label
                                className="myicon active"></label><em>转账支付</em></span></li>
                            <li style={{width: '27%', height: '48px'}}>选择银行转账缴费方式的,请填写下面内容</li>
                        </ul>
                        <ul className="policy_main_msg">
                            <li style={{width: '10%', height: '48px'}}>开户银行</li>
                            <li style={{width: '15%', height: '48px'}}>{this.BankName()}</li>
                            <li style={{width: '5%', height: '48px'}}>银行</li>
                            <li style={{width: '20%', height: '48px'}}>--</li>
                            <li style={{width: '5%', height: '48px'}}>分行</li>
                            <li style={{width: '15%', height: '48px'}}>--</li>
                            <li style={{width: '30%', height: '48px'}}>↓银行账户必须为投保人本人账户</li>
                        </ul>
                        <ul className="policy_main_msg">
                            <li style={{width: '10%', height: '24px'}}>银行账号</li>
                            <li style={{width: '60%', height: '24px'}}>{this.state.payment.BackNumber}</li>
                            <li style={{width: '10%', height: '24px'}}>开户名</li>
                            <li style={{width: '20%', height: '24px'}}>{this.state.payment.AccountName}</li>
                        </ul>
                        <h3 style={{
                            borderbottomWidth: '1px',
                            borderBottomStyle: 'solid',
                            borderBottomColor: '#333333',
                            paddingBottom: '2px',
                            fontWeight: 'normal'
                        }}><p>&nbsp;转账授权声明</p> <p>&nbsp;&nbsp;&nbsp;&nbsp;
                            兹授权中国人民健康保险股份有限公司按合同约定从上述账户中划出本次投保申请所需缴纳的各期保险费（包括保单服务相关费用），本声明在保险合同结束或书面中止前持续有效。</p></h3>
                        <ul className="policy_main_msg">
                            <li style={{height: '24px'}}>您是否需要续期缴费提醒: <span><label
                                className="myicon active"></label><em>是</em></span><span><label
                                className="myicon"></label><em>否</em></span></li>
                        </ul>
                        <h3 className="policy_main_notice" style={{fontWeight: 'normal'}}>&nbsp;保障计划</h3>
                        <ul className="policy_main_msg">
                            <li style={{width: '15%', height: '96px'}}>被保险人</li>
                            <li style={{width: '20%', height: '96px'}}>保障名称</li>
                            <li style={{width: '10%', height: '96px'}}>代码</li>
                            <li style={{width: '10%', height: '96px'}}>保额/档次</li>
                            <li style={{width: '10%', height: '96px'}}>保险期间</li>
                            <li style={{width: '10%', height: '96px'}}>缴费年期</li>
                            <li style={{width: '6%', height: '96px'}}>缴费频次</li>
                            <li style={{width: '6%', height: '96px'}}>期缴保费</li>
                            <li style={{width: '7%', height: '96px'}}>领取方式</li>
                        </ul>
                        {
                            this.state.productData.productData && Object.keys(this.state.productData.productData).map((prod)=>{
                                return this.state.productData.productData[prod].productList.map((key)=>{
                                    return(
                                        <ul className="policy_main_msg">
                                            <li style={{width: '15%', height: '36px'}}>{prod}</li>
                                            <li style={{width: '20%', height: '36px'}}>{key.abbrName}</li>
                                            <li style={{width: '10%', height: '36px'}}>{key.code}</li>
                                            <li style={{width: '10%', height: '36px'}}>{key.rank?key.rank:key.amount}</li>
                                            <li style={{width: '10%', height: '36px'}}>{key.insure}</li>
                                            <li style={{width: '10%', height: '36px'}}>{key.pay}</li>
                                            <li style={{width: '6%', height: '36px'}}>--</li>
                                            <li style={{width: '6%', height: '36px'}}>{key.premium}</li>
                                            <li style={{width: '7%', height: '36px'}}>--</li>
                                        </ul>
                                    )
                                })
                            })
                        }
                        <ul className="policy_main_msg">
                            <li style={{width: '15%', height: '24px'}}>追加保费金额</li>
                            <li style={{width: '10%', height: '24px'}}>--</li>
                            <li style={{width: '55%', height: '24px'}}>首期保费金额为以上各项期缴保费之和,总金额</li>
                            <li className="sumMoney" style={{
                                width: '10%',
                                borderLeft: 'none',
                                padding: '0px',
                                textAlign: 'center',
                                height: '24px'
                            }}>{
                                this.premium()
                            }元
                            </li>
                        </ul>
                        <h3 className="policy_main_notice" style={{fontSize: '18px', fontWeight: 'normal'}}>&nbsp;
                            身故受益人信息</h3>
                        <ul className="policy_main_msg">
                            <li style={{width: '15%', height: '48px'}}>被保险人</li>
                            <li style={{width: '15%', height: '48px'}}>身故受益人姓名</li>
                            <li style={{width: '15%', height: '48px'}}>与被保险人关系</li>
                            <li style={{width: '10%', height: '48px'}}>证件类型</li>
                            <li style={{width: '25%', height: '48px'}}>号码</li>
                            <li style={{width: '10%', height: '48px'}}>收益顺位</li>
                            <li style={{
                                width: '10%',
                                borderLeft: 'none',
                                padding: '0px',
                                textAlign: 'center',
                                height: '48px'
                            }}>收益比例
                            </li>
                        </ul>
                        {
                            this.state.Beneficiary && Object.keys(this.state.Beneficiary).map((prod)=>{
                                return Object.keys(this.state.Beneficiary[prod]).map((key)=>{
                                    return(
                                        <ul className="policy_main_msg">
                                            <li style={{width: '15%', height: '36px'}}>{prod}</li>
                                            <li style={{width: '15%', height: '36px'}}>{this.state.Beneficiary[prod][key].BeneficiaryName}</li>
                                            <li style={{width: '15%', height: '36px'}}>{this.state.Beneficiary[prod][key].relationship}</li>
                                            <li style={{width: '10%', height: '36px'}}>{this.state.Beneficiary[prod][key].CertificatesType}</li>
                                            <li style={{width: '25%', height: '36px'}}>{this.state.Beneficiary[prod][key].CertificatesNumber}</li>
                                            <li style={{width: '10%', height: '36px'}}>{this.state.Beneficiary[prod][key].order?this.state.Beneficiary[prod][key].order:''}</li>
                                            <li style={{
                                                width: '10%',
                                                borderLeft: 'none',
                                                padding: '0px',
                                                textAlign: 'center',
                                                height: '36px'
                                            }}>{this.state.Beneficiary[prod][key].Proportion}
                                            </li>
                                        </ul>
                                    )
                                })
                            })
                        }
                        <div className="policy_main_notice  clearfix" style={{fontSize: '18px', fontWeight: 'normal'}}>
                            <span>告知栏</span><span className="fr"
                                                  style={{marginRight: '70px'}}>如存在告知事项,请在'□'内打'√',并填写细项 </span></div>
                        <div className="inform clearfix">
                            <div className="inform_list fl" style={{width: '70%'}}>
                                <ul className="policy_main_msg">
                                    <li style={{width: '10%', height: '24px'}}>项目</li>
                                    <li style={{width: '30%', height: '24px'}}>告知内容</li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '24px'}}>1</li>
                                    <li style={{width: '90%', height: '24px'}}>被保险人的身高（厘米cm）/体重（千克kg）</li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '48px'}}>2</li>
                                    <li style={{width: '90%', height: '48px'}}>被保险人的医疗费用支付方式 ①公费医疗②社会 医疗保险③商业医疗保险④自费
                                    </li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '24px'}}>3</li>
                                    <li style={{width: '90%', height: '24px'}}>是否有吸烟习惯？如有请告知每日吸烟量与年数。</li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '48px'}}>4</li>
                                    <li style={{width: '90%', height: '48px'}}>
                                        是否有饮酒习惯？如有请告知种类(①白酒②啤酒③葡萄酒④黄酒)、每日饮酒量(两)与年数。
                                    </li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '48px'}}>5</li>
                                    <li style={{width: '90%', height: '48px'}}>是否有正在生效的商业人身险(医疗险,重大疾病险,护理保险,意外险或寿险)产品？
                                    </li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '48px'}}>6</li>
                                    <li style={{width: '90%', height: '48px'}}>
                                        是否有人身保险被保险公司拒保、延期、加费、免责的投保经历或向保险公司提出过理赔申请？
                                    </li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '24px'}}>7</li>
                                    <li style={{width: '90%', height: '24px'}}>有无危险运动爱好？</li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '48px'}}>8</li>
                                    <li style={{width: '90%', height: '48px'}}>过去十年内是否曾住院检查或治疗(包括疗养院、康复医院等医疗机构)？</li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '24px'}}>9</li>
                                    <li style={{width: '90%', height: '24px'}}>过去十年内是否做过手术(包括门诊手术)？</li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '24px'}}>10</li>
                                    <li style={{width: '90%', height: '24px'}}>过去十年内是否接受过心理或药物成瘾性治疗？</li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '24px'}}>11</li>
                                    <li style={{width: '90%', height: '24px'}}>过去两年内是否参加身体检查并发现结果异常？</li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '24px'}}>12</li>
                                    <li style={{width: '90%', height: '24px'}}>您在过去三年内是否因疾病而持续治疗超过2周？</li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '24px'}}>13</li>
                                    <li style={{width: '90%', height: '24px'}}>过去一年内是否使用过药物？</li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '48px'}}>14</li>
                                    <li style={{width: '90%', height: '48px'}}>过去一年中是否有发热、疼痛、大小便异常、体重明显变化或者其它不适症状？</li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '624px'}}>15</li>
                                    <li style={{width: '90%', height: '624px'}}>是否曾经或正患有以下疾病：
                                        A、高血压、冠心病、心肌梗塞、先天性心脏病、风湿性心脏病、肺源性心脏病、缩窄性心包炎、心内
                                        膜炎、心肌炎、心脏瓣膜疾病、主动脉血管瘤、心律失常、心肌病等心血管系统疾病;B、慢性支气管炎、
                                        哮喘、肺脓肿、胸膜炎、肺气肿、肺大泡、支气管扩张、肺结核、尘肺、矽肺等呼吸系统疾病；C、肝
                                        炎、肝炎病毒携带者、肝硬化、肝脓肿、肝内结石、肝脾肿大、胆囊炎、胆结石、胆管炎、消化道溃疡、
                                        出血及穿孔、胃炎、胰腺炎、溃疡性结肠炎、肛管疾病等消化系统疾病；D、肾炎、肾病综合症、肾功
                                        能异常、尿毒症、肾盂积水、肾囊肿、泌尿系结石、尿路畸形等泌尿系统疾病；E、糖尿病、痛风、甲状
                                        腺疾病、甲状旁腺疾病、肢端肥大症、垂疾机能亢进或减退、肾上腺机能亢进或减退、高脂血症等内分泌
                                        系统疾病；F、精神疾病、神经官能症、智能障碍、脑膜炎、脑炎、脑中风、短暂性脑缺血、脑动脉畸
                                        形、癫痫、重症肌无力、多发性硬化症、帕金森氏综合症、脊髓灰质炎、运动神经元疾病等精神、神经系
                                        统疾病；G、视网膜出血或剥离、视神经病变、青光眼、白内障、高度近视、中耳炎、神经性耳聋等五官
                                        疾病；H、曾被建议不宜献血、血友病、白血病、各类贫血、紫癜等血液系统疾病；I、风湿性关节炎、类风
                                        湿性关节炎、强直性脊柱炎、系统性红斑狼疮、硬皮病等结缔组织疾病；J、骨关节畸形、人工装置物、脊
                                        柱脊椎疾病等运动系统疾病；K、聋、哑、失明、肢体残缺或其他各种部位的残疾；L、恶性肿瘤、尚未证实
                                        性质的肿瘤、息肉、囊肿、包块、赘生物；M、性病、艾滋病或感染艾滋病病毒、吸食或注射毒品、未遵医嘱使用管制型成瘾类药物；N、以上未提及的疾病及症状。
                                    </li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '48px'}}>16</li>
                                    <li style={{width: '90%', height: '48px'}}>父母兄弟姐妹是否有高血压、糖尿病、恶性肿瘤、心脏
                                        病、高脂血症、肾衰竭、中风、多囊肾等疾病？
                                    </li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '48px'}}>17</li>
                                    <li style={{width: '90%', height: '48px'}}>
                                        (3周岁及以下儿童回答)是否有新生儿窒息、早产儿、产伤、出生体重异常、发育迟缓等？
                                    </li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '48px'}}>18</li>
                                    <li style={{width: '90%', height: '48px'}}>(16周岁及以上女性回答)是否怀孕？如是请告知妊娠周数以及是否有妊娠并发症.
                                    </li>
                                </ul>
                                <ul className="policy_main_msg main_msg_info">
                                    <li style={{width: '10%', height: '48px'}}>19</li>
                                    <li style={{width: '90%', height: '48px'}}>18周岁以下未成年人回答)是否已拥有正在生效的以死亡为
                                        给付保险金条件的人身保险？如有请告知身故保险金额总额。
                                    </li>
                                </ul>
                            </div>
                            <div id="inform_list2" className="inform_list2 fl clearfix"
                                 style={{width: '30%', display: 'inlineBlock'}}></div>
                        </div>
                        <div className="inform_yes">
                            <h3 className="policy_main_notice" style={{fontWeight: 'normal'}}>&nbsp;
                                问题5-19中如有回到“是”的，请填写告知明细并提供相关资料证明(如同一事件涉及多个告知项目，可一并回答)</h3>
                            <ul className="policy_main_msg">
                                <li style={{width: '15%', height: '20px'}}>被保险人</li>
                                <li style={{width: '50%', borderRight: 'none', height: '20px'}}>告知项目</li>
                                <li className="clearfix" style={{width: '35%', height: '20px'}}>说明内容<span
                                    className="fr">填写前请详细阅读左侧填写说明</span></li>
                            </ul>
                            <ul className="policy_main_msg">
                                <li style={{width: '15%', height: '20px'}}><span><label
                                    className="myicon"></label><em>①</em></span> <span><label
                                    className="myicon"></label><em>②</em></span> <span><label
                                    className="myicon"></label><em>③</em></span></li>
                                <li className="main_msg_project"
                                    style={{width: '50%', borderRight: 'none', height: '20px'}}>


                                </li>
                                <li className="clearfix" style={{width: '35%', paddingLeft: '0px', height: '20px'}}>

                                </li>
                            </ul>
                            <ul className="policy_main_msg">
                                <li style={{width: '15%', height: '20px'}}><span><label
                                    className="myicon"></label><em>①</em></span> <span><label
                                    className="myicon"></label><em>②</em></span> <span><label
                                    className="myicon"></label><em>③</em></span></li>
                                <li className="main_msg_project"
                                    style={{width: '50%', borderRight: 'none', height: '20px'}}>


                                </li>
                                <li className="clearfix" style={{width: '35%', paddingLeft: '0px', height: '20px'}}>
                                </li>
                            </ul>
                            <ul className="policy_main_msg">
                                <li style={{width: '15%', height: '20px'}}><span><label
                                    className="myicon"></label><em>①</em></span> <span><label
                                    className="myicon"></label><em>②</em></span> <span><label
                                    className="myicon"></label><em>③</em></span></li>
                                <li className="main_msg_project"
                                    style={{width: '50%', borderRight: 'none', height: '20px'}}>


                                </li>
                                <li className="clearfix" style={{width: '35%', paddingLeft: '0px', height: '20px'}}>


                                </li>
                            </ul>
                            <ul className="policy_main_msg">
                                <li style={{width: '15%', height: '20px'}}><span><label
                                    className="myicon"></label><em>①</em></span> <span><label
                                    className="myicon"></label><em>②</em></span> <span><label
                                    className="myicon"></label><em>③</em></span></li>
                                <li className="main_msg_project"
                                    style={{width: '50%', borderRight: 'none', height: '20px'}}>


                                </li>
                                <li className="clearfix" style={{width: '35%', paddingLeft: '0px', height: '20px'}}>


                                </li>
                            </ul>
                            <ul className="policy_main_msg">
                                <li style={{width: '15%', height: '20px'}}><span><label
                                    className="myicon"></label><em>①</em></span> <span><label
                                    className="myicon"></label><em>②</em></span> <span><label
                                    className="myicon"></label><em>③</em></span></li>
                                <li className="main_msg_project"
                                    style={{width: '50%', borderRight: 'none', height: '20px'}}>


                                </li>
                                <li className="clearfix" style={{width: '35%', paddingLeft: '0px', height: '20px'}}>


                                </li>
                            </ul>
                            <ul className="policy_main_msg">
                                <li style={{width: '15%', height: '20px'}}><span><label
                                    className="myicon"></label><em>①</em></span> <span><label
                                    className="myicon"></label><em>②</em></span> <span><label
                                    className="myicon"></label><em>③</em></span></li>
                                <li className="main_msg_project"
                                    style={{width: '50%', borderRight: 'none', height: '20px'}}>


                                </li>
                                <li className="clearfix" style={{width: '35%', paddingLeft: '0px', height: '20px'}}>


                                </li>
                            </ul>
                            <ul className="policy_main_msg">
                                <li style={{width: '15%', height: '20px'}}><span><label
                                    className="myicon"></label><em>①</em></span> <span><label
                                    className="myicon"></label><em>②</em></span> <span><label
                                    className="myicon"></label><em>③</em></span></li>
                                <li className="main_msg_project"
                                    style={{width: '50%', borderRight: 'none', height: '20px'}}>


                                </li>
                                <li className="clearfix" style={{width: '35%', paddingLeft: '0px', height: '20px'}}>


                                </li>
                            </ul>
                            <ul className="policy_main_msg">
                                <li style={{width: '15%', height: '20px'}}><span><label
                                    className="myicon"></label><em>①</em></span> <span><label
                                    className="myicon"></label><em>②</em></span> <span><label
                                    className="myicon"></label><em>③</em></span></li>
                                <li className="main_msg_project"
                                    style={{width: '50%', borderRight: 'none', height: '20px'}}>


                                </li>
                                <li className="clearfix" style={{width: '35%', paddingLeft: '0px', height: '20px'}}>


                                </li>
                            </ul>
                            <ul className="policy_main_msg">
                                <li style={{width: '15%', height: '20px'}}><span><label
                                    className="myicon"></label><em>①</em></span> <span><label
                                    className="myicon"></label><em>②</em></span> <span><label
                                    className="myicon"></label><em>③</em></span></li>
                                <li className="main_msg_project"
                                    style={{width: '50%', borderRight: 'none', height: '20px'}}>


                                </li>
                                <li className="clearfix" style={{width: '35%', paddingLeft: '0px', height: '20px'}}>


                                </li>
                            </ul>
                            <ul className="policy_main_msg">
                                <li style={{width: '15%', height: '20px'}}><span><label
                                    className="myicon"></label><em>①</em></span> <span><label
                                    className="myicon"></label><em>②</em></span> <span><label
                                    className="myicon"></label><em>③</em></span></li>
                                <li className="main_msg_project"
                                    style={{width: '50%', borderRight: 'none', height: '20px'}}>


                                </li>
                                <li className="clearfix" style={{width: '35%', paddingLeft: '0px', height: '20px'}}>


                                </li>
                            </ul>
                            <ul className="policy_main_msg">
                                <li style={{width: '15%', height: '20px'}}><span><label
                                    className="myicon"></label><em>①</em></span> <span><label
                                    className="myicon"></label><em>②</em></span> <span><label
                                    className="myicon"></label><em>③</em></span></li>
                                <li className="main_msg_project"
                                    style={{width: '50%', borderRight: 'none', height: '20px'}}>


                                </li>
                                <li className="clearfix" style={{width: '35%', paddingLeft: '0px', height: '20px'}}>


                                </li>
                            </ul>
                            <ul className="policy_main_msg">
                                <li style={{width: '15%', height: '20px'}}><span><label
                                    className="myicon"></label><em>①</em></span> <span><label
                                    className="myicon"></label><em>②</em></span> <span><label
                                    className="myicon"></label><em>③</em></span></li>
                                <li className="main_msg_project"
                                    style={{width: '50%', borderRight: 'none', height: '20px'}}>


                                </li>
                                <li className="clearfix" style={{width: '35%', paddingLeft: '0px', height: '20px'}}>


                                </li>
                            </ul>
                            <ul className="policy_main_msg">
                                <li style={{width: '15%', height: '20px'}}><span><label
                                    className="myicon"></label><em>①</em></span> <span><label
                                    className="myicon"></label><em>②</em></span> <span><label
                                    className="myicon"></label><em>③</em></span></li>
                                <li className="main_msg_project"
                                    style={{width: '50%', borderRight: 'none', height: '20px'}}>


                                </li>
                                <li className="clearfix" style={{width: '35%', paddingLeft: '0px', height: '20px'}}>


                                </li>
                            </ul>
                            <ul className="policy_main_msg">
                                <li style={{width: '15%', height: '20px'}}><span><label
                                    className="myicon"></label><em>①</em></span> <span><label
                                    className="myicon"></label><em>②</em></span> <span><label
                                    className="myicon"></label><em>③</em></span></li>
                                <li className="main_msg_project"
                                    style={{width: '50%', borderRight: 'none', height: '20px'}}>


                                </li>
                                <li className="clearfix" style={{width: '35%', paddingLeft: '0px', height: '20px'}}>


                                </li>
                            </ul>
                            <ul className="policy_main_msg">
                                <li style={{width: '15%', height: '20px'}}><span><label
                                    className="myicon"></label><em>①</em></span> <span><label
                                    className="myicon"></label><em>②</em></span> <span><label
                                    className="myicon"></label><em>③</em></span></li>
                                <li className="main_msg_project"
                                    style={{width: '50%', borderRight: 'none', height: '20px'}}>


                                </li>
                                <li className="clearfix" style={{width: '35%', paddingLeft: '0px', height: '20px'}}>


                                </li>
                            </ul>
                            <p className="policy_main_notice" style={{fontSize: '12px'}}>&nbsp;
                                投保备注栏&nbsp;&nbsp;&nbsp;&nbsp; <span><label
                                    className="myicon"></label> <em>有</em></span>&nbsp;&nbsp;<span><label
                                    className="myicon active"></label> <em>否</em></span></p>

                        </div>
                    </div>
                </div>
                <div className="policy_main policy_main2">
                    <div className="statement">
                        <h3>&nbsp;声明与授权</h3>
                        <p style={{fontSize: '16px'}}>本人已明确知晓并同意下列事项：</p>
                        <p style={{fontSize: '16px'}}>
                            如实告知义务：根据我国保险法规定，我有认真、完整和如实回答投保书所列询问事项的义务。如本人故意或者因重大过失未履行如实告知义务，足以影像贵公司决定是否同意承保或者提高保险费率的，贵公司有权解除本合同。 </p>
                        <p style={{fontSize: '16px'}}>
                            提示和说明：本人已收到此次投保险种的所有产品条款，阅读并了解了产品条款的内容，业务员已明确提示并说明了犹豫期、保险责任以及免除保险公司责任的条款内容，本人确认已经知晓并理解上述条款的含义，并予同意。合同成立与生效：贵公司同意承保后，保险合同方成立。在贵公司收取了首期保费并签发保险单的次日零时起本合同开始生效。贵公司预收取的保费不视为同意承保，对合同生效前发生的保险事故，贵公司不承担保险责任。</p>
                        <p style={{fontSize: '16px'}}>犹豫期退保: 自本人签收保险单之日起有15天的犹豫期，本人犹豫期内撤销合同，贵公司将无息退还本人所交的保险费。</p>
                        <p style={{fontSize: '16px'}}>
                            保费缴纳：本人知晓并同意本次投保的首期保费和续期续保保费通过投保单中提供的银行账号收取。对于保险期间为一年期的险种，在保险合同终止日前，如果贵公司和本人均未提出终止本合同，贵公司从本人提供的银行账号中划转续保保险费成功后，将根据本合同的约定继续承担相应的保险责任。</p>
                        <p style={{fontSize: '16px'}}>
                            未成年人身故责任：根据保险法和监管机构相关规定，已知晓并同意：如被保险人身故时不满10周岁，保险公司累计给付的身故保险金总额不超过20万元；如被保险人身故时已满10 周岁但未满18
                            周岁的，保险公司累计给付的身故保险金总额不超过50万元。投保人已交保险费或被保险人死亡时合同的现金价值、被保险人死亡时合同的万能险账户价值、航空意外死亡保险金额、重大自然灾害意外死亡保险金额不计算在内。
                        </p>
                        <p style={{fontSize: '16px'}}>
                            授权：本人授权贵公司可以从任何医疗机构、保险公司或任何组织和个人，就本次投保相关事宜，查询或索取与投保人、被保险人相关的资料或证明。</p>
                    </div>
                    <div className="signing_statement signing_statements clickwritea"><a href="javascript:;"
                                                                                         style={{color: '#208fc7'}}>点击签署声明</a>
                        <img src="" style={{display: 'none'}}/></div>
                    <div className="policy_main_msg_name d_sign">
                        <ul className="policy_main_msg dlr_sign">
                            <li className="clearfix" style={{height: '40px'}}><span className="fl">代理人签名:</span> <a
                                href="javascript:;" className="name fl"><img src='' className="myimg myimg5 img11"/></a>
                            </li>
                        </ul>
                        <ul className="policy_main_msg signing_statement" style={{lineHeight: '12px', height: 'auto'}}>
                            <li style={{width: '50%', height: '40px'}}>投保提示书</li>
                            <li className="clearfix"
                                style={{width: '50%', position: 'relative', borderLeft: 'none', height: '40px'}}><a
                                href="javascript:;" className="insure_sign">投保人签名</a><a href="javascript:;" id="signok"
                                                                                        className="fr insure_sign3"
                                                                                        style={{
                                                                                            position: 'absolute',
                                                                                            right: '50%',
                                                                                            top: '5px',
                                                                                            display: 'none'
                                                                                        }}>已签名</a></li>
                        </ul>
                        <ul className="policy_main_msg" style={{borderBottom: '0px'}}>
                            <li style={{width: '20%', height: '40px'}}>请签名</li>
                            <li style={{width: '25%', height: '40px'}}><a href="autograph.html"
                                                                          className="insure_sign2">点击签名</a></li>
                            <li style={{width: '25%', height: '40px'}}>投保申请日期</li>
                            <li style={{
                                width: '25%',
                                borderLeft: 'none',
                                padding: '0px',
                                textAlign: 'center',
                                height: '40px'
                            }}>{this.Day()}</li>
                        </ul>
                    </div>
                    <div className="policy_main_msg_name z_sign" style={{display: 'none'}}>
                        <ul className="policy_main_msg">
                            <li style={{width: '20%', height: '0px'}}>投保人</li>
                            <li className="tb_name" style={{width: '25%', height: '0px'}}><a href="javascript:;"
                                                                                             className="name"><img
                                src="images/sign.png" className="myimg myimg_t"/></a></li>
                            <li style={{width: '25%', height: '0px'}}>投保申请日期</li>
                            <li style={{
                                width: '25%',
                                borderLeft: 'none',
                                padding: '0px',
                                textAlign: 'center',
                                height: '0px'
                            }}>{this.Day()}</li>
                        </ul>
                        <ul className="policy_main_msg">
                            <li style={{width: '20%', height: '0px'}}>第一被保险人/监护人</li>
                            <li className="cust_name1" style={{width: '13%', height: '0px'}}><a href="javascript:;"
                                                                                                className="name"><img
                                data-num="22" src="images/sign.png" className="myimg myimg2 bimg1"/></a></li>
                            <li style={{width: '20%', height: '0px'}}>第二被保险人/监护人</li>
                            <li className="cust_name2" style={{width: '13%', height: '0px'}}><a href="javascript:;"
                                                                                                className="name"><img
                                data-num="23" src="images/sign.png" className="myimg myimg3 bimg2"
                                style={{position: 'absolute', left: '10px'}}/></a></li>
                            <li style={{width: '20%', height: '0px'}}>第三被保险人/监护人</li>
                            <li className="cust_name3" style={{width: '13%', borderLeft: 'none', height: '0px'}}><a
                                href="javascript:;" className="name"><img src="images/sign.png"
                                                                          className="myimg myimg4 bimg3"
                                                                          style={{position: 'absolute', left: '10px'}}/></a>
                            </li>
                        </ul>
                    </div>
                </div>
                <form>
                    <div className="policy_submit policy_submit3" style={{width: '100%', paddingBottom: '80px'}}><a
                        href="javascript:;">上一步</a><a href="javascript:;">提交</a></div>
                    <div className="policy_submit policy_submit2"
                         style={{width: '100%', paddingNottom: '80px', display: 'none', textAlign: 'center'}}><a
                        href="javascript:;" className="determine_btn"
                        style={{margin: '0px 30%', display: 'inlineBlock'}}>确定</a></div>
                    <em id="policyData"></em>
                    <input type="hidden" id="allData"/>
                </form>
                <input type="hidden" id="sign_data"/>
                <input type="hidden" id="result"/>
                <input type="hidden" id="result22"/>
            </section>
        )
    }
})
ReactDOM.render(
    <PolicyPreview/>,
    document.getElementById('PolicyPreview')
);