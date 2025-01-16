import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { getApiSettings, setApiSettings, clearAllStorage } from "../utils/storage";
import { API_PROVIDERS, ApiSettings } from "@src/types";
import { useApp } from "@src/store/AppContext";
import SettingEditor from "./SettingEditor";

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const [settings, setSettings] = useState<ApiSettings[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<
    ApiSettings | undefined
  >();
  const { setError, setSuccess } = useApp();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await getApiSettings();
      
      setSettings(savedSettings);
    } catch (error) {
      setError("Failed to load settings");
    }
  };

  const handleEdit = (setting: ApiSettings) => {
    setEditingSetting(setting);
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingSetting(undefined);
    setEditDialogOpen(true);
  };

  const handleDelete = async (settingToDelete: ApiSettings) => {
    try {
      const newSettings = settings.filter(
        (s) =>
          s.name !== settingToDelete.name ||
          s.provider !== settingToDelete.provider
      );
      await setApiSettings(newSettings);
      setSettings(newSettings);
      setSuccess("Setting deleted successfully");
    } catch (error) {
      setError("Failed to delete setting");
    }
  };

  const handleSaveSetting = async (newSetting: ApiSettings) => {
    try {
      let newSettings: ApiSettings[];
      if (editingSetting) {
        // Edit existing setting
        newSettings = settings.map((s) =>
          s.name === editingSetting.name &&
          s.provider === editingSetting.provider
            ? newSetting
            : s
        );
      } else {
        // Add new setting
        if (settings.some((s) => s.name === newSetting.name)) {
          setError("A setting with this name already exists");
          return;
        }
        newSettings = [...settings, newSetting];
      }

      await setApiSettings(newSettings);
      setSettings(newSettings);
      setSuccess(
        editingSetting
          ? "Setting updated successfully"
          : "Setting added successfully"
      );
    } catch (error) {
      setError("Failed to save setting");
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllStorage();
      setSettings([]);
      setSuccess("All settings and cache cleared successfully");
      window.location.reload();
    } catch (error) {
      setError("Failed to clear settings");
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgcolor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
        }}
        onClick={onClose}
      />

      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "500px",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
          zIndex: 1000,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">API Settings</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteForeverIcon />}
              onClick={handleClearAll}
              sx={{ mr: 2 }}
            >
              Clear All
            </Button>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <List sx={{ width: "100%" }}>
          {settings.map((setting) => (
            <ListItem
              key={`${setting.provider}-${setting.name}`}
              secondaryAction={
                <Box>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEdit(setting)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(setting)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={setting.name}
                secondary={
                  API_PROVIDERS.find((p) => p.value === setting.provider)
                    ?.label || setting.provider
                }
              />
            </ListItem>
          ))}
          <ListItem
            sx={{
              justifyContent: "center",
              mt: 2,
            }}
          >
            <IconButton
              color="primary"
              aria-label="add api setting"
              onClick={handleAdd}
            >
              <AddIcon />
            </IconButton>
          </ListItem>
        </List>

        <SettingEditor
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          setting={editingSetting}
          onSave={handleSaveSetting}
        />
      </Box>
    </>
  );
}
