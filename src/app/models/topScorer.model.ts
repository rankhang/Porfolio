export class TopScorer{
    score: number;
    name: string;
    joinedDate: Date;
    gameMode: string;
   

    constructor(score: number, name: string, joinedDate: Date, gameMode: string){
        this.score = score;
        this.name = name;
        this.joinedDate = joinedDate;
        this.gameMode = gameMode;
        
    }
}