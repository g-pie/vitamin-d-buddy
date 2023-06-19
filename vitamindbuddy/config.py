"""Vitamin-D Buddy development configuration."""

import pathlib

# Root of this application, useful if it doesn't occupy an entire domain
APPLICATION_ROOT = '/'

# Secret key for encrypting cookies
SECRET_KEY = (
	b'\xc9\xf4\xe4\x84\xd5\x81\x8ex\x10\xea\xcb_>'
	b'\xe8\x804^\xefb\x8cC\x133\x1f')
SESSION_COOKIE_NAME = 'login'

# File Upload to var/uploads/
VITDBUD_ROOT = pathlib.Path(__file__).resolve().parent.parent
# UPLOAD_FOLDER = INSTA485_ROOT/'var'/'uploads'
# TEMPLATES_FOLDER = INSTA485_ROOT/'templates'
# ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
# MAX_CONTENT_LENGTH = 16 * 1024 * 1024

# Database file is var/vitdbud.sqlite3
DATABASE_FILENAME = VITDBUD_ROOT/'var'/'vitdbud.sqlite3'
