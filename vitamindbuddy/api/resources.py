"""
Vitamin-D Bud-D Rest API

Includes urls:
/api/resources/
/api/v1/whoami/
"""
import flask
import vitamindbuddy
from vitamindbuddy.model import get_db, close_db

@vitamindbuddy.app.route('/api/v1/')
def api_resources():
    """Return links available via API."""

    context = {
        'tasks': '/api/tasks/',
        'url': '/api/v1/'
    }

    return flask.jsonify(**context), 200

@vitamindbuddy.app.route('/api/v1/whoami/')
def whoami():

    if 'username' not in flask.session:
        context = {'message': 'invalid_access'}
        return flask.jsonify(**context), 404
    
    playerid = flask.session['playerid']

    # Connect to db
    connection = get_db()

    # Get buddy info
    cur = connection.execute(
        'SELECT * FROM puffles WHERE playerid=?;',
        [ playerid ]
    )

    buddy = cur.fetchone()

    context = {
        'playerid': playerid,
        'buddy': buddy
    }

    close_db(connection)

    return flask.jsonify(**context), 200