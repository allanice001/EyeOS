[Setup]
; Compiler-related
  Compression            = lzma
  InternalCompressLevel  = ultra
  OutputBaseFilename     = eyeSync
  OutputDir              = .\
  SolidCompression       = yes
  VersionInfoVersion     = 1.9.0.0
; Installer-related
  ; Functional
    AllowNoIcons           = yes
    AppContact             = team@eyeos.org
    AppId                  = {{C408DE4C-BE24-4563-89A3-F1BE4D07DDC6}
    AppName                = eyeSync
    AppPublisher           = eyeos Team
    AppPublisherURL        = http://eyeos.org/sync
    AppSupportURL          = http://eyeos.org/sync
    AppUpdatesURL          = http://eyeos.org/sync
    AppVersion             = 1.9.0.0
    AppVerName             = eyeSync 1.9
    DefaultDirName         = {pf}\eyeSync
    DefaultGroupName       = eyeSync
    LicenseFile            = license.txt
    UninstallDisplayIcon   = {app}\eyeSync.exe
  ; Cosmetic
    AppCopyright           = Copyright © 2008-2009 Marvin W.
    SetupIconFile          = icon.ico

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "files\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs

[Icons]
Name: "{group}\eyeSync";                       Filename: "{app}\eyeSync.exe"
Name: "{group}\{cm:UninstallProgram,eyeSync}"; Filename: "{uninstallexe}"
Name: "{commondesktop}\eyeSync";               Filename: "{app}\eyeSync.exe"; Tasks: desktopicon

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "german";  MessagesFile: "compiler:Languages\German.isl"

[Run]
Filename: "{app}\eyeSync.exe"; Description: "{cm:LaunchProgram,eyeSync}"; Flags: nowait postinstall skipifsilent




