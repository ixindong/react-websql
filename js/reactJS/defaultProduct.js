//产品列表、选择产品获取产品信息
var ClassProductList = React.createClass({
    getInitialState: function () {
        return {
            productList: [],
            planID: [],
            product: '',
            addProductList: [],
            choiceProduct: [],
            productData: [],
            mainCode: ''
        };
    },
    NewcreateProdDetail(prod) {
        let rebuildFactors = {};
        let aaa = ''
        for (let i in prod.value) {
            rebuildFactors[i] = prod.value[i]
        }

        let detail = {
            "parentId": prod.parentproid ? prod.parentproid : prod.parentProId,

            "productId": prod.productid,
            "factors": rebuildFactors
        }
        if (prod.ismain == true || prod.productid == '00340602') { //主险不传parentId
            delete detail.parentId;
        }
        return detail;

    },

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
        let parentIdData = ''
        if(prod.parentproid){
            parentIdData = prod.parentproid
        }else if(prod.parentProId){
            parentIdData = prod.parentProId
        }else{
            parentIdData = this.state.mainCode
        }
        let detail = {
            "parentId": parentIdData,
            "productId": prod.productid,
            "factors": rebuildFactors
        }
        if (prod.ismain == true || prod.productid == '00340602') { //主险不传parentId
            delete detail.parentId;
        }
        return detail;

    },
    choiceAddProduct(item) {
        let that = this
        if(!item.checked){
            piccAjax('/plan/view_clauses.json', {
                "productId": item.code,
                "index": -1,
                "planId": this.state.planID[0]

            }, viewClausesData => {
                let viewAddProduct = {}

                let addProductListData = []
                viewClausesData.content.map((prod) => {
                    if (prod.ismain == false && prod.code != '00340602') {
                        viewAddProduct = {
                            code: prod.productid,
                            abbrName: prod.name,
                            check: true
                        }
                        addProductListData.push(viewAddProduct)
                    }else if(prod.code == '00340602'){
                        viewAddProduct = {
                            code: prod.productid,
                            abbrName: prod.name,
                            check: true
                        }
                        addProductListData.push(viewAddProduct)
                    }

                })
                let addProductList = that.state.addProductList
                addProductList.map(prod=>{
                    if(prod.code == item.code){
                        prod.checked = !prod.checked
                    }
                })
                that.setState({
                    addProductList:addProductList
                })
                //构造rebuild请求参数
                let detailArr = [];
                viewClausesData.content.map((prod) => {
                    detailArr.push(this.createProdDetail(prod));
                })
                this.state.productData[1].productList.map((prod) => {
                    detailArr.push(this.NewcreateProdDetail(prod));
                });
                piccAjax('/plan/rebuild.json', {
                    "planId": this.state.planID[0],
                    "detail": detailArr
                }, rebuildData => {
                    rebuildData.content = viewClausesData.content.map(prod => {
                        let newProd = {};
                        rebuildData.content.product.map((rebuildProd) => {
                            if (prod.productid === rebuildProd.code) {
                                newProd = {...prod, ...rebuildProd}

                            }
                        })
                        return newProd;
                    })
                    let productList = []
                    that.state.productData[1].productList.map(DataJson=>{
                        productList.push(DataJson)
                    })
                    rebuildData.content.map(DataRes=>{
                        productList.push(DataRes)
                    })
                    that.setState({
                        productData: {
                            "1": {
                                "productList": productList
                            }
                        }
                    }, () => {
                        localStorage.productData = JSON.stringify(that.state)
                    })
                })
            })
        }else{
            let addProductList = that.state.addProductList
            let productData = this.state.productData[1].productList
            addProductList.map(prod=>{
                if(prod.code == item.code){
                    prod.checked = !prod.checked
                }
            })
            let newProductData = []
            productData.map(prod=>{
                if(prod.code != item.code){
                   newProductData.push(prod)
                }
            })
            
            that.setState({
                addProductList:addProductList,
                productData:{
                    "1":{
                        productList: newProductData
                    }
                }
            },()=>{
                localStorage.productData = JSON.stringify(that.state)
            })
        }

    },
    //选择主险，查找绑定附加险，并最终组成所有附加险列表
    choiceProduct(item, index, orMain) {
            if(item.code == '00232701'){
                // alert('此豁免险不能单独投保，请到下一页面选择此产品！')
                alert('暂时不可添加豁免险种！')
                localStorage.HMState = true
            }else{
                localStorage.HMState = false
            }
            
            let that = this
        piccAjax('/plan/view_clauses.json', {
            "productId": item.code,
            "index": -1,
            "planId": this.state.planID[0]

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
                "planId": this.state.planID[0],
                "detail": detailArr
            }, rebuildData => {
                rebuildData.content = viewClausesData.content.map(prod => {
                    let newProd = {};
                    rebuildData.content.product.map((rebuildProd) => {
                        if (prod.productid === rebuildProd.code) {
                            newProd = {...prod, ...rebuildProd}

                        }
                    })
                    return newProd;
                })
                that.setState({
                    productData: {
                        "1": {
                            "productList": rebuildData.content
                        }
                    }
                }, () => {
                    localStorage.productData = JSON.stringify(this.state)
                })
            })
            if (orMain == 'main') {
                that.setState({
                    mainCode: item.code
                })
            }
            that.setState({
                // addProductList: addProductListData,
                choiceProduct: addProductListData
            }, () => {
                //查找普通附加险
                piccAjax('/plan/list_clause.json', {
                    "company": "picc",
                    "productId": item.code,
                    "parentIndex": -1

                }, addList => {
                    let oldAddProductListData = addProductListData
                    addList.content.map((prod) => {
                        prod.check = false
                        if(prod.code != '00231401'){
                            oldAddProductListData.push(prod)
                        }
                    })

                    that.setState({
                        product: index,
                        addProductList: oldAddProductListData
                    }, () => {
                    })
                })
            })
        })
        

    },
    componentDidUpdate:(prevProps,prevState)=>{
        localStorage.productData = JSON.stringify(prevState)
    },
    componentDidMount: function () {
        $('#loading').hide()
        //清空遗留产品
        if (localStorage.defaultProduct) {
            localStorage.defaultProduct = ''
        }
        let that = this
        //生成投保计划，获取投保ID（planID）
        piccAjax('/proposal/creates.json', {
            "applicant": {
                "birthday": "1990-01-01",
                "gender": "M",
                "name": "李莉莉"
            },
            "insurants": [
                {
                    "birthday": "2000-05-24",
                    "gender": "M",
                    "occupationCode": "00206",
                    "name": "给加班费",
                    "occup_BigCode": "8",
                    "occup_SmallCode": "14",
                    "occup_LevelCode": "1",
                    "customer_id": "844598",
                    "taxHospital": null,
                    "email": "",
                    "currInsureType": "在线投保"
                }
            ],
            "owner": localStorage.usercode,
            "loginName":'你是谁',
            "platformId": 2,
            "proposalType":"1"
        }, data => {
            that.setState({
                planID: data.content.detail,
                proposalId:data.content.proposalId
            }, () => {
                localStorage.planID = JSON.stringify(this.state.planID)
                localStorage.proposalId = JSON.stringify(this.state.proposalId)
            })

            piccAjax('/plan/list_clause.json', {
                "company": "picc"
            }, res => {
                localStorage.mainProductList = res.content
                that.setState({
                    productList: res.content
                },()=>{
                    let productList = []
                    that.state.productList.map(prod=>{
                        if(prod.code.slice(0,2) == localStorage.type){
                            productList.push(prod)
                        }
                    })
                    that.setState({
                        productList:productList,
                    })
                })
            })
        })
    },

    render: function () {

        return (
            <div>
                {
                    this.state.productList.map((prod, index) => {
                        return (
                            <div>
                                <div className="title" key={prod.code}>
                                    <span>{index + 1}</span>
                                    <span><a href="javascript:;">{prod.name}</a></span>
                                    
                                    <span><input
                                        type="radio"
                                        name="radioName" onClick={this.choiceProduct.bind(this, prod, index, 'main')}/></span>
                                </div>
                                {
                                    this.state.addProductList.length!=0 && <div className="deputy_insurance"
                                         style={{display: this.state.product == index ? 'block' : 'none'}}>
                                        <p><span>{prod.abbrName}</span>(附加险种)</p>
                                        <ul className="clearfix">
                                            {
                                                this.state.addProductList && this.state.addProductList.map((v) => {
                                                    return <li>
                                                        <p className="clearfix">
                                                            <input type="checkbox" id={v.code}
                                                                   title={v.abbrName}
                                                                   checked={v.check == true||v.checked == true ? true:false}
                                                                   disabled={v.check == true ? true:false}
                                                                   onClick={this.choiceAddProduct.bind(this, v)}/>
                                                            <label for="add1_1">{v.abbrName}</label>
                                                        </p>
                                                    </li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                }


                            </div>
                        )
                    })
                }
            </div>
        );
    }
});

ReactDOM.render(
    <ClassProductList/>,
    document.getElementById('productList')
);