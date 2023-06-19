"""Vitamin-D Bud-D model (database) API."""
from urllib.parse import urlencode
from vitamindbuddy.errors import HttpError
from enum import Enum
import vitamindbuddy
import hashlib
import sqlite3
import flask
import random
import time
# import uuid
# import pathlib
# import arrow


class TaskStatus(Enum):
    COMPLETE = 4
    ACTIVE = 3
    SAVED = 2
    SUGGESTED = 1
    INVALID = 0
    SKIPPED = -1


def dict_factory(cursor, row):
    """Convert database row objects to a dictionary keyed on column name.

    This is useful for building dictionaries which are then used to render a
    template.  Note that this would be inefficient for large queries.
    """
    return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}


def get_db():
    """Open a new database connection.

    Flask docs:
    https://flask.palletsprojects.com/en/1.0.x/appcontext/#storing-data
    """
    if 'sqlite_db' not in flask.g:
        db_filename = vitamindbuddy.app.config['DATABASE_FILENAME']
        flask.g.sqlite_db = sqlite3.connect(str(db_filename))
        flask.g.sqlite_db.row_factory = dict_factory

        # Foreign keys have to be enabled per-connection.  This is an sqlite3
        # backwards compatibility thing.
        flask.g.sqlite_db.execute("PRAGMA foreign_keys = ON")

    return flask.g.sqlite_db


@vitamindbuddy.app.teardown_appcontext
def close_db(error):
    """Close the database at the end of a request.

    Flask docs:
    https://flask.palletsprojects.com/en/1.0.x/appcontext/#storing-data
    """
    assert error or not error  # Needed to avoid superfluous style error
    sqlite_db = flask.g.pop('sqlite_db', None)
    if sqlite_db is not None:
        sqlite_db.commit()
        sqlite_db.close()


# @insta485.app.route('/uploads/<path:filename>')
# def send_file(filename):
#     """Get image from uploads with specified filename."""

#     # Check if unauthorized user is attempting to see upload
#     verify_logged_in()

#     try:
#         return flask.send_from_directory(insta485.app.config['UPLOAD_FOLDER'], 
#             filename, as_attachment=True)
#     except FileNotFoundError:
#         flask.abort(404)


def gen_password_hash(password):
    """Generate salted password to store in database."""

    algorithm = 'sha512'
    salt = "a45ffdcc71884853a2cba9e6bc55e812"
    hash_obj = hashlib.new(algorithm)
    password_salted = salt + password
    hash_obj.update(password_salted.encode('utf-8'))
    password_hash = hash_obj.hexdigest()
    password_db_string = "$".join([algorithm, salt, password_hash])
    return password_db_string


# def gen_random_tasks(player_id):
def gen_random_tasks():
    """Generates list of 5 random, unique ints."""

    # Connect to SQL db
    connection = get_db()

    # # Get all tasks for given player that have not 
    # # been interacted with
    # cur = connection.execute(
    #     'SELECT * '
    #     'FROM playersTasks '
    #     'WHERE playerid=? AND status=?;',
    #     [ player_id, TaskStatus.SUGGESTED ]
    # )

    # TODO: delete when playersTasks implemented
    cur = connection.execute(
        'SELECT * '
        'FROM tasks;'
    )

    tasks = cur.fetchall()

    # Seed using current time
    random.seed(round(time.time() * 1000))

    # Get 5 random indices
    num_tasks = len(tasks)
    tasks_indices = []
    for _ in range(5):
        index = random.randint(0, num_tasks)

        # Check if index already saved
        while index in tasks_indices:
            index = random.randint(0, num_tasks)

        tasks_indices.append(index)

    return [tasks[idx % num_tasks] for idx in tasks_indices]


# def gen_timestamp(time_string):
#     """Generate readable timestamp based on current time."""
#     created = arrow.get(time_string)
#     return created.humanize()


# def gen_query_url(base_url, vars):
#     """Generate query string with specified target."""
#     query = urlencode(vars)
#     return '/{}/?{}'.format(base_url, query)


def get_user(username):
    """Fetch data in users table related to username."""
    connection = vitamindbuddy.model.get_db()
    cur = connection.execute(
        'SELECT * FROM players WHERE username=?;',
        [ username ]
    )
    
    user_info = cur.fetchone()

    # Close connection
    vitamindbuddy.model.close_db(connection)

    return user_info

def gen_random_guest_user():
    """Generate random username for guest account."""
    # Seed using current time
    random.seed(round(time.time() * 1000))
    username = f'guestuser{random.randint(0, 80000000)}'
    
    # Check if guest username already in-use
    while get_user(username):
        username = f'guestuser{random.randint(0, 80000000)}'

    return username


def add_new_user_tasks(playerid):
    """Add starter tasks in database for player."""

    print('** add_user_tasks STARTED **')

    # Connect to db
    connection = get_db()

    # Get starter tasks
    cur = connection.execute(
        'SELECT * FROM tasks;'
    )

    tasks = cur.fetchall()

    # Add system tasks for player
    command = 'INSERT INTO playersTasks(taskid, playerid, status) VALUES '

    num_tasks = len(tasks)
    for i, task in enumerate(tasks):
        task_id = task['id']
        command += f'({task_id}, {playerid}, {1})'

        if i == num_tasks - 1:
            command += ';'
        else:
            command += ', '

    connection.execute(command)

    print('** add_user_tasks COMPLETE **')


def is_guest():
    return 'username' in flask.session and 'guestuser'


# def verify_logged_in():
#     """Check user is logged in and verify credentials."""
#     if flask.request.authorization:
#         logname = flask.request.authorization['username']
#         password = flask.request.authorization['password']
#         check_basic_auth(logname, password)
#     elif 'username' in flask.session:
#         logname = flask.session['username']
#     else:
#         raise HttpError(403)

#     return logname


# def check_basic_auth(logname, password):
#     """Check if basic HTTP auth info is valid."""

#     # Get password for username
#     connection = get_db()
#     cur = connection.execute(
#         'SELECT password '
#         'FROM users '
#         'WHERE username=?;',
#         [ logname ]
#     )

#     # Check if query returned any entries
#     row = cur.fetchone()
#     if not row:
#         raise HttpError(403)

#     # Check if password is valid
#     pass_correct = row['password']
#     pass_in = gen_password_hash(password)

#     if not pass_in == pass_correct:
#         raise HttpError(403)


# def unpack_file():
#     """Generate uuid for given filename, save and return uuid."""
    
#     # Unpack flask object
#     fileobj = flask.request.files['file']
#     filename = fileobj.filename

#     # Compute base name (filename without directory).  We use a UUID to avoid
#     # clashes with existing files, and ensure that the name is compatible with the
#     # filesystem.
#     uuid_basename = '{stem}{suffix}'.format(
#         stem = uuid.uuid4().hex,
#         suffix = pathlib.Path(filename).suffix
#     )

#     # Save to disk
#     path = insta485.app.config["UPLOAD_FOLDER"]/uuid_basename
#     fileobj.save(path)

#     return uuid_basename


# def gen_post_context():
#     pass