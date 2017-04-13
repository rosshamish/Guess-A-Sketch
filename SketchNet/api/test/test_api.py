import collections
import unittest

from api.api import create_test_app
from api.test.b64_img import *
from api.test.testing_props import APP_CREATION_ARGS

TEST_APP = create_test_app(APP_CREATION_ARGS).test_client()


class TestSketchNetAPI(unittest.TestCase):

    def test_prompts(self):
        response = TEST_APP.get("/prompts")
        assert response.status == '200 OK'
        assert response.content_type == 'application/json'
        assert isinstance(response.response, collections.Iterable)

    def test_empty_body(self):
        response = TEST_APP.post("/submit", {})
        assert response.status == '400 BAD REQUEST'

    def test_submission(self):
        response = TEST_APP.post("/submit", data={'sketch': B64_IMG},
                                 headers={'content-md5': 'some hash'})

        assert response.status == '200 OK'
        assert response.content_type == 'application/json'
        assert isinstance(response.response, collections.Iterable)

        resp_str = list(response.response)[0]
        assert 'confidence' in resp_str
        assert 'label' in resp_str

    def test_4_color_channels(self):
        response = TEST_APP.post("/submit", data={'sketch': B64_4_CHANNELS},
                                 headers={'content-md5': 'some hash'})

        assert response.status == '200 OK'
        assert response.content_type == 'application/json'
        assert isinstance(response.response, collections.Iterable)

        resp_str = list(response.response)[0]
        assert 'confidence' in resp_str
        assert 'label' in resp_str

    def test_corrupt_img(self):
        response = TEST_APP.post("/submit", data={'sketch': B64_IMG_EMPTY},
                                 headers={'content-md5': 'some hash'})
        assert response.status == '400 BAD REQUEST'


if __name__ == '__main__':
    unittest.main()



