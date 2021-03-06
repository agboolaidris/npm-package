import React, { useState } from "react";
import LoginComponent from "../../ui/compounds/login";
import { useNavigation } from "@react-navigation/native";
import { Route } from "../../constants/route";
import axiosInstance from "../../helpers/axiosIntance";
import { useGlobalDispatch, useGlobalState } from "../../store";
import { AUTHTYPE } from "../../store/reducers/auth";

const Login = () => {
  const { authInitialState } = useGlobalState();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const dispatch = useGlobalDispatch();
  const { navigate }: any = useNavigation();
  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    //validate email
    if (name === "email") {
      if (value.length < 1)
        setErrors((prev) => ({
          ...prev,
          email: "email is required",
        }));
      else setErrors((prev) => ({ ...prev, email: "" }));
    }

    //validate password
    if (name === "password") {
      if (value.length < 1)
        setErrors((prev) => ({
          ...prev,
          password: "password is required",
        }));
      else if (value.length < 6)
        setErrors((prev) => ({
          ...prev,
          password: "password length most be greater than 5 digits",
        }));
      else setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleSubmit = () => {
    //validate email
    if (form.email.length < 1)
      setErrors((prev) => ({
        ...prev,
        email: "email is required",
      }));

    //validate password
    if (form.password.length < 1)
      setErrors((prev) => ({
        ...prev,
        password: "password is required",
      }));

    const validateForm =
      Object.values(form).filter((value) => value.trim().length > 0).length > 0;

    if (!validateForm) return;

    dispatch({
      type: AUTHTYPE.IS_LOADING,
      payload: {},
    });

    axiosInstance
      .post("/auth/login", { ...form })
      .then((res) => {
        console.log(res.data);
        dispatch({
          type: AUTHTYPE.LOGIN,
          payload: {
            isAuthenticated: true,
            isloading: false,
          },
        });
      })
      .catch((err) => {
        setErrors((prev) => ({ ...prev, ...err.response.data }));
        dispatch({
          type: AUTHTYPE.AUTH_ERROR,
          payload: {},
        });
      });
  };
  return (
    <LoginComponent
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      errors={errors}
      values={form}
      loading={authInitialState.isloading}
    />
  );
};

export default Login;
