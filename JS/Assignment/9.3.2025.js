class NoAnswerError extends Error{};
class InvalidInput extends Error{};
class ExamTimeOver extends Error{};


const submitAnswer=(answer)=>{
    if(answer==null){
        throw new NoAnswerError("No Answer selected");
    }
    if(isNaN(answer)){
        throw new InvalidInput("Invalid Input");
    }
    if(answer>1){
        throw new ExamTimeOver("Exam time is over");
    }
    return "Answers submitted successfully";
}
for(let i of [null,"A",2,1]){
    try{
        console.log(submitAnswer(i));
    }
    catch(error){
        console.log("Error",error.message);
    }
}
