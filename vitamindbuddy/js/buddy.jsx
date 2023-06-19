import React from 'react';
import PropTypes from 'prop-types';

class Buddy extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { buddyInfo } = this.props;

        // console.log('buddy props');
        // console.log(buddyInfo);

        return (
            <div id="buddy">
                <div id="buddy-appearance">
                    <img 
                        id="game-body"
                        src={"/static/src/puffle/" + buddyInfo.bodyColor}
                        alt="Bud-D body"
                    />
                    <img 
                        id="game-eyes" 
                        src="/static/src/puffle/puffle_eyes.png"
                        alt="Bud-D eyes"
                    />
                    { buddyInfo.glasses && 
                        <img 
                            className="game-accessory" 
                            src={"/static/src/accessories/" + buddyInfo.glasses }
                            alt="Bud-D accessory"
                        />
                    }
                    { buddyInfo.hat &&
                        <img 
                            className="game-accessory" 
                            src={"/static/src/accessories/" + buddyInfo.hat }
                            alt="Bud-D accessory"
                        />
                    }
                </div>
                <div id="buddy-name">
                    {buddyInfo.puffleName}
                </div>
            </div>
        );
    }
}

export default Buddy;