import React, { useEffect, useRef, useState } from "react";
import register from "../assets/svg/register.svg";
import logo from "../assets/images/logo.png";
import {
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
  Box,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import { MdClear } from "react-icons/md";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

const Registration = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [countryIsd, setCountryIsd] = useState([]);
  const [otpSend, setOtpSend] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(180);

  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState(false);
  const [mobileNoError, setMobileNoError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [otpError, setOtpError] = useState(false);

  const otpRef = useRef(null);

  const [registerData, setRegisterData] = useState({
    title: "",
    name: "",
    email: "",
    mobileNo: "",
    countryCode: "",
  });

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.name.common,
          code:
            country.idd.root +
            (country.idd.suffixes ? country.idd.suffixes[0] : ""),
        }));
        const sortedCountryIsd = [...countries].sort((a, b) => {
          if (a.name === "India") return -1; // Place India on top
          if (b.name === "India") return 1;
          return a.name.localeCompare(b.name); // Alphabetical order for others
        });
        setCountryIsd(sortedCountryIsd);
      })
      .catch((error) => console.error("Error fetching ISD codes:", error));
  }, []);

  useEffect(() => {
    if (otpSend) {
      otpRef.current.focus();
    }
  }, [otpSend]);

  useEffect(() => {
    let intervalId = null;
    if (resendDisabled) {
      intervalId = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [resendDisabled]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // With my api
  // const handleRegisterAndGetOtp = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const { data } = await axios.post("api/user/", {
  //       ...registerData,
  //     });
  //     if (data) {
  //       toast.success(data?.message);
  //       setOtpSend(true);
  //       setResendDisabled(true);
  //     } else {
  //       toast.error("Failed to send OTP");
  //     }
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   }
  //   setLoading(false);
  // };

  // With company api
  const handleRegisterAndGetOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        email: registerData.email,
        mobile: registerData.mobileNo,
        name: registerData.name,
        salutation: registerData.title,
      };
      const { data } = await axios.post(
        "https://colo-dev.infollion.com/api/v1/self-registration/register",
        payload
      );
      if (data?.success) {
        toast.success(data?.message);
        setOtpSend(true);
        setResendDisabled(true);
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };

  // own API
  // const verifyOtpAndCompleteReg = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const { data } = await axios.post("api/user/verify-otp", {
  //       ...registerData,
  //       otp,
  //     });
  //     toast.success(data?.message);
  //     setTimeout(() => {
  //       navigate("/home");
  //     }, 2000);
  //     setOtpSend(false);
  //     setResendDisabled(false);
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   }
  //   setLoading(false);
  // };

  //Company Api
  const verifyOtpAndCompleteReg = async (e) => {
    e.preventDefault();
    setLoading(true);
    const otpVerify = registerData?.mobileNo.slice(-6);
    if (otpVerify === otp) {
      toast.success("OTP Verification Success");
      setTimeout(() => {
        setOtpSend(false);
        setResendDisabled(false);
        setLoading(false);
        navigate("/home");
      }, 2000);
    } else {
      setTimeout(() => {
        toast.error("OTP verification failed");
        setLoading(false);
      }, 2000);
    }
    // try {
    //   const payload = {
    //     action: "SelfRegister",
    //     email: registerData.email,
    //     otp: otp,
    //   };
    //   const { data } = await axios.post(
    //     "https://colo-dev.infollion.com/api/v1/self-registration/verify-otp",
    //     { ...payload }
    //   );
    //   console.log("data", data);
    //   toast.success(data?.message);
    //   setTimeout(() => {
    //     navigate("/home");
    //   }, 2000);
    //   setOtpSend(false);
    //   setResendDisabled(false);
    // } catch (error) {
    //   if (error?.response?.data?.error) {
    //     toast.error(error?.response?.data?.error);
    //   } else {
    //     toast.error(error?.response?.data?.message);
    //   }
    // }
    // setLoading(false)
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} min ${secs} sec`;
  };

  // own api
  // const handleResendOtp = async () => {
  //   // Reset the timer
  //   setTimer(180);
  //   setResendDisabled(true);
  //   try {
  //     const { data } = await axios.post("api/user/", {
  //       ...registerData,
  //     });
  //     if (data) {
  //       toast.success(data?.message);
  //       setOtpSend(true);
  //     } else {
  //       toast.error("Failed to send OTP");
  //     }
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   }
  //   setLoading(false);
  // };

  // company api
  const handleResendOtp = async () => {
    // Reset the timer
    setTimer(180);
    setResendDisabled(true);
    try {
      const payload = {
        email: registerData.email,
        mobile: registerData.mobileNo,
        name: registerData.name,
        salutation: registerData.title,
      };
      const { data } = await axios.post(
        "https://colo-dev.infollion.com/api/v1/self-registration/register",
        { ...payload }
      );
      if (data?.success) {
        toast.success(data?.message);
        setOtpSend(true);
        setResendDisabled(true);
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleInput = (name, value) => {
    if (name === "mobileNo") {
      if (value !== "") {
        validateMobileNo(value);
      }
      value = validateMobileNumber(value);
    }
    if (name === "email") {
      validateEmail(value);
      value = validateEmailLowerCase(value);
    }
    if (name === "name") {
      validateNameError(value);
      value = validateName(value);
    }

    setRegisterData((prev) => ({ ...prev, [name]: value }));

    return value;
  };

  const handleOtp = (e) => {
    let value = e.target.value;
    if (value !== "") {
      validateOtpError(value);
    }
    value = validateOtp(value);

    setOtp(value);
    return value;
  };

  function validateNameError(name) {
    const nameRegex = /^(?!\s)(?=.{1,60}$)[a-zA-Z\s]+$/;
    setNameError(!nameRegex.test(name));
  }
  function validateEmail(email) {
    const emailRegex =
      /^(?=.{1,50}$)[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    setEmailError(!emailRegex.test(email));
  }

  function validateMobileNo(number) {
    const mobileRegex = /^[0-9]{6,12}$/;
    setMobileNoError(!mobileRegex.test(number));
  }

  function validateOtpError(number) {
    const numberRegex = /^[0-9]{6}$/;
    setOtpError(!numberRegex.test(number));
  }

  const commonTextFieldProps = {
    size: "small",
    sx: {
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#EC9324",
      },
      "& .MuiInputBase-input": {
        fontSize: "14px",
        fontWeight: "100",
      },
      "& .MuiInputLabel-root": {
        fontSize: "14px",
      },
    },
    disabled: otpSend,
    required: true,
  };

  const omitDisabled = (props) => {
    const { disabled, ...rest } = props;
    return rest;
  };

  return (
    <Box id="container">
      <Box id="leftBox">
        <img src={register} alt="register" style={{ overflow: "hidden" }} />
      </Box>
      <Box id="rightBox">
        <img src={logo} alt="logo" />
        <Typography>Register as an expert</Typography>
        <ToastContainer />
        <form
          onSubmit={otpSend ? verifyOtpAndCompleteReg : handleRegisterAndGetOtp}
        >
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              justifyContent: "space-between",
              width: "67%",
              margin: "30px auto",
            }}
          >
            <TextField
              {...commonTextFieldProps}
              select
              label="Mr/Mrs"
              value={registerData.title}
              onChange={(e) => handleInput("title", e.target.value)}
              InputProps={{
                endAdornment: registerData.title && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleInput("title", "")}
                      disabled={otpSend}
                    >
                      <MdClear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                ...commonTextFieldProps.sx,
                "& .MuiInputLabel-root.Mui-focused": {
                  color: registerData.title ? "black" : "#EC9324",
                },
                width: "30%",
              }}
            >
              {["Mr", "Mrs", "Miss", "Dr", "Ms", "Prof"].map((title, i) => (
                <MenuItem key={i} value={title}>
                  {title}.
                </MenuItem>
              ))}
            </TextField>

            <TextField
              {...commonTextFieldProps}
              label="Name"
              value={registerData.name}
              onChange={(e) => handleInput("name", e.target.value)}
              sx={{
                ...commonTextFieldProps.sx,
                "& .MuiInputLabel-root.Mui-focused": {
                  color: registerData.name ? "black" : "#EC9324",
                },
                width: "65%",
              }}
              error={nameError}
              helperText={
                nameError && (
                  <Box
                    sx={{ display: "flex", alignItems: "center", color: "red" }}
                  >
                    <ErrorOutlineOutlinedIcon
                      sx={{ fontSize: "15px", marginRight: "4px" }}
                    />
                    enter correct name
                  </Box>
                )
              }
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: "10px",
              justifyContent: "space-between",
              width: "67%",
              margin: "30px auto",
            }}
          >
            <TextField
              {...commonTextFieldProps}
              select
              label="ISD"
              value={registerData.countryCode}
              onChange={(e) => handleInput("countryCode", e.target.value)}
              SelectProps={{
                MenuProps: {
                  sx: {
                    "& .MuiPaper-root": {
                      position: "absolute",
                      left: 0,
                      transform: "translateY(10px) translateX(0px)",
                      width: "10%",
                      height: "40vh",
                      zIndex: 1300,
                    },
                  },
                },
                renderValue: (selected) => {
                  const selectedCountry = countryIsd.find(
                    (country) => country.code === selected
                  );
                  return selectedCountry ? `${selectedCountry.code}` : "";
                },
              }}
              InputProps={{
                endAdornment: registerData.countryCode && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleInput("countryCode", "")}
                      disabled={otpSend}
                    >
                      <MdClear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                ...commonTextFieldProps.sx,
                "& .MuiInputLabel-root.Mui-focused": {
                  color: registerData.countryCode ? "black" : "#EC9324",
                },
                width: "30%",
                "& .MuiSelect-select": {
                  paddingRight: registerData.countryCode ? "32px" : "16px",
                },
              }}
            >
              {countryIsd &&
                countryIsd.map((country, i) => (
                  <MenuItem key={i} value={country.code}>
                    {`${country.name} (${country.code})`}
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              {...commonTextFieldProps}
              label="Mobile Number"
              value={registerData.mobileNo}
              onChange={(e) => handleInput("mobileNo", e.target.value)}
              sx={{
                ...commonTextFieldProps.sx,
                "& .MuiInputLabel-root.Mui-focused": {
                  color: registerData.mobileNo ? "black" : "#EC9324",
                },
                width: "65%",
              }}
              error={mobileNoError}
              helperText={
                mobileNoError && (
                  <Box
                    sx={{ display: "flex", alignItems: "center", color: "red" }}
                  >
                    <ErrorOutlineOutlinedIcon
                      sx={{ fontSize: "15px", marginRight: "4px" }}
                    />
                    enter correct mobile number between 6-12 digit
                  </Box>
                )
              }
            />
          </Box>

          <Box sx={{ width: "67%", margin: "30px auto" }}>
            <TextField
              {...commonTextFieldProps}
              label="Email ID"
              value={registerData.email}
              onChange={(e) => handleInput("email", e.target.value)}
              sx={{
                ...commonTextFieldProps.sx,
                "& .MuiInputLabel-root.Mui-focused": {
                  color: registerData.email ? "black" : "#EC9324",
                },
                width: "100%",
              }}
              error={emailError}
              helperText={
                emailError && (
                  <Box
                    sx={{ display: "flex", alignItems: "center", color: "red" }}
                  >
                    <ErrorOutlineOutlinedIcon
                      sx={{ fontSize: "15px", marginRight: "4px" }}
                    />
                    enter correct email address
                  </Box>
                )
              }
            />
          </Box>

          {otpSend && (
            <Box sx={{ width: "67%", margin: "30px auto" }}>
              <TextField
                {...omitDisabled(commonTextFieldProps)}
                label="OTP"
                type="number"
                value={otp}
                inputRef={otpRef}
                onChange={handleOtp}
                sx={{
                  ...commonTextFieldProps.sx,
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: otp ? "black" : "#EC9324",
                  },
                  width: "100%",
                }}
                error={otpError}
                helperText={
                  otpError && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "red",
                      }}
                    >
                      <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "15px", marginRight: "4px" }}
                      />
                      OTP should be 6 digit
                    </Box>
                  )
                }
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                {resendDisabled ? (
                  <Typography sx={{ color: "gray", marginLeft: "55%" }}>
                    Resend OTP in {formatTime(timer)}
                  </Typography>
                ) : (
                  <Button
                    size="small"
                    onClick={handleResendOtp}
                    sx={{
                      textTransform: "none",
                      fontSize: "15px",
                      fontWeight: "500",
                      marginLeft: "80%",
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                      color: "gray",
                    }}
                  >
                    Resend OTP
                  </Button>
                )}
              </Box>
            </Box>
          )}

          <Box sx={{ width: "67%", margin: "20px auto" }}>
            <LoadingButton
              variant="contained"
              sx={{
                width: "100%",
                backgroundColor: "#EC9324",
                color: "white",
                height: "35px",
                borderRadius: 20,
                fontSize: "14px",
                fontWeight: "400",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#EC9324",
                },
                "&.MuiLoadingButton-loading": {
                  backgroundColor: "#EC9324",
                },
                "&.MuiLoadingButton-loading .MuiCircularProgress-root": {
                  color: "white",
                },
              }}
              type="submit"
              loading={loading}
              // loadingIndicator="Loading Response..."
              disabled={nameError || mobileNoError || emailError || otpError}
            >
              {otpSend ? "Submit OTP" : "Get OTP on email"}
            </LoadingButton>
          </Box>
        </form>
        <Typography>
          Already have an account ?
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => {
              setOpen(true);
            }}
          >
            {" "}
            Sign In
          </span>
        </Typography>

        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
            Login page is under development!!!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Registration;

export const validateEmailLowerCase = (value) =>
  value.trimStart().toLowerCase().replace(" ", "");

export const validateMobileNumber = (value) => value.replace(/[^0-9]/g, "");

export const validateName = (value) =>
  value
    .trimStart()
    .replace(/[^a-zA-Z\s]/g, "")
    .replace("  ", " ");

export const validateOtp = (value) => value.replace(/[^0-9]/g, "");
