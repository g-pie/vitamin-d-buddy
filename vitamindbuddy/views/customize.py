"""
Vitamin-D Bud-D customize puffle view.

URLs include:
/customize/
"""
# from vitamindbuddy.config import TEMPLATES_FOLDER, UPLOAD_FOLDER
# from insta485.model import get_db, gen_timestamp, gen_query_url
import threading
from flask import request, session, redirect, url_for, render_template 
# import flask
import vitamindbuddy
from vitamindbuddy.model import get_db

@vitamindbuddy.app.route('/customize/', methods = ['GET', 'POST'])
def customize():
    """Return customize page or post puffle customization to db."""

    if request.method == 'POST':
        # TODO: can i just store request.json in here?
        # buddy_info = request.get_json()

        print('* POSTing buddy')
        # post_buddy(buddy_info)
        post_buddy()
        print('* Buddy POSTed')

        return redirect(url_for('game'), 302)

    # TODO: create context with list of options and associated imgs
    context = {
        'buddyName': 'Buddy'
    }

    return render_template('customize.html', **context)


def post_buddy():
    """Post puffle customization to db for user."""
    # Check if user has logged into account/as guest
    # if 'username' not in session:
    #     return redirect(url_for('index'), 302)

    name = request.form['buddyName']
    color = request.form['bodyColor']
    glasses = request.form['glasses']
    hat = request.form['hat']

    connection = get_db()

    print('playerID:', session['playerid'])

    # Insert puffle into db
    cur = connection.execute(
        'INSERT INTO puffles '
        '(playerid, puffleName, bodyColor, glasses, hat) '
        'VALUES (?, ?, ?, ?, ?);',
        [ session['playerid'], name, color, glasses, hat]
    )

    session['puffleid'] = cur.lastrowid
