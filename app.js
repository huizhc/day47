let menuAll = [
     new Food('番茄鸡蛋', 5, 15, 3000),
     new Food('土豆炒肉', 5, 15, 3000),
     new Food('葱炒回锅肉', 5, 15, 5000),
     new Food('红烧茄子', 5, 15, 4000),
     new Food('炒金针菇', 5, 15, 2000),
     new Food('韭菜鸡蛋', 5, 15, 2000),
     new Food('花菜肉沫', 5, 15, 2000),
     new Food('老干妈炒肉', 5, 15, 2000)
 ];
 //餐厅对象初始化
 let def = {
    cash: 100,
    seats: 1,
    staff:[Cook.getInstance, Waiter.getInstance]
 };
 let rest = Restaurant.getInstance(def);
 //视图初始化
 window.addEventListener('load', () => {
    rest.viewLoad();
 })