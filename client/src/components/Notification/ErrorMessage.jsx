import React from 'react';
import {ToastContainer} from "react-toastify";
import styles from "./ErrorMessage.module.scss"

const ErrorMessage = () => {
  return (
      <ToastContainer
          hideProgressBar
          closeButton={false}
          toastClassName={styles.errorMessageToast}
          bodyClassName={styles.errorMessageBody}
          position={"top-left"}
          limit={3}
      />
  );
};

export default ErrorMessage;