# -*- coding: utf-8 -*-
#!/usr/bin/env python
"""
    accessController
    ~~~~~~
    An application written to act as the controller for NFC readers and an
    ardunio relay board with
    Flask and sqlite3.
    :license: The Unlicense, see LICENSE for more details.
"""

import database.db
import web.admin
import os

# Configuration
HOST = os.getenv('IP', '0.0.0.0')
PORT = int(os.getenv('PORT', 8080))
DATABASE = os.getenv('DATABASE', './app.db')
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'

# Setup DB - erases everytime, we need to remove this
database.db.init_db(DATABASE)

# Start UDP Listener

# Start Serial Listener

# Start Admin Interface
web.admin.run(__name__)