"""
Vitamin-D Bud-D tasks POST route(s).

URLs include:
/accounts/?target=URL
"""
# from flask import request, session, redirect, helpers, render_template, url_for, flash, abort, make_response
import vitamindbuddy
import urllib.request, json 
from vitamindbuddy.errors import HttpError
from vitamindbuddy.model import get_db, TaskStatus
from flask import request, redirect, url_for, abort


# @vitamindbuddy.app.route('/tasks/<int:playerid>/', methods = [ 'POST' ])
# def add_system_tasks(playerid):
#     """Initialize player's tasks with system tasks."""
#     # tasks = request.get(url_for('get_tasks'))
    
#     with urllib.request.urlopen(url_for('get_tasks')) as url:
#         tasks = json.loads(url.read().decode())

#         connection = get_db()

#         cur = connection.execute(
#             # 'INSERT INTO playersTasks '
#         ) 


@vitamindbuddy.app.route('/tasks/<int:taskid>/', methods = [ 'PUT' ])
def update_task(taskid):
    """Update task list in database."""

    status = request.args.get('status', default=TaskStatus.SUGGESTED.value, type=int)
    status = TaskStatus(status)

    # Check if valid status
    if not status or status == TaskStatus.INVALID:
        abort(404)

    # Connect to database
    connection = get_db()

    connection.execute(
        'UPDATE playerTasks '
        'SET status=? '
        'WHERE taskid=?;',
        [ status, taskid ]
    )

    return redirect(url_for('game'))
