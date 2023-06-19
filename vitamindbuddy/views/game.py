"""
Vitamin-D Bud-D Game view.

URLs include:
/game
"""
from flask import session, redirect, url_for, render_template
from vitamindbuddy.model import get_db, gen_random_tasks
import vitamindbuddy

@vitamindbuddy.app.route('/game/')
def game():
    """Display /game/ route."""

    tasks = gen_random_tasks()

    suggested_tasks = []

    # Check if player has started a session
    if 'username' not in session or 'playerid' not in session:
        return redirect(url_for('index'), 302)

    # Connect to db
    connection = get_db()

    # Get player's buddy
    cur = connection.execute(
        'SELECT * FROM puffles;'
    )

    buddy = cur.fetchone()

    context = {
        'name': buddy['puffleName'],
        'color': buddy['bodyColor'],
        'glasses': buddy['glasses'],
        'hat': buddy['hat']
    }

    return render_template('game.html', **context)


# @vitamindbuddy.app.route('/task/<int:taskid>/', methods = [ 'PUT' ])
# def update_task():
#     pass