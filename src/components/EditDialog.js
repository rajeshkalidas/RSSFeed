import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useState } from 'react';

export default function EditDialog(props) {
    const [selectedObj, setSelectedObj] = useState(props.feed)

    /**
    * updateFeeds
    * To change handler for RSS feed link
    */
    const onTextInputChange = (event) => {
        const updateInput = event.target.value;
        const updateFeed = { ...props.feed.item, link: updateInput };
        setSelectedObj({ ...selectedObj, item: updateFeed });
    }

    return (
        <div>
            <Dialog open aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update URL</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To change the url link, please enter your updated link here. We will send updates.
                </DialogContentText>
                    <TextField
                        autoFocus
                        value={selectedObj.item.link}
                        onChange={onTextInputChange}
                        multiline
                        rowsMax={4}
                        fullWidth
                        helperText={selectedObj.item.link === "" ? 'Incorrect entry.' : ' '}
                        error={selectedObj.item.link === ""}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="primary" disabled={!(selectedObj.item.link)} onClick={() => props.onSubmitClickHandler(selectedObj)}>
                        Submit
            </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
