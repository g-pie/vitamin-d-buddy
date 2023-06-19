"""
Vitamin-D Bud-D index (main) view.

URLs include:
/
"""
import flask
import vitamindbuddy

@vitamindbuddy.app.route('/')
def index():

    is_logged_in = not vitamindbuddy.model.is_guest() and 'username' in flask.session

    context = {
        'loggedIn': is_logged_in,
        'formUrl': ""
    }

    return flask.render_template('index.html', **context)