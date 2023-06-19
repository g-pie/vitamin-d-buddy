import React from 'react';
import PropTypes from 'prop-types';
import Task from './task';
import Buddy from './buddy';
import GameLeft from './game-left';

function shuffleArray(array) {
    let i = array.length - 1;
    for (; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leaderboard: [],
            activeTask: {
                id: -1, 
                title: "",
                pointVal: ""
            },
            savedTasks: [],
            suggestedTasks: [],
            playerStats: {
                rank: "",
                level: 0,
                numPoints: 0,
                vitDLevel: 0,
                numTasksCompleted: 0
            },
            buddy: {
                puffleName: "Buddy",
                bodyColor: "purple_puffle.png",
                glasses: "",
                hat: ""
            },
        }

        this.loadData = this.loadData.bind(this);
        this.handleStartTask = this.handleStartTask.bind(this);
        this.handleSaveTask = this.handleSaveTask.bind(this);
        this.handleSkipTask = this.handleSkipTask.bind(this);
    }

    componentDidMount() {
        // This line automatically saves this.props.url to the const variable url
        const { url } = this.props;
    
        // Call REST API to get the post's information
        this.loadData(url);
    }

    loadData(url) {
        // event.preventDefault();

        // fetch(url, { credentials: 'same-origin' })
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    console.log('not ok dude');
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                const tasks = data.tasks;
                // this.setState((prevState) => ( {
                //     ...prevState,
                //     activeTask: tasks.filter((task) => task.status === 3).map((activeTask) => [...prevState.activeTask, activeTask]),
                //     savedTasks: tasks.filter((task) => task.status === 2).map((savedTask) => [...prevState.savedTasks, savedTask]),
                //     suggestedTasks: tasks.filter((task) => task.status === 1).map((suggestedTask) => [...prevState.suggestedTasks, suggestedTask])
                // }));
                this.setState((prevState) => ( {
                    ...prevState,
                    activeTask: tasks.find((task) => task.status === 3),
                    suggestedTasks: tasks.map((suggestedTask) => [...prevState.suggestedTasks, suggestedTask])
                }));
                console.log('fetch');
                // console.log(tasks);
                // console.log('state');
                // console.log(this.state);
            })
            .catch((error) => {
                console.log(error);
            });

        // load leaderboard and player stats
        fetch('/api/v1/leaderboard/')
            .then((response) => {
                if (!response.ok) {
                    console.log('not ok dude');
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                const leaderboard = data.leaderboard;
                const playerStats = data.player;
                this.setState((prevState) => ({
                    ...prevState,
                    leaderboard: leaderboard,
                    playerStats: playerStats
                }));
            })
            .catch((error) => {
                console.log(error);
            });

        fetch('/api/v1/whoami/')
            .then((response) => {
                if (!response.ok) {
                    console.log('not ok dude');
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                this.setState((prevState) => ({
                    ...prevState,
                    buddy: data.buddy
                }));
                console.log('buddy fetch');
                console.log(this.state.buddy);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleSkipTask(e) {
        console.log('game skip');
        e.preventDefault();

        const skipTaskId = parseInt(e.target.taskid.value);

        this.setState((prevState) => ({
            ...prevState,
            savedTasks: prevState.savedTasks.filter((obj) => {
                const saved = obj[0];
                return saved.id !== skipTaskId;
            }),
            suggestedTasks: prevState.suggestedTasks.filter((obj) => {
                const suggested = obj[0];
                return suggested.id !== skipTaskId;
            })
        }));

        console.log('skip state');
    }

    handleSaveTask(e) {
        console.log('game save');
        e.preventDefault();

        const saveTaskId = parseInt(e.target.taskid.value);
        let suggestedTasks = this.state.suggestedTasks;

        // get the saved task from suggested tasks list
        let savedTask = undefined;
        savedTask = suggestedTasks.find((obj) => {
            // console.log('saved task loop');
            // console.log(obj);
            const task = obj[0];
            return task.id === saveTaskId;
        });

        suggestedTasks = suggestedTasks.filter((obj) => {
            const task = obj[0];
            return task && task.id !== saveTaskId;
        });

        // console.log(suggestedTasks);
        this.setState((prevState) => ({
            ...prevState,
            savedTasks: [...prevState.savedTasks, savedTask],
            suggestedTasks: suggestedTasks
        }));

        console.log('saved state');
    }

    handleStartTask(e) {
        console.log('game start');
        e.preventDefault();

        const startTaskId = parseInt(e.target.taskid.value);
        const suggestedTasks = this.state.suggestedTasks;

        let startTask = [{
            id: -1, 
            title: "",
            pointVal: ""
        }];
        startTask = suggestedTasks.find((obj) => {
            const suggested = obj[0];
            console.log(obj);
            console.log(suggested);
            console.log(startTaskId);
            // console.log(suggested.id === startTaskId)
            return suggested.id === startTaskId;
        })

        if (!startTask || startTask[0].id === -1) {
            console.log('not in suggested');
            const savedTasks = this.state.savedTasks;
            startTask = savedTasks.find((obj) => {
                const saved = obj[0];
                return saved.id === startTaskId;
            })
        } else {
            console.log('found in suggested');
        }

        // console.log(startTask);
        startTask = startTask[0];
        // console.log(startTask);

        // TODO: call handleskiptask? handle if active already defined
        this.setState((prevState) => ({
            ...prevState,
            activeTask: startTask,
            savedTasks: prevState.savedTasks.filter((obj) => {
                const saved = obj[0];
                return saved.id !== startTaskId;
            }),
            suggestedTasks: prevState.suggestedTasks.filter((obj) => {
                const suggested = obj[0];
                return suggested.id !== startTaskId;
            })
        }));
        // if (this.state.activeTask) {
        //     const prevActiveTask = this.state.activeTask;
        //     this.setState((prevState) => ({
        //         ...prevState,
        //         activeTask: startTask,
        //         savedTasks: prevState.savedTasks.filter((obj) => {
        //             const saved = obj[0];
        //             return saved.id !== startTaskId;
        //         }),
        //     }));

        //     this.setState((prevState) => ({
        //         ...prevState,
        //         savedTasks: [...prevState.savedTasks, prevActiveTask]
        //     }))
        // } else {
        //     this.setState((prevState) => ({
        //         ...prevState,
        //         activeTask: startTask,
        //         savedTasks: prevState.savedTasks.filter((obj) => {
        //             const saved = obj[0];
        //             return saved.id !== startTaskId;
        //         }),
        //         suggestedTasks: prevState.suggestedTasks.filter((obj) => {
        //             const suggested = obj[0];
        //             return suggested.id !== startTaskId;
        //         })
        //     }));
        // }

        console.log('start state');
    }

    handleTaskFinished(e) {
        e.preventDefault();
        const activeTask = this.state.activeTask;
        // const taskid = parseInt(e.target.value);
        const pointVal = activeTask.pointVal;
        const newPointVal = this.state.playerStats.numPoints + pointVal;
        let level = this.state.playerStats.level;

        console.log("newPointVal = " + newPointVal);
        console.log("level = " + level);
        
        // check if player leveled up
        if (newPointVal >= (level * 100)) {
            level = level + 1
            console.log('level up');
        } else {
            console.log('update playerStats');
        }

        this.setState((prevState) => ({
            ...prevState,
            activeTask: {
                id: -1, 
                title: "",
                pointVal: ""
            },
            playerStats: {
                ...prevState.playerStats,
                level: level,
                numPoints: newPointVal,
                vitDLevel: prevState.playerStats.vitDLevel + (pointVal / 10),
                numTasksCompleted: prevState.playerStats.numTasksCompleted + 1
            }
        }));

        console.log(this.state.playerStats);

        // post update to player account
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: newPointVal, level: level })
        };
        fetch('/api/v1/score/', requestOptions)
            // .then(response => response.json())
    
    }

    render() {
        const { leaderboard, activeTask, suggestedTasks, savedTasks, playerStats, buddy } = this.state;

        // console.log('active');
        // console.log(activeTask);

        // get 5 random tasks
        let tasks = [];
        if (suggestedTasks.length > 5) {
            tasks = shuffleArray(suggestedTasks).slice(0, 5);
            // tasks = suggestedTasks.slice(0, 5);
        } else {
            tasks = suggestedTasks;
        }

        // console.log(this.state);

        return (
            <div id="game-page">
                <div id="game-background">
                    <div id="background-top">
                        <img 
                            src="/static/src/game/mountain_background.png" 
                            alt="mountain range" 
                            className="mountain" 
                        />
                        <img 
                            src="/static/src/game/mountain_middleground.png" 
                            alt="mountain range" 
                            className="mountain" 
                        />
                        <img 
                            src="/static/src/game/mountain_foreground.png" 
                            alt="mountain range" 
                            className="mountain" 
                        />
                    </div>
                    <div id="background-bottom">
                    </div>
                </div>

                <GameLeft 
                    key={playerStats.numPoints}
                    leaderboard={leaderboard}
                    playerStats={playerStats}
                />

                <Buddy buddyInfo={buddy}/>
                
                {(activeTask && activeTask.id !== -1) ? (
                    <div id="active_task_box">
                        <div id = "active_task_box_title">
                        Active
                        </div>
                        <span>
                            <span id="active-task">
                                {activeTask.name}&nbsp;
                            </span>
                            <span id="active-task-points">
                                <i>{activeTask.pointVal} points</i>
                            </span>
                        </span>
                        <button onClick={(e) => this.handleTaskFinished(e)} className="blue-button">Task finished!</button>
                    </div>
                ) : (
                    <div id="active_task_box">
                        <div id = "active_task_box_title">
                            Active
                        </div>
                        <div id="active-prompt">
                            No task started. Start a task from the right side!
                        </div>
                    </div>
                )}
                                    
                <div id="tasks_box">
                    <div id="tasks-title">Tasks List</div>

                    <div id="saved-section" className="task-section">
                        {savedTasks.map((obj) => {
                            const task = obj[0];
                            // console.log('task');
                            // console.log('task loop');
                            // console.log(obj);
                            // console.log(task);
                            return (task.id !=='undefined' &&
                                <Task
                                    key={task.id * -1}
                                    taskid={task.id}
                                    title={task.name}
                                    pointVal={task.pointVal}
                                    isSuggested={false}
                                    onSkip={this.handleSkipTask}
                                    onSave={this.handleSaveTask}
                                    onStart={this.handleStartTask}
                                />
                            );
                        })}
                    </div>

                    <div className="task-section" id="suggested-section" >
                        <div className="task-section-title" id="suggested-title">
                            Suggested
                        </div>
                        {tasks.map((obj) => {
                            const task = obj[0];
                            // console.log('task');
                            // console.log('task loop');
                            // console.log(task);
                            return (task.id !=='undefined' &&
                                <Task
                                    key={task.id}
                                    taskid={task.id}
                                    title={task.name}
                                    pointVal={task.pointVal}
                                    isSuggested={true}
                                    onSkip={this.handleSkipTask}
                                    onSave={this.handleSaveTask}
                                    onStart={this.handleStartTask}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

Game.propTypes = {
    url: PropTypes.string.isRequired,
};

export default Game;