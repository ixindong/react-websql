    class ComplementingInsured extends React.PureComponent {
        constructor() {
            super();
            this.state = {
                insure: 1,
                insurInformation: {},
                baseUrl: 'http://jkejt.picchealth.com:7087',
                selectData: '',
                loading: true,
                paseUrl: 'http://jkejt.picchealth.com:7087',
                aCity:{11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"} 
            }
        }
        componentWillMount() {

            let cityJson = []
            let code = ''
            let countyJson = []
            this.setState({
                TIME_OPT: this.initTime()
            })
            let url = this.state.baseUrl
            let that = this
            this.setState({
                ...JSON.parse(localStorage.productData)
            }, () => {
                this.setState({
                    ...this.state,
                    ...this.state.productData
                }, () => {
                    let productData = this.state.productData
                    piccAjax(url + '/DropdownServlet', {

                    }, data => {
                        let relation = [], //关系下拉1
                            crossSellingType = [], //交叉销售下拉
                            cardType = []
                        data.data.map(prod => {
                            if (prod.dict_code == 'relation') {
                                relation.push(prod)
                            } else if (prod.dict_code == 'crossSellingType') {
                                crossSellingType.push(prod)
                            } else if (prod.dict_code == 'idType1') {
                                cardType.push(prod)
                            }
                        })
                        that.setState({
                            selectData: data,
                            relation: relation,
                            crossSellingType: crossSellingType,
                            cardType: cardType,
                            loading: false
                        }, () => {
                        })
                    })
                    let productJson = {}
                    piccAjax(that.state.baseUrl + '/nationalityaction', {}, data => {
                        if (data && data.ReturnMessage == '查询成功') {
                            that.setState({
                                nationality: data.data1 //被保人国籍
                            }, () => {
                                that.setState({
                                    Address: Varcity.data
                                }, () => {
                                    if (productData) {
                                        Object.keys(productData).map(prod => {
                                            if (productData[prod].occup_BigCode && that.state.Address) {
                                                let provinceID = ''
                                                that.state.Address.map(data => {
                                                    if (data.pid == productData[prod].provinceValue  && data.type == 2) {
                                                        cityJson.push(data)
                                                    }else if(data.pid == productData[prod].cityCode && data.type == 3){
                                                        countyJson.push(data)
                                                    }
                                                })
                                                productJson = {
                                                    ...productJson,
                                                    insure: 1,
                                                    [prod]: {
                                                        ...that.state.productData[prod],
                                                        cityJson: cityJson,
                                                        cityState: true,
                                                        countyName: null,
                                                        countyJson: countyJson,
                                                    }
                                                }

                                            }
                                        })
                                        that.setState({
                                            productData: productJson
                                        }, () => {
                                        })
                                    }
                                    $('#loading').hide()
                                })
                            })
                        }
                    })
                })
            })



        }
        //身份证验证
        isCardID(sId){
            var iSum=0 ;
            var info="" ;
            if(!/^\d{17}(\d|x)$/i.test(sId)) return false;
            sId=sId.replace(/x$/i,"a");
            if(this.state.aCity[parseInt(sId.substr(0,2))]==null) return false;
            let sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
            var d=new Date(sBirthday.replace(/-/g,"/")) ;
            if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))return false;
            for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
            if(iSum%11!=1) return false;
            return true;
        }
        //  国籍下拉
        nationalitySelect(value) {
            if (value) {
                return value.map(prod => {
                    return <option value={prod.code}>{prod.dict_name}</option>
                })
            }
        }
        //地区下拉
        Address(data, value) {
            if (data) {
                if (value == 1) {
                    return data.map(prod => {
                        if (prod.type == 1) {
                            return (
                                <option value={prod.addressCode}>{prod.addressName}</option>
                            )
                        }
                    })
                } else if (value == 2) {
                    return data.map(prod => {
                        return (
                            <option value={prod.addressCode}>{prod.addressName}</option>
                        )
                    })
                } else {
                    return data.map(prod => {
                        return (
                            <option value={prod.addressCode}>{prod.addressName}</option>
                        )
                    })
                }
            }
        }
        componentDidMount() {

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
        valueCome(text, value) {
            if (value == 'insurRelationship') {
                if (text[value]) {
                    return text[value]
                } else {
                    return {}
                }
            } else {
                if (text[value]) {
                    return text[value]
                } else {
                    return ''
                }
            }

        }
        NextBth(id) {
            let db = WebSql().openDB()
            let productJson = this.state.productData
            let insure = this.state.insure
            let cardStart = 'cardStart' + insure
            let cardEnd = 'cardEnd' + insure
            let url = this.state.paseUrl
            let that = this

            if (id == 1) {
                if (this.state.insure < Object.keys(this.state.productData).length - 1) {
                    productJson = {
                        ...productJson,
                        [insure]: {
                            ...productJson[insure],
                            cardStart: $('#' + cardStart).val(),
                            cardEnd: $('#' + cardEnd).val()
                        }
                    }
                    this.setState({
                        productData: productJson,

                    }, () => {
                        let productText = this.state.productData[insure]
                        let cardStartData = this.valueCome(productText, 'cardStart').replace(new RegExp('-', 'g'), '')
                        let cardEndData = this.valueCome(productText, 'cardEnd').replace(new RegExp('-', 'g'), '')
                        let creatTimeData = (new Date).Format('yyyy-MM-dd')
                        let movePhone = this.valueCome(productText, 'MobilePhone')
                        if (this.valueCome(productText, 'Marriage') == '') {
                            alert('请录入婚姻状况！')
                            return false
                        } else if (this.valueCome(productText, 'WorkUnit') == '') {
                            alert('请录入工作单位！')
                            return false
                        } else if (this.valueCome(productText, 'Certificates') == '0' && cardStartData >= cardEndData) {
                            alert('证件起始日期不能大于证件有效期')
                            return false
                        } else if (this.valueCome(productText, 'Certificates') == '0' && cardStartData >= creatTimeData) {
                            alert('证件起始日期不能大于当天日期！')
                            return false
                        } else if (localStorage.type == '20' && this.valueCome(productText, 'taxCardNumber').length != 15 && this.valueCome(productText, 'taxCardNumber') == '') {
                            alert('税务登记证号码格式不正确！')
                            return false
                        } else if (localStorage.type == '20' && this.valueCome(productText, 'messageNumber').length != 18 && this.valueCome(productText, 'messageNumber') == '') {
                            alert('社会信用代码格式不正确！')
                            return false
                        } else if (this.valueCome(productText, 'provinceValue') == '' || this.valueCome(productText, 'cityCode') == '' || this.valueCome(productText, 'countyCode') == '') {
                            alert('正确录入联系地址！')
                            return false
                        } else if (this.valueCome(productText, 'Town') == '') {
                            alert('请录入乡镇（街道）！')
                            return false
                        } else if (this.valueCome(productText, 'village') == '') {
                            alert('请录入村(社区)！')
                            return false
                        } else if (this.valueCome(productText, 'Identification') == '') {
                            alert('请录入证件号码！')
                            return false
                        } else if (this.valueCome(productText, 'Job') == '') {
                            alert('请录入职务！')
                            return false
                        } else if (this.valueCome(productText, 'Postal') == '') {
                            alert('请录入邮政编码！')
                            return false
                        } else if (this.valueCome(productText, 'Telephone') == '' && this.valueCome(productText, 'MobilePhone') == '') {
                            alert('请录入电话或手机其中一项！')
                            return false
                        } else if (this.valueCome(productText, 'nationality') == '') {
                            alert('请录入国籍！')
                            return false
                        } else if (this.valueCome(productText, 'nationality') == 'ML' && this.valueCome(productText, 'nationality') == '') {
                            alert('请正确录入国籍信息！')
                            return false
                        } else if (this.valueCome(productText, 'Certificates') == '') {
                            alert('请录入证件类型！')
                            return false
                        } else if (this.valueCome(productText, 'Certificates') == '7' && this.valueCome(productText, 'Certificates2') == '') {
                            alert('请正确录入证件类型信息！')
                            return false
                        } else if (this.valueCome(productText, 'Certificates') == '0' && this.valueCome(productText, 'cardStart') == '') {
                            alert('请录入证件起日期！')
                            return false
                        }  else if (this.valueCome(productText, 'Certificates') == '0' && this.isCardID(this.valueCome(productText, 'Identification'))==false) {
                            alert('身份证号有误！')
                            return false
                        } else if (this.valueCome(productText, 'Certificates') == '0' && this.valueCome(productText, 'cardEnd') == '') {
                            alert('请录入证件有效期！')
                            return false
                        } else if (this.valueCome(productText, 'applicantRelationship') == '') {
                            alert('请录入与投保人关系！')
                            return false
                        } else if (localStorage.type == '20'&&this.valueCome(productText, 'applicantRelationship') != '00') {
                            alert('与投保人关系只能选择本人')
                            return false
                        } else if (this.valueCome(productText, 'insurRelationship') == '' && this.state.insure != 1) {
                            alert('请录入与第一被保人关系！')
                            return false
                        } else if (this.valueCome(productText, 'MobilePhone') != '' && (!!movePhone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)) == false) {
                            alert('请正确录入手机号码！')
                            return false
                        } else if (this.valueCome(productText, 'mailbox') != '' && !this.checkemail(this.valueCome(productText, 'mailbox'))) {
                            alert('邮箱格式有误！')
                            return false
                        } else {
                            this.setState({
                                loading: true
                            })
                            piccAjax(url + '/AddCustomerServlet', {
                                "login_Account": localStorage.usercode,
                                "name": this.valueCome(productText, 'name'),
                                "genderCode": this.genderCode(productText.gender),
                                "birthday": this.valueCome(productText, 'birthday'),
                                "marriage": this.valueCome(productText, 'Marriage'),
                                "enterprise": this.valueCome(productText, 'WorkUnit'),
                                "provinceCode": this.valueCome(productText, 'provinceValue'),
                                "cityCode": this.valueCome(productText, 'cityCode'),
                                "areaCode": this.valueCome(productText, 'countyCode'),
                                "street": this.valueCome(productText, 'Town'),
                                "community": this.valueCome(productText, 'village'),
                                "card_num": this.valueCome(productText, 'Identification'),
                                "duty": this.valueCome(productText, 'Job'),
                                "email": this.valueCome(productText, 'mailbox'),
                                "zipcode": this.valueCome(productText, 'Postal'),
                                "mobile": this.valueCome(productText, 'Telephone'),
                                "phone": this.valueCome(productText, 'MobilePhone'),
                                "occup_BigCode": this.valueCome(productText, 'occup_BigCode'),
                                "occup_SmallCode": this.valueCome(productText, 'occupationCode'),
                                "occup_Code": this.valueCome(productText, 'occupationCode'),
                                "occup_LevelCode": this.valueCome(productText, 'occup_LevelCode'),
                                "nationality_ID": this.valueCome(productText, 'nationality'),
                                "nationality_ID2": this.valueCome(productText, 'nationality2'),
                                "id_Type2": this.valueCome(productText, 'Certificates'),
                                "id_Type_Code": this.valueCome(productText, 'Certificates2'),
                                "id_Start_Date": this.valueCome(productText, 'cardStart'),
                                "id_End_Date": this.valueCome(productText, 'cardEnd'),
                                "long_Date": "0",
                                "payStyle": "",
                                "refused": "",
                                "haved": "",
                                "haved_Money": "",
                                "first_Relation_One": this.valueCome(productText, 'applicantRelationship'),
                                "first_Relation_Two": "",
                                "second_Relation_One": "",
                                "second_Relation_Two": "",
                                "second_First_Relation_One": this.valueCome(productText, 'insurRelationship'),
                                "second_First_Relation_Two": "",
                                "third_Relation_One": "",
                                "third_Relation_Two": "",
                                "third_First_Relation_One": "",
                                "third_First_Relation_Two": "",
                                "taxHospital": this.valueCome(productText, 'taxHospital'),
                                "taxMethod": "",
                                "taxRegistration": "",
                                "socialCredit": "",
                                "taxDutyMoney": "",
                                "taxDutyScale": "",
                                "taxDutyAmount": "",
                                "taxDutyRange": "",
                                "customer_id": this.valueCome(productText, 'customer_id'),
                                "salary": this.valueCome(productText, 'income')
                            }, data => {
                                if (data.status) {
                                    db.exeSql('UPDATE customer SET relation = ?, Brelation = ?, citizenship = ?, marriage = ?, card_type = ?, cardNum = ?,cardStartTime = ?, cardTime = ?, enterprise = ?, yearIncome = ?, provinceCode = ?, cityCode = ?, area = ?, street = ? , createDate = ? , duty = ? , community = ? , postalcode = ?, phone = ?, mobile = ? , email = ? WHERE customerId = ?', [JSON.stringify({
                                            code: that.valueCome(productText, 'applicantRelationship'),
                                            name: that.TabelValue(that.valueCome(productText, 'applicantRelationship', insure), that.state.relation)
                                        }), JSON.stringify(that.valueCome(productText, 'insurRelationship'), that.TabelValue(that.valueCome(productText, 'insurRelationship', insure), that.state.relation)), JSON.stringify({
                                            type: that.valueCome(productText, 'nationality'),
                                            code: that.valueCome(productText, 'nationality2'),
                                            name1: that.TabelValue(that.valueCome(productText, 'nationality', insure), that.state.nationality),
                                            name2: that.valueCome(productText, 'nationality') == 'ML' ? '中国' : ''
                                        }), JSON.stringify({
                                            code: that.valueCome(productText, 'Marriage'),
                                            des: that.valueCome(productText, 'MarriageText')
                                        }), JSON.stringify({
                                            code: that.valueCome(productText, 'Certificates'),
                                            name: that.TabelValue(that.valueCome(productText, 'Certificates', insure), that.state.cardType),
                                            info: that.valueCome(productText, 'Certificates2')
                                        }), that.valueCome(productText, 'Identification'), that.valueCome(productText, 'cardStart'), that.valueCome(productText, 'cardEnd'), that.valueCome(productText, 'WorkUnit'), that.valueCome(productText, 'income'), JSON.stringify({
                                            code: that.valueCome(productText, 'provinceValue'),
                                            name: that.provin(that.valueCome(productText, 'provinceValue'))
                                        }), JSON.stringify({
                                            code: that.valueCome(productText, 'cityCode'),
                                            name: that.provin(that.valueCome(productText, 'cityCode'))
                                        }), JSON.stringify({
                                            code: that.valueCome(productText, 'countyCode'),
                                            name: that.provin(that.valueCome(productText, 'countyCode'))
                                        }), that.valueCome(productText, 'Town'), (new Date).Format('yyyy-MM-dd'), that.valueCome(productText, 'Job'), that.valueCome(productText, 'village'), that.valueCome(productText, 'Postal'), that.valueCome(productText, 'Telephone'), that.valueCome(productText, 'MobilePhone'), that.valueCome(productText, 'mailbox'), JSON.parse(localStorage.productData).productData.planID[insure - 1]],
                                        function(res) {
                                            that.setState({
                                                insure: that.state.insure + 1,
                                                loading: false,
                                                productData: {
                                                    ...that.state.productData,
                                                    [insure]: {
                                                        ...that.state.productData[insure],
                                                        "customer_id": data.data
                                                    }
                                                }
                                            }, () => {})
                                        });

                                } else {
                                    alert('更新客户信息失败！')
                                }
                            })
                        }

                    })
                } else {
                    productJson = {
                        ...productJson,
                        [insure]: {
                            ...productJson[insure],
                            cardStart: $('#' + cardStart).val(),
                            cardEnd: $('#' + cardEnd).val()
                        }
                    }
                    this.setState({
                        productData: productJson
                    }, () => {
                        let productText = this.state.productData[insure]
                        let cardStartData = this.valueCome(productText, 'cardStart').replace(new RegExp('-', 'g'), '')
                        let cardEndData = this.valueCome(productText, 'cardEnd').replace(new RegExp('-', 'g'), '')
                        let creatTimeData = (new Date).Format('yyyy-MM-dd')
                        if (this.valueCome(productText, 'Marriage') == '') {
                            alert('请录入婚姻状况！')
                            return false
                        } else if (localStorage.type == '20' && this.valueCome(productText, 'customerPersonalTaxType') == '') {
                            alert('请录入个税征收方式！')
                            return false
                        } else if (this.valueCome(productText, 'Certificates') == '0' && cardStartData >= cardEndData) {
                            alert('证件起始日期不能大于证件有效期')
                            return false
                        } else if (this.valueCome(productText, 'Certificates') == '0' && cardStartData >= creatTimeData) {
                            alert('证件起始日期不能大于当天日期！')
                            return false
                        } else if (this.valueCome(productText, 'Certificates') == '0' && this.isCardID(this.valueCome(productText, 'Identification'))==false) {
                            alert('身份证号有误！')
                            return false
                        }else if (localStorage.type == '20' && this.valueCome(productText, 'messageNumber') == '' && this.valueCome(productText, 'taxCardNumber') == '') {
                            alert('社会信用代码和税务登记证号码必须填写一个！')
                            return false
                        } else if (localStorage.type == '20' && this.valueCome(productText, 'applicantRelationship') != '00') {
                            alert('被保人与投保人关系必须为本人！')
                            return false
                        } else if (localStorage.type == '20' && this.valueCome(productText, 'taxCardNumber').length != 15 && this.valueCome(productText, 'taxCardNumber') != '') {
                            alert('税务登记证号码格式不正确！')
                            return false
                        } else if (localStorage.type == '20' && this.valueCome(productText, 'messageNumber').length != 18 && this.valueCome(productText, 'messageNumber') != '') {
                            alert('社会信用代码格式不正确！')
                            return false
                        } else if (this.valueCome(productText, 'WorkUnit') == '') {
                            alert('请录入工作单位！')
                            return false
                        } else if (this.valueCome(productText, 'provinceValue') == '' || this.valueCome(productText, 'cityCode') == '' || this.valueCome(productText, 'countyCode') == '') {
                            alert('正确录入联系地址！')
                            return false
                        } else if (this.valueCome(productText, 'Town') == '') {
                            alert('请录入乡镇（街道）！')
                            return false
                        } else if (this.valueCome(productText, 'Postal').length != 6) {
                            alert('邮政编码格式错误！')
                            return false
                        } else if (this.valueCome(productText, 'village') == '') {
                            alert('请录入村(社区)！')
                            return false
                        } else if (this.valueCome(productText, 'Identification') == '') {
                            alert('请录入证件号码！')
                            return false
                        } else if (this.valueCome(productText, 'Job') == '') {
                            alert('请录入职务！')
                            return false
                        } else if (this.valueCome(productText, 'Postal') == '') {
                            alert('请录入邮政编码！')
                            return false
                        } else if (this.valueCome(productText, 'Telephone') == '' && this.valueCome(productText, 'MobilePhone') == '') {
                            alert('请录入电话或手机其中一项！')
                            return false
                        } else if (this.valueCome(productText, 'nationality') == '') {
                            alert('请录入国籍！')
                            return false
                        } else if (this.valueCome(productText, 'nationality') == 'ML' && this.valueCome(productText, 'nationality') == '') {
                            alert('请正确录入国籍信息！')
                            return false
                        } else if (this.valueCome(productText, 'Certificates') == '') {
                            alert('请录入证件类型！')
                            return false
                        } else if (this.valueCome(productText, 'Certificates') == '7' && this.valueCome(productText, 'Certificates2') == '') {
                            alert('请正确录入证件类型信息！')
                            return false
                        } else if (this.valueCome(productText, 'Certificates') == '0' && this.valueCome(productText, 'cardStart') == '') {
                            alert('请录入证件起日期！')
                            return false
                        } else if (this.valueCome(productText, 'Certificates') == '0' && this.valueCome(productText, 'cardEnd') == '') {
                            alert('请录入证件有效期！')
                            return false
                        } else if (this.valueCome(productText, 'applicantRelationship') == '') {
                            alert('请录入与投保人关系！')
                            return false
                        } else if (this.valueCome(productText, 'insurRelationship') == '' && this.state.insure != 1) {
                            alert('请录入与第一被保人关系！')
                            return false
                        } else if (this.valueCome(productText, 'MobilePhone') != '' && (!!this.valueCome(productText, 'MobilePhone').match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)) == false) {
                            alert('请正确录入手机号码！')
                            return false
                        } else if (this.valueCome(productText, 'mailbox') != '' && !this.checkemail(this.valueCome(productText, 'mailbox'))) {
                            alert('邮箱格式有误！')
                            return false
                        } else {
                            piccAjax(url + '/AddCustomerServlet', {
                                "login_Account": localStorage.usercode,
                                "name": this.valueCome(productText, 'name'),
                                "genderCode": this.genderCode(productText.gender),
                                "birthday": this.valueCome(productText, 'birthday'),
                                "marriage": this.valueCome(productText, 'Marriage'),
                                "enterprise": this.valueCome(productText, 'WorkUnit'),
                                "provinceCode": this.valueCome(productText, 'provinceValue'),
                                "cityCode": this.valueCome(productText, 'cityCode'),
                                "areaCode": this.valueCome(productText, 'countyCode'),
                                "street": this.valueCome(productText, 'Town'),
                                "community": this.valueCome(productText, 'village'),
                                "card_num": this.valueCome(productText, 'Identification'),
                                "duty": this.valueCome(productText, 'Job'),
                                "email": this.valueCome(productText, 'mailbox'),
                                "zipcode": this.valueCome(productText, 'Postal'),
                                "mobile": this.valueCome(productText, 'Telephone'),
                                "phone": this.valueCome(productText, 'MobilePhone'),
                                "occup_BigCode": this.valueCome(productText, 'occup_BigCode'),
                                "occup_SmallCode": this.valueCome(productText, 'occupationCode'),
                                "occup_Code": this.valueCome(productText, 'occupationCode'),
                                "occup_LevelCode": this.valueCome(productText, 'occup_LevelCode'),
                                "nationality_ID": this.valueCome(productText, 'nationality'),
                                "nationality_ID2": this.valueCome(productText, 'nationality2'),
                                "id_Type2": this.valueCome(productText, 'Certificates'),
                                "id_Type_Code": this.valueCome(productText, 'Certificates2'),
                                "id_Start_Date": this.valueCome(productText, 'cardStart'),
                                "id_End_Date": this.valueCome(productText, 'cardEnd'),
                                "long_Date": "0",
                                "payStyle": "",
                                "refused": "",
                                "haved": "",
                                "haved_Money": "",
                                "first_Relation_One": "",
                                "first_Relation_Two": "",
                                "second_Relation_One": "",
                                "second_Relation_Two": "",
                                "second_First_Relation_One": "",
                                "second_First_Relation_Two": "",
                                "third_Relation_One": "",
                                "third_Relation_Two": "",
                                "third_First_Relation_One": "",
                                "third_First_Relation_Two": "",
                                "taxHospital": this.valueCome(productText, 'taxHospital'),
                                "taxMethod": "",
                                "taxRegistration": "",
                                "socialCredit": "",
                                "taxDutyMoney": "",
                                "taxDutyScale": "",
                                "taxDutyAmount": "",
                                "taxDutyRange": "",
                                "customer_id": this.valueCome(productText, 'customer_id'),
                                "salary": this.valueCome(productText, 'income')
                            }, data => {
                                let nextWhere = false
                                if (data.status) {
                                    if (that.state.productData[1].applicantRelationship == '00') {
                                        localStorage.touName = that.state.productData[1].name
                                        db.exeSql('UPDATE plan SET applicantId = ? WHERE policyUUID = ?', [JSON.parse(localStorage.planID)[0], localStorage.proposalId]);
                                        db.exeSql('UPDATE policy SET applicantUUID = ?, isForSelf = ? WHERE uuid = ?', [JSON.parse(localStorage.planID)[0], true, localStorage.proposalId]);
                                        nextWhere = true
                                        localStorage.ApplicantId = JSON.parse(localStorage.planID)[0]
                                    } else {
                                        db.exeSql('UPDATE policy SET applicantUUID = ?, isForSelf = ? WHERE uuid = ?', ['', false, localStorage.proposalId]);
                                    }
                                    console.log(JSON.parse(localStorage.planID)[insure - 1], '1111')
                                    console.log(JSON.parse(localStorage.planID), '222')
                                    db.exeSql('UPDATE customer SET relation = ?, Brelation = ?, citizenship = ?, marriage = ?, card_type = ?, cardNum = ?,cardStartTime = ?, cardTime = ?, enterprise = ?, yearIncome = ?, provinceCode = ?, cityCode = ?, area = ?, street = ? , createDate = ? , duty = ? , community = ? , postalcode = ?, phone = ?, mobile = ? , email = ? WHERE customerId = ?', [JSON.stringify({
                                            code: that.valueCome(productText, 'applicantRelationship'),
                                            name: that.TabelValue(that.valueCome(productText, 'applicantRelationship', insure), that.state.relation)
                                        }), JSON.stringify(that.valueCome(productText, 'insurRelationship') ? {
                                            code: that.valueCome(productText, 'insurRelationship'),
                                            name: that.TabelValue(that.valueCome(productText, 'insurRelationship', insure), that.state.relation)
                                        } : {}), JSON.stringify({
                                            type: that.valueCome(productText, 'nationality'),
                                            code: that.valueCome(productText, 'nationality2'),
                                            name1: that.TabelValue(that.valueCome(productText, 'nationality', insure), that.state.nationality),
                                            name2: that.valueCome(productText, 'nationality') == 'ML' ? '中国' : ''
                                        }), JSON.stringify({
                                            code: that.valueCome(productText, 'Marriage'),
                                            des: that.valueCome(productText, 'MarriageText')
                                        }), JSON.stringify({
                                            code: that.valueCome(productText, 'Certificates'),
                                            name: that.TabelValue(that.valueCome(productText, 'Certificates', insure), that.state.cardType),
                                            info: that.valueCome(productText, 'Certificates2')
                                        }), that.valueCome(productText, 'Identification'), that.valueCome(productText, 'cardStart'), that.valueCome(productText, 'cardEnd'), that.valueCome(productText, 'WorkUnit'), that.valueCome(productText, 'income'), JSON.stringify({
                                            code: that.valueCome(productText, 'provinceValue'),
                                            name: that.provin(that.valueCome(productText, 'provinceValue'))
                                        }), JSON.stringify({
                                            code: that.valueCome(productText, 'cityCode'),
                                            name: that.provin(that.valueCome(productText, 'cityCode'))
                                        }), JSON.stringify({
                                            code: that.valueCome(productText, 'countyCode'),
                                            name: that.provin(that.valueCome(productText, 'countyCode'))
                                        }), that.valueCome(productText, 'Town'), (new Date).Format('yyyy-MM-dd'), that.valueCome(productText, 'Job'), that.valueCome(productText, 'village'), that.valueCome(productText, 'Postal'), that.valueCome(productText, 'Telephone'), that.valueCome(productText, 'MobilePhone'), that.valueCome(productText, 'mailbox'), JSON.parse(localStorage.productData).productData.planID[insure - 1]],
                                        function(res) {
                                            that.setState({
                                                productData: {
                                                    ...that.state.productData,
                                                    [insure]: {
                                                        ...that.state.productData[insure],
                                                        "customer_id": data.data
                                                    }
                                                }
                                            }, () => {
                                                let productData = JSON.parse(localStorage.productData)
                                                productData.productData = that.state
                                                localStorage.productData = JSON.stringify(productData)
                                                $.ajax({
                                                    type: 'post',
                                                    url: that.state.baseUrl + '/ProposalUpdateServlet',
                                                    data: JSON.stringify({
                                                        "proposalID": localStorage.proposalId,
                                                        "planContent": localStorage.type,
                                                        "productContent": localStorage.productData,
                                                        "login_account": localStorage.usercode
                                                    }),
                                                    success: function (data) {
                                                        if (localStorage.type == '20') {
                                                            location.href = 'warrant.html'
                                                        } else {
                                                             location.href = (nextWhere ? 'beneficiary.html' : 'policyholderinfo.html')
                                                        }
                                                    }
                                                })
                                                
                                            })

                                        });

                                } else {
                                    alert('更新客户信息失败！')
                                }

                            })
                        }


                    })

                }
            } else {
                if (this.state.insure != 1) {
                    this.setState({
                        insure: this.state.insure - 1
                    })
                } else {
                    let productData = JSON.parse(localStorage.productData)
                    productData.productData = this.state
                    localStorage.productData = JSON.stringify(productData)
                    location.href = 'informinsured.html'
                }
            }
        }
        //关系下拉
         relation(relation) {
            if (relation) {
                if(localStorage.type=='10'){
                    return relation.map((prod,index) => {
                        if (index<=5) {
                            return (
                                <option value={prod.code}>{prod.dict_name}</option>
                            )
                        }
                    })
                } else if (localStorage.type == '20') {
                    return relation.map((prod,index) => {
                        if (index==0) {
                            return (
                                <option value={prod.code}>{prod.dict_name}</option>
                            )
                        }
                    })
                }else{
                    return relation.map(prod => {
                        return (
                            <option value={prod.code}>{prod.dict_name}</option>
                        )
                    })
                }
                
            }
        }
        dataTime(className) {
            //出生日期
            this.setState({
                className: className
            }, () => {
                let className = this.state.className
                $.date('.' + className);
            })
        }
        TabelValue(value, data, index) {
            let tabelState = false
            let tabelValue = ''
            data.map(prod => {
                if (prod.code == value) {
                    tabelValue = prod.dict_name
                    tabelState = true
                }
            })
            if (tabelState) {
                return tabelValue
            } else {
                return ''
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
        //证件起始日期or证件有效期
        cardTime(prod, value) {
            let e = window.event || arguments[0];
            let TIME_OPT = this.state.TIME_OPT
            if (value == '1') {
                $('.dataTime').mobiscroll($.extend(TIME_OPT['date'], TIME_OPT['default'])).end();


            } else {
                $('.dataTime').mobiscroll($.extend(TIME_OPT['date'], TIME_OPT['default'])).end();

            }
        }
        Sex(prod, value) {
            if (value == 'M') {
                if (prod.gender == 'M') {
                    return true
                } else {
                    return false
                }
            }
            if (value == 'F') {
                if (prod.gender == 'F') {
                    return true
                } else {
                    return false
                }
            }

        }
        choiceSex(sex, index) {
            //性别选择
            this.setState({
                productData: {
                    ...this.state.productData,
                    [index]: {
                        ...this.state.productData[index],
                        gender: sex
                    }
                }
            }, () => {})
        }
        occupBig(value, prod) {
            return value
        }
        occupLittle(bigValue, littleValue, prod) {
            if (littleValue) {
                return occop_data[bigValue].sub[littleValue].des
            }

        }
        provin(value) {
            let provinState = false
            let provinValue = ''
            this.state.Address.map(prod => {
                if (prod.addressCode == value) {
                    provinState = true
                    provinValue = prod.addressName
                }
            })
            if (provinState) {
                return provinValue
            } else {
                return ''
            }
        }
        province(prod) {
            let e = window.event || arguments[0];
            let provinceID = ''
            let cityJson = []
            this.state.Address.map(data => {
                if (data.addressCode == e.target.value) {
                    provinceID = data.addressCode
                    
                }
            })
            this.state.Address.map(Json => {
                if (provinceID == Json.pid && Json.type == 2) {
                    cityJson.push(Json)
                }
            })
            this.setState({
                productData: {
                    ...this.state.productData,
                    [prod]: {
                        ...this.state.productData[prod],
                        provinceValue: e.target.value,
                        cityJson: cityJson,
                        cityState: true,
                        countyName: null,
                        countyJson: [],
                        cityCode: -1
                    }
                }
            }, () => {})
        }
        city(prod) {
            let e = window.event || arguments[0];
            let code = ''
            let that = this
            let countyJson = []
            this.state.Address.map((key) => {
                if (key.addressCode == e.target.value) {
                    code = key.addressCode
                }
            })

            this.state.Address.map(Json => {
                if (Json.pid == code && Json.type == 3) {
                    countyJson.push(Json)
                }
            })
            console.log(code,'code')
            console.log(countyJson,'countyJson')
            that.setState({
                productData: {
                    ...this.state.productData,
                    [prod]: {
                        ...this.state.productData[prod],
                        cityCode: e.target.value,
                        countyJson: countyJson
                    }
                }
            }, () => {})
        }
        county(prod) {
            let e = window.event || arguments[0];
            let that = this
            that.setState({
                productData: {
                    ...this.state.productData,
                    [prod]: {
                        ...this.state.productData[prod],
                        countyCode: e.target.value,
                    }
                }
            }, () => {})
        }
        //邮箱校验
        checkemail(str) {
            var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
            if (!reg.test(str)) {
                return false
            } else {
                return true
            }
        }
        informInformation(prod, value) {
            let e = window.event || arguments[0];
            //监听变化储存数据
            if (value == 'applicantRelationship' && this.state.insure != 1) {
                if (e.target.value == '00') {
                    alert('第一被保人才可选择本人!')
                    this.setState({
                        productData: {
                            ...this.state.productData,
                            [prod]: {
                                ...this.state.productData[prod],
                                applicantRelationship: '-1'
                            }
                        }
                    })
                    return false
                } else {
                    this.setState({
                        productData: {
                            ...this.state.productData,
                            [prod]: {
                                ...this.state.productData[prod],
                                [value]: e.target.value
                            }
                        }
                    }, () => {
                        if (this.state.productData[prod].nationality) {
                            if (this.state.productData[prod].nationality == 'ML') {
                                this.setState({
                                    productData: {
                                        ...this.state.productData,
                                        [prod]: {
                                            ...this.state.productData[prod],
                                            "nationality_list2": true
                                        }
                                    }
                                })
                            } else {
                                this.setState({
                                    productData: {
                                        ...this.state.productData,
                                        [prod]: {
                                            ...this.state.productData[prod],
                                            "nationality_list2": false
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            } else {
                this.setState({
                    productData: {
                        ...this.state.productData,
                        [prod]: {
                            ...this.state.productData[prod],
                            [value]: e.target.value
                        }
                    }
                }, () => {
                    if (this.state.productData[prod].nationality) {
                        if (this.state.productData[prod].nationality == 'ML') {
                            this.setState({
                                productData: {
                                    ...this.state.productData,
                                    [prod]: {
                                        ...this.state.productData[prod],
                                        "nationality_list2": true
                                    }
                                }
                            })
                        } else {
                            this.setState({
                                productData: {
                                    ...this.state.productData,
                                    [prod]: {
                                        ...this.state.productData[prod],
                                        "nationality_list2": false
                                    }
                                }
                            })
                        }
                    }
                })
            }

        }
        ValueData(prod, value) {
            if (this.state.productData[prod]) {
                if (this.state.productData[prod][value]) {
                    return this.state.productData[prod][value]
                }
            } else {
                return null
            }
        }
        render() {
            let productData = this.state.productData ? this.state.productData : ''
            let insurInformationlength = this.state.insurInformation ? Object.keys(this.state.insurInformation).length : 0
            let insurInformation = this.state.insurInformation
            return (
                <div>
                {
                    this.state.productData && Object.keys(this.state.productData).map((prod) => {
                        return (
                            <div style={{display:'none'}}
                                 className={prod == this.state.insure ? 'block compleInfo' : 'compleInfo'}>
                                <div className="insuredinfo">
                                    <p className="title">第<span>{prod}</span>被保人信息补全
                                    </p>
                                    <div className="insuredinfo_close">
                                        <span>与投保险人关系:</span>
                                        <select className="guanxi"
                                                onChange={this.informInformation.bind(this, prod, "applicantRelationship")}
                                                value={this.ValueData(prod, "applicantRelationship")}>
                                                <option value="-1">请选择</option>
                                            {
                                                this.relation(this.state.relation)
                                            }

                                        </select>
                                    </div>
                                    {
                                        prod > 1 && <div className="insuredinfo_close guanxi_bei">
                                            <span>与第一被保人关系:</span>
                                            <select className="guanxi guanxi2"
                                                    onChange={this.informInformation.bind(this, prod, 'insurRelationship')}
                                                    value={this.ValueData(prod, "insurRelationship")}>

                                                <option value="-11">请选择</option>
                                                {
                                                    this.relation(this.state.relation)
                                                }
                                            </select>
                                        </div>
                                    }
                                    <div className="insuredinfo_con">
                                        <ul className="insuredinfo_con_list clearfix">
                                            <li className="clearfix">
                                                <p>姓名：</p>
                                                <div className="clearfix">
                                                    <input type="text"
                                                           onChange={this.informInformation.bind(this, prod, 'insurName')}
                                                           className="name insured_name fl backcolor"
                                                           value={this.state.productData[prod].name}
                                                           readonly="readonly" disable="disable"/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>性别：</p>
                                                <input disabled type="checkbox" name="sex " value="1" style={{display:'inline-block'}} className="male"
                                                       onClick={this.choiceSex.bind(this, 'M', prod)} checked={this.Sex(this.state.productData[prod],'M')}/>&nbsp;
                                                <label style={{background:'none'}}>男</label>&nbsp;&nbsp;&nbsp;
                                                <input disabled type="checkbox" name="sex " value="2" style={{display:'inline-block'}} className="female"
                                                       onClick={this.choiceSex.bind(this, 'F', prod)} checked={this.Sex(this.state.productData[prod],'F')}/>&nbsp;
                                                <label style={{background:'none'}}>女</label>
                                            </li>
                                            <li className="clearfix">
                                                <p>国籍：</p>
                                                <div className="clearfix nationality">
                                                    <select className="nationality_list1"
                                                            onChange={this.informInformation.bind(this, prod, 'nationality')}
                                                            value={this.ValueData(prod, "nationality")}>
                                                        <option value="-1">请选择</option>
                                                        {this.nationalitySelect(this.state.nationality)}
                                                    </select>
                                                    {
                                                        this.state.productData[prod].nationality == 'ML' &&
                                                        <select className="nationality_list2" value='CHN' onChange={this.informInformation.bind(this, prod, 'nationality2')}>
                                                            <option value="-1">请选择</option>
                                                            <option value="CHN">中国</option>
                                                        </select>
                                                    }

                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>出生日期：</p>
                                                <div className="clearfix datatime">
                                                    <input type="text" value={this.state.productData[prod].birthday} className="name fl from_time from_time_me" style={{backgroundColor:'#f5f5f5'}}
                                                            disabled/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>婚姻状况：</p>
                                                <div className="clearfix marriage">
                                                    <select className="fl marriage_list1"
                                                            onChange={this.informInformation.bind(this, prod, 'Marriage')}
                                                            value={this.ValueData(prod, "Marriage")}>
                                                        <option value="-1">请选择</option>
                                                        <option value="0">未婚</option>
                                                        <option value="1">已婚</option>
                                                        <option value="7">其他</option>
                                                    </select>
                                                    {
                                                        this.state.productData[prod].MarriageState &&
                                                        <input type="text" className="fl marriage_list2" onChange={this.informInformation.bind(this, prod, 'MarriageText')}
                                                               style={{background: 'rgb(245, 245, 245)'}}/>
                                                    }
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>证件类型：</p>
                                                <div className="clearfix marriage">
                                                    <select className="fl paper_list1"
                                                            onChange={this.informInformation.bind(this, prod, 'Certificates')}
                                                            value={this.ValueData(prod, "Certificates")}>
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
                                                    {
                                                        this.state.productData[prod].CertificatesState &&
                                                        <input type="text" className="fl marriage_list2"
                                                               style={{background: 'rgb(245, 245, 245)'}} onChange={this.informInformation.bind(this, prod, 'Certificates2')}/>
                                                    }
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>证件号码：</p>
                                                <div>
                                                    <input type="text" name="id"
                                                           onChange={this.informInformation.bind(this, prod, 'Identification')}
                                                           value={this.ValueData(prod, "Identification")}
                                                           className="name paper_code fl"/>
                                                    <i>*</i>
                                                    <div className="error fl"></div>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>证件起日期：</p>
                                                <div className="clearfix ">
                                                    <input type="text"  id={'cardStart' + prod} value={this.ValueData(prod, "cardStart")} className="name fl from_time from_time_me dataTime" onClick={this.cardTime.bind(this,prod,'1')}
                                                            />
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>证件有效期：</p>
                                                <div className="clearfix ">
                                                    <input type="text" id={'cardEnd' + prod} value={this.ValueData(prod, "cardEnd")} className="name fl from_time from_time_me dataTime"  onClick={this.cardTime.bind(this,prod,'2')}
                                                            />
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            {
                                                localStorage.type == '20' && <li className="clearfix">
                                                <p>个税征收方式：</p>
                                                <div className="clearfix marriage">
                                                    <select className="fl paper_list1"
                                                            onChange={this.informInformation.bind(this, prod, 'customerPersonalTaxType')}
                                                            value={this.ValueData(prod, "customerPersonalTaxType")}>
                                                        <option value="-1">请选择</option>
                                                        <option value="0">代扣代缴</option>
                                                        <option value="1">自行申报</option>
                                                    </select>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            }
                                            {
                                                localStorage.type == '20' && <li className="clearfix">
                                                <p>税务登记证号码：</p>
                                                <div className="clearfix">
                                                    <input type="text"
                                                           onChange={this.informInformation.bind(this, prod, 'taxCardNumber')}
                                                           value={this.ValueData(prod, "taxCardNumber")}
                                                           className="name work_unit fl" maxLength='15'/>
                                                </div>
                                            </li>
                                            }
                                            {
                                                localStorage.type == '20' && <li className="clearfix">
                                                <p>社会信用代码：</p>
                                                <div className="clearfix">
                                                    <input type="text"
                                                           onChange={this.informInformation.bind(this, prod, 'messageNumber')}
                                                           value={this.ValueData(prod, "messageNumber")}
                                                           className="name work_unit fl" maxLength = '18'/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            }
                                            <li className="clearfix">
                                                <p>工作单位：</p>
                                                <div className="clearfix">
                                                    <input type="text"
                                                           onChange={this.informInformation.bind(this, prod, 'WorkUnit')}
                                                           value={this.ValueData(prod, "WorkUnit")}
                                                           className="name work_unit fl"/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>职务：</p>
                                                <div className="clearfix">
                                                    <input type="text" className="name duty fl"
                                                           onChange={this.informInformation.bind(this, prod, 'Job')}
                                                           value={this.ValueData(prod, "Job")}/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>职业大类：</p>
                                                <div className="clearfix occupation">
                                                    <input type="text"
                                                           value={this.occupBig(productData[prod].occup_BigCode, prod)}
                                                           className="name work_unit fl backcolor bigjob" disabled/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>职业小类：</p>
                                                <div className="clearfix occupation">
                                                    <input type="text"
                                                           value={this.occupLittle(productData[prod].occup_BigCode, productData[prod].occupationCode, prod)}
                                                           className="name work_unit fl backcolor smalljob" disabled/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>职业代码：</p>
                                                <div className="clearfix">
                                                    <input type="text" className="name occupation_code fl backcolor"
                                                           value={productData[prod].occupationCode} disabled/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>类别：</p>
                                                <div className="clearfix">
                                                    <input type="text" className="name occupation_type fl backcolor"
                                                           value={productData[prod].occup_LevelCode} disabled/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>年收入(万元)：</p>
                                                <div className="clearfix">
                                                    <input type="number" className="name income fl"
                                                           onChange={this.informInformation.bind(this, prod, 'income')}
                                                           value={this.ValueData(prod, "income")}/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>联系地址：</p>
                                                <div className="clearfix occupation mb15">
                                                    <p className="clearfix">
                                                        <select className="sheng_list fl"
                                                                value={this.ValueData(prod, "provinceValue")}
                                                                onChange={this.province.bind(this, prod)}>
                                                            <option value="-1">省（直辖市）</option>
                                                            {this.Address(this.state.Address,1)}
                                                        </select>
                                                        <i className="fl">*</i>
                                                    </p>
                                                    <p className="clearfix">
                                                        <select className="shi_list fl"
                                                                value={productData[prod].cityCode}
                                                                onChange={this.city.bind(this, prod)}>

                                                                {this.state.productData[prod].cityState && <option value='-1'>请选择</option>}
                                                                {this.state.productData[prod].cityState && this.Address(this.state.productData[prod].cityJson,2)}
                                                        </select>
                                                        <i className="fl">*</i>
                                                    </p>
                                                    <p className="clearfix">
                                                        <select name="s_county" className="qu_list fl"
                                                                value={productData[prod].countyCode}
                                                                onChange={this.county.bind(this, prod)}>
                                                                {this.state.productData[prod].countyJson && <option value='-1'>请选择</option>}
                                                                {this.state.productData[prod].countyJson && this.Address(this.state.productData[prod].countyJson,3)}
                                                        </select>
                                                        
                                                        <i className="fl">*</i>
                                                    </p>
                                                </div>
                                                <p>乡镇（街道）：</p>
                                                <div className="clearfix">
                                                    <input type="text" className="name street fl"
                                                           onChange={this.informInformation.bind(this, prod, 'Town')}
                                                           value={this.ValueData(prod, "Town")}/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className='clearfix'>
                                                <p>村(社区)：</p>
                                                <div className="clearfix">
                                                    <input type="text" className="name community fl"
                                                           onChange={this.informInformation.bind(this, prod, 'village')}
                                                           value={this.ValueData(prod, "village")}/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>邮政编码：</p>
                                                <div className="clearfix">
                                                    <input type="number" className="name postalcode fl"
                                                           onChange={this.informInformation.bind(this, prod, 'Postal')}
                                                           value={this.ValueData(prod, "Postal")}/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>电话：</p>
                                                <div className="clearfix">
                                                    <input type="text" className="name phone fl"
                                                           onChange={this.informInformation.bind(this, prod, 'Telephone')}
                                                           value={this.ValueData(prod, "Telephone")}/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>手机：</p>
                                                <div className="clearfix">
                                                    <input type="number" className="name mobile fl"
                                                           onChange={this.informInformation.bind(this, prod, 'MobilePhone')}
                                                           value={this.ValueData(prod, "MobilePhone")}/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>邮箱：</p>
                                                <div className="clearfix">
                                                    <input type="text" className="name email fl"
                                                           onChange={this.informInformation.bind(this, prod, 'mailbox')}
                                                           value={this.ValueData(prod, "mailbox")}/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                <p className="beneficiary_btn mb15 clearfix"><a href="javascript:;"
                                                                onClick={this.NextBth.bind(this, 0)}>上一步</a><a
                    href="javascript:;" onClick={this.NextBth.bind(this, 1)}>下一步</a></p>
                    {
                    this.state.loading && <div className="loading clearfix" style={{display: 'block'}}>
                        <div className="loading_box">
                            <div className="fl">
                                <div className="spinner">
                                    <div className="spinner-container container1">
                                        <div className="circle1"></div>
                                        <div className="circle2"></div>
                                        <div className="circle3"></div>
                                        <div className="circle4"></div>
                                    </div>
                                    <div className="spinner-container container2">
                                        <div className="circle1"></div>
                                        <div className="circle2"></div>
                                        <div className="circle3"></div>
                                        <div className="circle4"></div>
                                    </div>
                                    <div className="spinner-container container3">
                                        <div className="circle1"></div>
                                        <div className="circle2"></div>
                                        <div className="circle3"></div>
                                        <div className="circle4"></div>
                                    </div>
                                </div>
                            </div>
                            <span className="fl">加载中,请稍后</span>
                        </div>
                    </div>
                }
            </div>
            )
        }
    }
    ReactDOM.render(
        <ComplementingInsured/>,
        document.getElementById('Insurer')
    );