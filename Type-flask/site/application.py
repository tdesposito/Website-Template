from flask import (
    Flask,
    render_template
)

def create_app(test_config=None):
    app = Flask(__name__)

    #===== App-level hooks
    # @app.before_request
    # def force_https():
    #     ''' Redirect HTTP to HTTPS in all cases.
    #
    #     Note that since we're running on EB, ALL of our requests will come in
    #     as HTTP (from the load balancer), so we use the X-Forwarded-Proto header
    #     to determine if the client was using HTTPS or not!
    #     '''
    #     if request.headers.get('X-Forwarded-Proto','http').lower() != "https" and app.env != "development":
    #         return redirect(request.url.replace("http://", "https://", 1), code=301)


    @app.route('/')
    def index():
        return render_template("index.html")

    return app

application = create_app()

if __name__ == '__main__':
    application.run()
