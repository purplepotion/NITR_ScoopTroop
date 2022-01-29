import jwt
import random
import string
import datetime
from bson import ObjectId
from server.config import Config
from server.models import Patient
from server.utils import token_required
from flask import request, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash


users = Blueprint("users", __name__)


@users.route("/", methods=["GET"])
def index():
    response = jsonify("Connected to Elixir !")

    return response, 200


@users.route("/api/users/register", methods=["POST"])
def register():
    data = request.json
    if not data or not data["name"] or not data["email"] or not data["password"]:
        return jsonify({"message": "Information entered in not complete"}), 400

    patient = Patient.objects(email=data["email"]).first()
    if patient:
        return (
            jsonify(
                {"message": "This email is already registered with a patient profile!"}
            ),
            400,
        )

    hashedpassword = generate_password_hash(data["password"])
    secret = "".join(random.choices(string.ascii_letters + string.digits, k=6))

    try:
        patient = Patient(
            name=data["name"],
            email=data["email"],
            password=hashedpassword,
            secret=secret,
        )
        patient.save()
        _id = str(patient._id)

        token = jwt.encode(
            {
                "id": _id,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(days=30),
            },
            Config.SECRET_KEY,
        )

        return jsonify(
            {
                "name": data["name"],
                "email": data["email"],
                "id": _id,
                "secret": secret,
                "token": token.decode("utf-8"),
            }
        )

    except:
        return jsonify({"message": "Bad request"}), 400


@users.route("/api/users/login", methods=["POST"])
def login():
    try:
        data = request.json
        if not data or not data["email"] or not data["password"]:
            return jsonify({"message": "Incomplete login information"}), 400

        token = None
        patient = Patient.objects(email=data["email"]).first()

        if patient:
            if check_password_hash(patient["password"], data["password"]):
                token = jwt.encode(
                    {
                        "id": str(patient._id),
                        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=30),
                    },
                    Config.SECRET_KEY,
                )
            else:
                return jsonify({"message": "Invalid email or password"}), 404
        else:
            return (
                jsonify(
                    {
                        "message": "User doesn't exist! Please check your email address and password."
                    }
                ),
                404,
            )

        return jsonify(
            {
                "name": patient["name"],
                "email": patient["email"],
                "id": str(patient._id),
                "token": token.decode("utf-8"),
            }
        )
    except:
        return jsonify({"message": "Some Error Occured!"}), 500


@users.route("/api/users/profile", methods=["GET", "PUT"])
@token_required
def patient_profile(_id):
    patient = Patient.objects(_id=ObjectId(_id)).first()
    if request.method == "GET":
        return jsonify({"name": patient["name"], "email": patient["email"]}), 200

    elif request.method == "PUT":
        patient = Patient.objects(_id=ObjectId(_id))
        data = request.json
        try:
            patient.update(
                name=data["name"],
                email=data["email"],
                password=generate_password_hash(data["password"]),
            )

            return (
                jsonify({"message": "Credentials have been updated successfully."}),
                200,
            )

        except:
            return jsonify({"message": "Invalid update request."}), 400
