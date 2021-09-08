import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";

import { Button } from "../../../../components/buttons/button";
import { InputToggle } from "../../../../components/inputToggle/inputToggle";
import { LoadingIcon } from "../../../../components/loadingIcon/loadingIcon";
import { ProfilePageSection } from "../profilePageSection/profilePageSection";

import { AppContext } from "../../../../components/app/contexts/appContext";
import { ProfilePageContext } from "../../profilePage";

import { ProfileSettingsService } from "../../../../services/profileSettingsService";

import { IProfileEmailSettings } from "../../../../../stroll-models/profileSettings";

import { ProfileSettingsID } from "../../../../../stroll-enums/profileSettingsID";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface EmailNotificationSettingsSectionProps {  
  
}

export const EmailNotificationSettingsSection: React.FC<EmailNotificationSettingsSectionProps> = (props: EmailNotificationSettingsSectionProps) => {  
  const { user } = useContext(AppContext).appState,
    { state, setState } = useContext(ProfilePageContext);

  const { settings, statuses } = state;

  const [emailSettings, setEmailSettingsTo] = useState<IProfileEmailSettings>(settings.email),
    [hasChanged, setHasChangedTo] = useState<boolean>(false);

  const updateSavingStatus = (status: RequestStatus): void => {
    setState({ ...state, statuses: { ...state.statuses, savingSettings: status }});
  }

  useEffect(() => {
    const isChange: boolean = (
      emailSettings.onGameStarted !== settings.email.onGameStarted ||
      emailSettings.onGameDayCompleted !== settings.email.onGameDayCompleted
    );

    if(isChange !== hasChanged) {
      setHasChangedTo(isChange);
    }
  }, [emailSettings, hasChanged]);

  useEffect(() => {
    setEmailSettingsTo(settings.email);

    setHasChangedTo(false);
    
    updateSavingStatus(RequestStatus.Idle);
  }, [settings.email]);

  const save = async (): Promise<void> => {
    if(statuses.savingSettings !== RequestStatus.Loading) {
      try {
        updateSavingStatus(RequestStatus.Loading);

        await ProfileSettingsService.update(user.profile.uid, ProfileSettingsID.Email, emailSettings);
        
        setState({ 
          ...state, 
          settings: { ...state.settings, email: emailSettings },
          statuses: { ...state.statuses, savingSettings: RequestStatus.Success }
        });
      } catch (err) {
        console.error(err);

        updateSavingStatus(RequestStatus.Error);
      }
    }
  }

  const updateEmailSetting = (updates: any): void => {
    setEmailSettingsTo({ ...emailSettings, ...updates });
  }

  const getContent = (): JSX.Element => {
    if(statuses.loadingSettings === RequestStatus.Success) {
      const getSaveButton = (): JSX.Element => {        
        if(hasChanged) {
          const getButtonContent = (): JSX.Element => {
            if(statuses.savingSettings !== RequestStatus.Loading) {
              return (
                <h1 className="passion-one-font">Save</h1>
              )
            }

            return (
              <i className="fal fa-spinner-third" />
            )
          }

          return (
            <Button
              className={classNames("action-button fancy-button", { loading: statuses.savingSettings === RequestStatus.Loading })}
              disabled={statuses.savingSettings === RequestStatus.Loading}
              handleOnClick={save} 
            >        
              {getButtonContent()}
            </Button>
          )
        }
      }

      return (
        <React.Fragment>          
          <InputToggle
            className="game-started-email-notification-setting-toggle"   
            disabled={statuses.savingSettings === RequestStatus.Loading}
            label="Game Started"
            toggled={emailSettings.onGameStarted}
            toggle={() => updateEmailSetting({ onGameStarted: !emailSettings.onGameStarted})}
          />
          <InputToggle
            className="game-day-complete-started-email-notification-setting-toggle"   
            disabled={statuses.savingSettings === RequestStatus.Loading}
            label="Game Day Completed"
            toggled={emailSettings.onGameDayCompleted}
            toggle={() => updateEmailSetting({ onGameDayCompleted: !emailSettings.onGameDayCompleted})}
          />
          {getSaveButton()}
        </React.Fragment>
      )
    }
  }

  const getLoadingIcon = (): JSX.Element => {
    if(state.statuses.loadingSettings === RequestStatus.Loading) {
      return (        
        <LoadingIcon />
      )
    }
  }

  return (
    <ProfilePageSection className="email-notification-settings-section" icon="far fa-bell" title="Email Notifications">
      {getContent()}
      {getLoadingIcon()}
    </ProfilePageSection>
  );
}