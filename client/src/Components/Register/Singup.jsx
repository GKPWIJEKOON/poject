import { Formik, Form, Field } from "formik";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { signupAction } from "../../Redux/Auth/Action";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  username: Yup.string().min(4).required("Required"),
  password: Yup.string().min(8).required("Required"),
  name: Yup.string().min(2).required("Required"),
});

const Signup = () => {
  const initialValues = { email: "", username: "", password: "", name: "" };
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = (values, actions) => {
    dispatch(signupAction(values));
    actions.setSubmitting(false);
  };

  useEffect(() => {
    if (auth.signup?.username) {
      navigate("/login");
      toast({
        title: "Account created successfully",
        status: "success",
        duration: 8000,
        isClosable: true,
      });
    }
  }, [auth.signup]);

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0a2540] via-[#143d6d] to-[#1e5799] p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://www.e-learning-platform.org/images/e-learning-logo.png"
            alt="logo"
            className="h-16"
          />
          <p className="font-semibold text-sm text-center mt-4 text-blue-800">
            Experience the delightful learning experience with ELearnXpert.
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {(formikProps) => (
            <Form>
              <Field name="email">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.email && form.touched.email}
                    mb={4}
                  >
                    <Input {...field} id="email" placeholder="Email" />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="username">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.username && form.touched.username}
                    mb={4}
                  >
                    <Input {...field} id="username" placeholder="Username" />
                    <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="name">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.name && form.touched.name}
                    mb={4}
                  >
                    <Input {...field} id="name" placeholder="Full Name" />
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
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
                    />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <p className="text-xs text-center mt-2 text-gray-600">
                By signing up, you agree to our{" "}
                <span className="text-blue-600 underline">Terms</span>,{" "}
                <span className="text-blue-600 underline">Privacy Policy</span>, and{" "}
                <span className="text-blue-600 underline">Cookies Policy</span>.
              </p>

              <Button
                className="w-full"
                mt={6}
                colorScheme="blue"
                type="submit"
                isLoading={formikProps.isSubmitting}
              >
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm mt-4 text-gray-700">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer underline"
          >
            Sign In
          </span>
        </p>
      </div>
    </main>
  );
};

export default Signup;
