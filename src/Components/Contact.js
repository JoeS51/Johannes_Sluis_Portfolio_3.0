import React from 'react';
import styled from 'styled-components';

const Contact = () => {
  return (
    <StyledWrapper>
      <div className="card">
        {/* GitHub */}
        <a
          className="socialContainer containerGithub"
          href="https://github.com/JoeS51"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="socialSvg githubSvg"
          >
            <path d="M12 0a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.57v-2.16c-3.34.73-4.04-1.42-4.04-1.42a3.18 3.18 0 0 0-1.34-1.77c-1.1-.75.09-.73.09-.73a2.51 2.51 0 0 1 1.82 1.22 2.56 2.56 0 0 0 3.5 1 2.56 2.56 0 0 1 .77-1.61c-2.67-.31-5.47-1.34-5.47-5.93a4.66 4.66 0 0 1 1.25-3.24 4.31 4.31 0 0 1 .12-3.2s1-.31 3.26 1.24a11.31 11.31 0 0 1 5.93 0c2.3-1.56 3.25-1.24 3.25-1.24a4.31 4.31 0 0 1 .12 3.2 4.66 4.66 0 0 1 1.25 3.24c0 4.6-2.81 5.61-5.48 5.92a2.88 2.88 0 0 1 .82 2.23v3.31c0 .31.22.69.82.57A12 12 0 0 0 12 0Z" />
          </svg>
        </a>
        {/* LinkedIn */}
        <a
          className="socialContainer containerLinkedin"
          href="https://www.linkedin.com/in/joesluis/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 448 512" className="socialSvg linkdinSvg">
            <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
          </svg>
        </a>
        {/* Email */}
        <a
          className="socialContainer containerEmail"
          href="mailto:jsluis@cs.washington.edu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            className="socialSvg emailSvg"
          >
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-.5a.5.5 0 0 0-.5.5v.217L8 8l6.5-3.283V4a.5.5 0 0 0-.5-.5H2zM8 9L1.5 5.783V12.5a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V5.783L8 9z" />
          </svg>
        </a>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  .card {
    width: fit-content;
    height: fit-content;
    background-color: transparent; 
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    gap: 15px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }

  .socialContainer {
    width: 40px;
    height: 40px;
    background-color: rgb(44, 44, 44);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .socialSvg {
    width: 20px;
    height: 20px;
    fill: white;
    transition: fill 0.3s ease;
  }

.containerGithub:hover {
    background-color: #2ea44f;  /* GitHub green color */
  }

  .containerGithub:hover .githubSvg {
    fill: #f5f5f5;
  }

  /* LinkedIn hover styles */
  .containerLinkedin:hover {
    background-color: #0072b1;
  }
  .containerLinkedin:hover .linkedinSvg {
    fill: #f5f5f5;
  }

  /* Email hover styles */
  .containerEmail:hover {
    background-color: #d93025;
  }
  .containerEmail:hover .emailSvg {
    fill: #f5f5f5;
  }
`;

export default Contact;