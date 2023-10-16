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
      .post(`${process.env.NEXT_PUBLIC_SERVER}/api/login/`, {
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
        setIsLoading(false);
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
              <div className="mt-2 flex flex-row justify-center border-b-2 border-gray-600 pb-6">
                {!isLoading && (
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-500 text-2xl text-white sm:py-2 sm:text-3xl"
                  >
                    Login
                  </button>
                )}
                {isLoading && (
                  <div className="w-full rounded-lg bg-blue-500 text-2xl text-white sm:py-2 sm:text-3xl">
                    <div className="flex flex-row justify-center">
                      <LoadingSpinner size={40} />
                    </div>
                  </div>
                )}
              </div>
              <Link href="/signin">
                <div className=" mt-6 flex flex-row justify-center ">
                  <button className="w-1/2 rounded-lg bg-green-600 text-2xl text-white hover:bg-green-700 sm:py-2 sm:text-3xl">
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
