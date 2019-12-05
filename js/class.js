//         餐厅类
class Restaurant  {
    constructor (obj) {
        this.cash = obj.cash;
        this.seats = obj.seats;
        this.staff = obj.staff;
    }
    //初始化视图
    viewLoad () {
        viewCommand.load();
        viewCommand.setMoney(this.cash);
        //放桌子
        viewCommand.setZhuo(this.seats);
    }
    hire (st) {
        //为职员分配id
        st.id = this.staff.length;
        this.staff.push(st);
        console.log(st.name + '被雇用啦,员工编号是' + st.id + ',月薪' + st.money);
    }
    fire (st) {
        if (this.staff.includes(st)) {
            this.staff.splice(this.staff.indexOf(st), 1);
        }
        console.log(st.name + '上班摸鱼被炒了，大家引以为戒');
    }
    // 支出
    pay (money) {
        this.cash -= money;
        viewCommand.setMoney(this.cash);
    }
    //收款
    cashier (money) {
        this.cash += money;
        viewCommand.setMoney(this.cash);
    }
    static getInstance (obj) {
        if (!this.instance) {
            this.instance = new Restaurant(obj);
        }
        return this.instance;
    }
}
// 属性：金钱，座位数量、职员列表
// 方法：招聘职员，解雇职员


// 职员类
// 属性：ID，姓名，工资
// 方法：完成一次工作
class Staff {
    constructor (name, money) {
        this.id = '';
        this.name = name;
        this.money = money;
    }
    Working () {
        console.log('干活!');
    }
}

// 服务员类，继承自职员
// 完成一次工作：如果参数是个数组，则记录客人点菜，如果参数不是数组则是上菜行为
class Waiter extends Staff {
    constructor (name, money) {
        super(name, money);
        this.cust = null;//当前招待的顾客
    }
    //招待顾客(记下菜品和顾客)
    zhaodaiguke (food, cust) {
        //移动
        // viewCommand.setWaiter('right');
        // return new Promise (resolve => { // 到顾客所在的位置0.5个时间单位
        //     setTimeout(() => {
        //         resolve();
        //     }, worldTime * .5);
        // }).then(() => {
            //如果是数组则记下菜品，否则上菜
            if (food instanceof Array) {
                this.cust = cust;
                let notepad = [...food];//记下客户点的食物
                console.log('我记下客人点了' + notepad.map(el => el.name).join());
                // 通过责任链将请求传递给厨师
                return this.tongzhichushi(notepad);
            } else {
                console.log('久等了，这是您的菜');
                //顾客开吃，餐上齐了返回最后的promise，没上齐不会有返回值
                return this.cust.chi(food);
            }
        // })
    }
    //通知厨师
    tongzhichushi (food) {
        viewCommand.setWaiter('left');
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, worldTime * .5);
        }).then(() => {
            let cook = Cook.getInstance();
            console.log('客人需要' + food.map(el => el.name).join() + ',师傅有劳啦');
            return cook.zuocai(food);
        })
    }
    //获取实例
    static getInstance () {
        if (!this.instance) {
            this.instance = new Waiter();
        }
        return this.instance;
    }
}

// 厨师类，继承自职员
// 完成一次工作：烹饪出菜品
class Cook extends Staff {
    constructor (name, money) {
        super(name, money);
    }
    //做菜
    zuocai (food) {
        return new Promise(resolve => {
            //把要做的菜在厨师状态中显示
            viewCommand.setCo(food.map((el) => {return el.name}));
            //实现动作队列
            //创建一个空promise,将每次循环创建的promise用then连接
            let pro = Promise.resolve();
            for (let i = 0; i < food.length; i ++) {
                pro = pro.then(() => {
                    return new Promise((resolve, reject) => {
                        //做菜成本
                        let rest = Restaurant.getInstance();
                        rest.pay(food[i].chengben);
                        setTimeout(() => {
                            console.log('铿铿~碦擦~扑哧~滋滋~噼里啪啦~哗~~' + food[i].name + '做好了');
                            //厨师状态显示为做下道菜
                            viewCommand.setCo('next');
                            resolve(food[i]);
                        }, food[i].time);
                    }).then((finishFood) => {
                        //每做好一道菜通知一下服务员
                        let re = this.tongzhifuwuyuan(finishFood);
                        //最后一道菜做完恢复空闲状态
                        if (i == food.length - 1) {
                            viewCommand.setCo();
                        }
                        // 将最后的promise弹出
                        if (typeof re != 'undefined') {
                            resolve(re);
                        }
                    });
                })
            }
        })
    }
    //通知服务员
    tongzhifuwuyuan (finishFood) {
        let waiter = Waiter.getInstance();
        console.log('来取一下' + finishFood.name);
        return waiter.zhaodaiguke(finishFood);
    }
    //获取实例
    static getInstance () {
        if (!this.instance) {
            this.instance = new Cook();
        }
        return this.instance;
    }
}

// 顾客类
// 方法：点菜，吃
class Customer {
    constructor () {
        //该顾客点了的菜
        this.menu = [];
        //应支付的费用
        this.pay = 0;
    }
    diancai () {
        console.log('顾客开始点菜');
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                //随机点菜
                // 随机点几道菜,至少一道，至多5道
                let dao = Math.floor(Math.random() * 5 + 1);
                for (let i = 0; i < dao; i ++) {
                    // 从菜单中选择一样菜
                    let food = menuAll[Math.floor(Math.random() * (menuAll.length - 1))];
                    //菜不能重样
                    while (this.menu.includes(food)) {
                        food = menuAll[Math.floor(Math.random() * (menuAll.length - 1))];
                    }
                    //加入已点清单
                    this.menu.push(food);
                    this.pay += food.money;
                }
                // 点完菜后then
                resolve();
            }, diancaiTime);
        }).then(() => {
                console.log('我点了' + this.menu.map(el => el.name).join());
                let waiter = Waiter.getInstance();
                // 把已点清单给服务员
                // 返回最后的promise
                return waiter.zhaodaiguke(this.menu, this);
        })
    }
    chi (food) {
        this.menu.splice(this.menu.indexOf(food), 1);
        console.log('我只知道吃!' + food.name + '吃得我感动到落泪');
        //菜都上齐了,返回最后的promise，用餐计时完成后then
        if (!this.menu.length) {
            return new Promise(resolve => {
                setTimeout(() => {
                    console.log('饱了~嗝~~(起身走出店门)');
                    //结账
                    let rest = Restaurant.getInstance();
                    rest.cashier(this.pay);
                    resolve();
                }, yongcanTime);
            })
        }
    }
}

// 菜品类
// 属性：名字、烹饪成本、价格 、制作时间
class Food {
    constructor (name, chengben, money, time) {
        this.name = name;
        this.chengben = chengben;
        this.money = money;
        this.time = time;
    }
}
