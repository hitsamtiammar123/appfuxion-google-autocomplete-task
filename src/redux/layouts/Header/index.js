import React from 'react';
import { Grid, TextField, Button } from '@mui/material';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import './styles.scss';

export default function Header({ onIconButtonClick, inputRef }) {
  return (
    <Grid className="map-input-container" container item direction="row">
      <TextField
        variant="standard"
        className="map-input-field"
        inputRef={inputRef}
        label="Search data"
      />
      <Button onClick={onIconButtonClick} className="drawer-button" variant="outlined">
        <FmdGoodIcon />
      </Button>
    </Grid>
  );
}
