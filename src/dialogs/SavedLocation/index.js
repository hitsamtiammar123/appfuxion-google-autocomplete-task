import React from 'react';
import {
  Grid,
  Button,
  Dialog,
  DialogContentText,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import './styles.scss';

export default function SavedLocation({
  isShowDialog,
  savedPlaces,
  onCloseItemButtonClicked,
  onItemClicked,
  onClose,
}) {
  return (
    <Dialog maxWidth="sm" open={isShowDialog} onClose={onClose}>
      <DialogTitle>Saved Locations</DialogTitle>
      <DialogContent>
        <Grid className="list-container" container justifyContent="center">
          <List>
            {savedPlaces.length ? (
              savedPlaces.map((item) => (
                <ListItem key={item.id}>
                  <Button onClick={() => onCloseItemButtonClicked(item)} className="error-btn">
                    <CloseOutlinedIcon color="error" />
                  </Button>
                  <ListItemButton onClick={() => onItemClicked(item)}>
                    <ListItemText className="mr">{item.formatted_address}</ListItemText>
                    <ArrowForwardOutlinedIcon />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Grid container justifyContent="center">
                <DialogContentText>You haven't saved any places</DialogContentText>
              </Grid>
            )}
          </List>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
