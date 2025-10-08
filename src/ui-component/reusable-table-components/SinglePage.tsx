import { SyntheticEvent } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import MainLayout from "layout/MainLayout";

import AppProfileList from "views/Profile";


type AddLeadProps<T> = {
  handleToggleAddDialog?: (e: SyntheticEvent) => void;
  dialogBody: JSX.Element;
  entityName: string;
  row?: T;
};

const AddLeadPage = <T,>({
  handleToggleAddDialog,
  dialogBody,
  row,
  entityName,
}: AddLeadProps<T>) => {
  return (
    <div style={{ maxWidth: "696px", margin: "auto", padding: "20px" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        {!row ? (
          <Typography variant="h4">Add {entityName}</Typography>
        ) : (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4">Edit {entityName}</Typography>
          </Stack>
        )}
        {handleToggleAddDialog && (
          <IconButton size="small" onClick={handleToggleAddDialog}>
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
      <Divider sx={{ my: 2 }} />
      <div>{dialogBody}</div>
    </div>
  );
};

export default AddLeadPage;
