import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Stack, Button, IconButton,
  Paper, MenuItem, MenuList, LinearProgress, Snackbar, Alert, Fade,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SchoolIcon from '@mui/icons-material/School';
import ClearIcon from '@mui/icons-material/Clear';
import ReactJson from 'react-json-view';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import {
  addPlayer, removePlayer, SPECTATOR_USER, useGameState,
} from '../data';

function GameManager() {
  const [editMode, setEditMode] = useState(false);
  const openPlayerTab = (player) => {
    window.open(`/player/${player.id}`, '_blank').focus();
  };

  const [gameState, updateGameState, refreshGameState, loading] = useGameState();
  const [editingJSON, setEditingJSON] = useState('');
  const [recentErrorMsg, setRecentErrorMsg] = useState(null);
  const { players = [] } = gameState || {};

  let playerTitle = 'No Players!';
  if (players.length === 1) {
    playerTitle = '1 Player';
  } else if (players.length > 1) {
    playerTitle = `${players.length} Players`;
  }

  const onClickEdit = async () => {
    if (editMode) {
      try {
        JSON.parse(editingJSON);
      } catch (error) {
        setRecentErrorMsg('ERROR: Improper JSON');
        return;
      }

      try {
        await updateGameState(editingJSON);
        setEditMode(!editMode);
      } catch (error) {
        setRecentErrorMsg(`ERROR: ${error.response.data.message}`);
      }
    } else {
      setEditMode(!editMode);
    }
  };

  useEffect(() => {
    setEditingJSON(JSON.stringify(gameState, null, 2));
  }, [gameState]);

  return (
    <Stack height="100%">
      <AppBar position="relative">
        <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
          <Typography color="text.primary">
            Current Game State
          </Typography>
          <Stack spacing={1} direction="row">
            <IconButton size="small" href="https://docs.urturn.app/" target="_blank" rel="noopener">
              <SchoolIcon />
            </IconButton>
            {!editMode && (
            <Button
              size="small"
              variant="outlined"
              color="warning"
              onClick={() => {
                refreshGameState().catch((error) => {
                  setRecentErrorMsg(`ERROR: ${error.response.data.message}`);
                });
              }}
            >
              Restart
            </Button>
            )}
            {editMode
            && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => {
                setEditingJSON(JSON.stringify(gameState, null, 2));
                setEditMode(false);
              }}
            >
              Cancel
            </Button>
            )}
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={onClickEdit}
            >
              { editMode ? 'Save' : 'Edit State' }
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={async () => {
                try {
                  const player = await addPlayer();
                  openPlayerTab(player);
                } catch (err) {
                  let errorMsg = 'Unknown Error Happened';
                  if (
                    axios.isAxiosError(err) && (err.response != null)
                  ) {
                    const data = err.response?.data;
                    if (data?.name === 'CreatorError') {
                      errorMsg = data?.creatorError.message;
                    } else {
                      errorMsg = data?.message;
                    }
                  }
                  setRecentErrorMsg(errorMsg);
                }
              }}
            >
              Add Player
            </Button>
          </Stack>
        </Toolbar>
        {loading && <LinearProgress position="relative" />}
      </AppBar>
      <Stack direction="row" spacing={1} sx={{ minHeight: 0, flexGrow: 1 }}>
        <Stack
          sx={{ padding: 1, flexGrow: 1, minWidth: 0 }}
          direction="row"
          spacing={1}
        >
          <Paper sx={{
            padding: 1,
            flexGrow: 1,
            overflow: 'auto',
          }}
          >
            {!loading && (editMode
              ? (
                <Editor
                  onChange={(jsonStr) => setEditingJSON(jsonStr)}
                  height="100%"
                  defaultLanguage="json"
                  defaultValue={editingJSON}
                  theme="vs-dark"
                />
              )
              : (
                <ReactJson
                  name={false}
                  theme="twilight"
                  src={gameState}
                />
              ))}
          </Paper>
          <Paper sx={{
            padding: 1,
            minWidth: '120px',
            overflow: 'auto',
          }}
          >
            <Stack>
              <Stack alignItems="center">
                <Typography color="text.primary" sx={{ fontWeight: 'bold' }}>
                  {playerTitle}
                </Typography>
                <MenuList
                  id="basic-menu"
                  open
                  variant="selectedMenu"
                >
                  {players.map((player) => (
                    <MenuItem
                      key={player.id}
                      onClick={() => {
                        openPlayerTab(player);
                      }}
                    >
                      <Typography
                        color="text.primary"
                      >
                        {player.username}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={async (e) => {
                          e.stopPropagation();
                          await removePlayer(player);
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </MenuItem>
                  ))}
                  <MenuItem
                    key={SPECTATOR_USER.id}
                    onClick={() => {
                      openPlayerTab(SPECTATOR_USER);
                    }}
                  >
                    <Typography
                      color="text.primary"
                      marginRight={1}
                    >
                      Spectate
                    </Typography>
                    <VisibilityIcon />
                  </MenuItem>
                </MenuList>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
      <Snackbar
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={recentErrorMsg != null}
        TransitionComponent={Fade}
      >
        <Alert
          severity="error"
          sx={{ width: '100%' }}
          onClose={() => {
            setRecentErrorMsg(null);
          }}
        >
          {recentErrorMsg}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default GameManager;
