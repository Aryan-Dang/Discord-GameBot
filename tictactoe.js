class TicTacToe{
    constructor(name1,name2){
        this.board = [[3,1,2],[6,4,5],[9,7,8]];
        this.remNos = this.board.reduce( (acc,row) => acc.concat(row) ,[]).sort();
        this.nameSign = {};
        this.nameSign[name1] = 'X';
        this.nameSign[name2] = 'O';
        this.prevMove;
        // this.signs = {}
        //game ends if someone has won or if there's a tie been declared
        this.isOver = false;
    }

    //prints board
    //print() : string
    print(){
        const formatter = (acc,row) => acc.concat(`${row[1]}    ${row[2]}    ${row[0]}\n`);
        return this.board.reduce( formatter,"");
    }

    //used to execute move on board
    move(num,player){

        const row = Math.ceil(num/3) - 1;
        const pos = num%3;
        
        //if that place hasn't been played on yet
        if(typeof this.board[row][pos] === 'number'){
            this.remNos = this.remNos.filter(num => num !== this.board[row][pos]);
            const sign = this.nameSign[player];
            console.log(Object.entries(this.nameSign))
            if(sign === undefined) return `${player} is not playing the game. nameSign is : ${this.nameSign}`;
            this.board[row][pos] = sign;
            this.prevMove = player;
            this.checkCond();
            return `${player} moved at ${num}`;
        }
        else{
            return "Can't move to that place.";
        }
    }

    //check winning condition and return winning player
    //checkCond() : string
    checkCond(){
        if(this.board[0][1] === this.board[1][2] && this.board[0][1] === this.board[2][0]){
            this.isOver = true;
            return this.board[1][1];
        }
        else if(this.board[0][0] === this.board[1][2] && this.board[0][0] === this.board[2][1]){
            this.isOver = true;
            return this.board[1][1];
        }

        for(let i = 0; i < 3; ++i){
            if(this.board[i][0] === this.board[i][1] && this.board[i][0] === this.board[i][2]){
                this.isOver = true;
                return this.board[i][0];
            }
            else if(this.board[0][i] === this.board[1][i] && this.board[0][i] === this.board[2][i]){
                this.isOver = true;
                return this.board[0][i];
            }
        }
        return "";
    }

}

module.exports.TicTacToe = TicTacToe;