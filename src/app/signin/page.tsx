"use client";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import useStore from "@/store/userStore";
import toast, { Toaster } from "react-hot-toast";

interface FormInputs {
  username: string;
  password: string;
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [usernameIsValid, setUsernameIsValid] = useState(true);

  const router = useRouter();

  const { register, handleSubmit } = useForm<FormInputs>();
  const onSubmit: SubmitHandler<FormInputs> = (data) => loginHandler(data);

  const loginHandler = async (data: FormInputs) => {
    setIsLoading(true);
    if (!inputCheck(data.username, data.password)) {
      setIsLoading(false);
      return;
    }
    login(data.username, data.password);
  };

  const inputCheck = (username: string, password: string) => {
    let valid = true;
    if (username.length < 3) {
      setUsernameIsValid(false);
      valid = false;
    }
    if (password.length < 3) {
      setPasswordIsValid(false);
      valid = false;
    }
    return valid;
  };
  const login = async (username: string, password: string) => {
    axios
      .post(`http://${process.env.NEXT_PUBLIC_SERVER}/api/register/`, {
        username: username,
        password: password,
      })
      .then(function(response) {
        console.log(response);
        axios.post;
        toast.success(`Your account has been created.
                        Welcome!`);
        router.push("/login");
      })
      .catch(function(error) {
        console.log(error);
        toast.error(`Wrong username or password. 
                      Please try again!`);
      });
  };
  return (
    <Container>
      <div className="flex flex-col">
        <div className="mt-12 flex flex-row justify-center">
          <div className="rounded-lg bg-gray-900 p-5 shadow-2xl ">
            <form onSubmit={handleSubmit(onSubmit)} className="">
              {!usernameIsValid && (
                <span className="text-sm text-red-500">
                  Username must be at least 3 characters
                </span>
              )}
              <FormInput
                register={register("username", { required: true })}
                type="username"
                placeholder="Username"
                className=""
              />
              <div className="mt-2">
                {!passwordIsValid && (
                  <span className="text-sm text-red-500">
                    password must be at least 3 characters
                  </span>
                )}
                <FormInput
                  register={register("password", { required: true })}
                  type="password"
                  placeholder="Password"
                />
              </div>
              <div className="mt-2 flex flex-row justify-center border-b-2 border-gray-600 pb-6">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-500 text-2xl text-white sm:py-2 sm:text-3xl"
                >
                  Create Account
                </button>
              </div>
              <Link href="/login">
                <div className=" mt-6 flex flex-row justify-center ">
                  <button className="w-1/2 rounded-lg bg-green-600 text-2xl text-white hover:bg-green-700 sm:py-2 sm:text-3xl">
                    Login
                  </button>
                </div>
              </Link>
            </form>
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </Container>
  );
}
