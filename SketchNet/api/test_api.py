import collections
import argparse
from api import create_test_app, create_parser
import unittest
from b64_img import B64_IMG
from testing_props import args


class TestSketchNetAPI(unittest.TestCase):

    def setUp(self):
        self.app_creation_args = argparse.Namespace(modeldir='test',
                                                    metafile='exp3-trained-20170405-002502.meta',
                                                    labels='standard',
                                                    t=True)
        print(self.app_creation_args)
        self.app = create_test_app(self.app_creation_args).test_client()

    def tearDown(self):
        pass

    # def test_prompts(self):
    #     response = self.app.get("/prompts")
    #     assert response.status == '200 OK'
    #     assert response.content_type == 'application/json'
    #     assert isinstance(response.response, collections.Iterable)
    #
    # def test_empty_body(self):
    #     response = self.app.post("/submit", {})
    #     assert response.status == '400 BAD REQUEST'

    def test_submission(self):
        # req = request.Request()
        # req.form = {'sketch': B64_IMG}
        response = self.app.post("/submit", data={'sketch': B64_IMG}, headers={'content-md5': 'some hash'})


if __name__ == '__main__':
    unittest.main()



