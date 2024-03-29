import { getCsrfToken, signIn } from "next-auth/react";
import Router from "next/router";
import { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
export default function SignIn({ csrfToken }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [gender, setGender] = useState("");


  const [license, setLicense] = useState("");
  const [speciality, setSpeciality] = useState("");


  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [labId, setLabId] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(null);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(true);
  const [otptext, setOtptext] = useState();
  const [enteredotp, setEnteredotp] = useState();
  const [message, setMessage] = useState(null);

  function generateOTP() {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math
      .random() * (maxm - minm + 1)) + minm;
  }


  const signinUser = async (e) => {
    e.preventDefault();
    let options = {
      redirect: false,
      email,
      name,
      firstname,
      lastname,
      phone,
      role,
      password,
    };
    const res = await signIn("credentials", options);
    setMessage(null);
    if (res?.error) {
      setMessage(res.error);
    } else {
      return Router.push("/profile");
    }
  };
  const signupPatient = async (e) => {
    e.preventDefault();
    if (otptext != enteredotp) {
      setMessage("Wrong OTP");
      return;
    }
    setMessage(null);
    const res = await fetch("/api/registerpatient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        firstname,
        lastname,
        phone,
        role: "patient",
        password,
      }),
    }) ;
    let data = await res.json();
    if (data.message) {
      setMessage(data.message);
    }
    if (data.message == "Registered successfully") {
      let options = {
        redirect: false,
        email,
        firstname,
        lastname,
        phone,
        role: "patient",
        password,
      };
      setRole("patient");
      const res = await signIn("credentials", options);
      return Router.push("/profile");
    }
  };
  const signupDoctor = async (e) => {
    e.preventDefault();
    if (otptext != enteredotp) {
      setMessage("Wrong OTP");
      return;
    }
    setMessage(null);

    const res = await fetch("/api/registerdoctor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        firstname,
        lastname,
        gender,
        license,
        speciality,
        city,
        phone,
        role: "doctor",
        password,
      }),
    });
    let data = await res.json();
    if (data.message) {
      setMessage(data.message);
    }
    if (data.message == "Registered successfully") {
      let options = {
        redirect: false,
        email,
        firstname,
        lastname,
        gender,
        license,
        speciality,
        city,
        phone,
        role: "doctor",
        password,
      };
      setRole("doctor");
      const res = await signIn("credentials", options);
      return Router.push("/profile");
    }
  };
  const signupLab = async (e) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/registerlab", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        type,
        phone,
        role: "lab",
        password,
      }),
    });
    let data = await res.json();
    if (data.message) {
      setMessage(data.message);
    }
    if (data.message == "Registered successfully") {
      let options = {
        redirect: false,
        email,
        name,
        type,
        phone,
        role: "lab",
        password,
      };
      const res = await signIn("credentials", options);
      setRole("lab");
      return Router.push("/");
    }
  };
  const sendotp = async (e) => {
    const otpnum = generateOTP();
    const number = "91" + phone
    const chatid = `${number}@c.us`
    const msg = `Your OTP is ${otpnum}`
    const res = await fetch("https://api.green-api.com/waInstance7103832087/sendMessage/9037e1378e404f429d9b24934c7282c7786a8e8a0ef14ee294", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: chatid,
        message: msg,
      }),
    });
    console.log(otpnum);
    setOtptext(otpnum);
    setOtp(false);
  }
  const [activeTab, setActiveTab] = useState("signin");
  return (
    // method="post" action="/api/auth/callback/credentials"
    <>

      <section className="gradient-form min-h-screen bg-white-200 dark:bg-neutral-700" >

        <div className="container  h-full pt-5 pb-5 pr-[204px] pl-[204px]">

          <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
            <div className="w-full">
              <div
                className="block rounded-lg bg-white shadow-lg dark:bg-neutral-800">
                <Tabs value="signin" id="custom-animation">
                  <TabsHeader className=" h-12 font-bold " >
                    <Tab className={`${activeTab === "signin" ? "bg-white text-black " : ""} m-auto grid items-center cursor-pointer hover:bg-white hover:text-black`} value="signin" onClick={() => setActiveTab("signin")}>
                      Sign In
                    </Tab>
                    <Tab className={`${activeTab === "patientregister" ? "bg-white text-black" : ""} m-auto grid items-center cursor-pointer hover:bg-white hover:text-black`} value="patientregister" onClick={() => setActiveTab("patientregister")}>
                      AS Patient
                    </Tab>
                    <Tab className={`${activeTab === "doctorregister" ? "bg-white text-black" : ""} m-auto grid items-center cursor-pointer hover:bg-white hover:text-black`} value="doctorregister" onClick={() => setActiveTab("doctorregister")}>
                      AS Doctor
                    </Tab>
                    <Tab className={`${activeTab === "labregister" ? "bg-white text-black" : ""} m-auto grid items-center cursor-pointer hover:bg-white hover:text-black`} value="labregister" onClick={() => setActiveTab("labregister")}>
                      AS Lab Worker
                    </Tab>
                  </TabsHeader>
                  <TabsBody>
                    <TabPanel value="signin">
                      {/* Sign In */}
                      <div className="g-0 lg:flex lg:flex-wrap">
                        <div className="mx-auto lg:w-6/12 px-4 md:px-0" >

                          <div className="md:mx-6 md:p-12 ">
                            {/* <!--Logo--> */}
                            <div className= "mx-auto text-center">
                              <img
                                className="mx-auto w-48 mt-2"
                                src="../images/mededg_logo2.png"
                                alt="logo" />
                              <h4 className="mb-6 mt-3  text-2xl font-semibold text-gray-800">
                                Welcome To <span className="text-blue-400">MedEdge!</span>
                              </h4>
                            </div>
                            <form>
                              <p className="mb-4 text-gray-600">Login to your account</p>
                              <div className="relative mb-4" data-te-input-wrapper-init>
                                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                                <label className="text-black-400 ">
                                  Email/Username
                                  <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your Gmail"
                                    onChange={(e) => setEmail(e.target.value)}
                                  />
                                </label>
      

                                <label className="text-black-400 ">
                                  Password
                                  <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                    name="password"
                                    type="password"
                                    placeholder="Enter Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                  />
                                </label>
                                <p style={{ color: "red" }}>{message}</p>
                                <button
                                  className="mb-3 mt-5 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xl font-medium bg-gradient-to-r from-lime-500 to-green-500 leading-normal text-black shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                                  type="submit" onClick={(e) => signinUser(e)}>
                                  Sign In
                                </button>
                              </div>

                              <div className="flex items-center justify-between pb-6">
                                <p className="mb-0 mr-2">New here? <span className="text-red-600">Register Now.</span></p>


                              </div>
                            </form>
                          </div>
                        </div>
                        <div
                          className="flex items-center bg-gradient-to-r from-lime-400 to-green-500"
                        >
                          <div className="px-4 py-6 text-black md:mx-6 md:p-12">
                          <h4 className="mb-6 text-xl font-semibold" style={{ fontFamily: 'Arial', fontSize: 22 }}>
                              Explore MedEdge
                            </h4>
                            <p className="text-sm" style={{ fontFamily: 'Times New Roman', fontSize: 18 }}>
                            Welcome to MedEdge!🌟 Whether you're a doctor, patient, lab worker, or student, 
                            sign in to unlock a world of healthcare innovation. Your journey towards better health starts here. 
                            Join us in shaping the future of medical excellence. Let's get started together!
                            </p>
                          </div>
                        </div>

                      </div>
                    </TabPanel>
                    <TabPanel value="patientregister">
                      {/* Register as a Patient */}
                      <div className="g-0 lg:flex lg:flex-wrap">
                        <div className="mx-auto lg:w-6/12 px-4 md:px-0">

                          <div className="md:mx-6 md:p-12">
                            {/* <!--Logo--> */}
                            <div className="text-center">
                              <img
                                className="mx-auto w-48 mt-1"
                                src="../images/mededg_logo2.png"
                                alt="logo" />
                              <h4 className="mb-3 mt-3 pb-1 text-xl font-semibold">
                                Welcome To <span className="text-blue-400 font-sans-serif">MedEdge!</span>
                              </h4>
                            </div>
                            <p className="mb-4">Register and Start </p>
                            <div className="relative mb-4" data-te-input-wrapper-init>
                              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                              <label className="text-black-400 ">
                                Email
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="email"
                                  type="email"
                                  placeholder="Enter your Gmail"
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </label>
                              <label className="text-black-400 ">
                                First Name
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="firstname"
                                  type="text"

                                  onChange={(e) => setFirstname(e.target.value)}
                                />
                              </label>
                              <label className="text-black-400 ">
                                Last Name
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="lastname"
                                  type="text"

                                  onChange={(e) => setLastname(e.target.value)}
                                />
                              </label>
                              <label className="text-black-400 ">
                                Phone Number
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="phone"
                                  type="text"
                                  onChange={(e) => setPhone(e.target.value)}
                                />
                              </label>

                              <label className="text-black-400 ">
                                Password
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="password"
                                  type="password"
                                  placeholder="Enter Password"
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                              </label>


                              <button
                                className="mb-3 mt-5 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xl font-medium bg-gradient-to-r from-lime-500 to-green-500 leading-normal text-black shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                                onClick={(e) => sendotp(e)}>
                                Send OTP
                              </button>

                              <label className="text-black-400 ">
                                OTP
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  disabled={otp}
                                  name="otp"
                                  type="password"
                                  onChange={(e) => setEnteredotp(e.target.value)}
                                />
                              </label>

                              <p style={{ color: "red" }}>{message}</p>

                              <button
                                className="mb-3 mt-5 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xl font-medium bg-gradient-to-r from-lime-500 to-green-500 leading-normal text-black shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                                disabled={otp} onClick={(e) => signupPatient(e)}>
                                Sign up as Patient
                              </button>
                            </div>

                            <div className="flex items-center justify-between pb-6">
                              <p className="mb-0 mr-2">Already have an Account! <span className="text-red-600">Sign In</span></p>


                            </div>
                          </div>
                        </div>
                        <div
                          className="flex items-center bg-gradient-to-r from-lime-400 to-green-500"
                        >
                          <div className="px-4 py-6 text-black md:mx-6 md:p-12">
                            <h4 className="mb-6 text-xl font-semibold" style={{ fontFamily: 'Arial', fontSize: 22 }}>
                              Register as a Patient
                            </h4>
                            <p className="text-sm" style={{ fontFamily: 'Times New Roman', fontSize: 18 }}>
                            At MedEdge, where your health takes center stage! As a registered patient, you're now part of a community dedicated to your well-being. 
                            Your journey to better health begins here, and we're here to support you every step of the way.
                            </p>
                          </div>
                        </div>

                      </div>
                    </TabPanel>

                    <TabPanel value="doctorregister">
                      {/* Register as a doctor */}
                      
                      <div className="g-0 lg:flex lg:flex-wrap">
                        <div className="mx-auto lg:w-6/12 px-4 md:px-0">

                          <div className="md:mx-6 md:p-12">
                            {/* <!--Logo--> */}
                            <div className="text-center">
                              <img
                                className="mx-auto w-48 mt-1"
                                src="../images/mededg_logo2.png"
                                alt="logo" />
                              <h4 className="mb-3 mt-3 pb-1 text-xl font-semibold">
                                Welcome To <span className="text-blue-400 font-sans-serif">MedEdge!</span>
                              </h4>
                            </div>
                            <p class="mb-4">Register and Start </p>
                            <div class="relative mb-4" data-te-input-wrapper-init>
                              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                              <label className="text-black-400 ">
                                Email
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="email"
                                  type="email"
                                  placeholder="Enter your Gmail"
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </label>
                              <label className="text-black-400 ">
                                First Name
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="firstname"
                                  type="text"

                                  onChange={(e) => setFirstname(e.target.value)}
                                />
                              </label>
                              <label className="text-black-400 ">
                                Last Name
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="lastname"
                                  type="text"

                                  onChange={(e) => setLastname(e.target.value)}
                                />
                              </label>
                              <label className="text-black-400 ">
                                Gender
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="gender"
                                  type="text"

                                  onChange={(e) => setGender(e.target.value)}
                                />
                              </label>


                              <label className="text-black-400 ">
                                Medical License Number
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="license"
                                  type="text"
                                  onChange={(e) => setLicense(e.target.value)}
                                />
                              </label>
                              <label className="text-black-400 ">
                                Specialist In
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="speciality"
                                  type="text"

                                  onChange={(e) => setSpeciality(e.target.value)}
                                />
                              </label>


                              <label className="text-black-400 ">
                                City
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="city"
                                  type="text"

                                  onChange={(e) => setCity(e.target.value)}
                                />
                              </label>
                              <label className="text-black-400 ">
                                Phone Number
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="phone"
                                  type="text"
                                  onChange={(e) => setPhone(e.target.value)}
                                />
                              </label>

                              <label className="text-black-400 ">
                                Password
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="password"
                                  type="password"
                                  placeholder="Enter Password"
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                              </label>


                              <button
                                className="mb-3 mt-5 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xl font-medium bg-gradient-to-r from-lime-500 to-green-500 leading-normal text-black shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                                onClick={(e) => sendotp(e)}>
                                Send OTP
                              </button>

                              <label className="text-black-400 ">
                                OTP
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  disabled={otp}
                                  name="otp"
                                  type="password"
                                  onChange={(e) => setEnteredotp(e.target.value)}
                                />
                              </label>

                              <p style={{ color: "red" }}>{message}</p>

                              <button
                                className="mb-3 mt-5 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xl font-medium bg-gradient-to-r from-lime-500 to-green-500 leading-normal text-black shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                                disabled={otp} onClick={(e) => signupDoctor(e)}>
                                Sign up as doctor
                              </button>
                            </div>

                            <div className="flex items-center justify-between pb-6">
                              <p className="mb-0 mr-2">Already have an Account!<span className="text-red-600">Sign In.</span></p>


                            </div>
                          </div>
                        </div>
                        <div
                          className="flex items-center bg-gradient-to-r from-lime-400 to-green-500"
                        >
                          <div className="px-4 py-6 text-black md:mx-6 md:p-12">
                            <h4 className="mb-6 text-xl font-semibold" style={{ fontFamily: 'Arial', fontSize: 22 }}>
                            Register as a Doctor
                            </h4>
                            <p className="text-sm" style={{ fontFamily: 'Times New Roman', fontSize: 18 }}>
                            At MedEdge, where healing meets innovation! 
                            We're thrilled to have you on board as a registered doctor. 
                            Your expertise is a valuable addition to our community, 
                            and we look forward to advancing healthcare together.
                            </p>
                          </div>
                        </div>

                      </div>
                    </TabPanel>



                    <TabPanel value="labregister">
                      {/* Register as a Lab */}
                      <div className="g-0 lg:flex lg:flex-wrap">
                        <div className="mx-auto lg:w-6/12 px-4 md:px-0">

                          <div className="md:mx-6 md:p-12">
                            {/* <!--Logo--> */}
                            <div className="text-center">
                              <img
                                className="mx-auto w-48 mt-1"
                                src="../images/mededg_logo2.png"
                                alt="logo" />
                              <h4 className="mb-3 mt-3 pb-1 text-xl font-semibold">
                                Welcome To <span className="text-blue-400 font-sans-serif">MedEdge!</span>
                              </h4>
                            </div>
                            <p className="mb-4">Register and Start </p>
                            <div class="relative mb-4" data-te-input-wrapper-init>
                              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                              <label className="text-black-400 ">
                                Email
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="email"
                                  type="email"
                                  placeholder="Enter your Gmail"
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </label>
                              <label className="text-black-400 ">
                                Name
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="name"
                                  type="text"

                                  onChange={(e) => setName(e.target.value)}
                                />
                              </label>
                              <label className="text-black-400 ">
                                Type
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="type"
                                  type="text"

                                  onChange={(e) => setType(e.target.value)}
                                />
                              </label>
                              <label className="text-black-400 ">
                                Lab License I'd
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="labId"
                                  type="text"

                                  onChange={(e) => setLabId(e.target.value)}
                                />
                              </label>
                              <label className="text-black-400 ">
                                Phone Number
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="phone"
                                  type="text"
                                  onChange={(e) => setPhone(e.target.value)}
                                />
                              </label>

                              <label className="text-black-400 ">
                                Password
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  name="password"
                                  type="password"
                                  placeholder="Enter Password"
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                              </label>


                              <button
                                className="mb-3 mt-5 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xl font-medium bg-gradient-to-r from-lime-500 to-green-500 leading-normal text-black shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                                onClick={(e) => sendotp(e)}>
                                Send OTP
                              </button>

                              <label className="text-black-400 ">
                                OTP
                                <input className=" peer block min-h-[auto] w-full rounded border-2 border-gray-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  disabled={otp}
                                  name="otp"
                                  type="password"
                                  onChange={(e) => setEnteredotp(e.target.value)}
                                />
                              </label>

                              <p style={{ color: "red" }}>{message}</p>

                              <button
                                className="mb-3 mt-5 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xl font-medium bg-gradient-to-r from-lime-500 to-green-500 leading-normal text-black shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                                disabled={otp} onClick={(e) => signupLab(e)}>
                                Sign up as Lab
                              </button>
                            </div>

                            <div className="flex items-center justify-between pb-6">
                              <p className="mb-0 mr-2">Already have an Account!<span className="text-red-600"> Sign In </span></p>


                            </div>
                          </div>
                        </div>
                        <div
                          className="flex items-center bg-gradient-to-r from-lime-400 to-green-500"
                        >
                          <div className="px-4 py-6 text-black md:mx-6 md:p-12">
                            <h4 className="mb-6 text-xl font-semibold" style={{ fontFamily: 'Arial', fontSize: 22 }}>
                              Register as a Lab worker
                            </h4>
                            <p className="text-sm" style={{ fontFamily: 'Times New Roman', fontSize: 18 }}>
                            At MedEdge, where precision and care intersect in the world of 
                            diagnostics! As a registered Lab Worker, your expertise adds a critical 
                            dimension to our commitment to healthcare excellence. 
                            Let's work together to advance medical diagnostics and improve lives.
                            </p>
                          </div>
                        </div>

                      </div>
                    </TabPanel>
                  </TabsBody>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
