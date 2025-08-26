def Emi(amount,rate,duration):
    duration*=12
    rate=rate/12/100
    x=(1+rate)**duration
    Numerator=amount*rate*x
    Denominator=x-1
    return Numerator/Denominator

