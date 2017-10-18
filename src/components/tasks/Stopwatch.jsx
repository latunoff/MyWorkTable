import React from 'react';

import Button from './Button';

class StopWatch extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            running: false,
            elapsed: 0,
            lastTick: 0
        };

        this.tick = this.tick.bind(this);
    }

    componentDidMount(){
        this.interval = setInterval(this.tick, 1000);
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    tick(){
        if(this.state.running){
            let now = Date.now();
            let diff = now - this.state.lastTick;

            this.setState({ 
                elapsed: this.state.elapsed + diff,
                lastTick: now
            });
        }
    }

    Start(){
        this.setState({ running: true, lastTick: Date.now() });
    }
    Pause(){
        this.setState({ running: false });
    }
    Stop(){
        this.setState({ 
            running: false,
            elapsed: 0,
            lastTick: 0 });
    }

    format(ms){
       let total =  Math.floor(ms / 1000);
       let minutes = Math.floor(total / 60);
       let seconds = total % 60;
       return `${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0'+seconds}`;
    }

    render(){
        let time = this.format(this.state.elapsed);
        
        return(
            <section className="stopwatch">
                <div className="stopwatch-time">{time}</div>
                <div className="stopwatch-control">
                    {this.state.running ?
                        <Button className="icon" icon="pause" onClick={this.Pause.bind(this)} />
                        :
                        <Button className="icon" icon="play_arrow" onClick={this.Start.bind(this)} />
                    }
                    <Button className="icon" icon="stop" onClick={this.Stop.bind(this)} />
                </div>
            </section>
        );
    }
}

export default StopWatch;