import React from 'react';
import './App.css';

//Defined floors
let floors = [0, 1, 2, 3, 4, 5];
let floor_order: any = {movement: false, floors: []};
let waiting_queue: any = [];

//Floor mechanics function
const handleFloor = (floor: number, movement: any, setMovement: any, current_floor: any, setCurrentFloor: any) => {

    //If elevator hit top switch to down and if hit bottom switch to up
    if (!movement.movement && current_floor === Math.max(...floors)) {
        setMovement({movement: true, floor: current_floor});
    } else if (movement.movement && current_floor === Math.min(...floors)) {
        setMovement({movement: false, floor: current_floor});
    }

    // if Floors are going down and there's entry that is also going in the same direction then it will be followed
    //False is up and true is down
    if (movement.movement === floor_order.movement || floor_order.floors.length === 0) {
        //add floor if it's not already in queue
        floor_order.floors.indexOf(floor) === -1 ? floor_order.floors.push(floor) : console.log("This floor already in queue");
    } else {
        //if is not going in same direction it will be put on a waiting queue
        waiting_queue.indexOf(floor) === -1 ? waiting_queue.push(floor) : console.log("This floor already in the waiting queue");
    }

    //If waiting queue has floors waiting and the floor queue is empty the floors that were going into a different direction will be followed
    if (waiting_queue.length > 0 && floor_order.floors.length === 0) {
        waiting_queue.forEach((waiting_floor: number) => floor_order.floors.indexOf(waiting_floor) === -1 ? floor_order.floors.push(waiting_floor) : console.log("This floor already in queue"));
    }

    //Checks if the floors are going up or down
    if (!movement.movement) {
        //ASC
        floor_order.floors.sort((a: number, b: number) => b - a);
        floor_order.movement = false;
    } else {
        //DESC
        floor_order.floors.sort((a: number, b: number) => a - b);
        floor_order.movement = true;
    }

    //Interval to switch floors
    let refreshIntervalId = setInterval(() => {

        if (floor_order.floors.length > 0) {
            setCurrentFloor(floor_order.floors[0]);
        }

    }, 5000);


    //Stop moving floors when there are no floors in queue
    if (typeof floor_order.floors !== 'undefined' && floor_order.floors.length > 0) {

    } else {
        clearInterval(refreshIntervalId);
    }

    console.log(floor_order.floors);
};


const App = () => {
    //False is up and true is down
    const [movement, setMovement] = React.useState<object>({
        movement: false,
        floor: 0
    });
    const [current_floor, setCurrentFloor] = React.useState<number>(0);

    React.useEffect(() => {
        floor_order.floors.shift();
    }, [current_floor]);

    React.useEffect(() => {
        console.log(movement);
    }, [movement]);

    return (
        <div className="container">
            <h1>Elevator Playground</h1>
            <div className="floors-wrapper">
                {floors.map((index, floor) => {
                    return (
                        <div className="floors" key={index}>
                            <div className="arrows">
                                <span className="arrow arrow-up"
                                      onClick={() => setMovement({
                                          movement: false,
                                          floor: floor
                                      })}/>
                                <span className="arrow arrow-down"
                                      onClick={() => setMovement({
                                          movement: true,
                                          floor: floor
                                      })}/>
                            </div>
                            <div
                                className={current_floor === floor ? "floor active" : "floor"}>
                                <span className="floor-number">{floor}</span>
                                {current_floor === floor &&
                                <div className="elevator-buttons">
                                    {floors.map((index, floor) => {
                                        return (
                                            <span key={index}
                                                  className="elevator-button"
                                                  onClick={() => handleFloor(floor, movement, setMovement, current_floor, setCurrentFloor)}>{floor}</span>
                                        )
                                    })}
                                </div>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};


export default App;
