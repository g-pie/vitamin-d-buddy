"""
Vitamin-D Bud-D accounts POST routes.

URLs include:
/accounts/?target=URL
"""
import sys
from flask import request, session, redirect, helpers, render_template, url_for, flash, abort, make_response
import vitamindbuddy
from vitamindbuddy.errors import HttpError
from vitamindbuddy.model import TaskStatus, add_new_user_tasks, gen_random_guest_user, get_db, close_db, get_user, gen_password_hash, is_guest
import threading


@vitamindbuddy.app.route('/accounts/', methods = [ 'POST' ])
def post_accounts():
    """Post data based on operation."""

    operation = request.form['operation']

    # Check if target entered
    if request.args:
        target = request.args['target']
    else:
        target = url_for('index')

    # Execute operation
    if operation == 'login':
        is_successful_login = auth()
        if not is_successful_login:
            flash("Invalid username")
            return redirect(url_for('login'))

    elif operation == 'signup':
        register()
    elif operation == 'guest':
        # thread = threading.Thread(target=register_guest)
        # thread.start()
        register_guest()
    # elif operation == 'edit_account':
    #     edit_account()
    # elif operation == 'update_password':
    #     update_pass()

    return redirect(target)


def auth():
    """Authenticate login information."""

    # Check if user already logged in
    if 'username' in session:
        return make_response(redirect('index'), 302)

    username = request.form.get("username")
    password = request.form.get("password")
    user_info = get_user(username)

    # Check if username is valid
    if not user_info:
        flash("invalid username")
        return False

    correct_pass = user_info['password']

    # Check if password is valid
    password = gen_password_hash(password)
    
    if password != correct_pass:
        return False
    else:
        # Log user in and set session cookie
        session['username'] = username
        session['playerid'] = user_info['id']

    print(f'auth done\nuser: {username}, pass: {password}')
    return True


def register():
    """Add user to database."""

    # Check if already logged in
    if not is_guest() and 'username' in session:
        return make_response(redirect('index'), 302)

    username = request.form.get('username')
    password = request.form.get('password')
    email = request.form.get('email')
    
    # Verify form fields are not empty
    if not (username and password and email):
        return redirect(url_for('signup'), 302)

    password = gen_password_hash(password)
    
    # Unpack and save profile pic
    # filename = unpack_file()

    # TODO: verify passwords match

    # Connect to db
    connection = get_db()

    # Add user to player db
    cur = connection.execute(
        'INSERT INTO players '
        '(username, email, password) '
        'VALUES (?, ?, ?);',
        [ username, email, password ]
    )

    # Set session cookie
    playerid = cur.lastrowid

    # Add to leaderboard db
    cur = connection.execute(
        'INSERT INTO leaderboard '
        '(playerid) '
        'VALUES (?);',
        [ playerid ]
    )
    
    session['username'] = username
    session['playerid'] = playerid

    add_new_user_tasks(playerid)

    print('post register')

    # Close connection
    close_db(connection)


def register_guest():
    """Register user as guest with randomized username."""

    username = gen_random_guest_user()

    # Connect to db
    connection = get_db()

    # Add user to database
    cur = connection.execute(
        'INSERT INTO players(username) '
        'VALUES (?);',
        [ username ]
    )

    playerid = cur.lastrowid

    # Add to leaderboard db
    cur = connection.execute(
        'INSERT INTO leaderboard '
        '(playerid) '
        'VALUES (?);',
        [ playerid ]
    )

    session['username'] = username
    session['playerid'] = playerid

    # Add system tasks to db for playerid
    add_new_user_tasks(playerid)

    # close connection
    close_db(connection)

# def delete_account():
#     """Delete account with given username."""

#     # Check if user logged in
#     if 'username' not in session:
#         abort(403)

#     logname = session['username']

#     # Delete user and associated content
#     connection = get_db()
#     connection.execute(
#         'DELETE FROM users WHERE username=?;',
#         [ logname ]
#     )

#     close_db(connection)

#     # Clear session
#     session.pop('username')


# def edit_account():
#     """Edit account info in database."""

#     # Check if user is logged in
#     if 'username' not in session:
#         abort(403)
#     else:
#         logname = session['username']

#     fullname = request.form['fullname']
#     email    = request.form['email']

#     # Check that fields are not empty
#     if not (fullname and email):
#         abort(400)

#     # Update fullname and email
#     connection = get_db()
#     connection.execute(
#         'UPDATE user '
#         'SET fullname=? AND email=? '
#         'WHERE username=?;',
#         [ fullname, email, logname ]
#     )

#     # Update filename, if necessary
#     profile_pic = request.form['filename']
#     if profile_pic:
#         filename = unpack_file()
#         connection.execute(
#             'UPDATE user SET filename=? WHERE username=?;',
#             [ filename, logname ]
#         )

#     close_db(connection)


# def update_pass():
#     """Update password for current user."""

#     # Check if user is not logged in
#     if 'username' in session:
#         logname = session['username']
#     else:
#         abort(403)

#     # Get values from form
#     password = request.form['password']
#     new_password1 = request.form['new_password1']
#     new_password2 = request.form['new_password2']

#     # Check that all fields are not empty
#     if not (password and new_password1 and new_password2):
#         abort(400)

#     # Check that old password matches current password in database
#     user_info = get_user(logname)
#     if gen_password_hash(password) != user_info['password']:
#         abort(403)

#     # Check that new passwords match
#     if new_password1 != new_password2:
#         abort(401)

#     # Update password
#     connection = insta485.model.get_db()
#     connection.execute(
#         'UPDATE user '
#         'SET password=? '
#         'WHERE username=?;',
#         [gen_password_hash(new_password1), logname ]
#     )

#     # Close connection
#     close_db(connection)
