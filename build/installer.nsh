; Custom NSIS installer script for Desktop Router

; Add custom installation messages
!macro customHeader
  !system "echo 'Building Desktop Router installer...'"
!macroend

; Add custom installation steps
!macro customInit
  ; Check for existing installation
  ReadRegStr $R0 HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "UninstallString"
  StrCmp $R0 "" done

  ; Ask user if they want to uninstall existing version
  MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION \
  "Desktop Router is already installed. $\n$\nClick `OK` to remove the \
  previous version or `Cancel` to cancel this upgrade." \
  IDOK uninst
  Abort

  ; Run the uninstaller
  uninst:
    ClearErrors
    Exec $R0
  done:
!macroend

; Add to start menu and desktop
!macro customInstall
  ; Create start menu entry
  CreateDirectory "$SMPROGRAMS\Desktop Router"
  CreateShortCut "$SMPROGRAMS\Desktop Router\Desktop Router.lnk" "$INSTDIR\Desktop Router.exe"
  CreateShortCut "$SMPROGRAMS\Desktop Router\Uninstall Desktop Router.lnk" "$INSTDIR\Uninstall Desktop Router.exe"
  
  ; Create desktop shortcut
  CreateShortCut "$DESKTOP\Desktop Router.lnk" "$INSTDIR\Desktop Router.exe"
  
  ; Register file associations or protocols if needed
  ; (Add custom file associations here if required)
!macroend

; Cleanup on uninstall
!macro customUnInstall
  ; Remove start menu entries
  Delete "$SMPROGRAMS\Desktop Router\Desktop Router.lnk"
  Delete "$SMPROGRAMS\Desktop Router\Uninstall Desktop Router.lnk"
  RMDir "$SMPROGRAMS\Desktop Router"
  
  ; Remove desktop shortcut
  Delete "$DESKTOP\Desktop Router.lnk"
  
  ; Remove application data (optional - ask user)
  MessageBox MB_YESNO "Do you want to remove all Desktop Router configuration files?" IDNO skip_data
  RMDir /r "$APPDATA\desktop-router"
  skip_data:
!macroend
