//产品列表、选择产品获取产品信息
class Proposal extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            showList: [], //展示列表
            proposalList: [], //建议书列表
            total: 1039,
            pageStart: 0,
            pdfState: false
        }
    }

    componentDidMount() {
        let that = this
        piccAjax('/proposal/list.json', {
            "start": "",
            "end": "",
            "from": this.state.pageStart,
            "number": 10,
            "proposalId": "",
            "owner": localStorage.usercode,
            "platformId": 2,
            "isHideToast": false,
            "proposalType": "1"
        }, data => {
            that.setState({
                showList: data.content.list,
                total: data.content.total
            }, () => {
                piccAjax('/proposal/list.json', {
                    "start": "",
                    "end": "",
                    "from": 0,
                    "number": data.content.total,
                    "proposalId": "",
                    "owner": localStorage.usercode,
                    "platformId": 2,
                    "isHideToast": false,
                    "proposalType": "1"
                }, json => {
                    that.setState({
                        proposalList: json.content.list,
                    }, () => {})
                })
            })
        })

    }
    editPage(pageValue) {
        let that = this
        if (pageValue != 'next') {
            if (this.state.pageStart == 0) {
                alert('已是第一页！')
            } else {
                this.setState({
                    pageStart: this.state.pageStart - 10
                }, () => {
                    piccAjax('/proposal/list.json', {
                        "start": "",
                        "end": "",
                        "from": this.state.pageStart,
                        "number": 10,
                        "proposalId": "",
                        "owner": localStorage.usercode,
                        "platformId": 2,
                        "isHideToast": false,
                        "proposalType": "1"
                    }, data => {
                        that.setState({
                            showList: data.content.list
                        })
                    })
                })
            }
        } else {
            if (this.state.total - (this.state.pageStart * 10) <= 0) {
                alert('已是最后一页！')
            } else {
                this.setState({
                    pageStart: this.state.pageStart + 10
                }, () => {
                    piccAjax('/proposal/list.json', {
                        "start": "",
                        "end": "",
                        "from": this.state.pageStart,
                        "number": 10,
                        "proposalId": "",
                        "owner": localStorage.usercode,
                        "platformId": 2,
                        "isHideToast": false,
                        "proposalType": "1"
                    }, data => {
                        that.setState({
                            showList: data.content.list
                        })
                    })
                })
            }
        }

    }
    editProposal(prod) {
        localStorage.proposalId = prod.id
        localStorage.editType = 'proposal'
        location.href = 'newInsuranceplan.html'
    }
    search() {
        let showList = []
        let that = this
        if (this.state.ProposalName) {
            this.state.proposalList.map(prod => {
                if ((prod.plans[0].insurant.name).match(this.state.ProposalName)) {
                    showList.push(prod)
                }
            })
            if (showList.length == 0) {
                alert('未查找到对应建议书！')
            } else {
                this.setState({
                    showList: showList
                })
            }
        } else {
            piccAjax('/proposal/list.json', {
                "start": "",
                "end": "",
                "from": 0,
                "number": 10,
                "proposalId": "",
                "owner": localStorage.usercode,
                "platformId": 2,
                "isHideToast": false,
                "proposalType": "1"
            }, json => {
                that.setState({
                    showList: json.content.list,
                }, () => {})
            })
        }

    }
    inputProposalName() {
        let e = window.event || arguments[0];
        let value = e.target.value
        this.setState({
            ProposalName: value
        })
    }
    resetProposalName() {
        let that = this
        this.setState({
            ProposalName: '',
            pageStart: 0
        }, () => {
            piccAjax('/proposal/list.json', {
                "start": "",
                "end": "",
                "from": this.state.pageStart,
                "number": 10,
                "proposalId": "",
                "owner": localStorage.usercode,
                "platformId": 2,
                "isHideToast": false,
                "proposalType": "1"
            }, data => {
                that.setState({
                    showList: data.content.list
                })
            })
        })
    }
    mapLoction(arr) {
        let newArr = [];
        arr.forEach((address, i) => {
            let index = -1;
            let alreadyExists = newArr.some((newAddress, j) => {
                if (address.createDate === newAddress.createDate) {
                    index = j;
                    return true;
                }
            });
            if (!alreadyExists) {
                newArr.push({
                    createDate: address.createDate,
                    location: [address.location]
                });
            } else {
                newArr[index].location.push(address.location);
            }
        });
        return newArr;
    };
    seeProposal(prod) {
        let that = this
        this.setState({
            loading:true
        },()=>{
            piccAjax('/proposal/print.json', {
            "proposalId": prod.id,
            "proposalType": '1'
            }, data => {
                piccAjax('/printer/print.json', {
                    "templateCode": "iyb_proposal",
                    "outputType": "pdf",
                    "content": data.content,
                    "proposalType": '1'
                }, json => {

                    that.setState({
                        pdfState: true,
                        pdfSrc: json.content2,
                        pdfStyle: true,
                        loading:false
                    }, () => {
                        
                    })
                })
            })
        })
        
    }
    pdfB() {
        this.setState({
            pdfState: false,
            pdfStyle: false
        })
    }
    render() {
        return (
            <div className="oh">
                <ul className="policycenter">
                    <li className="clearfix"><p className="fl">被保人姓名：</p>
                        <div className="fl"><input type="text" className="oddnum searchName" onChange={this.inputProposalName.bind(this)} value={this.state.ProposalName}/></div>
                    </li>
                    <li className="clearfix menubtn"><p className="fr"><a href="javascript:;" onClick={this.search.bind(this)}>搜索</a> <a
                        href="javascript:;" onClick={this.resetProposalName.bind(this)}>重置</a> <a href="newProductlist.html">新建</a></p></li>
                </ul>
                <table className="addclient_preview_table policy_table mb15">
                    <tbody>
                    <tr>
                        <th width="22%"><p>被保人</p></th>
                        <th width="42%"><p>主险名称</p></th>
                        <th width="34%"><p>操作</p></th>
                    </tr>
                    {
                        this.state.showList && this.state.showList.map(prod => {
                            return (
                                <tr>
                                    <td><p>{prod.plans[0].insurant.name}</p></td>
                                    <td><p>{prod.plans[0].product[0].abbrName}</p></td>
                                    <td><a href="javascript:;" className="proposal_look"
                                           onClick={this.seeProposal.bind(this, prod)}><img
                                        src="images/icon_lookup.png" alt=""/></a>
                                        <a href="javascript:;" className="proposal_xiugai"
                                           onClick={this.editProposal.bind(this, prod)}><img
                                            src="images/icon_modify.png"
                                            alt=""/></a>
                                    </td>
                                </tr>
                            )
                        })
                    }

                    </tbody>
                </table>
                <div className="page">
                    <ul>
                        <li style={{float:'left'}} onClick={this.editPage.bind(this,'Previous')}>上一页</li>
                        <li style={{float:'right'}} onClick={this.editPage.bind(this,'next')}>下一页</li>
                    </ul>
                </div>
                
                {
                  this.state.pdfStyle && <div className='pdfIframe'>
                          <div id='pdfB'>
                              {
                                this.state.pdfSrc && this.state.pdfSrc.map(prod=>{
                                    return(
                                        <img src={prod} style={{width:'100%',transform:'rotate(90deg)'}}/>
                                    )
                                })
                            }
                            
                          </div>
                            <div className='proBth'>
                                <span onClick={this.pdfB.bind(this)}>
                                    确定
                                    </span>
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
};

ReactDOM.render(
    <Proposal/>,
    document.getElementById('Proposal')
);