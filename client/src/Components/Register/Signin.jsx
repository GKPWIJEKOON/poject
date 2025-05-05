import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { signinAction } from "../../Redux/Auth/Action";
import { getUserProfileAction } from "../../Redux/User/Action";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
});

const Signin = () => {
  const initialValues = { email: "", password: "" };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, signin } = useSelector((store) => store);
  const toast = useToast();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) dispatch(getUserProfileAction(token || signin));
  }, [signin, token]);

  useEffect(() => {
    if (user?.reqUser?.username && token) {
      navigate(`/${user.reqUser?.username}`);
      toast({
        title: "Signin successful",
        status: "success",
        duration: 8000,
        isClosable: true,
      });
    }
  }, [user.reqUser]);

  const handleSubmit = (values, actions) => {
    dispatch(signinAction(values));
    actions.setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl border border-blue-200">
        <Box display="flex" flexDirection="column" alignItems="center">
          <img
            className="mb-6 w-24"
            src="https://www.e-learning-platform.org/images/e-learning-logo.png"
            alt="Logo"
          />
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {(formikProps) => (
              <Form className="w-full">
                <Field name="email">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.email && form.touched.email}
                      mb={4}
                    >
                      <Input
                        {...field}
                        id="email"
                        placeholder="Mobile Number Or Email"
                        size="md"
                      />
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="password">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.password && form.touched.password}
                      mb={4}
                    >
                      <Input
                        {...field}
                        type="password"
                        id="password"
                        placeholder="Password"
                        size="md"
                      />
                      <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Button
                  mt={4}
                  colorScheme="blue"
                  width="100%"
                  type="submit"
                  isLoading={formikProps.isSubmitting}
                >
                  Sign In
                </Button>

                <Button
                  as="a"
                  href="http://localhost:5454/oauth2/authorization/google"
                  colorScheme="red"
                  mt={4}
                  width="100%"
                >
                  Sign in with Google
                </Button>
              </Form>
            )}
          </Formik>

          <p className="mt-6 text-center text-sm text-gray-600">
            By signing in, you agree to our{" "}
            <span className="text-blue-600 underline cursor-pointer">
              Terms
            </span>
            ,{" "}
            <span className="text-blue-600 underline cursor-pointer">
              Privacy Policy
            </span>{" "}
            and{" "}
            <span className="text-blue-600 underline cursor-pointer">
              Cookies Policy
            </span>
            .
          </p>
        </Box>

        <div className="mt-6 border-t pt-4 text-center text-sm text-gray-700">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-700 font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signin;
