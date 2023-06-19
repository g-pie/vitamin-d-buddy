"""
Vitamin-D Bud-D Rest API

Includes urls:
/api/v1/leaderboard/
"""
from flask import request, jsonify, session
from vitamindbuddy.model import close_db, get_db, get_user
import vitamindbuddy


@vitamindbuddy.app.route('/api/v1/leaderboard/')
def get_leaderboard():
    """Return tasks available via API."""

    # Connect to db
    connection = get_db()

    # Get leaderboard rankings from db
    cur = connection.execute(
        'SELECT * FROM leaderboard;'
    )

    leaderboard = cur.fetchall()
    leaderboard = sorted(leaderboard, key=lambda i: i['score'], reverse=True)

    playerid = session['playerid']
    player = leaderboard[0]
    rank = -1 

    # Get player and rank
    for i, user in enumerate(leaderboard):
        if user['id'] == playerid:
            player = user
            rank = i + 1
    
    # Close db
    close_db(connection)

    context = {
        'leaderboard': leaderboard,
        'player': {
            'rank': rank,
            'level': player['level'],
            'numPoints': player['score'],
            'vitDLevel': 0,
            'numTasksCompleted': 0
        },
        'url': '/api/v1/leaderboard/'
    }

    return jsonify(**context), 200

@vitamindbuddy.app.route('/api/v1/score/', methods = [ 'PUT' ])
def update_score():

    if 'username' not in session or 'playerid' not in session:
        return jsonify({'message': 'invalid access'}), 402

    score = request.json['score']
    level = request.json['level']

    # Connect to db
    connection = get_db()

    # Update leaderboard
    cur = connection.execute(
        'UPDATE leaderboard '
        'SET level=?, score=? '
        'WHERE playerid=?;',
        [ level, score, session['playerid'] ]
    )

    # Close 
    close_db(connection)

    context = {
        'score': score,
        'level': level,
        'url': '/api/v1/score/'
    }

    return jsonify(**context), 200

