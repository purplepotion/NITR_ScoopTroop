import axios from 'axios';
import BASE_URL from '../config';
import {
  PATIENT_LIST_RESET,
  PATIENT_DETAILS_RESET,
} from '../constants/doctor.constants';
import {
  USER_CONSENT_FAIL,
  USER_CONSENT_REQUEST,
  USER_CONSENT_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_NOTIFICATIONS_REQUEST,
  USER_NOTIFICATIONS_SUCCESS,
  USER_NOTIFICATIONS_FAIL,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REMOVE_ACCESS_REQUEST,
  USER_REMOVE_ACCESS_FAIL,
  USER_REMOVE_ACCESS_SUCCESS,
  USER_SEARCH_FAIL,
  USER_SEARCH_REQUEST,
  USER_SEARCH_SUCCESS,
  USER_CREATE_CONSULTATION_REQUEST,
  USER_CREATE_CONSULTATION_SUCCESS,
  USER_CREATE_CONSULTATION_FAIL,
} from '../constants/user.constants';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // LOGIN A USER HERE
    const { data } = await axios.post(
      BASE_URL + '/api/users/login',
      { email, password },
      config
    );

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: PATIENT_LIST_RESET });
  dispatch({ type: PATIENT_DETAILS_RESET });
};

export const register =
  (name, email, password, age, gender, medicalHistory) => async (dispatch) => {
    try {
      dispatch({ type: USER_REGISTER_REQUEST });

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        BASE_URL + '/api/users/register',
        { name, email, password, age, gender, medicalHistory },
        config
      );

      dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getUserDetails = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo.token,
      },
    };

    // GET USER DETAILS
    const { data } = await axios.get(BASE_URL + `/api/users/profile`, config);

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getNotifications = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_NOTIFICATIONS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.get(BASE_URL + `/api/notifications`, config);

    dispatch({ type: USER_NOTIFICATIONS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_NOTIFICATIONS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const doctorsSearch = (name) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_SEARCH_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    let config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo.token,
      },
    };

    if (name.trim().length > 0) {
      config = {
        ...config,
        params: {
          name,
        },
      };
    }

    const { data } = await axios.get(BASE_URL + `/api/users/search`, config);

    dispatch({ type: USER_SEARCH_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_SEARCH_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const consentRequest =
  (notificationId, isApproved, securityCode) => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_CONSENT_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userInfo.token,
        },
      };

      const { data } = await axios.post(
        BASE_URL + `/api/notifications/${notificationId}`,
        { isApproved, secret: securityCode },
        config
      );

      dispatch({ type: USER_CONSENT_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: USER_CONSENT_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const removeAccess =
  (recordId, healthOfficialId) => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_REMOVE_ACCESS_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userInfo.token,
        },
      };

      const { data } = await axios.put(
        BASE_URL + `/api/users/records/${recordId}`,
        { doctorId: healthOfficialId },
        config
      );

      dispatch({ type: USER_REMOVE_ACCESS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: USER_REMOVE_ACCESS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const createConsultation =
  (doctorId, symptoms, age, gender, description) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: USER_CREATE_CONSULTATION_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userInfo.token,
        },
      };

      const { data } = await axios.post(
        BASE_URL + `/api/users/consultations`,
        { hid: doctorId, symptoms, age, sex: gender, description },
        config
      );

      dispatch({ type: USER_CREATE_CONSULTATION_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: USER_CREATE_CONSULTATION_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
