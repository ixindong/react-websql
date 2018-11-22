var Photo = React.createClass({
    getInitialState: function () {
            return {
                cameraSrc:{}
            }
        },
        componentDidUpdate: (prevProps, prevState) => {
            $("input[type='file']").on('change', function() {
                var oFReader = new FileReader();
                var file = document.getElementById('input-file').files[0];
                oFReader.readAsDataURL(file);
                oFReader.onloadend = function(oFRevent) {
                    var src = oFRevent.target.result;
                    localStorage.cameraSrc = src
                }
            });     
        },
        componentDidMount: function () {

            let that = this
            const myDate = new Date()
            this.setState({
                ...JSON.parse(localStorage.productData)
            },()=>{
                console.log(this.state)
            })
        },
        deletePhoto(prod){
            console.log(11)
            //删除照片
            let PhotoData = this.state.cameraSrc
            delete PhotoData[prod]
            this.setState({
                cameraSrc:PhotoData
            })
        },
        NextBth(id){
            //  下一步
            if(id==1){
                localStorage.productData = JSON.stringify(this.state)
                location.href = 'policypreview.html'
            }else{
                localStorage.productData = JSON.stringify(this.state)
                location.href = 'payment.html'
            }
        },
        camera(){
            let cameraSrcLength = Object.keys(this.state.cameraSrc).length
            let insurLength = Object.keys(this.state.productData.productData).length
            console.log(cameraSrcLength,'cameraSrcLength')
            console.log(this.state.productData.productData,'insurLength')
            if(cameraSrcLength < insurLength * 3){
                this.setState({
                    cameraSrc:{
                        ...this.state.cameraSrc,
                        [cameraSrcLength + 1]:localStorage.cameraSrc
                    }
                },()=>{
                    console.log(this.state.cameraSrc)
                })
            }else{
                this.setState({
                    Prompt: {
                        state: true,
                        text: '上传照片不得超过' + insurLength * 3 + '张'
                    }
                })
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
    render: function () {
        let productData = this.state.productData?this.state.productData.productData:''
        return(
            <section className="collection_main">
                <div>
                  <span className="collection_main_title">请提供以下照片：投保人身份证明（正背面）、被保险人身份证明（正背面）、银行卡，及其他投保资料，若为纸质保单还请提供电子投保申请确认书、投保提示书（正背面）</span>
                  <p className="photocollection2 clearfix">
                    <a href="javascript:;" className="photograph" style={{position:'relative'}}>拍摄照片
                        <input id="input-file" type="file" capture="camera" onChange={this.camera.bind(this)} />
                    </a>
                    
                  </p>
                  <ul class="preview clearfix">
                    {
                        this.state.cameraSrc && Object.keys(this.state.cameraSrc).map((prod)=>{
                            return (
                               <li className="img">
                                <p>
                                    <img width="100%" onClick={this.deletePhoto.bind(this,prod)} height="100%" style={{marginBottom:'1em'}} src={this.state.cameraSrc[prod]}/>
                                </p>
                                </li>
                            )
                        })
                    }
                  </ul>
                  <p className="beneficiary_btn clearfix"><a href="javascript:;" onClick={this.NextBth.bind(this,0)}>上一步</a><a href="javascript:;" onClick={this.NextBth.bind(this,1)} className="next" id="next">下一步</a>
                  </p>
                </div>
          </section>
        )
    }
})
ReactDOM.render(
    <Photo/>,
    document.getElementById('Photo')
);