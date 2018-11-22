    class ComplementingInsured extends React.PureComponent {
        constructor() {
            super();
            this.state = {
                insure: 10,
                insurInformation: {},
                baseUrl: 'http://jkejt.picchealth.com:7087',
                selectData: '',
                loading: true,
                paseUrl: 'http://jkejt.picchealth.com:7087',
                occup_LittleState: false,
                CustomerState: false,
                CustomerPage: 1,
                CustomerPageSize: 10,
                aCity:{11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"} 
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
                    ApplicantOccupCode: occop_data,
                    nationality: ''
                })
            })
            piccAjax(url + '/nationalityaction', {}, data => {
                if (data && data.ReturnMessage == '查询成功') {
                    that.setState({
                        nationality: data.data1 //被保人国籍
                    }, () => {
                        that.setState({
                            Address: Varcity.data,
                            loading: false
                        }, () => {
                            $('#loading').hide()
                        })
                    })
                }
            }, '', '', false)
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
        //地区下拉
        Addresss(data, value) {
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
            let productJson = this.state.ApplicantData
            let cardStart = 'cardStart'
            let cardEnd = 'cardEnd'
            let birthday = 'birthday'
            let url = this.state.paseUrl
            let that = this

            if (id == 1) {
                productJson = {
                    ...productJson,
                    cardStart: $('#' + cardStart).val(),
                    cardEnd: $('#' + cardEnd).val(),
                    birthday: $('#' + birthday).val()
                }
                this.setState({
                    ApplicantData: productJson
                }, () => {
                    let productText = this.state.ApplicantData
                    let cardStartData = this.valueCome(productText, 'cardStart').replace(new RegExp('-', 'g'), '')
                    let cardEndData = this.valueCome(productText, 'cardEnd').replace(new RegExp('-', 'g'), '')
                    let creatTimeData = (new Date).Format('yyyy-MM-dd')
                    if (this.valueCome(productText, 'Marriage') == '') {
                        alert('请录入婚姻状况！')
                        return false
                    } else if (this.valueCome(productText, 'Certificates') == '0' && cardStartData >= cardEndData) {
                        alert('证件起始日期不能大于证件有效期')
                        return false
                    } else if (this.valueCome(productText, 'Certificates') == '0' && cardStartData >= creatTimeData) {
                        alert('证件起始日期不能大于当天日期！')
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
                    } else if (this.valueCome(productText, 'Certificates') == '0' && this.isCardID(this.valueCome(productText, 'Identification'))==false) {
                        alert('身份证号有误！')
                        return false
                    }  else if (this.valueCome(productText, 'MobilePhone') != '' && (!!this.valueCome(productText, 'MobilePhone').match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)) == false) {
                    alert('请正确录入手机号码！')
                    return false
                    } else if (this.valueCome(productText, 'mailbox') != '' && !this.checkemail(this.valueCome(productText, 'mailbox'))) {
                        alert('邮箱格式有误！')
                        return false
                    } else {
                        this.setState({
                            loading: true
                        })
                        localStorage.touName = this.valueCome(productText, 'name')
                        
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
                                let coucp1 = {}
                                coucp1.code = productJson.occup_BigCode;
                                coucp1.name = this.state.ApplicantOccupCode[productJson.occup_BigCode].des
                                let coucp2 = {}
                                coucp2.code = productJson.occupationCode;
                                coucp2.level = productJson.occup_LevelCode;
                                coucp2.name = this.state.ApplicantOccupCode[productJson.occup_BigCode].sub[productJson.occupationCode].des
                                coucp1 = JSON.stringify(coucp1)
                                coucp2 = JSON.stringify(coucp2)
                                 localStorage.ApplicantId =data.data
                                db.exeSql('UPDATE plan SET applicantId = ? WHERE policyUUID = ?', [data.data, localStorage.proposalId]);
                                db.exeSql('UPDATE policy SET applicantUUID = ?, isForSelf = ? WHERE uuid = ?', [data.data, false, localStorage.proposalId]);
                                db.query('SELECT * FROM customer WHERE customerId = ?', [data.data], function(res) {
                                    if (res.length != 0) {
                                        db.exeSql('UPDATE customer SET id = ?,Brelation = ?,relation = ?, name = ? ,genderCode = ?,birthday = ?,occupCate = ?,occupation = ?,citizenship = ?, marriage = ?, card_type = ?, cardNum = ?,cardStartTime = ?, cardTime = ?, enterprise = ?, yearIncome = ?, provinceCode = ?, cityCode = ?, area = ?, street = ? , createDate = ? , duty = ? , community = ? , postalcode = ?, phone = ?, mobile = ? , email = ? WHERE customerId = ?', ['1','{}', '{}', that.valueCome(productText, 'name'), that.genderCode(that.valueCome(productText, 'gender')), that.valueCome(productText, 'birthday'), coucp1, coucp2, JSON.stringify({
                                                type: that.valueCome(productText, 'nationality'),
                                                code: that.valueCome(productText, 'nationality2'),
                                                name1: that.TabelValue(that.valueCome(productText, 'nationality'), that.state.nationality),
                                                name2: that.valueCome(productText, 'nationality') == 'ML' ? '中国' : ''
                                            }), JSON.stringify({
                                                code: that.valueCome(productText, 'Marriage'),
                                                des: that.valueCome(productText, 'MarriageText')
                                            }), JSON.stringify({
                                                code: that.valueCome(productText, 'Certificates'),
                                                name: that.TabelValue(that.valueCome(productText, 'Certificates'), that.state.cardType),
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
                                            }), that.valueCome(productText, 'Town'), (new Date).Format('yyyy-MM-dd'), that.valueCome(productText, 'Job'), that.valueCome(productText, 'village'), that.valueCome(productText, 'Postal'), that.valueCome(productText, 'Telephone'), that.valueCome(productText, 'MobilePhone'), that.valueCome(productText, 'mailbox'), data.data],
                                            function(res) {
                                                console.log(res, '客户表更新')
                                                that.setState({
                                                    ApplicantData: {
                                                        ...that.state.ApplicantData,
                                                        "customer_id": data.data
                                                    }
                                                }, () => {
                                                    let productData = JSON.parse(localStorage.productData)
                                                    productData.ApplicantData = that.state.ApplicantData
                                                    localStorage.productData = JSON.stringify(productData)
                                                    localStorage.ApplicantId = data.data
                                                    localStorage.applicantId = data.data
                                                    location.href = 'beneficiary.html'

                                                })

                                            });
                                    } else {
                                        db.exeSql('INSERT INTO customer (id,Brelation,relation,name,genderCode,birthday,occupCate,occupation,citizenship, marriage, card_type, cardNum, cardStartTime, cardTime, enterprise, yearIncome,provinceCode,cityCode,area,street,createDate,duty,community,postalcode,phone,mobile,email,customerId,policyUUID) VALUES(?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)', ['1','{}', '{}', that.valueCome(productText, 'name'), that.genderCode(that.valueCome(productText, 'gender')) == '0' ? '1' : '2', that.valueCome(productText, 'birthday'), coucp1, coucp2, JSON.stringify({
                                            type: that.valueCome(productText, 'nationality'),
                                            code: that.valueCome(productText, 'nationality2'),
                                            name1: that.TabelValue(that.valueCome(productText, 'nationality'), that.state.nationality),
                                            name2: that.valueCome(productText, 'nationality') == 'ML' ? '中国' : ''
                                        }), JSON.stringify({
                                            code: that.valueCome(productText, 'Marriage'),
                                            des: that.valueCome(productText, 'MarriageText')
                                        }), JSON.stringify({
                                            code: that.valueCome(productText, 'Certificates'),
                                            name: that.TabelValue(that.valueCome(productText, 'Certificates'), that.state.cardType),
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
                                        }), that.valueCome(productText, 'Town'), (new Date).Format('yyyy-MM-dd'), that.valueCome(productText, 'Job'), that.valueCome(productText, 'village'), that.valueCome(productText, 'Postal'), that.valueCome(productText, 'Telephone'), that.valueCome(productText, 'MobilePhone'), that.valueCome(productText, 'mailbox'), data.data, localStorage.proposalId], function(res) {
                                            console.log(res, '客户表新增')
                                            that.setState({
                                                ApplicantData: {
                                                    ...that.state.ApplicantData,
                                                    "customer_id": data.data
                                                }
                                            }, () => {
                                                let productData = JSON.parse(localStorage.productData)
                                                productData.ApplicantData = that.state.ApplicantData
                                                localStorage.productData = JSON.stringify(productData)
                                                localStorage.ApplicantId = data.data
                                                localStorage.applicantId = data.data
                                                $.ajax({
                                                    type: 'post',
                                                    url: that.state.baseUrl + '/ProposalAddServlet',
                                                    data: JSON.stringify({
                                                        "proposalID": localStorage.proposalId,
                                                        "planContent": localStorage.type,
                                                        "productContent": localStorage.productData,
                                                        "login_account": localStorage.usercode
                                                    }),
                                                    success: function (data) {
                                                        location.href = 'beneficiary.html'
                                                    }
                                                })
                                            })
                                        });
                                    }
                                })


                            } else {
                                alert('更新客户信息失败！')
                            }

                        })
                    }


                })

            } else {
                let productData = JSON.parse(localStorage.productData)
                productData.ApplicantData = that.state.ApplicantData
                localStorage.productData = JSON.stringify(productData)
                location.href = 'completeinformation.html'
            }
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
        cardTime(value) {
            let e = window.event || arguments[0];
            let TIME_OPT = this.state.TIME_OPT
            $('.dataTime').mobiscroll($.extend(TIME_OPT['date'], TIME_OPT['default'])).end();
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
        Sex(prod, value) {
            if (prod) {
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

        }
        choiceSex(sex, index) {
            //性别选择
            this.setState({
                ApplicantData: {
                    ...this.state.ApplicantData,
                    gender: sex
                }
            }, () => {})
        }
        EditChoiceSex(sex) {
            //性别选择
            this.setState({
                CustomerData: {
                    ...this.state.CustomerData,
                    genderCode: sex
                }
            }, () => {})
        }
        //  职业大类录入
        occupBig() {
            let e = window.event || arguments[0];
            let ApplicantData = this.state.ApplicantData
            let ApplicantOccupCode = this.state.ApplicantOccupCode
            let occup_LittleArr = ''
            Object.keys(ApplicantOccupCode).map(prod => {
                if (e.target.value == prod) {
                    occup_LittleArr = ApplicantOccupCode[prod]
                }
            })
            this.setState({
                choseOccup: e.target.value,
                occup_LittleState: true,
                ApplicantData: {
                    ...this.state.ApplicantData,
                    occup_LittleArr: occup_LittleArr,
                    occup_BigCode: e.target.value,
                    occup_BigName: ApplicantOccupCode[e.target.value].des,
                    occupationCode:'',
                    occup_LevelCode:''
                }
            }, () => {

                
                
            })

        }
        //职业大类修改
        EditoccupBig() {
            let e = window.event || arguments[0];
            let ApplicantData = this.state.ApplicantData
            let ApplicantOccupCode = this.state.ApplicantOccupCode
            let occup_LittleArr = ''
            Object.keys(ApplicantOccupCode).map(prod => {
                if (e.target.value == prod) {
                    occup_LittleArr = ApplicantOccupCode[prod]
                }
            })
            this.setState({
                EditChoseOccup: e.target.value,
                editOccup_LittleState:true,
                CustomerData: {
                    ...this.state.CustomerData,
                    EfitOccup_LittleArr: occup_LittleArr,
                    occup_BigCode: e.target.value,
                    occup_SmallCode:'',
                    occup_LevelCode:''

                }
            }, () => {
            })
        }
        //  职业小类录入
        occupLittle() {
            let e = window.event || arguments[0];
            let level = ''
            Object.keys(this.state.ApplicantData.occup_LittleArr.sub).map((prod) => {
                if (prod == e.target.value) {
                    level = this.state.ApplicantData.occup_LittleArr.sub[prod].level
                }
            })
            this.setState({
                ApplicantData: {
                    ...this.state.ApplicantData,
                    occupationCode: e.target.value,
                    occup_LevelCode: level,
                    occupationName: occop_data[this.state.ApplicantData.occup_BigCode].sub[e.target.value].des
                }
            }, () => {})
        }
        //  职业小类修改
        EditOccupLittle() {
            let e = window.event || arguments[0];
            let level = ''
            Object.keys(this.state.CustomerData.EfitOccup_LittleArr.sub).map((prod) => {
                if (prod == e.target.value) {
                    level = this.state.CustomerData.EfitOccup_LittleArr.sub[prod].level
                }
            })
            this.setState({
                CustomerData: {
                    ...this.state.CustomerData,
                    occup_SmallCode: e.target.value,
                    occup_LevelCode: level,
                }
            }, () => {})
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
        //  省份添加
        province() {
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
                ApplicantData: {
                    ...this.state.ApplicantData,
                    provinceValue: e.target.value,
                    cityJson: cityJson,
                    cityState: true,
                    countyName: null,
                    countyJson: [],
                    cityCode: -1
                }
            }, () => {})
        }
        //  省份修改
        provinces() {
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
                CustomerData: {
                    ...this.state.CustomerData,
                    salary: e.target.value,
                    cityJson: cityJson,
                    cityState: true,
                    countyName: null,
                    countyJson: [],
                    cityCode: -1
                }
            }, () => {})
        }

        //  市添加
        city() {
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
            that.setState({
                ApplicantData: {
                    ...this.state.ApplicantData,
                    cityCode: e.target.value,
                    countyJson: countyJson
                }
            }, () => {})
        }
        //  市修改
        citys() {
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
            that.setState({
                CustomerData: {
                    ...this.state.CustomerData,
                    cityCode: e.target.value,
                    countyJson: countyJson
                }
            }, () => {})
        }
        //区/县添加
        county() {
            let e = window.event || arguments[0];
            let that = this
            that.setState({
                ApplicantData: {
                    ...this.state.ApplicantData,
                    countyCode: e.target.value,
                }
            }, () => {})
        }
        //区/县修改
        countys() {
            let e = window.event || arguments[0];
            let that = this
            that.setState({
                CustomerData: {
                    ...this.state.CustomerData,
                    areaCode: e.target.value,
                }
            }, () => {})
        }

        informInformation(value) {
            let e = window.event || arguments[0];
            //监听变化储存数据
            this.setState({
                ApplicantData: {
                    ...this.state.ApplicantData,
                    [value]: e.target.value
                }
            }, () => {
                if (this.state.ApplicantData.nationality) {
                    if (this.state.ApplicantData.nationality == 'ML') {
                        this.setState({
                            ApplicantData: {
                                ...this.state.ApplicantData,
                                "nationality_list2": true
                            }
                        })
                    } else {
                        this.setState({
                            ApplicantData: {
                                ...this.state.ApplicantData,
                                "nationality_list2": false
                            }
                        })
                    }
                }
            })
        }
        EditInformInformation(value) {
            let e = window.event || arguments[0];
            //监听变化储存数据
            this.setState({
                CustomerData: {
                    ...this.state.CustomerData,
                    [value]: e.target.value
                }
            }, () => {
                if (this.state.CustomerData.nationality_ID) {
                    if (this.state.CustomerData.nationality_ID == 'ML') {
                        this.setState({
                            CustomerData: {
                                ...this.state.CustomerData,
                                "nationality_ID2": 'CHN'
                            }
                        })
                    } else {
                        this.setState({
                            CustomerData: {
                                ...this.state.CustomerData,
                                "nationality_ID2": ''
                            }
                        })
                    }
                }
            })
        }
        ValueData(value) {
            if (this.state.ApplicantData) {
                if (this.state.ApplicantData[value]) {
                    return this.state.ApplicantData[value]
                }
            } else {
                return null
            }
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
                    let CustomerData = data.data[0]
                    let provinceID = ''
                    let cityJson = []
                    let code = ''
                    let countyJson = []
                    this.state.Address.map(data => {
                        if (data.addressCode == CustomerData.provinceCode) {
                            provinceID = data.addressCode
                            
                        }
                    })
                    this.state.Address.map(Json => {
                        if (provinceID == Json.pid && Json.type == 2) {
                            cityJson.push(Json)
                        }
                    })
                    this.state.Address.map((key) => {
                        if (key.addressCode == CustomerData.cityCode) {
                            code = key.addressCode
                        }
                    })

                    this.state.Address.map(Json => {
                        if (Json.pid == code && Json.type == 3) {
                            countyJson.push(Json)
                        }
                    })
                    CustomerData = {
                        ...CustomerData,
                        EfitOccup_LittleArr:that.state.ApplicantOccupCode[data.data[0].occup_BigCode],
                        cityState:true,
                        countyJson:countyJson,
                        cityJson:cityJson,
                    }
                    that.setState({
                        CustomerLook: true,
                        CustomerData: CustomerData,
                        editOccup_LittleState:true,

                    },()=>{
                    })

                } else {
                    alert('查看客户信息失败！')
                }

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
        //选择客户
        ChoiceCustomer(data, index) {
            //添加已建职业信息
            let e = window.event || arguments[0];
            let that = this
            let ApplicantOccupCode = this.state.ApplicantOccupCode
            let occup_LittleArr = ''
            this.setState({
                choseOccup: data.occup_BigCode,

            }, () => {

                Object.keys(ApplicantOccupCode).map(prod => {
                    if (data.occup_BigCode == prod) {
                        occup_LittleArr = ApplicantOccupCode[prod]
                    }
                })

                let level = ''
                Object.keys(occup_LittleArr.sub).map((prod) => {
                    if (prod == data.occup_ApplicantDataSmallCode) {
                        level = that.state.ApplicantData.occup_LittleArr.sub[prod].level
                    }
                })
                that.setState({
                    occup_LittleState: true,
                    ApplicantData: {
                        ...that.state.ApplicantData,
                        occup_LittleArr: occup_LittleArr,
                        occupationCode: data.occup_SmallCode,
                        occup_LevelCode: level,
                    }
                }, () => {
                    //添加已建地区信息
                    let provinceID = ''
                    let cityJson = []
                    this.state.Address.map(Json => {
                        if (Json.addressCode == data.provinceCode) {
                            provinceID = Json.addressCode
                            
                        }
                    })
                    this.state.Address.map(Json => {
                        if (provinceID == Json.pid && Json.type == 2) {
                            cityJson.push(Json)
                        }
                    })
                    this.setState({
                        ApplicantData: {
                            ...this.state.ApplicantData,
                            provinceValue: data.provinceCode,
                            cityJson: cityJson,
                            cityState: true,
                            countyName: null,
                            countyJson: [],
                            cityCode: -1
                        }
                    }, () => {
                        let code = ''
                        let that = this
                        let countyJson = []
                        this.state.Address.map((Json) => {
                            if (Json.addressCode == data.cityCode) {
                                code = Json.addressCode
                            }
                        })

                        this.state.Address.map(Json => {
                            if (Json.pid == code && Json.type == 3) {
                                countyJson.push(Json)
                            }
                        })
                        that.setState({
                            ApplicantData: {
                                ...this.state.ApplicantData,
                                cityCode: data.cityCode,
                                countyJson: countyJson
                            }
                        }, () => {
                            that.setState({
                                ApplicantData: {
                                    ...this.state.ApplicantData,
                                    countyCode: data.areaCode,
                                }
                            }, () => {
                                this.setState({
                                    ApplicantData: {
                                        ...this.state.ApplicantData,
                                        name: data.name,
                                        gender: data.genderCode == '0' ? 'M' : 'F',
                                        nationality: data.nationality_ID,
                                        nationality2: data.nationality_ID2,
                                        birthday: data.birthday,
                                        Marriage: data.marriage,
                                        Certificates: data.id_Type2,
                                        Identification: data.card_num,
                                        cardStart: data.id_Start_Date,
                                        cardEnd: data.id_End_Date,
                                        WorkUnit: data.enterprise,
                                        Job: data.duty,
                                        occup_SmallCode: data.occup_SmallCode,
                                        occupationCode: data.occup_SmallCode,
                                        occup_LevelCode: data.occup_LevelCode,
                                        income: data.salary,
                                        provinceValue: data.provinceCode,
                                        cityCode: data.cityCode,
                                        countyCode: data.areaCode,
                                        Town: data.street,
                                        village: data.community,
                                        Postal: data.zipcode,
                                        Telephone: data.mobile,
                                        MobilePhone: data.phone,
                                        email: data.mailbox,
                                        occup_BigCode: data.occup_BigCode,
                                    },
                                    CustomerState: false
                                }, () => {})
                            })
                        })
                    })
                })
            })

        }
        //修改客户信息。提交后台
        CustomerEditClick() {
            let that = this
            let CustomerData = this.state.CustomerData
            
            piccAjax(this.state.baseUrl + '/AddCustomerServlet', {
                "login_Account": localStorage.usercode,
                "name": this.valueCome(CustomerData, 'name'),
                "genderCode": this.valueCome(CustomerData, 'genderCode'),
                "birthday": this.valueCome(CustomerData, 'birthday'),
                "marriage": this.valueCome(CustomerData, 'marriage'),
                "enterprise": this.valueCome(CustomerData, 'enterprise'),
                "provinceCode": this.valueCome(CustomerData, 'provinceCode'),
                "cityCode": this.valueCome(CustomerData, 'cityCode'),
                "areaCode": this.valueCome(CustomerData, 'areaCode'),
                "street": this.valueCome(CustomerData, 'street'),
                "community": this.valueCome(CustomerData, 'community'),
                "card_num": this.valueCome(CustomerData, 'card_num'),
                "duty": this.valueCome(CustomerData, 'duty'),
                "email": this.valueCome(CustomerData, 'email'),
                "zipcode": this.valueCome(CustomerData, 'zipcode'),
                "mobile": this.valueCome(CustomerData, 'mobile'),
                "phone": this.valueCome(CustomerData, 'phone'),
                "occup_BigCode": this.valueCome(CustomerData, 'occup_BigCode'),
                "occup_SmallCode": this.valueCome(CustomerData, 'occup_SmallCode'),
                "occup_Code": this.valueCome(CustomerData, 'occup_SmallCode'),
                "occup_LevelCode": this.valueCome(CustomerData, 'occup_LevelCode'),
                "nationality_ID": this.valueCome(CustomerData, 'nationality_ID'),
                "nationality_ID2": this.valueCome(CustomerData, 'nationality_ID2'),
                "id_Type2": this.valueCome(CustomerData, 'id_Type2'),
                "id_Type_Code": this.valueCome(CustomerData, 'id_Type_Code'),
                "id_Start_Date": this.valueCome(CustomerData, 'id_Start_Date'),
                "id_End_Date": this.valueCome(CustomerData, 'id_End_Date'),
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
                "taxHospital": this.valueCome(CustomerData, 'taxHospital'),
                "taxMethod": "",
                "taxRegistration": "",
                "socialCredit": "",
                "taxDutyMoney": "",
                "taxDutyScale": "",
                "taxDutyAmount": "",
                "taxDutyRange": "",
                "customer_id": this.valueCome(CustomerData, 'customer_id'),
                "salary": this.valueCome(CustomerData, 'salary')
            }, Json => {
                piccAjax(this.state.baseUrl + '/queryCustomer', {
                    "login_Account": localStorage.usercode,
                    "customer_id": '',
                    "pageNum": this.state.CustomerPage,
                    "pageSize": this.state.CustomerPageSize
                }, data => {
                    if (data.status) {
                        that.setState({
                            CustomerList: data.data,
                            CustomerLook: false,
                            loading:false
                        })
                    } else {
                        alert('查询客户列表失败！')
                    }
                })
            })
        }
        render() {
            let ApplicantData = this.state.ApplicantData ? this.state.ApplicantData : ''
            return (
                <div>
                            <div style={{display:'block'}}
                                 className='compleInfo'>
                                <div className="insuredinfo">
                                <p className="client_list clearfix">
                                <strong className="fl">投保人信息补全</strong>
                                <span className="fr client_list_btn" onClick={this.CustomerClick.bind(this)}>客户选择列表</span>
                                    </p>
                                    <div className="insuredinfo_con">
                                        <ul className="insuredinfo_con_list clearfix">
                                            <li className="clearfix">
                                                <p>姓名：</p>
                                                <div className="clearfix">
                                                    <input type="text"
                                                           onChange={this.informInformation.bind(this, 'name')}
                                                           className="name insured_name fl "
                                                           value={ApplicantData?ApplicantData.name:null}
                                                           readonly="readonly" />
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>性别：</p>
                                                <input  type="checkbox" name="sex" value="1" style={{display:'inline-block'}} className="male"
                                                       onClick={this.choiceSex.bind(this, 'M')} checked={this.Sex(this.state.ApplicantData,'M')}/>&nbsp;
                                                <label style={{background:'none'}}>男</label>&nbsp;&nbsp;&nbsp;
                                                <input  type="checkbox" name="sex " value="2" style={{display:'inline-block'}} className="female"
                                                       onClick={this.choiceSex.bind(this, 'F')} checked={this.Sex(this.state.ApplicantData,'F')}/>&nbsp;
                                                <label style={{background:'none'}}>女</label>
                                            </li>
                                            <li className="clearfix">
                                                <p>国籍：</p>
                                                <div className="clearfix nationality">
                                                    <select className="nationality_list1"
                                                            onChange={this.informInformation.bind(this,'nationality')}
                                                            value={this.ValueData("nationality")}>
                                                        <option value="-1">请选择</option>
                                                        {this.state.nationality&& this.nationalitySelect(this.state.nationality)}
                                                    </select>
                                                    {
                                                        ApplicantData?ApplicantData.nationality == 'ML' &&
                                                        <select className="nationality_list2" value="CHN" onChange={this.informInformation.bind(this,  'nationality2')}>
                                                            <option value="-1">请选择</option>
                                                            <option value="CHN">中国</option>
                                                        </select>:null
                                                    }

                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>出生日期：</p>
                                                <div className="clearfix ">
                                                    <input type="text" id={'birthday'} value={this.ValueData( "birthday")} className="name fl from_time from_time_me dataTime"  onClick={this.cardTime.bind(this,'2')}
                                                            />
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>婚姻状况：</p>
                                                <div className="clearfix marriage">
                                                    <select className="fl marriage_list1"
                                                            onChange={this.informInformation.bind(this,  'Marriage')}
                                                            value={this.ValueData( "Marriage")}>
                                                        <option value="-1">请选择</option>
                                                        <option value="0">未婚</option>
                                                        <option value="1">已婚</option>
                                                        <option value="7">其他</option>
                                                    </select>
                                                    {
                                                        ApplicantData?this.state.ApplicantData.MarriageState &&
                                                        <input type="text" className="fl marriage_list2" onChange={this.informInformation.bind(this,  'MarriageText')}
                                                               style={{background: 'rgb(245, 245, 245)'}}/>:null
                                                    }
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>证件类型：</p>
                                                <div className="clearfix marriage">
                                                    <select className="fl paper_list1"
                                                            onChange={this.informInformation.bind(this,  'Certificates')}
                                                            value={this.ValueData( "Certificates")}>
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
                                                        ApplicantData.CertificatesState?ApplicantData.CertificatesState &&
                                                        <input type="text" className="fl marriage_list2"
                                                               style={{background: 'rgb(245, 245, 245)'}} onChange={this.informInformation.bind(this, prod, 'Certificates2')}/>:null
                                                    }
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>证件号码：</p>
                                                <div>
                                                    <input type="text" name="id"
                                                           onChange={this.informInformation.bind(this,  'Identification')}
                                                           value={this.ValueData( "Identification")}
                                                           className="name paper_code fl"/>
                                                    <i>*</i>
                                                    <div className="error fl"></div>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>证件起日期：</p>
                                                <div className="clearfix ">
                                                    <input type="text"  id={'cardStart'} value={this.ValueData( "cardStart")} className="name fl from_time from_time_me dataTime" onClick={this.cardTime.bind(this,'1')}
                                                            />
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>证件有效期：</p>
                                                <div className="clearfix ">
                                                    <input type="text" id={'cardEnd'} value={this.ValueData( "cardEnd")} className="name fl from_time from_time_me dataTime"  onClick={this.cardTime.bind(this,'2')}
                                                            />
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>工作单位：</p>
                                                <div className="clearfix">
                                                    <input type="text"
                                                           onChange={this.informInformation.bind(this,  'WorkUnit')}
                                                           value={this.ValueData( "WorkUnit")}
                                                           className="name work_unit fl"/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>职务：</p>
                                                <div className="clearfix">
                                                    <input type="text" className="name duty fl"
                                                           onChange={this.informInformation.bind(this,  'Job')}
                                                           value={this.ValueData( "Job")}/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>职业大类：</p>
                                                <div className="clearfix occupation">
                                                    <select className="insure_con_select userselect_big"
                                                            onChange={this.occupBig.bind(this)}
                                                            refs="occupBigCode"
                                                            value={ApplicantData.occup_BigCode ? ApplicantData.occup_BigCode : ''}>
                                                        <option>请选择</option>
                                                        {
                                                            this.state.ApplicantOccupCode && Object.keys(this.state.ApplicantOccupCode).map((prod, index) => {
                                                                return (
                                                                    <option
                                                                        value={prod}>{this.state.ApplicantOccupCode[prod].des}</option>

                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>职业小类：</p>
                                                <div className="clearfix occupation">
                                                    <select className="insure_con_select userselect_small"
                                                                    onChange={this.occupLittle.bind(this)}
                                                                    value={ApplicantData.occupationCode ? ApplicantData.occupationCode : ''}>
                                                                <option>请选择</option>
                                                                {
                                                                    (this.state.occup_LittleState&&this.state.ApplicantData.occup_LittleArr)&&Object.keys(this.state.ApplicantData.occup_LittleArr.sub).map(prod=>{
                                                                        let selectValue = this.state.ApplicantData.occup_LittleArr.sub
                                                                        return (
                                                                            <option value={prod}
                                                                            >{selectValue[prod].des}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>职业代码：</p>
                                                <div className="clearfix">
                                                    <input type="text" className="name occupation_code fl backcolor"
                                                           value={ApplicantData.occupationCode} disabled/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>类别：</p>
                                                <div className="clearfix">
                                                    <input type="text" className="name occupation_type fl backcolor"
                                                           value={ApplicantData.occup_LevelCode} disabled/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>年收入(万元)：</p>
                                                <div className="clearfix">
                                                    <input type="number" className="name income fl"
                                                           onChange={this.informInformation.bind(this,  'income')}
                                                           value={this.ValueData( "income")}/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>联系地址：</p>
                                                <div className="clearfix occupation mb15">
                                                    <p className="clearfix">
                                                        <select className="sheng_list fl"
                                                                value={this.ValueData( "provinceValue")}
                                                                onChange={this.province.bind(this)}>
                                                            <option value="-1">省（直辖市）</option>
                                                            {this.Address(this.state.Address,1)}
                                                        </select>
                                                        <i className="fl">*</i>
                                                    </p>
                                                    <p className="clearfix">
                                                        <select className="shi_list fl"
                                                                value={ApplicantData.cityCode}
                                                                onChange={this.city.bind(this)}>

                                                                {ApplicantData?ApplicantData.cityState && <option value='-1'>请选择</option>:null}
                                                                {ApplicantData?ApplicantData.cityState && this.Address(this.state.ApplicantData.cityJson,2):null}
                                                        </select>
                                                        <i className="fl">*</i>
                                                    </p>
                                                    <p className="clearfix">
                                                        <select name="s_county" className="qu_list fl"
                                                                value={ApplicantData.countyCode}
                                                                onChange={this.county.bind(this)}>
                                                                {ApplicantData?ApplicantData.countyJson && <option value='-1'>请选择</option>:null}
                                                                {ApplicantData?ApplicantData.countyJson && this.Address(this.state.ApplicantData.countyJson,3):null}
                                                        </select>
                                                        
                                                        <i className="fl">*</i>
                                                    </p>
                                                </div>
                                                <p>乡镇（街道）：</p>
                                                <div className="clearfix">
                                                    <input type="text" className="name street fl"
                                                           onChange={this.informInformation.bind(this,  'Town')}
                                                           value={this.ValueData( "Town")}/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className='clearfix'>
                                                <p>村(社区)：</p>
                                                <div className="clearfix">
                                                    <input type="text" className="name community fl"
                                                           onChange={this.informInformation.bind(this, 'village')}
                                                           value={this.ValueData( "village")}/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>邮政编码：</p>
                                                <div className="clearfix">
                                                    <input type="number" className="name postalcode fl"
                                                           onChange={this.informInformation.bind(this, 'Postal')}
                                                           value={this.ValueData( "Postal")}/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>电话：</p>
                                                <div className="clearfix">
                                                    <input type="text" className="name phone fl"
                                                           onChange={this.informInformation.bind(this, 'Telephone')}
                                                           value={this.ValueData( "Telephone")}/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>手机：</p>
                                                <div className="clearfix">
                                                    <input type="number" className="name mobile fl"
                                                           onChange={this.informInformation.bind(this,  'MobilePhone')}
                                                           value={this.ValueData( "MobilePhone")}/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                            <li className="clearfix">
                                                <p>邮箱：</p>
                                                <div className="clearfix">
                                                    <input type="text" className="name email fl"
                                                           onChange={this.informInformation.bind(this,  'mailbox')}
                                                           value={this.ValueData( "mailbox")}/>
                                                    <i className="fl">*</i>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
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
                {
                    this.state.CustomerState && <div className="loading clearfix" style={{display: 'block'}}>
                        <div className="insure_built insure_built_yj" style={{display: 'block'}}>
                            <div className="mask">
                                <div className="mask_con">
                                    <p className="mask_con_title">客户列表</p>
                                    <div className="mask_con_main contact">
                                        <table className="con_main_table">
                                            <tr>
                                                <th>
                                                    <p>姓名</p>
                                                </th>
                                                <th>
                                                    <p>性别</p>
                                                </th>
                                                <th>
                                                    <p>出生日期</p>
                                                </th>
                                                <th>
                                                    <p>操作</p>
                                                </th>
                                            </tr>
                                            {
                                                this.state.CustomerList && this.state.CustomerList.map((prod,index)=>{
                                                    return(
                                                        <tr>
                                                            <th onClick={this.ChoiceCustomer.bind(this,prod,index)}>
                                                                <p>{prod.name}</p>
                                                            </th>
                                                            <th onClick={this.ChoiceCustomer.bind(this,prod,index)}>
                                                                <p>{prod.genderCode=='0'?'男':'女'}</p>
                                                            </th>
                                                            <th onClick={this.ChoiceCustomer.bind(this,prod,index)}>
                                                                <p>{prod.birthday}</p>
                                                            </th>
                                                            <th>
                                                                <p onClick={this.CustomerLookBth.bind(this,prod)}>查看</p>
                                                            </th>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </table>
                                    </div>
                                    <div className="mask_con_btn">
                                    <p className="clearfix"><a href="javascript:;" className="fl btn-admit" onClick={this.CustomerBth.bind(this,'1')}>确定</a><a href="javascript:;" className="fl btn-cancel" onClick={this.CustomerBth.bind(this,'2')}>取消</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    this.state.CustomerLook && <div className="loading clearfix" style={{display: 'block'}}>
                        <div className="mask" style={{top: '10%',height: '50%'}}>
                            <div className="mask_con mask_co2" style={{height: '100%'}}>
                                <div className="mask_con_main insuredinfo" style={{height: '100%'}}>
                                    <ul className="insuredinfo_con_list clearfix">
                                        <li className="clearfix">
                                            <p>姓名：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name pname fl" onChange={this.EditInformInformation.bind(this,'name')} value={this.state.CustomerData.name}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>性别：</p>
                                            <div className="sex">
                                                <input style={{display:'inlineBlock'}} type="checkbox" value="1" name="sex" onClick={this.EditChoiceSex.bind(this,'0')} className="male" checked={this.state.CustomerData.genderCode!='0'?true:false}/>&nbsp;
                                                <label style={{background:'none'}}>男</label>&nbsp;&nbsp;&nbsp;
                                                <input style={{display:'inlineBlock'}} type="checkbox" value="2" className="female" onClick={this.EditChoiceSex.bind(this,'1')} name="sex" checked={this.state.CustomerData.genderCode=='0'?true:false}/>&nbsp;
                                                <label style={{background:'none'}}>女</label>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>国籍：</p>
                                            <div className="clearfix nationality">
                                                <select className="nationality_list" value={this.state.CustomerData.nationality_ID} onChange={this.EditInformInformation.bind(this,'nationality_ID')}>
                                                    <option value="ML">中国大陆</option>
                                                    <option value="HK">港澳台</option>
                                                    <option value="OS">海外</option>
                                                </select>
                                                {
                                                    this.state.CustomerData.nationality_ID2 && <select>
                                                        <option value="CHN">中国</option>
                                                    </select>
                                                }
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>出生日期：</p>
                                            <div className="clearfix datatime">
                                                <input type="text" className="name ptime fl dataTime"  defaultValue={this.state.CustomerData.birthday}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>婚姻状况：</p>
                                            <div className="clearfix marriage">
                                                <select className="fl marriage_list" value={this.state.CustomerData.marriage} onChange={this.EditInformInformation.bind(this,'marriage')}>
                                                    <option value="0">未婚</option>
                                                    <option value="1">已婚</option>
                                                    <option value="7">其他</option>
                                                </select>
                                                <input type="text" className="fl" disabled style={{display:'none'}}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>证件类型：</p>
                                            <div className="clearfix marriage">
                                                <select className="fl paper_list" value={this.state.CustomerData.id_Type2} onChange={this.EditInformInformation.bind(this,'id_Type2')}>
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
                                                    this.state.CustomerData.id_Type2=='7' && <input type="text" className="fl" disabled />
                                                }
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>证件号码：</p>
                                            <div>
                                                <input type="text" className="name paper_code fl" value={this.state.CustomerData.card_num} onChange={this.EditInformInformation.bind(this,'card_num')}/>
                                                <i>*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>证件起日期：</p>
                                            <div className="datatime clearfix">
                                                <p className="fl" style={{width:'60%', marginRight: '10px'}}>
                                                    <input style={{width:'100%'}} type="text" className="name from_time from_time2  longterm fl dataTime"  defaultValue={this.state.CustomerData.id_Start_Date}/>
                                                </p>
                                                <p className="fl" style={{lineHeight:'26px',display:'none'}}>
                                                    <label for="longtime" className="longterm_btn">长期</label>
                                                    <input type="checkbox" id="longtime" name="" className="longterm_che" style={{display:'inlineBlock'}}/>
                                                </p>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>证件有效期：</p>
                                            <div className="datatime clearfix">
                                                <input type="text" className="name from_time ptime fl dataTime"  defaultValue={this.state.CustomerData.id_End_Date}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>工作单位：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name work_unit fl" value={this.state.CustomerData.enterprise}  onChange={this.EditInformInformation.bind(this,'enterprise')}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>职务：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name duty fl" value={this.state.CustomerData.duty} onChange={this.EditInformInformation.bind(this,'duty')}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>职业大类：</p>
                                            <div className="clearfix occupation">
                                                <select className="fl occupation_big" value={this.state.CustomerData.occup_BigCode} onChange={this.EditoccupBig.bind(this)}>
                                                    <option value="-1">请选择类</option>
                                                    {
                                                        this.state.ApplicantOccupCode && Object.keys(this.state.ApplicantOccupCode).map((prod, index) => {
                                                            return (
                                                                <option
                                                                    value={prod}>{this.state.ApplicantOccupCode[prod].des}</option>

                                                            )
                                                        })
                                                    }
                                                </select>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>职业小类：</p>
                                            <div className="clearfix occupation">
                                                <select className="fl occupation_small" value={this.state.CustomerData.occup_SmallCode} onChange={this.EditOccupLittle.bind(this)}>
                                                    <option value="-1">请选择类</option>
                                                    {
                                                        this.state.editOccup_LittleState&&Object.keys(this.state.CustomerData.EfitOccup_LittleArr.sub).map(prod=>{
                                                            let selectValue = this.state.CustomerData.EfitOccup_LittleArr.sub
                                                            return (
                                                                <option value={prod}
                                                                >{selectValue[prod].des}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>职业代码：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name occupation_code ccc fl" disabled value={this.state.CustomerData.occup_SmallCode}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>类别：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name occupation_level ccc fl" disabled value={this.state.CustomerData.occup_LevelCode}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>年收入(万元)：</p>
                                            <div className="clearfix">
                                                <input type="number" className="name income fl"  value={this.state.CustomerData.salary} onChange={this.EditInformInformation.bind(this,'salary')}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>联系地址：</p>
                                            <div className="clearfix occupation mb15">
                                                <p className="clearfix">
                                                    <select className="sheng_list fl"
                                                            value={this.state.CustomerData.provinceCode}
                                                            onChange={this.provinces.bind(this)}>
                                                        <option value="-1">省（直辖市）</option>
                                                        {this.Addresss(this.state.Address,1)}
                                                    </select>
                                                    <i className="fl">*</i>
                                                </p>
                                                <p className="clearfix">
                                                    <select className="shi_list fl"
                                                         value={this.state.CustomerData.cityCode}
                                                            onChange={this.citys.bind(this)}>

                                                            {this.state.CustomerData?this.state.CustomerData.cityState && <option value='-1'>请选择</option>:null}
                                                            {this.state.CustomerData?this.state.CustomerData.cityState && this.Addresss(this.state.CustomerData.cityJson,2):null}
                                                    </select>
                                                    <i className="fl">*</i>
                                                </p>
                                                <p className="clearfix">
                                                    <select name="s_county" className="qu_list fl"
                                                            value={this.state.CustomerData.areaCode}
                                                            onChange={this.countys.bind(this)}>
                                                            {this.state.CustomerData?this.state.CustomerData.countyJson && <option value='-1'>请选择</option>:null}
                                                            {this.state.CustomerData?this.state.CustomerData.countyJson && this.Addresss(this.state.CustomerData.countyJson,3):null}
                                                    </select>
                                                    <i className="fl">*</i>
                                                </p>
                                            </div>
                                            <p>乡镇（街道）：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name street fl" value={this.state.CustomerData.street} onChange={this.EditInformInformation.bind(this,'street')}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>村(社区)：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name community fl" value={this.state.CustomerData.community} onChange={this.EditInformInformation.bind(this,'community')}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>邮政编码：</p>
                                            <div className="clearfix">
                                                <input type="number" className="name postalcode fl" value={this.state.CustomerData.zipcode} onChange={this.EditInformInformation.bind(this,'zipcode')}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>电话：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name phone fl"  value={this.state.CustomerData.mobile}  onChange={this.EditInformInformation.bind(this,'mobile')}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>手机：</p>
                                            <div className="clearfix">
                                                <input type="number" className="name mobile fl"  value={this.state.CustomerData.phone} onChange={this.EditInformInformation.bind(this,'phone')}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>邮箱：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name email fl" value={this.state.CustomerData.email} onChange={this.EditInformInformation.bind(this,'email')}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                    </ul>
                                    <div className="mask_con_btn mask_con_btn2">
                                        <p className="clearfix">
                                            <a href="javascript:;" onClick={this.CustomerEditClick.bind(this)}>确定</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
            )
        }
    }
    ReactDOM.render(
        <ComplementingInsured/>,
        document.getElementById('Applicant')
    );