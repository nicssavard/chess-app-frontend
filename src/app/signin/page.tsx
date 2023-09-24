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
  const [passwordIsValid, setPasswordIsValid] = useState(true)
  const [usernameIsValid, setUsernameIsValid] = useState(true)

  const router = useRouter();

  const { register, handleSubmit } = useForm<FormInputs>();
  const onSubmit: SubmitHandler<FormInputs> = (data) => loginHandler(data);

  const loginHandler = async (data: FormInputs) => {
    setIsLoading(true);
    if (!inputCheck(data.username, data.password)) {
      setIsLoading(false)
      return
    }
    login(data.username, data.password);
  };

  const inputCheck = (username: string, password: string) => {
    let valid = true;
    if (username.length < 3) {
      setUsernameIsValid(false);
      valid = false
    }
    if (password.length < 3) {
      setPasswordIsValid(false)
      valid = false
    }
    return valid;
  }
  const login = async (username: string, password: string) => {
    axios
      .post("http://127.0.0.1:8000/api/register/", {
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
                      Please try again!`)
      });
  };
  return (
    <Container>
      <div className="flex flex-col">
        <div className="flex flex-row justify-center mt-12">
          <div className="rounded-lg p-5 bg-gray-900 shadow-2xl ">
            <form onSubmit={handleSubmit(onSubmit)} className="">
              {!usernameIsValid && <span className="text-sm text-red-500">Username must be at least 3 characters</span>}
              <FormInput
                register={register("username", { required: true })}
                type="username"
                placeholder="Username"
                className=""
              />
              <div className="mt-2">
                {!passwordIsValid && <span className="text-sm text-red-500">password must be at least 3 characters</span>}
                <FormInput
                  register={register("password", { required: true })}
                  type="password"
                  placeholder="Password"
                />
              </div>
              <div className="border-b-2 border-gray-600 pb-6 flex flex-row justify-center mt-2">
                <button
                  type="submit"
                  className="bg-blue-500 w-full text-2xl text-white rounded-lg sm:text-3xl sm:py-2"
                >
                  Create Account
                </button>
              </div>
              <Link href='/login'>
                <div className=" mt-6 justify-center flex flex-row ">
                  <button className="hover:bg-green-700 bg-green-600 w-1/2 text-2xl text-white rounded-lg sm:text-3xl sm:py-2"
                  >
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
