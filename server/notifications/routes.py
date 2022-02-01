from bson import ObjectId
from flask import request, jsonify, Blueprint
from server.utils import token_required
from server.models import Patient, Doctor, PatientNotifications

notifications = Blueprint("notifications", __name__)


@notifications.route("/api/notifications", methods=["POST", "GET"])
@token_required
def getNotifications(_id):
    if request.method == "POST":
        pid = request.json["patientId"]
        rid = request.json["recordId"]

        try:
            notif = PatientNotifications(
                doctor=ObjectId(_id), record=ObjectId(rid), rtype="consent"
            )
            patient = Patient.objects(_id=ObjectId(pid)).first()
            patient.notifs.append(notif)
            patient.save()

            return jsonify({"message": "Notification sent."}), 201

        except:
            return jsonify({"message": "Failed to add notification"}), 400

    elif request.method == "GET":
        patient = Patient.objects(_id=ObjectId(_id)).first()
        recordlist = patient.records
        resp_notifList = list()

        for notif in patient.notifs:
            notif_obj = dict()
            notif_obj["id"] = str(notif._id)
            notif_obj["approved"] = notif.approved
            notif_obj["rtype"] = notif.rtype

            rid = notif.record
            record_obj = dict()
            record_obj["id"] = str(rid)

            for recs in recordlist:
                if recs._id == rid:
                    record_obj["name"] = recs.name
                    record_obj["category"] = recs.category

                    break

            notif_obj["record"] = record_obj
            doctor_obj = dict()
            doctor_obj["id"] = str(notif.doctor)

            doctor = Doctor.objects(_id=ObjectId(notif.doctor)).first()
            doctor_name = doctor.name
            doctor_obj["name"] = doctor_name

            notif_obj["doctor"] = doctor_obj

            resp_notifList.append(notif_obj)

        return jsonify(resp_notifList), 200


@notifications.route("/api/notifications/<nid>", methods=["POST"])
@token_required
def approveNotifs(_id, nid):
    approved = request.json["isApproved"]
    secret = request.json["secret"]
    patient = Patient.objects(_id=ObjectId(_id)).first()

    try:
        if approved and patient.secret == secret:
            rid, hid = None, None
            for notif in patient.notifs:
                if notif._id == ObjectId(nid):
                    rid = notif.record
                    hid = notif.doctor
                    break

            for record in patient.records:
                if record._id == rid:
                    record.doctors.append(hid)
                    break

        elif approved and patient.secret != secret:
            return jsonify({"message": "Invalid secret code. Please try again!"}), 401

        patient.save()
        notifs = []
        for notif in patient.notifs:
            if notif._id != ObjectId(nid):
                notifs.append(notif)
        patient.notifs = notifs
        patient.save()

        return jsonify({"message": "Request has been processed."}), 201

    except:
        return jsonify({"message": "Unable to process the request."}), 400
