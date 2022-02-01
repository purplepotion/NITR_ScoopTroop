import jwt
import json
import datetime
from bson import ObjectId
from server.config import Config
from flask import request, jsonify, Blueprint
from server.utils import token_required
from server.models import Patient, Doctor, Record, PatientNotifications
from werkzeug.security import generate_password_hash, check_password_hash

hsp = Blueprint("hsp", __name__)


@hsp.route("/hsp/doctor/register", methods=["POST"])
def signup():
    data = request.json
    if not data or not data["name"] or not data["email"] or not data["password"]:
        return jsonify({"message": "Information entered is not complete"}), 400

    doctor = Doctor.objects(email=data["email"]).first()

    if doctor:
        return (
            jsonify(
                {"message": "This email is already registered with a doctor's profile!"}
            ),
            400,
        )

    hashedpassword = generate_password_hash(data["password"])

    try:
        doctor = Doctor(
            name=data["name"],
            email=data["email"],
            password=hashedpassword,
            specialization=data["specialization"],
            affiliation=data["affiliation"],
        )
        doctor.save()
        _id = str(doctor._id)

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
                "specialization": data["specialization"],
                "affiliation": data["affiliation"],
                "id": _id,
                "token": token.decode("utf-8"),
            }
        )

    except:
        return jsonify({"message": "Bad request"}), 400


@hsp.route("/hsp/doctor/login", methods=["POST"])
def dlogin():
    try:
        data = request.json
        if not data or not data["email"] or not data["password"]:
            return jsonify({"message": "Incomplete login information"}), 400

        token = None
        doctor = Doctor.objects(email=data["email"]).first()

        if doctor:
            if check_password_hash(doctor["password"], data["password"]):
                token = jwt.encode(
                    {
                        "id": str(doctor._id),
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
                        "message": "This doctor profile doesn't exist! Please check your email address and password."
                    }
                ),
                404,
            )

        return jsonify(
            {
                "name": doctor["name"],
                "email": doctor["email"],
                "specialization": doctor["specialization"],
                "affiliation": doctor["affiliation"],
                "id": str(doctor._id),
                "token": token.decode("utf-8"),
            }
        )
    except:
        return jsonify({"message": "Some Error Occured!"}), 500


@hsp.route("/hsp/doctor/profile", methods=["GET", "PUT"])
@token_required
def doctor_profile(_id):
    doctor = Doctor.objects(_id=ObjectId(_id)).first()

    if request.method == "GET":
        return jsonify({"name": doctor["name"], "email": doctor["email"]}), 200

    elif request.method == "PUT":
        doctor = Doctor.objects(_id=ObjectId(_id))

        data = request.json
        try:
            doctor.update(
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


@hsp.route("/hsp/doctor/patients", methods=["GET", "POST"])
@token_required
def addPatient(_id):
    if request.method == "POST":
        health_id = request.json["healthID"]
        try:
            doctor = Doctor.objects(_id=ObjectId(_id)).first()
            patient = Patient.objects(_id=ObjectId(health_id)).first()

            doctor.patients.append(patient._id)
            doctor.save()

            return jsonify({"message": "Patient has been added."}), 201

        except:
            return jsonify({"message": "Invalid request"}), 400

    if request.method == "GET":
        doctor = Doctor.objects(_id=ObjectId(_id)).first()
        patientData = list()
        for oid in doctor.patients:
            data_dict = dict()
            data_dict["id"] = str(oid)
            patient = Patient.objects(_id=oid).first()
            data_dict["name"] = patient.name
            data_dict["email"] = patient.email
            patientData.append(data_dict)

        return jsonify(patientData), 200


@hsp.route("/hsp/doctor/patients/<pid>", methods=["GET"])
@token_required
def getPatientRecords(_id, pid):
    patient = Patient.objects(_id=ObjectId(pid)).first()
    recordList = list()
    for record in patient.records:
        rdict = dict()
        rdict["id"] = str(record._id)
        rdict["name"] = record.name
        rdict["category"] = record.category
        rdict["doctor"] = record.doctor
        rdict["description"] = record.description
        rdict["attachments"] = record.attachments
        rdict["isApproved"] = False

        if ObjectId(_id) in record.doctors:
            rdict["isApproved"] = True

        recordList.append(rdict)

    return (
        jsonify(
            {
                "id": str(patient._id),
                "name": patient.name,
                "email": patient.email,
                "records": recordList,
            }
        ),
        200,
    )


@hsp.route("/hsp/doctor/patients/<pid>/records/<rid>", methods=["GET"])
@token_required
def getRecords(_id, pid, rid):
    patient = Patient.objects(_id=ObjectId(pid)).first()
    rdict = dict()
    for record in patient.records:
        if record._id == ObjectId(rid):
            rdict["id"] = str(record._id)
            rdict["name"] = record.name
            rdict["category"] = record.category
            rdict["doctor"] = record.doctor
            rdict["description"] = record.description
            rdict["attachments"] = record.attachments
            rdict["isApproved"] = False

            if ObjectId(_id) in record.doctors:
                rdict["isApproved"] = True

            break

    return jsonify(rdict), 200


@hsp.route("/hsp/doctor/patients/<pid>/records", methods=["POST"])
@token_required
def addPatientRecord(_id, pid):
    data = request.json
    name = data["name"]
    category = data["category"]
    doctor = data["doctor"]
    description = data["description"]
    attachment = data["file"]

    try:
        record = Record(
            name=name,
            category=category,
            doctor=doctor,
            description=description,
            attachments=[attachment],
        )
        patient = Patient.objects(_id=ObjectId(pid)).first()
        patient.records.append(record)

        patient.save()
        # record.save()

        return jsonify({"message": "Record added successfully."}), 200

    except:
        return jsonify({"message": "Unable to create the record."}), 400


@hsp.route("/hsp/doctor/consultations/get", methods=["GET"])
@token_required
def getRequests(_id):
    req_id = request.args.get("req_id", default=None, type=str)
    doctor = Doctor.objects(_id=ObjectId(_id)).first()
    consultationRequests = doctor.consultationRequests
    # try:
    if req_id is None:  # response with all requests
        resp = []
        for crequest in consultationRequests:
            crequest = json.loads(crequest.to_json())
            resp.append(crequest)
        return jsonify(resp), 200

    else:  # response with given req_id
        for crequest in consultationRequests:
            if crequest._id == ObjectId(req_id):
                resp = json.loads(crequest.to_json())
                return jsonify(resp), 200

    # except:
    return jsonify({"message": "Unexpected error occurred."}), 500


@hsp.route("/hsp/doctor/consultations/delete", methods=["POST"])
@token_required
def deleteRequest(_id):
    data = request.json
    req_id = data["req_id"]
    p_id = data["p_id"]
    approved = data["approved"]
    doctor = Doctor.objects(_id=ObjectId(_id)).first()
    crequests = []
    for crequest in doctor.consultationRequests:
        if crequest._id == ObjectId(req_id):
            pass
        else:
            crequests.append(crequest)

    doctor.consultationRequests = crequests
    pnotif = PatientNotifications(doctor=ObjectId(_id), rtype="consult")

    # create new patient notification
    # type = consultation
    if approved == "True":
        doctor.patients.append(ObjectId(p_id))
        pnotif.approved = True

    patient = Patient.objects(_id=ObjectId(p_id)).first()
    patient.notifs.append(pnotif)

    patient.save()
    doctor.save()
    return jsonify({"message": "Request executed successfully."})
