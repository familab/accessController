import os
import web.admin
import unittest
import tempfile

class FlaskrTestCase(unittest.TestCase):

  def setUp(self):
    self.db_fd, web.admin.app.config['DATABASE'] = tempfile.mkstemp()
    web.admin.app.config['TESTING'] = True
    self.app = web.admin.app.test_client()

  def tearDown(self):
    os.close(self.db_fd)
    os.unlink(web.admin.app.config['DATABASE'])
    
  def test_empty_db(self):
    rv = self.app.get('/')
    assert b'Hello World' == rv.data

if __name__ == '__main__':
    unittest.main()