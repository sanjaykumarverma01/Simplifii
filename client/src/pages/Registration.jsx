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
const Registration = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [countryIsd, setCountryIsd] = useState([]);
  const [otpSend, setOtpSend] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds

  const [loading, setLoading] = useState(false);

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
      otpRef.current.focus(); // Automatically focus the TextField when otp is true
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

  const handleRegisterAndGetOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:8080/api/user/", {
        ...registerData,
      });
      if (data) {
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

  const verifyOtpAndCompleteReg = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/user/verify-otp",
        {
          ...registerData,
          otp,
        }
      );
      toast.success(data?.message);
      setOtpSend(false);
      setResendDisabled(false);
      navigate("/home");
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} min ${secs} sec`;
  };

  const handleResendOtp = async () => {
    // Reset the timer
    setTimer(600);
    setResendDisabled(true);
    try {
      const { data } = await axios.post("http://localhost:8080/api/user/", {
        ...registerData,
      });
      if (data) {
        toast.success(data?.message);
        setOtpSend(true);
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };

  const handleInput = (name, value) => {
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

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
                      left: 0, // Align dropdown with the left edge of the TextField
                      transform: "translateY(10px) translateX(0px)", // Adjust position as needed
                      width: "10%", // Match dropdown width with TextField
                      height: "40vh",
                      zIndex: 1300, // Ensure dropdown appears above other content
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
                onChange={(e) => setOtp(e.target.value)}
                sx={{
                  ...commonTextFieldProps.sx,
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: otp ? "black" : "#EC9324",
                  },
                  width: "100%",
                }}
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
                  backgroundColor: "#EC9324", // Ensures background color stays the same during loading
                },
              }}
              type="submit"
              loading={loading}
              // loadingIndicator="Loading Response..."
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
