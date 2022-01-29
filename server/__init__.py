from flask import Flask
from mongoengine import connect
from server.config import Config


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config)

    connect("elixir", host=Config.MONGO_URI)

    from server.users.routes import users
    from server.hsp.routes import hsp
    from server.notifications.routes import notifications
    from server.records.routes import records

    app.register_blueprint(users)
    app.register_blueprint(notifications)
    app.register_blueprint(records)
    app.register_blueprint(hsp)

    return app
