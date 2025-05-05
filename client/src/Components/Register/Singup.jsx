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
    <main className="min-h-screen w-full flex items-center justify-center bg-[#0a2540] p-8">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-2xl">
        <div className="flex flex-col items-center mb-10">
          <img
            src="https://www.e-learning-platform.org/images/e-learning-logo.png"
            alt="logo"
            className="h-24"
          />
          <p className="font-semibold text-xl text-center mt-6 text-gray-700">
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
                    mb={6}
                  >
                    <Input
                      {...field}
                      id="email"
                      placeholder="Email"
                      size="lg"
                      fontSize="lg"
                      h="14"
                    />
                    <FormErrorMessage fontSize="md">
                      {form.errors.email}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="username">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.username && form.touched.username}
                    mb={6}
                  >
                    <Input
                      {...field}
                      id="username"
                      placeholder="Username"
                      size="lg"
                      fontSize="lg"
                      h="14"
                    />
                    <FormErrorMessage fontSize="md">
                      {form.errors.username}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="name">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.name && form.touched.name}
                    mb={6}
                  >
                    <Input
                      {...field}
                      id="name"
                      placeholder="Full Name"
                      size="lg"
                      fontSize="lg"
                      h="14"
                    />
                    <FormErrorMessage fontSize="md">
                      {form.errors.name}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="password">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.password && form.touched.password}
                    mb={6}
                  >
                    <Input
                      {...field}
                      type="password"
                      id="password"
                      placeholder="Password"
                      size="lg"
                      fontSize="lg"
                      h="14"
                    />
                    <FormErrorMessage fontSize="md">
                      {form.errors.password}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <p className="text-md text-center mt-4 text-gray-600">
                By signing up, you agree to our{" "}
                <span className="text-gray-800 underline cursor-pointer">
                  Terms
                </span>
                ,{" "}
                <span className="text-gray-800 underline cursor-pointer">
                  Privacy Policy
                </span>{" "}
                and{" "}
                <span className="text-gray-800 underline cursor-pointer">
                  Cookies Policy
                </span>
                .
              </p>

              <Button
                className="w-full"
                mt={8}
                size="lg"
                fontSize="lg"
                h="14"
                colorScheme="blue"
                type="submit"
                isLoading={formikProps.isSubmitting}
              >
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-lg mt-8 text-gray-700">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-gray-800 cursor-pointer underline"
          >
            Sign In
          </span>
        </p>
      </div>
    </main>
  );
};

export default Signup;
