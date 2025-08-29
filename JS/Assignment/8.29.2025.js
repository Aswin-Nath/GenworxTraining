var a="2023-03-03";
var D=new Date(a);
var day=D.getDate();
var month=D.getMonth();
var year=D.getFullYear();
const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
var current=days[D.getDay()];
var n=3;

var mp=[0,31,28,31,30,31,30,31,30,31,30,31]; 

const update=(D)=>{
    day+=D;
    if(day>mp[month]){
        month+=1;
        if(month==13){
            month=1;
            year+=1;
        }
    }
}
while(n>0){
    if(day==5){
        current=0;
        update(2);
    }
    update(1);
    n-=1;
}

console.log({year,day,month});

