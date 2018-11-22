    class Customer extends React.PureComponent {
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
                CustomerPageSize: '10000'
            }
        }
        componentWillMount() {
            this.setState({
                TIME_OPT: this.initTime(),
                ApplicantOccupCode: occop_data,
            })
            let url = this.state.baseUrl
            let that = this
            piccAjax(url + '/nationalityaction', {}, data => {
                if (data && data.ReturnMessage == '查询成功') {
                    that.setState({
                        nationality: data.data1, //被保人国籍
                        Address: Varcity.data,
                        loading: false
                    }, () => {
                        $('#loading').hide()
                    })
                }
            }, '', '', false)
            piccAjax(this.state.baseUrl + '/queryCustomer', {
                "login_Account": localStorage.usercode,
                "customer_id": '',
                "pageNum": this.state.CustomerPage,
                "pageSize": this.state.CustomerPageSize
            }, data => {
                if (data.status) {
                    that.setState({
                        CustomerList: data.data,
                        searchList: data.data,
                        CustomerState: true,
                    })
                } else {
                    alert('查询客户列表失败！')
                }
            })
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
        AddressSee(value) {
            let codeName = ''
            this.state.Address.map(prod => {
                if (value == prod.addressCode) {
                    codeName = prod.addressName
                }
            })
            return codeName
        }
        //地区下拉
        Addresss(data, value) {
            if (data) {
                if (value == 1) {
                    data.map(res => {
                        if (res.addressCode == this.state.CustomerData.provinceCode && res.type == 2) {
                            this.setState({
                                cityID : res.addressCode
                            })
                        } else if (res.addressCode == this.state.CustomerData.cityCode && res.type == 3) {
                            this.setState({
                                areaID: res.addressCode
                            })
                        }

                    })
                    return data.map(prod => {
                        if (prod.type == 1) {
                            return (
                                <option value={prod.addressCode}>{prod.addressName}</option>
                            )
                        }
                    })
                } else if (value == 2) {
                    
                    
                } else {
                    let cityPid = ''
                    return data.map(prod=>{
                        if (this.state.CustomerData.cityCode && prod.pid == this.state.CustomerData.cityCode) {
                            return (
                                <option value={prod.addressCode}>{prod.addressName}</option>
                            )
                        }
                    })
                }
            }
        }
        cityAddresss(data) {
            let cityCode = ''
            return data.map(Json => {
                if (this.state.CustomerData.provinceCode && Json.pid == this.state.CustomerData.provinceCode && Json.type == 2) {
                    
                    return ( <option value = {Json.addressCode}> {Json.addressName} </option>
                    )
                }
            })
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
            if (value == '1') {
                $('.dataTime').mobiscroll($.extend(TIME_OPT['date'], TIME_OPT['default'])).end();
            } else {
                $('.dataTime').mobiscroll($.extend(TIME_OPT['date'], TIME_OPT['default'])).end();
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
        //监听搜索条件变化
        searchName() {
            let e = window.event || arguments[0];
            let that = this
            this.setState({
                searchName: e.target.value
            }, () => {
                let searchName = this.state.searchName
                let searchedArr = []
                if (searchName !== '') {
                    this.state.searchList.map(prod => {
                        if ((prod.name).match(searchName)) {
                            searchedArr.push(prod)
                        }
                    })
                    this.setState({
                        CustomerList: searchedArr
                    })
                } else {
                    this.setState({
                        CustomerList: this.state.searchList
                    }, () => {
                        piccAjax(this.state.baseUrl + '/queryCustomer', {
                            "login_Account": localStorage.usercode,
                            "customer_id": '',
                            "pageNum": this.state.CustomerPage,
                            "pageSize": this.state.CustomerPageSize
                        }, data => {
                            if (data.status) {
                                that.setState({
                                    CustomerList: data.data,
                                    searchList: data.data,
                                    CustomerState: true,
                                })
                            } else {
                                alert('查询客户列表失败！')
                            }
                        })
                    })

                }
            })
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
            this.setState({
                choseOccup: e.target.value
            }, () => {

                Object.keys(ApplicantOccupCode).map(prod => {
                    if (e.target.value == prod) {
                        occup_LittleArr = ApplicantOccupCode[prod]
                    }
                })
                this.setState({
                    occup_LittleState: true,
                    ApplicantData: {
                        ...this.state.ApplicantData,
                        occup_LittleArr: occup_LittleArr,
                        occup_BigCode: e.target.value,
                        occup_BigName: ApplicantOccupCode[e.target.value].des
                    }
                }, () => {})
            })

        }
        //职业大类修改
        EditoccupBig() {
            let e = window.event || arguments[0];
            
            let ApplicantData = this.state.ApplicantData
            let ApplicantOccupCode = this.state.ApplicantOccupCode
            let occup_LittleArr = ''
            this.setState({
                EditChoseOccup: e.target.value
            }, () => {
                console.log(this.state.EditChoseOccup, 'EditChoseOccup')
                Object.keys(ApplicantOccupCode).map(prod => {
                    if (this.state.EditChoseOccup == prod) {
                        occup_LittleArr = ApplicantOccupCode[prod]
                    }
                })
                this.setState({
                    CustomerData: {
                        ...this.state.CustomerData,
                        EfitOccup_LittleArr: occup_LittleArr,
                        occup_BigCode: this.state.EditChoseOccup,
                        occup_SmallCode:'',
                        occup_LevelCode:''
                    }
                }, () => {
                    console.log(this.state.CustomerData.EfitOccup_LittleArr, 'EfitOccup_LittleArr')
                    console.log(this.state.CustomerData.occup_BigCode, 'occup_BigCode')
                })
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
                    occup_LevelCodeAddresss: level,
                    occupationName: occop_data[this.state.choseOccup].sub[e.target.value].des
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
            console.log(provinceID,'provinceID')
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
            this.state.Address.map(Json => {
                if (e.target.value == Json.pid && Json.type == 2) {
                    cityJson.push(Json)
                }
            })
            console.log(cityJson,'cityJsoncityJson')
            this.setState({
                cityID:e.target.value,
                CustomerData: {
                    ...this.state.CustomerData,
                    provinceCode: e.target.value,
                    cityJson: cityJson,
                    cityState: true,
                    countyName: null,
                    countyJson: [],
                    cityCode: -1,
                    areaCode:''
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
            console.log(countyJson,'countyJson')
            that.setState({
                CustomerData: {
                    ...this.state.CustomerData,
                    cityCode: e.target.value,
                    countyJson: countyJson,
                    areaCode:''
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
                        EfitOccup_LittleArr: occup_LittleArr,
                        occupationCode: data.occup_SmallCode,
                        
                        occup_LevelCode: level,
                    }
                }, () => {
                    console.log(this.state.CustomerData.EfitOccup_LittleArr, 'EfitOccup_LittleArr')
                    //添加已建地区信息
                    let provinceID = ''
                    let cityJson = []
                    this.state.Address.map(res => {
                        if (res.addressCode == data.provinceCode) {
                            provinceID = res.addressCode
                            this.state.Address.map(Json => {
                                if (res.id == Json.pid) {
                                    cityJson.push(Json)
                                }
                            })
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
                        this.state.Address.map((key) => {
                            if (key.addressCode == data.cityCode) {
                                code = key.id
                            }
                        })
                        this.state.Address.map(Json => {
                            if (Json.pid == code) {
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
            this.setState({
                loading:true
            })
            let that = this
            let CustomerData = this.state.CustomerData
            
            piccAjax(this.state.baseUrl + '/AddCustomerServlet', {
                "login_Account": localStorage.usercode,
                "name": this.valueCome(CustomerData, 'name'),
                "genderCode": this.valueCome(CustomerData, 'genderCode'),
                "birthday": $('.from_time3').val(),
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
                "id_Start_Date": $('.from_time2').val(),
                "id_End_Date": $('.from_time').val(),
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
                    this.setState({
                        loading:false
                    })
                    if (data.status) {
                        that.setState({
                            CustomerList: data.data,
                            CustomerLook: false,
                            CustomerData: ''
                        })
                    } else {
                        alert('查询客户列表失败！')
                    }
                })
            })
            
        }
        //删除客户弹框
        CustomerDel(prod) {
            this.setState({
                delState: true,
                delData: prod,
                // loading:true
            })

        }
        //删除客户信息
        funDel(value) {
            let delData = this.state.delData
            if (value == '1') {
                let that = this
                this.setState({
                    loading:true
                },()=>{
                    piccAjax(this.state.baseUrl + '/DelCustomerServlet', {
                        "customer_id": delData.customer_id
                    }, data => {
                        if (data.status) {
                            piccAjax(this.state.baseUrl + '/queryCustomer', {
                                "login_Account": localStorage.usercode,
                                "customer_id": '',
                                "pageNum": this.state.CustomerPage,
                                "pageSize": this.state.CustomerPageSize
                            }, data => {
                                if (data.status) {
                                    that.setState({
                                        CustomerList: data.data,
                                        CustomerState: true,
                                        delState: false,
                                        loading:false
                                    }, () => {
                                        // alert('删除客户信息成功！')
                                    })
                                }
                            })
                        } else {
                            alert('删除客户信息失败！')
                        }
                    })
                })
                
            } else {
                this.setState({
                    delState: false
                })
            }
        }
        //编辑客户信息
        editCustomer(prod) {
            let occup_LittleArr = ''
            let ApplicantOccupCode = this.state.ApplicantOccupCode
            this.setState({
                CustomerLook: true,
                CustomerData: prod
            }, () => {
                let TIME_OPT = this.state.TIME_OPT
                $('.dataTime').mobiscroll($.extend(TIME_OPT['date'], TIME_OPT['default'])).end();
                Object.keys(ApplicantOccupCode).map(prod => {
                    if (this.state.CustomerData.occup_BigCode == prod) {
                        occup_LittleArr = ApplicantOccupCode[prod]
                    }
                })
                this.setState({
                    occup_LittleState: true,
                    CustomerData: {
                        ...this.state.CustomerData,
                        occup_LittleArr: occup_LittleArr,
                        occup_SmallCode: prod.occup_SmallCode,
                        EfitOccup_LittleArr: occup_LittleArr
                    }
                }, () => {})
            })
        }
        //查看客户信息
        seeCustomer(prod) {
            this.setState({
                seeCustomerData: prod,
                seeCustomer: true
            })
        }
        seeCustomerBth() {
            this.setState({
                seeCustomer: false
            })
        }
        //新建客户
        AddCustomer() {
            this.setState({
                CustomerLook: true
            })
        }
        //身份证校验
         isCardID(sId){
            var iSum=0 ;
            var info="" ;
            if(!/^\d{17}(\d|x)$/i.test(sId)) return false
            sId=sId.replace(/x$/i,"a");
            if(aCity[parseInt(sId.substr(0,2))]==null) return false
            sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
            var d=new Date(sBirthday.replace(/-/g,"/")) ;
            if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))return false;
            for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
            if(iSum%11!=1) return false;
            // aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
            return true;
        }
        render() {
            let ApplicantData = this.state.ApplicantData ? this.state.ApplicantData : ''
            return (
                <div>
                            <div>
                                <ul className="policycenter">
                                    <li className="clearfix">
                                        <p className="fl">客户姓名：</p>
                                        <div className="fl">
                                            <input type="text" className="oddnum" onChange={this.searchName.bind(this)}/>
                                        </div>
                                    </li>
                                    {/*<li className="clearfix menubtn">
                                        <p className="fr">
                                            <a href="javascript:;" onClick={this.search.bind(this,'1')}>搜索</a>
                                            <a href="javascript:;" onClick={this.search.bind(this,'2')}>重置</a>
                                            {<a href="javascript:;" onClick={this.AddCustomer.bind(this)}>新建</a>}
                                        </p>
                                    </li>*/}
                                </ul>
                                <table className="addclient_preview_table policy_table mb15">
                                    <tr>
                                        <th>
                                            <p>姓名</p>
                                        </th>
                                        <th>
                                            <p>出生日期</p>
                                        </th>
                                        <th>
                                            <p>性别</p>
                                        </th>
                                        <th>
                                            <p>操作</p>
                                        </th>
                                    </tr>
                                    {
                                        this.state.CustomerList && this.state.CustomerList.map((prod,index)=>{
                                            return(
                                                <tr className="customerinfo">
                                                    <td>
                                                        <p>{prod.name}</p>
                                                    </td>
                                                    <td>
                                                        <p>{prod.birthday}</p>
                                                    </td>
                                                    <td>
                                                        <p>{prod.genderCode == '0'?'男':'女'}</p>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:;" className="proposal_look" onClick={this.seeCustomer.bind(this,prod)}><img
                                                            src="images/icon_lookup.png" alt=""/></a>
                                                        <a href="javascript:;" className="proposal_xiugai" onClick={this.editCustomer.bind(this,prod)}><img
                                                            src="images/icon_modify.png" alt=""/></a>
                                                        <a href="javascript:;" className="proposal_dalete" onClick={this.CustomerDel.bind(this,prod)}><img
                                                            src="images/icon_delete.png" alt="" /></a>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                        
                                </table>
                            </div>
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
                {/*编辑客户*/}
                {
                    this.state.CustomerLook && <div className="loading clearfix" style={{display: 'block',zIndex:'100'}}>
                        <div className="mask" style={{top: '10%',height: '50%'}}>
                            <div className="mask_con mask_co2" style={{height: '100%'}}>
                                <div className="mask_con_main insuredinfo" style={{height: '100%'}}>
                                    <ul className="insuredinfo_con_list clearfix">
                                        <li className="clearfix">
                                            <p>姓名：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name pname fl" onChange={this.EditInformInformation.bind(this,'name')} value={this.state.CustomerData&&this.state.CustomerData.name}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>性别：</p>
                                            <div className="sex">
                                                <input style={{display:'inline-block'}} type="checkbox" value="1" name="sex" onClick={this.EditChoiceSex.bind(this,'0')} className="male" checked={this.state.CustomerData&&this.state.CustomerData.genderCode=='0'?true:false}/>&nbsp;
                                                <label style={{background:'none'}}>男</label>&nbsp;&nbsp;&nbsp;
                                                <input style={{display:'inline-block'}} type="checkbox" value="2" className="female" onClick={this.EditChoiceSex.bind(this,'1')} name="sex" checked={this.state.CustomerData&&this.state.CustomerData.genderCode=='1'?true:false}/>&nbsp;
                                                <label style={{background:'none'}}>女</label>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>国籍：</p>
                                            <div className="clearfix nationality">
                                                <select className="nationality_list" value={this.state.CustomerData&&this.state.CustomerData.nationality_ID} onChange={this.EditInformInformation.bind(this,'nationality_ID')}>
                                                    <option value="ML">中国大陆</option>
                                                    <option value="HK">港澳台</option>
                                                    <option value="OS">海外</option>
                                                </select>
                                                {
                                                    this.state.CustomerDat&&this.state.CustomerData.nationality_ID2 && <select>
                                                        <option value="CHN">中国</option>
                                                    </select>
                                                }
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>出生日期：</p>
                                            <div className="clearfix datatime">
                                                <input type="text" className="name ptime fl from_time3 dataTime" onClick={this.cardTime.bind(this,'2')} defaultValue={this.state.CustomerData&&this.state.CustomerData.birthday}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>婚姻状况：</p>
                                            <div className="clearfix marriage">
                                                <select className="fl marriage_list" value={this.state.CustomerData&&this.state.CustomerData.marriage} onChange={this.EditInformInformation.bind(this,'marriage')}>
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
                                                <select className="fl paper_list" value={this.state.CustomerData&&this.state.CustomerData.id_Type2} onChange={this.EditInformInformation.bind(this,'id_Type2')}>
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
                                                    this.state.CustomerDat&&this.state.CustomerData.id_Type2=='7' && <input type="text" className="fl" disabled />
                                                }
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>证件号码：</p>
                                            <div>
                                                <input type="text" className="name paper_code fl" value={this.state.CustomerData&&this.state.CustomerData.card_num} onChange={this.EditInformInformation.bind(this,'card_num')}/>
                                                <i>*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>证件起日期：</p>
                                            <div className="datatime clearfix">
                                                <p className="fl" style={{width:'60%', marginRight: '10px'}}>
                                                    <input style={{width:'100%'}} type="text" onClick={this.cardTime.bind(this,'2')}  className="name  from_time2  longterm fl dataTime"  defaultValue={this.state.CustomerData&&this.state.CustomerData.id_Start_Date}/>
                                                </p>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>证件有效期：</p>
                                            <div className="datatime clearfix">
                                                <input type="text" className="name from_time ptime fl dataTime" onClick={this.cardTime.bind(this,'2')}   defaultValue={this.state.CustomerData&&this.state.CustomerData.id_End_Date}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>工作单位：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name work_unit fl" value={this.state.CustomerData&&this.state.CustomerData.enterprise}  onChange={this.EditInformInformation.bind(this,'enterprise')}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>职务：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name duty fl" value={this.state.CustomerData&&this.state.CustomerData.duty} onChange={this.EditInformInformation.bind(this,'duty')}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>职业大类：</p>
                                            <div className="clearfix occupation">
                                                <select className="fl occupation_big" defaultValue={this.state.CustomerData&&this.state.CustomerData.occup_BigCode} onChange={this.EditoccupBig.bind(this)}>
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
                                                <select className="fl occupation_small" value={this.state.CustomerData&&this.state.CustomerData.occup_SmallCode} onChange={this.EditOccupLittle.bind(this)}>
                                                    <option value="-1">请选择类</option>
                                                    {
                                                        (this.state.ApplicantOccupCode && this.state.CustomerData.EfitOccup_LittleArr) && Object.keys(this.state.CustomerData.EfitOccup_LittleArr.sub).map(prod => {
                                                            let selectValue = this.state.CustomerData.EfitOccup_LittleArr.sub
                                                            return (
                                                                <option value={prod}
                                                                >{selectValue[prod].des}</option>
                                                            )
                                                        })
                                                    }
                                                    {
                                                    
                                                }
                                                </select>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>职业代码：</p>
                                            <div className="clearfix">
                                                <input type = "text"
                                                className = "name occupation_code ccc fl"
                                                disabled value = {
                                                    this.state.CustomerData && this.state.CustomerData.occup_SmallCode
                                                }
                                                />
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>类别：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name occupation_level ccc fl" disabled value={this.state.CustomerData&&this.state.CustomerData.occup_LevelCode}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>年收入(万元)：</p>
                                            <div className="clearfix">
                                                <input type="number" className="name income fl"  value={this.state.CustomerData&&this.state.CustomerData.salary} onChange={this.EditInformInformation.bind(this,'salary')}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>联系地址：</p>
                                            <div className="clearfix occupation mb15">
                                                <p className="clearfix">
                                                    <select className="sheng_list fl"
                                                            value={this.state.CustomerData&&this.state.CustomerData.provinceCode}
                                                            onChange={this.provinces.bind(this)}>
                                                        <option value="-1">省（直辖市）</option>
                                                        {this.Addresss(this.state.Address,1)}
                                                    </select>
                                                    <i className="fl">*</i>
                                                </p>
                                                <p className="clearfix">
                                                    <select className="shi_list fl"
                                                         value={this.state.CustomerData&&this.state.CustomerData.cityCode}
                                                            onChange={this.citys.bind(this)}>

                                                            {this.state.CustomerData && <option value='-1'>请选择</option>}
                                                            {
                                                                this.state.CustomerData && this.cityAddresss(this.state.Address)
                                                            }
                                                    </select>
                                                    <i className="fl">*</i>
                                                </p>
                                                <p className="clearfix">
                                                    <select name="s_county" className="qu_list fl"
                                                            value={this.state.CustomerData&&this.state.CustomerData.areaCode}
                                                            onChange={this.countys.bind(this)}>
                                                            {this.state.CustomerData&& <option value='-1'>请选择</option>}
                                                            {
                                                                this.state.CustomerData  && this.Addresss(this.state.Address, 3)
                                                            }
                                                    </select>
                                                    <i className="fl">*</i>
                                                </p>
                                            </div>
                                            <p>乡镇（街道）：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name street fl" value={this.state.CustomerData&&this.state.CustomerData.street} onChange={this.EditInformInformation.bind(this,'street')}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>村(社区)：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name community fl" value={this.state.CustomerData&&this.state.CustomerData&&this.state.CustomerData.community} onChange={this.EditInformInformation.bind(this,'community')}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>邮政编码：</p>
                                            <div className="clearfix">
                                                <input type="number" className="name postalcode fl" value={this.state.CustomerData&&this.state.CustomerData.zipcode} onChange={this.EditInformInformation.bind(this,'zipcode')}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>电话：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name phone fl"  value={this.state.CustomerData&&this.state.CustomerData.mobile}  onChange={this.EditInformInformation.bind(this,'mobile')}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>手机：</p>
                                            <div className="clearfix">
                                                <input type="number" className="name mobile fl"  value={this.state.CustomerData&&this.state.CustomerData.phone} onChange={this.EditInformInformation.bind(this,'phone')}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>邮箱：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name email fl" value={this.state.CustomerData&&this.state.CustomerData.email} onChange={this.EditInformInformation.bind(this,'email')}/>
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
                {/*查看客户*/}
                {
                    this.state.seeCustomer && <div className="loading clearfix" style={{display: 'block'}}>
                        <div className="mask" style={{top: '10%',height: '50%'}}>
                            <div className="mask_con mask_co2" style={{height: '100%'}}>
                                <div className="mask_con_main insuredinfo" style={{height: '100%'}}>
                                    <ul className="insuredinfo_con_list clearfix">
                                        <li className="clearfix">
                                            <p>姓名：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name pname fl" value={this.state.seeCustomerData.name} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>性别：</p>
                                            <div className="sex">
                                                <input style={{display:'block !important'}} type="checkbox" value="1" name="sex" disabled onClick={this.EditChoiceSex.bind(this,'0')} className="male" checked={this.state.seeCustomerData.genderCode!='0'?true:false}/>&nbsp;
                                                <label style={{background:'none'}}>男</label>&nbsp;&nbsp;&nbsp;
                                                <input style={{display:'block !important'}} type="checkbox" value="2" className="female" disabled onClick={this.EditChoiceSex.bind(this,'1')} name="sex" checked={this.state.seeCustomerData.genderCode=='0'?true:false}/>&nbsp;
                                                <label style={{background:'none'}}>女</label>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>国籍：</p>
                                            <div className="clearfix nationality">
                                                <select className="nationality_list" value={this.state.seeCustomerData.nationality_ID} onChange={this.EditInformInformation.bind(this,'nationality_ID')} disabled style={{background: 'rgb(245, 245, 245)'}}>
                                                    <option value="ML">中国大陆</option>
                                                    <option value="HK">港澳台</option>
                                                    <option value="OS">海外</option>
                                                </select>
                                                {
                                                    this.state.seeCustomerData.nationality_ID2 && <select disabled>
                                                        <option value="CHN">中国</option>
                                                    </select>
                                                }
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>出生日期：</p>
                                            <div className="clearfix datatime">
                                                <input type="text" className="name ptime fl"  defaultValue={this.state.seeCustomerData.birthday} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>婚姻状况：</p>
                                            <div className="clearfix marriage">
                                                <select className="fl marriage_list" value={this.state.seeCustomerData.marriage} onChange={this.EditInformInformation.bind(this,'marriage')} disabled style={{background: 'rgb(245, 245, 245)'}}>
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
                                                <select className="fl paper_list" value={this.state.seeCustomerData.id_Type2} onChange={this.EditInformInformation.bind(this,'id_Type2')} disabled style={{background: 'rgb(245, 245, 245)'}}>
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
                                                    this.state.seeCustomerData.id_Type2=='7' && <input type="text" className="fl" disabled />
                                                }
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>证件号码：</p>
                                            <div>
                                                <input type="text" className="name paper_code fl" value={this.state.seeCustomerData.card_num} onChange={this.EditInformInformation.bind(this,'card_num')} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                <i>*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>证件起日期：</p>
                                            <div className="datatime clearfix">
                                                <p className="fl" style={{width:'60%', marginRight: '10px'}}>
                                                    <input style={{width:'100%'}} type="text" className="name from_time from_time2  longterm fl"  defaultValue={this.state.seeCustomerData.id_Start_Date} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                </p>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>证件有效期：</p>
                                            <div className="datatime clearfix">
                                                <input type="text" className="name from_time ptime fl"  defaultValue={this.state.seeCustomerData.id_End_Date} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>工作单位：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name work_unit fl" value={this.state.seeCustomerData.enterprise}  onChange={this.EditInformInformation.bind(this,'enterprise')} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>职务：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name duty fl" value={this.state.seeCustomerData.duty} onChange={this.EditInformInformation.bind(this,'duty')} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>职业大类：</p>
                                            <div className="clearfix occupation">
                                                <input type="text" className="name duty fl" value={this.state.ApplicantOccupCode?this.state.ApplicantOccupCode[this.state.seeCustomerData.occup_BigCode].des:null} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>职业小类：</p>
                                            <div className="clearfix occupation">
                                                <input type="text" className="name occupation_code ccc fl" value={this.state.ApplicantOccupCode?this.state.ApplicantOccupCode[this.state.seeCustomerData.occup_BigCode].sub[this.state.seeCustomerData.occup_SmallCode].des:null} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>职业代码：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name occupation_code ccc fl" value={this.state.seeCustomerData.occup_Code} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>类别：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name occupation_level ccc fl" value={this.state.seeCustomerData.occup_LevelCode} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>年收入(万元)：</p>
                                            <div className="clearfix">
                                                <input type="number" className="name income fl"  value={this.state.seeCustomerData.salary} onChange={this.EditInformInformation.bind(this,'salary')} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>联系地址：</p>
                                            <div className="clearfix occupation mb15">
                                                <p className="clearfix">
                                                    
                                                    <input type="text" className="name occupation_level ccc fl" value={this.AddressSee(this.state.seeCustomerData.provinceCode)} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                    <i className="fl">*</i>
                                                </p>
                                                <p className="clearfix">
                                                    <input type="text" className="name occupation_level ccc fl" value={this.AddressSee(this.state.seeCustomerData.cityCode)} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                    <i className="fl">*</i>
                                                </p>
                                                <p className="clearfix">
                                                    
                                                    <input type="text" className="name occupation_level ccc fl" value={this.AddressSee(this.state.seeCustomerData.areaCode)} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                    <i className="fl">*</i>
                                                </p>
                                            </div>
                                            <p>乡镇（街道）：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name street fl" value={this.state.seeCustomerData.street} onChange={this.EditInformInformation.bind(this,'street')} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>村(社区)：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name community fl" value={this.state.seeCustomerData.community} onChange={this.EditInformInformation.bind(this,'community')} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>邮政编码：</p>
                                            <div className="clearfix">
                                                <input type="number" className="name postalcode fl" value={this.state.seeCustomerData.zipcode} onChange={this.EditInformInformation.bind(this,'zipcode')} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>电话：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name phone fl"  value={this.state.seeCustomerData.mobile}  onChange={this.EditInformInformation.bind(this,'phone')} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>手机：</p>
                                            <div className="clearfix">
                                                <input type="number" className="name mobile fl"  value={this.state.seeCustomerData.phone} onChange={this.EditInformInformation.bind(this,'mobile')} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <p>邮箱：</p>
                                            <div className="clearfix">
                                                <input type="text" className="name email fl" value={this.state.seeCustomerData.email} onChange={this.EditInformInformation.bind(this,'mobile')} disabled style={{background: 'rgb(245, 245, 245)'}}/>
                                                <i className="fl">*</i>
                                            </div>
                                        </li>
                                    </ul>
                                    <div className="mask_con_btn mask_con_btn2">
                                        <p className="clearfix" onClick={this.seeCustomerBth.bind(this)}>
                                            <a href="javascript:;">确定</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    this.state.delState && <div className="insure_built insure_built_lb" style={{display:'block'}}>
                        <div className="mask">
                            <div className="mask_con">
                                <p className="mask_con_title">提示</p>
                                <div className="mask_con_main">
                                    是否删除{this.state.delData.name}的信息?
                                </div>
                                <div className="mask_con_btn">
                                    <p className="clearfix"><a href="javascript:;" className="fl" onClick={this.funDel.bind(this,'1')}>确定</a><a href="javascript:;" className="fl"onClick={this.funDel.bind(this,'2')}>取消</a></p>
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
        <Customer/>,
        document.getElementById('Customer')
    );