"""
Vitamin-D Bud-D How-To-Play (Tutorial) view.

URLs include:
/
"""
import threading
from flask import request, session, url_for, render_template
from vitamindbuddy.model import add_new_user_tasks, gen_random_guest_user, get_db, close_db
import vitamindbuddy


@vitamindbuddy.app.route('/tutorial/')
def tutorial():
    """Get tutorial page."""
    # Check if user is logged in as guest
    # if 'username' not in session:
    #     # Generate random for guest username
    #     username = gen_random_guest_user()

        # Add user to db and cache username
        # thread = threading.Thread(target=register_guest, args=[username,])
        # thread.start()
        # thread.start_threading register_guest(username)

    return render_template('tutorial.html')


# @vitamindbuddy.app.route('')
