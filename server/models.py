from bson.objectid import ObjectId
from mongoengine import Document, EmbeddedDocument, NULLIFY
from mongoengine import (
    StringField,
    ListField,
    IntField,
    EmailField,
    BooleanField,
    ObjectIdField,
    EmbeddedDocumentField,
    EmbeddedDocumentListField,
)


class PatientNotifications(EmbeddedDocument):
    _id = ObjectIdField(default=ObjectId)
    approved = BooleanField(default=False)
    doctor = ObjectIdField()
    record = ObjectIdField()
    rtype = StringField()

    meta = {"collection": "patientNotifications"}


class Record(EmbeddedDocument):
    _id = ObjectIdField(default=ObjectId)
    name = StringField(required=True)
    category = StringField(required=True)
    doctor = StringField(required=True)
    description = StringField(required=True)
    doctors = ListField(ObjectIdField())
    attachments = ListField(StringField())
    meta = {"collection": "record"}


class ConsultationData(EmbeddedDocument):
    _id = ObjectIdField(default=ObjectId)
    age = IntField(required=True)
    sex = StringField(required=True)
    symptoms = ListField(StringField(), required=True)
    description = StringField()

    meta = {"collection": "consultationData"}


class ConsultationRequest(EmbeddedDocument):
    _id = ObjectIdField(default=ObjectId)
    patient = ObjectIdField()
    patientName = StringField()
    doctor = ObjectIdField()
    consultationData = EmbeddedDocumentField(ConsultationData)
    approved = BooleanField(default=False)

    meta = {"collection": "consultationRequest"}


class Patient(Document):
    _id = ObjectIdField(default=ObjectId)
    name = StringField(max_length=20, required=True)
    email = EmailField(required=True, unique=True)
    age = IntField(required=True)
    gender = StringField(required=True)
    history = StringField()
    password = StringField(required=True)
    secret = StringField()
    doctors = ListField(ObjectIdField())
    notifs = ListField(EmbeddedDocumentField(PatientNotifications))
    records = ListField(EmbeddedDocumentField(Record))

    meta = {"collection": "patient"}


class Doctor(Document):
    _id = ObjectIdField(default=ObjectId)
    name = StringField(max_length=20, required=True)
    email = EmailField(required=True, unique=True)
    specialization = StringField()
    affiliation = StringField(required=True)
    password = StringField(required=True)
    patients = ListField(ObjectIdField())
    consultationRequests = EmbeddedDocumentListField(ConsultationRequest)
    records = StringField()

    meta = {"collection": "doctor"}