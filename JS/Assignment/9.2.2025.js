const arr=[];
for(let i=1;i<=50;i++){
    arr.push(i);
}
function* paginate(arr,pageSize){
    let index=0;
    while(index<arr.length){
        yield arr.slice(index,index+pageSize);
        index+=pageSize;
    }
}

const instance=paginate(arr,10);

console.log(instance.next().value);
console.log(instance.next().value);
console.log(instance.next().value);
console.log(instance.next().value);
console.log(instance.next().value);
console.log(instance.next().value);