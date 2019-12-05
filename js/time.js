//单位时间(毫秒)
let worldTime = 1000;
//点菜时间
let diancaiTime = 3000;
// 用餐时间 
let yongcanTime = 3000;
// 延迟执行的promise函数(时间参数没传则为0)

function prList  () {
    let arg = arguments[0];
    //传进来的是个执行队列
    if (arg instanceof Array) {
        let funList = arg;
        let pm = Promise.resolve();
        console.log(funList);
        funList.forEach(el => {
            pm = pm.then(() => {
                return arguments.callee(el[0], el[1]);
            })
        })
    } else {
        // 延迟执行的函数
        let fun = arguments[0];
        let time = arguments[1] || 0;
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time)
        }).then(() => {
            fun();
        })
    }
}