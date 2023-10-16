"use client";
import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import classNames from "classnames";
import { CaretDownIcon } from "@radix-ui/react-icons";
import useStore from "@/store/userStore";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Usage

export default function Header() {
  const [token, setToken] = useState();
  useEffect(() => {
    setToken(getCookie("access_token"));
  }, []);

  useEffect(() => {
    const get_user_from_token = async () => {
      var validUser = null;
      await axios
        .get(`${process.env.NEXT_PUBLIC_SERVER}/api/get_user_from_token/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // Process the response data
          const user = { ...response.data.user, token };
          useStore.setState({ user: user });
          validUser = true;
        })
        .catch((error) => {
          console.log(error.response);
          // Handle errors
          // if (error.response.status === 401) {
          //   console.log("error");
          // }

          console.log("Error:", error);
        });
      return validUser;
    };
    const refresh_token = async () => {
      const refresh_token = getCookie("refresh_token");
      axios
        .post(`${process.env.NEXT_PUBLIC_SERVER}/api/token/refresh/`, {
          refresh: refresh_token,
        })
        .then((response) => {
          // Process the response data
          const access_token = response.data.access;
          document.cookie = `access_token=${access_token}; path=/;`;
          setToken(access_token);
        })
        .catch((error) => {
          // Handle errors
          console.log("Error:", error);
        });
    };

    const getUser = async () => {
      if (token) {
        const user = await get_user_from_token();
        if (!user) {
          refresh_token();
          get_user_from_token();
        }
      }
    };
    getUser();
  }, [token]);
  const { user } = useStore((state) => ({ user: state.user }));

  return (
    <NavigationMenu.Root className="relative z-[1] flex  justify-center ">
      <NavigationMenu.List className="center  m-0 mt-2 flex list-none rounded-[6px] bg-gray-900  p-1">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-xl font-medium leading-none text-gray-400 outline-none hover:bg-gray-700 focus:shadow-[0_0_0_2px]">
            Play{" "}
            <CaretDownIcon
              className="  relative top-[1px] h-6 w-6 transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute left-0 top-0 w-full bg-gray-900 data-[motion=from-end]:animate-enterFromRight data-[motion=from-start]:animate-enterFromLeft data-[motion=to-end]:animate-exitToRight data-[motion=to-start]:animate-exitToLeft sm:w-auto">
            <ul className="one m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[500px] sm:grid-cols-[0.75fr_1fr]">
              <li className="row-span-3 grid">
                <NavigationMenu.Link asChild>
                  <a
                    className="flex h-full w-full select-none
                        flex-col justify-end rounded-[6px] bg-gradient-to-b from-purple9 to-indigo9 no-underline  outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet7"
                    href="/"
                  >
                    <Image
                      className="h-full w-full rounded-md object-cover"
                      src="/noble_chess.png"
                      width={256}
                      height={256}
                      alt="Chess"
                    />
                  </a>
                </NavigationMenu.Link>
              </li>

              <ListItem href="/chess" title="Play">
                Play a game of chess
              </ListItem>
              <ListItem href="/chess/practice" title="Practice">
                Practice chess by yourself
              </ListItem>
              <ListItem href="https://icons.radix-ui.com/" title="Icons">
                A crisp set of 15x15 icons, balanced and consistent.
              </ListItem>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-xl font-medium leading-none text-gray-400 outline-none hover:bg-gray-700 focus:shadow-[0_0_0_2px] focus:shadow-blue-400">
            Overview{" "}
            <CaretDownIcon
              className="relative top-[1px] h-6 w-6 transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute left-0 top-0 w-full bg-gray-900 sm:w-auto">
            <ul className="m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[600px] sm:grid-flow-col sm:grid-rows-3">
              <ListItem
                title="Introduction"
                href="/primitives/docs/overview/introduction"
              >
                Build high-quality, accessible design systems and web apps.
              </ListItem>
              <ListItem
                title="Getting started"
                href="/primitives/docs/overview/getting-started"
              >
                A quick tutorial to get you up and running with Radix
                Primitives.
              </ListItem>
              <ListItem title="Styling" href="/primitives/docs/guides/styling">
                Unstyled and compatible with any styling solution.
              </ListItem>
              <ListItem
                title="Animation"
                href="/primitives/docs/guides/animation"
              >
                Use CSS keyframes or any animation library of your choice.
              </ListItem>
              <ListItem
                title="Accessibility"
                href="/primitives/docs/overview/accessibility"
              >
                Tested in a range of browsers and assistive technologies.
              </ListItem>
              <ListItem
                title="Releases"
                href="/primitives/docs/overview/releases"
              >
                Radix Primitives releases and their changelogs.
              </ListItem>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {!user && (
          <NavigationMenu.Item>
            <NavigationMenu.Link
              className="block select-none  rounded-[4px] px-3 py-2 text-xl font-medium leading-none text-gray-400 no-underline outline-none hover:bg-gray-700 focus:shadow-[0_0_0_2px] focus:shadow-blue-400"
              href="/login"
            >
              Login
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        )}
        {user && <AcountManager username={user.username} />}

        <NavigationMenu.Indicator className="top-full z-[1] flex h-[10px] items-end justify-center overflow-hidden transition-[width,transform_250ms_ease] data-[state=hidden]:animate-fadeOut data-[state=visible]:animate-fadeIn">
          <div className="relative top-[70%] h-[10px] w-[10px] rotate-[45deg] rounded-tl-[2px] bg-gray-900" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <div className="absolute left-0 top-full flex w-full justify-center perspective-[2000px]">
        <NavigationMenu.Viewport className="relative mt-[10px] h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-[6px] bg-gray-900 transition-[width,_height] duration-300 data-[state=closed]:animate-scaleOut data-[state=open]:animate-scaleIn sm:w-[var(--radix-navigation-menu-viewport-width)]" />
      </div>
    </NavigationMenu.Root>
  );
}
const ListItem = React.forwardRef(
  ({ className, children, title, ...props }, forwardedRef) => (
    <li>
      <NavigationMenu.Link asChild>
        <Link
          className={classNames(
            "block  select-none rounded-[6px] p-3 text-[15px] leading-none no-underline outline-none transition-colors hover:bg-gray-700 focus:shadow-[0_0_0_2px]",
            className,
          )}
          {...props}
          ref={forwardedRef}
        >
          <div className="mb-[5px] font-medium leading-[1.2] text-gray-300">
            {title}
          </div>
          <p className="leading-[1.4] text-gray-400">{children}</p>
        </Link>
      </NavigationMenu.Link>
    </li>
  ),
);
ListItem.displayName = "ListItem";

const AcountManager = ({ username }) => {
  const logout = () => {
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    useStore.setState({ user: null });
  };
  return (
    <NavigationMenu.Item>
      <NavigationMenu.Trigger className="group flex select-none  items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-xl font-medium leading-none text-gray-400 outline-none hover:bg-gray-700 focus:shadow-[0_0_0_2px] focus:shadow-blue-400">
        {username}{" "}
        <CaretDownIcon
          className="relative top-[1px] h-6 w-6 transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
          aria-hidden
        />
      </NavigationMenu.Trigger>
      <NavigationMenu.Content className="absolute left-0 top-0 w-full bg-gray-900 data-[motion=from-end]:animate-enterFromRight data-[motion=from-start]:animate-enterFromLeft data-[motion=to-end]:animate-exitToRight data-[motion=to-start]:animate-exitToLeft sm:w-auto">
        <ul className="one m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[500px] sm:grid-cols-[0.75fr_1fr]">
          <ListItem href="https://stitches.dev/" title="Settings">
            View your account settings
          </ListItem>
          <ListItem href="/test" title="Test">
            Test area
          </ListItem>
          <ListItem href="/message" title="Message">
            Chat with your friends
          </ListItem>
          <ListItem
            href="/"
            title="Logout"
            onClick={() => {
              logout();
            }}
          >
            {/* A crisp set of 15x15 icons, balanced and consistent. */}
          </ListItem>
        </ul>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  );
};
