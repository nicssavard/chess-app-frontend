"use client";
import React, { use } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import classNames from "classnames";
import { CaretDownIcon } from "@radix-ui/react-icons";
import useStore from "@/store/userStore";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { set } from "react-hook-form";

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
        .get("http://127.0.0.1:8000/api/get_user_from_token/", {
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
          if (error.response.status === 401) {
          }

          console.log("Error:", error);
        });
      return validUser;
    };
    const refresh_token = async () => {
      const refresh_token = getCookie("refresh_token");
      axios
        .post("http://127.0.0.1:8000/api/token/refresh/", {
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
    <NavigationMenu.Root className="relative z-[1] flex w-screen justify-center ">
      <NavigationMenu.List className="center shadow-blackA7 m-0 flex list-none rounded-[6px] bg-gray-900 p-1 shadow-[0_2px_10px] mt-2">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="text-gray-400 hover:bg-violet3 focus:shadow-violet7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
            Play{" "}
            <CaretDownIcon
              className="text-gray-400 relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="bg-gray-900 data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight absolute top-0 left-0 w-full sm:w-auto">
            <ul className="one m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[500px] sm:grid-cols-[0.75fr_1fr]">
              <li className="row-span-3 grid">
                <NavigationMenu.Link asChild>
                  <a
                    className="focus:shadow-violet7 from-purple9 to-indigo9 flex
                        h-full w-full select-none flex-col justify-end rounded-[6px] bg-gradient-to-b p-[25px] no-underline outline-none focus:shadow-[0_0_0_2px]"
                    href="/"
                  >
                    <svg
                      aria-hidden
                      width="38"
                      height="38"
                      viewBox="0 0 25 25"
                      fill="white"
                    >
                      <path d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z"></path>
                      <path d="M12 0H4V8H12V0Z"></path>
                      <path d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z"></path>
                    </svg>
                    <div className="mt-4 mb-[7px] text-[18px] font-medium leading-[1.2] text-white">
                      Radix Primitives
                    </div>
                    <p className="text-mauve4 text-[14px] leading-[1.3]">
                      Unstyled, accessible components for React.
                    </p>
                  </a>
                </NavigationMenu.Link>
              </li>

              <ListItem href="/chess/practice" title="Practice">
                Practice chess by yourself
              </ListItem>
              <ListItem href="/colors" title="Colors">
                Beautiful, thought-out palettes with auto dark mode.
              </ListItem>
              <ListItem href="https://icons.radix-ui.com/" title="Icons">
                A crisp set of 15x15 icons, balanced and consistent.
              </ListItem>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="text-gray-400 hover:bg-violet3 focus:shadow-violet7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
            Overview{" "}
            <CaretDownIcon
              className="text-gray-400 relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute top-0 left-0 w-full sm:w-auto">
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
              className="text-gray-400 hover:bg-gray-700 focus:shadow-blue-400 block select-none rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none no-underline outline-none focus:shadow-[0_0_0_2px]"
              href="/login"
            >
              Login
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        )}
        {user && <AcountManager username={user.username} />}

        <NavigationMenu.Indicator className="data-[state=visible]:animate-fadeIn data-[state=hidden]:animate-fadeOut top-full z-[1] flex h-[10px] items-end justify-center overflow-hidden transition-[width,transform_250ms_ease]">
          <div className="relative top-[70%] h-[10px] w-[10px] rotate-[45deg] rounded-tl-[2px] bg-white" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <div className="perspective-[2000px] absolute top-full left-0 flex w-full justify-center">
        <NavigationMenu.Viewport className="data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut relative mt-[10px] h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-[6px] bg-white transition-[width,_height] duration-300 sm:w-[var(--radix-navigation-menu-viewport-width)]" />
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
            "focus:shadow-[0_0_0_2px]  hover:bg-gray-700 block select-none rounded-[6px] p-3 text-[15px] leading-none no-underline outline-none transition-colors",
            className
          )}
          {...props}
          ref={forwardedRef}
        >
          <div className="text-gray-300 mb-[5px] font-medium leading-[1.2]">
            {title}
          </div>
          <p className="text-gray-400 leading-[1.4]">{children}</p>
        </Link>
      </NavigationMenu.Link>
    </li>
  )
);

const AcountManager = ({ username }) => {
  // return (
  //   <NavigationMenu.Item>
  //     <NavigationMenu.Link
  //       className="text-gray-400 hover:bg-gray-700 focus:shadow-blue-400 block select-none rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none no-underline outline-none focus:shadow-[0_0_0_2px]"
  //       href="/settings"
  //     >
  //       {username}
  //     </NavigationMenu.Link>
  //   </NavigationMenu.Item>
  // );
  const logout = () => {
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    useStore.setState({ user: null });
  };
  return (
    <NavigationMenu.Item>
      <NavigationMenu.Trigger className="text-gray-400 hover:bg-gray-700  group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
        {username}{" "}
        <CaretDownIcon
          className="text-gray-400 relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
          aria-hidden
        />
      </NavigationMenu.Trigger>
      <NavigationMenu.Content className="bg-gray-900 data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight absolute top-0 left-0 w-full sm:w-auto">
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
