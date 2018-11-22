class ClassProductData extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            productData: {},
            newInsurance: [],
            occupCode: '',
            insuranceBox: false,
            occup: {
                "1": {
                    occupLittle: '',
                    occupCodeData: '',
                    level: '',
                }
            },
            Prompt: {
                state: false,
                text: ''
            },
            addProductState: false,
            newProductData: '',
            className: '',
            customerState: false,
            userInfo: [],
            ChoicedUser: '',
            insureLength: -1,
            Cross: false,
            piccUrl: 'http://rbet.mypicc.com.cn:8111', //测试
            // piccUrl: 'http://app.yxgl-picc.cn:5200', //生产
            crossData: {},
            CrossState: false,
            orClause: '2',
            loading: true,
            baseUrl: 'http://jkejt.picchealth.com:7087',
            CustomerPage: 1,
            CustomerPageSize: 10000
        }
    }

    componentDidUpdate(prevProps, prevState) {

        $(".dataTime").focus(function () {
            document.activeElement.blur();
        })
        let productData = prevState.productData.productData
        if (productData) {
            Object.keys(productData).map(prod => {
                if (productData[prod].productList) {
                    productData[prod].productList.map(key => {
                        if (key.productType == 'bonus') {
                            if (!key.DividendsType) {
                                key.DividendsType = 2
                            }
                        }
                        if (key.code == '00340602') {
                            if (!key.AppendPrem && this.state.AppendPrem) {
                                key.AppendPrem = this.state.AppendPrem
                            }
                            if (key.premium != this.state.Jpremium && this.state.Jpremium) {
                                key.premium = this.state.Jpremium
                            }
                        }
                    })
                }
            })
        } else {
        }

    }


    componentWillMount() {
        let that = this
        if (localStorage.editType != 'normal') {
            this.setState({
                loading: true
            }, () => {
                $.ajax({
                    type: 'post',
                    url: that.state.baseUrl + '/ProposalServlet',
                    data: JSON.stringify({
                        "proposalID": localStorage.proposalId
                    }),
                    success: function (data) {
                        that.setState({
                            ...JSON.parse(data.data.productContent)
                        }, () => {
                            that.setState({
                                loading: false,
                                db: WebSql().openDB(),
                            }, () => {

                            })
                        })
                    }
                })
            })

        } else {

            if (localStorage.nextStates == 0) {

                this.setState({
                    productData: {
                        ...JSON.parse(localStorage.productData),
                    },
                    occupCode: occop_data,
                    loading: false,
                    proposalId: localStorage.proposalId
                }, () => {
                })
            } else {
                this.setState({
                    ...JSON.parse(localStorage.productData),
                    occupCode: occop_data,
                    proposalId: localStorage.proposalId,
                    loading: false
                }, () => {
                })
            }
        }
    }

    componentDidMount() {
        localStorage.doubleRecording = false
        $('#loading').hide()
        localStorage.productType = ''
        let productData = this.state.productData.productData
        let ruleText = ''
        let ruleIndex = ''
        let ruleI = ''
        this.setState({

            policyId: localStorage.policyId,
            db: WebSql().openDB(),
            PRODUCTS: this.state.productData.productList,

        }, () => {

        })
        //获取默认信息（产品信息、职业列表等）
        if (productData) {
            Object.keys(productData).map(prod => {
                if (typeof (productData[prod]) != "number") {
                    productData[prod].productList.map((key, index) => {
                        if (key.rule) {
                            ruleText = ruleText + '\n' + key.rule
                            ruleIndex = prod
                            ruleI = index
                        }
                    })
                }

            })
        }

        if (ruleText != '') {
            this.setState({
                Prompt: {
                    text: ruleText,
                    index: ruleIndex,
                    i: ruleI,
                    style: true
                }
            }, () => {
            })
        }
        this.initDB()
    }

    //计算周岁
    jsGetAge(strBirthday) {
        var returnAge;
        var strBirthdayArr = strBirthday.split("-");
        var birthYear = strBirthdayArr[0];
        var birthMonth = strBirthdayArr[1];
        var birthDay = strBirthdayArr[2];

        var d = new Date();
        var nowYear = d.getFullYear();
        var nowMonth = d.getMonth() + 1;
        var nowDay = d.getDate();

        if (nowYear == birthYear) {
            returnAge = 0;//同年 则为0岁
        }
        else {
            var ageDiff = nowYear - birthYear; //年之差
            if (ageDiff > 0) {
                if (nowMonth == birthMonth) {
                    var dayDiff = nowDay - birthDay;//日之差
                    if (dayDiff < 0) {
                        returnAge = ageDiff - 1;
                    }
                    else {
                        returnAge = ageDiff;
                    }
                }
                else {
                    var monthDiff = nowMonth - birthMonth;//月之差
                    if (monthDiff < 0) {
                        returnAge = ageDiff - 1;
                    }
                    else {
                        returnAge = ageDiff;
                    }
                }
            }
            else {
                returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
            }
        }

        return returnAge;//返回周岁年龄

    }

    //初始化websql表
    initDB() {
        let db = WebSql().openDB(),
            n = 0;
        //保单表
        db.exeSql(
            'CREATE TABLE IF NOT EXISTS policy (uuid TEXT REAL UNIQUE, code TEXT, applicantUUID TEXT, payUUID TEXT, imagetifUUID TEXT, agentcode TEXT, isForSelf TEXT, lastModifiedTime TEXT, status TEXT, policyDate TEXT, validDate TEXT, productList TEXT)', [],
            function (res) {
            });
        //保险计划表
        db.exeSql('CREATE TABLE IF NOT EXISTS plan (planUUID TEXT REAL UNIQUE, policyUUID TEXT, planNo TEXT, insuredId TEXT, applicantId TEXT,productData TEXT)', [], function (res) {
        });
        //产品表
        db.exeSql(
            'CREATE TABLE IF NOT EXISTS product (productUUID TEXT REAL UNIQUE, planUUID TEXT,appendPrem TEXT, planNo TEXT, code TEXT, name TEXT, abbrName TEXT, productDefId TEXT, insureType TEXT, insureValue TEXT, insurePeriod TEXT, insurePeriodes TEXT, insureDesc TEXT, payDesc TEXT, payModeDesc TEXT, payMode TEXT, payType TEXT, payValue TEXT, payPeriod TEXT, payPeriodes TEXT, amount TEXT, premium TEXT, quantity TEXT, attach TEXT,dividends TEXT, policyUUID TEXT)', [],
            function (res) {
            });
        //客户表
        db.exeSql(
            'CREATE TABLE IF NOT EXISTS customer (customerId TEXT REAL UNIQUE, name TEXT, genderCode TEXT, birthday TEXT, occupCate TEXT, occupation TEXT, relation TEXT, Brelation TEXT, lastModifiedDate TEXT, createDate TEXT, citizenship TEXT, smoke TEXT, marriage TEXT, degree TEXT, enterprise TEXT, provinceCode TEXT, street TEXT, cityCode TEXT, cardNum TEXT, cardStartTime TEXT, cardTime TEXT, city TEXT, familyAddress TEXT, area TEXT, duty TEXT, yearIncome TEXT, community TEXT, postalcode TEXT, card_type TEXT, phone TEXT, email TEXT, mobile TEXT, age TEXT, policyUUID TEXT, id TEXT)', [],
            function (res) {
            });
        //告知表
        db.exeSql('CREATE TABLE IF NOT EXISTS questAnswer (questUUID TEXT REAL UNIQUE, policyUUID TEXT, code TEXT, version TEXT, id TEXT, answer TEXT, detail TEXT, customerId TEXT)', [], function (res) {
        });
        //收益人表
        db.exeSql(
            'CREATE TABLE IF NOT EXISTS benefit (benefitUUID TEXT REAL UNIQUE, policyUUID TEXT, isByLaw TEXT, insuredId TEXT, name TEXT, relation TEXT, relationword TEXT, cardType TEXT, cardNum TEXT, benefitScale NUMBER, benefitOrder NUMBER)', [],
            function (res) {
            });
        //支付信息表
        db.exeSql(
            'CREATE TABLE IF NOT EXISTS policypay (policyPayUUID TEXT REAL UNIQUE, policyUUID TEXT, bankName TEXT, bankCode TEXT, bankAccountName TEXT, bankAccountCode TEXT, value TEXT, payTypeCode TEXT, rollPayTypeCode TEXT, remind TEXT, rollPaytypeDesc TEXT, payTypeDesc TEXT, applytype TEXT, printtype TEXT)', [],
            function (res) {
            });
        //上传图片缓存表
        db.exeSql('CREATE TABLE IF NOT EXISTS imagetif (imageUUId TEXT REAL UNIQUE, policyUUId TEXT, id TEXT, imgSrc TEXT)', [], function (res) {
        });
        //用户信息表
        db.exeSql(
            'CREATE TABLE IF NOT EXISTS userInfo (userId TEXT REAL UNIQUE, name TEXT, genderCode TEXT, birthday TEXT, occupCate TEXT, occupation TEXT, lastModifiedDate TEXT, createDate TEXT, citizenship TEXT, smoke TEXT, marriage TEXT, degree TEXT, enterprise TEXT, provinceCode TEXT, street TEXT, cityCode TEXT, cardNum TEXT,cardStartTime TEXT, cardTime TEXT, city TEXT, familyAddress TEXT, area TEXT, duty TEXT, yearIncome TEXT, community TEXT, postalcode TEXT, card_type TEXT, phone TEXT, email TEXT, mobile TEXT, age TEXT, agentCode TEXT)', [],
            function (res) {
            });
        // 附加险
        db.exeSql('CREATE TABLE IF NOT EXISTS addInsurance (addUUID TEXT,planUUID TEXT, name TEXT, abbrName TEXT, amount TEXT, payValue TEXT, insurePeriod TEXT, premium TEXT, policyUUID TEXT, fxCode TEXT,fxAmount TEXT,payDec,insurDec,fxPlanValue)', [], function (res) {
        });
    }

    //时间插件
    dataTime(className) {
        this.setState({
            className: className
        }, () => {
            let className = this.state.className
            // new Mdate("dateSelectorOne")
            $.date('.' + className);
        })
    }

    rankData(item) {
        //档次选择
        return item.factors.map((v) => {
            if (v.name == 'RANK') {
                return v.detail.map((i) => {
                    return (
                        <option value={i[0]}>{i[1]}</option>
                    )
                })
            }
        })
    }

    //保险期间
    insurList(item) {
        if (item) {

            return item.factors.map((v) => {
                if (v.name == 'INSURE') {
                    return v.detail.map((i) => {
                        return (
                            <option value={i[0]}>{i[1]}</option>
                        )
                    })
                }
            })
        }
    }

    //缴费期间
    payList(item) {
        if (item) {
            return item.factors.map((v) => {
                if (v.name == 'PAY') {
                    return v.detail.map((i) => {
                        return <option
                            value={i[0]}>{i[1]}</option>
                    })
                }
            })
        }
    }

    //选择产品
    ProductListClick(item) {
        let productData = this.state.productData.productData
        let state = false
        let flag = false
        Object.keys(productData).map((key) => {
            if (productData[key].productList) {
                productData[key].productList.some(prod => {
                    if (prod.code == '00340701' || prod.code == '00333502' || prod.code == '00232402' || prod.code == '00240902' || prod.code == '00730604' || prod.code == '00730302' || prod.code == '00231702' || prod.code == '00335802' || prod.code == '00232202' || prod.code == '00232102' || prod.code == '00290202' || prod.code == '00230202' || prod.code == '00240202') {
                        state = true
                    }
                })
            }
        })
        if (item.code == '00232701') {
            if (state == false) {
                flag = false
                alert('此豁免险种必须和以下产品搭配投保：美好生活个人长期护理保险、百万安行、健康天使、康乐尊享、福满人生、康利人生、康乐人生A款、金色朝阳、关爱健康防癌、北肿防癌A款、北肿防癌B款、关爱专家定期重疾、关爱专家终身重疾')
            } else {
                flag = true
                alert('选择此豁免险种，当前被保人会变成第一被保人和投保人！')
            }
        }
        if (flag == true) {
            this.setState({
                newProductData: item
            })
        }
    }

    //档次或保额
    rankOramoun(prod) {
        if (prod.rank) {
            return (prod.rank_value + '').replace(".", "")
        } else if (!prod.rank && prod.amount) {
            return (prod.amount + '').replace(".", "")
        } else if (prod.amount == 0) {
            return ''
        }
    }

    //rebuild组装请求报文
    createProdDetail(prod) {
        const rebuildFactors = {};
        prod.factors.map((factorTemp) => {
            if (factorTemp.name != 'AMOUNT' && factorTemp.name != 'QUANTITY' && factorTemp.name != "PREMIUM") {
                rebuildFactors[factorTemp.name] = factorTemp.detail[0][0]
            } else {
                rebuildFactors[factorTemp.name] = factorTemp.value
            }

        })
        if (rebuildFactors['RANK']) { //档次
            delete rebuildFactors['AMOUNT']; //保额
            delete rebuildFactors['QUANTITY'] //份数
        } else if (rebuildFactors['AMOUNT']) {
            delete rebuildFactors['QUANTITY']
        }

        let detail = {
            "parentId": prod.parentproid ? prod.parentproid : this.state.mainCode,
            "productId": prod.productid,
            "factors": rebuildFactors
        }
        if (prod.ismain == true) { //主险不传parentId
            delete detail.parentId;
        }
        return detail;

    }

    //更新保额
    amountChange(item, index, i) {
        let productData = this.state.productData.productData
        this.setState({
            productData: {
                ...this.state.productData,
                productData: productData
            }
        }, () => {
        })
        let e = window.event || arguments[0];
        this.setState({
            productForEdit: {
                ...item,
                value: {
                    ...item.value,
                    AMOUNT: e.target.value
                }
            }
        }, () => {
            this.updataInsure(this.state.productForEdit, index, i)
        })
    }

    // 投保条款选择是监听保存
    clauseValue(value) {
        let e = window.event || arguments[0];
        this.setState({
            clauseValue: {
                ...this.state.clauseValue,
                [value]: e.target.value
            }
        })
    }

    //更新份数
    quantityChange(item, index, i) {
        let productData = this.state.productData.productData
        this.setState({
            productData: {
                ...this.state.productData,
                productData: productData
            }
        }, () => {
        })
        let e = window.event || arguments[0];
        this.setState({
            productForEdit: {
                ...item,
                value: {
                    ...item.value,
                    QUANTITY: e.target.value
                }
            }
        }, () => {
            this.updataInsure(this.state.productForEdit, index, i)
        })
    }

    //更新档次
    rankChange(item, index, i) {
        let e = window.event || arguments[0];
        this.setState({
            productForEdit: {
                ...item,
                value: {
                    ...item.value,
                    RANK: e.target.value
                }
            }
        }, () => {
            this.updataInsure(this.state.productForEdit, index, i)
        })
    }

    //更新保费
    premiumChange(item, index, i) {
        let e = window.event || arguments[0];
        this.setState({
            productForEdit: {
                ...item,
                value: {
                    ...item.value,
                    PREMIUM: e.target.value
                }
            }
        }, () => {
            this.updataInsure(this.state.productForEdit, index, i)
        })
    }

    //组装缴费期间/保障期间
    PeriodArr(prod, vaule) {
        let Arr = []
        if (vaule == 'insure') {
            prod.factors.map(key => {
                if (key.label == '保障期间') {
                    key.detail.map(json => {
                        json.map(data => {
                            Arr.push(data[1])
                        })
                    })
                }
            })
        } else if (vaule == 'pay') {
            prod.factors.map(key => {
                if (key.label == '交费期间') {
                    key.detail.map(json => {
                        json.map(data => {
                            Arr.push(data[1])
                        })
                    })
                }
            })
        }
        return Arr
    }

    //是否投保条款选择变化
    orClause() {
        let e = window.event || arguments[0];
        this.setState({
            orClause: e.target.value
        })
    }

    //  下一步
    nextBth() {
        this.setState({
            loading: true
        })
        let nextState = true
        let productData = this.state.productData.productData
        let that = this
        let ruleData = ''
        Object.keys(productData).map(prod => {
            if (typeof(productData[prod]) != 'number') {

                let dateSelector = 'dateSelector' + (prod - 1)
                let dataTime = 'dataTime' + (prod - 1)
                let Birthday = $('#' + dateSelector).val()

                if (!productData[prod].name) {
                    this.setState({
                        Prompt: {
                            state: true,
                            text: '请输入第' + prod + '被保人姓名！！！'
                        }
                    })
                    return false
                } else if (!productData[prod].gender) {
                    this.setState({
                        Prompt: {
                            state: true,
                            text: '请选择第' + prod + '被保人性别！！！'
                        }
                    })
                    return false
                } else if (!this.refs[dataTime].value) {
                    this.setState({
                        Prompt: {
                            state: true,
                            text: '请填写第' + prod + '被保人出生日期！！！'
                        }
                    })
                    return false
                } else {
                    piccAjax('/plan/clauses_customer.json', {
                        "applicant": {
                            "birthday": "1990-01-01",
                            "gender": "M",
                            "name": "李莉莉"
                        },
                        "insurant": {
                            "birthday": this.refs[dataTime].value,
                            "gender": productData[prod].gender,
                            "occupationCode": productData[prod].occupationCode,
                            "name": productData[prod].name,
                            "occup_BigCode": productData[prod].occup_BigCode,
                            "occup_SmallCode": productData[prod].occup_LevelCode,
                            "occup_LevelCode": productData[prod].occup_LevelCode,
                            "customer_id": productData[prod].customer_id ? productData[prod].customer_id : this.state.productData.planID[prod - 1],
                            "email": "",
                            "taxHospital": localStorage.type == '20' ? this.state.orClause : 2
                        },
                        "planId": this.state.productData.planID[prod - 1],
                        "proposalType": "1"
                    }, clauses_customer => {
                        if (clauses_customer.result != 'fail') {
                            let dataText = clauses_customer.content.plan.product;
                            dataText.map(res => {
                                if (res.rule) {
                                    (res.rule).map(rule => {
                                        if (ruleData == '') {
                                            ruleData = ruleData + res.rule;
                                        } else {
                                            ruleData = ruleData + '\n' + res.rule;
                                        }
                                    })
                                }
                            })
                            if (ruleData == '') {
                                productData = {
                                    ...productData,
                                    [prod]: {
                                        ...productData[prod],
                                        birthday: Birthday,
                                    }
                                }
                                that.setState({
                                    productData: {
                                        ...that.state.productData,
                                        productData: productData
                                    }
                                }, () => {
                                    Object.keys(productData).map(prod => {
                                        if (typeof (productData[prod]) != "number") {
                                            productData[prod].productList.map(key => {
                                                if (!key.premium) {
                                                    nextState = false
                                                }
                                            })
                                        }
                                    })
                                    if (nextState == true) {
                                        localStorage.productData = JSON.stringify(that.state)
                                        that.Cross(localStorage.crossSelling)
                                    } else {
                                        alert('请计算保费！')
                                    }
                                })
                            } else {
                                that.setState({
                                    Prompt: {
                                        ...this.state.Prompt,
                                        text: ruleData,
                                        state: true
                                    },
                                    loading: false
                                })
                            }
                        } else {
                            that.setState({
                                Prompt: {
                                    text: '保费计算失败！',
                                    state: true
                                },
                                loading: false
                            })
                        }
                    })

                }
            }

        })
    }

    //判断是否为交叉销售
    Cross(data) {
        let that = this
        data = JSON.parse(data) //pc
        // data = JSON.parse(JSON.parse(data)) //移动
        if (data.umtuser.companyid != '03') {
            if (this.state.CrossState == true) {
                that.primarySave()
            } else {

                let dataInfo2 = {
                    GrpAgentCode: data.umtuser.groupusercode,
                    ManageCom: data.umtuser.comid,
                    SendOperator: data.umtuser.groupusercode,
                    OrgId: data.umtuser.logincode,
                    Salecode: data.sales[0].salescode,
                    // agentCodeManageCom:data.sales[0].salescomcode
                }
                let indexdata = {
                    index: 'crossSelling',
                    crossSelling: 'crossSelling',
                    keySale: dataInfo2,
                    header: {
                        "token": localStorage.token,
                        "usercode": localStorage.usercode
                    },
                    body: {
                        "companyid": localStorage.companyid
                    }
                };
                $.ajax({
                    type: 'POST',
                    url: this.state.piccUrl + '/base/distribution.do',
                    data: JSON.stringify(indexdata), //请求的参数,JSON Object
                    success: function (jsonData) {
                        that.setState({
                            loading: false
                        })
                        if (jsonData.search("核心交叉销售验证接口") != -1) {
                            alert(jsonData.match(/：(\S*)/)[1])
                        } else {
                            jsonData = JSON.parse(jsonData)
                            if (jsonData.errorcode == 1) {
                                alert(jsonData.error);
                                that.setState({
                                    Cross: false
                                }, () => {
                                    window.android.back();
                                })
                                return false;
                            } else {
                                let crossSaleData = jsonData[0].crosslist[0].crossSaleData
                                if (crossSaleData) {
                                    that.setState({
                                        crossSaleData: crossSaleData.split(','),
                                        crossSaleDataState: true
                                    }, () => {
                                        if (data.umtuser.companyid == '01') {
                                            that.setState({
                                                crossData: {
                                                    ...that.state.crossData,
                                                    channel: '财代健',
                                                    mechanism_code: data.umtuser.comcode,
                                                    mechanism_name: jsonData[0].crosslist[0].manorgnam,
                                                    staff_code: data.umtuser.logincode,
                                                    staff_name: data.umtuser.username,
                                                    staff_id: jsonData[0].crosslist[0].idno,
                                                    agency: jsonData[0].crosslist[0].agentcom,
                                                    Salecode: jsonData[0].salecode
                                                },
                                                Cross: true
                                            })
                                        } else if (data.umtuser.companyid == '02') {
                                            that.setState({
                                                crossData: {
                                                    ...that.state.crossData,
                                                    channel: '寿代健',
                                                    mechanism_code: data.umtuser.comcode,
                                                    mechanism_name: jsonData[0].crosslist[0].manorgnam,
                                                    staff_code: data.umtuser.logincode,
                                                    staff_name: data.umtuser.username,
                                                    staff_id: jsonData[0].crosslist[0].idno,
                                                    agency: jsonData[0].crosslist[0].agentcom,
                                                    Salecode: jsonData[0].salecode
                                                },
                                                Cross: true
                                            })
                                        }
                                    })
                                } else {
                                    that.setState({
                                        crossSaleDataState: false
                                    }, () => {
                                        if (data.umtuser.companyid == '01') {
                                            that.setState({
                                                crossData: {
                                                    ...that.state.crossData,
                                                    channel: '财代健',
                                                    mechanism_code: data.umtuser.comcode,
                                                    mechanism_name: jsonData[0].crosslist[0].manorgnam,
                                                    staff_code: data.umtuser.logincode,
                                                    staff_name: data.umtuser.username,
                                                    staff_id: jsonData[0].crosslist[0].idno,
                                                    agency: jsonData[0].crosslist[0].agentcom,
                                                    Salecode: jsonData[0].salecode
                                                },
                                                Cross: true
                                            })
                                        } else if (data.umtuser.companyid == '02') {
                                            this.setState({
                                                crossData: {
                                                    ...that.state.crossData,
                                                    channel: '寿代健',
                                                    mechanism_code: data.umtuser.comcode,
                                                    mechanism_name: jsonData[0].crosslist[0].manorgnam,
                                                    staff_code: data.umtuser.logincode,
                                                    staff_name: data.umtuser.username,
                                                    staff_id: jsonData[0].crosslist[0].idno,
                                                    agency: jsonData[0].crosslist[0].agentcom,
                                                    Salecode: jsonData[0].salecode
                                                },
                                                Cross: true
                                            })
                                        }
                                    })
                                }
                            }
                        }

                    },
                    error: function (jsonData) {
                        that.setState({
                            loading: false
                        })
                        /* Act on the event */
                        alert('交叉销售信息验证接口超时，请稍后再试。')
                    }
                })
            }

        } else {
            that.setState({
                Cross: false,
                CrossState: true
            }, () => {
                that.primarySave()
            })
        }
    }

    //代理机构下拉
    crossSaleDataValue(value) {
        return this.state.crossSaleData.map(data => {
            return (
                <option value={data}>
                    {data}
                </option>
            )
        })
    }

    //交叉销售next、prevappaa
    crossSelling(value) {
        let crossData = this.state.crossData
        if (value == 'next') {
            if (crossData.sales_type == -1) {
                alert('请选择交叉销售类型')
                return false
            } else if (!crossData.agency || crossData.agency == '-1') {
                alert('请填写代理机构')
                return false
            } else {
                localStorage.showCrossSelling = 1;
                //健康险交叉渠道
                localStorage.crossData = JSON.stringify(crossData);
                this.setState({
                    Cross: false,
                    CrossState: true
                }, () => {
                    this.primarySave()
                })
            }
        } else {
            this.setState({
                Cross: false
            }, () => {

            })
        }
    }

    //  代理人编码
    salesmanCode() {
        let e = window.event || arguments[0];
        this.setState({
            crossData: {
                ...this.state.crossData,
                salesman_coding: e.target.value
            }
        })
    }

    //交叉销售类型
    salesType() {
        let e = window.event || arguments[0];
        this.setState({
            crossData: {
                ...this.state.crossData,
                sales_type: e.target.value
            }
        })
    }

    //代理机构存值
    agency() {
        let e = window.event || arguments[0];
        this.setState({
            crossData: {
                ...this.state.crossData,
                agency: e.target.value
            }
        })
    }

    //rule提示信息
    ruleData(key, index, i, ismain) {
        let Prompt = this.state.Prompt
        if (ismain == key.ismian && index == Prompt.index && i == Prompt.i) {
            return (
                <span style={{color: 'red', fontSize: '12px;', width: '40%'}}>
                    {Prompt.text}
                </span>
            )
        }
    }

    //缴费期间、保障期间存表格式转换
    insureType(key, value) {
        let valueCode = ''
        if (value == 'insure') {
            valueCode = (key.insure_code).slice(0, 2)
            if (valueCode == 'to') {
                return 'to'
            } else {
                return 'term'
            }
        } else {
            valueCode = key.pay_code
            if (valueCode == 'single') {
                return 'single'
            } else {
                return 'term'
            }
        }
    }

    // policy存储
    primarySave() {
        let db = this.state.db
        let that = this
        let state = this.state
        let productData = this.state.productData
        let now = (new Date).Format('yyyy-MM-dd'),
            _custId = [];
        db.query('SELECT * FROM policy WHERE uuid = ?', [localStorage.proposalId], function (config) {
            console.log(config,'config')
            if (config.length == 0) {
                //new 保单流水号
                let uuid = localStorage.proposalId;

                //保存保单表（保单流水，业务员工号）
                db.exeSql('INSERT INTO policy (uuid, agentcode, policyDate, status, productList) VALUES(?, ?, ?, ?, ?)', [localStorage.proposalId, localStorage.agent_userCode, now, '1000', JSON.stringify(state.PRODUCTS)], function (res) {
                    if (res) {
                        //保存被报人
                        that.saveCust(that.state.policyId, _custId, now);
                        //保存计划
                        setTimeout(function () {
                            that.savePlan(that.state.policyId, _custId, now);
                        }, 1000)
                    }
                });
            } else {
                //保存被报人
                that.saveCust(that.state.policyId, _custId, now);
                //保存计划
                setTimeout(function () {
                    that.savePlan(that.state.policyId, _custId, now)
                }, 1000)
            }
        });

    }

    //customer存储
    saveCust(policyId, _custId, nowTime) {
        policyId = localStorage.proposalId
        let db = this.state.db
        let that = this
        let productData = this.state.productData.productData
        var SQL_COUNT = $('.insure_addpeople .insure_con .ul-list').size(),
            _count = 0;
        //insert 客户表（客户流水,客户姓名,性别,出生日期,职业大类,职业代码,保单流水号,被保人顺序）

        Object.keys(productData).map((prod) => {
            let cid = prod,
                custUUID = that.state.productData.planID[prod - 1],
                cname = productData[prod].name,
                cgender = that.CustomerGender(productData[prod]),
                cbirdth = $('#dateSelector' + [prod - 1]).val(),
                coucp1 = {},
                coucp2 = {};
            coucp1.code = productData[prod].occup_BigCode;
            coucp1.name = productData[prod].occup_BigName;
            coucp2.code = productData[prod].occupationCode;
            coucp2.name = productData[prod].occupationName;
            coucp2.level = productData[prod].occup_LevelCode;
            let oucp1 = JSON.stringify(coucp1),
                oucp2 = JSON.stringify(coucp2);
            //如果customer表内有customerId则更新否则新增
            db.query('SELECT * FROM customer WHERE customerId = ?', [custUUID], function (res) {
                if (res.length != 0) {
                    db.exeSql('UPDATE customer SET name = ?, genderCode = ?, birthday = ?, occupCate = ?, occupation = ?, id = ? WHERE policyUUID = ? AND customerId = ?', [cname, cgender, cbirdth, oucp1, oucp2, cid, policyId, custUUID], function (rt) {
                        console.log(rt, '客户表更新')
                        //更新告知表的id值
                        if (rt) {
                            db.exeSql('UPDATE questAnswer SET id = ? WHERE policyUUID = ? AND customerId = ?', [cid, policyId, custUUID], function (ques) {
                                console.log(ques, '更新告知表')
                            });
                        }
                    });
                } else {
                    db.exeSql('INSERT INTO customer (customerId, name, genderCode, birthday, occupCate, occupation, createDate, policyUUID, id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', [custUUID, cname, cgender, cbirdth, oucp1, oucp2, nowTime, policyId,
                        cid
                    ], function (res) {
                        console.log(res, '客户表新增')
                    });
                }
            })
            _custId.push(custUUID);
        })


    }

    //组装存表所需格式的缴费期间和保障期间
    fiterWord(data, type) {
        let fiterData = ''
        data.factors.map(prod => {
            if (prod.name == type) {
                fiterData = prod
            }
        })

        let fiterArr = []
        fiterData.detail.map(prod => {
            if (prod[1] == '保终身') {
                fiterArr.push('终身')
            } else if (prod[1] == '一次交清') {
                fiterArr.push('一次缴清')
            } else {
                fiterArr.push(prod[1])
            }
        })
        let newfiterArr = []
        fiterArr = fiterArr.map(prod => {
            newfiterArr.push(prod.replace(new RegExp('年期', 'g'), ''))

        })

        newfiterArr = newfiterArr.toString()
        return newfiterArr
    }

    //product、plan、addinsurance表存储
    savePlan(policyId, _custId) {
        policyId = localStorage.proposalId
        let that = this
        let productData = this.state.productData.productData
        let db = this.state.db
        let planNo = ''
        let planId = ''
        Object.keys(productData).map((prod) => {
            planNo = prod
            planId = that.state.productData.planID[prod - 1]
            //insert 计划表（保险计划流水,保单流水号,计划顺序,被投保人id）
            //如果表内有planId则更新否则新增
            db.query('SELECT * FROM plan WHERE planUUID = ?', [planId], function (res) {
                if (res.length != 0) {
                    db.exeSql('UPDATE plan SET planNo = ?, insuredId = ? WHERE policyUUID = ? AND planUUID = ?', [prod, _custId[prod - 1], policyId, _custId[prod - 1]]);
                } else {
                    db.exeSql('INSERT INTO plan (planUUID, policyUUID, planNo, insuredId) VALUES(?, ?, ?, ?)', [_custId[prod - 1], policyId, prod, _custId[prod - 1]]);
                }
            })
            //update或insert 产品表（险种id，计划id，计划顺序，险种代码，险种简称，      保单流水号）

            let puuid = that.state.productData.planID[prod - 1],
                proCode = '', //主险code
                proName = '', //主险名称
                proAddr = '', //主险简称
                proAmount = '', //主险保额
                proInPeriod = '', //主险保险期间代码
                proPayPeriod = '', //主险缴费期间代码
                proPremium = '', //主险保费
                proInPeriodArr = [], //主险保险期间选项集合
                proPayPeriodArr = [], //主险缴费期间选项集合
                productDefId = '',
                quantity = '',
                insureType = '',
                payType = '',
                fuName = '', //附加险名称
                fuAddr = '', //附加险简称
                fuGrade = '', //档次
                fuTime = '', //缴费期限
                fuProterm = '', //保险期间
                fuPromoney = '', //保费
                fuCode = '', //代码
                fuAmount = '', //附加险保额,
                insureDesc = '',
                payDesc = '',
                addPayDec = '',
                addInsurDec = '',
                AppendPrem = ''//追加保费


            //Grade可相同于Amount
            if (typeof(productData[prod]) != "number") {
                productData[prod].productList.map((key) => {
                    if (localStorage.type != '20') {
                        if (this.jsGetAge(productData[prod].birthday) > 60 && key.insure_value != 1) {
                            localStorage.doubleRecording = true
                            alert('此单应进行双录，特此提示。')
                        }
                    }
                    var insurePeriodes = proInPeriodArr.join(','),
                        payPeriodes = proPayPeriodArr.join(','),
                        attArr = [], //主险下附加险集合
                        attaches = '';

                    // 如果表里有主险ID则更新否则新增
                    //product表，储存产品信息
                    db.query('SELECT * FROM product WHERE productUUID = ?', [puuid], function (res) {
                        if (res.length != 0) {
                            if (key.ismain == true || key.code == '00340602') {
                                productData[prod].productList.map((res) => {

                                    if (res.ismain == false && res.code != '00340602' && key.code != '00340602') {
                                        let attArrText = {
                                            abbrName: '',
                                            amount: "",
                                            checked: true,
                                            code: "532502",
                                            insurePeriod: "30",
                                            name: "附加百万安行个人交通意外伤害保险",
                                            payPeriod: "5",
                                            premium: "400.0"
                                        }
                                        attArrText.abbrName = res.abbrName
                                        attArrText.amount = res.amount
                                        attArrText.code = res.code.slice(2)
                                        attArrText.insurePeriod = res.insure_value
                                        attArrText.name = res.name
                                        attArrText.payPeriod = res.pay_value
                                        attArrText.premium = res.premium
                                        attArr.push(attArrText)
                                    }
                                })
                                attaches = JSON.stringify(attArr)
                                proCode = key.code.slice(2)
                                proName = key.name
                                proAddr = key.abbrName
                                proAmount = that.rankOramoun(key)

                                proInPeriod = (key.insure_value + '').replace(".", "")
                                proPayPeriod = (key.pay_value + '').replace(".", "")
                                proInPeriodArr = that.PeriodArr(key, 'insure')
                                proPayPeriodArr = that.PeriodArr(key, 'pay')
                                insurePeriodes = that.fiterWord(key, 'INSURE')
                                payPeriodes = that.fiterWord(key, 'PAY')
                                proPremium = key.premium
                                insureType = that.insureType(key, 'insure')
                                payType = that.insureType(key, 'pay')
                                insureDesc = key.insure
                                payDesc = key.pay
                                AppendPrem = key.AppendPrem ? key.AppendPrem : ''

                                productDefId = key.code == '00124501' || key.code == '10123301' || key.code == '10123401' ? 'RANK' : key.inputType
                                quantity = key.value.QUANTITY ? key.value.QUANTITY : 0
                                let DividendsType = ''
                                if (key.DividendsType) {
                                    DividendsType = (key.DividendsType + '').replace(".", "")
                                    // alert(DividendsType, 'DividendsType')
                                } else {
                                    DividendsType = ''
                                }
                                if (key.productType == 'bonus') {
                                    localStorage.productType = 'bonus'
                                }
                                db.exeSql('UPDATE product SET appendPrem = ?,insureDesc = ?,payDesc = ?, planUUID = ?, planNo = ?, code = ?, name = ?, abbrName = ?,productDefId = ?, insureType = ?, insureValue = ?, insurePeriod = ?, insurePeriodes = ?, payMode = ?, payType = ?, payValue = ?, payPeriod = ?, payPeriodes = ?, amount = ?, premium = ?, quantity=?, attach = ?, dividends = ? WHERE policyUUID = ? AND productUUID = ?', [
                                        AppendPrem, insureDesc, payDesc, planId, planNo, proCode, proName, proAddr, productDefId, insureType, proInPeriod, proInPeriod, insurePeriodes, payType, payType, proPayPeriod, proPayPeriod, payPeriodes, proAmount, proPremium, quantity, attaches, DividendsType, policyId, puuid
                                    ],
                                    function (res) {
                                        console.log(res, '更新主险')
                                    });
                            } else {
                                fuName = key.name
                                fuAddr = key.abbrName
                                fuGrade = that.rankOramoun(key)
                                fuTime = key.pay_period
                                fuProterm = key.insure_period
                                fuPromoney = key.premium
                                fuCode = key.code.slice(2)
                                fuAmount = that.rankOramoun(key)
                                addInsurDec = key.insure
                                addPayDec = key.pay
                                db.exeSql('UPDATE addInsurance SET payDec = ? , insurDec = ? , addUUID = ?, planUUID = ?, name = ?, abbrName = ?, amount = ?, payValue = ?, insurePeriod = ?, premium = ?,fxCode = ?,fxAmount = ? WHERE policyUUID = ? AND abbrName = ? ', [addPayDec, addInsurDec, puuid, planId,
                                    fuName, fuAddr, fuGrade, fuTime, fuProterm, fuPromoney, fuCode, fuAmount, policyId, fuAddr
                                ], function (res) {
                                    console.log(res, '更新附加险')
                                });
                            }
                        } else {
                            if (key.ismain == true || key.code == '00340602') {

                                productData[prod].productList.map((res) => {
                                    if (res.ismain == false && res.code != '00340602' && key.code != '00340602') {
                                        let attArrText = {
                                            abbrName: '',
                                            amount: "",
                                            checked: true,
                                            code: "532502",
                                            insurePeriod: "30",
                                            name: "附加百万安行个人交通意外伤害保险",
                                            payPeriod: "5",
                                            premium: "400.0"
                                        }
                                        attArrText.abbrName = res.abbrName
                                        attArrText.amount = res.amount
                                        attArrText.code = res.code.slice(2)
                                        attArrText.insurePeriod = res.insure_value
                                        attArrText.name = res.name
                                        attArrText.payPeriod = res.pay_value
                                        attArrText.premium = res.premium
                                        attArr.push(attArrText)
                                    }
                                })
                                attaches = JSON.stringify(attArr)
                                proCode = key.code.slice(2)
                                proName = key.name
                                proAddr = key.abbrName
                                proAmount = that.rankOramoun(key)
                                proInPeriod = (key.insure_value + '').replace(".", "")
                                proPayPeriod = (key.pay_value + '').replace(".", "")
                                proInPeriodArr = that.PeriodArr(key, 'insure')
                                proPayPeriodArr = that.PeriodArr(key, 'pay')
                                insurePeriodes = that.fiterWord(key, 'INSURE')
                                payPeriodes = that.fiterWord(key, 'PAY')
                                proPremium = key.premium
                                insureType = that.insureType(key, 'insure')
                                payType = that.insureType(key, 'pay')
                                insureDesc = key.insure
                                payDesc = key.pay
                                AppendPrem = key.AppendPrem ? key.AppendPrem : ''
                                productDefId = key.code == '00124501' || key.code == '10123301' || key.code == '10123401' ? 'RANK' : key.inputType
                                quantity = key.value.QUANTITY ? key.value.QUANTITY : 0
                                let DividendsType = ''
                                if (key.DividendsType) {
                                    DividendsType = (key.DividendsType + '').replace(".", "")
                                } else {
                                    DividendsType = ''
                                }
                                if (key.productType == 'bonus') {
                                    localStorage.productType = 'bonus'
                                }
                                db.exeSql(
                                    'INSERT INTO product (appendPrem,insureDesc,payDesc,productUUID, planUUID, planNo, code, name, abbrName, productDefId,  insureType, insureValue, insurePeriod, insurePeriodes, payMode, payType, payValue, payPeriod, payPeriodes, amount, premium,quantity, attach,dividends, policyUUID) VALUES(?,?,?,?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)', [
                                        AppendPrem, insureDesc, payDesc, puuid, planId, planNo, proCode, proName, proAddr, productDefId, insureType, proInPeriod, proInPeriod, insurePeriodes, payType, payType, proPayPeriod, proPayPeriod, payPeriodes, proAmount, proPremium, quantity, attaches, DividendsType, policyId
                                    ],
                                    function (res) {
                                        console.log(res, '插入主险')
                                    });
                            } else {
                                fuName = key.name
                                fuAddr = key.abbrName
                                fuGrade = that.rankOramoun(key)
                                fuTime = key.pay_period
                                fuProterm = key.insure_period
                                fuPromoney = key.premium
                                fuCode = key.code.slice(2)
                                fuAmount = that.rankOramoun(key)
                                addInsurDec = key.insure
                                addPayDec = key.pay
                                db.exeSql('INSERT INTO addInsurance (payDec,insurDec,addUUID,planUUID, name, abbrName, amount, payValue, insurePeriod, premium,fxCode, policyUUID,fxAmount) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', [addPayDec, addInsurDec, puuid, planId, fuName, fuAddr, fuGrade, fuTime,
                                    fuProterm, fuPromoney, fuCode, policyId, fuAmount
                                ], function (res) {
                                    console.log(res, '插入附加险')
                                });
                            }
                        }
                    })
                })
            }
        });
        setTimeout(function () {
            localStorage.quesIndex = 1;
            //在线投保保存建议书
            if (localStorage.type == '00') {
                piccAjax('/proposal/save.json', {
                    "proposalId": that.state.proposalId,
                    "proposalType": 1
                }, data => {
                    //如果新建计划新增否则更新
                    if (localStorage.editType == 'normal') {
                        $.ajax({
                            type: 'post',
                            url: that.state.baseUrl + '/ProposalAddServlet',
                            data: JSON.stringify({
                                "proposalID": that.state.proposalId,
                                "planContent": localStorage.type,
                                "productContent": that.state,
                                "login_account": localStorage.usercode
                            }),
                            success: function (data) {
                                if (localStorage.type == '00') {
                                    that.setState({
                                        loading: false
                                    }, () => {
                                        location.href = 'informinsured.html'
                                    })
                                } else if (localStorage.type == '10') {
                                    localStorage.age = that.state.productData.productData[1].birthday
                                    that.setState({
                                        loading: false
                                    }, () => {
                                        location.href = 'easy/informinsured.html'
                                    })
                                } else if (localStorage.type == '20') {
                                    localStorage.age = that.state.productData.productData[1].birthday
                                    that.setState({
                                        loading: false
                                    }, () => {
                                        location.href = 'tax/informinsured.html'
                                    })
                                }
                            }
                        })

                    } else {
                        $.ajax({
                            type: 'post',
                            url: that.state.baseUrl + '/ProposalUpdateServlet',
                            data: JSON.stringify({
                                "proposalID": that.state.proposalId,
                                "planContent": localStorage.type,
                                "productContent": that.state,
                                "login_account": localStorage.usercode
                            }),
                            success: function (data) {
                                if (localStorage.type == '00') {
                                    that.setState({
                                        loading: false
                                    }, () => {
                                        location.href = 'informinsured.html'
                                    })

                                } else if (localStorage.type == '10') {
                                    localStorage.age = that.state.productData.productData[1].birthday
                                    that.setState({
                                        loading: false
                                    }, () => {
                                        location.href = 'easy/informinsured.html'
                                    })
                                } else if (localStorage.type == '20') {
                                    localStorage.age = that.state.productData.productData[1].birthday
                                    that.setState({
                                        loading: false
                                    }, () => {
                                        location.href = 'tax/informinsured.html'
                                    })
                                }
                            }
                        })
                    }
                })
            } else {
                if (localStorage.editType == 'normal') {
                    $.ajax({
                        type: 'post',
                        url: that.state.baseUrl + '/ProposalAddServlet',
                        data: JSON.stringify({
                            "proposalID": that.state.proposalId,
                            "planContent": localStorage.type,
                            "productContent": that.state,
                            "login_account": localStorage.usercode
                        }),
                        success: function (data) {
                            if (localStorage.type == '00') {
                                that.setState({
                                    loading: false
                                }, () => {
                                    location.href = 'informinsured.html'
                                })

                            } else if (localStorage.type == '10') {
                                localStorage.age = that.state.productData.productData[1].birthday
                                that.setState({
                                    loading: false
                                }, () => {
                                    location.href = 'easy/informinsured.html'
                                })
                            } else if (localStorage.type == '20') {
                                localStorage.age = that.state.productData.productData[1].birthday
                                that.setState({
                                    loading: false
                                }, () => {
                                    location.href = 'tax/informinsured.html'
                                })
                            }
                        }
                    })
                } else {
                    $.ajax({
                        type: 'post',
                        url: that.state.baseUrl + '/ProposalUpdateServlet',
                        data: JSON.stringify({
                            "proposalID": that.state.proposalId,
                            "planContent": localStorage.type,
                            "productContent": that.state,
                            "login_account": localStorage.usercode
                        }),
                        success: function (data) {
                            if (localStorage.type == '00') {
                                that.setState({
                                    loading: false
                                }, () => {
                                    location.href = 'informinsured.html'
                                })
                            } else if (localStorage.type == '10') {
                                localStorage.age = that.state.productData.productData[1].birthday
                                that.setState({
                                    loading: false
                                }, () => {
                                    location.href = 'easy/informinsured.html'
                                })
                            } else if (localStorage.type == '20') {
                                localStorage.age = that.state.productData.productData[1].birthday
                                that.setState({
                                    loading: false
                                }, () => {
                                    location.href = 'tax/informinsured.html'
                                })
                            }
                        }
                    })
                }
            }
        }, 1000)
    }

    //更新保险期间
    insureChange(item, index, i) {

        let e = window.event || arguments[0];
        this.setState({
            productForEdit: {
                ...item,
                value: {
                    ...item.value,
                    INSURE: e.target.value
                }
            }
        }, () => {
            this.updataInsure(this.state.productForEdit, index, i)
        })
    }

    //更新缴费期间
    payChange(item, index, i) {

        let e = window.event || arguments[0];
        this.setState({
            productForEdit: {
                ...item,
                value: {
                    ...item.value,
                    PAY: e.target.value
                }
            }
        }, () => {
            this.updataInsure(this.state.productForEdit, index, i)
        })
    }

    //产品列表模态框按钮
    addproductBth(id) {
        let that = this
        if (id == 1) {
            let index = this.state.newInsurance.length
            let item = this.state.newProductData
            let that = this
            if (item.code == '00232701') {
                piccAjax('/plan/view_clauses.json', {
                    "productId": item.code,
                    "index": -1,
                    "planId": this.state.productData.planID[0]

                }, viewClausesData => {
                    let viewAddProduct = {}

                    let addProductListData = []
                    viewClausesData.content.map((prod) => {
                        if (prod.ismain == false) {
                            viewAddProduct = {
                                code: prod.productid,
                                abbrName: prod.name,
                                check: true
                            }
                            addProductListData.push(viewAddProduct)
                        }

                    })
                    let oldProductData = that.state.productData.productData
                    let newProductData = {}
                    Object.keys(oldProductData).map(prod=>{
                        if(oldProductData[prod].productList){
                            oldProductData[prod].productList.map((key,index)=>{
                                if(key.code != '00232701'){
                                    newProductData = {
                                        ...newProductData,
                                        "2":oldProductData[prod]
                                    }
                                }
                            })
                        }
                    })
                    let productListArr = [...viewClausesData.content]
                    newProductData = {
                        ...newProductData,
                        "1":{
                            ...that.state.productData.productData[that.state.newInsurance.length],
                            "productList":productListArr
                        }
                    }
                    let ApplicantData = that.state.productData.productData[that.state.newInsurance.length]
                    if(ApplicantData.productList){
                        delete ApplicantData.productList
                    }
                    that.setState({
                        addProductState: false,
                        newProductData: '',
                        Exemptions: true,
                        ApplicantData:ApplicantData,
                        productData: {
                            ...that.state.productData,
                            productData: newProductData
                        }
                    }, () => {
                        alert('请修改被豁免险种的缴费期间！！！')
                    })
                })
            } else {
                piccAjax('/plan/view_clauses.json', {
                    "productId": item.code,
                    "index": -1,
                    "planId": this.state.productData.planID[this.state.productData.planID.length - 1]

                }, viewClausesData => {
                    let viewAddProduct = {}

                    let addProductListData = []
                    viewClausesData.content.map((prod) => {
                        if (prod.ismain == false) {
                            viewAddProduct = {
                                code: prod.productid,
                                abbrName: prod.name,
                                check: true
                            }
                            addProductListData.push(viewAddProduct)
                        }

                    })
                    //构造rebuild请求参数
                    let detailArr = [];
                    viewClausesData.content.map((prod) => {
                        detailArr.push(this.createProdDetail(prod));
                    })
                    piccAjax('/plan/rebuild.json', {
                        "planId": this.state.productData.planID[this.state.productData.planID.length - 1],
                        "detail": detailArr
                    }, rebuildData => {
                        rebuildData.content = viewClausesData.content.map(prod => {
                            let newProd = {};
                            rebuildData.content.product.map((rebuildProd) => {
                                if (prod.productid === rebuildProd.code) {
                                    newProd = {
                                        ...prod,
                                        ...rebuildProd
                                    }

                                }
                            })
                            return newProd;
                        })
                        that.setState({
                            addProductState: false,
                            newProductData: '',
                            productData: {
                                ...that.state.productData,
                                productData: {
                                    ...that.state.productData.productData,
                                    [that.state.newInsurance.length]: {
                                        ...that.state.productData.productData[that.state.newInsurance.length],
                                        "productList": [...rebuildData.content]
                                    }
                                }
                            }
                        }, () => {
                        })
                    })
                })
            }
        } else {
            this.setState({
                addProductState: false,
                newProductData: ''
            })
        }
    }

    //保存或更新计划
    detailArr(index, item) {
        let productData = this.state.productData.productData
        let detailArr = []
        let info = {}
        info.AMOUNT = 0
        Object.keys(productData).map(prod => {
            productData[prod].productList.map((key) => {
                if (key.productid != '00232701') {
                    let value = key.value
                    let detail = {}
                    if (!item) {
                        detail = {
                            productId: key.code,
                            factors: key.value
                        }
                        info.AMOUNT = info.AMOUNT + (key.premium - 0)
                        info.PAY = 'term_' + (parseInt((key.value.PAY).substring(5)) - 1)
                        info.INSURE = info.PAY
                    } else {
                        if(item.code == key.code){
                            detail = {
                                productId: item.code,
                                factors: item.value
                            }
                            info.AMOUNT = info.AMOUNT + (key.premium - 0)
                            info.PAY = 'term_' + (parseInt((item.value.PAY).substring(5)) - 1)
                            info.INSURE = info.PAY
                        }else{
                            info.AMOUNT = info.AMOUNT + key.premium
                            detail = {
                                productId: key.code,
                                factors: key.value
                            }
                        }

                    }
                    if (key.ismain || key.code  == '00340602') {
                        delete detail.parentId;
                    } else {
                        detail.parentId = key.parentProId
                    }
                    console.log(detail,'detail')
                    detailArr.push(detail)
                } else {
                    let details = {
                        productId: key.productid,
                        factors: info
                    }
                    if (key.ismain || key.code  == '00340602') {
                        delete details.parentId;
                    } else {
                        details.parentId = key.parentProId
                    }
                    detailArr.push(details)
                }
            })
        })

        return detailArr

    }

    //被保人名字修改
    insurName(e) {

        this.setState({
            productData: {
                ...this.state.productData,
                productData: {
                    ...this.state.productData.productData,
                    [e.target.id]: {
                        ...this.state.productData.productData[e.target.id],
                        name: e.target.value
                    }
                }
            }
        }, () => {
        })
    }

    //职业大类修改
    occupBig(index) {
        let e = window.event || arguments[0];
        let productData = this.state.productData.productData
        this.setState({
            choseOccup: e.target.value
        }, () => {
            Object.keys(this.state.occupCode).map((prod) => {
                if (prod == e.target.value) {
                    this.setState({
                        occup: {
                            ...this.state.occup,
                            [index]: {
                                ...this.state.occup[index],
                                occupLittle: this.state.occupCode[prod]
                            }
                        },
                        productData: {
                            ...this.state.productData,
                            productData: {
                                ...this.state.productData.productData,
                                [index]: {
                                    ...this.state.productData.productData[index],
                                    occup_BigCode: e.target.value,
                                    occup_BigName: occop_data[e.target.value].des
                                }
                            }
                        }
                    }, () => {
                        this.setState({
                            occup: {
                                ...this.state.occup,
                                [index]: {
                                    ...this.state.occup[index],
                                    occupCodeData: Object.keys(this.state.occup[index].occupLittle.sub)[1],
                                    level: this.state.occup[index].occupLittle.sub[Object.keys(this.state.occup[index].occupLittle.sub)[1]].level
                                }
                            },

                        })


                    })
                }
            })
        })

    }

    //职业小类修改
    occupLittle(index) {
        let e = window.event || arguments[0];
        let level = ''
        Object.keys(this.state.occup[index].occupLittle.sub).map((prod) => {
            if (prod == e.target.value) {
                level = this.state.occup[index].occupLittle.sub[prod].level
            }
        })
        this.setState({
            occup: {
                ...this.state.occup,
                [index]: {
                    ...this.state.occup[index],
                    occupCodeData: e.target.value,
                    level: level,
                }
            },
            productData: {
                ...this.state.productData,
                productData: {
                    ...this.state.productData.productData,
                    [index]: {
                        ...this.state.productData.productData[index],
                        occupationCode: e.target.value,
                        occup_LevelCode: level,
                        occupationName: occop_data[this.state.choseOccup].sub[e.target.value].des
                    }
                }
            }
        }, () => {
        })
    }

    //性别修改
    choiceSex(sex, index) {

        this.setState({
            productData: {
                ...this.state.productData,
                productData: {
                    ...this.state.productData.productData,
                    [index]: {
                        ...this.state.productData.productData[index],
                        gender: sex
                    }
                }
            }
        }, () => {
        })
    }

    CustomerGender(data) {
        if (data.gender == 'M') {
            return '1'
        } else {
            return '2'
        }
    }

    //投保计划更新
    updataInsure(updataItem, index, i) {
        let that = this
        let dataTime = 'dataTime' + (index - 1)
        //保费计算
        if (!this.state.productData.productData[index].name) {
            this.setState({
                Prompt: {
                    state: true,
                    text: '请输入第' + index + '被保人姓名！！！'
                }
            })
            return false
        } else if (!this.state.productData.productData[index].gender) {
            this.setState({
                Prompt: {
                    state: true,
                    text: '请选择第' + index + '被保人性别！！！'
                }
            })
            return false
        } else if (!this.refs[dataTime].value) {
            this.setState({
                Prompt: {
                    state: true,
                    text: '请填写第' + index + '被保人出生日期！！！'
                }
            })
            return false
        } else {
            let applicant = {
                "birthday": "1990-01-01",
                "gender": "M",
                "name": "李莉莉"
            }
            if(this.state.Exemptions){
                let newDataTime = 'dataTime0'
                applicant = {
                    "birthday": this.refs[newDataTime].value,
                    "gender": this.state.productData.productData[1].gender,
                    "occupationCode": this.state.productData.productData[1].occupationCode,
                    "name": this.state.productData.productData[1].name,
                    "occup_BigCode": this.state.productData.productData[1].occup_BigCode,
                    "occup_SmallCode": this.state.productData.productData[1].occup_LevelCode,
                    "occup_LevelCode": this.state.productData.productData[1].occup_LevelCode,
                    "customer_id": this.state.productData.planID[0],
                    "email": "",
                }
            }
            piccAjax('/plan/clauses_customer.json', {
                "applicant": applicant,
                "insurant": {
                    "birthday": this.refs[dataTime].value,
                    "gender": this.state.productData.productData[index].gender,
                    "occupationCode": this.state.productData.productData[index].occupationCode,
                    "name": this.state.productData.productData[index].name,
                    "occup_BigCode": this.state.productData.productData[index].occup_BigCode,
                    "occup_SmallCode": this.state.productData.productData[index].occup_LevelCode,
                    "occup_LevelCode": this.state.productData.productData[index].occup_LevelCode,
                    "customer_id": this.state.productData.planID[index - 1],
                    "email": "",
                    "taxHospital": localStorage.type == '20' ? this.state.orClause : 2
                },
                "planId": this.state.productData.planID[index - 1],
                "proposalType": "1"

            }, clauses_customer => {
                if (clauses_customer.result != 'fail') {
                    let dataText = clauses_customer.content.plan.product;
                    let dataJson = clauses_customer.content.products;

                    let isSuccess = true
                    dataText.map((prod) => {
                        dataJson.map((key) => {
                            if (key.productid == prod.code) {
                                prod = Object.assign(prod, key)
                            }
                        })
                    })
                    let newproductData = {}
                    newproductData = {
                        ...that.state.productData,
                        productData: {
                            ...that.state.productData.productData,
                            [index]: {
                                ...that.state.productData.productData[index],
                                productList: [
                                    ...dataText
                                ]
                            }
                        }
                    }
                    if (!that.state.Exemptions) {
                        newproductData = {
                            ...that.state.productData,
                            productData: {
                                ...that.state.productData.productData,
                                [index]: {
                                    ...that.state.productData.productData[index],
                                    productList: [
                                        ...dataText
                                    ]
                                }
                            }
                        }
                    } else {
                        let oldProductData = that.state.productData.productData
                        Object.keys(oldProductData).map(b => {
                            oldProductData[b].productList.map(info => {
                                dataText.map(Newinfo => {
                                    if (info.productid == Newinfo.code) {
                                        info = Object.assign(info, Newinfo)
                                    }
                                })
                            })
                        })
                        newproductData = {
                            ...that.state.productData,
                            productData: oldProductData
                        }
                    }
                    that.setState({
                        productData: newproductData
                    }, () => {
                        let productList = []
                        let curProduct = updataItem

                        let insuredMap = that.state.productData.productData[index]
                        productList = insuredMap.productList.map((prod) => {
                            //更新产品
                            if (prod.code === curProduct.code) {
                                return curProduct
                            }
                            return prod;
                        })
                        productList = productList.filter((prod) => {

                            if (prod.code === curProduct.code) {
                                return true;
                            }
                            //如果是主险，则找出其下所有的附加险
                            if (!curProduct.parentId) {
                                if (prod.parentId === curProduct.code) {
                                    return true;
                                }
                            } else { //如果是附加险，则找出其主险
                                if (prod.parentId === curProduct.parentId) {
                                    return true;
                                }
                            }
                            return true;
                        })
                        let detailArr = productList.map((prod) => {
                            let detail = {
                                productId: prod.code,
                                factors: prod.value
                            }
                            if (prod.parentProId) {
                                detail.parentId = prod.parentProId
                            }
                            if (prod.ismain) {
                                delete detail.parentId;
                            } else {
                                if (prod.isbind) {
                                    if (prod.parentProId == curProduct.code) {
                                        detail.factors.AMOUNT = curProduct.value.AMOUNT
                                    }
                                }
                            }
                            return detail;
                        })
                        piccAjax('/plan/rebuild.json', {
                            "planId": that.state.productData.planID[index - 1],
                            "detail": this.detailArr(index, updataItem)
                        }, rebuild => {
                            if (rebuild.result != 'fail') {
                                let flag = false
                                let ruleState = true
                                let rebuildJson = rebuild.content.product;
                                let rebuildData = that.state.productData.productData[index].productList
                                let ruleText = ''

                                rebuildData.map((prod, indexx) => {
                                    if (this.state.DividendsType) {
                                        if (this.state.DividendsType[index]) {
                                            rebuildJson[indexx].DividendsType = this.state.DividendsType[index][indexx]
                                        }
                                    }
                                    rebuildJson.map((key) => {
                                        if (key.productId == prod.productId) {
                                            if (!key.rule) {
                                                flag = true
                                                ruleState = true
                                                prod = Object.assign(prod, key)
                                                delete prod.rule
                                            } else {
                                                prod = Object.assign(prod, key)
                                                ruleState = false
                                                ruleText = ruleText + '\n' + key.rule
                                            }
                                        }
                                    })

                                })
                                if (ruleText != '') {
                                    that.setState({
                                        Prompt: {
                                            text: ruleText,
                                            index: index,
                                            i: i,
                                            style: true
                                        }
                                    }, () => {
                                    })
                                } else {
                                    that.setState({
                                        Prompt: {
                                            text: ruleText,
                                            index: index,
                                            i: i,
                                            style: false
                                        }
                                    }, () => {
                                    })
                                }
                                if (flag == true) {
                                    if (!that.state.Exemptions) {
                                        that.setState({
                                            productData: {
                                                ...that.state.productData,
                                                productData: {
                                                    ...that.state.productData.productData,
                                                    [index]: {
                                                        ...that.state.productData.productData[index],
                                                        productList: rebuildData
                                                    }
                                                }
                                            }
                                        }, () => {
                                        })
                                    } else {
                                        let productDatas = that.state.productData.productData
                                        let newText = ''
                                        Object.keys(productDatas).map(b => {
                                            productDatas[b].productList.map(info => {
                                                rebuildJson.map(Newinfo => {
                                                    if (info.productid == Newinfo.code) {
                                                        info = Object.assign(info, Newinfo)
                                                    }
                                                })
                                            })
                                        })
                                        that.setState({
                                            productData: {
                                                ...that.state.productData,
                                                productData: productDatas
                                            }
                                        }, () => {
                                            if(that.state.Exemptions == true){
                                                that.ExemptionsPrem(updataItem, index, i)
                                            }
                                        })
                                    }
                                }

                            } else {
                                that.setState({
                                    Prompt: {
                                        text: '保费计算失败！',
                                        index: index,
                                        i: i,
                                        style: true
                                    }
                                }, () => {
                                })
                            }

                        })
                    })
                } else {
                    that.setState({
                        Prompt: {
                            text: '保费计算失败！',
                            state: true
                        }
                    })
                }

            })
        }

    }
    //豁免险二次计算
    ExemptionsPrem(updataItem, index, i){
        updataItem = this.state.productData.productData[index].productList[i]
        console.log(updataItem,'updataItem')
        let that = this
        piccAjax('/plan/rebuild.json', {
            "planId": that.state.productData.planID[index - 1],
            "detail": this.detailArr(index, updataItem)
        }, rebuild => {
            if (rebuild.result != 'fail') {
                let flag = false
                let ruleState = true
                let rebuildJson = rebuild.content.product;
                let rebuildData = that.state.productData.productData[index].productList
                let ruleText = ''

                rebuildData.map((prod, indexx) => {
                    if (this.state.DividendsType) {
                        if (this.state.DividendsType[index]) {
                            rebuildJson[indexx].DividendsType = this.state.DividendsType[index][indexx]
                        }
                    }
                    rebuildJson.map((key) => {
                        if (key.productId == prod.productId) {
                            if (!key.rule) {
                                flag = true
                                ruleState = true
                                prod = Object.assign(prod, key)
                                delete prod.rule
                            } else {
                                prod = Object.assign(prod, key)
                                ruleState = false
                                ruleText = ruleText + '\n' + key.rule
                            }
                        }
                    })

                })
                if (ruleText != '') {
                    that.setState({
                        Prompt: {
                            text: ruleText,
                            index: index,
                            i: i,
                            style: true
                        }
                    }, () => {
                    })
                } else {
                    that.setState({
                        Prompt: {
                            text: ruleText,
                            index: index,
                            i: i,
                            style: false
                        }
                    }, () => {
                    })
                }
                if (flag == true) {
                    if (!that.state.Exemptions) {
                        that.setState({
                            productData: {
                                ...that.state.productData,
                                productData: {
                                    ...that.state.productData.productData,
                                    [index]: {
                                        ...that.state.productData.productData[index],
                                        productList: rebuildData
                                    }
                                }
                            }
                        }, () => {
                        })
                    } else {
                        let productDatas = that.state.productData.productData
                        let newText = ''
                        Object.keys(productDatas).map(b => {
                            productDatas[b].productList.map(info => {
                                rebuildJson.map(Newinfo => {
                                    if (info.productid == Newinfo.code) {
                                        info = Object.assign(info, Newinfo)
                                    }
                                })
                            })
                        })
                        that.setState({
                            productData: {
                                ...that.state.productData,
                                productData: productDatas
                            }
                        }, () => {
                        })
                    }
                }

            } else {
                that.setState({
                    Prompt: {
                        text: '保费计算失败！',
                        index: index,
                        i: i,
                        style: true
                    }
                }, () => {
                })
            }

        })
    }
    //追加保费
    AppendPrem(item, index, i) {
        let e = window.event || arguments[0];
        let oldRroductData = this.state.productData.productData[index]
        oldRroductData.productList[i] = {
            ...oldRroductData.productList[i],
            "AppendPrem": e.target.value
        }
        this.setState({
            AppendPrem: e.target.value,
            productData: {
                ...this.state.productData,
                productData: {
                    ...this.state.productData.productData,
                    [index]: oldRroductData
                }
            }
        }, () => {
        })
    }

    isInteger(obj) {
        return obj % 1 === 0
    }

    //健康一生保费
    AppendPrems(item, index, i) {
        let e = window.event || arguments[0];
        if (e.target.value < 200 && this.isInteger(e.target.value)) {
            alert('健康一家期缴保费必须为大于200的整数！')
            let oldRroductData = this.state.productData.productData[index]
            oldRroductData.productList[i] = {
                ...oldRroductData.productList[i],
                "premium": item.premium
            }
            this.setState({
                Jpremium: item.premium,
                productData: {
                    ...this.state.productData,
                    productData: {
                        ...this.state.productData.productData,
                        [index]: oldRroductData
                    }
                }
            }, () => {
            })
        } else {
            let oldRroductData = this.state.productData.productData[index]
            oldRroductData.productList[i] = {
                ...oldRroductData.productList[i],
                "premium": e.target.value
            }
            this.setState({
                Jpremium: e.target.value,
                productData: {
                    ...this.state.productData,
                    productData: {
                        ...this.state.productData.productData,
                        [index]: oldRroductData
                    }
                }
            }, () => {
            })
        }

    }

    //保费计算
    PremiumCalculation(item, index) {
        let dataTime = 'dataTime' + (index - 1)
        let that = this
        //保费计算
        if (!this.state.productData.productData[index].name) {
            this.setState({
                Prompt: {
                    state: true,
                    text: '请输入第' + index + '被保人姓名！！！'
                }
            })
            return false
        } else if (!this.state.productData.productData[index].gender) {
            this.setState({
                Prompt: {
                    state: true,
                    text: '请选择第' + index + '被保人性别！！！'
                }
            })
            return false
        } else if (!this.refs[dataTime].value) {
            this.setState({
                Prompt: {
                    state: true,
                    text: '请填写第' + index + '被保人出生日期！！！'
                }
            })
            return false
        } else {
            let applicant = {
                "birthday": "1990-01-01",
                "gender": "M",
                "name": "李莉莉"
            }
            if(this.state.Exemptions){
                let newDataTime = 'dataTime0'
                applicant = {
                    "birthday": this.refs[newDataTime].value,
                    "gender": this.state.productData.productData[1].gender,
                    "occupationCode": this.state.productData.productData[1].occupationCode,
                    "name": this.state.productData.productData[1].name,
                    "occup_BigCode": this.state.productData.productData[1].occup_BigCode,
                    "occup_SmallCode": this.state.productData.productData[1].occup_LevelCode,
                    "occup_LevelCode": this.state.productData.productData[1].occup_LevelCode,
                    "customer_id": this.state.productData.planID[0],
                    "email": "",
                }
            }
            piccAjax('/plan/clauses_customer.json', {
                "applicant": applicant,
                "insurant": {
                    "birthday": this.refs[dataTime].value,
                    "gender": this.state.productData.productData[index].gender,
                    "occupationCode": this.state.productData.productData[index].occupationCode,
                    "name": this.state.productData.productData[index].name,
                    "occup_BigCode": this.state.productData.productData[index].occup_BigCode,
                    "occup_SmallCode": this.state.productData.productData[index].occup_LevelCode,
                    "occup_LevelCode": this.state.productData.productData[index].occup_LevelCode,
                    "customer_id": this.state.productData.planID[index - 1],
                    "email": "",
                    "taxHospital": localStorage.type == '20' ? this.state.orClause : 2
                },
                "planId": this.state.productData.planID[index - 1],
                "proposalType": "1"
            }, clauses_customer => {
                if (clauses_customer.result != 'fail') {
                    let dataText = clauses_customer.content.plan.product;
                    let dataJson = clauses_customer.content.products;

                    let isSuccess = true
                    dataText.map((prod) => {
                        if (!prod.rule) {
                            dataJson.map((key) => {
                                if (key.productid == prod.code) {
                                    prod = Object.assign(prod, key)
                                }
                            })

                        } else {
                            isSuccess = false
                            dataJson.map((key) => {
                                if (key.productid == prod.code) {
                                    prod = Object.assign(prod, key)
                                }
                            })
                            this.setState({
                                Prompt: {
                                    ...this.state.Prompt,
                                    text: prod.rule,
                                    state: true
                                }
                            }, () => {
                            })
                        }
                    })
                    if (isSuccess == true) {
                        let newproductData = {}
                        if (!that.state.Exemptions) {
                            newproductData = {
                                ...that.state.productData,
                                productData: {
                                    ...that.state.productData.productData,
                                    [index]: {
                                        ...that.state.productData.productData[index],
                                        productList: [
                                            ...dataText
                                        ]
                                    }
                                }
                            }
                        } else {
                            let oldProductData = that.state.productData.productData
                            Object.keys(oldProductData).map(b => {
                                oldProductData[b].productList.map(info => {
                                    dataText.map(Newinfo => {
                                        if (info.productid == Newinfo.code) {
                                            info = Object.assign(info, Newinfo)
                                        }
                                    })
                                })
                            })
                            newproductData = {
                                ...that.state.productData,
                                productData: oldProductData
                            }
                        }
                        this.setState({
                            Prompt: {
                                ...this.state.Prompt,
                                text: '',
                                style: false
                            },
                            productData: newproductData
                        }, () => {

                            piccAjax('/plan/rebuild.json', {
                                "planId": this.state.productData.planID[index - 1],
                                "detail": this.detailArr(index)
                            }, rebuild => {
                                if (rebuild.result != 'fail') {
                                    let flag = false
                                    let NewdataText = rebuild.content.product;
                                    let NewdataJson = this.state.productData.productData[index].productList

                                    NewdataText.map((prod, indexx) => {
                                        if (!prod.rule) {
                                            flag = true

                                            if (that.state.Exemptions) {
                                                let productData = that.state.productData.productData
                                                Object.keys(productData).map(res => {
                                                    productData[res].productList.map(text => {
                                                        if (text.productid == prod.productid) {
                                                            prod = Object.assign(prod, text)
                                                        }
                                                    })
                                                })
                                            } else {
                                                if (this.state.DividendsType) {
                                                    if (this.state.DividendsType[index]) {
                                                        NewdataText[indexx].DividendsType = this.state.DividendsType[index][indexx]
                                                    }
                                                }
                                                NewdataJson.map((key) => {
                                                    if (key.productid == prod.productId) {
                                                        prod = Object.assign(prod, key)
                                                    }
                                                })
                                            }
                                        } else {
                                            this.setState({
                                                Prompt: {
                                                    ...this.state.Prompt,
                                                    text: prod.rule,
                                                    state: true
                                                }
                                            })
                                        }
                                    })
                                    if (flag == true) {
                                        if (!that.state.Exemptions) {
                                            this.setState({
                                                productData: {
                                                    ...this.state.productData,
                                                    productData: {
                                                        ...this.state.productData.productData,
                                                        [index]: {
                                                            ...this.state.productData.productData[index],
                                                            productList: NewdataText
                                                        }
                                                    }
                                                }
                                            }, () => {
                                            })
                                        } else {
                                            let productData = that.state.productData.productData
                                            let newText = ''
                                            Object.keys(productData).map(b => {
                                                productData[b].productList.map(info => {
                                                    NewdataText.map(Newinfo => {
                                                        if (info.productid == Newinfo.code) {
                                                            info = Object.assign(info, Newinfo)
                                                        }
                                                    })
                                                })
                                            })
                                            this.setState({
                                                productData: {
                                                    ...this.state.productData,
                                                    productData: productData
                                                }
                                            }, () => {
                                            })
                                        }
                                    }
                                } else {
                                    that.setState({
                                        Prompt: {
                                            text: '保费计算失败！',
                                            state: true
                                        }
                                    })
                                }
                            })
                        })
                    }
                } else {
                    that.setState({
                        Prompt: {
                            text: '保费计算失败！',
                            state: true
                        }
                    })
                }
            })
        }
    }

    //新增计划
    addProduct() {
        let productData = this.state.productData.productData
        let addState = true
        Object.keys(productData).map(prod => {
            if (!productData[prod].productList || productData[prod].productList.length == 0) {
                addState = false
            }
        })
        if (addState == true) {
            this.setState({
                Prompt: {
                    state: true,
                    text: '请先添加被保人！！'
                }
            }, () => {
            })
        } else {
            this.setState({
                addProductState: true
            })
        }
    }

    //alert框
    alertSure() {
        this.setState({
            Prompt: {
                ...this.state.Prompt,
                state: false
            }
        }, () => {
        })
    }





    //新加被保人
    addInsurance() {
        let that = this
        let insurLength = Object.keys(this.state.productData.productData).length
        if (localStorage.type == '10' || localStorage.type == '20') {
            this.setState({
                Prompt: {
                    state: true,
                    text: '简易平台只能选择一款产品！'
                }
            })
        } else {
            if (insurLength == 3) {
                this.setState({
                    Prompt: {
                        state: true,
                        text: '最多三个被保人！！'
                    }
                })
            } else {
                let newInsurance = this.state.newInsurance
                newInsurance.push({
                    name: '被保人姓名',
                    sex: '性别',
                    birthday: '出生日期',
                    occupBig: '职业大类',
                    occupLittle: '职业小类',
                    occupCode: '职业代码',
                    occup: ''
                })
                piccAjax('/proposal/create_plan.json', {
                    "proposalId": this.state.proposalId,
                    "proposalType": "1",
                    "applicant": {
                        "birthday": "1990-01-01",
                        "gender": "M",
                        "name": "李莉莉"
                    },
                    "insurant": {
                        "birthday": "1989-05-19",
                        "gender": "F",
                        "occupationCode": "00101",
                        "name": "ghh",
                        "occup_BigCode": "1",
                        "occup_SmallCode": "2",
                        "occup_LevelCode": "1",
                        "customer_id": "844539",
                        "email": ""
                    }

                }, create_plan => {
                    let productDataLength = Object.keys(that.state.productData.productData).length
                    this.setState({
                        newInsurance: newInsurance,
                        productData: {
                            ...that.state.productData,
                            planID: create_plan.content.detail,
                            productData: {
                                ...that.state.productData.productData,
                                [productDataLength + 1]: {},
                            }
                        }
                    }, () => {
                        let dateSelector = 'dateSelector' + (Object.keys(that.state.productData.productData).length - 1)
                        new Mdate(dateSelector, {
                            //"dateShowBtn"为你点击触发Mdate的id，必填项
                            beginYear: "1952",
                            //此项为Mdate的初始年份，不填写默认为2000
                            beginMonth: "",
                            //此项为Mdate的初始月份，不填写默认为1
                            beginDay: "",
                            //此项为Mdate的初始日期，不填写默认为1
                            endYear: "",
                            //此项为Mdate的结束年份，不填写默认为当年
                            endMonth: "",
                            //此项为Mdate的结束月份，不填写默认为当月
                            endDay: "",
                            //此项为Mdate的结束日期，不填写默认为当天
                            format: "-"
                            //此项为Mdate需要显示的格式，可填写"/"或"-"或".",不填写默认为年月日
                        })
                    })
                })

            }
        }

    }

    //客户选择
    UserChoice(prod) {
        this.setState({
            ChoicedUser: prod
        })
    }

    //新建客户
    newInsurance(id) {
        let that = this
        if (id == 1) {

            if (this.state.newInsurance.length < 1) {
                let newInsurance = this.state.newInsurance

                newInsurance.push({
                    name: '被保人姓名',
                    sex: '性别',
                    birthday: '出生日期',
                    occupBig: '职业大类',
                    occupLittle: '职业小类',
                    occupCode: '职业代码',
                    occup: ''
                })
                this.setState({
                    newInsurance: newInsurance,


                }, () => {
                    Object.keys(this.state.occupCode).map((prod) => {
                        this.setState({
                            insureLength: that.state.insureLength + 1,
                            occup: {
                                ...this.state.occup,
                                "1": {
                                    ...this.state.occup[1]
                                }
                            }
                        }, () => {
                            new Mdate('dateSelector0', {
                                //"dateShowBtn"为你点击触发Mdate的id，必填项
                                beginYear: "1952",
                                //此项为Mdate的初始年份，不填写默认为2000
                                beginMonth: "",
                                //此项为Mdate的初始月份，不填写默认为1
                                beginDay: "",
                                //此项为Mdate的初始日期，不填写默认为1
                                endYear: "",
                                //此项为Mdate的结束年份，不填写默认为当年
                                endMonth: "",
                                //此项为Mdate的结束月份，不填写默认为当月
                                endDay: "",
                                //此项为Mdate的结束日期，不填写默认为当天
                                format: "-"
                                //此项为Mdate需要显示的格式，可填写"/"或"-"或".",不填写默认为年月日
                            })
                        })
                    })
                })
            }
            this.setState({
                insuranceBox: true
            })
        } else {
            let that = this
            this.setState({
                ChoicedUser: '',
                loading: true
            }, () => {
                piccAjax(this.state.baseUrl + '/queryCustomer', {
                    "login_Account": localStorage.usercode,
                    "customer_id": '',
                    "pageNum": this.state.CustomerPage,
                    "pageSize": this.state.CustomerPageSize
                }, data => {
                    if (data.status) {
                        that.setState({
                            customerState: true,
                            userInfo: data.data,
                            loading: false
                        })
                    } else {
                        alert('查询客户列表失败！')
                    }
                })
            })

        }

    }

    //客户管理
    UserInfo(index) {

        if (index == 1) {
            this.setState({
                customerState: false
            })
        } else {
            let productData = this.state.productData.productData,
                ChoicedUser = this.state.ChoicedUser,
                that = this

            if (this.state.ChoicedUser = '') {
                alert('请选择客户！')
            } else {
                let insurLength = Object.keys(this.state.productData.productData).length
                if (insurLength == 3) {
                    this.setState({
                        customerState: false,
                        Prompt: {
                            state: true,
                            text: '最多三个被保人！！'
                        }
                    })
                } else {
                    this.setState({
                        insureLength: this.state.insureLength + 1
                    }, () => {
                        let newInsurance = this.state.newInsurance
                        newInsurance.push({
                            name: '被保人姓名',
                            sex: '性别',
                            birthday: '出生日期',
                            occupBig: '职业大类',
                            occupLittle: '职业小类',
                            occupCode: '职业代码',
                            occup: ''
                        })
                        let productDatalength = Object.keys(this.state.productData.productData).length
                        let occup = ''
                        if (that.state.insureLength == 0) {
                            let sex = ChoicedUser.genderCode == '0' ? 'M' : 'F'
                            let productList = productData[1].productList
                            Object.keys(this.state.occupCode).map((prod) => {
                                if (prod == ChoicedUser.occup_BigCode) {
                                    occup = {
                                        ...this.state.occup,
                                        "1": {
                                            ...this.state.occup[1],
                                            occupCodeData: ChoicedUser.occup_Code,
                                            level: ChoicedUser.occup_LevelCode,
                                            occupLittle: this.state.occupCode[prod]
                                        }
                                    }
                                }
                            })
                            productData = {
                                "1": {
                                    productList: productList,
                                    name: ChoicedUser.name,
                                    gender: sex,
                                    birthday: ChoicedUser.birthday,
                                    occup_BigCode: ChoicedUser.occup_BigCode,
                                    occupationCode: ChoicedUser.occup_SmallCode,
                                    occup_LevelCode: ChoicedUser.occup_LevelCode,
                                    occup_BigName: occop_data[ChoicedUser.occup_BigCode].des,
                                    occupationName: occop_data[ChoicedUser.occup_BigCode].sub[ChoicedUser.occup_SmallCode].des,
                                    nationality: ChoicedUser.nationality_ID,
                                    nationality_list2: ChoicedUser.nationality_ID2 ? true : false,
                                    Marriage: ChoicedUser.marriage,
                                    Certificates: ChoicedUser.id_Type2,
                                    Identification: ChoicedUser.card_num,
                                    cardStart: ChoicedUser.id_Start_Date,
                                    cardEnd: ChoicedUser.id_End_Date,
                                    WorkUnit: ChoicedUser.enterprise,
                                    Job: ChoicedUser.duty,
                                    income: ChoicedUser.salary,
                                    provinceValue: ChoicedUser.provinceCode,
                                    cityCode: ChoicedUser.cityCode,
                                    countyCode: ChoicedUser.areaCode,
                                    Town: ChoicedUser.street,
                                    village: ChoicedUser.community,
                                    Postal: ChoicedUser.zipcode,
                                    Telephone: ChoicedUser.mobile,
                                    MobilePhone: ChoicedUser.phone,
                                    mailbox: ChoicedUser.email,
                                    customer_id: ChoicedUser.customer_id
                                }
                            }
                            this.setState({
                                occup: {
                                    ...occup
                                },
                                choseOccup: ChoicedUser.occup_BigCode,
                                newInsurance: newInsurance,
                                insuranceBox: true,
                                customerState: false,
                                insureLength: that.state.insureLength + 1,
                                productData: {
                                    ...this.state.productData,
                                    productData: productData
                                }
                            }, () => {
                                new Mdate('dateSelector0', {
                                    //"dateShowBtn"为你点击触发Mdate的id，必填项
                                    beginYear: '1952',
                                    //此项为Mdate的初始年份，不填写默认为2000
                                    beginMonth: "",
                                    //此项为Mdate的初始月份，不填写默认为1
                                    beginDay: "",
                                    //此项为Mdate的初始日期，不填写默认为1
                                    endYear: "",
                                    //此项为Mdate的结束年份，不填写默认为当年
                                    endMonth: "",
                                    //此项为Mdate的结束月份，不填写默认为当月
                                    endDay: "",
                                    //此项为Mdate的结束日期，不填写默认为当天
                                    format: "-"
                                    //此项为Mdate需要显示的格式，可填写"/"或"-"或".",不填写默认为年月日
                                })
                                let dataTime = 'dataTime0'
                                piccAjax('/plan/clauses_customer.json', {
                                    "applicant": {
                                        "birthday": "1990-01-01",
                                        "gender": "M",
                                        "name": "李莉莉"
                                    },
                                    "insurant": {
                                        "birthday": this.refs[dataTime].value,
                                        "gender": this.state.productData.productData[1].gender,
                                        "occupationCode": this.state.productData.productData[1].occupationCode,
                                        "name": this.state.productData.productData[1].name,
                                        "occup_BigCode": this.state.productData.productData[1].occup_BigCode,
                                        "occup_SmallCode": this.state.productData.productData[1].occup_LevelCode,
                                        "occup_LevelCode": this.state.productData.productData[1].occup_LevelCode,
                                        "customer_id": this.state.productData.planID[0],
                                        "email": "",
                                        "taxHospital": localStorage.type == '20' ? this.state.orClause : 2
                                    },
                                    "planId": this.state.productData.planID[0],
                                    "proposalType": "1"
                                }, clauses_customer => {
                                    if (clauses_customer) {
                                        let dataText = clauses_customer.content.plan.product;
                                        let dataJson = clauses_customer.content.products;

                                        let isSuccess = true
                                        dataText.map((prod) => {
                                            if (!prod.rule) {
                                                dataJson.map((key) => {
                                                    if (key.productid == prod.code) {
                                                        prod = Object.assign(prod, key)
                                                    }
                                                })

                                            } else {
                                                isSuccess = false
                                                dataJson.map((key) => {
                                                    if (key.productid == prod.code) {
                                                        prod = Object.assign(prod, key)
                                                    }
                                                })
                                                this.setState({
                                                    Prompt: {
                                                        ...this.state.Prompt,
                                                        text: prod.rule,
                                                        state: true
                                                    }
                                                }, () => {
                                                })
                                            }
                                        })
                                        if (isSuccess == true) {
                                            this.setState({
                                                Prompt: {
                                                    ...this.state.Prompt,
                                                    text: '',
                                                    style: false
                                                },
                                                productData: {
                                                    ...this.state.productData,
                                                    productData: {
                                                        ...this.state.productData.productData,
                                                        "1": {
                                                            ...this.state.productData.productData[1],
                                                            productList: [
                                                                ...dataText
                                                            ]
                                                        }
                                                    }
                                                }
                                            }, () => {
                                                piccAjax('/plan/rebuild.json', {
                                                    "planId": this.state.productData.planID[0],
                                                    "detail": this.detailArr(1)
                                                }, rebuild => {
                                                    let flag = false
                                                    let NewdataText = rebuild.content.product;
                                                    let NewdataJson = this.state.productData.productData[1].productList

                                                    NewdataText.map((prod, indexx) => {
                                                        if (!prod.rule) {
                                                            flag = true
                                                            if (this.state.DividendsType) {
                                                                if (this.state.DividendsType[1]) {
                                                                    NewdataText[indexx].DividendsType = this.state.DividendsType[1][indexx]
                                                                }
                                                            }
                                                            NewdataJson.map((key) => {
                                                                if (key.productid == prod.productId) {
                                                                    prod = Object.assign(prod, key)
                                                                }
                                                            })
                                                        } else {
                                                            this.setState({
                                                                Prompt: {
                                                                    ...this.state.Prompt,
                                                                    text: prod.rule,
                                                                    state: true
                                                                }
                                                            })
                                                        }
                                                    })

                                                    if (flag == true) {
                                                        this.setState({
                                                            productData: {
                                                                ...this.state.productData,
                                                                productData: {
                                                                    ...this.state.productData.productData,
                                                                    "1": {
                                                                        ...this.state.productData.productData[1],
                                                                        productList: NewdataText
                                                                    }
                                                                }
                                                            }
                                                        }, () => {
                                                        })
                                                    }
                                                })
                                            })
                                        }
                                    }
                                })
                            })
                        } else {
                            Object.keys(this.state.occupCode).map((prod) => {
                                if (prod == ChoicedUser.occup_BigCode) {
                                    occup = {
                                        ...this.state.occup,
                                        [productDatalength + 1]: {
                                            ...this.state.occup[productDatalength + 1],
                                            occupCodeData: ChoicedUser.occup_Code,
                                            level: ChoicedUser.occup_LevelCode,
                                            occupLittle: this.state.occupCode[prod]
                                        }
                                    }
                                }
                            })
                            let sex = ChoicedUser.genderCode == 1 ? 'M' : 'F'
                            piccAjax('/proposal/create_plan.json', {
                                "proposalId": this.state.proposalId,
                                "proposalType": "1",
                                "applicant": {
                                    "birthday": "1990-01-01",
                                    "gender": "M",
                                    "name": "李莉莉"
                                },
                                "insurant": {
                                    // productList: productList,
                                    name: ChoicedUser.name,
                                    gender: sex,
                                    birthday: ChoicedUser.birthday,
                                    occup_BigCode: ChoicedUser.occup_BigCode,
                                    occupationCode: ChoicedUser.occup_SmallCode,
                                    occup_LevelCode: ChoicedUser.occup_LevelCode,
                                    occup_BigName: occop_data[ChoicedUser.occup_BigCode].des,
                                    occupationName: occop_data[ChoicedUser.occup_BigCode].sub[ChoicedUser.occup_SmallCode].des,
                                    nationality: ChoicedUser.nationality_ID,
                                    nationality_list2: ChoicedUser.nationality_ID2 ? true : false,
                                    Marriage: ChoicedUser.marriage,
                                    Certificates: ChoicedUser.id_Type2,
                                    Identification: ChoicedUser.card_num,
                                    cardStart: ChoicedUser.id_Start_Date,
                                    cardEnd: ChoicedUser.id_End_Date,
                                    WorkUnit: ChoicedUser.enterprise,
                                    Job: ChoicedUser.duty,
                                    income: ChoicedUser.salary,
                                    provinceValue: ChoicedUser.provinceCode,
                                    cityCode: ChoicedUser.cityCode,
                                    countyCode: ChoicedUser.areaCode,
                                    Town: ChoicedUser.street,
                                    village: ChoicedUser.community,
                                    Postal: ChoicedUser.zipcode,
                                    Telephone: ChoicedUser.phone,
                                    MobilePhone: ChoicedUser.mobile,
                                    mailbox: ChoicedUser.email,
                                    customer_id: ChoicedUser.customer_id
                                }

                            }, create_plan => {


                                productData = {
                                    [productDatalength + 1]: {
                                        productList: [],
                                        name: ChoicedUser.name,
                                        gender: sex,
                                        birthday: ChoicedUser.birthday,
                                        occup_BigCode: ChoicedUser.occup_BigCode,
                                        occupationCode: ChoicedUser.occup_SmallCode,
                                        occup_LevelCode: ChoicedUser.occup_LevelCode,
                                        occup_BigName: occop_data[ChoicedUser.occup_BigCode].des,
                                        occupationName: occop_data[ChoicedUser.occup_BigCode].sub[ChoicedUser.occup_SmallCode].des,
                                        nationality: ChoicedUser.nationality_ID,
                                        nationality_list2: ChoicedUser.nationality_ID2 ? true : false,
                                        Marriage: ChoicedUser.marriage,
                                        Certificates: ChoicedUser.id_Type2,
                                        Identification: ChoicedUser.card_num,
                                        cardStart: ChoicedUser.id_Start_Date,
                                        cardEnd: ChoicedUser.id_End_Date,
                                        WorkUnit: ChoicedUser.enterprise,
                                        Job: ChoicedUser.duty,
                                        income: ChoicedUser.salary,
                                        provinceValue: ChoicedUser.provinceCode,
                                        cityCode: ChoicedUser.cityCode,
                                        countyCode: ChoicedUser.areaCode,
                                        Town: ChoicedUser.street,
                                        village: ChoicedUser.community,
                                        Postal: ChoicedUser.zipcode,
                                        Telephone: ChoicedUser.phone,
                                        MobilePhone: ChoicedUser.mobile,
                                        mailbox: ChoicedUser.email,
                                    }
                                }

                                this.setState({
                                    occup: {
                                        ...occup
                                    },
                                    choseOccup: ChoicedUser.occup_BigCode,
                                    newInsurance: newInsurance,
                                    insuranceBox: true,
                                    customerState: false,
                                    productData: {
                                        ...this.state.productData,
                                        planID: create_plan.content.detail,
                                        productData: {
                                            ...this.state.productData.productData,
                                            ...productData
                                        }
                                    }
                                }, () => {
                                    let dateSelector = 'dateSelector' + (Object.keys(this.state.productData.productData).length - 1)
                                    new Mdate(dateSelector, {
                                        //"dateShowBtn"为你点击触发Mdate的id，必填项
                                        beginYear: "1952",
                                        //此项为Mdate的初始年份，不填写默认为2000
                                        beginMonth: "",
                                        //此项为Mdate的初始月份，不填写默认为1
                                        beginDay: "",
                                        //此项为Mdate的初始日期，不填写默认为1
                                        endYear: "",
                                        //此项为Mdate的结束年份，不填写默认为当年
                                        endMonth: "",
                                        //此项为Mdate的结束月份，不填写默认为当月
                                        endDay: "",
                                        //此项为Mdate的结束日期，不填写默认为当天
                                        format: "-"
                                        //此项为Mdate需要显示的格式，可填写"/"或"-"或".",不填写默认为年月日
                                    })
                                })
                            })
                        }
                    })
                }
            }
        }

    }

    //保额或档次
    amountORank(key, index, i) {
        let productData = this.state.productData.productData
        let Prompt = this.state.Prompt
        if (key.productid == '00232701') {
            return (
                <input type="number"
                       className='con_list_number pro_amount'
                       value={key.amount ? key.amount : null} disabled={true}/>
            )
        } else {
            if (key.value.RANK) {
                return (
                    <select
                        className={productData[index].productList[i].inputType == 'RANK' && productData[index].productList[i].rule ? 'planSelect borderError' : 'planSelect'}
                        onChange={this.rankChange.bind(this, key, index, i)}>{this.rankData(key)}</select>
                )
            } else if (key.value.QUANTITY || key.value.PREMIUM) {
                return (
                    <input type="number"
                           className="con_list_number pro_amount"
                           value={key.amount} disabled='disabled' style={{background: 'rgb(245, 245, 245)'}}/>
                )
            } else {
                return (
                    <input type="number"
                           className={productData[index].productList[i].inputType == 'AMOUNT' && index == Prompt.index && i == Prompt.i && Prompt.style ? 'con_list_number pro_amount borderError' : 'con_list_number pro_amount'}
                           defaultValue={key.amount}
                           onChange={this.amountChange.bind(this, key, index, i)}/>
                )
            }
        }
    }

    //份数
    quantityI(key, index, i) {
        let productData = this.state.productData.productData
        let Prompt = this.state.Prompt
        return (
            <input type="number"
                   className={productData[index].productList[i].inputType == 'QUANTITY' && index == Prompt.index && i == Prompt.i ? 'con_list_number pro_amount borderError' : 'con_list_number pro_amount'}
                   defaultValue={key.value.QUANTITY}
                   onChange={this.quantityChange.bind(this, key, index, i)}/>
        )
    }

    //分红模式
    bonus(key, index, i) {
        let healthState = false
        this.state.productData.productData[index].productList.map(prod => {
            if (prod.code == '00340602') {
                healthState = true
            }
        })
        if (healthState == false) {
            return (
                <select className="bonus" onChange={this.bonusChange.bind(this, key, index, i)}>
                    <option value="2">累积生息</option>
                    <option value="1">现金领取</option>
                </select>
            )
        } else {
            return (
                <select className="bonus" onChange={this.bonusChange.bind(this, key, index, i)}>
                    <option value="2">累积生息</option>
                </select>
            )
        }

    }

    bonusChange(key, index, i) {
        let e = window.event || arguments[0];
        let productList = this.state.productData.productData[index].productList
        productList[i].DividendsType = e.target.value

        this.setState({
            DividendsType: {
                [index]: {
                    [i]: e.target.value
                }
            },
            productData: {
                ...this.state.productData,
                productData: {
                    ...this.state.productData.productData,
                    [index]: {
                        ...this.state.productData.productData[index],
                        productList: productList
                    }
                }
            }
        }, () => {
        })
    }

    //保费格式
    premiumS(key, index, i) {
        let productData = this.state.productData.productData
        let Prompt = this.state.Prompt
        if (key.inputType != 'PREMIUM') {
            return (
                <li className="con_list_sub"><span
                    className="regular_premium">期缴保费：</span><em
                    className="pro_money pro_money_2">{key.premium}</em>元

                </li>
            )
        } else {
            return (
                <li className="con_list_sub"><span
                    className="regular_premium">期缴保费：</span>
                    <input type="number"
                           className={productData[index].productList[i].inputType == 'PREMIUM' && index == Prompt.index && i == Prompt.i && Prompt.style ? 'con_list_number pro_amount borderError' : 'con_list_number pro_amount'}
                           value={key.premium}
                           onChange={this.premiumChange.bind(this, key, index, i)}/>
                </li>

            )
        }
    }

    //追加保费格式
    premiumSS(item, index, i) {
        return (
            <p className="con_list_sub">&nbsp;<span style={{width: 'auto'}}>追加保费：</span>
                <input className='con_list_number pro_amount' defaultValue={item.AppendPrem ? item.AppendPrem : null}
                       type="number" onChange={this.AppendPrem.bind(this, item, index, i)}/>
            </p>
        )
    }

    //健康一生保费
    premiumSSs(item, index, i) {
        return (
            <p className="con_list_sub">&nbsp;<span style={{width: 'auto'}}>期缴保费：</span>
                <input className='con_list_number pro_amount' value={item.premium} type="number"
                       onChange={this.AppendPrems.bind(this, item, index, i)}/>
            </p>
        )
    }

    render() {
        return (
            <div>
                {
                    !this.state.Cross && <div>
                        {
                            this.state.Prompt.state &&
                            <div className="insure_built insure_built_lb insure_alert" style={{display: 'block'}}>
                                <div className="mask">
                                    <div className="mask_con">
                                        <p className="mask_con_title">提示</p>
                                        <div className="mask_con_main"><span style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'block',
                                            lineHeight: '29px',
                                            wordBreak: 'keep-all'
                                        }}>{this.state.Prompt.text}</span></div>
                                        <div className="mask_con_btn">
                                            <p className="clearfix"><a href="javascript:;"
                                                                       className="fl" style={{width: '100%'}}
                                                                       onClick={this.alertSure.bind(this)}>确定</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            <div className="insure_title clearfix">
                                <div className="clearfix">
                                    <p className="fl">选择被保人</p>
                                    <p className="fl mb15">
                                        <a href="javascript:;" onClick={this.newInsurance.bind(this, 1)}>新建客户</a>
                                        <a href="javascript:;" onClick={this.newInsurance.bind(this, 2)}>已建客户</a>
                                    </p>
                                </div>

                            </div>

                        }
                        {
                            this.state.insuranceBox && <div className="insure_addpeople">
                                <div className="insure_con">
                                    {
                                        this.state.newInsurance.map((prod, index) => {
                                            let productData = this.state.productData.productData
                                            return (
                                                <ul className="ul-list">
                                                    <li className="clearfix people_name">
                                                        <p className="fl"><i className="order">{index + 1}</i>被保险人姓名：
                                                        </p>
                                                        <div className="fl">
                                                            <input type="text" id={index + 1}
                                                                   onChange={this.insurName.bind(this)}
                                                                   className="username"
                                                                   value={productData[index + 1].name ? productData[index + 1].name : null}/>
                                                        </div>
                                                    </li>
                                                    <li className="clearfix">
                                                        <p className="fl">性别：</p>
                                                        <div className="fl clearfix">
                                                            <p className="man fl">
                                                                <input type="checkbox" className="male"
                                                                       name={'sex' + index}
                                                                       onClick={this.choiceSex.bind(this, 'M', index + 1)}
                                                                       checked={productData[index + 1].gender == 'M' ? true : false}/>&nbsp;
                                                                <label>男</label>
                                                            </p>
                                                            <p className="fl">
                                                                <input type="checkbox" className="female"
                                                                       name={'sex' + index}
                                                                       onClick={this.choiceSex.bind(this, 'F', index + 1)}
                                                                       checked={productData[index + 1].gender == 'F' ? true : false}/>&nbsp;
                                                                <label for="sex_female_{{n}}">女</label>
                                                            </p>
                                                        </div>
                                                    </li>
                                                    <li className="clearfix">
                                                        <p className="fl">出生日期：</p>
                                                        <div className="fl time">
                                                            <input type="text" id={'dateSelector' + index}
                                                                   data-options="{'type':'YYYY-MM-DD','beginYear':1952,'endYear':2088}"
                                                                   ref={'dataTime' + (index)}
                                                                   onClick={this.dataTime.bind(this, 'dataTime' + index)}
                                                                   value={productData[index + 1] ? productData[index + 1].birthday : ''}
                                                                   className="dataTime"/>
                                                        </div>
                                                    </li>
                                                    <li className="clearfix">
                                                        <p className="fl">职业大类：</p>
                                                        <div className="fl">
                                                            <select className="insure_con_select userselect_big"
                                                                    onChange={this.occupBig.bind(this, index + 1)}
                                                                    refs="occupBigCode"
                                                                    value={productData[index + 1] ? productData[index + 1].occup_BigCode : ''}>
                                                                <option>请选择</option>
                                                                {
                                                                    this.state.occupCode && Object.keys(this.state.occupCode).map((prod, index) => {
                                                                        return (
                                                                            <option
                                                                                value={prod}>{this.state.occupCode[prod].des}</option>

                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                        </div>
                                                    </li>
                                                    <li className="clearfix">
                                                        <p className="fl">职业小类：</p>
                                                        <div className="fl">
                                                            <select className="insure_con_select userselect_small"
                                                                    onChange={this.occupLittle.bind(this, index + 1)}
                                                                    value={productData[index + 1] ? productData[index + 1].occupationCode : ''}>
                                                                <option>请选择</option>
                                                                {
                                                                    productData[index + 1].occup_BigCode && Object.keys(this.state.occupCode[productData[index + 1].occup_BigCode].sub).map((prod) => {
                                                                        let selectValue = this.state.occupCode[productData[index + 1].occup_BigCode].sub
                                                                        return (
                                                                            <option value={prod}
                                                                            >{selectValue[prod].des}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                        </div>
                                                    </li>
                                                    <li className="clearfix">
                                                        <p className="fl">职业代码：</p>
                                                        <div className="fl">
                                                            <input type="text" placeholder="请先选择职业类别"
                                                                   disabled="disabled"
                                                                   className="disable mb15 occup1"
                                                                   value={productData[index + 1] ? productData[index + 1].occupationCode : null}/>
                                                            <input type="text" className="disable occup2"
                                                                   disabled="disabled"
                                                                   value={productData[index + 1] ? productData[index + 1].occup_LevelCode : null}/><span
                                                            className="lei">类</span>
                                                        </div>
                                                    </li>
                                                    {
                                                        localStorage.type == '20' && <li className="clearfix">
                                                            <p className="fl">是否投保符合条款释义的补充医疗保险：</p>
                                                            <div className="fl">
                                                                <select className="insure_con_select userselect_big"
                                                                        onChange={this.orClause.bind(this)}>
                                                                    <option value="2">否</option>
                                                                    <option value="1">是</option>
                                                                </select>
                                                            </div>
                                                        </li>
                                                    }
                                                    {
                                                        this.state.orClause == "1" && <li className="clearfix">
                                                            <p className="fl">①住院保障责任的起付线不高于500/年：</p>
                                                            <div className="fl">
                                                                <select className="insure_con_select userselect_big"
                                                                        onChange={this.clauseValue.bind(this, "1")}>
                                                                    <option value="2">否</option>
                                                                    <option value="1">是</option>
                                                                </select>
                                                            </div>
                                                        </li>
                                                    }
                                                    {
                                                        this.state.orClause == "1" && <li className="clearfix">
                                                            <p className="fl">②住院保障责任的赔付比例不低于80%：</p>
                                                            <div className="fl">
                                                                <select className="insure_con_select userselect_big"
                                                                        onChange={this.clauseValue.bind(this, "2")}>
                                                                    <option value="2">否</option>
                                                                    <option value="1">是</option>
                                                                </select>
                                                            </div>
                                                        </li>
                                                    }
                                                    {
                                                        this.state.orClause == "1" && <li className="clearfix">
                                                            <p className="fl">③住院保障责任的保额额度不低于3000元：</p>
                                                            <div className="fl">
                                                                <select className="insure_con_select userselect_big"
                                                                        onChange={this.clauseValue.bind(this, "3")}>
                                                                    <option value="2">否</option>
                                                                    <option value="1">是</option>
                                                                </select>
                                                            </div>
                                                        </li>
                                                    }
                                                    {
                                                        this.state.orClause == "1" && <li className="clearfix">
                                                            <p className="fl">④住院保障责任所承担的医疗费用范围包括被保险人医疗所属地基本医疗保险基金支付范围内的各类医疗费用：</p>
                                                            <div className="fl">
                                                                <select className="insure_con_select userselect_big"
                                                                        onChange={this.clauseValue.bind(this, "4")}>
                                                                    <option value="2">否</option>
                                                                    <option value="1">是</option>
                                                                </select>
                                                            </div>
                                                        </li>
                                                    }
                                                </ul>
                                            )
                                        })
                                    }
                                    {
                                        localStorage.type != '20' && <p className="insure_con_addr">
                                            <a href="javascript:;" onClick={this.addInsurance.bind(this)}>新加被保人</a>
                                        </p>
                                    }

                                </div>
                            </div>
                        }
                        {
                            this.state.productData && <div className="insure_plan">
                                {
                                    this.state.productData.productData && Object.keys(this.state.productData.productData).map((prod, index) => {
                                        if (this.state.productData.productData[prod].productList) {
                                            return (
                                                <div className="insure_plan_con">
                                                    <p className="num"><span>{prod}</span></p>
                                                    <div className="plan_con_main">
                                                        {
                                                            this.state.productData.productData[prod].productList && this.state.productData.productData[prod].productList.length > 0 ? this.state.productData.productData[prod].productList.map((key, i) => {
                                                                if (key.ismain == true) {
                                                                    return (
                                                                        <ul className="plan_con_list"
                                                                            style={{overflow: 'hidden'}}>
                                                                            <li className="clearfix"><i
                                                                                className="zhu fl">主</i>
                                                                                <p className="fl con_list_p">{key.name}</p>
                                                                                <span
                                                                                    className="fl">代码：<em
                                                                                    className="pro_code">{key.productid.slice(2)}</em></span>
                                                                            </li>
                                                                            <li className="con_list_sub">
                                                                                <span>保额/档次：</span>

                                                                                {

                                                                                    this.amountORank(key, index + 1, i)
                                                                                }
                                                                                {
                                                                                    (key.inputType != 'RANK') && <span
                                                                                        className="station">&nbsp;元&nbsp;</span>
                                                                                }

                                                                                {
                                                                                    key.productType == 'bonus' && this.bonus(key, index + 1, i)
                                                                                }
                                                                            </li>
                                                                            {
                                                                                (key.productid != '00232701' && key.value.QUANTITY) &&
                                                                                <li className="con_list_sub">
                                                                                    <span>份  数：</span>

                                                                                    {
                                                                                        this.quantityI(key, index + 1, i)
                                                                                    }
                                                                                    {
                                                                                        this.state.Prompt.index == index + 1 && this.state.Prompt.i == i && this.ruleData(key, index + 1, i, key.ismian)
                                                                                    }
                                                                                </li>
                                                                            }
                                                                            <li className="con_list_sub">
                                                                                <span>保险期间：</span>
                                                                                {
                                                                                    key.code != '00232701' &&
                                                                                    <select className="con_list_term"
                                                                                            onChange={this.insureChange.bind(this, key, index + 1, i)}>
                                                                                        {
                                                                                            this.insurList(key)
                                                                                        }
                                                                                    </select>
                                                                                }
                                                                                {
                                                                                    key.code == '00232701' &&
                                                                                    <input type="text"
                                                                                           className='con_list_number pro_amount'
                                                                                           value={key.insure ? key.insure : null}
                                                                                           disabled={true}/>
                                                                                }
                                                                            </li>
                                                                            <li className="con_list_sub">
                                                                                <span>缴费年期：</span>
                                                                                {
                                                                                    key.code != '00232701' &&
                                                                                    <select className="con_list_year"
                                                                                            onChange={this.payChange.bind(this, key, index + 1, i)}>
                                                                                        {
                                                                                            this.payList(key)
                                                                                        }
                                                                                    </select>
                                                                                }
                                                                                {
                                                                                    key.code == '00232701' &&
                                                                                    <input type="text"
                                                                                           className='con_list_number pro_amount'
                                                                                           value={key.pay ? key.pay : null}
                                                                                           disabled={true}/>
                                                                                }
                                                                            </li>
                                                                            {
                                                                                this.premiumS(key, index + 1, i)
                                                                            }
                                                                            <button type="button"
                                                                                    className="compute fr"
                                                                                    onClick={this.PremiumCalculation.bind(this, key, index + 1)}>
                                                                                保费计算
                                                                            </button>
                                                                            {
                                                                                this.state.Prompt.index == index + 1 && this.state.Prompt.i == i && this.state.Prompt.style && this.ruleData(key, index + 1, i, key.ismian)
                                                                            }
                                                                        </ul>
                                                                    )
                                                                }


                                                            }) : ''
                                                        }
                                                        {
                                                            this.state.productData.productData[prod].productList && this.state.productData.productData[prod].productList.length > 0 ? this.state.productData.productData[prod].productList.map((key, i) => {
                                                                if (key.ismain == false && key.code != '00340602') {
                                                                    {
                                                                        return (
                                                                            <div className="plan_con_attach">
                                                                                <ul>

                                                                                    <li>
                                                                                        <p className="clearfix"><span
                                                                                            className="color">附</span>&nbsp;&nbsp;
                                                                                            <span
                                                                                                className="proName">{key.abbrName}</span><span
                                                                                                className="fr">代码：<em
                                                                                                className="pro_code pro_code_fx">{key.code.slice(2)}</em></span>
                                                                                        </p>
                                                                                        <p>
                                                                                    <span
                                                                                        className="coverageGrade">保额/档次：</span>
                                                                                            {
                                                                                                key.rank ? <select
                                                                                                        className="planSelect">{this.rankData(key)}</select> :
                                                                                                    <span
                                                                                                        className="addition">{key.amount}元</span>

                                                                                            }


                                                                                        </p>
                                                                                        <p>&nbsp;<span>保险期间：</span>
                                                                                            <select
                                                                                                className="planSelect">
                                                                                                {
                                                                                                    this.insurList(key)
                                                                                                }
                                                                                            </select>
                                                                                        </p>
                                                                                        <p>&nbsp;<span>缴费年期：</span>
                                                                                            <select
                                                                                                className="planSelect">
                                                                                                {
                                                                                                    this.payList(key)
                                                                                                }
                                                                                            </select>
                                                                                        </p>
                                                                                        <p>&nbsp;<span>期缴保费：</span><span
                                                                                            className="promoney promoney_f">{key.premium}</span><span>元</span>
                                                                                        </p>
                                                                                        {
                                                                                            this.premiumSS(key, index + 1, i)
                                                                                        }
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        )
                                                                    }
                                                                } else if (key.ismain == false && key.code == '00340602') {
                                                                    {
                                                                        return (
                                                                            <div className="plan_con_attach">
                                                                                <ul>

                                                                                    <li>
                                                                                        <p className="clearfix"><span
                                                                                            className="color">附</span>&nbsp;&nbsp;
                                                                                            <span
                                                                                                className="proName">{key.abbrName}</span><span
                                                                                                className="fr">代码：<em
                                                                                                className="pro_code pro_code_fx">{key.code.slice(2)}</em></span>
                                                                                        </p>
                                                                                        <p>
                                                                                    <span
                                                                                        className="coverageGrade">保额/档次：</span>
                                                                                            {
                                                                                                key.rank ? <select
                                                                                                        className="planSelect">{this.rankData(key)}</select> :
                                                                                                    <span
                                                                                                        className="addition">{key.amount}元</span>

                                                                                            }
                                                                                        </p>
                                                                                        <p>&nbsp;<span>保险期间：</span>
                                                                                            <select
                                                                                                className="planSelect">
                                                                                                {
                                                                                                    this.insurList(key)
                                                                                                }
                                                                                            </select>
                                                                                        </p>
                                                                                        {
                                                                                            this.premiumSSs(key, index + 1, i)
                                                                                        }
                                                                                        {
                                                                                            this.premiumSS(key, index + 1, i)
                                                                                        }
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        )
                                                                    }
                                                                }
                                                            }) : ''
                                                        }

                                                    </div>

                                                </div>
                                            )
                                        }
                                    })

                                }
                                {
                                    localStorage.type != '20' && <div className="insure_plan">
                                        <p className="plan_con" style={{marginTop: '15px'}}>
                                            <a href="javascript:;" onClick={this.addProduct.bind(this)}>新增计划</a>
                                        </p>
                                    </div>
                                }
                            </div>
                        }
                        {
                            this.state.addProductState &&
                            <div className="insure_built insure_built_xz" data-type="add" style={{display: 'block'}}>
                                <div className="mask">
                                    <div className="mask_con">
                                        <p className="mask_con_title">提示</p>
                                        <div className="mask_con_main clearfix">
                                            <p className="fl">新建计划：</p>
                                            <ul className="fl">
                                                {
                                                    this.state.productData && this.state.productData.productList.map((prod, index) => {
                                                        return (
                                                            <li>
                                                                <input className="sel_pro" type="radio" name="insur"
                                                                       style={{position: 'relative', top: '2px'}}
                                                                       onClick={this.ProductListClick.bind(this, prod, index)}/>
                                                                <label>{prod.abbrName}</label>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                        <div className="mask_con_btn">
                                            <p className="clearfix">
                                                <a href="javascript:;" className="fl btn-admit"
                                                   onClick={this.addproductBth.bind(this, 1)}>确定</a>
                                                <a href="javascript:;" className="fl btn-cancel"
                                                   onClick={this.addproductBth.bind(this, 2)}>取消</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            this.state.customerState &&
                            <div className="insure_built insure_built_yj" style={{display: 'block'}}>
                                <div className="mask">
                                    <div className="mask_con">
                                        <p className="mask_con_title">客户列表</p>
                                        <div className="mask_con_main contact">
                                            <table className="con_main_table">
                                                <tbody>
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
                                                    this.state.userInfo.length != 0 && this.state.userInfo.map((prod) => {
                                                        return (
                                                            <tr>
                                                                <td><p>{prod.name}</p></td>
                                                                <td><p>{prod.genderCode == '0' ? '男' : '女'}</p></td>
                                                                <td><p>{prod.birthday}</p></td>
                                                                <td><p><input type="radio" name="choice"
                                                                              onClick={this.UserChoice.bind(this, prod)}/><span>选择</span>
                                                                </p></td>
                                                            </tr>
                                                        )
                                                    })
                                                }

                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="mask_con_btn">
                                            <p className="clearfix">
                                                <a href="javascript:;" className="fl btn-admit"
                                                   onClick={this.UserInfo.bind(this, 0)}>确定</a>
                                                <a href="javascript:;" className="fl btn-cancel"
                                                   onClick={this.UserInfo.bind(this, 1)}>取消</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        <p className="product_next mb15" onClick={this.nextBth.bind(this)}>
                            <a href="javascript:;">下一步</a>
                        </p>
                    </div>
                }

                {/*交叉销售*/}
                {
                    this.state.Cross && <div className="cross_selling">
                        <p className="title">交叉销售信息录入</p>
                        <ul className="cross_selling_list">
                            <li className="clearfix">
                                <p className="fl name">交叉销售类型：</p>
                                <div className="fl">
                                    <select className="sales_type" onChange={this.salesType.bind(this)}>
                                        <option value="-1">请选择</option>
                                        <option value="01" checked="checked">相互代理</option>
                                        <option value="02">联合展业</option>
                                        <option value="13">互动部</option>
                                        <option value="03">渠道共享</option>
                                        <option value="14">农网共建</option>
                                    </select>
                                </div>
                            </li>
                            <li className="clearfix">
                                <p className="fl">交叉销售渠道：</p>
                                <div className="fl">
                                    <input className="channel" value={this.state.crossData.channel} type="text" disabled
                                           style={{background: '#CCCCCC'}}/>
                                </div>
                            </li>
                            <li className="clearfix">
                                <p className="fl">财险/寿险机构代码：</p>
                                <div className="fl">
                                    <input className="mechanism_code" type="text" disabled
                                           style={{background: '#CCCCCC'}} value={this.state.crossData.mechanism_code}/>
                                </div>
                            </li>
                            <li className="clearfix">
                                <p className="fl">财险/寿险机构名称：</p>
                                <div className="fl" style={{width: '50%'}}>
                                    <span className="mechanism_name fl">{this.state.crossData.mechanism_name}</span>
                                </div>
                            </li>
                            <li className="clearfix">
                                <p className="fl">财险/寿险人员代码：</p>
                                <div className="fl">
                                    <input className="staff_code" type="text" disabled style={{background: '#CCCCCC'}}
                                           value={this.state.crossData.staff_code}/>
                                </div>
                            </li>
                            <li className="clearfix">
                                <p className="fl">财险/寿险人员名称：</p>
                                <div className="fl">
                                    <input className="staff_name" type="text" disabled style={{background: '#CCCCCC'}}
                                           value={this.state.crossData.staff_name}/>
                                </div>
                            </li>
                            <li className="clearfix">
                                <p className="fl">财险/寿险人员身份证号码：</p>
                                <div className="fl">
                                    <input className="staff_id" type="text" disabled style={{background: '#CCCCCC'}}
                                           value={this.state.crossData.staff_id}/>
                                </div>
                            </li>
                            <li className="clearfix">
                                <p className="fl">代理机构：</p>
                                <div className="fl">
                                    {
                                        this.state.crossSaleDataState && this.state.crossSaleData &&
                                        <select className="sales_type agency_list agency" id="dailijigou"
                                                onChange={this.agency.bind(this)}>
                                            <option value="-1">请选择</option>
                                            {
                                                this.crossSaleDataValue(this.state.crossSaleData)
                                            }
                                        </select>
                                    }
                                    {
                                        !this.state.crossSaleDataState &&
                                        <input className="agency" type="text" style={{border: '1px solid #ccc'}}
                                               value={this.state.crossData.agency} onChange={this.agency.bind(this)}/>
                                    }


                                </div>
                            </li>
                            <li className="clearfix">
                                <p className="fl">代理销售业务员编码：</p>
                                <div className="fl">
                                    <input className="salesman_coding" type="text" style={{border: '1px solid #ccc'}}
                                           onChange={this.salesmanCode.bind(this)}/>
                                </div>
                            </li>
                            <li className="clearfix">
                                <p className="fl">代理销售业务员姓名：</p>
                                <div className="fl">
                                    <input className="salesman_name" type="text" style={{background: '#CCCCCC'}}/>
                                </div>
                            </li>
                        </ul>
                        <div className="clearfix" style={{width: '100%', textAlign: 'center'}}>
                            <a href="javascript:;" className="btn btn_prev"
                               onClick={this.crossSelling.bind(this, 'prev')}>上一步</a>
                            <a href="javascript:;" className="btn btn_next"
                               onClick={this.crossSelling.bind(this, 'next')}>下一步</a>
                        </div>
                    </div>
                }
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

        );
    }
}

ReactDOM.render(
    <ClassProductData/>,
    document.getElementById('ProductData')
);