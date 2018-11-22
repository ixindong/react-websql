var Inform = React.createClass({
	getInitialState: function () {
            return {
                informStyle:1,
                informData:{},
                
            }
        },
        componentDidMount: function () {
        	this.setState({
        		...JSON.parse(localStorage.productData)
        	},()=>{
        		console.log(this.state,'state')
        	})
        },
        Payment(value,prod){
            if(this.state.informData[prod].Payment[value]){
                return !this.state.informData[prod].Payment[value]
            }else{
                return 'false'
            }
        },
        choiceAnswer(id,Answer,prod){
        	let informData = this.state.informData[prod]?this.state.informData[prod][Answer]:''
        	if(id == 1){
        		this.setState({
        			[Answer]:true
        		})
        		this.setState({
    				informData:{
    					...this.state.informData,
    					[prod]:{
    						...this.state.informData[prod],
    						[Answer]:{
    							...informData,
    							"state":true
    						}
    					}
    				}
    			})
        	}else{
        		this.setState({
        			[Answer]:false
        		})
        		this.setState({
    				informData:{
    					...this.state.informData,
    					[prod]:{
    						...this.state.informData[prod],
    						[Answer]:{
    							...informData,
    							"state":false,
    							"Remarks":''
    						}
    					}
    				}
    			})
        	}
        },
        checked(prod,value){
            let state = ''
        	if(Object.keys(this.state.informData).length!=0){
                if(this.state.informData[prod]!=null){
                    state = this.state.informData[prod].hasOwnProperty(value)
                    if(state == true){
                        if(this.state.informData[prod][value]){
                            if(this.state.informData[prod][value].state == true){
                                return 'checked'
                            }
                        }
                    }
                }
        	}
        	
        },
        payChecked(prod,value,type){
            let state = ''
        	if(Object.keys(this.state.informData).length!=0){
                if(this.state.informData[prod]!=null){
                    state = this.state.informData[prod].hasOwnProperty(value)
                    if(state == true){
                        if(this.state.informData[prod][value][type] == true){
                            return 'checked'
                        }
                    }
                }
        		
        	}
        },
        unchecked(prod,value){
            let state = ''
        	if(Object.keys(this.state.informData).length!=0){
                if(this.state.informData[prod]!=null){
                    state = this.state.informData[prod].hasOwnProperty(value)
                    if(state == true){
                        if(this.state.informData[prod][value]){
                            if(this.state.informData[prod][value].state == false){
                                return 'checked'
                            }
                        }
                    }
                }
        	}
        },
        inputValue(prod,value,type){
            let state = ''
        	if(Object.keys(this.state.informData).length!=0){
        		if(this.state.informData[prod]){
                    state = this.state.informData[prod].hasOwnProperty(value)
                    if(state == true){
                        return this.state.informData[prod][value][type]
                    }
        		}
        	}
    	},

        NextBth(id){
	        	if(id==1){
	        		if(this.state.informStyle < Object.keys(this.state.productData.productData).length){
					this.setState({
	        			informStyle:this.state.informStyle + 1
	        		})
		        	}else{
		        		localStorage.productData = JSON.stringify(this.state)
		        		location.href = 'Newcompleteinformation.html'
			        	}
	        	}else{
	        		localStorage.productData = JSON.stringify(this.state)
	        		localStorage.nextStates = 1
	        		location.href = 'newInsuranceplan.html'
	        	}
        	},
    	Essential(id,prod){
    		//身高体重
    		let e = window.event || arguments[0];
    		let informDataEssential = this.state.informData[prod]?this.state.informData[prod].Essential:''
    		if(id == 0){
    			this.setState({
    				informData:{
    					...this.state.informData,
    					[prod]:{
    						...this.state.informData[prod],
    						"Essential":{
    							...informDataEssential,
    							"height":e.target.value
    						}
    					}
    				}
    			},()=>{
    			})
    		}else{
				this.setState({
    				informData:{
    					...this.state.informData,
    					[prod]:{
    						...this.state.informData[prod],
    						"Essential":{
    							...informDataEssential,
    							"weight":e.target.value
    						}
    					}
    				}
    			})
    		}
    	},
    	Payment(id,prod){
    		let informDataEssential = this.state.informData[prod]?this.state.informData[prod].Payment:''
    		if(id==0){
				this.setState({
    				informData:{
    					...this.state.informData,
    					[prod]:{
    						...this.state.informData[prod],
    						"Payment":{
    							...informDataEssential,
    							"PublicExpense":this.Payment('PublicExpense',prod)
    						}
    					}
    				}
    			})
    		}else if (id == 1) {
    			this.setState({
    				informData:{
    					...this.state.informData,
    					[prod]:{
    						...this.state.informData[prod],
    						"Payment":{
    							...informDataEssential,
    							"SocialInsurance":this.Payment('SocialInsurance',prod)
    						}
    					}
    				}
    			})
    		}else if (id==2) {
    			this.setState({
    				informData:{
    					...this.state.informData,
    					[prod]:{
    						...this.state.informData[prod],
    						"Payment":{
    							...informDataEssential,
    							"commercialInsurance":this.Payment('commercialInsurance',prod)
    						}
    					}
    				}
    			})
    		}else if (id==3) {
    			this.setState({
    				informData:{
    					...this.state.informData,
    					[prod]:{
    						...this.state.informData[prod],
    						"Payment":{
    							...informDataEssential,
                                "SelfExpense":this.Payment('SelfExpense',prod)
    							// "SelfExpense":!this.state.informData[prod].Payment.SelfExpense
    						}
    					}
    				}
    			})
    		}
    	},
    	inputAnswer(value,data,prod){
    		let e = window.event || arguments[0];
    		let informData = this.state.informData[prod]?this.state.informData[prod][value]:''
    		this.setState({
				informData:{
					...this.state.informData,
					[prod]:{
						...this.state.informData[prod],
						[value]:{
							...informData,
							[data]:e.target.value
						}
					}
				}
			},()=>{
				console.log(this.state)
			})
    	},
    	deleteValue(prod,value,data){
    		let informData = this.state.informData[prod]?this.state.informData[prod][value]:''
    		this.setState({
				informData:{
					...this.state.informData,
					[prod]:{
						...this.state.informData[prod],
						[value]:{
							...informData,
							[data]:''
						}
					}
				}
			},()=>{
				console.log(this.state)
			})
    	},
	render: function () {
		return(
			<section>
    			{
    				this.state.productData && Object.keys(this.state.productData.productData).map((prod)=>{
    					let informData = this.state.informData[prod]?this.state.informData[prod]:''
    					return(
							<div style={{display:'none'}} className={prod==this.state.informStyle?'block quesInfo':'quesInfo'}>
						    	<div className="inform mb15">
						            <p className="title">第<span>{prod}</span>被保险人告知</p>
						            <div className="info_con">
						                <ol className="info_list">
						                    <li>
						                        <p><span className="ques_no">1</span>、被保险人的身高(厘米cm)/体重(千克kg)</p>
						                        <p className="fill" qcode="010">
						                            <input type="number" className="q-height" value={informData.Essential?informData.Essential.height:null}  onChange={this.Essential.bind(this,0,prod)} /><span>cm</span>/
						                            <input type="number" className="q-weight" value={informData.Essential?informData.Essential.weight:null} onChange={this.Essential.bind(this,1,prod)}/><span>kg</span></p>
						                    </li>
						                    <li>
						                        <p><span className="ques_no">2</span>、被保险人的医疗费用支付方式：<br/>①公费医疗②社会医疗保险③商业医疗保险④自费</p>
						                        <p className="pay" qcode="170">
						                            &nbsp;&nbsp;<input type="checkbox" className="pays"  value="1" checked={this.payChecked(prod,"Payment","PublicExpense")} onClick={this.Payment.bind(this,0,prod)}/>①
						                            <input type="checkbox" className="pays" value="2" checked={this.payChecked(prod,"Payment","SocialInsurance")} onClick={this.Payment.bind(this,1,prod)}/>②
						                            <input type="checkbox" className="pays" value="3" checked={this.payChecked(prod,"Payment","commercialInsurance")} onClick={this.Payment.bind(this,2,prod)}/>③
						                            <input type="checkbox" className="pays" value="4" checked={this.payChecked(prod,"Payment","SelfExpense")} onClick={this.Payment.bind(this,3,prod)}/>④
						                        </p>
						                    </li>
						                    <li>
						                        <p><span className="ques_no">3</span>、是否有吸烟习惯？如有请告知每日吸烟量与年数。</p>
						                        <p className="q-smoke" qcode="180">
						                            &nbsp;&nbsp;<input type="radio" name='smoke' checked={this.checked(prod,"smoke")} onClick={this.choiceAnswer.bind(this,1,'smoke',prod)}/><span>是</span>
						                            <input type="radio" name='smoke' checked={this.unchecked(prod,"smoke")} onClick={this.choiceAnswer.bind(this,2,'smoke',prod)}/><span>否</span>
						                        </p>
						                        {
						                        	this.state.smoke && <div className="info_list_mask">
						                            <span>每日<input type="text" className="g-everyday" value={this.inputValue(prod,'smoke',"everyday")} onChange={this.inputAnswer.bind(this,"smoke",'everyday',prod)}/>根</span>
						                            <span>年数</span><input type="text" className="g-years1" value={this.inputValue(prod,'smoke',"years")} onChange={this.inputAnswer.bind(this,'smoke','years',prod)}/>
						                        </div>
						                        }
						                    </li>
						                    <li>
						                        <p><span className="ques_no">4</span>、是否有饮酒习惯？如有请告知种类(①白酒②啤酒③葡萄酒④黄酒)、每日饮酒量(两)与年数。</p>
						                        <p className="q-drink" qcode="190">
						                            &nbsp;&nbsp;<input type="radio" name="drink_1" checked={this.checked(prod,"Alcohol")} onClick={this.choiceAnswer.bind(this,1,'Alcohol',prod)}/><span>是</span>
						                            <input type="radio" name="drink_1" checked={this.unchecked(prod,"Alcohol")} onClick={this.choiceAnswer.bind(this,2,'Alcohol',prod)}/><span>否</span>
						                        </p>
						                        {
						                        	this.state.Alcohol && <div className="info_list_mask">
						                            <span>种类<input type="text" className="q-type" value={this.inputValue(prod,'Alcohol',"type")} onChange={this.inputAnswer.bind(this,"Alcohol",'type',prod)}/></span>
						                            <span>每日饮料量<input type="text" className="g-num" value={this.inputValue(prod,'Alcohol',"num")} onChange={this.inputAnswer.bind(this,"Alcohol",'num',prod)}/></span>
						                            <span>年数<input type="text" className="g-year2" value={this.inputValue(prod,"Alcohol","year2")} onChange={this.inputAnswer.bind(this,"Alcohol",'year2',prod)}/></span>
						                        </div>
						                        }
						                    </li>
						                    <li>
						                        <p><span className="ques_no">5</span>、是否有正在生效的商业人身险(医疗险,重大疾病险,护理保险,意外险或寿险)产品？</p>
						                        <p className="q-takeeffect" qcode="200">
						                            &nbsp;&nbsp;<input type="radio" name="takeeffect_1" checked={this.checked(prod,"business")} onClick={this.choiceAnswer.bind(this,1,'business',prod)}/><span>是</span>
						                            <input type="radio" name="takeeffect_1" checked={this.unchecked(prod,"business")} onClick={this.choiceAnswer.bind(this,2,'business',prod)}/><span>否</span>
						                        </p>
						                        {
						                        	this.state.business && <div className="info_list_mask info_list_mask2">
						                            <span>请注明 <input type="text" className="g-lifeinsurance" value={this.inputValue(prod,'business','Remarks')} onChange={this.inputAnswer.bind(this,"business",'Remarks',prod)}/></span>
						                        </div>
						                        }
						                        
						                    </li>
						                    <li>
						                        <p><span className="ques_no">6</span>、是否有人身保险被保险公司拒保、延期、加费、免责的投保经历或向保险公司提出过理赔申请？</p>
						                        <p className="q-declinature" qcode="210">
						                            &nbsp;&nbsp;<input type="radio" name="declinature_1" checked={this.checked(prod,"Repellent")} onClick={this.choiceAnswer.bind(this,1,'Repellent',prod)}/><span>是</span>
						                            <input type="radio" name="declinature_1" checked={this.unchecked(prod,"Repellent")} onClick={this.choiceAnswer.bind(this,2,'Repellent',prod)}/><span>否</span>
						                        </p>
						                        {
						                        	this.state.Repellent&& <div className="info_list_mask info_list_mask2">
						                            <span>请注明 <input type="text" className="g-declinature" value={this.inputValue(prod,'Repellent','Remarks')} onChange={this.inputAnswer.bind(this,"Repellent",'Remarks',prod)}/></span>
						                        </div>
						                        }
						                        
						                    </li>
						                    <li>
						                        <p><span className="ques_no">7</span>、有无危险运动爱好？</p>
						                        <p className="q-motion" qcode="040">
						                            &nbsp;&nbsp;<input type="radio" name="motion_1" checked={this.checked(prod,"DangerousMovement")} onClick={this.choiceAnswer.bind(this,1,'DangerousMovement',prod)}/><span>是</span>
						                            <input type="radio" name="motion_1" value="2" checked={this.unchecked(prod,"DangerousMovement")} onClick={this.choiceAnswer.bind(this,2,'DangerousMovement',prod)}/><span>否</span>
						                        </p>
						                        {
						                        	this.state.DangerousMovement && <div className="info_list_mask info_list_mask2">
						                            <span>请注明 <input type="text" className="g-motion" value={this.inputValue(prod,'DangerousMovement','Remarks')} onChange={this.inputAnswer.bind(this,"DangerousMovement",'Remarks',prod)}/></span>
						                        </div>
						                        }
						                        
						                    </li>
						                    <li>
						                        <p><span className="ques_no">8</span>、过去十年内是否曾住院检查或治疗(包括疗养院、康复医院等医疗机构)？</p>
						                        <p className="q-treatment" qcode="050">
						                            &nbsp;&nbsp;<input type="radio" name="treatment_1" value="1" checked={this.checked(prod,"Treatment")} onClick={this.choiceAnswer.bind(this,1,'Treatment',prod)}/><span>是</span>
						                            <input type="radio" name="treatment_1" value="2" checked={this.unchecked(prod,"Treatment")} onClick={this.choiceAnswer.bind(this,2,'Treatment',prod)}/><span>否</span>
						                        </p>
						                        {
						                        	this.state.Treatment && <div className="info_list_mask info_list_mask2">
						                            <span>请注明 <input type="text" className="g-treatment" value={this.inputValue(prod,'Treatment','Remarks')} onChange={this.inputAnswer.bind(this,"Treatment",'Remarks',prod)}/></span>
						                        </div>
						                        }
						                        
						                    </li>
						                    <li>
						                        <p><span className="ques_no">9</span>、过去十年内是否做过手术(包括门诊手术)？</p>
						                        <p className="q-operation" qcode="060">
						                            &nbsp;&nbsp;<input type="radio" name="operation_1" value="1" checked={this.checked(prod,"Operation")} onClick={this.choiceAnswer.bind(this,1,'Operation',prod)}/><span>是</span>
						                            <input type="radio" name="operation_1" value="2" checked={this.unchecked(prod,"Operation")} onClick={this.choiceAnswer.bind(this,2,'Operation',prod)}/><span>否</span>
						                        </p>
						                        {
						                        	this.state.Operation && <div className="info_list_mask info_list_mask2">
						                            <span>请注明 <input type="text" className="g-operation" value={this.inputValue(prod,'Operation','Remarks')} onChange={this.inputAnswer.bind(this,"Operation",'Remarks',prod)}/></span>
						                        </div>
						                        }
						                        
						                    </li>
						                    <li>
						                        <p><span className="ques_no">10</span>、过去十年内是否接受过心理或药物成瘾性治疗？</p>
						                        <p className="q-medicine" qcode="070">
						                            &nbsp;&nbsp;<input type="radio" name="medicine_1" value="1" checked={this.checked(prod,"Psychology")} onClick={this.choiceAnswer.bind(this,1,'Psychology',prod)}/><span>是</span>
						                            <input type="radio" name="medicine_1" value="2" checked={this.unchecked(prod,"Psychology")} onClick={this.choiceAnswer.bind(this,2,'Psychology',prod)}/><span>否</span>
						                        </p>
						                        {
						                        	this.state.Psychology && <div className="info_list_mask info_list_mask2">
						                            <span>请注明 <input type="text" className="g-medicine" value={this.inputValue(prod,'Psychology','Remarks')} onChange={this.inputAnswer.bind(this,"Psychology",'Remarks',prod)}/></span>
						                        </div>
						                        }
						                    </li>
						                    <li>
						                        <p><span className="ques_no">11</span>、过去两年内是否参加身体检查并发现结果异常？</p>
						                        <p className="q-test" qcode="090">
						                            &nbsp;&nbsp;<input type="radio" name="test_1" value="1" checked={this.checked(prod,"Abnormality")} onClick={this.choiceAnswer.bind(this,1,'Abnormality',prod)}/><span>是</span>
						                            <input type="radio" name="test_1" value="2" checked={this.unchecked(prod,"Abnormality")} onClick={this.choiceAnswer.bind(this,2,'Abnormality',prod)}/><span>否</span>
						                        </p>
						                        {
						                        	this.state.Abnormality &&  <div className="info_list_mask info_list_mask2">
						                            <span>请注明 <input type="text" className="g-test" value={this.inputValue(prod,'Abnormality','Remarks')} onChange={this.inputAnswer.bind(this,"Abnormality",'Remarks',prod)}/></span>
						                        </div>
						                        }
						                    </li>
						                    <li>
						                        <p><span className="ques_no">12</span>、您在过去三年内是否因疾病而持续治疗超过2周？</p>
						                        <p className="q-inspect" qcode="080">
						                            &nbsp;&nbsp;<input type="radio" name="inspect_1" value="1" checked={this.checked(prod,"Continued")} onClick={this.choiceAnswer.bind(this,1,'Continued',prod)}/><span>是</span>
						                            <input type="radio" name="inspect_1" value="2" checked={this.unchecked(prod,"Continued")} onClick={this.choiceAnswer.bind(this,2,'Continued',prod)}/><span>否</span>
						                        </p>
						                        {
						                        	this.state.Continued && <div className="info_list_mask info_list_mask2">
						                            <span>请注明 <input type="text" className="g-inspect" value={this.inputValue(prod,'Continued','Remarks')} onChange={this.inputAnswer.bind(this,"Continued",'Remarks',prod)}/></span>
						                        </div>
						                        }
						                    </li>
						                    <li>
						                        <p><span className="ques_no">13</span>、过去一年内是否使用过药物？</p>
						                        <p className="q-medication" qcode="100">
						                            &nbsp;&nbsp;<input type="radio" name="medication_1" value="1" checked={this.checked(prod,"UseDrugs")} onClick={this.choiceAnswer.bind(this,1,'UseDrugs',prod)}/><span>是</span>
						                            <input type="radio" name="medication_1" value="2" checked={this.unchecked(prod,"UseDrugs")} onClick={this.choiceAnswer.bind(this,2,'UseDrugs',prod)}/><span>否</span>
						                        </p>
						                        {
						                        	this.state.UseDrugs &&<div className="info_list_mask info_list_mask2">
						                            <span>请注明 <input type="text" className="g-medication" value={this.inputValue(prod,'UseDrugs','Remarks')} onChange={this.inputAnswer.bind(this,"UseDrugs",'Remarks',prod)}/></span>
						                        </div>
						                        }
						                        
						                    </li>
						                    <li>
						                        <p><span className="ques_no">14</span>、过去一年中是否有发热、疼痛、大小便异常、体重明显变化或者其它不适症状？</p>
						                        <p className="q-symptom" qcode="110">
						                            &nbsp;&nbsp;<input type="radio" name="symptom_1" value="1" checked={this.checked(prod,"fever")} onClick={this.choiceAnswer.bind(this,1,'fever',prod)}/><span>是</span>
						                            <input type="radio" name="symptom_1" value="2" checked={this.unchecked(prod,"fever")} onClick={this.choiceAnswer.bind(this,2,'fever',prod)}/><span>否</span>
						                        </p>
						                        {
						                        	this.state.fever && <div className="info_list_mask info_list_mask2">
						                            <span>请注明 <input type="text" className="g-symptom" value={this.inputValue(prod,'fever','Remarks')} onChange={this.inputAnswer.bind(this,"fever",'Remarks',prod)}/></span>
						                        </div>
						                        }
						                    </li>
						                    <li>
						                        <p><span className="ques_no">15</span>、是否曾经或正患有以下疾病： A、高血压、冠心病、心肌梗塞、先天性心脏病、风湿性心脏病、肺源性心脏病、缩窄性心包炎、心内 膜炎、心肌炎、心脏瓣膜疾病、主动脉血管瘤、心律失常、心肌病等心血管系统疾病;B、慢性支气管炎、 哮喘、肺脓肿、胸膜炎、肺气肿、肺大泡、支气管扩张、肺结核、尘肺、矽肺等呼吸系统疾病；C、肝 炎、肝炎病毒携带者、肝硬化、肝脓肿、肝内结石、肝脾肿大、胆囊炎、胆结石、胆管炎、消化道溃疡、 出血及穿孔、胃炎、胰腺炎、溃疡性结肠炎、肛管疾病等消化系统疾病；D、肾炎、肾病综合症、肾功 能异常、尿毒症、肾盂积水、肾囊肿、泌尿系结石、尿路畸形等泌尿系统疾病；E、糖尿病、痛风、甲状 腺疾病、甲状旁腺疾病、肢端肥大症、垂疾机能亢进或减退、肾上腺机能亢进或减退、高脂血症等内分泌 系统疾病；F、精神疾病、神经官能症、智能障碍、脑膜炎、脑炎、脑中风、短暂性脑缺血、脑动脉畸 形、癫痫、重症肌无力、多发性硬化症、帕金森氏综合症、脊髓灰质炎、运动神经元疾病等精神、神经系 统疾病；G、视网膜出血或剥离、视神经病变、青光眼、白内障、高度近视、中耳炎、神经性耳聋等五官 疾病；H、曾被建议不宜献血、血友病、白血病、各类贫血、紫癜等血液系统疾病；I、风湿性关节炎、类风 湿性关节炎、强直性脊柱炎、系统性红斑狼疮、硬皮病等结缔组织疾病；J、骨关节畸形、人工装置物、脊 柱脊椎疾病等运动系统疾病；K、聋、哑、失明、肢体残缺或其他各种部位的残疾；L、恶性肿瘤、尚未证实 性质的肿瘤、息肉、囊肿、包块、赘生物；M、性病、艾滋病或感染艾滋病病毒、吸食或注射毒品、未遵医嘱使用管制型成瘾类药物；N、以上未提及的疾病及症状。</p>
						                        <p className="q-disease" qcode="140">
						                            &nbsp;&nbsp;<input type="radio" name="disease_1" value="1" checked={this.checked(prod,"Hypertension")} onClick={this.choiceAnswer.bind(this,1,'Hypertension',prod)}/><span>是</span>
						                            <input type="radio" name="disease_1" value="2" checked={this.unchecked(prod,"Hypertension")} onClick={this.choiceAnswer.bind(this,2,'Hypertension',prod)}/><span>否</span>
						                        </p>
						                        {
						                        	this.state.Hypertension && <div className="info_list_mask info_list_mask2">
						                            <span>请注明 <input type="text" className="g-disease" value={this.inputValue(prod,'Hypertension','Remarks')} onChange={this.inputAnswer.bind(this,"Hypertension",'Remarks',prod)}/></span>
						                        </div>
						                        }
						                        
						                    </li>
						                    <li>
						                        <p><span className="ques_no">16</span>、父母兄弟姐妹是否有高血压、糖尿病、恶性肿瘤、心脏 病、高脂血症、肾衰竭、中风、多囊肾等疾病？</p>
						                        <p className="q-inheritance" qcode="220">
						                            &nbsp;&nbsp;<input type="radio" name="inheritance_1" value="1" checked={this.checked(prod,"HypertensionParent")} onClick={this.choiceAnswer.bind(this,1,'HypertensionParent',prod)}/><span>是</span>
						                            <input type="radio" name="inheritance_1" value="2" checked={this.unchecked(prod,"HypertensionParent")} onClick={this.choiceAnswer.bind(this,2,'HypertensionParent',prod)}/><span>否</span>
						                        </p>
						                        {
						                        	this.state.HypertensionParent&&<div className="info_list_mask info_list_mask2">
						                            <span>请注明 <input type="text" className="g-inheritance" value={this.inputValue(prod,'HypertensionParent','Remarks')} onChange={this.inputAnswer.bind(this,"HypertensionParent",'Remarks',prod)}/></span>
						                        </div>
						                        }
						                        
						                    </li>
						                    <li className="children isHide">
						                        <p><span className="ques_no">17</span>、(3周岁及以下儿童回答)是否有新生儿窒息、早产儿、产伤、出生体重异常、发育迟缓等？</p>
						                        <p className="q-children" qcode="">
						                            &nbsp;&nbsp;<input type="radio" name="children_1" value="1" checked={this.checked(prod,"asphyxia")} onClick={this.choiceAnswer.bind(this,1,'asphyxia',prod)}/><span>是</span>
						                            <input type="radio" name="children_1" value="2" checked={this.unchecked(prod,"asphyxia")} onClick={this.choiceAnswer.bind(this,2,'asphyxia',prod)}/><span>否</span>
						                        </p>
						                        {
						                        	this.state.asphyxia&&<div className="info_list_mask info_list_mask2">
						                            <span>请注明 <input type="text" className="g-children" value={this.inputValue(prod,'asphyxia','Remarks')} onChange={this.inputAnswer.bind(this,"asphyxia",'Remarks',prod)}/></span>
						                        </div>
						                        }
						                        
						                    </li>
						                    <li className="gravida isHide">
						                        <p><span className="ques_no">18</span>、(16周岁及以上女性回答)是否怀孕？如是请告知妊娠周数以及是否有妊娠并发症</p>
						                        <p className="q-pregnant" qcode="240">
						                            &nbsp;&nbsp;<input type="radio" name="pregnant_1" value="1" checked={this.checked(prod,"Pregnant")} onClick={this.choiceAnswer.bind(this,1,'Pregnant',prod)}/><span>是</span>
						                            <input type="radio" name="pregnant_1" value="2"  checked={this.unchecked(prod,"Pregnant")} onClick={this.choiceAnswer.bind(this,2,'Pregnant',prod)}/><span>否</span>
						                        </p>
						                        {
						                        	this.state.Pregnant&&<div className="info_list_mask info_list_mask2">
						                            <span>请注明 <input type="text" className="g-pregnant" value={this.inputValue(prod,'Pregnant','Remarks')} onChange={this.inputAnswer.bind(this,"Pregnant",'Remarks',prod)}/></span>
						                        </div>
						                        }
						                        
						                    </li>
						                    <li className="minor isHide">
						                        <p><span className="ques_no">19</span>、(18周岁以下未成年人回答)是否已拥有正在生效的以死亡为 给付保险金条件的人身保险？如有请告知身故保险金额总额。</p>
						                        <p className="q-death" qcode="">
						                            &nbsp;&nbsp;<input type="radio" name="death_1" value="1" checked={this.checked(prod,"die")} onClick={this.choiceAnswer.bind(this,1,'die',prod)}/><span>是</span>
						                            <input type="radio" name="death_1" value="2" checked={this.unchecked(prod,"die")} onClick={this.choiceAnswer.bind(this,2,'die',prod)}/><span>否</span>
						                        </p>
						                        {
						                        	this.state.die&&<div className="info_list_mask info_list_mask2">
						                            <span>请注明 <input type="text" className="g-death" value={this.inputValue(prod,'die','Remarks')} onChange={this.inputAnswer.bind(this,"die",'Remarks',prod)}/></span>
						                        </div>
						                        }
						                        
						                    </li>
						                </ol>
						            </div>
						            <div className="remarks" qcode="">
						                <h3>投保备注信息</h3><br/>
						                <p className="mb15 choice_btn">
						                    <span>是否需要录入投保备注信息：</span>
						                    <input type="radio" name="remarks_1" value="1" className="q-remarks"  checked={this.checked(prod,"Remarks")} onClick={this.choiceAnswer.bind(this,1,'Remarks',prod)}/><span>是</span>&nbsp;&nbsp;
						                    <input type="radio" name="remarks_1" value="2" className="q-remarks" checked={this.unchecked(prod,"Remarks")} onClick={this.choiceAnswer.bind(this,2,'Remarks',prod)}/><span>否</span>
						                </p>
						                {
						                	this.state.Remarks && <p className="remarks_info"><textarea className="g-remarks" onChange={this.inputAnswer.bind(this,"Remarks",'Remarks',prod)} style={{background: 'rgb(221, 221, 221)'}}>{this.inputValue(prod,'Remarks','Remarks')}</textarea></p>
						                }
						            </div>
						        </div>
			        		</div>
						)
    				})
    			}
    			<p className="beneficiary_btn mb15 clearfix"><a href="javascript:;" className="prev" onClick={this.NextBth.bind(this,0)}>上一步</a><a href="javascript:;" className="next" onClick={this.NextBth.bind(this,1)}>下一步</a></p>
			</section>
		)
	}
})
ReactDOM.render(
    <Inform/>,
    document.getElementById('inform')
);