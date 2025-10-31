function Logger(constructor: Function) {
  console.log("Class Created:", constructor.name);
}

@Logger
class Person {
  constructor(public name: string) {}
}
