import { forwardRef } from "react";

import { useApiNotify } from "../../hooks/apiNotify";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ApiNotify() {
  const { removeNotification, notificationMessage, severity } = useApiNotify();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    removeNotification();
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={!!notificationMessage}
        autoHideDuration={7000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={severity}  sx={{ width: "100%" }}>
          {notificationMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
