"use client";
import { Container } from "@/components/ui/Container";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import useStore from "@/store/userStore";

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
      .then(function (response) {
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
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <Container>
      <div className="flex flex-col">
        <div className="flex flex-row justify-center mt-12">
          <div className="border-sm rounded-md border-gray-400 border-2 p-5 shadow-2xl ">
            <form onSubmit={handleSubmit(onSubmit)} className="">
              <FormInput
                register={register("username", { required: true })}
                type="username"
                placeholder="Username"
              />
              <div className="mt-2">
                <FormInput
                  register={register("password", { required: true })}
                  type="password"
                  placeholder="Password"
                />
              </div>
              <div className="flex flex-row justify-center mt-2">
                <button
                  type="submit"
                  className="bg-blue-400 w-full text-white rounded-lg"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}
