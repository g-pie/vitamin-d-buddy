import React from 'react';
import PropTypes from 'prop-types';

class Task extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSkip(event) {
        event.preventDefault();
        this.props.onSkip(event);
    }

    handleSave(event) {
        // console.log('task save');
        event.preventDefault();
        this.props.onSave(event);
    }

    handleStart(event) {
        event.preventDefault();
        this.props.onStart(event);
    }

    render() {
        // console.log(this.props);
        return (
            <div className="task">
                <div className="task-name">
                    {this.props.title}
                </div>
                <div className="task-info">
                    <div className="task-point-val">
                        <i>
                            {this.props.pointVal} pts
                        </i>
                    </div>
                    <div className="task-buttons">
                        <div className="make_active_button task-button">
                            <form
                                onSubmit={(e) => this.handleStart(e)}
                                method="post"
                                encType="multipart/form-data"
                            >
                                <input
                                    type="hidden"
                                    name="taskid"
                                    value={this.props.taskid}
                                />
                                <input
                                    type="image"
                                    name="submit" 
                                    src="/static/src/menu-buttons/play_logo.png"
                                />
                            </form>
                        </div>
                        {(this.props.isSuggested) && (
                            <div className="save_button task-button">
                                <form
                                    onSubmit={(e) => this.handleSave(e)}
                                    method="post"
                                    encType="multipart/form-data"
                                >
                                    <input
                                        type="hidden"
                                        name="taskid"
                                        value={this.props.taskid}
                                    />
                                    <input
                                        type="image"
                                        name="submit" 
                                        src="/static/src/menu-buttons/save_logo.png"
                                    />
                                </form>
                            </div>
                        )}
                        <div className="delete_button task-button">
                            <form
                                onSubmit={(e) => this.handleSkip(e)}
                                method="post"
                                encType="multipart/form-data"
                            >
                                <input
                                    type="hidden"
                                    name="taskid"
                                    value={this.props.taskid}
                                />
                                <input
                                    type="image"
                                    name="submit" 
                                    src="/static/src/menu-buttons/delete_logo.png"
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Task.propTypes = {

}

export default Task;