"""
Handles errors and returns proper response code.
"""
from flask import jsonify
import vitamindbuddy

class HttpError(Exception):

    def __init__(self, status_code, payload=None):
        Exception.__init__(self)
        self.payload = payload
        self.status_code = status_code
        if status_code == 400:
            self.message = 'Bad Request'
        elif status_code == 403:
            self.message = 'Forbidden'
        elif status_code == 409:
            self.message = 'Conflict'
        else:
            self.message = 'Not found'

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        rv['status_code'] = self.status_code
        return rv
        

@vitamindbuddy.app.errorhandler(HttpError)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response