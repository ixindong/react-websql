$(function() {
    //返回顶部
    $(window).scroll(function() {
        var sc = $(window).scrollTop();
        if (sc > 0) {
            $(".return_btn").css("display", "block");
        } else {
            $(".return_btn").css("display", "none");
        }
    });
    $(".return_btn").click(function() {
        var sc = $(window).scrollTop();
        $('body,html').animate({ scrollTop: 0 }, 100);
    });
});

// 处理时间格式xxxx-xx-xx
Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

//获取html
function _getHtml($target) {
    return $target.html().replace(/(^\s*)|(\s*$)/g, '');
}



//base64数据图片压缩
//参数 maxWidth:300 默认300 最大宽度300,高自动(宽大于高)
//xfz 20161217
function Resizer(maxWidth) {
    if (this instanceof Resizer) {
        this.maxWidth = maxWidth || 300;
    } else {
        return new Resizer(maxWidth)
    }
}
Resizer.prototype.compress = function(data, callback) {
    _this = this;
    var img = new Image();
    img.src = data;
    img.onload = function() {
        var w = img.width,
            h = img.height,
            _w, _h;
        if (w > h) {
            _w = _this.maxWidth;
            _h = h * _w / w;
        } else {
            _h = _this.maxWidth;
            _w = _h * w / h;
        }
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
        canvas.width = _w;
        canvas.height = _h;
        ctx.drawImage(img, 0, 0, _w, _h);
        callback(canvas.toDataURL('image/png'));
    }
    return Resizer;
};

//数组去重
function unique(ar) {
    var tmp = {},
        ret = [];
    for (var i = 0, j = ar.length; i < j; i++) {
        if (!tmp[ar[i]]) {
            tmp[ar[i]] = 1;
            ret.push(ar[i]);
        }
    }
    return ret;
}

function ages(str) {
    var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null) return false;
    var birth = new Date(r[1], r[3] - 1, r[4]);
    if (birth.getFullYear() == r[1] && (birth.getMonth() + 1) == r[3] && birth.getDate() == r[4]) {
        var today = new Date();
        var age = today.getFullYear() - r[1];

        if (today.getMonth() > birth.getMonth()) {
            return age;
        }
        if (today.getMonth() == birth.getMonth()) {
            if (today.getDate() >= birth.getDate()) {
                return age;
            } else {
                return age - 1;
            }
        }
        if (today.getMonth() < birth.getMonth()) {
            return age - 1;
        }
    }
    return ("输入的日期格式错误！");
}

//计算时间差(当前时间与输入框值之差)
function diffTime(time) {
    var arr = time.split('-');
    var recognizeeYear = arr[0];
    var recognizeeMonth = arr[1];
    var recognizeeDate = arr[2];
    var currentTime = new Date();
    var currentYear = currentTime.getFullYear();
    var currentMonth = currentTime.getMonth() + 1;
    var currentDate = currentTime.getDate();
    yearDiff = currentYear - recognizeeYear;
    var str = time.replace(/-/g, '/');
    var dateOne = new Date(str);
    var dateTwo = currentTime;
    dateDiff = dateTwo.getTime() - dateOne.getTime();
    dateDiffday = Math.floor(dateDiff / (24 * 3600 * 1000));

}