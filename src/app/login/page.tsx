"use client";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import useStore from "@/store/userStore";
import { LoadingSpinner } from "@/components/ui/Loading";
import toast, { Toaster } from "react-hot-toast";

interface FormInputs {
  username: string;
  password: string;
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit } = useForm<FormInputs>();
  const onSubmit: SubmitHandler<FormInputs> = (data) => loginHandler(data);

  const loginHandler = async (data: FormInputs) => {
    setIsLoading(true);
    login(data.username, data.password);
  };

  const login = async (username: string, password: string) => {
    axios
      .post("http://127.0.0.1:8000/api/login/", {
        username: username,
        password: password,
      })
      .then(function(response) {
        console.log(response);
        const user = response.data.user;
        const token = response.data.access;
        const refreshToken = response.data.refresh;
        useStore.getState().setUser(user, token);
        document.cookie = `access_token=${token}`;
        document.cookie = `refresh_token=${refreshToken}`;
        axios.post;
        router.push("/");
      })
      .catch(function(error) {
        setIsLoading(false)
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
              <FormInput
                register={register("username", { required: true })}
                type="username"
                placeholder="Username"
                className=""
              />
              <div className="mt-2">
                <FormInput
                  register={register("password", { required: true })}
                  type="password"
                  placeholder="Password"
                />
              </div>
              <div className="border-b-2 border-gray-600 pb-6 flex flex-row justify-center mt-2">
                {!isLoading && (<button
                  type="submit"
                  className="bg-blue-500 w-full text-2xl text-white rounded-lg sm:text-3xl sm:py-2"
                >
                  Login
                </button>)}
                {isLoading && (<div
                  className="bg-blue-500 w-full text-2xl text-white rounded-lg sm:text-3xl sm:py-2"
                >
                  <div className="flex flex-row justify-center">
                    <LoadingSpinner size={40} />

                  </div>
                </div>)}
              </div>
              <Link href='/signin'>
                <div className=" mt-6 justify-center flex flex-row ">
                  <button className="hover:bg-green-700 bg-green-600 w-1/2 text-2xl text-white rounded-lg sm:text-3xl sm:py-2"
                  >
                    Sign Up
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
