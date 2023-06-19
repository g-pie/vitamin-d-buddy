"""
Vitamin-D Bud-D Rest API

Includes urls:
/api/tasks/
"""
from flask import request, jsonify
from vitamindbuddy.model import close_db, get_db, get_user
import vitamindbuddy


@vitamindbuddy.app.route('/api/v1/tasks/')
def get_tasks():
    """Return tasks available via API."""

    # Connect to db
    connection = get_db()

    # Check if player tasks requested
    if request.args and request.args['player']:
        player = request.args['player']
        player_info = get_user(player)
        player_id = player_info['id']
        
        # Get player's tasks
        command = f'SELECT * FROM playersTasks WHERE playerid={player_id};'
    else:
        # Get system tasks
        command = 'SELECT * FROM tasks;'

    cur = connection.execute(command)
    tasks = cur.fetchall()

    close_db(connection)

    context = {
        'tasks': tasks,
        'url': '/api/v1/tasks'
    }

    return jsonify(**context), 200
