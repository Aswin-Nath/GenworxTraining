const readline=require("readline");


const rl=readline.createInterface({
    input:process.stdin,output:process.stdout
})



rl.question("Enter the marks: ",(io)=>{
    var input=io.split(" ");
    const subjects={};
    var fail=false;
    var summation=0;
    var n=0;
    for(var i=0;i<input.length;i+=2){
        subjects[input[i]]=parseInt(input[i+1]);
        n++;
    }
    
    for(let [subject,mark] in Object.entries(subjects)){
        summation+=mark;
        if(mark<35){
            fail=true;
            break
        }
    }
    var avg=summation/n;
    if(fail){
        console.log("failed");
    }
    else{
        if(avg>=75){
            console.log("distinction");
        }
        else{
            console.log("passed");
        }
    }
    rl.close();
})