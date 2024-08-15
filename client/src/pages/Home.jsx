import React from "react";
import { Box, Button, Link, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";


const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f0f4f7",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 50, color: "#4caf50" }} />
        <Typography
          variant="h4"
          sx={{ marginTop: "1rem", marginBottom: "1rem" }}
        >
          Thank you!
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
          Successfully implemented the OTP logic in the backend. Once the OTP is
          verified, the user data is stored in the database, and the temporary
          OTP data is deleted from the database.
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "2rem" }}>
          Tech Stack <br />
          Frontend:React, Mui, Css, JavaScript,
          <br />
          Backend: Node, Express, <br /> Database: MongDb,
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <Link
            href="https://www.linkedin.com/in/sanjaykumar-verma-a73349219/"
            target="_blank"
          >
            <LinkedInIcon
              sx={{ fontSize: 30, cursor: "pointer", color: "#0077b5" }}
            />
          </Link>

          <Link href="https://github.com/sanjaykumarverma01" target="_blank">
            <GitHubIcon
              sx={{ fontSize: 30, cursor: "pointer", color: "black" }}
            />
          </Link>
        </Box>

        <Button variant="contained" color="success">
          <Link
            href="https://sanjaykumarverma01.github.io/"
            sx={{ color: "white", textDecoration: "none" }}
            target="_blank"
          >
            My Portfolio
          </Link>
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
