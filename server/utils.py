import jwt
import pydicom
from functools import wraps
import matplotlib.pyplot as plt
from server.config import Config
from flask import request, jsonify


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            token = request.headers["Authorization"]

        if not token:
            return jsonify({"message": "Access to requested resource is denied."}), 403

        try:
            data = jwt.decode(token, Config.SECRET_KEY)
            _id = data["id"]
        except:
            return jsonify({"message": "Access to requested resource is denied"}), 403

        return f(_id, *args, **kwargs)

    return decorated


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in Config.ALLOWED_EXTENSIONS
    )


def dicom_handler(attachement):
    ds = pydicom.read_file(f"{Config.UPLOAD_FOLDER}/{attachement}")
    resp = dict()
    resp["PatientName"] = ds.PatientName
    resp["Gender"] = ds.PatientSex
    resp["Institution Name"] = ds.InstitutionAddress
    resp["Physician"] = ds.PerformingPhysicianName
    resp["Description"] = ds.StudyDescription

    new_attachment = attachement.rsplit(".", 1)[0].lower() + "." + "jpg"

    plt.ioff()
    plt.imshow(ds.pixel_array.mean(axis=0), cmap=plt.cm.bone)
    plt.savefig(f"{Config.UPLOAD_FOLDER}/{new_attachment}", bbox_inches="tight")

    return new_attachment, resp
