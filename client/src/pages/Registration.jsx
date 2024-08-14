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
} from "@mui/material";
import { MdClear } from "react-icons/md";
import LoadingButton from "@mui/lab/LoadingButton";
// import { useNavigate } from "react-router-dom";

const Registration = () => {
  // const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [nameTitle, setNameTitle] = useState("");
  const [isd, setIsd] = useState("");
  const [otpSend, setOtpSend] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const otpRef = useRef(null);

  const [registerData, setRegisterData] = useState({
    name: "Sanjay",
    email: "vermasanjaykumar97@gmail.com",
    mobileNo: "8169863919",
  });

  useEffect(() => {
    if (otpSend) {
      otpRef.current.focus(); // Automatically focus the TextField when otp is true
    }
  }, [otpSend]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setOtpSend(true);
      setLoading(false);
    }, 5000);
  };

  const handleSubmitOtp = (e) => {
    e.preventDefault();
    console.log("OTP submitted:", otp);
  };

  const handleInput = (name, value) => {
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const clearField = (setFunction) => () => setFunction("");

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

        <form onSubmit={otpSend ? handleSubmitOtp : handleRegister}>
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
              value={nameTitle}
              onChange={(e) => setNameTitle(e.target.value)}
              InputProps={{
                endAdornment: nameTitle && (
                  <InputAdornment position="end">
                    <IconButton onClick={clearField(setNameTitle)}>
                      <MdClear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                ...commonTextFieldProps.sx,
                "& .MuiInputLabel-root.Mui-focused": {
                  color: nameTitle ? "black" : "#EC9324",
                },
                width: "30%",
              }}
            >
              {["Mr", "Mrs", "Miss", "Dr", "Ms", "Prof"].map((title) => (
                <MenuItem key={title} value={title}>
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
              value={isd}
              onChange={(e) => setIsd(e.target.value)}
              InputProps={{
                endAdornment: isd && (
                  <InputAdornment position="end">
                    <IconButton onClick={clearField(setIsd)}>
                      <MdClear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                ...commonTextFieldProps.sx,
                "& .MuiInputLabel-root.Mui-focused": {
                  color: isd ? "black" : "#EC9324",
                },
                width: "30%",
              }}
            >
              {/* Replace these with actual ISD codes */}
              <MenuItem value="Mr">Mr.</MenuItem>
              <MenuItem value="Mrs">Mrs.</MenuItem>
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
            </Box>
          )}

          <Box sx={{ width: "67%", margin: "30px auto" }}>
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
          anchorOrigin={{ vertical: "center", horizontal: "center" }} // Position of the toast
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
