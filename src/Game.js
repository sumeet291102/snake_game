import {useState, useEffect} from 'react'

const Game = (props) => {

    const row_size=15;
    const column_size=15;
    const board_size=row_size*column_size;
    
    const [board, set_board] = useState(new Array(board_size).fill(0));

    const [snake, set_snake] = useState(64);

    const [snake_body, set_snake_body] = useState([]);

    const [snake_st, set_snake_st] = useState(new Set());

    const [direction, set_direction] = useState(-1);

    const [prev_direction, set_prev_direction] = useState(1);

    const [food, set_food] = useState(175);

    const [start, set_start] = useState(false);
    const [score, set_score] = useState(0);
    const [high_score, set_high_score] = useState(0);

    const handle_start_and_pause_game = () => {
        set_start(!start);

        if(!start) {
            console.log(prev_direction);
            set_direction(prev_direction);
        }
        else {
            set_prev_direction(direction);
            set_direction(-1);
        }
    }

    const handle_restart_game = () => {
        set_direction(-1);
        set_snake(64);
        set_food(175);
        set_snake_body([]);
        set_snake_st(new Set());
        set_high_score(Math.max(score,high_score));
        set_start(false);
        set_score(0);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            
            if(direction===0 || direction===1 || direction===2 || direction===3) {

                var temp;
                if(direction===0) {
                    temp=(snake-row_size+board_size)%board_size;
                }
                if(direction===1) {
                    temp=((snake+1)%row_size===0)? snake-row_size+1 : snake+1;
                }
                if(direction===2) {
                    temp=(snake+row_size)%board_size;
                }
                if(direction===3) {
                    temp=((snake)%row_size===0)? snake+row_size-1 : snake-1;
                }
                
                if(snake_st.has(temp)) {
                    set_direction(-1);
                    set_snake(64);
                    set_food(175);
                    set_snake_body([]);
                    set_snake_st(new Set());
                    set_high_score(Math.max(score,high_score));
                    set_start(false);
                    set_score(0);
                }
    
    
                else {
                    if(temp===food) {
                        set_food(Math.floor(Math.random()*board_size));
                        set_snake_st(prev => {
                            prev.add(temp);
                            return prev;
                        })
                        set_snake_body([temp, ...snake_body]);
                        set_score(snake_body.length);
                    }
                    else {
                        const copy = snake_body;
                        const popped = copy.pop();
                        set_snake_st(prev => {
                            prev.add(temp);
                            return prev;
                        })
        
                        set_snake_st(prev => {
                            prev.delete(popped);
                            return prev;
                        })
                        set_snake_body([temp, ...copy]);
                    }
        
                    set_snake(temp);
                }
            }
            
        }, 110);


        return () => clearInterval(interval);
    })

    useEffect(() =>{

        if(direction!==-1) set_start(true); 

        const handle_keydown = (e) => {
            if(e.key.localeCompare("ArrowUp")===0 && direction!==2) {
                set_direction(0);
            }
            if(e.key.localeCompare("ArrowRight")===0 && direction!==3) {
                set_direction(1);
            }
            if(e.key.localeCompare("ArrowDown")===0 && direction!==0) {
                set_direction(2);
            }
            if(e.key.localeCompare("ArrowLeft")===0 && direction!==1) {
                set_direction(3);
            }
        }

        window.addEventListener("keydown", handle_keydown)

        return () => {
            window.removeEventListener("keydown", handle_keydown);
        }
    })


    return (
        <div className="container">
            <div className="scores">
                <p>score: {score}</p>
                <p>high score: {high_score}</p>
            </div>
            <div className="func_button">
                <button onClick={handle_start_and_pause_game}>{(start) ? "pause" : "start"}</button>
                <button onClick={handle_restart_game}>restart</button>
            </div>
            <div className="game">
                {
                    board.map((cell, idx) => {
                        return(<div key={idx} className= {`cell ${(idx===food) && "food_cell"} ${(snake_st.has(idx) || idx===snake) && "snake_cell"}`} >  </div>)
                    })
                }
            </div>
        </div>
    )
}

export default Game;
