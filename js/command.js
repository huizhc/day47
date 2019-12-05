//视图元素命令
var viewCommand = (function () {
    let tmp = {
        //厨师模版
        cookTmp: `<div>
            <img src="./img/cook.png" alt="厨师" width="95" height="200">
            <h3>状态</h3>
            <ul id= "cookSt"><li>空闲</li></ul>
        </div>`,
        // 服务员模版
        waiterTmp: `<div id="waiter" style="float:left">
            <img src="./img/waiter.png" alt="服务员" width="65" height="150">
            <h3>状态</h3>
            <ul id= "waiterSt"><li>空闲</li></ul>
        </div>`,
        // 进度条
        jinduTmp: `<div style="width:20px;height:5px;">
            <div style="height:5px;background:black">
            </div>
        </div>`,
        //桌子模版
        zhuoTmp: `<div style="float:left">
            <img src="./img/zhuo.png" alt="桌子" width="110" height="110">
        </div>`
    };
    //获取厨房
    let getCoWr = function () {
        return document.querySelector('#cookWr');
    }
    //获取座位
    let getZhWr = function () {
        return document.querySelector('#zhuoWr');
    }
    //获取服务员站立区
    let getWaWr = function () {
        return document.querySelector('#waiterWr');
    }
    //获取厨师状态
    let getCoSt = function () {
        return document.querySelector('#cookSt');
    }
    //获取服务员
    let getWa = function () {
        return document.querySelector('#waiter');
    }
    //获取服务员状态
    let getWaSt = function () {
        return document.querySelector('#waiterSt');
    }
    //获取现金状态
    let getMoney = function () {
        return document.querySelector('#money');
    }
    return {
        //初始化厨房和用餐区
        load: function () {
            getCoWr().insertAdjacentHTML('beforeend', tmp.cookTmp);
            getWaWr().insertAdjacentHTML('beforeend', tmp.waiterTmp);
        },
        // 修改厨师状态
        setCo: function (foodName) {
            // 如果是数组则替换列表
            let cost = getCoSt();
            if (foodName instanceof Array) {
                //清空列表
                cost.innerHTML = '';
                let html = '';
                for (let i = 0; i < foodName.length; i ++) {
                    //第一个菜品添加正在做样式
                    if (i == 0) {
                        html += `<li class="zaizuo">${foodName[i]}</li>`
                    } else {
                        html += `<li>${foodName[i]}</li>`;
                    }
                }
                cost.insertAdjacentHTML('beforeend', html);
            } else if (foodName === 'next') {
                //否则更改正在做样式
                let pre = cost.querySelector('.zaizuo');
                if (pre.nextElementSibling) {
                    pre.classList.remove('zaizuo');
                    pre.nextElementSibling.classList.add('zaizuo');
                }
            } else {
                //无参数恢复空闲
                cost.innerHTML = '';
                cost.insertAdjacentHTML('beforeend', '<li>空闲</li>');
            }
        },
        // 修改现金数额
        setMoney: function (money) {
            getMoney().textContent = money;
        },
        //放桌子
        setZhuo: function (seats) {
            let cust = getZhWr();
            let html = '';
            for (let i = 0; i < seats; i ++) {
                html += tmp.zhuoTmp;
            }
            cust.insertAdjacentHTML('beforeend', html);
        },
        //修改服务员状态
        setWaiter: function (pos) {
            if (pos == 'right') {
                getWa().classList.add('waiterRi');
            } else {
                getWa().classList.remove('waiterRi');
            }
        }
    }
})();