// let name_:String="aswin";
// const mark_:number=11;
// var ht:number=5.5;

// console.log(name_,mark_,ht);

// ht=1;
// name_="manoj";
// console.log(ht,mark_);



// const student = {
//   name: "aswin",
//   age: 21,
// };
// console.log(student);
// student.age = 22;
// student.name = "kira";
// console.log(student);
// // function add(a:number,b:number){
// //     return a+b;
// // }

// // let multiplication=(num1:number,num2:number):number =>{
// //     return num1*num2;
// // }

// // let multiplication1=(num1:number,num2=1):number=>{
// //     return num1*num2;
// // }

// // function combine(a: number, b: number): number;
// // function combine(a: string, b: string): string;

// // function combine(a: number | string, b: number | string): number | string {
// //   if (typeof a === "number" && typeof b === "number") {
// //     return a + b;
// //   } else if (typeof a === "string" && typeof b === "string") {
// //     return a + b;
// //   } else {
// //     throw new Error("Parameters must be of the same type (either both numbers or both strings).");
// //   }
// // }

// // console.log(combine(10, 20));         
// // console.log(combine("Hello, ", "TS"))



// // console.log(add(12,2));
// // console.log(multiplication(1,2));
// // console.log(multiplication1(5));
// // console.log(multiplication1(4,5));

// // // function status_(a:number){
// // //     if(a>0){
// // //         return "Positive";
// // //     }
// // //     else if(a<0){
// // //         return "Negative";
// // //     }
// // //     else{
// // //         return "0";
// // //     }
// // // }

// // // function find_day(a:number){
// // //     switch(a){
// // //         case 1:
// // //             console.log("MONDAY");
// // //             break;
// // //         case 2:
// // //             console.log("TUESDAY");
// // //             break;
// // //         case 3:
// // //             console.log("WEDESDAY");
// // //             break;
// // //         case 4:
// // //             console.log("THURSDAY")
// // //             break;
// // //         case 5:
// // //             console.log("FRIDAY");
// // //             break;
// // //         case 6:
// // //             console.log("SATURDAY");
// // //             break;
// // //         case 7:
// // //             console.log("SUNDAY");
// // //             break;
// // //     }
// // // }
// // // let i;

// // // for(i=1;i<=10;i++){
// // //     console.log(i);
// // // }

// // // i=0;

// // // while(++i<=10){
// // //     console.log(i);
// // // }


// // // i=1;

// // // do{
// // //     console.log(i++);
// // // }while(i<=10);

// // // console.log(status_(10));
// // // find_day(1);


// // // // let a:number=1;
// // // // let b:number=2;
// // // // let string_a:string='1';
// // // // let string_b:string='2';
// // // // console.log(a==b);
// // // // console.log(a===b);
// // // // console.log(a<b);
// // // // console.log(a>b);
// // // // console.log(a<=b);
// // // // console.log(a>=b);
// // // // console.log(a!=b);
// // // // console.log(a!==b);
// // // // if(a==1 || b==1){
// // // //     console.log("Either ONE or Both one")
// // // // }
// // // // else{
// // // //     console.log("EITHER or BOTH are not ONE");
// // // // }

// // // // if(a==1 && b==2){
// // // //     console.log("Yes")
// // // // }
// // // // else{
// // // //     console.log("No");
// // // // }
// // // // let condition=a%2?"Yes":"NO";
// // // // console.log(condition);


let names:string[]=["Aswinnath"];

let nums: number[]=[1];

var name_: string="aswinnath";

let age_:number=100;

let isActive:boolean=true;

let user: [string,number]=["Aswin",20];

enum Role{
    Admin,User,Guest
}

let aswin:Role=Role.Admin;

function Message():void{
    console.log("Hello");
}

let variable:any='11';

let user_date:null=null;

let notAssigned: undefined = undefined;

function function_ (x: string): never {
  throw new Error(x);
}




