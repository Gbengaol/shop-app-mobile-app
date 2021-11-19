import axios from "axios";

const axiosInstance = axios.create({
  // @ts-ignore
  baseURL: `https://gbenga-shop-app-default-rtdb.firebaseio.com`,
});

const axiosAuthInstance = axios.create({
  // @ts-ignore
  baseURL: `https://identitytoolkit.googleapis.com/v1/accounts`,
});

axiosInstance.interceptors.request.use(
  function (config) {
    config.headers = {
      ...config.headers,
      "Content-Type": "application/json",
      // Authorization: `Bearer`,
    };

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosAuthInstance.interceptors.request.use(
  function (config) {
    config.headers = {
      ...config.headers,
      "Content-Type": "application/json",
      // Authorization: `Bearer`,
    };

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(undefined, async function (error) {
  // console.log(error.response.request.responseURL);
  if (error?.response?.status === 401) {
    // window.location.replace(ROUTES.LOGIN);
  }
  return Promise.reject(error);
});

export const getData = async (url: string) => {
  const { data } = await axiosInstance({
    method: "get",
    url,
  });
  return data;
};

export const getAuthData = async (url: string) => {
  const { data } = await axiosAuthInstance({
    method: "get",
    url,
  });
  return data;
};

export const postData = async (url: string, reqBody: {}) => {
  const { data } = await axiosInstance({
    method: "POST",
    url,
    data: reqBody,
  });
  return data;
};

export const postAuthData = async (url: string, reqBody: {}) => {
  const { data } = await axiosAuthInstance({
    method: "POST",
    url,
    data: reqBody,
  });
  return data;
};

export const patchData = async (url: string, reqBody: {}) => {
  const { data } = await axiosInstance({
    method: "PATCH",
    url,
    data: reqBody,
  });
  return data;
};

export const putData = async (url: string, reqBody: {}) => {
  const { data } = await axiosInstance({
    method: "PUT",
    url,
    data: reqBody,
  });
  return data;
};

export const deleteData = async (url: string, reqBody: {}) => {
  const { data } = await axiosInstance({
    method: "DELETE",
    url,
    data: reqBody,
  });
  return data;
};
