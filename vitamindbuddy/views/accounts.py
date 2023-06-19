"""
Insta485 create view.

URLs include:
/accounts/login/
/accounts/logout/
"""
# from flask import request, session, redirect, helpers, render_template, url_for, flash, abort, make_response
import flask
import vitamindbuddy

@vitamindbuddy.app.route('/accounts/login/')
def login():
    """Display /accounts/login/ route."""

    game_url = flask.url_for('game')

    # Check if user already logged in
    if 'username' in flask.session:
        # Check if logged in as guest
        if 'guestuser' not in flask.session['username']:
            return flask.make_response(flask.redirect(game_url, 302))

    # Set redirect to game page
    context = { 
        'form_url': f'/accounts/?target={game_url}' 
    }

    return flask.render_template('login.html', **context)


@vitamindbuddy.app.route('/accounts/signup/', methods = ["GET"])
def signup():
    """Display /accounts/create/ route."""

    game_url = flask.url_for('game')

    # Check if user logged in
    if 'username' in flask.session:
       # Check if logged in as guest
        if 'guestuser' not in flask.session['username']:
            return flask.make_response(flask.redirect(game_url, 302))


    # Set redirect to tutorial page
    tutorial_url = flask.url_for('tutorial')
    context = { 
        'form_url': f'/accounts/?target={tutorial_url}' 
    }

    return flask.render_template('signup.html', **context)


@vitamindbuddy.app.route('/accounts/logout/', methods = ['POST'])
def logout():
    """Logout user."""
    # Check if user logged in
    if 'username' in flask.session:
        flask.session.pop('username')
    
    return flask.redirect(flask.url_for('index'))


# @vitamindbuddy.app.route('/accounts/edit/')
# def edit():
#     """Display /accounts/edit/ route."""

#     # Check if user logged in
#     if 'username' in flask.session:
#         logname = flask.session['username']
#     else:
#         return flask.make_response(flask.redirect(flask.url_for('login')), 302)

#     connection = vitamindbuddy.model.get_db()

#     # Query database for logname info
#     cur = connection.execute(
#         'SELECT fullname, email, filename '
#         'FROM users '
#         'WHERE username=?;',
#         [ logname ]
#     )

#     logname_info = cur.fetchone()

#     # Parse logname info
#     fullname    = logname_info['fullname']
#     email       = logname_info['email']
#     logname_img_url = logname_info['filename']

#     # Close connection
#     vitamindbuddy.model.close_db(connection)

#     context = {
#         'logname': logname,
#         'logname_img_url': '/uploads/' + logname_img_url,
#         'fullname': fullname,
#         'email': email
#     }

#     return flask.render_template('edit.html', **context)


# @vitamindbuddy.app.route('/accounts/delete/', methods=['GET'])
# def delete():
#     """Display /accounts/delete/ route."""

#     # Check if user is logged in
#     if 'username' in flask.session:
#         context = {'logname': flask.session['username']}
#     else:
#         return flask.make_response(flask.redirect(flask.url_for('login')), 302)

#     return flask.render_template('delete.html', **context)


# @vitamindbuddy.app.route('/accounts/password/', methods = ["GET"])
# def password():
#     """Display /accounts/password/ route."""

#     # Check if user is logged in
#     if 'username' in flask.session:
#         context = {'logname': flask.session['username']}
#     else:
#         return flask.make_response(flask.redirect(flask.url_for('login')), 302)

#     return flask.render_template('password.html', **context)