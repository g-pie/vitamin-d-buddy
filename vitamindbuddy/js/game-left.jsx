import React from 'react';

class GameLeft extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leaderboard: [],
            rank: "",
            level: 0,
            numPoints: 0,
            vitDLevel: 0,
            numTasksCompleted: 0,
        }
    }

    componentDidMount() {
        const { leaderboard, playerStats } = this.props;

        // console.log('left props');
        // console.log(this.props);

        this.setState((prevState) => ({
            ...prevState,
            leaderboard: leaderboard,
            rank: playerStats.rank,
            level: playerStats.level,
            numPoints: playerStats.numPoints,
            vitDLevel: playerStats.vitDLevel,
            numTasksCompleted: playerStats.numTasksCompleted
        }));
    }

    render() {
        const { rank, level, numPoints, vitDLevel, numTasksCompleted } = this.state;

        // console.log('leaderboard state');
        // console.log(this.state);

        if (!scorePct || scorePct < 0) {
            // console.log('less');
            scorePct = "0";
        }

        let rankVal = rank;
        let levelVal = level;
        let numPointsVal = numPoints;

        if (rankVal < 0) {
            rankVal = "No rank";
            levelVal = 1;
            numPointsVal = 0;
        } else if (rankVal == 1) {
            rankVal = "1st";
        } else if (rankVal == 2) {
            rankVal = "2nd";
        } else if (rankVal = 3) {
            rankVal = "3rd";
        } else {
            rankVal = rankVal.toString() + "th";
        }

        const nextLevel = levelVal + 1;
        const nextLevelPts = 100 * nextLevel;
        const numPointsRemaining = nextLevelPts - numPointsVal;
        let scorePct = Math.ceil((numPointsVal / (nextLevelPts - 100)) * 100);

        if (!scorePct) { 
            scorePct = "0";
        }

        // console.log(scorePct);

        return (
            <div id="game-left-side">
                <div id="game-left-content">
                    <div id="game-menu">
                        <a href="/" className="game-menu-btn">
                            <img src="/static/src/menu-buttons/home.png" alt="home button" />
                        </a>
                        <a href="" className="game-menu-btn">
                            <img src="/static/src/menu-buttons/settings.png" alt="settings button" />
                        </a>
                        <a href="" className="game-menu-btn">
                            <img src="/static/src/menu-buttons/trophy.png" alt="leaderboard button" />
                        </a>
                    </div>
                    <div id= "level-progress">
                        <div className="circular">
                            <div className="inner"></div>
                            <div className="number">
                                {scorePct}%
                            </div>
                            <div className="circle">
                                <div className="bar left">
                                    <div className="progress"></div>
                                </div>
                                <div className="bar right">
                                    <div className="progress"></div>
                                </div>
                            </div>
                        </div>

                        <span id="points_until_next_level_statement">
                            <span id="points_until_next_level">
                                {numPointsRemaining}&nbsp;
                            </span>
                             Points until Level&nbsp;
                            <span id="next_level">
                                {nextLevel}
                            </span>
                        </span>
                    </div>

                    <div id="bars_box">
                        <div className="center_bars"> 
                            <div id="vitamin_d_line">
                                <div id="vitamin_d_title">
                                    Vitamin D
                                </div>
                                <div id="vitamin_d_level">
                                    {vitDLevel}/10
                                </div> 
                            </div>
            
                            <div id="vitamin_d_outer">
                                <div id="vitamin_d_inner"></div>
                            </div>
                        </div>
        
                        <div className = "center_bars">
                            <div id = "tasks_completed_line">
                                <div id = "tasks_completed_title">
                                    Tasks Completed
                                </div>
                                <div id = "tasks_completed_level">
                                    {numTasksCompleted}/3
                                </div> 
                            </div>
                    
                            <div id="tasks_completed_outer">
                                <div id="tasks_completed_inner"></div>
                            </div>
                        </div>
                    </div>
                
                    <div id="leaderboard_short">
                    <div id="leaderboard_top_line">
                        <div id="leaderboard_word">Leaderboard</div>
                            <div id="leaderboard_user_position">
                                {rankVal}
                            </div>
                        </div>

                        {rankVal ? (
                            <span className="leaderboard_2nd_line">
                                <span className="leaderboard-row">
                                    {rankVal} (You)
                                </span>
                                <span id = "player_points">
                                    {numPointsVal} points
                                </span>
                            </span>
                        ) : (
                            <span className="leaderboard_2nd_line">
                                <span className="leaderboard-row">
                                    --
                                </span>
                                <span id = "player_points">
                                    --
                                </span>
                            </span>
                        )}

                        <hr />
        
                        <div className= "leaderboard_2nd_line">
                            <span className="leaderboard-row">
                                1st maizey
                            </span>
                            <span id = "first_place_player_points">
                                1648 points
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default GameLeft;