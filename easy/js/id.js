/**
 * Created by sora on 2017/8/23.
 */
//身份证校验
var checkIdcard = function(idcard) {
    //var Errors=new Array("验证通过!","身份证号码位数不对!","身份证号码出生日期超出范围或含有非法字符!","身份证号码校验错误!","身份证地区非法!");
    var Errors = new Array(true, false, false,false, false),
        area = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" },
        idcard_array = idcard.split(""),
        Y, JYM, S, M, ereg;
    switch (idcard.length) {
        case 15:
            if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
                //ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
                ereg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i;
            } else {
                //ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
                ereg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i;
            }
            return ereg.test(idcard) ? Errors[0] : Errors[2];
            break;
        case 18:
            //18 位身份号码检测
            //出生日期的合法性检查
            //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
            //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
            if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                //ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
                ereg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i;
            } else {
                //ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
                ereg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i;
            }
            if (ereg.test(idcard)) { //测试出生日期的合法性
                //计算校验位
                S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 +
                    (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 +
                    (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 +
                    (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 +
                    (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 +
                    (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 +
                    (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 +
                    parseInt(idcard_array[7]) * 1 +
                    parseInt(idcard_array[8]) * 6 +
                    parseInt(idcard_array[9]) * 3;
                Y = S % 11;
                M = "F";
                JYM = "10X98765432";
                M = JYM.substr(Y, 1); //判断校验位
                if (M == idcard_array[17]) return Errors[0]; //检测ID的校验位
                return Errors[3];
            }
            return Errors[2];
            break;
        default:
            return Errors[1];
            break;
    }
};


//身份证判断性别
function Getsex(psidno) {
    var sexno, sex;
    if (psidno.length == 18) {
        sexno = psidno.substring(16, 17)
    } else if (psidno.length == 15) {
        sexno = psidno.substring(14, 15)
    } else {
        alert("错误的身份证号码，请核对！");
        return false
    }
    var tempid = sexno % 2;
    if (tempid == 0) {
        sex = '女'
    } else {
        sex = '男'
    }
    return sex
}

//去除空格
function trim(s) { return s.replace(/^\s+|\s+$/g, ""); };
//获取身份证日期
function getBirthdatByIdNo(iIdNo) {
    var tmpStr = "";
    var idDate = "";
    var tmpInt = 0;
    var strReturn = "";

    iIdNo = trim(iIdNo);

    if ((iIdNo.length != 15) && (iIdNo.length != 18)) {
        strReturn = "输入的身份证号位数错误";
        return strReturn;
    }

    if (iIdNo.length == 15) {
        tmpStr = iIdNo.substring(6, 12);
        tmpStr = "19" + tmpStr;
        tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6)
        return tmpStr;
    } else {
        tmpStr = iIdNo.substring(6, 14);
        tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6)
        return tmpStr;
    }
}

//根据时间(xxxx-xx-xx)获取距今多少年
function getAge(birth){
    var arr = birth.split('-'),year1 = arr[0],mon1 = arr[1],day1 = arr[2],
        now = new Date(),year2 = now.getFullYear(),mon2 = now.getMonth()+1,day2 = now.getDate(),
        ageDiff = year2 - year1;
    if(!ageDiff) return 0;//同年 则为0岁
    if(ageDiff<0) return -1;//表示出生日期输入错误 晚于今天
    if(mon2==mon1){
        return (day2-day1<0?ageDiff-1:ageDiff);
    }else{
        return (mon2-mon1<0?ageDiff-1:ageDiff);
    }
};

//获取年月日天数
function DateMinus(sDate){
    var sdate = new Date(sDate.replace(/-/g, "/"));
    var now = new Date();
    var days = now.getTime() - sdate.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    return day;
}