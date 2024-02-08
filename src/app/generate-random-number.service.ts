export class GenerateRandomNum{
    static SINGLE_MODE = "SINGLE_MODE";
    static DOUBLE_MODE = "DOUBLE_MODE";
    static TRIPLE_MODE = "TRIPLE_MODE";

     //This method will generate a random number around an int
     static getRandomNumBasedOnAnInt(num: number,mode: string){
        //var rng = Random();
    let increaseOrDecreasePercentage : number = 0;
    if(mode == GenerateRandomNum.SINGLE_MODE ){
      increaseOrDecreasePercentage = 0.5;
    }else if(mode == GenerateRandomNum.DOUBLE_MODE){
      increaseOrDecreasePercentage = 1;
    }else if(mode == GenerateRandomNum.TRIPLE_MODE){
      increaseOrDecreasePercentage = 3;
    }
    const randomSeed = Math.random() * 10;

    //Increase or decrease range
    let value = Math.floor(num*increaseOrDecreasePercentage/100);

    //IF the value of the coin is small <1
    if(value == 0){
      return  Math.abs((Math.random()/10 + Math.random()/10- Math.random()/10 -Math.random()/10 + num));
    }

      //Increase the value (30%)
      if(randomSeed == 1 || randomSeed ==2 || randomSeed ==3){
        return Math.abs( Math.random() * value + Math.random() * value  - Math.random() * value  + Math.random()  + Math.random()- Math.random() - Math.random() + num);
      }

      //Decrease the value (30%)
      else if(randomSeed == 5 || randomSeed == 6|| randomSeed == 7){
        return  Math.abs(-Math.random() * value - Math.random() * value + Math.random() * value + Math.random() + Math.random() - Math.random() - Math.random() + num)
                //return (-rng.nextInt(value) -rng.nextInt(value) + rng.nextInt(value)+ rng.nextDouble() + rng.nextDouble()- rng.nextDouble() -rng.nextDouble() + num).abs();
      }
      //Mix between increase and decrease
      else{
        return Math.abs(- Math.random() * value - Math.random() * value + Math.random() * value + Math.random() * value + Math.random() + Math.random() - Math.random() - Math.random() + num)
        //return (-rng.nextInt(value)-rng.nextInt(value)+rng.nextInt(value)+rng.nextInt(value) + rng.nextDouble() + rng.nextDouble()- rng.nextDouble() -rng.nextDouble() + num).abs();
      }
     }
}